import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Server,
  Activity,
  Headphones,
  Lock,
  ArrowRight,
  HelpCircle,
  CreditCard,
  Check,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useStudio } from '../context/StudioContext';
import { SubscriptionPlan, PaymentRecord } from '../types';
import { PaymentModal } from '../components/common/PaymentModal';
import { formatCurrency } from '../lib/payments';

export const MaintenancePage: React.FC = () => {
  const { subscriptionPlans, addSubscription, currentUser, settings } = useStudio();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const currency = 'INR';
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan | null>(null);
  const [activeSubscribedPlan, setActiveSubscribedPlan] = useState<string | null>(null);

  if (settings.enable_maintenance === false) {
    return (
      <>
        <SEO
          title="Maintenance Retainers | Web Smith Labs"
          description="Ongoing maintenance retainers are currently dedicated to existing clients. Contact Web Smith Labs for bespoke software and website engineering."
        />
        <div className="pt-32 pb-24 max-w-2xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white dark:text-white light:text-slate-900">
            Maintenance Retainers Closed
          </h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
            Our ongoing maintenance and retainer slots are currently reserved exclusively for active and past clients. If you are starting a new web project, post-launch maintenance terms are evaluated and tailored directly during your project review.
          </p>
          <div>
            <Link
              to="/start-project"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25"
            >
              <span>Start a Custom Project Inquiry</span>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handleSubscribeClick = (plan: SubscriptionPlan) => {
    setSelectedPlanForPayment(plan);
  };

  const handlePaymentSuccess = async (record: PaymentRecord) => {
    if (selectedPlanForPayment) {
      setActiveSubscribedPlan(selectedPlanForPayment.slug);

      // Register new active subscription
      const amount =
        billingCycle === 'monthly'
          ? selectedPlanForPayment.monthly_price_inr
          : selectedPlanForPayment.annual_price_inr;

      const nextBilling = new Date();
      if (billingCycle === 'monthly') {
        nextBilling.setMonth(nextBilling.getMonth() + 1);
      } else {
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
      }

      await addSubscription({
        user_id: currentUser?.id,
        client_email: record.client_email,
        client_name: record.client_name,
        plan_slug: selectedPlanForPayment.slug,
        plan_name: selectedPlanForPayment.name,
        billing_cycle: billingCycle,
        amount,
        currency,
        gateway: record.gateway,
        status: 'active',
        start_date: new Date().toISOString(),
        next_billing_date: nextBilling.toISOString(),
      });
    }
  };

  return (
    <>
      <SEO
        title="Website Maintenance & Engineering Retainers | Web Smith Labs"
        description="Continuous website maintenance, speed optimization, security updates, and dedicated engineering retainers for Indian businesses."
        canonical="https://websmithlabs.com/maintenance"
      />

      <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 text-left transition-colors">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 light:border-indigo-200 light:bg-indigo-50 text-xs font-mono font-semibold text-indigo-300 light:text-indigo-600 mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MAINTAIN &amp; SCALE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto break-words">
            Website Maintenance &amp; Retainer Subscriptions.
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed max-w-2xl mx-auto mt-4">
            Keep your website fast, secure, and current with ongoing technical care, off-site cloud backups, and direct senior engineer support.
          </p>

          {/* Billing Cycle Toggle & Currency Indicator */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            {/* Billing Cycle Selector */}
            <div className="flex items-center p-1 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-slate-100 text-xs font-semibold">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 sm:px-5 py-2 rounded-xl transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-600 light:hover:text-slate-900'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl transition-all cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-600 light:hover:text-slate-900'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-slate-900">
                  SAVE 20%
                </span>
              </button>
            </div>

            {/* Currency Indicator */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-slate-100 text-xs font-mono text-emerald-400 light:text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>INR (₹) Billing Exclusively</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {subscriptionPlans.map(plan => {
              const price =
                currency === 'INR'
                  ? billingCycle === 'monthly'
                    ? plan.monthly_price_inr
                    : Math.round(plan.annual_price_inr / 12)
                  : billingCycle === 'monthly'
                  ? plan.monthly_price_usd
                  : Math.round(plan.annual_price_usd / 12);

              const isSubscribed = activeSubscribedPlan === plan.slug;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-3xl border transition-all duration-300 p-6 sm:p-8 lg:p-10 ${
                    plan.is_popular
                      ? 'border-indigo-500 dark:border-indigo-500 light:border-indigo-300 bg-gradient-to-b from-indigo-950/20 via-[#121620] to-[#121620] dark:from-indigo-950/20 dark:via-[#121620] dark:to-[#121620] light:from-indigo-50/90 light:via-white light:to-purple-50/40 shadow-2xl shadow-indigo-500/10'
                      : 'border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white shadow-xl'
                  }`}
                >
                  {/* Top Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-6 sm:left-8">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="flex-grow space-y-5 sm:space-y-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-2 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price Header */}
                    <div className="py-4 border-y border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900">
                          {formatCurrency(price, currency)}
                        </span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-mono">
                          / month
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 block mt-1">
                        {billingCycle === 'annual'
                          ? `Billed annually (${formatCurrency(plan.annual_price_inr, 'INR')}/yr)`
                          : 'Billed monthly &bull; Cancel anytime'}
                      </span>
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white/[0.02] dark:bg-white/[0.02] light:bg-slate-50 border border-white/5 dark:border-white/5 light:border-slate-200">
                        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500 light:text-slate-500 uppercase block">Resolution SLA</span>
                        <span className="font-semibold text-emerald-400 light:text-emerald-700">{plan.sla}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.02] dark:bg-white/[0.02] light:bg-slate-50 border border-white/5 dark:border-white/5 light:border-slate-200">
                        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500 light:text-slate-500 uppercase block">Dev Bandwidth</span>
                        <span className="font-semibold text-indigo-400 light:text-indigo-700">{plan.hours_included}</span>
                      </div>
                    </div>

                    {/* Feature List */}
                    <div>
                      <span className="text-xs font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-800 block mb-3">
                        Included in this retainer:
                      </span>
                      <ul className="space-y-2.5 text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 light:text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6 sm:pt-8">
                    {isSubscribed ? (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center text-xs font-bold text-emerald-400 light:text-emerald-700 flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>Active Retainer Plan</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSubscribeClick(plan)}
                        className={`w-full inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                          plan.is_popular
                            ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25 hover:from-indigo-400 hover:to-purple-500'
                            : 'border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 hover:bg-[#181D2A] light:hover:bg-slate-100 text-white dark:text-white light:text-slate-900 hover:border-indigo-500/40'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Subscribe to Retainer Plan</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/60 dark:bg-[#121620]/60 light:bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                Continuous Uptime &amp; Health Checks
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                Automated multi-region ping intervals every 60 seconds with instant WhatsApp and webhook incident alerts.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/60 dark:bg-[#121620]/60 light:bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                Off-site Cloud Database Backups
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                Encrypted snapshot archives saved to independent S3 buckets ensuring rapid one-click disaster recovery.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/60 dark:bg-[#121620]/60 light:bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                Direct Engineering Lead Channel
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                Skip support ticket queues. Speak directly with the engineers who write and maintain your code.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Checkout Modal */}
      {selectedPlanForPayment && (
        <PaymentModal
          isOpen={Boolean(selectedPlanForPayment)}
          onClose={() => setSelectedPlanForPayment(null)}
          title={`Subscribe: ${selectedPlanForPayment.name} (${billingCycle.toUpperCase()})`}
          description={`Ongoing Website Maintenance & Engineering Retainer (${billingCycle} subscription)`}
          amount={
            billingCycle === 'monthly'
              ? selectedPlanForPayment.monthly_price_inr
              : selectedPlanForPayment.annual_price_inr
          }
          currency="INR"
          paymentType="subscription_retainer"
          subscriptionId={selectedPlanForPayment.id}
          onPaymentComplete={handlePaymentSuccess}
        />
      )}
    </>
  );
};
