import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Code2, Briefcase, AlertTriangle, Layers, FileText } from 'lucide-react';
import { ResumeAnalysis } from '../../types';
import { SummaryHeader } from './SummaryHeader';
import { AtsSection } from './AtsSection';
import { SkillsSection } from './SkillsSection';
import { JobMatchesSection } from './JobMatchesSection';
import { ExperienceSection } from './ExperienceSection';
import { StrengthsWeaknessesSection } from './StrengthsWeaknessesSection';

interface DashboardViewProps {
  analysis: ResumeAnalysis;
  onDownloadPdf: () => void;
  onOpenJobMatcher: () => void;
  onSelectRoleForMatch: (role: string) => void;
}

type TabType = 'overview' | 'ats' | 'skills' | 'jobs' | 'experience' | 'improvements';

export const DashboardView: React.FC<DashboardViewProps> = ({
  analysis,
  onDownloadPdf,
  onOpenJobMatcher,
  onSelectRoleForMatch,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'ats', label: 'ATS Audit', icon: ShieldCheck },
    { id: 'skills', label: 'Skills & Keywords', icon: Code2 },
    { id: 'jobs', label: 'Job Roles', icon: Briefcase },
    { id: 'experience', label: 'Experience & Impact', icon: Layers },
    { id: 'improvements', label: 'Strengths & Gaps', icon: AlertTriangle },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Top Summary & Scores */}
      <SummaryHeader
        analysis={analysis}
        onDownloadPdf={onDownloadPdf}
        onOpenJobMatcher={onOpenJobMatcher}
      />

      {/* Internal Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 shadow-xs border border-brand-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Executive Profile Summary */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <FileText className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Executive Profile Assessment
                </h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {analysis.profile_summary ||
                  'Your resume showcases relevant experience with clear technical proficiency. With targeted quantified metrics and ATS alignment, your profile can be substantially strengthened for competitive tech and leadership positions.'}
              </p>
            </div>

            {/* Side-by-side Top Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <JobMatchesSection
                jobRecommendations={analysis.job_recommendations.slice(0, 3)}
                onSelectRoleForMatch={onSelectRoleForMatch}
              />
              <AtsSection atsAnalysis={analysis.ats_analysis} />
            </div>

            {/* Quick Strengths and Weaknesses snapshot */}
            <StrengthsWeaknessesSection
              strengths={analysis.strengths.slice(0, 3)}
              weaknesses={analysis.weaknesses.slice(0, 3)}
              actionPlan={analysis.action_plan.slice(0, 5)}
            />
          </div>
        )}

        {activeTab === 'ats' && <AtsSection atsAnalysis={analysis.ats_analysis} />}

        {activeTab === 'skills' && (
          <SkillsSection
            skills={analysis.skills}
            missingSkills={analysis.missing_skills}
            keywordAnalysis={analysis.keyword_analysis}
          />
        )}

        {activeTab === 'jobs' && (
          <JobMatchesSection
            jobRecommendations={analysis.job_recommendations}
            onSelectRoleForMatch={onSelectRoleForMatch}
          />
        )}

        {activeTab === 'experience' && (
          <ExperienceSection
            experienceAnalysis={analysis.experience_analysis}
            educationAnalysis={analysis.education_analysis}
            projectsAnalysis={analysis.projects_analysis}
          />
        )}

        {activeTab === 'improvements' && (
          <StrengthsWeaknessesSection
            strengths={analysis.strengths}
            weaknesses={analysis.weaknesses}
            actionPlan={analysis.action_plan}
          />
        )}
      </div>
    </div>
  );
};
