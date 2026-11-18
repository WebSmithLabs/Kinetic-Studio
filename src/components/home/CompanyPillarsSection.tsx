import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  ShoppingBag,
  Kanban,
  Users2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CreditCard,
  Lock,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const CompanyPillarsSection: React.FC = () => {
  const pillars = [
    {
      badge: 'PILLAR 1',
      title: 'Make',
      subtitle: 'Custom Web & Software Engineering',
      description:
        'We engineer bespoke, high-performance websites, custom web applications, SaaS MVPs, and digital platforms tailored to your business model with modern React, TypeScript, and Supabase.',
      icon: <Code2 className="w-6 h-6 text-indigo-400" />,
      features: ['Bespoke Custom Web Apps', 'High-Converting Landing Pages', 'Sub-second Load Times', 'Database Modeling & APIs'],
      ctaText: 'Explore Engineering Services',
      ctaHref: '/services',
      accentColor: 'border-indigo-500/30 hover:border-indigo-500/60',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    },
    {
      badge: 'PILLAR 2',
      title: 'Sell',
      subtitle: 'Ready-Made Websites & Turnkey Templates',
      description:
        'Skip months of development. Browse and instantly purchase production-ready website templates, full-stack SaaS boilerplates, and industry-specific platforms with instant Razorpay / Cashfree checkout.',
      icon: <ShoppingBag className="w-6 h-6 text-purple-400" />,
      features: ['Production Source Code Included', 'Instant License & Setup Guide', 'Indian & Global Payment Dropin', 'Figma Design Kits'],
      ctaText: 'Browse Templates Store',
      ctaHref: '/store',
      accentColor: 'border-purple-500/30 hover:border-purple-500/60',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    {
      badge: 'PILLAR 3',
      title: 'Manage',
      subtitle: 'Project Delivery & Milestone Milestones',
      description:
        'End-to-end transparent project oversight. Track discovery roadmaps, sprint progress, milestone calendars, and automated tax invoices directly inside your private Client Portal.',
      icon: <Kanban className="w-6 h-6 text-cyan-400" />,
      features: ['Real-time 6-Stage Progress Stepper', 'Milestone Deposits & Invoicing', 'Downloadable GST Tax Receipts', 'Transparent SLA Calendars'],
      ctaText: 'Access Client Portal',
      ctaHref: '/my-inquiries',
      accentColor: 'border-cyan-500/30 hover:border-cyan-500/60',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    },
    {
      badge: 'PILLAR 4',
      title: 'Collaborate',
      subtitle: 'Team Extension & Interactive Workspace',
      description:
        'We work as an embedded engineering partner for your company. Exchange real-time feedback, review staging builds, approve design iterations, and align directly with your dedicated lead engineer.',
      icon: <Users2 className="w-6 h-6 text-amber-400" />,
      features: ['Direct Discussion & Review Feed', 'Staging & Deliverable Handoffs', 'Figma & GitHub Synchronized', 'Dedicated Slack / WhatsApp Access'],
      ctaText: 'Start Collaboration',
      ctaHref: '/start-project',
      accentColor: 'border-amber-500/30 hover:border-amber-500/60',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      badge: 'PILLAR 5',
      title: 'Maintain',
      subtitle: 'Retainer Subscriptions & Uptime Care',
      description:
        'Protect your digital investment. Ongoing monthly and annual maintenance retainers providing 24/7 uptime monitoring, automated database backups, security patches, and guaranteed developer support hours.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      features: ['24/7 Automated Uptime Pings', 'Weekly Off-site Cloud Backups', 'Core Web Vitals Tuning', 'Strict 2hr to 48hr SLA Guarantee'],
      ctaText: 'View Maintenance Retainers',
      ctaHref: '/maintenance',
      accentColor: 'border-emerald-500/30 hover:border-emerald-500/60',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
  ];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-[#0B0D12] via-[#0E1118] to-[#0B0D12] dark:from-[#0B0D12] dark:via-[#0E1118] dark:to-[#0B0D12] light:from-white light:via-slate-50 light:to-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 light:border-indigo-200 light:bg-indigo-50 text-xs font-mono font-semibold text-indigo-300 light:text-indigo-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FULL-LIFECYCLE DIGITAL PARTNER</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight leading-tight">
            We Make, Sell, Manage, Collaborate &amp; Maintain.
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
            A complete engineering group and digital studio designed to bring high-impact websites to life, license production-ready templates, and provide ongoing retainer maintenance.
          </p>
        </div>

        {/* 5 Pillars Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className={`flex flex-col rounded-3xl border ${pillar.accentColor} light:border-slate-200 light:hover:border-indigo-400 bg-[#121620]/90 dark:bg-[#121620]/90 light:bg-white p-6 sm:p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="flex-grow space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-center">
                    {pillar.icon}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${pillar.badgeColor}`}>
                    {pillar.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
                    {pillar.title}
                  </h3>
                  <div className="text-xs font-mono text-indigo-400 light:text-indigo-600 font-semibold mt-0.5">
                    {pillar.subtitle}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                  {pillar.description}
                </p>

                <ul className="space-y-2 pt-2 border-t border-white/5 dark:border-white/5 light:border-slate-100">
                  {pillar.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5 mt-5 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-100">
                <Link
                  to={pillar.ctaHref}
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 light:text-indigo-600 light:hover:text-indigo-700 transition-colors group"
                >
                  <span>{pillar.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}

          {/* 6th Card: Seamless Razorpay & Cashfree Payments */}
          <div className="rounded-3xl border border-indigo-500/40 dark:border-indigo-500/40 light:border-indigo-200 bg-gradient-to-br from-[#141824] via-indigo-950/20 to-[#121620] dark:from-[#141824] dark:via-indigo-950/20 dark:to-[#121620] light:from-indigo-50/70 light:via-purple-50/40 light:to-white p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 light:text-indigo-600 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 light:bg-emerald-50 light:text-emerald-700 border border-emerald-500/20 light:border-emerald-300">
                  INSTANT CHECKOUT
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
                  Razorpay &amp; Cashfree
                </h3>
                <div className="text-xs font-mono text-emerald-400 light:text-emerald-600 font-semibold mt-0.5">
                  100% Secure Indian &amp; Global Gateways
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                Seamless checkout experience for advance deposits, milestone settlements, pre-built template licenses, and automated retainer subscriptions.
              </p>

              <div className="space-y-2 pt-2 border-t border-white/5 dark:border-white/5 light:border-slate-200 text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-600 shrink-0" />
                  <span>UPI: Google Pay, PhonePe, Paytm, BHIM</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-600 shrink-0" />
                  <span>Credit / Debit Cards: RuPay, Visa, MasterCard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-600 shrink-0" />
                  <span>NetBanking &amp; Instant Tax GST Invoicing</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-400 light:text-emerald-600 font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-Bit Encrypted</span>
                </span>
                <Link to="/start-project" className="text-indigo-400 light:text-indigo-600 hover:text-indigo-300 light:hover:text-indigo-700 font-bold">
                  Get Started &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
