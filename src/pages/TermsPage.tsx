import React from 'react';
import { SEO } from '../components/common/SEO';
import { FileText, ShieldAlert } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const TermsPage: React.FC = () => {
  const { settings } = useStudio();

  return (
    <>
      <SEO
        title="Terms and Conditions | Kinetic Studio"
        description="Terms and conditions governing web development and digital solutions provided by Kinetic Studio."
        canonical="https://kineticstudio.co/terms"
      />

      <div className="pt-32 pb-24 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono font-semibold text-indigo-300">
              <FileText className="w-3.5 h-3.5" />
              <span>TERMS OF ENGAGEMENT</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs font-mono text-zinc-400">
              Last updated: November 2026 &bull; {settings.company_name} (KS)
            </p>
          </div>

          <div className="rounded-3xl border border-[#252A36] bg-[#121620]/70 dark:bg-[#121620]/70 light:bg-white p-8 sm:p-12 space-y-8 text-zinc-300 dark:text-zinc-300 light:text-slate-700 text-sm leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                1. Agreement to Terms
              </h2>
              <p>
                By visiting our website or engaging Kinetic Studio for digital engineering, website development, UI/UX design, or digital solutions, you agree to comply with and be bound by these Terms and Conditions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                2. Scope of Services &amp; Proposals
              </h2>
              <p>
                Each client engagement is governed by a formalized Statement of Work (SOW) or project agreement specifying deliverables, technical specifications, milestone calendars, and payment schedules. Any alterations to agreed project scopes will be processed via written change orders.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                3. Intellectual Property Rights
              </h2>
              <p>
                Upon receipt of full and final payment for bespoke services, client acquires full ownership rights to custom-developed assets, bespoke code, and client-specific designs, excluding pre-existing open-source libraries or third-party dependencies utilized under their respective open licenses.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                4. Independent Brand Stance
              </h2>
              <p>
                Kinetic Studio is an independent company. Any collaborations with strategic partners, such as RadianForgeLabs, are executed on a project-by-project basis without creating a joint venture, franchise, or corporate subsidiary relationship.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                5. Post-Launch Warranty &amp; Maintenance
              </h2>
              <p>
                All launched web projects include a standard 30-day post-launch warranty covering bug remediation and deployment verification. Ongoing updates, security monitoring, and feature iteration are provided through dedicated website maintenance agreements.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                6. Contact Information
              </h2>
              <p>
                For questions regarding contracts, terms, or formal agreements, please contact{' '}
                <a href={`mailto:${settings.contact_email}`} className="text-indigo-400 underline">
                  {settings.contact_email}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
