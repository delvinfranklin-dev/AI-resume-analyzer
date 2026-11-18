import { SYSTEM_PROMPT, buildUserPrompt, buildJobMatchPrompt } from './promptBuilder.js';
import { analyzeResumeHeuristically } from './heuristicEngine.js';


export async function analyzeResumeWithAI(resumeText: string, filename: string) {
  const apiKey = process.env.AI_API_KEY?.trim();
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  const model = process.env.AI_MODEL || (provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini');

  // If no API key configured, use deterministic heuristic engine immediately
  if (!apiKey) {
    console.log('[AI Service] No AI_API_KEY found in environment. Using rule-based heuristic engine.');
    return analyzeResumeHeuristically(resumeText, filename);
  }

  // Truncate very long resumes to stay within context limits (Groq/OpenAI)
  const maxResumeChars = 12000;
  const truncatedText = resumeText.length > maxResumeChars
    ? resumeText.slice(0, maxResumeChars) + '\n\n[Resume truncated for analysis]'
    : resumeText;

  try {
    console.log(`[AI Service] Invoking ${provider} LLM with model ${model}...`);
    let rawJsonResponse = '';

    if (provider === 'gemini') {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${SYSTEM_PROMPT}\n\n${buildUserPrompt(truncatedText, filename)}` }],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as any;
      rawJsonResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      // OpenAI / OpenAI-compatible endpoint (Groq, OpenAI, Together, etc.)
      const baseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
      console.log(`[AI Service] Using base URL: ${baseUrl}, model: ${model}`);
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.1,
          max_tokens: 8000,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: buildUserPrompt(truncatedText, filename) },
          ],
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[AI Service] API error response: ${errorText}`);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as any;
      rawJsonResponse = data?.choices?.[0]?.message?.content || '';
    }

    if (!rawJsonResponse) {
      throw new Error('AI returned an empty response.');
    }

    // Clean JSON response (strip markdown wrappers if present)
    const cleanedJson = rawJsonResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    // Validate essential keys
    if (typeof parsed.overall_score !== 'number' || !parsed.skills) {
      throw new Error('AI response is missing essential schema fields.');
    }

    console.log(`[AI Service] ✅ LLM analysis complete. Score: ${parsed.overall_score}`);
    return parsed;
  } catch (err: any) {
    console.warn(`[AI Service] LLM call failed (${err.message}). Falling back to heuristic engine.`);
    return analyzeResumeHeuristically(resumeText, filename);
  }
}

export async function matchJobWithAI(resumeText: string, jobTitle: string, jobDescription: string) {
  const apiKey = process.env.AI_API_KEY?.trim();
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  const model = process.env.AI_MODEL || (provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini');

  if (apiKey) {
    try {
      console.log(`[Job Matcher] Running AI matching against target job description...`);
      let rawJson = '';

      if (provider === 'gemini') {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: buildJobMatchPrompt(resumeText, jobTitle, jobDescription) }],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const parsed = JSON.parse(rawJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
          return parsed;
        }
      } else {
        const baseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            temperature: 0.1,
            messages: [
              { role: 'system', content: 'You are an expert recruiter. Return strictly valid JSON.' },
              { role: 'user', content: buildJobMatchPrompt(resumeText, jobTitle, jobDescription) },
            ],
            response_format: { type: 'json_object' },
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          rawJson = data?.choices?.[0]?.message?.content || '';
          const parsed = JSON.parse(rawJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
          return parsed;
        }
      }
    } catch (err: any) {
      console.warn(`[Job Matcher] LLM match failed (${err.message}). Using keyword matching fallback.`);
    }
  }

  // Deterministic Job Matching Fallback
  return calculateDeterministicJobMatch(resumeText, jobTitle, jobDescription);
}

function calculateDeterministicJobMatch(resumeText: string, jobTitle: string, jd: string) {
  const jdLower = jd.toLowerCase();
  const resumeLower = resumeText.toLowerCase();

  const commonKeywords = [
    'python', 'typescript', 'javascript', 'react', 'node.js', 'node', 'express', 'sql', 'postgresql',
    'mongodb', 'aws', 'docker', 'kubernetes', 'ci/cd', 'github actions', 'graphql', 'rest api',
    'redis', 'terraform', 'git', 'agile', 'scrum', 'testing', 'cypress', 'jest', 'microservices',
    'machine learning', 'pytorch', 'pandas', 'analytics', 'tableau', 'leadership', 'mentorship'
  ];

  const jdKeywords = commonKeywords.filter((kw) => jdLower.includes(kw));
  const matchingSkills = jdKeywords.filter((kw) => resumeLower.includes(kw));
  const missingSkills = jdKeywords.filter((kw) => !resumeLower.includes(kw));

  const totalTerms = Math.max(1, jdKeywords.length);
  const matchPct = Math.min(95, Math.max(40, Math.round((matchingSkills.length / totalTerms) * 100)));

  return {
    job_title: jobTitle || 'Target Position',
    match_percentage: matchPct,
    summary: `Based on extracted technical competencies, the candidate fulfills approximately ${matchPct}% of explicit requirements identified in this job description.`,
    matching_skills: matchingSkills.map((s) => s.toUpperCase()),
    missing_skills: missingSkills.map((s) => s.toUpperCase()),
    matching_keywords: matchingSkills,
    missing_keywords: missingSkills,
    experience_match: matchPct >= 75 ? 'Strong Seniority & Stack Alignment' : 'Partial Stack Overlap',
    tailored_suggestions: [
      `Prominently feature ${missingSkills.slice(0, 3).map((s) => s.toUpperCase()).join(', ')} in your skills section if you have studied or applied them.`,
      `Incorporate terminology from this job description into your opening professional summary.`,
      `Emphasize project outcomes relevant to ${jobTitle || 'the target role'}.`,
    ],
  };
}
