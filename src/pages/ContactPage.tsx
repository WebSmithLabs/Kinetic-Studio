import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  TwitterIcon,
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  DribbbleIcon,
} from '../components/common/SocialIcons';
import { SEO } from '../components/common/SEO';
import { useStudio } from '../context/StudioContext';

export const ContactPage: React.FC = () => {
  const { settings, submitInquiry } = useStudio();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitInquiry({
        full_name: name.trim(),
        email: email.trim(),
        project_type: 'Other',
        description: `[Subject: ${subject || 'Direct Contact'}] ${message.trim()}`,
        budget_range: 'General Inquiry',
        timeframe: 'Standard',
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error sending message';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | Kinetic Studio"
        description="Get in touch with Kinetic Studio. Discuss your business website, custom web development project, or technical consultation."
        canonical="https://kineticstudio.co/contact"
      />

      <div className="pt-32 pb-24 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono font-semibold text-indigo-300">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>DIRECT COMMUNICATIONS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight leading-tight">
              Let&rsquo;s Start a Conversation.
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
              Have an inquiry, technical question, or prospective partnership? Reach out directly to our
              lead engineering and design team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 5 Cols: Contact Channels & Studio Info */}
            <div className="lg:col-span-5 space-y-6">
              {/* Channel 1: Email */}
              <div className="p-6 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Direct Inquiries
                </div>
                {settings.contact_email ? (
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="text-lg font-bold text-white dark:text-white light:text-slate-900 hover:text-indigo-400 transition-colors block"
                  >
                    {settings.contact_email}
                  </a>
                ) : (
                  <div className="text-sm text-zinc-500 italic">Email configurable in admin</div>
                )}
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Fast response within 24 business hours.
                </p>
              </div>

              {/* Channel 2: Phone / WhatsApp */}
              <div className="p-6 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Phone &amp; WhatsApp
                </div>
                {settings.phone_number ? (
                  <div className="text-base font-bold text-white dark:text-white light:text-slate-900">
                    {settings.phone_number}
                  </div>
                ) : (
                  <div className="text-sm text-zinc-500 italic">Phone configurable in admin</div>
                )}

                {settings.whatsapp_number && (
                  <div className="pt-1">
                    <a
                      href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>Chat on WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Channel 3: Studio Location & Hours */}
              <div className="p-6 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white space-y-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Operating Headquarters
                </div>
                <div className="text-base font-bold text-white dark:text-white light:text-slate-900">
                  {settings.address || 'Global Remote Studio'}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Mon &ndash; Fri &bull; 09:30 &ndash; 18:30 IST (UTC+5:30)</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="p-6 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Studio Social Presences
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.twitter_url && (
                    <a
                      href={settings.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-xs text-zinc-300 hover:text-white hover:border-indigo-500/30 transition-all"
                    >
                      <TwitterIcon className="w-3.5 h-3.5" />
                      <span>X / Twitter</span>
                    </a>
                  )}
                  {settings.linkedin_url && (
                    <a
                      href={settings.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-xs text-zinc-300 hover:text-white hover:border-indigo-500/30 transition-all"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {settings.github_url && (
                    <a
                      href={settings.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-xs text-zinc-300 hover:text-white hover:border-indigo-500/30 transition-all"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {settings.instagram_url && (
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-xs text-zinc-300 hover:text-white hover:border-indigo-500/30 transition-all"
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {settings.dribbble_url && (
                    <a
                      href={settings.dribbble_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-xs text-zinc-300 hover:text-white hover:border-indigo-500/30 transition-all"
                    >
                      <DribbbleIcon className="w-3.5 h-3.5" />
                      <span>Dribbble</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Quick Message Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white p-8 sm:p-10 shadow-xl">
                <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 mb-2">
                  Send a Direct Message
                </h2>
                <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 mb-8">
                  For formal project commissions, you can also use our{' '}
                  <a href="/start-project" className="text-indigo-400 underline">
                    Project Planner
                  </a>
                  .
                </p>

                {submitted ? (
                  <div className="p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-center space-y-4 animate-fadeIn">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className="text-xl font-bold text-white">Message Sent Successfully</h3>
                    <p className="text-sm text-zinc-300 max-w-sm mx-auto">
                      Thank you for contacting Kinetic Studio. Our team will review your message and
                      reply promptly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {errorMsg && (
                      <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                          Your Name <span className="text-indigo-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#252A36] bg-[#0B0D12] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                          Email Address <span className="text-indigo-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#252A36] bg-[#0B0D12] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="Inquiry or partnership topic"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#252A36] bg-[#0B0D12] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                        Message <span className="text-indigo-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="How can Kinetic Studio assist your organization?"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#252A36] bg-[#0B0D12] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
