import React from 'react';
import { Layers, ShieldCheck, Zap, ArrowUpRight, Cpu, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CollaborationBanner: React.FC = () => {
  const highlights = [
    {
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      title: 'Independent Studio',
      desc: 'Autonomous engineering & dedicated teams',
    },
    {
      icon: <Zap className="w-4 h-4 text-purple-400" />,
      title: 'Cloud Database',
      desc: 'Powered by PostgreSQL & Supabase',
    },
    {
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      title: 'Bespoke Architecture',
      desc: 'Zero templates, 100% custom codebase',
    },
    {
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      title: 'Peak Performance',
      desc: 'Sub-second speeds & 60fps motion',
    },
  ];

  return (
    <section className="py-8 border-y border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0E1118]/60 dark:bg-[#0E1118]/60 light:bg-slate-50/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/5 dark:border-white/5 light:border-slate-200 bg-white/[0.02] dark:bg-white/[0.02] light:bg-white"
            >
              <div className="p-2 rounded-lg bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 shrink-0">
                {item.icon}
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white dark:text-white light:text-slate-900 truncate">
                  {item.title}
                </div>
                <div className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-500 truncate">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
