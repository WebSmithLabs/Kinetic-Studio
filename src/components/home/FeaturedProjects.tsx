import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Sparkles, Code2, Calendar } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ProjectCategory } from '../../types';

export const FeaturedProjects: React.FC = () => {
  const { projects } = useStudio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: string[] = [
    'All',
    'Business Websites',
    'Web Applications',
    'Product Websites',
    'Landing Pages',
    'Experimental Projects',
  ];

  const featured = projects.filter(p => p.is_published && p.is_featured);
  const displayList =
    selectedCategory === 'All'
      ? featured.slice(0, 4)
      : projects.filter(p => p.is_published && p.category === selectedCategory).slice(0, 4);

  return (
    <section id="work" className="py-24 bg-[#08090D] dark:bg-[#08090D] light:bg-slate-50 relative border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
              02 // SELECTED WORK
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              Crafted digital platforms that drive results.
            </h2>
            <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-base sm:text-lg">
              Explore our recent business websites, custom web apps, and digital experiences.
            </p>
          </div>

          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 group shrink-0"
          >
            <span>Explore All Projects ({projects.filter(p => p.is_published).length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
                  : 'bg-[#121620] dark:bg-[#121620] light:bg-white text-zinc-400 dark:text-zinc-400 light:text-slate-600 border border-[#252A36] dark:border-[#252A36] light:border-slate-200 hover:text-white dark:hover:text-white light:hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {displayList.map(project => (
            <div
              key={project.id}
              className="group rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white overflow-hidden hover:border-indigo-500/40 transition-all duration-300 shadow-xl flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-transparent to-transparent opacity-80" />

                {/* Badges on image */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#0B0D12]/80 backdrop-blur-md border border-white/10 text-indigo-300">
                    {project.category}
                  </span>
                  {project.is_featured && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider bg-purple-500/80 backdrop-blur-md text-white">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>

                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-[#0B0D12]/80 hover:bg-indigo-600 border border-white/10 text-white backdrop-blur-md transition-all duration-200"
                    aria-label={`Open live project for ${project.title}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Content info */}
              <div className="p-7 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-mono mb-2">
                    <span>{project.client_name}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      <span>{project.completion_date}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 group-hover:text-indigo-300 transition-colors mb-2">
                    <Link to={`/work/${project.slug}`}>{project.title}</Link>
                  </h3>

                  <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed mb-6">
                    {project.summary}
                  </p>
                </div>

                <div>
                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/5 dark:border-white/5 light:border-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Read Case Study Link */}
                  <div className="pt-4 border-t border-[#252A36]/60 dark:border-[#252A36]/60 light:border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/work/${project.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
                      >
                        <span>Live Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
