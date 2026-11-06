import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useStudio();
  const featured = testimonials.filter(t => t.is_featured);

  return (
    <section className="py-24 bg-[#08090D] dark:bg-[#08090D] light:bg-slate-50 relative border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
              CLIENT FEEDBACK
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              Endorsements from our partners.
            </h2>
            <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-base sm:text-lg">
              Perspectives on our engineering rigor, design systems, and delivery speed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {featured.map(test => (
            <div
              key={test.id}
              className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/70 dark:bg-[#121620]/70 light:bg-white p-7 flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Rating stars & Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-indigo-400/30" />
                </div>

                <p className="text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed italic mb-8">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-[#252A36]/60 dark:border-[#252A36]/60 light:border-slate-100 flex items-center gap-3">
                {test.avatar_url ? (
                  <img
                    src={test.avatar_url}
                    alt={test.client_name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-sm">
                    {test.client_name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                    {test.client_name}
                  </div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                    {test.role_title} &bull; {test.company_name}
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
