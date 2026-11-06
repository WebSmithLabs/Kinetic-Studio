import React from 'react';
import {
  Compass,
  FileCode,
  Palette,
  Terminal,
  CheckCircle,
  Rocket,
} from 'lucide-react';

export const DevelopmentProcess: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Discovery',
      icon: <Compass className="w-5 h-5 text-indigo-400" />,
      description: 'Understanding your business goals, target audience, and project scope.',
    },
    {
      number: '02',
      title: 'Planning',
      icon: <FileCode className="w-5 h-5 text-purple-400" />,
      description: 'Defining site architecture, user journeys, and technical specifications.',
    },
    {
      number: '03',
      title: 'Design',
      icon: <Palette className="w-5 h-5 text-pink-400" />,
      description: 'Crafting bespoke interfaces, design systems, and responsive prototypes.',
    },
    {
      number: '04',
      title: 'Development',
      icon: <Terminal className="w-5 h-5 text-cyan-400" />,
      description: 'Engineering clean, scalable code with modern React, TypeScript, and APIs.',
    },
    {
      number: '05',
      title: 'Testing',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      description: 'Thorough QA across devices, accessibility standards, and load speed.',
    },
    {
      number: '06',
      title: 'Launch',
      icon: <Rocket className="w-5 h-5 text-amber-400" />,
      description: 'Edge deployment, SEO setup, and post-launch support and warranty.',
    },
  ];

  return (
    <section id="process" className="py-24 bg-[#08090D] dark:bg-[#08090D] light:bg-slate-50 relative border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 text-left space-y-3">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
            OUR PROCESS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
            From concept to deployment.
          </h2>
          <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-base sm:text-lg leading-relaxed">
            A structured, transparent workflow designed for consistent quality.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {steps.map(step => (
            <div
              key={step.number}
              className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/60 dark:bg-[#121620]/60 light:bg-white p-7 hover:border-indigo-500/40 transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-2xl font-extrabold tracking-tight text-indigo-400 dark:text-indigo-400 light:text-indigo-600">
                  {step.number}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-indigo-50 border border-white/5 dark:border-white/5 light:border-indigo-100 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 mb-2">
                {step.title}
              </h3>

              <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
