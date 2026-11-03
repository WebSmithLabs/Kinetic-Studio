import React, { useState } from 'react';
import {
  Compass,
  FileCode,
  Palette,
  Terminal,
  CheckCircle,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DevelopmentProcess: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Discovery',
      subtitle: 'Understand the business, requirements and goals.',
      icon: <Compass className="w-5 h-5 text-indigo-400" />,
      details:
        'We immerse ourselves in your brand story, customer personas, business goals, and competitive ecosystem to identify your key strategic levers.',
      outputs: ['Discovery Brief', 'Competitor Benchmark', 'Target Audience Matrix', 'Functional Requirements'],
    },
    {
      number: '02',
      title: 'Planning',
      subtitle: 'Define the project scope, structure and technical direction.',
      icon: <FileCode className="w-5 h-5 text-purple-400" />,
      details:
        'We architect the information architecture, user journey maps, technology stack selection, and milestone roadmap before writing a single line of code.',
      outputs: ['Site Architecture Map', 'Wireframe Flowcharts', 'Tech Stack Specification', 'Milestone Schedule'],
    },
    {
      number: '03',
      title: 'Design',
      subtitle: 'Create the visual identity and user experience.',
      icon: <Palette className="w-5 h-5 text-pink-400" />,
      details:
        'We craft high-fidelity Figma prototypes, design systems, typography hierarchies, and custom motion dynamics tailored to your brand personality.',
      outputs: ['High-Fidelity UI Screens', 'Interactive Clickable Prototype', 'Component Design System', 'Motion Guidelines'],
    },
    {
      number: '04',
      title: 'Development',
      subtitle: 'Build the website using modern technologies.',
      icon: <Terminal className="w-5 h-5 text-cyan-400" />,
      details:
        'Our engineers bring designs to life using modern React, TypeScript, Tailwind CSS, and scalable Supabase backends with clean, maintainable code.',
      outputs: ['Production React Codebase', 'Supabase Database & RLS', 'Live Staging Previews', 'API Integrations'],
    },
    {
      number: '05',
      title: 'Testing',
      subtitle: 'Test functionality, responsiveness, accessibility and performance.',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      details:
        'Rigorous quality assurance testing across browsers, screen sizes, accessibility standards (WCAG AA), security audits, and Core Web Vitals checks.',
      outputs: ['Lighthouse 95+ Audit', 'Cross-Device QA Report', 'Accessibility Compliance', 'Security Hardening'],
    },
    {
      number: '06',
      title: 'Launch',
      subtitle: 'Deploy the finished project and provide support.',
      icon: <Rocket className="w-5 h-5 text-amber-400" />,
      details:
        'Production DNS deployment, CDN edge caching, SEO indexing setup, team CMS onboarding, and a 30-day post-launch warranty period.',
      outputs: ['Production CDN Deployment', 'SEO Verification & Sitemap', 'Admin Handover Docs', '30-Day Post-Launch Warranty'],
    },
  ];

  return (
    <section id="process" className="py-24 bg-[#08090D] dark:bg-[#08090D] light:bg-slate-50 relative border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 text-left space-y-3">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
            04 // THE KINETIC METHOD
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
            A disciplined, six-stage engineering workflow.
          </h2>
          <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-base sm:text-lg leading-relaxed">
            Predictable outcomes require structured craftsmanship. Here is exactly how we take your vision
            from initial idea to a high-performing digital reality.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl border p-7 transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 bg-[#121620] dark:bg-[#121620] light:bg-white shadow-xl shadow-indigo-500/10 -translate-y-1'
                    : 'border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0E1118]/80 dark:bg-[#0E1118]/80 light:bg-white/80 hover:border-zinc-700 hover:bg-[#121620]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-extrabold tracking-tight text-indigo-400/80">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/5 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-3">
                    {step.subtitle}
                  </p>

                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed mb-6">
                    {step.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#252A36]/60 dark:border-[#252A36]/60 light:border-slate-100">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                    Deliverables:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {step.outputs.map((out, oIdx) => (
                      <span
                        key={oIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600"
                      >
                        {out}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
