import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { HeroCanvas } from './HeroCanvas';
import { useStudio } from '../../context/StudioContext';

export const HeroSection: React.FC = () => {
  const { settings, services, projects } = useStudio();

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-32 pb-20 overflow-hidden">
      {/* Background Kinetic Canvas */}
      <HeroCanvas />

      {/* Grid Overlay */}
      <div className="absolute inset-0 kinetic-grid opacity-70 pointer-events-none" />

      {/* Radial Vignette */}
      <div className="absolute inset-0 hero-vignette pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        {/* Studio Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 dark:bg-indigo-500/10 light:bg-indigo-50/90 backdrop-blur-md mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-300 dark:text-indigo-300 light:text-indigo-700">
            {settings.hero_badge || 'INDEPENDENT DIGITAL STUDIO'}
          </span>
        </div>

        {/* Main Heading — Synced directly with database */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white dark:text-white light:text-slate-900 max-w-4xl mx-auto mb-6">
          {settings.hero_title || 'Building High-Impact Web Experiences That Move Businesses Forward.'}
        </h1>

        {/* Supporting Description */}
        <p className="text-lg sm:text-xl text-zinc-300 dark:text-zinc-300 light:text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal mb-10">
          {settings.hero_description ||
            'We design and engineer high-performance websites, custom web applications, and digital platforms for ambitious businesses.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <Link
            to="/start-project"
            className="relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-xl shadow-indigo-500/25 transition-all duration-200 group transform active:scale-95 text-base"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{settings.primary_cta_text || 'Start a Project'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/work"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-medium border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white text-zinc-200 dark:text-zinc-200 light:text-slate-800 hover:bg-slate-100 dark:hover:bg-[#181D2A] hover:text-slate-900 dark:hover:text-white hover:border-indigo-400 dark:hover:border-indigo-500/40 hover:shadow-md hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 transition-all duration-200 backdrop-blur-md text-base"
          >
            <span>{settings.secondary_cta_text || 'Explore Our Work'}</span>
          </Link>
        </div>

        {/* Trust Markers */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mb-16">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>Bespoke Engineering</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>Modern React &amp; Supabase</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>Independent Studio Craft</span>
          </div>
        </div>

        {/* Live Studio Metrics Synced with Database */}
        <div className="pt-10 border-t border-[#252A36]/60 dark:border-[#252A36]/60 light:border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              {services.length || 6}<span className="text-indigo-400">+</span>
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1 font-medium">
              Core Capabilities
            </div>
          </div>

          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              {projects.length || 4}<span className="text-purple-400">+</span>
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1 font-medium">
              Live Projects
            </div>
          </div>

          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              &lt; 1.0<span className="text-indigo-400">s</span>
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1 font-medium">
              Load Speed
            </div>
          </div>

          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              100<span className="text-purple-400">%</span>
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1 font-medium">
              Bespoke Architecture
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
