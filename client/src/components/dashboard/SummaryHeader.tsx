import React from 'react';
import { Download, Sparkles, AlertCircle, Briefcase, FileText, ArrowUpRight } from 'lucide-react';
import { ResumeAnalysis } from '../../types';

interface SummaryHeaderProps {
  analysis: ResumeAnalysis;
  onDownloadPdf: () => void;
  onOpenJobMatcher: () => void;
}

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({
  analysis,
  onDownloadPdf,
  onOpenJobMatcher,
}) => {
  const overallScore = analysis.overall_score || 0;
  const atsScore = analysis.ats_score || 0;

  // SVG Circular Gauge helper
  const renderCircleGauge = (score: number, strokeColor: string) => {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            {score}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 -mt-1">
            / 100
          </span>
        </div>
      </div>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#0267ca'; // brand blue
    if (score >= 65) return '#059669'; // emerald
    if (score >= 50) return '#d97706'; // amber
    return '#dc2626'; // rose
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: 'Exceptional', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score >= 70) return { label: 'Competitive', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (score >= 50) return { label: 'Needs Polish', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Action Required', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const overallBadge = getScoreBadge(overallScore);

  return (
    <div className="space-y-6">
      {/* Top Banner with File Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight font-display">
                {analysis.filename}
              </h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${overallBadge.bg}`}>
                {overallBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Analyzed on {new Date(analysis.analyzed_at).toLocaleDateString()} at{' '}
              {new Date(analysis.analyzed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenJobMatcher}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all"
          >
            <span>Match With Job Description</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={onDownloadPdf}
            id="download-pdf-btn"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-500/25 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Top Cards: Scores & Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Score Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Overall Resume Score
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">
              {overallScore} <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[140px]">
              Weighted across skills, experience, achievements & ATS rules.
            </p>
          </div>
          {renderCircleGauge(overallScore, getScoreColor(overallScore))}
        </div>

        {/* ATS Compatibility Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              ATS Compatibility
            </span>
            <h3 className="text-2xl font-extrabold text-brand-600 font-display mt-0.5">
              {atsScore}%
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Estimated parser rating: <span className="font-bold text-slate-700">{analysis.ats_analysis.rating || 'Good'}</span>
            </p>
          </div>
          {renderCircleGauge(atsScore, '#0267ca')}
        </div>

        {/* Top Strength Card */}
        <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/90 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Top Strength
            </span>
            <h4 className="font-bold text-slate-900 text-sm mt-1.5 line-clamp-2">
              {analysis.top_strength || 'Strong technical skill coverage'}
            </h4>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Clearly communicated to recruiters and screening systems.
          </p>
        </div>

        {/* Main Improvement Card */}
        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100/90 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Main Improvement
            </span>
            <h4 className="font-bold text-slate-900 text-sm mt-1.5 line-clamp-2">
              {analysis.main_improvement || 'Add measurable metrics to work bullets'}
            </h4>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            High-leverage change to maximize interview calls.
          </p>
        </div>
      </div>

      {/* Best Job Match Highlight Banner */}
      {analysis.best_job_match && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">
                Best Job Match
              </p>
              <h4 className="font-extrabold text-base tracking-tight font-display">
                {analysis.best_job_match.role}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-right">
              <span className="text-2xl font-black font-display">{analysis.best_job_match.match_percentage}%</span>
              <p className="text-[10px] text-blue-200">Role Match Score</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
