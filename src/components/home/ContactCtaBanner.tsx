import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const ContactCtaBanner: React.FC = () => {
  const { settings } = useStudio();

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-gradient-to-br from-[#121620] via-[#0B0D12] to-[#121620] dark:from-[#121620] dark:via-[#0B0D12] dark:to-[#121620] light:from-indigo-50 light:via-white light:to-purple-50 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          {/* Subtle glowing ambient orb in background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>START A PROJECT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight leading-tight">
              Let&rsquo;s build something exceptional.
            </h2>

            <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              From high-performance business websites to custom web platforms, {settings.company_name} is ready to build.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/start-project"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-xl shadow-indigo-500/25 transition-all duration-200 group transform active:scale-95 text-base"
              >
                <span>{settings.primary_cta_text || 'Start a Project'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-medium border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white text-zinc-200 dark:text-zinc-200 light:text-slate-800 hover:bg-slate-100 dark:hover:bg-[#181D2A] hover:text-slate-900 dark:hover:text-white hover:border-indigo-400 dark:hover:border-indigo-500/40 transition-all text-base"
              >
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Contact Studio</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
