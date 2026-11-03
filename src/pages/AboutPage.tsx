import React from 'react';
import {
  Compass,
  Eye,
  HeartHandshake,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  Shield,
  Lightbulb,
  Workflow,
  TrendingUp,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useStudio } from '../context/StudioContext';
import { ContactCtaBanner } from '../components/home/ContactCtaBanner';

export const AboutPage: React.FC = () => {
  const { settings } = useStudio();

  const coreValues = [
    {
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      title: 'Creativity',
      description:
        'We believe design is not merely decoration—it is clarity, emotion, and distinct competitive advantage.',
    },
    {
      icon: <Zap className="w-5 h-5 text-purple-400" />,
      title: 'Innovation',
      description:
        'We continuously adopt next-generation web platforms, modern frameworks, and responsive interactive techniques.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      title: 'Quality',
      description:
        'We take uncompromising pride in our craftsmanship: zero template bloat, clean semantics, and sub-second load times.',
    },
    {
      icon: <Eye className="w-5 h-5 text-cyan-400" />,
      title: 'Transparency',
      description:
        'Clear scopes, direct developer conversations, honest milestone roadmaps, and straightforward pricing models.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-pink-400" />,
      title: 'Collaboration',
      description:
        'We operate as an agile partner to your team, treating your business objectives as our shared mission.',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
      title: 'Continuous Improvement',
      description:
        'Web technology never stands still, and neither do we. We iterate, refine, and evolve post-launch.',
    },
  ];

  return (
    <>
      <SEO
        title="About Us | Studio Philosophy & Values"
        description="Learn about Kinetic Studio: an independent technology and digital solutions studio transforming ideas into meaningful digital experiences."
        canonical="https://kineticstudio.co/about"
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
              Kinetic Studio was founded on a simple conviction: every business, product, and idea
              deserves a powerful, unforgettable digital presence that moves them forward.
            </p>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
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
                Empowering Digital Identities
              </h2>
              <p className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 leading-relaxed text-base">
                To help individuals, startups, and established businesses establish meaningful digital
                identities through thoughtful design, modern engineering, and reliable digital technologies.
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
                Building Tomorrow's Platforms
              </h2>
              <p className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 leading-relaxed text-base">
                To grow into a leading independent technology studio building innovative digital products,
                SaaS platforms, AI-powered solutions, and high-performance digital infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* Studio Philosophy & Independence Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0E1118]/90 dark:bg-[#0E1118]/90 light:bg-slate-50 p-8 sm:p-12 lg:p-16">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono font-semibold text-indigo-300">
                <Shield className="w-3.5 h-3.5" />
                <span>INDEPENDENCE &amp; STRATEGIC ALLIANCES</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
                Our Relationship with the Tech Ecosystem
              </h2>

              <div className="space-y-4 text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed text-base">
                <p>
                  Kinetic Studio is an autonomous, independent technology company. We maintain our own
                  brand identity, technical methodology, client relationships, and business roadmap.
                </p>
                <p>
                  We actively collaborate with select technology pioneers—most notably{' '}
                  <strong className="text-white dark:text-white light:text-slate-900">
                    RadianForgeLabs
                  </strong>
                  —on specialized research projects, distributed computing architectures, and deep technical
                  experiments. However, Kinetic Studio is strictly an independent company and is not owned by or
                  a subsidiary division of RadianForgeLabs.
                </p>
                <p>
                  This unique positioning gives our clients the best of both worlds: the agility, intimacy, and
                  dedication of a boutique independent studio, paired with access to advanced technical
                  partnerships when projects demand deep systems innovation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-2xl mb-12 space-y-2">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
              GUIDING PRINCIPLES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              Our Core Values
            </h2>
            <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-sm sm:text-base">
              The values that govern every project we accept, every line of code we push, and every interaction we have.
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
                <p className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
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
