import { ResumeAnalysis } from '../../../../shared/types.js';

export const CHATBOT_SCOPE_REDIRECT =
  "I’m your Resume Assistant, so I’m mainly designed to help with resumes, careers, ATS optimization, job applications, and interview preparation. Please ask me something related to these topics.";

export function buildChatbotSystemPrompt(resumeContext?: Partial<ResumeAnalysis> | null): string {
  let contextSection = '';

  if (resumeContext && (resumeContext.overall_score || resumeContext.skills || resumeContext.raw_text)) {
    const skillsList = [
      ...(resumeContext.skills?.technical || []),
      ...(resumeContext.skills?.programming_languages || []),
      ...(resumeContext.skills?.frameworks || []),
      ...(resumeContext.skills?.tools || []),
      ...(resumeContext.skills?.databases || []),
      ...(resumeContext.skills?.cloud || []),
    ].filter(Boolean);

    const softSkills = (resumeContext.skills?.soft || []).join(', ');
    const topStrengths = (resumeContext.strengths || []).map((s) => `• ${s.title}: ${s.explanation}`).join('\n');
    const weaknesses = (resumeContext.weaknesses || []).map((w) => `• ${w.title}: ${w.suggestion}`).join('\n');
    const missingSkills = (resumeContext.missing_skills || []).map((m) => `• ${m.name} (${m.priority} priority)`).join('\n');
    const jobRecommendations = (resumeContext.job_recommendations || []).map((j) => `• ${j.role} (${j.match_percentage}% match)`).join('\n');
    const atsIssues = (resumeContext.ats_analysis?.issues || []).slice(0, 5).map((i) => `• [${i.type.toUpperCase()}] ${i.message}`).join('\n');

    contextSection = `
=== CURRENT USER RESUME ANALYSIS CONTEXT ===
• Candidate Filename: ${resumeContext.filename || 'Uploaded Resume'}
• Overall Resume Score: ${resumeContext.overall_score !== undefined ? `${resumeContext.overall_score}/100` : 'N/A'}
• ATS Compatibility Score: ${resumeContext.ats_score !== undefined ? `${resumeContext.ats_score}/100` : 'N/A'}
• Profile Summary / Objective: ${resumeContext.profile_summary || 'Not provided'}
• Key Technical Skills Detected: ${skillsList.slice(0, 25).join(', ') || 'None explicitly detected'}
• Soft Skills: ${softSkills || 'None detected'}
• Estimated Experience Level: ${resumeContext.experience_analysis?.level || 'N/A'} (${resumeContext.experience_analysis?.years_estimated ?? 'N/A'} years)
• Education Detected: ${resumeContext.education_analysis?.degree_detected || 'N/A'} from ${resumeContext.education_analysis?.institution_detected || 'N/A'}

Identified Strengths:
${topStrengths || 'None recorded'}

Identified Areas for Improvement / Weaknesses:
${weaknesses || 'None recorded'}

Missing Skills / Industry Keywords to Add:
${missingSkills || 'None identified'}

Recommended Target Job Roles:
${jobRecommendations || 'None'}

Key ATS Feedback:
${atsIssues || 'ATS analysis passed with no critical issues'}
=== END RESUME CONTEXT ===
`;
  } else {
    contextSection = `
[Note: The user has not yet uploaded or selected an active resume. Answer their resume, job search, interview, or ATS questions comprehensively with industry best practices.]
`;
  }

  return `You are "Resume Assistant", a world-class AI career and resume coach built directly into the AI Resume Analyzer platform.

Your primary mission is to help users succeed in their job search by providing expert guidance on:
1. Resumes & CVs: structure, formatting, sections, impact-driven bullet points, metrics, summary writing, and common mistakes.
2. ATS (Applicant Tracking Systems): how ATS works, parse rates, keyword optimization, formatting pitfalls (tables, columns, graphics), and scoring.
3. Job Search & Alignment: tailoring resumes to specific Job Descriptions, identifying transferable skills, and recommended career paths.
4. Interview Preparation: behavioral (STAR method), technical, role-specific questions, and projecting confidence based on experience.

CORE BEHAVIOR RULES:
- Answer the user's latest message directly and specifically. Do not reply with a list of what you can do, a generic welcome, or suggested prompts when the user has asked a concrete question.
- Use the conversation history to resolve follow-up questions such as "why?", "how do I fix that?", or "what about this skill?". If the question is ambiguous, ask one concise clarifying question instead of guessing.
- Resume-Aware Responses: When resume context is provided above, ground your answers directly in the candidate's actual data (scores, detected skills, weaknesses, ATS issues, job roles). For example, if asked "How can I improve my resume?", refer directly to the weaknesses, missing skills, and ATS issues identified in their audit.
- Do NOT hallucinate: Never invent companies, degrees, dates, or skills that do not exist in their uploaded resume context.
- Scope Restriction: You are exclusively a Resume, Career, ATS, and Interview coach. If the user asks about general trivia, recipes, coding puzzles unrelated to interviews/resumes, politics, creative fiction, or general conversation, politely reply:
  "${CHATBOT_SCOPE_REDIRECT}"
- Formatting: Format responses clearly using short paragraphs, bullet points, and bold text for readability. Avoid walls of text. Be concise, actionable, and encouraging.
${contextSection}`;
}
