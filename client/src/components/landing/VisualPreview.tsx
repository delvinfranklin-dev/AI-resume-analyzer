import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, ShieldCheck, Briefcase } from 'lucide-react';

export const VisualPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ats' | 'skills'>('overview');

  return (
    <section className="py-16 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Interactive Preview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3 font-display">
            A Glimpse of Your Analysis Dashboard
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Instant insights, objective scoring, and prioritized action steps designed to get you interviewed.
          </p>
        </div>

        {/* Mockup Frame */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/90 overflow-hidden">
          {/* Browser / Mockup Header */}
          <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="text-xs font-mono text-slate-400 ml-2">resume-analyzer.ai/dashboard</span>
            </div>
            {/* Interactive Preview Tabs */}
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('overview')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('ats')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeTab === 'ats'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ATS Breakdown
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeTab === 'skills'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Skills & Gaps
              </button>
            </div>
          </div>

          {/* Mockup Body */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50/50">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-500 flex items-center justify-center font-extrabold text-blue-700 text-lg">
                      84
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Overall Score</p>
                      <p className="text-xs text-blue-700 font-semibold">Strong Profile</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center font-extrabold text-emerald-700 text-lg">
                      88%
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ATS Match</p>
                      <p className="text-xs text-emerald-700 font-semibold">Ready for submission</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 sm:col-span-2 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Top Recommended Role</p>
                      <p className="text-sm font-bold text-purple-900 flex items-center gap-1.5 mt-0.5">
                        <Briefcase className="w-4 h-4 text-purple-600" /> Senior Backend Engineer
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-200/80 text-purple-800">
                      94% Match
                    </span>
                  </div>
                </div>

                {/* Strengths and Weaknesses Snapshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5 mb-2 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Strengths Detected
                    </p>
                    <ul className="space-y-1.5 text-slate-600">
                      <li>• High concentration of quantified impact metrics ($14K saved, 40% latency drop).</li>
                      <li>• Clean section hierarchy adhering to standard ATS parsing schemas.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5 mb-2 text-amber-700">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> Recommended Tweaks
                    </p>
                    <ul className="space-y-1.5 text-slate-600">
                      <li>• Expand professional summary with target title and primary tech stack.</li>
                      <li>• Add Terraform or CI/CD keyword tags in the core competencies section.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ats' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-600" /> ATS Compatibility Audit (88/100)
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Formatting & Layout Standards</span>
                      <span className="font-bold text-emerald-600">95% (Pass)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '95%' }} />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-600">Keyword Density & Industry Terms</span>
                      <span className="font-bold text-brand-600">85% (Good)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-brand-500 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-600">Section Header Standardization</span>
                      <span className="font-bold text-emerald-600">100% (Pass)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 text-sm mb-2.5">Detected Technical Stack</h4>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Redis'].map(
                      (skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-2 text-amber-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> High-Value Missing Skills (Recommended)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      Kubernetes <span className="text-[10px] font-bold text-amber-600">(High Priority)</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                      Terraform <span className="text-[10px] font-bold text-slate-500">(Medium Priority)</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
