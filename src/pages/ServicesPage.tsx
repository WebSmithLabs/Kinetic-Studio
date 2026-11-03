import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Building2,
  Code2,
  Palette,
  Sparkles,
  Cpu,
  ShieldCheck,
  Check,
  ArrowRight,
  Globe,
  Layers,
  Zap,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useStudio } from '../context/StudioContext';
import { ContactCtaBanner } from '../components/home/ContactCtaBanner';

export const ServicesPage: React.FC = () => {
  const { services } = useStudio();
  const location = useLocation();

  // Scroll to anchor if present in URL
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-6 h-6 text-indigo-400" />;
      case 'Code2':
        return <Code2 className="w-6 h-6 text-purple-400" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-pink-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-cyan-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      default:
        return <Globe className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <>
      <SEO
        title="Services & Capabilities"
        description="Comprehensive web engineering, custom web applications, UI/UX design systems, product showcase platforms, and digital solutions by Kinetic Studio."
        canonical="https://kineticstudio.co/services"
      />

      <div className="pt-32 pb-24 text-left">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono font-semibold text-indigo-300">
              <Layers className="w-3.5 h-3.5" />
              <span>STUDIO SERVICES &amp; PRACTICES</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight leading-tight">
              End-to-End Digital Engineering for Modern Businesses.
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
              We design, architect, and deploy bespoke websites and custom digital solutions. Every
              deliverable is custom-tailored to communicate authority, convert users, and scale without friction.
            </p>
          </div>
        </div>

        {/* Detailed Services List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {services
            .filter(s => s.is_active)
            .map((service, index) => (
              <div
                key={service.id}
                id={service.slug}
                className="scroll-mt-32 rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white p-8 sm:p-12 transition-all duration-300 hover:border-indigo-500/40 shadow-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Left Column: Number, Title, Overview */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-center">
                        {renderIcon(service.icon)}
                      </div>
                      <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
                        0{index + 1} &bull; {service.category}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
                      {service.title}
                    </h2>

                    <p className="text-sm sm:text-base text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed font-normal">
                      {service.description}
                    </p>

                    <div className="pt-2">
                      <Link
                        to={`/start-project?service=${encodeURIComponent(service.title)}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all duration-200 group"
                      >
                        <span>Start With This Service</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Deliverables & Tech Specs */}
                  <div className="lg:col-span-7 bg-[#0B0D12]/70 dark:bg-[#0B0D12]/70 light:bg-slate-50/80 rounded-2xl border border-white/5 dark:border-white/5 light:border-slate-200 p-6 sm:p-8 space-y-6">
                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-400 light:text-slate-500 mb-4 flex items-center gap-2">
                        <Check className="w-4 h-4 text-indigo-400" />
                        <span>Included Scope &amp; Deliverables</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.deliverables.map((item, dIdx) => (
                          <div
                            key={dIdx}
                            className="p-3 rounded-xl border border-white/5 bg-white/[0.02] dark:border-white/5 dark:bg-white/[0.02] light:border-slate-200 light:bg-white flex items-start gap-2.5 text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-800"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 dark:border-white/5 light:border-slate-200">
                      <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-400 light:text-slate-500 mb-3">
                        Technologies &amp; Architecture:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-xs font-mono px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 dark:text-indigo-300 light:text-indigo-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Bottom Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <ContactCtaBanner />
        </div>
      </div>
    </>
  );
};
