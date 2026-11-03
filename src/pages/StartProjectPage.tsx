import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useStudio } from '../context/StudioContext';
import { ProjectType } from '../types';

export const StartProjectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { submitInquiry, settings } = useStudio();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('Business Website');
  const [description, setDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('$5,000 - $10,000');
  const [timeframe, setTimeframe] = useState('2-4 weeks');
  const [referenceWebsites, setReferenceWebsites] = useState('');

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill from query params
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    const projectTypeParam = searchParams.get('projectType');
    if (projectTypeParam) {
      setProjectType(projectTypeParam as ProjectType);
    } else if (serviceParam) {
      if (serviceParam.includes('Business')) setProjectType('Business Website');
      else if (serviceParam.includes('Custom')) setProjectType('Web Application');
      else if (serviceParam.includes('Product')) setProjectType('Product Showcase Website');
      else if (serviceParam.includes('Digital')) setProjectType('Custom Digital Solution');
    }
  }, [searchParams]);

  const projectTypes: ProjectType[] = [
    'Business Website',
    'Portfolio Website',
    'E-commerce Website',
    'Web Application',
    'Product Showcase Website',
    'Documentation Website',
    'Custom Digital Solution',
    'Other',
  ];

  const budgetOptions = [
    'Under $2,500',
    '$2,500 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000+',
  ];

  const timeframeOptions = [
    'Immediately (Urgent)',
    '1-2 weeks',
    '2-4 weeks',
    '1-2 months',
    'Flexible / Planning Phase',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid business email address.');
      return;
    }

    if (!description.trim() || description.length < 20) {
      setErrorMessage('Please describe your project in at least 20 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitInquiry({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        company_name: companyName.trim() || undefined,
        project_type: projectType,
        description: description.trim(),
        budget_range: budgetRange,
        timeframe: timeframe,
        reference_websites: referenceWebsites.trim() || undefined,
      });

      if (result.success) {
        setSubmitted(true);
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#8B5CF6', '#38BDF8', '#10B981'],
        });
      } else {
        setErrorMessage(result.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Start a Project | Commission Kinetic Studio"
        description="Submit your project inquiry to Kinetic Studio. Tell us about your website, custom web application, or digital platform requirements."
        canonical="https://kineticstudio.co/start-project"
      />

      <div className="pt-32 pb-24 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PROJECT INITIATION PLANNER</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight leading-tight">
              Let&rsquo;s Build Something Meaningful Together.
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
              Fill in your project vision below. We will review your goals, scope the architecture, and
              schedule an initial discovery consultation within 24 to 48 hours.
            </p>
          </div>

          {/* Submission Success View */}
          {submitted ? (
            <div className="rounded-3xl border border-emerald-500/30 bg-[#121620]/90 dark:bg-[#121620]/90 light:bg-white p-8 sm:p-14 text-center space-y-6 shadow-2xl animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900">
                  Project Inquiry Received!
                </h2>
                <p className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
                  Thank you, <strong className="text-white dark:text-white light:text-slate-900">{fullName}</strong>. A Kinetic
                  Studio lead engineer has received your submission and will reach out to{' '}
                  <span className="text-indigo-400 underline">{email}</span> within 24 to 48 hours with our preliminary project assessment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 max-w-md mx-auto text-xs font-mono text-zinc-400 space-y-1">
                <div>Project Type: <span className="text-zinc-200">{projectType}</span></div>
                <div>Target Timeframe: <span className="text-zinc-200">{timeframe}</span></div>
                <div>Status: <span className="text-emerald-400 font-semibold">Active In Queue</span></div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
                >
                  Return to Homepage
                </Link>
                <Link
                  to="/work"
                  className="px-6 py-3 rounded-xl border border-[#252A36] bg-[#121620] text-zinc-300 hover:text-white text-sm transition-all"
                >
                  Explore Our Work
                </Link>
              </div>
            </div>
          ) : (
            /* Inquiry Form Card */
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white p-8 sm:p-12 shadow-2xl space-y-10"
            >
              {/* Error Alert */}
              {errorMessage && (
                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 1: Contact Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[11px]">
                    1
                  </span>
                  <span>Contact Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                      Full Name <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                      Email Address <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                      Company / Business Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Technologies"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Project Type Selection */}
              <div className="space-y-4 pt-4 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[11px]">
                    2
                  </span>
                  <span>Select Project Type <span className="text-indigo-400">*</span></span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {projectTypes.map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setProjectType(type)}
                      className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                        projectType === type
                          ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-md shadow-indigo-500/10'
                          : 'border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Project Scope & References */}
              <div className="space-y-4 pt-4 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[11px]">
                    3
                  </span>
                  <span>Project Overview &amp; Requirements <span className="text-indigo-400">*</span></span>
                </div>

                <div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about the project goals, target audience, must-have features, or technical requirements..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="text-[11px] text-zinc-500 mt-1">Minimum 20 characters.</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                    Reference Websites or Inspiration Links (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://example.com, https://stripe.com"
                    value={referenceWebsites}
                    onChange={e => setReferenceWebsites(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Step 4: Budget & Timeframe */}
              <div className="space-y-6 pt-4 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[11px]">
                    4
                  </span>
                  <span>Budget &amp; Target Timeframe</span>
                </div>

                {/* Budget selection */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-2">
                    Expected Investment Range
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {budgetOptions.map(opt => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setBudgetRange(opt)}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                          budgetRange === opt
                            ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                            : 'border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] text-zinc-400 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeframe selection */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-2">
                    Target Completion Timeframe
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {timeframeOptions.map(opt => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setTimeframe(opt)}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                          timeframe === opt
                            ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                            : 'border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] text-zinc-400 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit CTA & Privacy guarantee */}
              <div className="pt-6 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200 space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-xl shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry to Kinetic Studio...</span>
                  ) : (
                    <>
                      <span>Submit Project Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    Your inquiry is kept strictly confidential and never shared with third parties.
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
