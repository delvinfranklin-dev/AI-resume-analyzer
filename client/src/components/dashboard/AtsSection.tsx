import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { AtsAnalysis } from '../../types';

interface AtsSectionProps {
  atsAnalysis: AtsAnalysis;
}

export const AtsSection: React.FC<AtsSectionProps> = ({ atsAnalysis }) => {
  const metrics = [
    { label: 'Formatting & Typography', value: atsAnalysis.formatting, desc: 'Clean margins, standard font usage, no tables or complex text columns' },
    { label: 'Keyword Density', value: atsAnalysis.keywords, desc: 'Frequency of role-specific tech terms and industry buzzwords' },
    { label: 'Structure & Hierarchy', value: atsAnalysis.structure, desc: 'Logical flow: Contact -> Summary -> Experience -> Education' },
    { label: 'Automated Readability', value: atsAnalysis.readability, desc: 'Sentence length, action verb consistency, and bullet clarity' },
    { label: 'Section Completeness', value: atsAnalysis.section_completeness, desc: 'Presence of all standard required recruiter sections' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-slate-900 font-display">
              ATS Compatibility Audit
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Applicant Tracking Systems evaluate document readability, layout structure, and machine-parsable text.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/80">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 block">Overall ATS Rating</span>
            <span className="text-base font-extrabold text-brand-600 font-display">
              {atsAnalysis.rating || 'Good'} ({atsAnalysis.score || 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bars for Detailed ATS Dimensions */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Scoring Breakdown
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{m.label}</span>
                <span className="font-bold text-slate-900">{m.value}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    m.value >= 80
                      ? 'bg-emerald-500'
                      : m.value >= 60
                      ? 'bg-brand-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, m.value))}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detected ATS Issues & Passed Checks */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Inspection Results & System Feedback
        </h4>

        <div className="space-y-2.5">
          {atsAnalysis.issues && atsAnalysis.issues.length > 0 ? (
            atsAnalysis.issues.map((issue, idx) => {
              const isPass = issue.type === 'pass';
              const isWarning = issue.type === 'warning';

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                    isPass
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                      : isWarning
                      ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                      : 'bg-rose-50/60 border-rose-200 text-rose-900'
                  }`}
                >
                  {isPass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-0.5">
                    <p className="font-semibold">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="text-xs opacity-85">{issue.suggestion}</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-500 italic">No critical ATS issues detected.</p>
          )}
        </div>
      </div>

      {/* Legal & Realistic ATS Disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-[11px] text-slate-500">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-slate-700">Advisory Note:</span> ATS scores are algorithmic estimates benchmarked against typical enterprise parsing rules (Workday, Greenhouse, Lever). They do not guarantee passing any specific employer's proprietary screening filter.
        </p>
      </div>
    </div>
  );
};
