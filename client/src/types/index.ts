export interface ResumeSkills {
  technical: string[];
  soft: string[];
  tools: string[];
  programming_languages: string[];
  frameworks: string[];
  databases: string[];
  cloud: string[];
}

export interface MissingSkill {
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
}

export interface ExperienceAnalysis {
  years_estimated: number;
  level: string;
  quality: string;
  comments: string[];
  quantifiable_achievements_detected: number;
  quantifiable_recommendations?: string[];
}

export interface EducationAnalysis {
  quality: string;
  degree_detected?: string;
  institution_detected?: string;
  graduation_year_detected?: string;
  comments: string[];
}

export interface ProjectAnalysis {
  projects_detected: number;
  quality: string;
  comments: string[];
  recommendations: string[];
}

export interface AtsIssue {
  type: 'pass' | 'warning' | 'error';
  category: 'formatting' | 'keywords' | 'structure' | 'readability' | 'sections';
  message: string;
  suggestion?: string;
}

export interface AtsAnalysis {
  score: number;
  rating: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  formatting: number;
  keywords: number;
  structure: number;
  readability: number;
  section_completeness: number;
  issues: AtsIssue[];
}

export interface JobRecommendation {
  role: string;
  match_percentage: number;
  reason: string;
  required_skills: string[];
  missing_skills: string[];
  suggested_next_steps?: string[];
}

export interface KeywordAnalysis {
  present_keywords: string[];
  missing_keywords: string[];
  important_keywords: string[];
  recommendations?: string;
}

export interface ResumeAnalysis {
  id: string;
  filename: string;
  file_size?: number;
  file_type?: string;
  analyzed_at: string;
  overall_score: number;
  ats_score: number;
  profile_summary: string;
  top_strength: string;
  main_improvement: string;
  best_job_match: {
    role: string;
    match_percentage: number;
  };
  skills: ResumeSkills;
  strengths: { title: string; explanation: string }[];
  weaknesses: { title: string; explanation: string; suggestion: string }[];
  missing_skills: MissingSkill[];
  experience_analysis: ExperienceAnalysis;
  education_analysis: EducationAnalysis;
  projects_analysis?: ProjectAnalysis;
  ats_analysis: AtsAnalysis;
  job_recommendations: JobRecommendation[];
  keyword_analysis: KeywordAnalysis;
  improvements: string[];
  action_plan: { step: number; title: string; description: string; priority: 'High' | 'Medium' | 'Low' }[];
  raw_text?: string;
}

export interface JobMatchRequest {
  resume_text?: string;
  analysis_id?: string;
  job_title?: string;
  job_description: string;
}

export interface JobMatchResult {
  job_title: string;
  match_percentage: number;
  summary: string;
  matching_skills: string[];
  missing_skills: string[];
  matching_keywords: string[];
  missing_keywords: string[];
  experience_match: string;
  tailored_suggestions: string[];
}

export interface ResumeComparisonResult {
  resume_a: { id: string; filename: string; overall_score: number; ats_score: number };
  resume_b: { id: string; filename: string; overall_score: number; ats_score: number };
  score_diff: number;
  ats_diff: number;
  skills_diff: {
    added: string[];
    removed: string[];
  };
  key_takeaways: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  resume_context?: Partial<ResumeAnalysis> | null;
  conversation_history?: { role: 'user' | 'assistant'; content: string }[];
}

export interface ChatResponse {
  response: string;
}
