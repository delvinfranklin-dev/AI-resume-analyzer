import React, { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle, ArrowRight, Loader2, FileText, Sparkles } from 'lucide-react';
import { ResumeAnalysis, JobMatchResult } from '../../types';
import { matchJobDescription } from '../../services/api';

interface JobMatcherViewProps {
  currentAnalysis: ResumeAnalysis | null;
  initialRoleTitle?: string;
  onNavigateToUpload: () => void;
}

export const JobMatcherView: React.FC<JobMatcherViewProps> = ({
  currentAnalysis,
  initialRoleTitle = '',
  onNavigateToUpload,
}) => {
  const [jobTitle, setJobTitle] = useState(initialRoleTitle);
  const [jobDescription, setJobDescription] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleJd = `Senior Backend Engineer (Node.js & AWS)
Requirements:
- 4+ years building production microservices in TypeScript / Node.js
- Experience with PostgreSQL, Redis, Docker, and Kubernetes
- Solid understanding of AWS (Lambda, ECS, RDS, CloudWatch)
- CI/CD pipelines (GitHub Actions)
- Strong unit & integration testing practices
- Ability to mentor junior developers and lead technical designs`;

  const handleApplySampleJd = () => {
    setJobTitle('Senior Backend Engineer');
    setJobDescription(sampleJd);
  };

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description.');
      return;
    }

    if (!currentAnalysis) {
      setError('Please upload and analyze a resume first to run job matching.');
      return;
    }

    setError(null);
    setIsMatching(true);

    try {
      const result = await matchJobDescription({
        analysis_id: currentAnalysis.id,
        resume_text: currentAnalysis.raw_text,
        job_title: jobTitle.trim() || 'Target Role',
        job_description: jobDescription.trim(),
      });
      setMatchResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to match job description');
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 mb-3">
          <Target className="w-3.5 h-3.5 text-emerald-600" />
          <span>Target Job Description Matcher</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
          Resume vs. Job Description
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Paste any job posting to benchmark your resume against specific requirements and identify exact skill gaps.
        </p>
      </div>

      {/* Active Resume Indicator */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Candidate Resume</p>
            <h4 className="text-sm font-bold text-slate-900">
              {currentAnalysis ? currentAnalysis.filename : 'No resume uploaded yet'}
            </h4>
          </div>
        </div>

        {!currentAnalysis && (
          <button
            onClick={onNavigateToUpload}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
          >
            Upload Resume First
          </button>
        )}
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Job Posting Details
          </label>
          <button
            onClick={handleApplySampleJd}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
          >
            Insert Sample Job Description
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Job Title (Optional)
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Job Description / Requirements *
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description, requirements, responsibilities, and qualifications here..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50/50 font-sans"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-600 font-medium bg-rose-50 p-3 rounded-lg border border-rose-200">
            {error}
          </p>
        )}

        <button
          onClick={handleMatch}
          disabled={isMatching || !currentAnalysis}
          className="w-full py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isMatching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Match & Skill Gaps...</span>
            </>
          ) : (
            <>
              <span>Evaluate Match Compatibility</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Match Results Display */}
      {matchResult && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-fadeIn">
          {/* Score Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Compatibility Rating
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">
                {matchResult.job_title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-lg">{matchResult.summary}</p>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-200/80 self-start sm:self-auto">
              <div>
                <span className="text-xs text-emerald-800 font-bold block">Overall Match</span>
                <span className="text-3xl font-extrabold text-emerald-700 font-display">
                  {matchResult.match_percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Skills Breakdown: Matching vs Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matching Skills */}
            <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-3">
              <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matching Qualifications
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.matching_skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-emerald-800 border border-emerald-200"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Potential Gaps */}
            <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-100 space-y-3">
              <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Potential Skill Gaps
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.missing_skills && matchResult.missing_skills.length > 0 ? (
                  matchResult.missing_skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-amber-800 border border-amber-200"
                    >
                      ⚠ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No significant gaps detected!</span>
                )}
              </div>
            </div>
          </div>

          {/* Targeted Tailored Suggestions */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" /> Tailored Advice for This Application
            </h4>
            <ul className="space-y-2">
              {matchResult.tailored_suggestions?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
