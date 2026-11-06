import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const FaqSection: React.FC = () => {
  const { faqs } = useStudio();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const activeFaqs = faqs.filter(f => f.is_active);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
            COMMON QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-base max-w-xl mx-auto">
            Everything you need to know about working with Web Smith Labs.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 text-left">
          {activeFaqs.map(faq => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-indigo-500/50 bg-[#121620] dark:bg-[#121620] light:bg-white shadow-lg light:shadow-slate-100'
                    : 'border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0E1118]/70 dark:bg-[#0E1118]/70 light:bg-white dark:hover:border-zinc-700 light:hover:border-indigo-300'
                }`}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-semibold text-white dark:text-white light:text-slate-900">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg border border-white/5 dark:border-white/5 light:border-slate-200 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-indigo-500/20 text-indigo-400' : 'text-zinc-400 dark:text-zinc-400 light:text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed border-t border-[#252A36]/40 dark:border-[#252A36]/40 light:border-slate-100 pt-4 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
