import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanText } from '../services/parser/textCleaner.js';
import { detectSections } from '../services/parser/sectionDetector.js';
import { analyzeResumeHeuristically } from '../services/ai/heuristicEngine.js';

test('cleanText should normalize bullet points and whitespace', () => {
  const dirty = '  John Doe  \n\n\n• Built software\n● Managed team   ';
  const cleaned = cleanText(dirty);
  assert.ok(cleaned.includes('- Built software'));
  assert.ok(cleaned.includes('- Managed team'));
  assert.ok(!cleaned.includes('\n\n\n'));
});

test('detectSections should identify standard resume headings', () => {
  const resume = `ALEX CHEN
alex@example.com | (555) 123-4567

PROFESSIONAL SUMMARY
Senior engineer with 5 years experience.

TECHNICAL SKILLS
Python, JavaScript, React, Node.js, SQL

WORK EXPERIENCE
Senior Developer at CloudTech | 2021 - Present
- Built microservices

EDUCATION
B.S. in Computer Science | University of California`;

  const sections = detectSections(resume);
  assert.ok(sections.summary, 'Summary should be detected');
  assert.ok(sections.skills, 'Skills should be detected');
  assert.ok(sections.experience, 'Experience should be detected');
  assert.ok(sections.education, 'Education should be detected');
  assert.ok(sections.detectedCount >= 4, 'At least 4 sections should be detected');
});

test('analyzeResumeHeuristically should output complete schema', () => {
  const resume = `ALEX CHEN
alex@example.com | (555) 123-4567 | github.com/alexchen

PROFESSIONAL SUMMARY
Senior engineer with 6 years experience in TypeScript, React, and AWS.

TECHNICAL SKILLS
TypeScript, React, Node.js, PostgreSQL, AWS, Docker, Git

PROFESSIONAL EXPERIENCE
Senior Developer at Tech Corp | 2020 - Present
- Architected microservices improving API uptime to 99.98% across 10M daily users.
- Reduced p99 latency by 45% and saved $12,000 monthly in cloud costs.

EDUCATION
B.S. in Computer Science | UC Berkeley | 2019`;

  const result = analyzeResumeHeuristically(resume, 'test.pdf');

  assert.ok(typeof result.overall_score === 'number', 'Overall score should be a number');
  assert.ok(result.overall_score >= 0 && result.overall_score <= 100, 'Score should be between 0 and 100');
  assert.ok(typeof result.ats_score === 'number', 'ATS score should be a number');
  assert.ok(result.skills.programming_languages.includes('TypeScript'), 'Should extract TypeScript');
  assert.ok(result.skills.frameworks.includes('React'), 'Should extract React');
  assert.ok(result.strengths.length > 0, 'Should have strengths');
  assert.ok(result.job_recommendations.length >= 5, 'Should recommend at least 5 roles');
  assert.ok(result.action_plan.length >= 4, 'Should provide action plan');
  assert.ok(result.experience_analysis.quantifiable_achievements_detected >= 2, 'Should detect quantifiable metrics');
});
