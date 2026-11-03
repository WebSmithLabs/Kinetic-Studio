import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Compass } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO title="404 — Page Not Found" description="The page you requested could not be located." />

      <div className="min-h-[80vh] flex items-center justify-center pt-32 pb-24 px-4 text-center">
        <div className="max-w-md space-y-6">
          <div className="text-7xl sm:text-9xl font-mono font-extrabold tracking-tighter gradient-accent-text">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900">
            Coordinates Not Found
          </h1>
          <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-sm sm:text-base leading-relaxed">
            The page or digital platform path you requested does not exist or may have been relocated.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
            <Link
              to="/work"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#121620] dark:bg-[#121620] light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 text-sm transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Projects</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
