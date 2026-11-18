# AI Resume Analyzer 📄🤖

A modern, production-grade **AI Resume Analyzer** web application that evaluates candidate resumes for **ATS compatibility, skills alignment, strengths & weaknesses, quantifiable impact metrics, and tailored job recommendations**.

---

## 🌟 Key Features

### 1. 🧠 AI & Algorithmic Resume Analysis
- Objective, comprehensive evaluation powered by Large Language Models (Google Gemini / OpenAI) with a built-in deterministic heuristic fallback engine.
- Extracts and categorizes verified skills: **Programming Languages, Frameworks, Databases, Cloud & DevOps, Tools, and Soft Skills**.
- Strictly adheres to ground truth—never hallucinates skills or credentials not present in the document.

### 2. 📊 ATS Compatibility Audit
- Measures formatting, keyword density, section hierarchy, and automated parser readability.
- Generates an estimated ATS Compatibility Score (0–100%) and categorizes rating (*Poor, Fair, Good, Excellent*).
- Interactive checklist highlighting passed checks, warnings, and missing standard headers.

### 3. 🎯 Role Alignment & Career Recommendations
- Suggests 5+ tailored job roles with real-time match percentages, reasoning, matching qualifications, and potential gaps.
- Actionable steps for bridging skill gaps for each role.

### 4. 📈 Work Experience & Quantifiable Achievements Audit
- Audits bullet points for measurable outcomes (percentages, dollar amounts, scale metrics).
- Benchmarks passive descriptions against high-impact action-driven formulas.

### 5. 🎯 Target Job Description Matcher
- Paste any job posting description to benchmark your active resume against specific job requirements.
- Identifies matching skills, missing critical keywords, and targeted recommendations for that specific application.

### 6. 🔄 Resume Version Comparison
- Compare two drafts or revisions side-by-side.
- Inspect score differentials (+/- points), ATS optimization deltas, and newly added vs omitted skills.

### 7. 📥 Professional PDF Report Export
- Download an executive summary PDF report detailing scores, ATS metrics, strengths, weaknesses, and a 5-step action plan.

### 8. 🛡️ Privacy & Security First
- Multi-format support: **PDF, DOCX, and TXT** (up to 10 MB).
- Uploaded files are processed in memory; extracted resume text and analysis are saved in the server's local history file (`server/data/analyses.json`) until deleted.
- API keys are strictly kept server-side; never exposed to frontend code.
- Rate limiting and input sanitization enabled by default.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS with custom glassmorphism & typography
- **Icons**: Lucide React
- **Visuals**: SVG Circular Gauges, dynamic progress bars
- **PDF Generation**: jsPDF (Client-side) & PDFKit (Server-side)

### Backend
- **Runtime**: Node.js & Express
- **Language**: TypeScript (compiled with `tsx` / `tsc`)
- **Parsers**: `pdf-parse` (PDF extraction), `mammoth` (DOCX extraction)
- **Security & Upload**: `multer` (in-memory buffer), `express-rate-limit`, `cors`
- **Database**: File-based persistent JSON store with sample pre-seeding
- **AI Integration**: Dual-engine strategy supporting Google Gemini API, OpenAI API, or offline rule-based heuristic parser

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Installation

Clone the repository and install dependencies for both frontend and backend:

```bash
# In the project root:
npm run install:all
```

Or install individually:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` in the root:

```bash
cp .env.example .env
```

Edit `.env` to configure your AI provider (optional; works out of the box with heuristic engine):

```env
PORT=5000
NODE_ENV=development

# To use Google Gemini:
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-1.5-flash

# To use OpenAI or compatible (Groq, OpenRouter, Ollama):
# AI_PROVIDER=openai
# AI_API_KEY=your_openai_api_key_here
# AI_MODEL=gpt-4o-mini
# AI_BASE_URL=https://api.openai.com/v1

MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:5173
```

> **Note:** If `AI_API_KEY` is left blank, the application seamlessly runs using its deterministic Heuristic NLP Engine.

### 3. Running the Application

To start both frontend and backend concurrently:

```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/resume/analyze` | Upload and analyze a resume file (`multipart/form-data`) |
| `POST` | `/api/resume/sample/:sampleId` | Analyze a preloaded sample resume |
| `POST` | `/api/resume/match-job` | Match resume against a target job description |
| `GET` | `/api/analysis` | Retrieve all past saved analyses |
| `GET` | `/api/analysis/:id` | Retrieve an analysis by ID |
| `GET` | `/api/analysis/compare?a={id}&b={id}` | Compare two analyses side-by-side |
| `DELETE` | `/api/analysis/:id` | Delete an analysis record |
| `GET` | `/api/analysis/:id/pdf` | Stream generated PDF report |
| `GET` | `/api/health` | Service health status check |

---

## 🧪 Testing

Run backend unit tests:

```bash
cd server
npm test
```

---

## 🚢 Deployment

### Deploying Frontend (Vercel / Netlify)
1. Build client bundle: `cd client && npm run build`
2. Set build directory to `client/dist`.
3. Configure `VITE_API_BASE_URL` if hosting backend on a separate domain.

### Deploying Backend (Render / Railway / Fly.io)
1. Set start command: `npm --prefix server start`
2. Configure production environment variables (`AI_API_KEY`, `PORT`, `CORS_ORIGIN`).

---

## 📄 License
MIT License. Built for job seekers, recruiters, and career development.
