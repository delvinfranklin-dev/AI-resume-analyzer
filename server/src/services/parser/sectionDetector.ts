export interface DetectedSections {
  contact?: string;
  summary?: string;
  objective?: string;
  skills?: string;
  experience?: string;
  education?: string;
  certifications?: string;
  projects?: string;
  achievements?: string;
  languages?: string;
  detectedCount: number;
}

const SECTION_PATTERNS: Record<string, RegExp> = {
  summary: /^(professional\s+summary|summary|profile|about\s+me|executive\s+summary)\b/i,
  objective: /^(career\s+objective|objective)\b/i,
  skills: /^(technical\s+skills|core\s+competencies|skills\s*(&|and)?\s*abilities|skills|areas\s+of\s+expertise)\b/i,
  experience: /^(professional\s+experience|work\s+experience|experience|employment\s+history|work\s+history)\b/i,
  education: /^(education|academic\s+background|academic\s+history|degrees)\b/i,
  projects: /^(projects|personal\s+projects|notable\s+projects|key\s+projects)\b/i,
  certifications: /^(certifications|licenses\s*(&|and)?\s*certifications|credentials)\b/i,
  achievements: /^(achievements|awards|honors|publications)\b/i,
  languages: /^(languages|spoken\s+languages)\b/i,
};

export function detectSections(text: string): DetectedSections {
  const lines = text.split('\n');
  const sections: Record<string, string[]> = {};
  let currentSection = 'contact';
  sections[currentSection] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line looks like a header (short, matching pattern, or capitalized)
    let matchedSection: string | null = null;
    if (trimmed.length < 50) {
      for (const [key, regex] of Object.entries(SECTION_PATTERNS)) {
        if (regex.test(trimmed)) {
          matchedSection = key;
          break;
        }
      }
    }

    if (matchedSection) {
      currentSection = matchedSection;
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
    } else {
      sections[currentSection].push(trimmed);
    }
  }

  const result: DetectedSections = {
    detectedCount: 0,
  };

  for (const [secKey, contentLines] of Object.entries(sections)) {
    if (contentLines.length > 0) {
      (result as any)[secKey] = contentLines.join('\n');
      if (secKey !== 'contact') {
        result.detectedCount += 1;
      }
    }
  }

  return result;
}
