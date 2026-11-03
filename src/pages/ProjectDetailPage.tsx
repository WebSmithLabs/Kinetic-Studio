import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Layers,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { GithubIcon } from '../components/common/SocialIcons';
import { SEO } from '../components/common/SEO';
import { useStudio } from '../context/StudioContext';
import { ContactCtaBanner } from '../components/home/ContactCtaBanner';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { projects } = useStudio();
  const navigate = useNavigate();

  const publishedProjects = projects.filter(p => p.is_published);
  const currentIndex = publishedProjects.findIndex(p => p.slug === slug);
  const project = publishedProjects[currentIndex];

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Project Not Found</h1>
        <p className="text-zinc-400 mb-8 max-w-md">
          The case study you are looking for may have been updated or moved.
        </p>
        <Link
          to="/work"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Our Work</span>
        </Link>
      </div>
    );
  }

  const prevProject = currentIndex > 0 ? publishedProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < publishedProjects.length - 1 ? publishedProjects[currentIndex + 1] : null;

  return (
    <>
      <SEO
        title={`${project.title} | Case Study`}
        description={project.summary}
        image={project.thumbnail_url}
        canonical={`https://kineticstudio.co/work/${project.slug}`}
      />

      <article className="pt-32 pb-24 text-left">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/work')}
              className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Projects</span>
            </button>
          </div>

          {/* Header Info */}
          <div className="space-y-6 mb-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                {project.category}
              </span>
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Completed {project.completion_date}</span>
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Client: <strong className="text-zinc-200">{project.client_name}</strong>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-lg sm:text-xl text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed font-normal max-w-4xl">
              {project.subtitle}
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all"
                >
                  <span>Visit Live Project</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border border-[#252A36] bg-[#121620] text-zinc-300 hover:text-white hover:border-zinc-600 transition-all"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              )}

              <Link
                to={`/start-project?projectType=${encodeURIComponent(project.category)}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Build Something Similar</span>
              </Link>
            </div>
          </div>

          {/* Main Hero Media */}
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-[#252A36] bg-zinc-950 shadow-2xl mb-16">
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Case Study Deep Dive: Challenge, Solution, Results */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Left 8 Cols: Detailed Narrative */}
            <div className="lg:col-span-8 space-y-12">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
                  Executive Overview
                </h2>
                <p className="text-base text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed font-normal">
                  {project.description}
                </p>
              </section>

              {project.challenge && (
                <section className="p-8 rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] space-y-3">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                    The Engineering Challenge
                  </div>
                  <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900">
                    Obstacles &amp; Constraints
                  </h3>
                  <p className="text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                    {project.challenge}
                  </p>
                </section>
              )}

              {project.solution && (
                <section className="p-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.03] space-y-3">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                    Our Solution &amp; Architecture
                  </div>
                  <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900">
                    Engineered Precision
                  </h3>
                  <p className="text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                    {project.solution}
                  </p>
                </section>
              )}

              {project.results && (
                <section className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] space-y-3">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Outcomes &amp; Impact
                  </div>
                  <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900">
                    Measurable Results
                  </h3>
                  <p className="text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                    {project.results}
                  </p>
                </section>
              )}

              {/* Additional Screenshots Gallery if present */}
              {project.screenshots && project.screenshots.length > 1 && (
                <section className="space-y-4 pt-6">
                  <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
                    Project Gallery &amp; Interfaces
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.screenshots.slice(1).map((shot, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl overflow-hidden border border-[#252A36] aspect-[16/10] bg-zinc-950"
                      >
                        <img
                          src={shot}
                          alt={`${project.title} interface capture ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right 4 Cols: Meta Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl border border-[#252A36] bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white space-y-6">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Client Identity
                  </div>
                  <div className="text-base font-bold text-white dark:text-white light:text-slate-900">
                    {project.client_name}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Project Category
                  </div>
                  <div className="text-sm font-semibold text-indigo-400">
                    {project.category}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Delivery Date
                  </div>
                  <div className="text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                    {project.completion_date}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Technologies Deployed</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/5 text-zinc-200 dark:text-zinc-200 light:text-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  <Link
                    to="/start-project"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all"
                  >
                    <span>Commission Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Next / Prev Project Pagination */}
          <div className="pt-8 border-t border-[#252A36] flex items-center justify-between">
            {prevProject ? (
              <Link
                to={`/work/${prevProject.slug}`}
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>
                  Previous: <strong className="text-zinc-200">{prevProject.title}</strong>
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link
                to={`/work/${nextProject.slug}`}
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <span>
                  Next: <strong className="text-zinc-200">{nextProject.title}</strong>
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <ContactCtaBanner />
        </div>
      </article>
    </>
  );
};
