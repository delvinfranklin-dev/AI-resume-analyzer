import { buildChatbotSystemPrompt, CHATBOT_SCOPE_REDIRECT } from './chatbotPrompts.js';
import { ResumeAnalysis } from '../../../../shared/types.js';

interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateChatbotResponse(
  userMessage: string,
  resumeContext?: Partial<ResumeAnalysis> | null,
  conversationHistory: ConversationTurn[] = []
): Promise<string> {
  const apiKey = process.env.AI_API_KEY?.trim();
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  const model = process.env.AI_MODEL || (provider === 'gemini' ? 'gemini-1.5-flash' : 'llama-3.3-70b-versatile');
  const baseUrl = process.env.AI_BASE_URL || 'https://api.groq.com/openai/v1';

  // Quick client-side scope check for obviously unrelated questions before LLM
  if (isClearlyOffTopic(userMessage)) {
    return CHATBOT_SCOPE_REDIRECT;
  }

  // If no AI key available, use smart local rule-based response generator
  if (!apiKey) {
    console.log('[Chatbot Service] No API key configured. Using local assistant engine.');
    return generateLocalChatbotResponse(userMessage, resumeContext);
  }

  const systemPrompt = buildChatbotSystemPrompt(resumeContext);

  // Take the last 6 turns from history to maintain context without overloading token context
  const recentHistory = conversationHistory.slice(-6).map((turn) => ({
    role: turn.role === 'assistant' ? 'assistant' : 'user',
    content: turn.content,
  }));

  try {
    if (provider === 'gemini') {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const contents = [
        {
          role: 'user',
          parts: [{ text: `SYSTEM INSTRUCTIONS:\n${systemPrompt}` }],
        },
        ...recentHistory.map((h) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        })),
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errText}`);
      }

      const data = (await response.json()) as any;
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) return reply.trim();
    } else {
      // OpenAI-compatible endpoint (Groq, Together, OpenAI)
      const messages = [
        { role: 'system', content: systemPrompt },
        ...recentHistory,
        { role: 'user', content: userMessage },
      ];

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          max_tokens: 1000,
          messages,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error (${response.status}): ${errText}`);
      }

      const data = (await response.json()) as any;
      const reply = data?.choices?.[0]?.message?.content;
      if (reply) return reply.trim();
    }
  } catch (err: any) {
    console.warn(`[Chatbot Service] LLM call failed: ${err.message}. Using rule-based fallback.`);
  }

  // Graceful fallback if LLM request failed or returned empty
  return generateLocalChatbotResponse(userMessage, resumeContext);
}

function isClearlyOffTopic(msg: string): boolean {
  const lower = msg.toLowerCase().trim();
  const offTopicTriggers = [
    'bake a cake', 'recipe for', 'cook a', 'write a song', 'write a poem about flowers',
    'who won the world cup', 'capital of', 'movie recommendations', 'weather in',
    'quantum physics', 'play chess', 'tell me a joke about animals', 'write python code to sort'
  ];
  return offTopicTriggers.some((t) => lower.includes(t));
}

function generateLocalChatbotResponse(message: string, resumeContext?: Partial<ResumeAnalysis> | null): string {
  const lower = message.toLowerCase();

  // 1. Resume improvement questions
  if (lower.includes('improve') || lower.includes('better') || lower.includes('feedback')) {
    if (resumeContext) {
      const weaknesses = (resumeContext.weaknesses || []).map((w) => `• **${w.title}**: ${w.suggestion}`).slice(0, 3).join('\n');
      const missingSkills = (resumeContext.missing_skills || []).map((m) => m.name).slice(0, 4).join(', ');
      return `Here are the highest-impact improvements for **${resumeContext.filename || 'your resume'}** based on your analysis:

${weaknesses || '• Add quantifiable metrics (percentages, numbers, dollar impact) to your bullet points.\n• Ensure each bullet begins with a powerful action verb.'}

${missingSkills ? `💡 **Key Skills to Add**: Consider integrating skills like **${missingSkills}** if you have experience with them.` : ''}

Overall Score: **${resumeContext.overall_score || 'N/A'}/100** | ATS Score: **${resumeContext.ats_score || 'N/A'}/100**.`;
    }
    return `To quickly elevate any resume:
1. **Lead with Impact**: Start each bullet point with an active verb (e.g., *Architected, Spearheaded, Accelerated*) and quantify results (*"increased throughput by 35%"*).
2. **Tailor to Job Descriptions**: Mirror technical keywords and requirements from target job listings.
3. **Keep Formatting Clean**: Use single-column standard margins without embedded tables, graphics, or unconventional fonts to ensure 100% ATS readability.
4. **Target 1-2 Pages**: Keep experience within 10 years and prioritize the most relevant accomplishments.`;
  }

  // 2. ATS questions
  if (lower.includes('ats') || lower.includes('applicant tracking') || lower.includes('compatible')) {
    if (resumeContext) {
      const atsScore = resumeContext.ats_score ?? 80;
      const issues = (resumeContext.ats_analysis?.issues || []).slice(0, 3).map((i) => `• ${i.message}`).join('\n');
      return `Your resume's ATS compatibility score is **${atsScore}/100**.

${issues ? `**Key ATS Findings to address:**\n${issues}\n` : ''}
**Tips to maintain 90%+ ATS Score:**
• Stick to standard section headings: *Professional Experience, Technical Skills, Education, Projects*.
• Avoid multi-column tables, graphics, or text boxes that confuse older parsers.
• Save as clean PDF or DOCX without scanned image overlays.`;
    }
    return `**Applicant Tracking Systems (ATS)** parse resumes into structured candidate profiles before human recruiters review them.

**How to make your resume 100% ATS-Friendly:**
• **Clean Headers**: Use standard titles like *Summary, Experience, Skills, Education*.
• **Single-Column Layout**: Multi-column columns often get parsed out of order.
• **Keyword Alignment**: Include exact acronyms and terms mentioned in the job description (e.g., both "AWS" and "Amazon Web Services").
• **Standard File Formats**: Clean text-based PDFs or DOCX files work best. Avoid scanned images or Canva designs with floating text frames.`;
  }

  // 3. Skills questions
  if (lower.includes('skill') || lower.includes('missing') || lower.includes('technolog')) {
    if (resumeContext) {
      const missing = (resumeContext.missing_skills || []).map((m) => `• **${m.name}** (${m.priority} Priority): ${m.reason}`).slice(0, 4).join('\n');
      const present = [
        ...(resumeContext.skills?.technical || []),
        ...(resumeContext.skills?.programming_languages || []),
      ].slice(0, 8).join(', ');
      return `Based on your resume scan:
**Detected Strengths:** ${present || 'Standard software engineering skills'}.

${missing ? `**Skills Recommended for Growth:**\n${missing}` : 'Your core skill inventory is strong! Focus on backing each skill with concrete project accomplishments.'}`;
    }
    return `When organizing your resume's skills section:
• Categorize them by domain (e.g., *Languages, Frameworks, Cloud & DevOps, Databases*).
• Focus on technologies you can confidently speak to in a technical interview.
• Integrate skills organically into your experience bullet points, demonstrating how you applied them to solve real business challenges.`;
  }

  // 4. Job suitability questions
  if (lower.includes('job') || lower.includes('role') || lower.includes('suit') || lower.includes('career')) {
    if (resumeContext && resumeContext.job_recommendations && resumeContext.job_recommendations.length > 0) {
      const recs = resumeContext.job_recommendations.slice(0, 3).map((j) => `• **${j.role}** (${j.match_percentage}% match): ${j.reason}`).join('\n');
      return `Based on your background and detected skill stack in **${resumeContext.filename || 'your resume'}**, top aligned roles include:

${recs}

You can test any specific job description against your resume using the **Job Matcher** tab above!`;
    }
    return `To discover your ideal job matches:
1. Identify your top 3-4 technical competencies.
2. Search for roles that require those core strengths (e.g., *Full Stack Developer, Cloud Engineer, Data Analyst*).
3. Check the **Job Matcher** tool in this app by pasting a real Job Description to see your direct alignment score!`;
  }

  // 5. Interview preparation questions
  if (lower.includes('interview') || lower.includes('question') || lower.includes('prep')) {
    return `Here are high-yield interview questions tailored for technical candidates:

**1. Behavioral (STAR Technique):**
• *"Tell me about a challenging technical bug or outage you resolved under pressure."*
• *"Describe a situation where you had to push back on a deadline or feature scope."*

**2. Architecture & Execution:**
• *"Walk me through the system design of the most complex project listed on your resume."*
• *"How do you ensure code quality, test coverage, and smooth CI/CD deployments?"*

**Pro-Tip**: Prepare 2-3 specific stories using the **STAR method** (Situation, Task, Action, Result) highlighting measurable outcomes.`;
  }

  // 6. Summary / Objective questions
  if (lower.includes('summary') || lower.includes('objective') || lower.includes('bio')) {
    if (resumeContext?.profile_summary) {
      return `Here is your current profile summary from the audit:
> "${resumeContext.profile_summary}"

**To strengthen it:**
• Keep it strictly 2-3 sentences: *[Years of Experience] + [Core Technical Stack] + [Top Quantified Achievement]*.
• Example formula: *"Results-driven Full Stack Engineer with 4+ years of experience building resilient microservices and high-conversion React applications that scale to 2M+ users."*`;
    }
    return `A winning Professional Summary follows this 3-sentence framework:
1. **Hook**: *"[Target Title] with [X] years of experience specializing in [Top 2-3 Technologies]."*
2. **Impact**: *"Proven track record of [Notable metric or project, e.g. reducing API latency by 40%]."*
3. **Value Proposition**: *"Passionate about building scalable systems and eager to drive engineering excellence at [Target Company]."*`;
  }

  // Keep the fallback tied to the user's question instead of returning a generic welcome.
  const questionType = detectQuestionType(lower);
  const contextHint = resumeContext
    ? ` I can answer it using your uploaded resume, including its ${resumeContext.overall_score ?? 'current'} overall score and detected experience.`
    : ' Upload a resume if you want an answer based on your own experience.';

  if (questionType === 'why') {
    return `The answer depends on the specific resume or career issue you mean. Please mention the score, section, skill, or recommendation you want explained, and I will break down the reason and the exact next step.${contextHint}`;
  }

  if (questionType === 'how') {
    return `I can give you a step-by-step answer, but I need the action you want to take. For example, ask "How do I improve my ATS score?" or "How do I rewrite my summary?"${contextHint}`;
  }

  return `I received your question: "${message}". I need a little more detail to answer it accurately. Please include the resume section, job role, skill, score, or interview topic you mean.${contextHint}`;
}

function detectQuestionType(message: string): 'why' | 'how' | 'other' {
  if (/\bwhy\b/.test(message)) return 'why';
  if (/\bhow\b/.test(message)) return 'how';
  return 'other';
}
