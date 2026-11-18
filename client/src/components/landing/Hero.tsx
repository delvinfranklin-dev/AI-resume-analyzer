import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, FileText } from 'lucide-react';
import { SAMPLE_RESUMES } from '../../utils/sampleResumes';

interface HeroProps {
  onAnalyzeClick: () => void;
  onSampleSelect: (sampleId: string) => void;
  onSeeHowItWorks: () => void;
  loadingSample: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onAnalyzeClick,
  onSampleSelect,
  onSeeHowItWorks,
  loadingSample,
}) => {
  return (
    <div className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-300/30 to-sky-200/20 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Next-Generation Resume Intelligence & ATS Scanner</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display max-w-4xl mx-auto leading-[1.15]">
          Analyze Your Resume.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-sky-600 to-indigo-600">
            Improve Your Career.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload your resume and get an AI-powered analysis of your skills, ATS compatibility, strengths, weaknesses, and ideal job roles.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onAnalyzeClick}
            id="hero-analyze-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25 active:scale-95 transition-all text-base"
          >
            <span>Analyze My Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onSeeHowItWorks}
            id="hero-how-it-works-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm active:scale-95 transition-all text-base"
          >
            <span>See How It Works</span>
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free instant audit
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-500" /> 100% private & secure
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> Multi-format: PDF, DOCX, TXT
          </span>
        </div>

        {/* Instant Sample Resume Launcher */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Or test instantly with a pre-loaded sample resume:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_RESUMES.map((sample) => (
              <button
                key={sample.id}
                disabled={loadingSample}
                onClick={() => onSampleSelect(sample.id)}
                className="flex flex-col items-start text-left p-3.5 rounded-xl bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 shadow-sm transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-2 w-full mb-1">
                  <FileText className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-xs text-slate-900 group-hover:text-brand-700 truncate">
                    {sample.name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 truncate w-full">
                  {sample.role}
                </span>
                <span className="text-[10px] text-brand-600 font-medium mt-1">
                  Test this profile →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
