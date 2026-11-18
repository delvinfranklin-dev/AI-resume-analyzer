import React from 'react';
import { ShieldCheck, Lock, FileCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 font-display">
                AI Resume Analyzer
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed mb-4">
              Production-grade career intelligence evaluating ATS compatibility, skills alignment, quantifiable impact, and tailored job recommendations.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure Processing
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-brand-600" /> Private & Confidential
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Features</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>ATS Compatibility Audit</li>
              <li>Skill & Keyword Detection</li>
              <li>Quantified Metrics Check</li>
              <li>Target Job Matching</li>
              <li>PDF Analysis Reports</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Privacy & Ethics</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              We treat your resume with strict confidentiality. Files are processed securely in memory and are never used to train public models. Scores are advisory benchmarks.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AI Resume Analyzer. Built for ambitious professionals.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for career excellence
          </p>
        </div>
      </div>
    </footer>
  );
};
