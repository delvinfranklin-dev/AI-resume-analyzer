import React from 'react';
import { Sparkles, Code2, Wrench, Layers, Database, Cloud, Users, Key, AlertCircle } from 'lucide-react';
import { ResumeSkills, MissingSkill, KeywordAnalysis } from '../../types';

interface SkillsSectionProps {
  skills: ResumeSkills;
  missingSkills: MissingSkill[];
  keywordAnalysis: KeywordAnalysis;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  missingSkills,
  keywordAnalysis,
}) => {
  const skillCategories = [
    { label: 'Technical & Concepts', items: skills.technical || [], icon: Code2, color: 'brand' },
    { label: 'Programming Languages', items: skills.programming_languages || [], icon: Code2, color: 'blue' },
    { label: 'Frameworks & Libraries', items: skills.frameworks || [], icon: Layers, color: 'indigo' },
    { label: 'Databases & Storage', items: skills.databases || [], icon: Database, color: 'emerald' },
    { label: 'Cloud & Infrastructure', items: skills.cloud || [], icon: Cloud, color: 'sky' },
    { label: 'Developer Tools', items: skills.tools || [], icon: Wrench, color: 'slate' },
    { label: 'Soft & Leadership Skills', items: skills.soft || [], icon: Users, color: 'purple' },
  ].filter((cat) => cat.items.length > 0);

  const getPriorityBadge = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Detected Skills Grid */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Extracted Skills Profile
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified skills detected directly within your resume text.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {Object.values(skills).flat().length} Detected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/70 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <Icon className="w-4 h-4 text-brand-600" />
                  <span>{cat.label}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item, itemIdx) => (
                    <span
                      key={itemIdx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-800 shadow-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Missing Skills */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Recommended High-Value Skills
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Skills frequently paired with your profile that could strengthen your market positioning. (These are advisory suggestions, not verified gaps).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {missingSkills && missingSkills.length > 0 ? (
            missingSkills.map((skill, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:shadow-sm transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{skill.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(skill.priority)}`}>
                    {skill.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{skill.reason}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">No missing skill recommendations found.</p>
          )}
        </div>
      </div>

      {/* Keyword Analysis Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Industry Keyword Alignment
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Present Keywords */}
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Keywords Present
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {keywordAnalysis.present_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded bg-white text-emerald-800 border border-emerald-200 text-xs font-medium"
                >
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-100 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Important Missing Keywords
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {keywordAnalysis.missing_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded bg-white text-amber-800 border border-amber-200 text-xs font-medium"
                >
                  + {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Keywords */}
          <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-100 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              Recommended Additions
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {keywordAnalysis.important_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded bg-white text-blue-800 border border-blue-200 text-xs font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-[11px] text-slate-500">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold text-slate-700">Ethical Keyword Guidance:</span> Only include keywords representing skills you have genuinely used or studied. Avoid "keyword stuffing" or hidden white text, as modern parsers penalize artificial density.
          </p>
        </div>
      </div>
    </div>
  );
};
