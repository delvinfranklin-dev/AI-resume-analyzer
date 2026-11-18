import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

interface AnalysisLoaderProps {
  fileName: string;
}

interface Step {
  id: number;
  label: string;
}

const STEPS: Step[] = [
  { id: 1, label: 'Reading and validating resume file' },
  { id: 2, label: 'Extracting structured sections & work history' },
  { id: 3, label: 'Identifying technical, framework & soft skills' },
  { id: 4, label: 'Evaluating ATS compatibility & formatting penalties' },
  { id: 5, label: 'Benchmarking against top industry job roles' },
  { id: 6, label: 'Generating prioritized improvement recommendations' },
];

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ fileName }) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length ? prev + 1 : prev));
    }, 1100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-slate-200 text-center animate-fadeIn">
      {/* Animated icon */}
      <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center mx-auto mb-5">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 font-display">
        Analyzing Your Resume...
      </h3>
      <p className="text-xs text-slate-500 mt-1 mb-6 truncate max-w-sm mx-auto">
        Processing: <span className="font-semibold text-slate-700">{fileName}</span>
      </p>

      {/* Progress Steps List */}
      <div className="space-y-3.5 text-left max-w-md mx-auto">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 text-sm transition-all ${
                isDone
                  ? 'text-emerald-700 font-medium'
                  : isCurrent
                  ? 'text-brand-600 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-brand-600 animate-spin shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span className="text-xs sm:text-sm">{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <span>Our AI evaluates 40+ ATS criteria and quantifiable impact metrics</span>
      </div>
    </div>
  );
};
