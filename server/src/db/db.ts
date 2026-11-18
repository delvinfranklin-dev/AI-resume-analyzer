import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeResumeHeuristically } from '../services/ai/heuristicEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'analyses.json');

export interface StoredAnalysis {
  id: string;
  filename: string;
  analyzed_at: string;
  [key: string]: any;
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readDb(): StoredAnalysis[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return seedDefaultAnalyses();
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[DB] Error reading analyses file:', err);
    return [];
  }
}

function writeDb(data: StoredAnalysis[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error writing analyses file:', err);
  }
}

function seedDefaultAnalyses(): StoredAnalysis[] {
  console.log('[DB] Seeding default sample analyses for demonstration...');
  const alexResumeText = `ALEX CHEN
San Francisco, CA | alex.chen@example.com | (555) 234-5678 | github.com/alexchen
PROFESSIONAL SUMMARY
Senior Full Stack Engineer with 6+ years experience in TypeScript, React, Node.js, and AWS.
TECHNICAL SKILLS
- TypeScript, JavaScript, Python, Go, SQL, React, Next.js, Node.js, Express, PostgreSQL, Redis, AWS, Docker, Kubernetes, Git
EXPERIENCE
Senior Full Stack Engineer | CloudScale Technologies | 2022 - Present
- Architected microservices handling 25M+ daily requests, improving uptime to 99.98%.
- Led frontend redesign reducing FCP by 45% and boosting conversion by 18%.
- Optimized PostgreSQL queries, saving $14,000 monthly in cloud costs.
EDUCATION
B.S. in Computer Science | UC Berkeley | 2019`;

  const sarahResumeText = `SARAH MILLER
Chicago, IL | sarah.miller@example.com | (555) 789-0123 | github.com/smiller-data
PROFESSIONAL SUMMARY
Data Scientist with 4 years experience in Python, PyTorch, Scikit-Learn, SQL, and predictive modeling.
SKILLS
- Python, SQL, PyTorch, TensorFlow, Scikit-Learn, Snowflake, Airflow, Docker, Tableau, Git
WORK EXPERIENCE
Data Scientist | Optima Analytics | 2021 - Present
- Built churn prediction models in XGBoost improving retention by 14%.
- Conducted 35+ A/B tests lifting onboarding engagement by 22%.
EDUCATION
M.S. in Data Science | Northwestern University | 2020`;

  const alexAnalysis = {
    id: 'sample-alex-chen',
    filename: 'Alex_Chen_Senior_Engineer.pdf',
    analyzed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    ...analyzeResumeHeuristically(alexResumeText, 'Alex_Chen_Senior_Engineer.pdf'),
    raw_text: alexResumeText,
  };

  const sarahAnalysis = {
    id: 'sample-sarah-miller',
    filename: 'Sarah_Miller_Data_Scientist.pdf',
    analyzed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    ...analyzeResumeHeuristically(sarahResumeText, 'Sarah_Miller_Data_Scientist.pdf'),
    raw_text: sarahResumeText,
  };

  const initial = [alexAnalysis, sarahAnalysis];
  writeDb(initial);
  return initial;
}

export const db = {
  getAll: (): StoredAnalysis[] => {
    return readDb().sort(
      (a, b) => new Date(b.analyzed_at).getTime() - new Date(a.analyzed_at).getTime()
    );
  },

  getById: (id: string): StoredAnalysis | undefined => {
    return readDb().find((item) => item.id === id);
  },

  save: (analysis: StoredAnalysis): void => {
    const list = readDb();
    const index = list.findIndex((item) => item.id === analysis.id);
    if (index >= 0) {
      list[index] = analysis;
    } else {
      list.unshift(analysis);
    }
    writeDb(list);
  },

  delete: (id: string): boolean => {
    const list = readDb();
    const filtered = list.filter((item) => item.id !== id);
    if (filtered.length !== list.length) {
      writeDb(filtered);
      return true;
    }
    return false;
  },
};
