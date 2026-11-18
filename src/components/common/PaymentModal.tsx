import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Lock,
  ArrowRight,
  Download,
  Receipt,
  FileCheck,
  Building2,
} from 'lucide-react';
import { PaymentGateway, PaymentRecord, PaymentType } from '../../types';
import { useStudio } from '../../context/StudioContext';
import { formatCurrency, initiatePayment } from '../../lib/payments';

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  amount: number;
  currency?: 'INR' | 'USD';
  paymentType: PaymentType;
  inquiryId?: string;
  productId?: string;
  subscriptionId?: string;
  defaultClientName?: string;
  defaultClientEmail?: string;
  onPaymentComplete?: (record: PaymentRecord) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  amount,
  currency = 'INR',
  paymentType,
  inquiryId,
  productId,
  subscriptionId,
  defaultClientName = '',
  defaultClientEmail = '',
  onPaymentComplete,
}) => {
  const { settings, currentUser, recordPayment, updateInquiryStatus } = useStudio();

  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>(() => {
    if (settings.default_payment_gateway === 'cashfree' && settings.cashfree_enabled) {
      return 'cashfree';
    }
    if (settings.razorpay_enabled) {
      return 'razorpay';
    }
    return settings.cashfree_enabled ? 'cashfree' : 'razorpay';
  });
  const [clientName, setClientName] = useState(
    defaultClientName || currentUser?.full_name || ''
  );
  const [clientEmail, setClientEmail] = useState(
    defaultClientEmail || currentUser?.email || ''
  );
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '+91 98765 43210');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedRecord, setCompletedRecord] = useState<PaymentRecord | null>(null);

  if (!isOpen) return null;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!clientName.trim() || !clientEmail.trim()) {
      setErrorMessage('Please provide both your name and email address.');
      return;
    }

    setIsProcessing(true);

    try {
      await initiatePayment({
        amount,
        currency,
        title,
        description,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim(),
        paymentType,
        inquiryId,
        productId,
        subscriptionId,
        gateway: selectedGateway,
        settings,
        onSuccess: async (record: PaymentRecord) => {
          setIsProcessing(false);
          setCompletedRecord(record);

          // Save payment record to context & storage
          if (recordPayment) {
            await recordPayment(record);
          }

          // If payment was for an inquiry, automatically advance its status!
          if (inquiryId && updateInquiryStatus) {
            if (paymentType === 'advance_deposit') {
              await updateInquiryStatus(
                inquiryId,
                'advance_payment_completed',
                `Advance deposit paid via ${selectedGateway.toUpperCase()} (Ref: ${record.payment_id})`
              );
            } else if (paymentType === 'milestone_payment' || paymentType === 'full_payment') {
              await updateInquiryStatus(
                inquiryId,
                'payment_completed',
                `Final payment settled via ${selectedGateway.toUpperCase()} (Ref: ${record.payment_id})`
              );
            }
          }

          // Celebrate with confetti
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366F1', '#10B981', '#38BDF8', '#F59E0B'],
          });

          if (onPaymentComplete) {
            onPaymentComplete(record);
          }
        },
        onError: (err: string) => {
          setIsProcessing(false);
          setErrorMessage(err || 'Payment failed. Please try another payment method.');
        },
        onClose: () => {
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment initiation failed.');
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white shadow-2xl transition-all text-left">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#121620] dark:bg-[#121620] light:bg-white flex items-center justify-between p-4 sm:p-6 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white dark:text-white light:text-slate-900">
                {completedRecord ? 'Payment Successful' : 'Complete Payment'}
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                {completedRecord ? 'Transaction Verified' : 'Secure Checkout & Instant Receipt'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {completedRecord ? (
          <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white dark:text-white light:text-slate-900">
                {formatCurrency(completedRecord.amount, completedRecord.currency)} Paid
              </h4>
              <p className="text-xs text-emerald-400 font-mono">
                {completedRecord.title}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 border border-[#252A36] dark:border-[#252A36] light:border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5 dark:border-white/5 light:border-slate-200">
                <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-500">Invoice Number</span>
                <span className="font-mono font-bold text-indigo-400 light:text-indigo-600">{completedRecord.invoice_number}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 dark:border-white/5 light:border-slate-200">
                <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-500">Transaction ID</span>
                <span className="font-mono text-zinc-300 dark:text-zinc-300 light:text-slate-800 break-all">{completedRecord.payment_id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 dark:border-white/5 light:border-slate-200">
                <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-500">Payment Gateway</span>
                <span className="uppercase font-semibold text-emerald-400 light:text-emerald-700">{completedRecord.gateway}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 dark:border-white/5 light:border-slate-200">
                <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-500">Billed To</span>
                <span className="text-white dark:text-white light:text-slate-900 font-medium">{completedRecord.client_name} ({completedRecord.client_email})</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-500">Timestamp</span>
                <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-500">{new Date(completedRecord.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-100 hover:bg-[#181D2A] text-white dark:text-white light:text-slate-900 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save Tax Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Done</span>
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form View */
          <form onSubmit={handlePayNow} className="p-5 sm:p-6 space-y-4 sm:space-y-5">
            {/* Amount Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 block">
                  Amount Due
                </span>
                <h4 className="text-2xl font-extrabold text-white dark:text-white light:text-slate-900">
                  {formatCurrency(amount, currency)}
                </h4>
                <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5">
                  {title}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>256-Bit SSL</span>
                </span>
              </div>
            </div>

            {/* Gateway Selection */}
            {settings.razorpay_enabled && settings.cashfree_enabled ? (
              <div>
                <label className="text-xs font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-2">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Razorpay Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('razorpay')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      selectedGateway === 'razorpay'
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-md shadow-indigo-500/20'
                        : 'border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white dark:text-white light:text-slate-900">
                        UPI &amp; NetBanking
                      </span>
                      <span className="text-[10px] font-mono text-indigo-400 font-semibold">Primary</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-slate-500 leading-tight">
                      Google Pay, PhonePe, Paytm, RuPay, Visa, MC &amp; NetBanking
                    </p>
                  </button>

                  {/* Cashfree Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('cashfree')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      selectedGateway === 'cashfree'
                        ? 'border-purple-500 bg-purple-500/10 shadow-md shadow-purple-500/20'
                        : 'border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white dark:text-white light:text-slate-900">
                        Instant UPI QR
                      </span>
                      <span className="text-[10px] font-mono text-purple-400 font-semibold">Fast PG</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-slate-500 leading-tight">
                      Instant Scan &amp; Pay QR, Credit/Debit Cards, Wallets
                    </p>
                  </button>
                </div>
              </div>
            ) : null}

            {/* Client Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 dark:text-zinc-400 light:text-slate-600 block mb-1">
                  Full Name / Company
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 dark:text-zinc-400 light:text-slate-600 block mb-1">
                    Email (for invoice receipt)
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 dark:text-zinc-400 light:text-slate-600 block mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-xl shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Secure Gateway...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    Pay {formatCurrency(amount, currency)} Securely
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Trust Footer */}
            <div className="pt-2 flex items-center justify-center gap-4 text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 text-center">
              <span>Verified RBI Compliance</span>
              <span>&bull;</span>
              <span>100% Tax Deductible Invoice</span>
              <span>&bull;</span>
              <span>Refund Protection</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
