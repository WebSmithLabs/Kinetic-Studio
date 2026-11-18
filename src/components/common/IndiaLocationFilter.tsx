import React, { useState, useEffect } from 'react';
import { MapPin, ShieldCheck, ExternalLink, X, AlertCircle } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const IndiaLocationFilter: React.FC = () => {
  const { settings } = useStudio();
  const [showModal, setShowModal] = useState(false);
  const [isNonIndianSelected, setIsNonIndianSelected] = useState(false);
  const [topBannerDismissed, setTopBannerDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already confirmed region
    const storedConsent = localStorage.getItem('wsl_india_region_consent');
    if (storedConsent) return;

    // Detect timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const isLikelyIndia =
        tz.includes('Calcutta') || tz.includes('Kolkata') || tz === 'IST' || tz.includes('India');

      // If outside India or first-time visitor with notice active, prompt confirmation
      if (settings.india_only_notice !== false) {
        // If not definitively in India, prompt immediately, or after a slight pause
        const timer = setTimeout(() => {
          setShowModal(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Fallback
    }
  }, [settings.india_only_notice]);

  const handleConfirmIndia = () => {
    localStorage.setItem('wsl_india_region_consent', 'in');
    setShowModal(false);
  };

  const handleSelectNonIndia = () => {
    setIsNonIndianSelected(true);
  };

  if (!settings.india_only_notice && !showModal) {
    return null;
  }

  return (
    <>
      {/* Top Advisory Pill Banner (Non-intrusive) */}
      {!topBannerDismissed && (
        <div className="bg-[#121620] dark:bg-[#121620] light:bg-slate-100 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200 py-1.5 px-4 text-center text-[11px] font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-600 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center justify-center gap-2 flex-grow truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="truncate">
                Domestic Operations: Web Smith Labs builds custom web platforms exclusively for businesses &amp; founders in India (₹ INR).
              </span>
            </div>
            <button
              onClick={() => setTopBannerDismissed(true)}
              className="text-zinc-500 hover:text-white dark:hover:text-white light:hover:text-slate-900 shrink-0 p-0.5 cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Location / Cookie Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-7 sm:p-9 text-left shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/10 light:bg-indigo-50 border border-indigo-500/20 text-indigo-400 light:text-indigo-600 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('wsl_india_region_consent', 'acknowledged');
                  setShowModal(false);
                }}
                className="p-1 rounded-lg text-zinc-500 hover:text-white dark:hover:text-white light:hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isNonIndianSelected ? (
              <>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-emerald-500/10 text-emerald-400 light:bg-emerald-50 light:text-emerald-700 border border-emerald-500/30">
                    Domestic Service Availability
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
                    Welcome to Web Smith Labs
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-600 leading-relaxed">
                    Our digital engineering, bespoke web development, and client collaboration services are currently dedicated <strong>exclusively to businesses, startups, and individuals located in India</strong>. All quotes and invoicing are issued in <strong>Indian Rupees (₹ INR)</strong> with GST compliance.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 border border-white/5 dark:border-white/5 light:border-slate-200 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 space-y-1 font-mono">
                  <div className="flex items-center gap-2 text-zinc-200 dark:text-zinc-200 light:text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Jurisdiction: Bengaluru, Karnataka, India</span>
                  </div>
                  <div>Primary Currency: Indian Rupee (₹ INR) &bull; Domestic Bank &amp; UPI</div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSelectNonIndia}
                    className="px-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 text-xs font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/5 transition-all text-center cursor-pointer"
                  >
                    I am Outside India
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmIndia}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transition-all text-center cursor-pointer"
                  >
                    I am Based in India &bull; Continue
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    International Advisory
                  </div>
                  <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900">
                    International Client Services Currently Paused
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-600 leading-relaxed">
                    Thank you for your interest! At this time, our senior engineering studio capacity is dedicated solely to Indian domestic engagements, local entities, and founders. We do not accept direct international cross-border contracts outside India.
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 leading-relaxed">
                    If you represent an international organization with an Indian subsidiary or registered branch office in India, you are welcome to browse our portfolio and submit an inquiry through your Indian entity.
                  </p>
                </div>

                <div className="pt-3 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200 flex items-center justify-between gap-3">
                  <a
                    href="mailto:hello@websmithlabs.com?subject=International%20Entity%20Inquiry"
                    className="inline-flex items-center gap-1 text-xs text-indigo-400 light:text-indigo-600 hover:underline"
                  >
                    <span>Contact via Email</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('wsl_india_region_consent', 'international_acknowledged');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 dark:bg-white/10 light:bg-slate-100 text-white dark:text-white light:text-slate-900 hover:bg-white/15 cursor-pointer"
                  >
                    Browse Site Anyway
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
