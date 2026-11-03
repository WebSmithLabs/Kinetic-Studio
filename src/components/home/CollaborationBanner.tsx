import React from 'react';
import { Layers, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CollaborationBanner: React.FC = () => {
  return (
    <section className="py-12 border-y border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0E1118]/70 dark:bg-[#0E1118]/70 light:bg-slate-50/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Studio Independence Badge & Info */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400">
              <Layers className="w-4 h-4" />
              <span>Independent Studio Architecture</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
              Bespoke digital engineering with strategic technology alliances.
            </h3>
            <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
              Kinetic Studio operates as a fully independent technology and digital solutions company.
              We collaborate with select technology pioneers including{' '}
              <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-800">
                RadianForgeLabs
              </strong>{' '}
              on specialized high-complexity engineering initiatives.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] dark:border-white/5 dark:bg-white/[0.02] light:border-slate-200 light:bg-white flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white dark:text-white light:text-slate-900">
                  Autonomous Governance
                </div>
                <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5">
                  Direct client contracts, dedicated teams, and intellectual property ownership.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] dark:border-white/5 dark:bg-white/[0.02] light:border-slate-200 light:bg-white flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white dark:text-white light:text-slate-900">
                  Collaborative Synergies
                </div>
                <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5">
                  Specialized joint research in R&amp;D and distributed digital platforms.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
