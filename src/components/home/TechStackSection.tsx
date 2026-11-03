import React from 'react';
import { Layers, Database, Code, Cloud, Palette, Server } from 'lucide-react';

export const TechStackSection: React.FC = () => {
  const stackCategories = [
    {
      category: 'Frontend Engineering',
      icon: <Code className="w-4 h-4 text-indigo-400" />,
      items: [
        { name: 'React', description: 'Component architecture' },
        { name: 'TypeScript', description: 'Strict type safety' },
        { name: 'Tailwind CSS', description: 'Utility design tokens' },
        { name: 'Next.js', description: 'Server-side performance' },
        { name: 'Framer Motion', description: 'Fluid micro-interactions' },
      ],
    },
    {
      category: 'Backend & Data',
      icon: <Database className="w-4 h-4 text-purple-400" />,
      items: [
        { name: 'Supabase', description: 'Postgres & Auth ecosystem' },
        { name: 'PostgreSQL', description: 'Relational data modeling' },
        { name: 'Row Level Security', description: 'Database-grade authorization' },
        { name: 'Node.js', description: 'Serverless functions & APIs' },
        { name: 'Edge Functions', description: 'Low-latency compute' },
      ],
    },
    {
      category: 'Cloud & Infrastructure',
      icon: <Cloud className="w-4 h-4 text-cyan-400" />,
      items: [
        { name: 'Cloudflare', description: 'Global CDN edge & DNS' },
        { name: 'Vite', description: 'Next-gen frontend tooling' },
        { name: 'SSL / TLS', description: 'Bank-grade transport encryption' },
        { name: 'Lighthouse CI', description: 'Performance enforcement' },
        { name: 'Figma', description: 'Design systems & tokens' },
      ],
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 text-left space-y-3">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
            05 // MODERN TOOLING
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
            Built on robust, open, modern foundations.
          </h2>
          <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-base sm:text-lg leading-relaxed">
            We avoid proprietary site builder lock-in. Every website is built on an industry-standard,
            developer-friendly tech stack you own 100%.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {stackCategories.map((cat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/60 dark:bg-[#121620]/60 light:bg-white p-7"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 flex items-center justify-center">
                  {cat.icon}
                </div>
                <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                  {cat.category}
                </h3>
              </div>

              <div className="space-y-3.5">
                {cat.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-white/5 bg-white/[0.02] dark:border-white/5 dark:bg-white/[0.02] light:border-slate-100 light:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-800">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                        {item.description}
                      </div>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
