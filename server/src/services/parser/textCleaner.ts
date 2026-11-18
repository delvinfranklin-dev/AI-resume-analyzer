export function cleanText(rawText: string): string {
  if (!rawText) return '';

  return (
    rawText
      // Replace non-breaking spaces and other Unicode spaces with standard space
      .replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000]/g, ' ')
      // Normalize bullet characters
      .replace(/[•●▪■◦‣⁃►]/g, '\n- ')
      // Fix broken hyphenations at line breaks (e.g. "com- \nputer" -> "computer")
      .replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2')
      // Normalize multiple carriage returns and line feeds
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove excessive spaces within a line
      .replace(/[ \t]+/g, ' ')
      // Collapse 3 or more consecutive newlines into 2
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}
