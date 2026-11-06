import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Sparkles,
  Search,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useStudio } from '../context/StudioContext';
import { ProjectCategory } from '../types';
import { ContactCtaBanner } from '../components/home/ContactCtaBanner';

export const WorkPage: React.FC = () => {
  const { projects } = useStudio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Business Websites',
    'Web Applications',
    'Product Websites',
    'Landing Pages',
    'Experimental Projects',
  ];

  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => p.is_published)
      .filter(p => {
        if (selectedCategory === 'All') return true;
        return p.category === selectedCategory;
      })
      .filter(p => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.client_name.toLowerCase().includes(q) ||
          p.technologies.some(t => t.toLowerCase().includes(q))
        );
      });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <>
      <SEO
        title="Our Work & Portfolio"
        description="Explore the portfolio of bespoke business websites, custom web applications, product showcases, and digital platforms crafted by Web Smith Labs."
        canonical="https://websmithlabs.com/work"
      />

      <div className="pt-32 pb-24 text-left">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono font-semibold text-indigo-300">
              <Layers className="w-3.5 h-3.5" />
              <span>PORTFOLIO</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight leading-tight">
              A Portfolio of Purpose-Built Digital Experiences.
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
              Explore our recent business websites, web applications, and digital platforms.
            </p>
          </div>

          {/* Filters & Search Bar */}
          <div className="mt-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-6 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
                      : 'bg-[#121620] dark:bg-[#121620] light:bg-white text-zinc-400 dark:text-zinc-400 light:text-slate-600 border border-[#252A36] dark:border-[#252A36] light:border-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#181D2A] hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects or stack..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#121620] dark:bg-[#121620] light:bg-white text-xs text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  className="group rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white overflow-hidden hover:border-indigo-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-transparent to-transparent opacity-80" />

                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#0B0D12]/80 backdrop-blur-md border border-white/10 text-indigo-300">
                          {project.category}
                        </span>
                        {project.is_featured && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-purple-500/80 backdrop-blur-md text-white">
                            <Sparkles className="w-2.5 h-2.5" />
                            Featured
                          </span>
                        )}
                      </div>

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-3 right-3 p-2 rounded-full bg-[#0B0D12]/80 hover:bg-indigo-600 border border-white/10 text-white backdrop-blur-md transition-colors"
                          aria-label={`Open live link for ${project.title}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Meta & Title */}
                    <div className="p-6">
                      <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-mono mb-2">
                        <span className="truncate max-w-[60%]">{project.client_name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <Calendar className="w-3 h-3 text-indigo-400" />
                          <span>{project.completion_date}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 group-hover:text-indigo-300 transition-colors mb-2">
                        <Link to={`/work/${project.slug}`}>{project.title}</Link>
                      </h3>

                      <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed line-clamp-3 mb-4">
                        {project.summary}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {project.technologies.slice(0, 4).map((tech, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/5 text-zinc-300 dark:text-zinc-300 light:text-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-[#252A36]/60 dark:border-[#252A36]/60 light:border-slate-100 mt-4">
                    <div className="pt-4 flex items-center justify-between">
                      <Link
                        to={`/work/${project.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                      >
                        <span>Case Study</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <span>Live Site</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/40 dark:bg-[#121620]/40 light:bg-white p-12 space-y-3 shadow-sm">
              <Filter className="w-8 h-8 text-zinc-500 light:text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">No projects found</h3>
              <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                Try selecting another category or clearing your search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Bottom Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <ContactCtaBanner />
        </div>
      </div>
    </>
  );
};
