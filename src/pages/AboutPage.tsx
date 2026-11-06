import React from 'react';
import {
  Compass,
  Eye,
  HeartHandshake,
  Sparkles,
  Zap,
  CheckCircle2,
  Shield,
  TrendingUp,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ContactCtaBanner } from '../components/home/ContactCtaBanner';

export const AboutPage: React.FC = () => {
  const coreValues = [
    {
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      title: 'Creativity',
      description: 'Design with clarity, purpose, and distinct identity.',
    },
    {
      icon: <Zap className="w-5 h-5 text-purple-400" />,
      title: 'Innovation',
      description: 'Modern frameworks, fluid motion, and reactive architectures.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      title: 'Quality',
      description: 'Zero template bloat, sub-second speeds, and clean code.',
    },
    {
      icon: <Eye className="w-5 h-5 text-cyan-400" />,
      title: 'Transparency',
      description: 'Clear scopes, direct engineer access, and fixed milestones.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-pink-400" />,
      title: 'Collaboration',
      description: 'Working alongside your team as dedicated partners.',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
      title: 'Continuous Evolution',
      description: 'Iterative improvements and long-term technical reliability.',
    },
  ];

  return (
    <>
      <SEO
        title="About Us | Studio Philosophy & Values"
        description="Learn about Web Smith Labs: an independent technology and digital solutions lab transforming ideas into meaningful digital experiences."
        canonical="https://websmithlabs.com/about"
      />

      <div className="pt-32 pb-24 text-left">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono font-semibold text-indigo-300">
              <Compass className="w-3.5 h-3.5" />
              <span>WHO WE ARE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight leading-tight">
              An Independent Studio Powered by Craft and Engineering.
            </h1>
            <p className="text-lg sm:text-xl text-zinc-300 dark:text-zinc-300 light:text-slate-600 leading-relaxed font-normal">
              We design and build bespoke digital experiences that help businesses stand out and grow.
            </p>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="p-8 sm:p-10 rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Compass className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-indigo-400">
                Our Mission
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white dark:text-white light:text-slate-900">
                Empowering Digital Presence
              </h2>
              <p className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 leading-relaxed text-base">
                Helping businesses, startups, and individuals establish distinctive digital identities through thoughtful design and reliable technology.
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 sm:p-10 rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Eye className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-purple-400">
                Our Vision
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white dark:text-white light:text-slate-900">
                Building Modern Platforms
              </h2>
              <p className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 leading-relaxed text-base">
                Growing into a leading independent technology studio creating innovative software, SaaS platforms, and digital experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Independence Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0E1118]/80 dark:bg-[#0E1118]/80 light:bg-slate-50 p-8 sm:p-12">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono font-semibold text-indigo-300">
                <Shield className="w-3.5 h-3.5" />
                <span>INDEPENDENT STUDIO</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
                Autonomous craft with strategic alliances.
              </h2>
              <p className="text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed text-sm sm:text-base">
                Web Smith Labs operates as a fully independent technology studio and lab. We maintain our own identity, ownership, and direct client engagements, while collaborating with select technical innovators on specialized high-complexity initiatives.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-2xl mb-12 space-y-2">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
              VALUES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              Our Core Values
            </h2>
            <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-sm sm:text-base">
              Principles guiding every project we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/60 dark:bg-[#121620]/60 light:bg-white p-7 space-y-3 hover:border-indigo-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/5 flex items-center justify-center">
                  {val.icon}
                </div>
                <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                  {val.title}
                </h3>
                <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactCtaBanner />
        </div>
      </div>
    </>
  );
};
