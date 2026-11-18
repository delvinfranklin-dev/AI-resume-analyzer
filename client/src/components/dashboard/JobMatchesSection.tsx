import React from 'react';
import { Briefcase, CheckCircle2, AlertCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { JobRecommendation } from '../../types';

interface JobMatchesSectionProps {
  jobRecommendations: JobRecommendation[];
  onSelectRoleForMatch?: (roleTitle: string) => void;
}

export const JobMatchesSection: React.FC<JobMatchesSectionProps> = ({
  jobRecommendations,
  onSelectRoleForMatch,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Recommended Job Roles
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Role alignments inferred from your skills, project complexity, and seniority level.
          </p>
        </div>
        <span className="text-xs text-slate-400 self-start sm:self-auto">
          Ranked by compatibility percentage
        </span>
      </div>

      <div className="space-y-4">
        {jobRecommendations && jobRecommendations.length > 0 ? (
          jobRecommendations.map((job, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-brand-300 hover:shadow-md transition-all space-y-4"
            >
              {/* Top Row: Role Title & Match Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{job.role}</h4>
                    <p className="text-xs text-slate-500">{job.reason}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-brand-600 font-display">
                      {job.match_percentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 block -mt-1">Match</span>
                  </div>
                  {onSelectRoleForMatch && (
                    <button
                      onClick={() => onSelectRoleForMatch(job.role)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors flex items-center gap-1"
                    >
                      <span>Match JD</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Match Percentage Progress Bar */}
              <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-600 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(10, job.match_percentage))}%` }}
                />
              </div>

              {/* Skills breakdown: Matching vs Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                {/* Matching Skills */}
                <div className="space-y-1.5">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Matching Core Skills ({job.required_skills?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {job.required_skills?.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skill Gaps */}
                <div className="space-y-1.5">
                  <span className="font-bold text-amber-800 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Potential Skill Gaps ({job.missing_skills?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {job.missing_skills && job.missing_skills.length > 0 ? (
                      job.missing_skills.map((gap, gIdx) => (
                        <span
                          key={gIdx}
                          className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium"
                        >
                          {gap}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">No critical gaps identified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Suggested Next Steps */}
              {job.suggested_next_steps && job.suggested_next_steps.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                  <p>
                    <span className="font-semibold text-slate-800">Action Step:</span>{' '}
                    {job.suggested_next_steps.join('; ')}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500">No job recommendations available.</p>
        )}
      </div>

      <p className="text-[11px] text-slate-400 pt-2 text-center">
        Job matches indicate skill alignment and do not imply guaranteed employment or interviews.
      </p>
    </div>
  );
};
