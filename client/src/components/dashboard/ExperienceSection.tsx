import React from 'react';
import { Briefcase, GraduationCap, FolderGit2, CheckCircle2, AlertTriangle, Hash } from 'lucide-react';
import { ExperienceAnalysis, EducationAnalysis, ProjectAnalysis } from '../../types';

interface ExperienceSectionProps {
  experienceAnalysis: ExperienceAnalysis;
  educationAnalysis: EducationAnalysis;
  projectsAnalysis?: ProjectAnalysis;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experienceAnalysis,
  educationAnalysis,
  projectsAnalysis,
}) => {
  return (
    <div className="space-y-8">
      {/* Experience Analysis Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Work Experience Evaluation
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
              {experienceAnalysis.level || 'Professional'} (~{experienceAnalysis.years_estimated || 0} Years)
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              Quality: {experienceAnalysis.quality || 'Good'}
            </span>
          </div>
        </div>

        {/* Quantifiable Achievements Counter */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Quantifiable Metrics Detected:{' '}
                <span className="text-brand-600 font-extrabold text-base">
                  {experienceAnalysis.quantifiable_achievements_detected || 0}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                Resumes with quantifiable outcomes ($ saved, % growth, latency drops) receive 40% more recruiter screening calls.
              </p>
            </div>
          </div>
        </div>

        {/* Comments & Observations */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Observations & Impact Feedback
          </h4>
          <ul className="space-y-2">
            {experienceAnalysis.comments?.map((comment, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                <span>{comment}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Example Bullet Point Transformation */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
          <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Bullet Point Impact Benchmark
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
              <span className="font-bold flex items-center gap-1 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Weak (Passive / No Impact):
              </span>
              <p className="text-xs italic">"Worked on building frontend features and fixing bugs."</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <span className="font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Strong (Active + Quantified):
              </span>
              <p className="text-xs italic">"Architected dynamic React dashboards, decreasing load latency by 35% across 50,000 MAUs."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Education & Projects Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Education Analysis */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Education Analysis
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            {educationAnalysis.degree_detected && (
              <p className="text-slate-700">
                <span className="font-bold text-slate-900">Degree:</span> {educationAnalysis.degree_detected}
              </p>
            )}
            {educationAnalysis.institution_detected && (
              <p className="text-slate-700">
                <span className="font-bold text-slate-900">Institution:</span> {educationAnalysis.institution_detected}
              </p>
            )}
            <p className="text-slate-700">
              <span className="font-bold text-slate-900">Structure Quality:</span> {educationAnalysis.quality || 'Complete'}
            </p>
          </div>

          <div className="space-y-1.5 pt-2">
            {educationAnalysis.comments?.map((c, i) => (
              <p key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                <span className="text-brand-500 font-bold">•</span> {c}
              </p>
            ))}
          </div>
        </div>

        {/* Projects Analysis */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FolderGit2 className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Projects & Portfolio Review
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-slate-700">
              <span className="font-bold text-slate-900">Projects Detected:</span>{' '}
              {projectsAnalysis?.projects_detected || 0}
            </p>
            <p className="text-slate-700">
              <span className="font-bold text-slate-900">Presentation Quality:</span>{' '}
              {projectsAnalysis?.quality || 'Good'}
            </p>
          </div>

          <div className="space-y-1.5 pt-2">
            {(projectsAnalysis?.recommendations || [
              'Include live GitHub or production demo links for key projects.',
              'Highlight technical architecture, problem statement, and user scale.',
            ]).map((rec, i) => (
              <p key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                <span className="text-purple-500 font-bold">•</span> {rec}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
