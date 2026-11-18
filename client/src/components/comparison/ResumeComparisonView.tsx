import React, { useState } from 'react';
import { GitCompare, TrendingUp, TrendingDown, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { ResumeAnalysis } from '../../types';

interface ResumeComparisonViewProps {
  history: ResumeAnalysis[];
  onSelectAnalysis: (analysis: ResumeAnalysis) => void;
  onNavigateToUpload: () => void;
}

export const ResumeComparisonView: React.FC<ResumeComparisonViewProps> = ({
  history,
  onSelectAnalysis,
  onNavigateToUpload,
}) => {
  const [selectedAId, setSelectedAId] = useState<string>(history[0]?.id || '');
  const [selectedBId, setSelectedBId] = useState<string>(history[1]?.id || history[0]?.id || '');

  const resumeA = history.find((h) => h.id === selectedAId);
  const resumeB = history.find((h) => h.id === selectedBId);

  const scoreDiff = (resumeB?.overall_score || 0) - (resumeA?.overall_score || 0);
  const atsDiff = (resumeB?.ats_score || 0) - (resumeA?.ats_score || 0);

  // Skill difference computation
  const skillsA = new Set([
    ...(resumeA?.skills.technical || []),
    ...(resumeA?.skills.programming_languages || []),
    ...(resumeA?.skills.frameworks || []),
    ...(resumeA?.skills.databases || []),
    ...(resumeA?.skills.cloud || []),
  ]);

  const skillsB = new Set([
    ...(resumeB?.skills.technical || []),
    ...(resumeB?.skills.programming_languages || []),
    ...(resumeB?.skills.frameworks || []),
    ...(resumeB?.skills.databases || []),
    ...(resumeB?.skills.cloud || []),
  ]);

  const addedSkills = Array.from(skillsB).filter((x) => !skillsA.has(x));
  const removedSkills = Array.from(skillsA).filter((x) => !skillsB.has(x));

  if (history.length < 2) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto">
          <GitCompare className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 font-display">
          Compare Resume Versions
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Upload at least two resumes or test samples to see side-by-side score differentials, newly added skills, and ATS optimizations.
        </p>
        <button
          onClick={onNavigateToUpload}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
        >
          <span>Upload Another Resume</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 mb-3">
          <GitCompare className="w-3.5 h-3.5 text-indigo-600" />
          <span>Version Comparison</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
          Compare Resume Versions
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Measure score improvements and detect changes between draft revisions.
        </p>
      </div>

      {/* Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Version A */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Baseline Version (A)
          </label>
          <select
            value={selectedAId}
            onChange={(e) => setSelectedAId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          >
            {history.map((h) => (
              <option key={h.id} value={h.id}>
                {h.filename} ({h.overall_score}/100) — {new Date(h.analyzed_at).toLocaleDateString()}
              </option>
            ))}
          </select>

          {resumeA && (
            <div className="pt-2 flex items-center justify-between text-xs text-slate-600">
              <span>Overall Score: <strong className="text-slate-900">{resumeA.overall_score}</strong></span>
              <span>ATS Score: <strong className="text-slate-900">{resumeA.ats_score}%</strong></span>
            </div>
          )}
        </div>

        {/* Version B */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Comparison Version (B)
          </label>
          <select
            value={selectedBId}
            onChange={(e) => setSelectedBId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          >
            {history.map((h) => (
              <option key={h.id} value={h.id}>
                {h.filename} ({h.overall_score}/100) — {new Date(h.analyzed_at).toLocaleDateString()}
              </option>
            ))}
          </select>

          {resumeB && (
            <div className="pt-2 flex items-center justify-between text-xs text-slate-600">
              <span>Overall Score: <strong className="text-slate-900">{resumeB.overall_score}</strong></span>
              <span>ATS Score: <strong className="text-slate-900">{resumeB.ats_score}%</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Delta Score Banner */}
      {resumeA && resumeB && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Overall Score Diff */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              scoreDiff >= 0 ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
            }`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Overall Score Change
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">
                  {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} Points
                </h4>
              </div>
              {scoreDiff >= 0 ? (
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold">
                  <TrendingDown className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* ATS Score Diff */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              atsDiff >= 0 ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
            }`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  ATS Score Change
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">
                  {atsDiff > 0 ? `+${atsDiff}` : atsDiff}%
                </h4>
              </div>
              {atsDiff >= 0 ? (
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold">
                  <TrendingDown className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          {/* Skill Additions / Removals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Newly Added Skills in Version B ({addedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {addedSkills.length > 0 ? (
                  addedSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      + {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No new skills added.</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Omitted from Version B ({removedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {removedSkills.length > 0 ? (
                  removedSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      - {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills omitted.</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 text-xs">
            <button
              onClick={() => onSelectAnalysis(resumeA)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-1.5"
            >
              <span>Open Version A in Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectAnalysis(resumeB)}
              className="px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 font-semibold flex items-center gap-1.5"
            >
              <span>Open Version B in Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
