import React from 'react';
import { FileText, Sparkles, History, GitCompare, Target, UploadCloud } from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'upload' | 'dashboard' | 'job-matcher' | 'compare' | 'history';
  setCurrentTab: (tab: 'landing' | 'upload' | 'dashboard' | 'job-matcher' | 'compare' | 'history') => void;
  hasAnalysis: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, hasAnalysis }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-display">
                  Resume<span className="text-brand-600">AI</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-0.5 hidden sm:block">ATS & Career Intelligence</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'landing'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {hasAnalysis && (
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentTab === 'dashboard'
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                Dashboard
              </button>
            )}

            <button
              onClick={() => setCurrentTab('job-matcher')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'job-matcher'
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              Job Matcher
            </button>

            <button
              onClick={() => setCurrentTab('compare')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'compare'
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5 text-indigo-500" />
              Compare
            </button>

            <button
              onClick={() => setCurrentTab('history')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'history'
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              History
            </button>
          </nav>

          {/* Primary Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('upload')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm hover:shadow shadow-brand-500/25 active:scale-95 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Resume</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
