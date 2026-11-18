import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { parsePdf } from '../services/parser/pdfParser.js';
import { parseDocx } from '../services/parser/docxParser.js';
import { cleanText } from '../services/parser/textCleaner.js';
import { analyzeResumeWithAI } from '../services/ai/aiService.js';
import { db } from '../db/db.js';

export async function analyzeResume(req: Request, res: Response): Promise<void> {
  try {
    let extractedText = '';
    let originalName = 'Resume.txt';
    let fileSize = 0;
    let fileType = 'text/plain';

    if (req.file) {
      originalName = req.file.originalname;
      fileSize = req.file.size;
      fileType = req.file.mimetype;
      const ext = path.extname(originalName).toLowerCase();

      try {
        if (ext === '.pdf') {
          extractedText = await parsePdf(req.file.buffer);
        } else if (ext === '.docx' || ext === '.doc') {
          extractedText = await parseDocx(req.file.buffer);
        } else if (ext === '.txt') {
          extractedText = req.file.buffer.toString('utf-8');
        } else {
          res.status(400).json({ error: "This file type isn't supported. Please upload PDF, DOCX, or TXT." });
          return;
        }
      } catch (parseErr: any) {
        console.warn('[ResumeController] Parser failed:', parseErr.message);
        res.status(400).json({
          error: parseErr.message || "Could not read text from this file. Please ensure it is not scanned or password-protected.",
        });
        return;
      }
    } else if (req.body.text) {
      extractedText = req.body.text;
      originalName = req.body.filename || 'Pasted_Resume.txt';
    } else {
      res.status(400).json({ error: 'No resume file or text provided.' });
      return;
    }

    // Clean text
    const cleanedText = cleanText(extractedText);

    if (!cleanedText || cleanedText.length < 30) {
      res.status(400).json({
        error: "We couldn't find readable text in this file. Please upload another version of your resume or paste it as text.",
      });
      return;
    }

    // Analyze with AI / Heuristic engine
    const analysisResult = await analyzeResumeWithAI(cleanedText, originalName);

    // Form final record
    const record = {
      id: uuidv4(),
      filename: originalName,
      file_size: fileSize,
      file_type: fileType,
      analyzed_at: new Date().toISOString(),
      raw_text: cleanedText,
      ...analysisResult,
    };

    // Save to persistent db
    db.save(record);

    res.json(record);
  } catch (err: any) {
    console.error('[ResumeController] Analysis failed:', err);
    res.status(500).json({
      error: err.message || "We couldn't complete the analysis right now. Please try again.",
      details: err.message,
    });
  }
}

export async function analyzeSample(req: Request, res: Response): Promise<void> {
  try {
    const { sampleId } = req.params;

    const samples: Record<string, { name: string; content: string }> = {
      'senior-fullstack': {
        name: 'Alex_Chen_Senior_Fullstack.pdf',
        content: `ALEX CHEN
San Francisco, CA | alex.chen@example.com | (555) 234-5678 | github.com/alexchen | linkedin.com/in/alexchen-dev
PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Engineer with 6+ years experience designing and scaling distributed web applications. Reduced latency by 40% and led engineering teams of 8+ developers.
TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Python, Go, SQL
- Frameworks: React, Next.js, Node.js, Express, NestJS, Tailwind CSS
- Databases: PostgreSQL, MongoDB, Redis
- Cloud & DevOps: AWS (ECS, Lambda, S3), Docker, Kubernetes, CI/CD, Terraform
- Tools: Git, Jira, Postman, Jest, Cypress
PROFESSIONAL EXPERIENCE
Senior Full Stack Engineer | CloudScale Technologies, San Francisco, CA | 2022 - Present
- Architected and deployed microservices handling 25M+ daily requests, improving API uptime from 99.2% to 99.98%.
- Led frontend redesign using Next.js and Tailwind CSS, reducing FCP by 45% and boosting conversion by 18%.
- Optimized PostgreSQL database clusters, saving $14,000 in monthly cloud infrastructure costs.
Full Stack Engineer | Horizon Fintech, New York, NY | 2019 - 2022
- Developed secure payment processing workflows using Node.js and Stripe, handling $8M+ annually.
- Integrated Redis caching layer, reducing p99 latency from 850ms to 95ms.
EDUCATION
Bachelor of Science in Computer Science | UC Berkeley | 2019`,
      },
      'data-scientist': {
        name: 'Sarah_Miller_Data_Scientist.pdf',
        content: `SARAH MILLER
Chicago, IL | sarah.miller@example.com | (555) 789-0123 | linkedin.com/in/sarahmiller-ds
PROFESSIONAL SUMMARY
Analytical Data Scientist with 4 years delivering machine learning models, statistical analysis, and automated predictive pipelines. Expertise in Python, PyTorch, Scikit-Learn, SQL, and Tableau.
CORE COMPETENCIES
- Machine Learning: Supervised/Unsupervised Learning, NLP, Random Forest, XGBoost, PyTorch, TensorFlow
- Programming: Python, R, SQL, Pandas, NumPy
- Data Engineering: Apache Spark, Snowflake, Airflow, Docker, Git
- Visualization: Tableau, Power BI, Matplotlib, Seaborn
WORK EXPERIENCE
Data Scientist | Optima Analytics, Chicago, IL | 2021 - Present
- Developed customer churn prediction models with XGBoost, improving retention rates by 14%.
- Designed and evaluated 35+ A/B experiments on onboarding workflows, lifting engagement by 22%.
- Built automated ETL data pipelines in Python and Airflow, processing 3TB of daily data into Snowflake.
EDUCATION
Master of Science in Data Science | Northwestern University | 2020
Bachelor of Science in Statistics | UIUC | 2018`,
      },
      'junior-frontend': {
        name: 'Jordan_Lee_Junior_Frontend.pdf',
        content: `JORDAN LEE
Austin, TX | jordan.lee@example.com | (555) 345-6789 | github.com/jordanlee-web
OBJECTIVE
Motivated Junior Frontend Developer seeking an entry-level position to build user-friendly web interfaces.
SKILLS
- HTML5, CSS3, JavaScript, React, Git, responsive design, Figma
EXPERIENCE
Junior Web Developer Intern | BlueSky Digital Agency | 2023 - 2024
- Worked on client websites using HTML, CSS, and JavaScript.
- Assisted the design team with responsive mobile layouts.
- Fixed bugs and improved styling across landing pages.
PROJECTS
Task Manager App
- Built a to-do list web app using React and LocalStorage.
Weather Finder
- Created a weather lookup website fetching forecast data from OpenWeather API.
EDUCATION
Bachelor of Arts in Digital Media | Texas State University | 2023`,
      },
    };

    const target = samples[sampleId] || samples['senior-fullstack'];
    const cleanedText = cleanText(target.content);
    const analysisResult = await analyzeResumeWithAI(cleanedText, target.name);

    const record = {
      id: `sample-${sampleId}-${Date.now()}`,
      filename: target.name,
      file_size: target.content.length,
      file_type: 'application/pdf',
      analyzed_at: new Date().toISOString(),
      raw_text: cleanedText,
      ...analysisResult,
    };

    db.save(record);
    res.json(record);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load sample resume', details: err.message });
  }
}
