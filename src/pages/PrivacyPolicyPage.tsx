import React from 'react';
import { SEO } from '../components/common/SEO';
import { Shield, Lock, FileText } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useStudio();

  return (
    <>
      <SEO
        title="Privacy Policy | Kinetic Studio"
        description="Privacy policy and data governance practices of Kinetic Studio."
        canonical="https://kineticstudio.co/privacy-policy"
      />

      <div className="pt-32 pb-24 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono font-semibold text-indigo-300">
              <Shield className="w-3.5 h-3.5" />
              <span>LEGAL &amp; PRIVACY GOVERNANCE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs font-mono text-zinc-400">
              Last updated: November 2026 &bull; {settings.company_name} (KS)
            </p>
          </div>

          <div className="rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/70 dark:bg-[#121620]/70 light:bg-white p-8 sm:p-12 space-y-8 text-zinc-300 dark:text-zinc-300 light:text-slate-700 text-sm leading-relaxed shadow-xl light:shadow-slate-100">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                1. Overview &amp; Commitment
              </h2>
              <p>
                At Kinetic Studio (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;studio&rdquo;), we respect your privacy and are committed to protecting the personal and proprietary information you share with us. This Privacy Policy outlines our practices regarding data collection, usage, and security when you visit our website (kineticstudio.co) or initiate project inquiries.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                2. Information We Collect
              </h2>
              <p>
                We only collect information voluntarily provided by prospective clients and partners when submitting project inquiry forms or communicating with our team:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                <li>Contact Information: Full name, business email address, phone number, and organization name.</li>
                <li>Project Specifications: Project scope, budget parameters, target delivery timelines, and reference websites.</li>
                <li>Technical Telemetry: Standard anonymous technical logs (browser type, device viewport, and timestamp) collected solely to guarantee responsive performance and security.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                3. How We Use Information
              </h2>
              <p>
                Information provided is utilized solely to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                <li>Review and formulate tailored technical proposals and scope architectures.</li>
                <li>Communicate directly regarding your project milestones and inquiries.</li>
                <li>Administer ongoing technical maintenance and support agreements.</li>
              </ul>
              <p className="font-semibold text-white dark:text-white light:text-slate-900">
                We do not sell, rent, monetize, or trade your personal or business data to third-party advertisers under any circumstance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                4. Data Protection &amp; Confidentiality
              </h2>
              <p>
                All project submissions are protected by enterprise-grade transport encryption (TLS 1.3), Row Level Security (RLS) database policies, and strict access controls. Only authorized studio leads can access internal project records.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                5. Contacting the Studio
              </h2>
              <p>
                If you have questions regarding our privacy practices or wish to request the deletion of your inquiry data, please contact our team at{' '}
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
