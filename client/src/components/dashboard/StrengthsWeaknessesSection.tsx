import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';

interface StrengthsWeaknessesProps {
  strengths: { title: string; explanation: string }[];
  weaknesses: { title: string; explanation: string; suggestion: string }[];
  actionPlan: { step: number; title: string; description: string; priority: 'High' | 'Medium' | 'Low' }[];
}

export const StrengthsWeaknessesSection: React.FC<StrengthsWeaknessesProps> = ({
  strengths,
  weaknesses,
  actionPlan,
}) => {
  const getPriorityColor = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Side-by-side Strengths vs Areas Needing Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Key Strengths
              </h3>
              <p className="text-xs text-slate-500">Elements that effectively showcase your value.</p>
            </div>
          </div>

          <div className="space-y-4">
            {strengths && strengths.length > 0 ? (
              strengths.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100/80 space-y-1"
                >
                  <p className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span> {item.title}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed pl-4">
                    {item.explanation}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No specific strengths detected.</p>
            )}
          </div>
        </div>

        {/* Areas That Need Improvement */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Areas That Need Improvement
              </h3>
              <p className="text-xs text-slate-500">Actionable revisions supported by your resume.</p>
            </div>
          </div>

          <div className="space-y-4">
            {weaknesses && weaknesses.length > 0 ? (
              weaknesses.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-amber-50/40 border border-amber-100/80 space-y-2"
                >
                  <p className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                    <span className="text-amber-600">⚠</span> {item.title}
                  </p>
                  <p className="text-xs text-slate-600 pl-4">{item.explanation}</p>
                  {item.suggestion && (
                    <div className="ml-4 p-2.5 rounded-lg bg-white border border-amber-200/70 text-xs text-slate-700 flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <p>
                        <span className="font-semibold text-amber-900">Suggestion:</span>{' '}
                        {item.suggestion}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No critical weaknesses found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Action Plan & Roadmap */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-600" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Top 5 Actionable Steps to Improve Your Resume
            </h3>
            <p className="text-xs text-slate-500">Prioritized checklist for immediate revision.</p>
          </div>
        </div>

        <div className="space-y-3">
          {actionPlan && actionPlan.length > 0 ? (
            actionPlan.map((plan, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white hover:border-brand-300 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {plan.step || idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{plan.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{plan.description}</p>
                  </div>
                </div>

                <span
                  className={`self-start sm:self-center px-2.5 py-1 rounded text-[11px] font-bold border shrink-0 ${getPriorityColor(
                    plan.priority
                  )}`}
                >
                  {plan.priority} Priority
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">No action plan generated.</p>
          )}
        </div>
      </div>
    </div>
  );
};
