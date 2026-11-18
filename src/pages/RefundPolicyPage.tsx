import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { ReceiptText } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const RefundPolicyPage: React.FC = () => {
  const { settings } = useStudio();

  return (
    <>
      <SEO
        title="Refund Policy | Web Smith Labs"
        description="Refund, cancellation, and milestone billing policy for engineering and digital design services provided by Web Smith Labs."
        canonical="https://websmithlabs.com/refund-policy"
      />

      <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 text-left transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 light:border-indigo-200 light:bg-indigo-50 text-xs font-mono font-semibold text-indigo-300 light:text-indigo-600">
              <ReceiptText className="w-3.5 h-3.5" />
              <span>BILLING &amp; CANCELLATION POLICY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight break-words">
              Refund Policy
            </h1>
            <p className="text-xs font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-500">
              Last updated: November 2026 &bull; {settings.company_name} (WSL)
            </p>
          </div>

          <div className="rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/70 dark:bg-[#121620]/70 light:bg-white p-8 sm:p-12 space-y-8 text-zinc-300 dark:text-zinc-300 light:text-slate-700 text-sm leading-relaxed shadow-xl light:shadow-slate-100">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                1. Overview &amp; Applicability
              </h2>
              <p>
                This Refund Policy applies to all custom website development, web application engineering, UI/UX design, consulting, and ongoing maintenance retainers provided by {settings.company_name} (&ldquo;Web Smith Labs&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;studio&rdquo;). Because our work consists of bespoke digital engineering and dedicated team allocation, refunds are evaluated transparently based on project milestones and completed deliverables.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                2. Project Deposits &amp; Milestone Payments
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                <li>
                  <span className="font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-800">Before Work Begins:</span>{' '}
                  If you cancel a project in writing before discovery workshops, architecture planning, or design/development work has started, you are eligible for a full refund of your initial deposit, minus any non-recoverable payment gateway or transaction fees.
                </li>
                <li>
                  <span className="font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-800">Mobilization &amp; Active Sprints:</span>{' '}
                  Once project kickoff and engineering allocation begin, the initial kickoff deposit covers reserved studio capacity and discovery deliverables and becomes non-refundable.
                </li>
                <li>
                  <span className="font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-800">Milestone Sign-Off:</span>{' '}
                  Payments tied to completed and approved project milestones are final once deliverables for that stage have been delivered for review or approved by the client.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                3. Mid-Project Cancellations
              </h2>
              <p>
                Either party may terminate an active engagement with written notice in accordance with the signed Statement of Work (SOW). Upon cancellation:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                <li>We will tally all completed milestones and verified engineering/design hours logged up to the effective termination date.</li>
                <li>Any prepaid balance remaining for unstarted future milestones beyond the completed work and kickoff allocation will be refunded pro-rata.</li>
                <li>All paid work-in-progress assets and repositories up to that settled milestone will be handed over to the client.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                4. Non-Refundable Services &amp; Third-Party Costs
              </h2>
              <p>The following charges cannot be refunded once incurred:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                <li>Third-party expenses purchased on your behalf, including domain registrations, cloud hosting, SSL certificates, SaaS subscriptions, fonts, stock assets, or paid APIs.</li>
                <li>Completed and delivered audit reports, architecture blueprints, UI prototypes, or deployed production builds.</li>
                <li>Monthly maintenance or retainer periods in which support availability and scheduled updates have already commenced (retainers may be cancelled prior to the next billing cycle to prevent future charges).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                5. Quality Guarantee &amp; Issue Resolution
              </h2>
              <p>
                Client satisfaction and engineering quality are central to Web Smith Labs. If any deliverable fails to meet the specifications defined in your agreed SOW, we will remediate defects at no additional cost during your included revision cycles and our standard 30-day post-launch warranty described in our{' '}
                <Link to="/terms" className="text-indigo-400 light:text-indigo-600 underline">
                  Terms &amp; Conditions
                </Link>
                . Should we be unable to deliver an agreed core capability after reasonable remediation attempts, a fair partial or full refund for the undelivered milestone will be issued.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                6. How to Request a Refund &amp; Timeline
              </h2>
              <p>
                To request a cancellation or refund review, please email{' '}
                <a href={`mailto:${settings.contact_email}`} className="text-indigo-400 light:text-indigo-600 underline">
                  {settings.contact_email}
                </a>{' '}
                with your project name, invoice reference, and reason for the request.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                <li>We review all refund and cancellation requests within 5 business days and provide a transparent breakdown of completed work.</li>
                <li>Approved refunds are returned to the original payment method within 7&ndash;14 business days, depending on your bank or payment processor.</li>
              </ul>
              <p className="text-xs text-zinc-400 light:text-slate-500 pt-2">
                See also our{' '}
                <Link to="/privacy-policy" className="text-indigo-400 light:text-indigo-600 underline">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link to="/terms" className="text-indigo-400 light:text-indigo-600 underline">
                  Terms &amp; Conditions
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
