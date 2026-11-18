import pdfParse from 'pdf-parse';
import zlib from 'zlib';

export async function parsePdf(buffer: Buffer): Promise<string> {
  // Tier 1: Try modern pdf.js engine in pdf-parse (v2.0.550)
  try {
    const data = await pdfParse(buffer, {
      version: 'v2.0.550',
      max: 0,
    });
    const text = (data.text || '').trim();
    if (text.length > 20) {
      return text;
    }
  } catch (err: any) {
    console.warn(`[PDF Parser] Tier 1 (v2.0.550) failed: ${err.message}. Trying Tier 2...`);
  }

  // Tier 2: Try default pdf.js engine in pdf-parse (v1.10.100)
  try {
    const data = await pdfParse(buffer, {
      version: 'default',
      max: 0,
    });
    const text = (data.text || '').trim();
    if (text.length > 20) {
      return text;
    }
  } catch (err: any) {
    console.warn(`[PDF Parser] Tier 2 (default) failed: ${err.message}. Trying Tier 3 (stream decompression)...`);
  }

  // Tier 3: Direct binary stream decompression & text extraction (handles bad XRef & compressed streams)
  try {
    const text = extractTextFromPdfStreams(buffer);
    if (text.length > 20) {
      console.log(`[PDF Parser] Tier 3 stream decompression succeeded (${text.length} chars).`);
      return text;
    }
  } catch (err: any) {
    console.warn(`[PDF Parser] Tier 3 stream extraction failed: ${err.message}`);
  }

  // Tier 4: Printable ASCII/UTF-8 scraper across all decompressed streams and raw buffer
  try {
    const text = scrapePrintableText(buffer);
    if (text.length > 20) {
      console.log(`[PDF Parser] Tier 4 text scraper succeeded (${text.length} chars).`);
      return text;
    }
  } catch (err: any) {
    console.warn(`[PDF Parser] Tier 4 scraper failed: ${err.message}`);
  }

  throw new Error(
    'Could not extract readable text from this PDF. The file may be image-based (scanned) or password protected. ' +
    'Please try uploading a text-based PDF, DOCX, or paste your resume as plain text.'
  );
}

/**
 * Extracts and decompresses all PDF streams (FlateDecode / uncompressed),
 * then parses text operators (BT...ET, Tj, TJ, hex strings).
 */
function extractTextFromPdfStreams(buffer: Buffer): string {
  const streams = extractAllRawStreams(buffer);
  const textChunks: string[] = [];

  for (const streamBuf of streams) {
    const decompressed = decompressStream(streamBuf);
    if (!decompressed) continue;

    // Parse PDF text operators from this decompressed stream
    const extracted = parsePdfTextOperators(decompressed);
    if (extracted.length > 0) {
      textChunks.push(...extracted);
    }
  }

  // If BT...ET didn't catch enough, try extracting words from decompressed streams
  if (textChunks.join(' ').length < 30) {
    for (const streamBuf of streams) {
      const decompressed = decompressStream(streamBuf);
      if (!decompressed) continue;
      const printable = extractPrintableTokens(decompressed);
      if (printable.length > 0) {
        textChunks.push(...printable);
      }
    }
  }

  return cleanAndDeduplicate(textChunks);
}

/**
 * Locates stream ... endstream byte boundaries in raw PDF buffer
 */
function extractAllRawStreams(buffer: Buffer): Buffer[] {
  const streams: Buffer[] = [];
  const streamMarker = Buffer.from('stream');
  const endStreamMarker = Buffer.from('endstream');

  let searchPos = 0;
  while (searchPos < buffer.length) {
    const streamIdx = buffer.indexOf(streamMarker, searchPos);
    if (streamIdx === -1) break;

    let contentStart = streamIdx + 6;
    // Skip line breaks after 'stream' keyword (\r\n or \n or \r)
    if (contentStart < buffer.length && buffer[contentStart] === 0x0d && buffer[contentStart + 1] === 0x0a) {
      contentStart += 2;
    } else if (contentStart < buffer.length && (buffer[contentStart] === 0x0a || buffer[contentStart] === 0x0d)) {
      contentStart += 1;
    }

    const endIdx = buffer.indexOf(endStreamMarker, contentStart);
    if (endIdx === -1) break;

    let contentEnd = endIdx;
    // Trim trailing line breaks before 'endstream'
    if (contentEnd > contentStart && (buffer[contentEnd - 1] === 0x0a || buffer[contentEnd - 1] === 0x0d)) {
      contentEnd -= 1;
      if (contentEnd > contentStart && buffer[contentEnd - 1] === 0x0d) {
        contentEnd -= 1;
      }
    }

    if (contentEnd > contentStart) {
      streams.push(buffer.subarray(contentStart, contentEnd));
    }
    searchPos = endIdx + 9;
  }
  return streams;
}

/**
 * Decompresses stream buffer using zlib (inflate, inflateRaw, unzip) or returns raw latin1 string
 */
function decompressStream(streamBuf: Buffer): string {
  try {
    return zlib.inflateSync(streamBuf).toString('latin1');
  } catch {}

  try {
    return zlib.inflateRawSync(streamBuf).toString('latin1');
  } catch {}

  try {
    return zlib.unzipSync(streamBuf).toString('latin1');
  } catch {}

  return streamBuf.toString('latin1');
}

/**
 * Parses PDF text operators: BT...ET, Tj, TJ, hex strings
 */
function parsePdfTextOperators(content: string): string[] {
  const results: string[] = [];

  const btEtRegex = /BT\s([\s\S]*?)ET/g;
  let match: RegExpExecArray | null;

  while ((match = btEtRegex.exec(content)) !== null) {
    const block = match[1];

    // 1. Tj operators: (text) Tj or (text) ' or (text) "
    const tjRegex = /\(((?:[^()\\]|\\.)*)\)\s*(?:Tj|'|")/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      const decoded = decodePdfString(tjMatch[1]);
      if (decoded.trim()) results.push(decoded);
    }

    // 2. Hex Tj operators: <48656c6c6f> Tj
    const hexTjRegex = /<([0-9a-fA-F\s]+)>\s*(?:Tj|'|")/g;
    let hexMatch;
    while ((hexMatch = hexTjRegex.exec(block)) !== null) {
      const decoded = decodePdfHex(hexMatch[1]);
      if (decoded.trim()) results.push(decoded);
    }

    // 3. TJ array operators: [(text) 10 (text) <hex>] TJ
    const tjArrayRegex = /\[([\s\S]*?)\]\s*TJ/g;
    let arrMatch;
    while ((arrMatch = tjArrayRegex.exec(block)) !== null) {
      const inner = arrMatch[1];
      const parts: string[] = [];

      const itemRegex = /\(((?:[^()\\]|\\.)*)\)|<([0-9a-fA-F\s]+)>/g;
      let itemMatch;
      while ((itemMatch = itemRegex.exec(inner)) !== null) {
        if (itemMatch[1] !== undefined) {
          parts.push(decodePdfString(itemMatch[1]));
        } else if (itemMatch[2] !== undefined) {
          parts.push(decodePdfHex(itemMatch[2]));
        }
      }
      const combined = parts.join(' ').replace(/\s+/g, ' ').trim();
      if (combined) results.push(combined);
    }
  }

  return results;
}

/**
 * Scrapes readable ASCII/UTF-8 tokens from decompressed text
 */
function extractPrintableTokens(content: string): string[] {
  // Find sequences of words/sentences
  const matches = content.match(/[A-Za-z0-9@#%&_.,;:!?'"/\-\\()+=]{2,}(?:\s+[A-Za-z0-9@#%&_.,;:!?'"/\-\\()+=]{1,})*/g);
  if (!matches) return [];

  return matches.filter((s) => {
    const trimmed = s.trim();
    // Exclude PDF operator keywords
    if (['obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref', 'FlateDecode'].includes(trimmed)) {
      return false;
    }
    return trimmed.length >= 3;
  });
}

/**
 * Scrapes printable text across entire buffer
 */
function scrapePrintableText(buffer: Buffer): string {
  const raw = buffer.toString('latin1');
  const tokens = extractPrintableTokens(raw);
  return cleanAndDeduplicate(tokens);
}

function decodePdfString(s: string): string {
  return s
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}

function decodePdfHex(hex: string): string {
  const cleanHex = hex.replace(/\s+/g, '');
  if (cleanHex.length === 0 || cleanHex.length % 2 !== 0) return '';

  if (cleanHex.startsWith('feff') || cleanHex.startsWith('FEFF')) {
    const bytes = Buffer.from(cleanHex.slice(4), 'hex');
    return bytes.toString('utf16be');
  }

  const buf = Buffer.from(cleanHex, 'hex');
  if (buf.length >= 4 && buf[0] === 0 && buf[2] === 0) {
    return buf.toString('utf16be');
  }
  return buf.toString('latin1');
}

function cleanAndDeduplicate(chunks: string[]): string {
  const seen = new Set<string>();
  const uniqueChunks: string[] = [];

  for (const chunk of chunks) {
    const cleaned = chunk.trim();
    if (cleaned && cleaned.length > 1 && !seen.has(cleaned)) {
      seen.add(cleaned);
      uniqueChunks.push(cleaned);
    }
  }

  return uniqueChunks.join('\n');
}
