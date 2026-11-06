import React from 'react';
import {
  Code,
  Zap,
  Users2,
  Rocket,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const WhyChooseUs: React.FC = () => {
  const differentiators = [
    {
      icon: <Code className="w-5 h-5 text-indigo-400" />,
      title: 'Zero Template Bloat',
      description: 'Handcrafted components tailored to your brand without slow generic page builders.',
    },
    {
      icon: <Zap className="w-5 h-5 text-purple-400" />,
      title: 'Sub-Second Speeds',
      description: 'Optimized for instant page loads, smooth 60fps motion, and peak Core Web Vitals.',
    },
    {
      icon: <Users2 className="w-5 h-5 text-pink-400" />,
      title: 'Direct Collaboration',
      description: 'Collaborate directly with the engineers and designers building your product.',
    },
    {
      icon: <Rocket className="w-5 h-5 text-amber-400" />,
      title: 'Built to Scale',
      description: 'Modular React & Supabase foundations ready to expand into full web platforms.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: 'Transparent Milestones',
      description: 'Clear scopes, fixed timelines, staging previews, and straightforward pricing.',
    },
    {
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      title: 'Independent Craft',
      description: 'An autonomous studio with meticulous attention to detail in every release.',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 text-left space-y-3">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
            WHY WEB SMITH LABS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
            Craftsmanship over templates.
          </h2>
          <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-base sm:text-lg leading-relaxed">
            Distinction, uncompromising speed, and thoughtful digital execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {differentiators.map((diff, index) => (
            <div
              key={index}
              className="glow-card rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/60 dark:bg-[#121620]/60 light:bg-white p-7 hover:border-indigo-500/40 transition-all duration-300 shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-center mb-5">
                {diff.icon}
              </div>
              <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 mb-2">
                {diff.title}
              </h3>
              <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                {diff.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
