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
      description:
        'We refuse heavy, generic site builder themes. Every layout, component, and animation is tailored specifically to your brand identity and business objectives.',
    },
    {
      icon: <Zap className="w-5 h-5 text-purple-400" />,
      title: 'Sub-Second Performance',
      description:
        'Fast websites convert visitors. We optimize Core Web Vitals, asset delivery, and database queries to ensure instantaneous load speeds on all devices.',
    },
    {
      icon: <Users2 className="w-5 h-5 text-pink-400" />,
      title: 'Direct Builder Collaboration',
      description:
        'No endless layers of account managers. You collaborate directly with senior designers and full-stack software engineers who write the code.',
    },
    {
      icon: <Rocket className="w-5 h-5 text-amber-400" />,
      title: 'Engineered for Future Scale',
      description:
        'Built with scalable frameworks like React and Supabase, your website easily expands into full SaaS applications, AI integrations, and mobile platforms.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: 'Transparent Milestones',
      description:
        'Clear project scopes, fixed milestones, continuous staging previews, and transparent pricing. No surprise fees or ambiguous commitments.',
    },
    {
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      title: 'Independent Studio Pride',
      description:
        'We are an independent studio driven by craft and long-term reputation. We stand firmly behind every digital experience we deploy.',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 text-left space-y-3">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
            03 // WHY KINETIC STUDIO
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
            Craftsmanship over shortcuts. Engineering over templates.
          </h2>
          <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-base sm:text-lg leading-relaxed">
            In an era of mass-produced generic sites, Kinetic Studio stands for distinction,
            uncompromising speed, and thoughtful digital execution.
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
