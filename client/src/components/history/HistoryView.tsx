import React from 'react';
import { History, FileText, Trash2, Download, Eye, ArrowRight } from 'lucide-react';
import { ResumeAnalysis } from '../../types';

interface HistoryViewProps {
  history: ResumeAnalysis[];
  onOpenAnalysis: (analysis: ResumeAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
  onDownloadPdf: (analysis: ResumeAnalysis) => void;
  onNavigateToUpload: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onOpenAnalysis,
  onDeleteAnalysis,
  onDownloadPdf,
  onNavigateToUpload,
}) => {
  if (history.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
          <History className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 font-display">
          No Past Analyses Yet
        </h3>
        <p className="text-sm text-slate-500">
          Upload your first resume to see your analysis history, score trends, and archived reports.
        </p>
        <button
          onClick={onNavigateToUpload}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
        >
          <span>Upload Resume</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-600" />
            <h2 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">
              Analysis History
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access previous audits, download PDF summaries, and review progress.
          </p>
        </div>

        <button
          onClick={onNavigateToUpload}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm self-start sm:self-auto"
        >
          <span>Analyze New Resume</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* History Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                    {item.filename}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {new Date(item.analyzed_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onDeleteAnalysis(item.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete from history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Score Badges */}
            <div className="flex items-center gap-3 pt-1">
              <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Overall Score</span>
                <span className="text-lg font-extrabold text-blue-700 font-display">{item.overall_score}/100</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">ATS Score</span>
                <span className="text-lg font-extrabold text-emerald-700 font-display">{item.ats_score}%</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => onOpenAnalysis(item)}
                className="font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Dashboard</span>
              </button>

              <button
                onClick={() => onDownloadPdf(item)}
                className="font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
