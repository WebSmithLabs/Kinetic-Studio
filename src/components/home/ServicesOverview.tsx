import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Code2,
  Palette,
  Sparkles,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Check,
  Globe,
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const ServicesOverview: React.FC = () => {
  const { services } = useStudio();

  // Helper to map icon names to Lucide icons
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-indigo-400" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-purple-400" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-pink-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      default:
        return <Globe className="w-5 h-5 text-indigo-400" />;
    }
  };

  const activeServices = services.filter(s => s.is_active).slice(0, 6);

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
              01 // CORE CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              Engineered for impact, crafted for scale.
            </h2>
            <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-base sm:text-lg leading-relaxed">
              We replace sluggish generic templates with tailor-made digital experiences, bespoke
              platforms, and modern cloud architectures.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 group shrink-0"
          >
            <span>View All Capabilities &amp; Deliverables</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {activeServices.map(service => (
            <div
              key={service.id}
              className="glow-card group rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/70 dark:bg-[#121620]/70 light:bg-white p-7 flex flex-col justify-between hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Card Top: Icon & Category */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-center group-hover:scale-105 group-hover:border-indigo-500/30 transition-all">
                    {renderIcon(service.icon)}
                  </div>
                  <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.02] dark:border-white/10 dark:bg-white/[0.02] light:border-slate-200 light:bg-slate-50 text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                    {service.category}
                  </span>
                </div>

                {/* Title & Summary */}
                <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 group-hover:text-indigo-300 transition-colors mb-2.5">
                  {service.title}
                </h3>
                <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-sm leading-relaxed mb-6">
                  {service.summary}
                </p>

                {/* Key Deliverables Highlights */}
                <div className="space-y-2 mb-6 pt-2 border-t border-[#252A36]/60 dark:border-[#252A36]/60 light:border-slate-100">
                  <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-500 uppercase tracking-wider mb-2">
                    Key Deliverables:
                  </div>
                  {service.deliverables.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Technologies & CTA */}
              <div className="pt-4 border-t border-[#252A36]/60 dark:border-[#252A36]/60 light:border-slate-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5 max-w-[65%]">
                  {service.technologies.slice(0, 2).map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600"
                    >
                      {tech}
                    </span>
                  ))}
                  {service.technologies.length > 2 && (
                    <span className="text-[10px] font-mono px-1 py-0.5 text-zinc-400">
                      +{service.technologies.length - 2}
                    </span>
                  )}
                </div>

                <Link
                  to={`/start-project?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors"
                >
                  <span>Request</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
