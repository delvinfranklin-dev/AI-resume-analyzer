export interface SampleResume {
  id: string;
  name: string;
  role: string;
  level: string;
  summary: string;
  content: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'senior-fullstack',
    name: 'Alex Chen',
    role: 'Senior Full Stack Engineer',
    level: 'Senior (6+ Years)',
    summary: 'Strong technical resume with microservices, React, Node.js, AWS, and quantified impact metrics.',
    content: `ALEX CHEN
San Francisco, CA | alex.chen@example.com | (555) 234-5678 | linkedin.com/in/alexchen-dev | github.com/alexchen

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Engineer with 6+ years of experience designing and scaling distributed web applications and cloud architectures. Proven track record of reducing latency by 40% and leading agile engineering teams of 8+ developers. Passionate about TypeScript, React, Go, and cloud-native systems.

TECHNICAL SKILLS
- Programming Languages: TypeScript, JavaScript, Python, Go, SQL
- Frameworks & Libraries: React, Next.js, Node.js, Express, NestJS, Tailwind CSS
- Databases: PostgreSQL, MongoDB, Redis
- Cloud & DevOps: AWS (ECS, Lambda, S3, RDS), Docker, Kubernetes, CI/CD (GitHub Actions), Terraform
- Tools: Git, Jira, Postman, Jest, Cypress

PROFESSIONAL EXPERIENCE
Senior Full Stack Engineer | CloudScale Technologies, San Francisco, CA | 2022 - Present
- Architected and deployed microservices handling 25M+ daily requests, improving API uptime from 99.2% to 99.98%.
- Led frontend redesign using Next.js and Tailwind CSS, reducing First Contentful Paint (FCP) by 45% and boosting conversion by 18%.
- Spearheaded database query optimization across PostgreSQL clusters, saving $14,000 in monthly cloud infrastructure costs.
- Mentored 4 junior and mid-level engineers through code reviews, design documentation, and weekly 1:1 sessions.

Full Stack Software Engineer | Horizon Fintech, New York, NY | 2019 - 2022
- Developed secure payment processing workflows using Node.js and Stripe API, processing over $8M in transaction volume annually.
- Integrated Redis caching layer for high-throughput product catalog queries, reducing p99 response times from 850ms to 95ms.
- Built automated end-to-end testing pipeline with Cypress and GitHub Actions, cutting regression cycle time by 60%.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | Graduated: 2019

PROJECTS
DevPulse - Real-time Distributed Monitoring Dashboard
- Built open-source monitoring tool with React, WebSockets, Go, and InfluxDB; gained 1,200+ GitHub stars.
- Implemented real-time anomaly detection alerts using statistical moving averages.

CERTIFICATIONS
- AWS Certified Solutions Architect - Associate (2023)`
  },
  {
    id: 'data-scientist',
    name: 'Sarah Miller',
    role: 'Data Scientist & ML Engineer',
    level: 'Mid-Senior (4 Years)',
    summary: 'Data science resume with Python, PyTorch, predictive modeling, NLP, and SQL analytics.',
    content: `SARAH MILLER
Chicago, IL | sarah.miller@example.com | (555) 789-0123 | linkedin.com/in/sarahmiller-ds | github.com/smiller-data

PROFESSIONAL SUMMARY
Analytical and detail-oriented Data Scientist with 4 years of experience delivering machine learning models, statistical analysis, and automated predictive pipelines. Expertise in Python, PyTorch, Scikit-Learn, SQL, and business intelligence visualization. Reduced customer churn by 14% through predictive ensemble modeling.

CORE COMPETENCIES
- Machine Learning & AI: Supervised/Unsupervised Learning, Natural Language Processing (NLP), Random Forest, XGBoost, PyTorch, TensorFlow
- Data Analysis & Statistics: Hypothesis Testing, A/B Testing, Regression, Time Series Analysis
- Programming & Querying: Python, R, SQL, Pandas, NumPy
- Data Engineering & Tools: Apache Spark, Snowflake, Airflow, Docker, Git
- Visualization: Tableau, Power BI, Matplotlib, Seaborn

WORK EXPERIENCE
Data Scientist | Optima Analytics, Chicago, IL | 2021 - Present
- Developed customer lifetime value (LTV) and churn prediction models with XGBoost, improving retention rates by 14% within 6 months.
- Designed and evaluated 35+ A/B experiments on onboarding workflows, collaborating with product managers to lift engagement by 22%.
- Built automated ETL data pipelines in Python and Apache Airflow, processing 3TB of daily telemetric data into Snowflake data warehouse.
- Created executive Tableau dashboards tracking enterprise KPIs used weekly by C-suite executives.

Junior Data Analyst | RetailMetrics Inc., Austin, TX | 2020 - 2021
- Queried large-scale transactional datasets with complex SQL window functions to uncover inventory demand anomalies.
- Automated weekly performance reporting scripts in Python, saving the business intelligence team 8 hours per week.

EDUCATION
Master of Science in Data Science | Northwestern University | 2020
Bachelor of Science in Statistics | University of Illinois at Urbana-Champaign | 2018

NOTABLE PROJECTS
EcoSense: NLP Sentiment Classifier
- Fine-tuned BERT model on customer sentiment feedback with 91.4% F1-score across 50,000 product reviews.
- Deployed lightweight inference service using FastAPI and Docker container on AWS EC2.`
  },
  {
    id: 'junior-frontend',
    name: 'Jordan Lee',
    role: 'Junior Frontend Developer',
    level: 'Entry-Level (1 Year)',
    summary: 'Entry-level frontend resume with core HTML/CSS/JS/React skills, good candidate for improvement suggestions.',
    content: `JORDAN LEE
Austin, TX | jordan.lee@example.com | (555) 345-6789 | github.com/jordanlee-web

OBJECTIVE
Motivated Junior Frontend Developer seeking an entry-level position to build user-friendly web interfaces and collaborate on dynamic web applications.

SKILLS
- HTML5, CSS3, JavaScript, React, Git, responsive design, Figma

EXPERIENCE
Junior Web Developer Intern | BlueSky Digital Agency | 2023 - 2024
- Worked on client websites using HTML, CSS, and JavaScript.
- Assisted the design team with responsive mobile layouts.
- Fixed bugs and improved styling across landing pages.
- Participated in daily standups and sprint planning.

PROJECTS
Task Manager App
- Built a to-do list web app using React and LocalStorage.
- Allowed users to add, edit, and filter tasks by status.

Weather Finder
- Created a weather lookup website fetching forecast data from OpenWeather API.
- Implemented search by city and responsive cards.

EDUCATION
Bachelor of Arts in Digital Media | Texas State University | 2023`
  }
];
