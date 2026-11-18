import React from 'react';
import { Brain, BarChart3, Lightbulb, Target, Search, Rocket } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Brain,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
      title: 'AI Resume Analysis',
      description: 'Understand what your resume communicates to recruiters and talent algorithms with deep semantic evaluation.',
    },
    {
      icon: BarChart3,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
      title: 'ATS Compatibility',
      description: 'Check how well your resume performs with Applicant Tracking Systems across formatting, structure, and keywords.',
    },
    {
      icon: Lightbulb,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
      title: 'Skill Detection',
      description: 'Automatically identify technical skills, programming languages, cloud frameworks, and leadership attributes.',
    },
    {
      icon: Target,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      title: 'Job Recommendations',
      description: 'Discover tailored roles that match your unique background with precise match percentages and career gap insights.',
    },
    {
      icon: Search,
      iconColor: 'text-rose-600 bg-rose-50 border-rose-100',
      title: 'Resume Weaknesses',
      description: 'Identify unquantified bullets, missing sections, and formatting roadblocks before recruiters notice them.',
    },
    {
      icon: Rocket,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      title: 'Improvement Suggestions',
      description: 'Receive concrete, actionable recommendations with example metric bullet points to boost your interview callback rate.',
    },
  ];

  return (
    <section id="features-section" className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
            Engineered For Modern Hiring
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Comprehensive Resume Intelligence
          </p>
          <p className="mt-3 text-base text-slate-600">
            Everything you need to audit, optimize, and elevate your professional profile for both human recruiters and automated ATS scanners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-brand-300 hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${feature.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
