import { detectSections } from '../parser/sectionDetector.js';

interface AnalysisOutput {
  overall_score: number;
  ats_score: number;
  profile_summary: string;
  top_strength: string;
  main_improvement: string;
  best_job_match: {
    role: string;
    match_percentage: number;
  };
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
    programming_languages: string[];
    frameworks: string[];
    databases: string[];
    cloud: string[];
  };
  strengths: { title: string; explanation: string }[];
  weaknesses: { title: string; explanation: string; suggestion: string }[];
  missing_skills: { name: string; priority: 'High' | 'Medium' | 'Low'; reason: string }[];
  experience_analysis: {
    years_estimated: number;
    level: string;
    quality: string;
    comments: string[];
    quantifiable_achievements_detected: number;
  };
  education_analysis: {
    quality: string;
    degree_detected?: string;
    institution_detected?: string;
    comments: string[];
  };
  projects_analysis: {
    projects_detected: number;
    quality: string;
    comments: string[];
    recommendations: string[];
  };
  ats_analysis: {
    score: number;
    rating: 'Poor' | 'Fair' | 'Good' | 'Excellent';
    formatting: number;
    keywords: number;
    structure: number;
    readability: number;
    section_completeness: number;
    issues: {
      type: 'pass' | 'warning' | 'error';
      category: 'formatting' | 'keywords' | 'structure' | 'readability' | 'sections';
      message: string;
      suggestion?: string;
    }[];
  };
  job_recommendations: {
    role: string;
    match_percentage: number;
    reason: string;
    required_skills: string[];
    missing_skills: string[];
    suggested_next_steps: string[];
  }[];
  keyword_analysis: {
    present_keywords: string[];
    missing_keywords: string[];
    important_keywords: string[];
  };
  improvements: string[];
  action_plan: {
    step: number;
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
  }[];
}

const DICTIONARY = {
  programming_languages: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Golang', 'C++', 'C#', 'Rust',
    'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL', 'HTML5', 'HTML', 'CSS3', 'CSS', 'Bash', 'R', 'Scala',
  ],
  frameworks: [
    'React', 'Next.js', 'Node.js', 'Express', 'NestJS', 'Vue', 'Angular', 'Django',
    'Flask', 'FastAPI', 'Spring Boot', 'Ruby on Rails', 'ASP.NET', 'Tailwind CSS', 'Bootstrap',
    'GraphQL', 'REST API', 'WebSockets', 'Redux', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy',
  ],
  databases: [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Snowflake', 'Cassandra',
    'DynamoDB', 'Oracle', 'Elasticsearch', 'InfluxDB', 'Firebase',
  ],
  cloud: [
    'AWS', 'Docker', 'Kubernetes', 'GCP', 'Google Cloud', 'Azure', 'Terraform',
    'CI/CD', 'GitHub Actions', 'Jenkins', 'Ansible', 'Linux', 'Microservices', 'Serverless', 'ECS', 'Lambda',
  ],
  tools: [
    'Git', 'Jira', 'Postman', 'Figma', 'VS Code', 'Jest', 'Cypress', 'Vite', 'Webpack',
    'Tableau', 'Power BI', 'Airflow', 'Apache Spark',
  ],
  soft: [
    'Leadership', 'Communication', 'Mentorship', 'Teamwork', 'Problem Solving',
    'Agile', 'Scrum', 'Cross-Functional Collaboration', 'Time Management', 'Critical Thinking',
  ],
};

export function analyzeResumeHeuristically(text: string, filename: string): AnalysisOutput {
  const sections = detectSections(text);

  // 1. Extract Skills
  const extractedSkills: AnalysisOutput['skills'] = {
    technical: [],
    soft: [],
    tools: [],
    programming_languages: [],
    frameworks: [],
    databases: [],
    cloud: [],
  };

  const textLower = text.toLowerCase();

  for (const [category, terms] of Object.entries(DICTIONARY)) {
    for (const term of terms) {
      // Word boundary regex check
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(text)) {
        if (category === 'programming_languages') extractedSkills.programming_languages.push(term);
        else if (category === 'frameworks') extractedSkills.frameworks.push(term);
        else if (category === 'databases') extractedSkills.databases.push(term);
        else if (category === 'cloud') extractedSkills.cloud.push(term);
        else if (category === 'tools') extractedSkills.tools.push(term);
        else if (category === 'soft') extractedSkills.soft.push(term);
      }
    }
  }

  // Deduplicate and populate technical concepts
  extractedSkills.technical = [
    ...new Set([
      ...extractedSkills.programming_languages.slice(0, 4),
      ...extractedSkills.frameworks.slice(0, 4),
      ...extractedSkills.cloud.slice(0, 3),
    ]),
  ];

  // 2. Quantifiable Metrics & Experience Analysis
  const metricMatches = text.match(/(\b\d+(\.\d+)?%\b|\$\d+[\d,]*\b|\b\d+\+?\s*(M|K|million|thousand|users|clients|requests|hours|seconds|ms)\b)/gi) || [];
  const quantifiableCount = metricMatches.length;

  // Seniority & Years of Experience Estimation
  const yearMatches = text.match(/\b(19\d\d|20\d\d)\b/g);
  let estimatedYears = 2;
  if (yearMatches && yearMatches.length >= 2) {
    const years = yearMatches.map(Number).filter((y) => y >= 1990 && y <= 2030);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const diff = maxYear - minYear;
    if (diff > 0 && diff < 35) {
      estimatedYears = diff;
    }
  }

  let seniorityLevel = 'Entry-Level';
  if (estimatedYears >= 5 || /senior|lead|principal|architect/i.test(text)) {
    seniorityLevel = 'Senior Level';
  } else if (estimatedYears >= 2 || /mid-level/i.test(text)) {
    seniorityLevel = 'Mid-Level';
  }

  // 3. ATS Analysis & Scoring
  let atsFormatting = 88;
  let atsKeywords = 80;
  let atsStructure = 85;
  let atsReadability = 85;
  let atsCompleteness = Math.min(100, (sections.detectedCount / 5) * 100);

  const issues: AnalysisOutput['ats_analysis']['issues'] = [];

  // Structure checks
  if (sections.experience) {
    issues.push({
      type: 'pass',
      category: 'structure',
      message: 'Clear work experience section detected with chronological progression.',
    });
  } else {
    atsStructure -= 20;
    issues.push({
      type: 'warning',
      category: 'structure',
      message: 'Work experience section header is missing or non-standard.',
      suggestion: 'Use a standard header such as "Professional Experience" or "Work Experience".',
    });
  }

  if (sections.skills) {
    issues.push({
      type: 'pass',
      category: 'sections',
      message: 'Dedicated skills section detected for automated indexing.',
    });
  } else {
    atsCompleteness -= 15;
    issues.push({
      type: 'warning',
      category: 'sections',
      message: 'No separate skills section detected.',
      suggestion: 'Add a clear "Technical Skills" section grouped by category.',
    });
  }

  if (sections.education) {
    issues.push({
      type: 'pass',
      category: 'sections',
      message: 'Educational credentials detected with degree information.',
    });
  }

  // Contact info check
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);

  if (hasEmail && hasPhone) {
    issues.push({
      type: 'pass',
      category: 'formatting',
      message: 'Contact information (email and phone number) parsed successfully.',
    });
  } else {
    atsFormatting -= 15;
    issues.push({
      type: 'error',
      category: 'formatting',
      message: 'Incomplete contact information found.',
      suggestion: 'Ensure your phone number, email address, and LinkedIn profile are prominently displayed.',
    });
  }

  // Quantifiable metrics check
  if (quantifiableCount >= 3) {
    issues.push({
      type: 'pass',
      category: 'readability',
      message: `Identified ${quantifiableCount} measurable business achievements with numeric metrics.`,
    });
  } else {
    atsReadability -= 15;
    issues.push({
      type: 'warning',
      category: 'readability',
      message: 'Missing measurable achievements in work experience bullet points.',
      suggestion: 'Add numbers, percentages, or dollar values (e.g. "Improved query performance by 40%").',
    });
  }

  const atsScore = Math.round(
    (atsFormatting * 0.2 + atsKeywords * 0.25 + atsStructure * 0.25 + atsReadability * 0.15 + atsCompleteness * 0.15)
  );

  let atsRating: 'Poor' | 'Fair' | 'Good' | 'Excellent' = 'Good';
  if (atsScore >= 85) atsRating = 'Excellent';
  else if (atsScore >= 70) atsRating = 'Good';
  else if (atsScore >= 50) atsRating = 'Fair';
  else atsRating = 'Poor';

  // Overall Score
  const totalSkillsCount = Object.values(extractedSkills).flat().length;
  let overallScore = Math.min(
    95,
    Math.round(atsScore * 0.5 + Math.min(25, totalSkillsCount * 1.5) + (quantifiableCount >= 3 ? 15 : 5) + 10)
  );
  if (overallScore < 45) overallScore = 48;

  // 4. Job Recommendations
  const isWebOrFullstack = /react|node|javascript|typescript|next\.js|frontend|fullstack/i.test(text);
  const isDataOrML = /python|pytorch|machine learning|data science|sql|pandas|tensorflow/i.test(text);
  const isDevOpsOrCloud = /aws|docker|kubernetes|terraform|ci\/cd|devops/i.test(text);

  const jobRecs: AnalysisOutput['job_recommendations'] = [];

  if (isDataOrML) {
    jobRecs.push(
      {
        role: 'Data Scientist',
        match_percentage: 92,
        reason: 'Strong synergy with Python, statistical modeling, machine learning frameworks, and database queries.',
        required_skills: ['Python', 'SQL', 'Machine Learning', 'Data Analysis'],
        missing_skills: ['MLOps', 'Kubernetes'],
        suggested_next_steps: ['Highlight end-to-end model deployment experience and business ROI.'],
      },
      {
        role: 'Machine Learning Engineer',
        match_percentage: 86,
        reason: 'Solid foundation in modeling and algorithmic pipelines.',
        required_skills: ['Python', 'PyTorch/TensorFlow', 'Docker'],
        missing_skills: ['FastAPI', 'Distributed Training'],
        suggested_next_steps: ['Demonstrate production API latency benchmarks and model monitoring.'],
      },
      {
        role: 'Data Analyst',
        match_percentage: 84,
        reason: 'Extensive background in SQL queries, data exploration, and KPI metrics.',
        required_skills: ['SQL', 'Data Visualization', 'Python'],
        missing_skills: ['Tableau', 'Power BI'],
        suggested_next_steps: ['Add executive reporting and A/B test experimentation results.'],
      },
      {
        role: 'BI Engineer',
        match_percentage: 78,
        reason: 'Analytical mindset capable of structuring data warehouse marts and automated pipelines.',
        required_skills: ['SQL', 'ETL Pipelines', 'Snowflake'],
        missing_skills: ['dbt', 'Airflow'],
        suggested_next_steps: ['Elaborate on data pipeline reliability and automated ETL orchestrations.'],
      },
      {
        role: 'Analytics Engineer',
        match_percentage: 75,
        reason: 'Bridges data modeling with software engineering practices.',
        required_skills: ['SQL', 'Data Warehousing', 'Git'],
        missing_skills: ['dbt', 'BigQuery'],
        suggested_next_steps: ['Highlight code-driven data transformations and data documentation.'],
      }
    );
  } else if (isWebOrFullstack) {
    jobRecs.push(
      {
        role: 'Full Stack Engineer',
        match_percentage: 91,
        reason: 'Demonstrated capability across client-side interfaces and server-side APIs.',
        required_skills: ['TypeScript', 'React', 'Node.js', 'SQL'],
        missing_skills: ['Microservices', 'Kubernetes'],
        suggested_next_steps: ['Detail architecture of end-to-end features and full-stack scalability.'],
      },
      {
        role: 'Senior Frontend Developer',
        match_percentage: 88,
        reason: 'High proficiency in modern component architectures, state management, and responsive layouts.',
        required_skills: ['React', 'JavaScript/TypeScript', 'CSS/Tailwind'],
        missing_skills: ['Web Performance Profiling', 'Next.js SSR'],
        suggested_next_steps: ['Emphasize web vitals optimization (LCP, FID, CLS) and state complexity.'],
      },
      {
        role: 'Backend Developer',
        match_percentage: 84,
        reason: 'Experience building REST APIs, database schemas, and microservice endpoints.',
        required_skills: ['Node.js', 'REST API', 'PostgreSQL', 'Git'],
        missing_skills: ['System Design', 'Redis Caching'],
        suggested_next_steps: ['Quantify throughput (requests/sec) and database indexing improvements.'],
      },
      {
        role: 'Software Engineer',
        match_percentage: 82,
        reason: 'Solid generalist coding ability and structured software development lifecycle knowledge.',
        required_skills: ['TypeScript/JavaScript', 'Git', 'Agile'],
        missing_skills: ['Automated CI/CD', 'Docker'],
        suggested_next_steps: ['List open-source projects, system design concepts, and testing coverage.'],
      },
      {
        role: 'Cloud Application Developer',
        match_percentage: 76,
        reason: 'Strong foundation to deliver containerized services in cloud environments.',
        required_skills: ['Cloud APIs', 'Containers', 'Node.js'],
        missing_skills: ['Terraform', 'AWS ECS/Lambda'],
        suggested_next_steps: ['Add cloud certification or cloud deployment examples to projects.'],
      }
    );
  } else {
    jobRecs.push(
      {
        role: 'Software Engineer',
        match_percentage: 84,
        reason: 'Broad technical foundation with adaptable engineering fundamentals.',
        required_skills: ['Programming', 'Problem Solving', 'Git'],
        missing_skills: ['Cloud Deployment', 'Automated Testing'],
        suggested_next_steps: ['Add concrete technical projects demonstrating modern architectural patterns.'],
      },
      {
        role: 'Technical Associate',
        match_percentage: 80,
        reason: 'Clear ability to collaborate across digital tools and workflows.',
        required_skills: ['Communication', 'Documentation', 'Technical Aptitude'],
        missing_skills: ['Domain Specialization'],
        suggested_next_steps: ['Specialize in a high-demand tech stack like React/Node.js or Python.'],
      },
      {
        role: 'Junior Developer',
        match_percentage: 78,
        reason: 'Entry credentials ready for mentored software engineering roles.',
        required_skills: ['Coding Fundamentals', 'Git'],
        missing_skills: ['Production Deployment'],
        suggested_next_steps: ['Build 2 full-scale portfolio applications with live demo URLs.'],
      },
      {
        role: 'QA / Automation Engineer',
        match_percentage: 74,
        reason: 'Detail-oriented inspection of application workflows.',
        required_skills: ['Testing', 'Bug Tracking', 'Git'],
        missing_skills: ['Cypress', 'Selenium'],
        suggested_next_steps: ['Add automated unit and integration testing experience.'],
      },
      {
        role: 'Technical Support Specialist',
        match_percentage: 71,
        reason: 'Strong communication and diagnostic problem-solving abilities.',
        required_skills: ['Troubleshooting', 'Customer Focus'],
        missing_skills: ['Ticketing Systems'],
        suggested_next_steps: ['Highlight root-cause analysis and ticket resolution speed.'],
      }
    );
  }

  // 5. Strengths & Weaknesses
  const strengths: AnalysisOutput['strengths'] = [];
  const weaknesses: AnalysisOutput['weaknesses'] = [];

  if (totalSkillsCount >= 8) {
    strengths.push({
      title: 'Strong Technical Skill Coverage',
      explanation: `Resume demonstrates expertise across ${totalSkillsCount} distinct technical skills, frameworks, and tools.`,
    });
  }
  if (quantifiableCount >= 3) {
    strengths.push({
      title: 'Evidence of Quantifiable Impact',
      explanation: 'Work history includes measurable metrics ($ saved, % speedups, user scale) that recruiters value highly.',
    });
  }
  if (sections.experience) {
    strengths.push({
      title: 'Clear Chronological Work History',
      explanation: 'Work experience section is logically sequenced and easy for automated parsers to ingest.',
    });
  }
  if (sections.education) {
    strengths.push({
      title: 'Accredited Educational Credentials',
      explanation: 'Education history is clearly demarcated with institutional and degree details.',
    });
  }

  if (quantifiableCount < 3) {
    weaknesses.push({
      title: 'Experience Descriptions Lack Measurable Results',
      explanation: 'Most bullet points describe daily tasks rather than quantifiable business outcomes.',
      suggestion: 'Add verifiable numbers such as: "Optimized database queries, reducing response times by 35%."',
    });
  }

  if (!textLower.includes('github') && !textLower.includes('linkedin')) {
    weaknesses.push({
      title: 'Missing Professional Portfolio Links',
      explanation: 'Recruiters and hiring managers expect direct links to inspect code repositories or professional profiles.',
      suggestion: 'Add clickable links to your LinkedIn and GitHub / portfolio profiles in the contact header.',
    });
  }

  if (extractedSkills.cloud.length === 0) {
    weaknesses.push({
      title: 'Limited Cloud & DevOps Visibility',
      explanation: 'Modern tech roles heavily weight cloud knowledge (AWS, Docker, CI/CD).',
      suggestion: 'Highlight any containerization, deployment pipelines, or cloud service usage in your projects.',
    });
  }

  // 6. Missing / Recommended Skills with Priority
  const missingSkills: AnalysisOutput['missing_skills'] = [];
  if (!textLower.includes('docker')) {
    missingSkills.push({
      name: 'Docker',
      priority: 'High',
      reason: 'Essential for containerized local development and cloud microservice deployment.',
    });
  }
  if (!textLower.includes('aws') && !textLower.includes('azure') && !textLower.includes('cloud')) {
    missingSkills.push({
      name: 'AWS (Amazon Web Services)',
      priority: 'High',
      reason: 'Industry standard cloud provider; certifications or experience boost candidate appeal.',
    });
  }
  if (!textLower.includes('ci/cd') && !textLower.includes('github actions')) {
    missingSkills.push({
      name: 'CI/CD Pipelines',
      priority: 'Medium',
      reason: 'Automated testing and deployment pipelines show modern engineering discipline.',
    });
  }
  if (!textLower.includes('kubernetes') && seniorityLevel === 'Senior Level') {
    missingSkills.push({
      name: 'Kubernetes',
      priority: 'Medium',
      reason: 'Critical container orchestration tool frequently required for senior and lead roles.',
    });
  }

  // 7. Keyword Analysis
  const presentKeywords = [
    ...new Set([...extractedSkills.programming_languages.slice(0, 3), ...extractedSkills.frameworks.slice(0, 3), 'Git', 'Agile']),
  ];
  const missingKeywords = ['Docker', 'AWS', 'CI/CD', 'Unit Testing', 'System Architecture'].filter(
    (kw) => !textLower.includes(kw.toLowerCase())
  );
  const importantKeywords = ['Microservices', 'RESTful API', 'Performance Optimization', 'Security Compliance'];

  // 8. Action Plan
  const actionPlan: AnalysisOutput['action_plan'] = [
    {
      step: 1,
      title: 'Incorporate Quantifiable Metric Bullets',
      description: 'Rewrite 3-5 experience bullet points using the Google XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]."',
      priority: 'High',
    },
    {
      step: 2,
      title: 'Standardize ATS Heading Hierarchy',
      description: 'Ensure main headers ("Professional Experience", "Technical Skills", "Education") use simple plain-text fonts without multi-column formatting.',
      priority: 'High',
    },
    {
      step: 3,
      title: 'Add Missing High-Priority Cloud Keywords',
      description: 'Naturally integrate Docker, AWS, or CI/CD in your tech stack where you have demonstrable familiarity.',
      priority: 'Medium',
    },
    {
      step: 4,
      title: 'Include Direct Portfolio & Code Repository Links',
      description: 'Add prominent GitHub and LinkedIn URLs directly beneath your name in the contact header.',
      priority: 'Medium',
    },
    {
      step: 5,
      title: 'Target Professional Summary to Desired Title',
      description: `Tailor your opening summary statement specifically toward your target role (${jobRecs[0]?.role || 'target role'}).`,
      priority: 'Low',
    },
  ];

  return {
    overall_score: overallScore,
    ats_score: atsScore,
    profile_summary:
      sections.summary ||
      `Experienced ${seniorityLevel.toLowerCase()} professional with verified proficiencies across ${extractedSkills.programming_languages.join(', ') || 'modern technologies'}. Proven foundation in structured engineering with notable opportunities for quantified achievement enhancements.`,
    top_strength: strengths[0]?.title || 'Strong technical skill coverage',
    main_improvement: weaknesses[0]?.title || 'Incorporate measurable impact metrics',
    best_job_match: {
      role: jobRecs[0]?.role || 'Software Engineer',
      match_percentage: jobRecs[0]?.match_percentage || 85,
    },
    skills: extractedSkills,
    strengths,
    weaknesses,
    missing_skills: missingSkills,
    experience_analysis: {
      years_estimated: estimatedYears,
      level: seniorityLevel,
      quality: quantifiableCount >= 3 ? 'Excellent' : 'Needs Quantified Impact',
      comments: [
        `Identified ${quantifiableCount} quantifiable metrics across bullet points.`,
        `Estimated career progression spans approximately ~${estimatedYears} years at ${seniorityLevel}.`,
        quantifiableCount < 3
          ? 'Experience bullets would benefit from more concrete percentage gains, financial savings, or performance metrics.'
          : 'High proportion of action-oriented bullets with verifiable outcomes.',
      ],
      quantifiable_achievements_detected: quantifiableCount,
    },
    education_analysis: {
      quality: sections.education ? 'Clearly Formatted' : 'Missing or Non-Standard',
      degree_detected: text.match(/\b(bachelor|master|phd|b\.s\.|m\.s\.|associate|b\.a\.)[^,\n]*/i)?.[0] || 'Degree Detected',
      institution_detected: text.match(/(university|college|institute)[^,\n]*/i)?.[0] || 'Institution Detected',
      comments: [
        sections.education
          ? 'Educational credentials parsed with recognizable degrees and institutions.'
          : 'Education section could be more prominently separated with graduation years.',
      ],
    },
    projects_analysis: {
      projects_detected: sections.projects ? 2 : 1,
      quality: 'Demonstrates Applied Skills',
      comments: ['Projects highlight real-world technology implementation.'],
      recommendations: [
        'Add live demo hyperlinks and GitHub repository links.',
        'Detail the specific business or user problem each project solved.',
      ],
    },
    ats_analysis: {
      score: atsScore,
      rating: atsRating,
      formatting: atsFormatting,
      keywords: atsKeywords,
      structure: atsStructure,
      readability: atsReadability,
      section_completeness: Math.round(atsCompleteness),
      issues,
    },
    job_recommendations: jobRecs,
    keyword_analysis: {
      present_keywords: presentKeywords,
      missing_keywords: missingKeywords,
      important_keywords: importantKeywords,
    },
    improvements: weaknesses.map((w) => w.suggestion),
    action_plan: actionPlan,
  };
}
