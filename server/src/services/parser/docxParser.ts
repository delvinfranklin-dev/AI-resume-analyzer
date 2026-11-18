import mammoth from 'mammoth';

export async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  } catch (err: any) {
    throw new Error(`Failed to extract text from DOCX: ${err.message}`);
  }
}
