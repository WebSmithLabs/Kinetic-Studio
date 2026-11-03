import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Terminal, Code2, Globe, Cpu, CheckCircle2 } from 'lucide-react';
import { HeroCanvas } from './HeroCanvas';
import { useStudio } from '../../context/StudioContext';

export const HeroSection: React.FC = () => {
  const { settings } = useStudio();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden">
      {/* Background Kinetic Canvas */}
      <HeroCanvas />

      {/* Grid Overlay */}
      <div className="absolute inset-0 kinetic-grid opacity-70 pointer-events-none" />

      {/* Radial Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0B0D12]/60 to-[#0B0D12] dark:via-[#0B0D12]/60 dark:to-[#0B0D12] light:via-slate-50/60 light:to-[#FAFAFC] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & Actions */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 dark:bg-indigo-500/10 light:bg-indigo-50/90 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-300 dark:text-indigo-300 light:text-indigo-700">
                {settings.hero_badge || 'INDEPENDENT DIGITAL STUDIO'}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white dark:text-white light:text-slate-900">
              Building Digital Experiences That{' '}
              <span className="gradient-accent-text">Move Businesses</span> Forward.
            </h1>

            {/* Supporting Description */}
            <p className="text-lg sm:text-xl text-zinc-300 dark:text-zinc-300 light:text-slate-600 leading-relaxed max-w-2xl font-normal">
              {settings.hero_description ||
                'From business websites to custom digital platforms, Kinetic Studio transforms ideas into meaningful online experiences through thoughtful design and modern technology.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/start-project"
                className="relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-xl shadow-indigo-500/25 transition-all duration-200 group transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>{settings.primary_cta_text || 'Start a Project'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/work"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white text-zinc-200 dark:text-zinc-200 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:border-indigo-500/40 hover:bg-[#181D2A] transition-all duration-200 backdrop-blur-md"
              >
                <span>{settings.secondary_cta_text || 'Explore Our Work'}</span>
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Bespoke Engineering</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Modern React &amp; Supabase</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Independent Studio Craft</span>
              </div>
            </div>
          </div>

          {/* Right Column: Original Abstract Digital Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>

              {/* Composition Mockup Card */}
              <div className="relative rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/90 dark:bg-[#121620]/90 light:bg-white/95 backdrop-blur-xl p-6 shadow-2xl">
                {/* Window header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                    <Terminal className="w-3 h-3 text-indigo-400" />
                    <span>kinetic-studio://experience-v2</span>
                  </div>
                </div>

                {/* Abstract Visual Elements */}
                <div className="space-y-4">
                  {/* Digital Platform Preview Bar */}
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] dark:border-white/5 dark:bg-white/[0.02] light:border-slate-100 light:bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white dark:text-white light:text-slate-800">
                            Digital Experience Architecture
                          </div>
                          <div className="text-[10px] text-zinc-400">Production-Grade Infrastructure</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        99.98% SLA
                      </span>
                    </div>

                    {/* Telemetry Bar */}
                    <div className="w-full bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-indigo-500 h-full w-[45%]" />
                      <div className="bg-purple-500 h-full w-[35%]" />
                      <div className="bg-emerald-400 h-full w-[20%]" />
                    </div>
                  </div>

                  {/* Interactive Architecture Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] dark:border-white/5 dark:bg-white/[0.02] light:border-slate-100 light:bg-slate-50">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 mb-1">
                        <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Core Web Vitals</span>
                      </div>
                      <div className="text-xl font-bold text-white dark:text-white light:text-slate-800">
                        99<span className="text-xs text-indigo-400 font-normal">/100</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Sub-second LCP score</div>
                    </div>

                    <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] dark:border-white/5 dark:bg-white/[0.02] light:border-slate-100 light:bg-slate-50">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 mb-1">
                        <Cpu className="w-3.5 h-3.5 text-purple-400" />
                        <span>Motion &amp; Interaction</span>
                      </div>
                      <div className="text-xl font-bold text-white dark:text-white light:text-slate-800">
                        60<span className="text-xs text-purple-400 font-normal"> FPS</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Fluid kinetic dynamics</div>
                    </div>
                  </div>

                  {/* Code snippet representation */}
                  <div className="p-3 rounded-xl border border-white/5 bg-[#0B0D12] font-mono text-[11px] text-zinc-300 space-y-1">
                    <div className="text-zinc-500">// kinetic-studio.config.ts</div>
                    <div>
                      <span className="text-purple-400">const</span>{' '}
                      <span className="text-indigo-300">experience</span> ={' '}
                      <span className="text-amber-300">createStudioPlatform</span>({'{'}
                    </div>
                    <div className="pl-4 text-zinc-400">
                      design: <span className="text-emerald-400">'bespoke'</span>,
                    </div>
                    <div className="pl-4 text-zinc-400">
                      performance: <span className="text-emerald-400">'sub-second'</span>,
                    </div>
                    <div className="pl-4 text-zinc-400">
                      stack: [<span className="text-indigo-300">'React'</span>,{' '}
                      <span className="text-indigo-300">'Supabase'</span>,{' '}
                      <span className="text-indigo-300">'Tailwind'</span>],
                    </div>
                    <div>{'}'});</div>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -bottom-4 -left-4 px-3.5 py-1.5 rounded-xl border border-indigo-500/30 light:border-indigo-200 bg-[#0B0D12]/95 dark:bg-[#0B0D12]/95 light:bg-white text-[11px] font-mono text-indigo-300 dark:text-indigo-300 light:text-indigo-700 flex items-center gap-2 shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  <span>Turning Ideas Into Digital Experiences</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Metrics Row */}
        <div className="mt-16 pt-8 border-t border-[#252A36]/60 dark:border-[#252A36]/60 light:border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              0<span className="text-indigo-400">ms</span>
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1">
              Template Bloat &bull; 100% Handcrafted
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              6<span className="text-purple-400">-Stage</span>
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1">
              Engineered Delivery Lifecycle
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              &lt; 1.0<span className="text-indigo-400">s</span>
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1">
              Core Web Vitals LCP Benchmark
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              100<span className="text-purple-400">%</span>
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1">
              Independent Technology Studio
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
