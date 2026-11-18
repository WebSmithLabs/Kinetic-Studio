import React, { useMemo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Mail,
  Phone,
  Building2,
  FileText,
  IndianRupee,
  Calendar,
  Globe,
  AlertCircle,
  CircleDot,
  CreditCard,
  Archive,
  Rocket,
  Eye,
  ChevronDown,
  ChevronUp,
  Download,
  Receipt,
  ShieldCheck,
  Send,
  ExternalLink,
  Layers,
  Paperclip,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useStudio } from '../context/StudioContext';
import { InquiryStatus, PaymentRecord, CollaborationItem } from '../types';
import { PaymentModal } from '../components/common/PaymentModal';
import { formatCurrency } from '../lib/payments';

// Status configuration with colors, labels, and icons
const STATUS_CONFIG: Record<
  InquiryStatus,
  { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode; step: number }
> = {
  new: {
    label: 'Submitted',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    icon: <ClipboardList className="w-4 h-4" />,
    step: 1,
  },
  reviewed: {
    label: 'Under Review',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    icon: <Eye className="w-4 h-4" />,
    step: 2,
  },
  contacted: {
    label: 'Contacted',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    icon: <MessageSquare className="w-4 h-4" />,
    step: 3,
  },
  accepted: {
    label: 'Accepted',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    icon: <CheckCircle2 className="w-4 h-4" />,
    step: 4,
  },
  advance_payment_completed: {
    label: 'Advance Paid',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    icon: <CreditCard className="w-4 h-4" />,
    step: 5,
  },
  ongoing: {
    label: 'In Progress',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    icon: <Rocket className="w-4 h-4" />,
    step: 6,
  },
  payment_completed: {
    label: 'Payment Complete',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    icon: <IndianRupee className="w-4 h-4" />,
    step: 7,
  },
  finished: {
    label: 'Delivered',
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-400/40',
    icon: <CheckCircle2 className="w-4 h-4" />,
    step: 8,
  },
  archived: {
    label: 'Archived',
    color: 'text-zinc-400',
    bgColor: 'bg-zinc-500/10',
    borderColor: 'border-zinc-500/30',
    icon: <Archive className="w-4 h-4" />,
    step: 9,
  },
};

// Timeline steps for the progress tracker
const TIMELINE_STEPS = [
  { key: 'new', label: 'Submitted' },
  { key: 'reviewed', label: 'Reviewed' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'ongoing', label: 'In Progress' },
  { key: 'finished', label: 'Delivered' },
];

interface InquiryCardProps {
  inquiry: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    company_name?: string;
    project_type: string;
    description: string;
    budget_range: string;
    timeframe: string;
    reference_websites?: string;
    domain_preference?: string;
    cloud_preference?: string;
    status: InquiryStatus;
    total_amount?: number;
    advance_amount?: number;
    paid_amount?: number;
    quote_notes?: string;
    admin_notes?: string;
    created_at: string;
    updated_at?: string;
  };
  onTriggerPayment: (
    inquiry: any,
    type: 'advance_deposit' | 'milestone_payment',
    amount: number
  ) => void;
}

const InquiryCard: React.FC<InquiryCardProps> = ({ inquiry, onTriggerPayment }) => {
  const [expanded, setExpanded] = useState(false);
  const [collabExpanded, setCollabExpanded] = useState(false);
  const [collabText, setCollabText] = useState('');
  const { collaborations, addCollaborationMessage, currentUser } = useStudio();

  const config = STATUS_CONFIG[inquiry.status] || STATUS_CONFIG.new;
  const currentStep = config.step;

  const submittedDate = new Date(inquiry.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const updatedDate = inquiry.updated_at
    ? new Date(inquiry.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  // Filter messages related to this inquiry
  const projectMessages = collaborations.filter(c => c.inquiry_id === inquiry.id);

  // Dynamic custom valuation set by Admin
  const hasAgreedQuote = typeof inquiry.total_amount === 'number' && inquiry.total_amount > 0;
  const totalAmount = inquiry.total_amount || 0;
  const advanceAmount = inquiry.advance_amount || Math.round(totalAmount * 0.5);
  const paidAmount = inquiry.paid_amount || 0;
  const balanceDue = Math.max(0, totalAmount - paidAmount);

  const handleSendCollaborationNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collabText.trim()) return;

    await addCollaborationMessage({
      inquiry_id: inquiry.id,
      sender_email: currentUser?.email || inquiry.email,
      sender_name: currentUser?.full_name || inquiry.full_name,
      sender_role: 'client',
      message: collabText.trim(),
      type: 'message',
    });

    setCollabText('');
  };

  return (
    <div className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white shadow-xl overflow-hidden transition-all">
      {/* Card Header */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div className="flex-grow">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border ${config.color} ${config.bgColor} ${config.borderColor}`}>
                {config.icon}
                <span>{config.label}</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-500 light:text-slate-400">
                #{inquiry.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white dark:text-white light:text-slate-900">
              {inquiry.project_type}
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5">
              Submitted {submittedDate}
              {updatedDate && updatedDate !== submittedDate && (
                <> &bull; Last updated {updatedDate}</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollabExpanded(!collabExpanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Workspace &amp; Notes</span>
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-500 light:hover:text-slate-900 border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 hover:bg-[#181D2A] transition-all cursor-pointer"
            >
              <span>{expanded ? 'Less' : 'Details'}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-4">
          <div className="flex items-center justify-between gap-1">
            {TIMELINE_STEPS.map((step, idx) => {
              const stepConfig = STATUS_CONFIG[step.key as InquiryStatus];
              const isActive = stepConfig && currentStep >= stepConfig.step;
              const isCurrent = stepConfig && currentStep === stepConfig.step;
              const isArchived = inquiry.status === 'archived';

              return (
                <React.Fragment key={step.key}>
                  {idx > 0 && (
                    <div
                      className={`flex-grow h-0.5 rounded-full transition-colors ${
                        isActive && !isArchived
                          ? 'bg-indigo-500/60'
                          : 'bg-[#252A36] dark:bg-[#252A36] light:bg-slate-200'
                      }`}
                    />
                  )}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isArchived
                          ? 'bg-zinc-500/20 text-zinc-500 border border-zinc-500/30'
                          : isCurrent
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/40 shadow-md shadow-indigo-500/30'
                          : isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#1A1F2E] dark:bg-[#1A1F2E] light:bg-slate-100 text-zinc-500 dark:text-zinc-500 light:text-slate-400 border border-[#252A36] dark:border-[#252A36] light:border-slate-200'
                      }`}
                    >
                      {isActive && !isCurrent && !isArchived ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] font-mono leading-tight text-center max-w-[52px] ${
                        isCurrent
                          ? 'text-indigo-400 font-semibold'
                          : isActive && !isArchived
                          ? 'text-emerald-400/70'
                          : 'text-zinc-500 dark:text-zinc-500 light:text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* CUSTOM VALUATION & PAYMENT ACTION BANNERS */}
        {!hasAgreedQuote && (inquiry.status === 'new' || inquiry.status === 'reviewed' || inquiry.status === 'contacted') && (
          <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300 block">
                  Scope Review &amp; Consultation in Progress
                </span>
                <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 text-[11px] leading-relaxed block mt-0.5">
                  Our engineering lead is evaluating your project requirements. We will contact you directly to agree on deliverables and finalize your custom project fee (₹ INR).
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] whitespace-nowrap self-start sm:self-center">
              Tailored Quote Pending
            </span>
          </div>
        )}

        {hasAgreedQuote && (
          <div className="mt-5 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/[0.07] to-purple-500/[0.05] p-4 space-y-3 animate-fadeIn">
            {/* Quote Header & Financials */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-500/20">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white dark:text-white light:text-slate-900">
                  Agreed Project Valuation (INR)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Total Fee: ₹{totalAmount.toLocaleString('en-IN')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Kickoff Deposit: ₹{advanceAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Scope Deliverables Notes if set by Admin */}
            {inquiry.quote_notes && (
              <div className="p-3 rounded-lg bg-black/30 dark:bg-black/30 light:bg-white border border-white/5 dark:border-white/5 light:border-slate-200 text-xs">
                <span className="text-[10px] font-mono uppercase text-indigo-400 block mb-1">
                  Scope &amp; Deliverables Breakdown:
                </span>
                <p className="text-zinc-200 dark:text-zinc-200 light:text-slate-700 text-xs leading-relaxed">
                  {inquiry.quote_notes}
                </p>
              </div>
            )}

            {/* Payment Trigger Buttons */}
            {(inquiry.status === 'accepted' || paidAmount < advanceAmount) && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-zinc-300 dark:text-zinc-300 light:text-slate-600">
                  Deposit the advance kickoff fee to begin architecture design and Sprint 1 development.
                </p>
                <button
                  onClick={() => onTriggerPayment(inquiry, 'advance_deposit', advanceAmount)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 transition-all shrink-0 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay Advance Kickoff (₹{advanceAmount.toLocaleString('en-IN')})</span>
                </button>
              </div>
            )}

            {(inquiry.status === 'advance_payment_completed' || inquiry.status === 'ongoing') && balanceDue > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
                    <Rocket className="w-4 h-4 text-indigo-400" />
                    <span>Advance Kickoff Paid (₹{paidAmount.toLocaleString('en-IN')}) &bull; Sprint in Progress</span>
                  </span>
                  <p className="text-[11px] text-zinc-300 dark:text-zinc-300 light:text-slate-600 mt-0.5">
                    Settle final milestone balance for complete source code handover and domain DNS release.
                  </p>
                </div>
                <button
                  onClick={() => onTriggerPayment(inquiry, 'milestone_payment', balanceDue)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all shrink-0 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Settle Balance (₹{balanceDue.toLocaleString('en-IN')})</span>
                </button>
              </div>
            )}

            {(inquiry.status === 'payment_completed' || (balanceDue === 0 && paidAmount > 0)) && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-400">
                <span className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Full Project Fee Settled &bull; Repository &amp; Assets Handover Complete</span>
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  ₹{totalAmount.toLocaleString('en-IN')} Paid
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Workspace Collaboration Drawer */}
      {collabExpanded && (
        <div className="border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200 p-5 sm:p-6 bg-[#0E1118]/70 dark:bg-[#0E1118]/70 light:bg-slate-50 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              <span>Project Collaboration &amp; Deliverables Channel</span>
            </h4>
            <span className="text-[10px] text-zinc-500">Live Client &bull; Squad Workspace</span>
          </div>

          {/* Messages Feed */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {projectMessages.length > 0 ? (
              projectMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl text-xs space-y-1.5 ${
                    msg.sender_role === 'team'
                      ? 'bg-indigo-500/10 dark:bg-indigo-500/10 light:bg-indigo-50/80 border border-indigo-500/30 light:border-indigo-200'
                      : 'bg-white/[0.03] dark:bg-white/[0.03] light:bg-white border border-white/5 dark:border-white/5 light:border-slate-200 light:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                    <span className="font-bold text-white dark:text-white light:text-slate-900">
                      {msg.sender_name} {msg.sender_role === 'team' && <span className="text-indigo-400 light:text-indigo-600 font-mono">[Engineering Squad]</span>}
                    </span>
                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-zinc-200 dark:text-zinc-200 light:text-slate-800 leading-relaxed">
                    {msg.message}
                  </p>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-2">
                      {msg.attachments.map((att, i) => (
                        <a
                          key={i}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono bg-black/40 text-indigo-300 border border-white/10 hover:border-indigo-400 transition-colors"
                        >
                          <Paperclip className="w-3 h-3" />
                          <span>{att.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-400 italic py-2">
                No discussion entries yet. Post questions, design feedback, or asset requests below.
              </p>
            )}
          </div>

          {/* Post Message Form */}
          <form onSubmit={handleSendCollaborationNote} className="flex gap-2">
            <input
              type="text"
              value={collabText}
              onChange={e => setCollabText(e.target.value)}
              placeholder="Send project feedback, revision request, or link..."
              className="flex-grow px-3.5 py-2 rounded-xl text-xs bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-white border border-[#252A36] dark:border-[#252A36] light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 light:placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200 p-5 sm:p-6 space-y-4 bg-[#0E1118]/50 dark:bg-[#0E1118]/50 light:bg-slate-50/50 animate-fadeIn">
          {/* Project Description */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-500 light:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3 h-3" />
              <span>Project Brief</span>
            </div>
            <p className="text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
              {inquiry.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#121620] dark:bg-[#121620] light:bg-white border border-[#252A36] dark:border-[#252A36] light:border-slate-200">
              <IndianRupee className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Budget Range</span>
                <span className="text-sm font-medium text-white dark:text-white light:text-slate-900">{inquiry.budget_range}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#121620] dark:bg-[#121620] light:bg-white border border-[#252A36] dark:border-[#252A36] light:border-slate-200">
              <Calendar className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Timeline</span>
                <span className="text-sm font-medium text-white dark:text-white light:text-slate-900">{inquiry.timeframe}</span>
              </div>
            </div>

            {inquiry.company_name && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#121620] dark:bg-[#121620] light:bg-white border border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                <Building2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Company</span>
                  <span className="text-sm font-medium text-white dark:text-white light:text-slate-900">{inquiry.company_name}</span>
                </div>
              </div>
            )}

            {inquiry.phone && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#121620] dark:bg-[#121620] light:bg-white border border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Phone</span>
                  <span className="text-sm font-medium text-white dark:text-white light:text-slate-900">{inquiry.phone}</span>
                </div>
              </div>
            )}

            {inquiry.reference_websites && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#121620] dark:bg-[#121620] light:bg-white border border-[#252A36] dark:border-[#252A36] light:border-slate-200 sm:col-span-2">
                <Globe className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Reference Links</span>
                  <span className="text-sm text-indigo-400 light:text-indigo-600 break-all">{inquiry.reference_websites}</span>
                </div>
              </div>
            )}

            {inquiry.domain_preference && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#121620] dark:bg-[#121620] light:bg-white border border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Domain Setup</span>
                  <span className="text-xs font-medium text-white dark:text-white light:text-slate-900">{inquiry.domain_preference}</span>
                </div>
              </div>
            )}

            {inquiry.cloud_preference && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#121620] dark:bg-[#121620] light:bg-white border border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Cloud Architecture</span>
                  <span className="text-xs font-medium text-white dark:text-white light:text-slate-900">{inquiry.cloud_preference}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const MyInquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    inquiries,
    payments,
    clientSubscriptions,
    authLoading,
    settings,
  } = useStudio();

  const [activeTab, setActiveTab] = useState<'inquiries' | 'subscriptions' | 'payments'>('inquiries');

  // Payment Modal Trigger State
  const [paymentModalState, setPaymentModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    amount: number;
    paymentType: 'advance_deposit' | 'milestone_payment';
    inquiryId: string;
  } | null>(null);

  // Filter inquiries belonging to current user
  const myInquiries = useMemo(() => {
    if (!currentUser) return [];
    const email = currentUser.email.toLowerCase().trim();
    return inquiries
      .filter(inq => inq.email.toLowerCase().trim() === email)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [currentUser, inquiries]);

  // Filter user's payment records
  const myPayments = useMemo(() => {
    if (!currentUser) return [];
    const email = currentUser.email.toLowerCase().trim();
    return payments
      .filter(p => p.client_email.toLowerCase().trim() === email)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [currentUser, payments]);

  // Filter user's active subscriptions
  const mySubscriptions = useMemo(() => {
    if (!currentUser) return [];
    const email = currentUser.email.toLowerCase().trim();
    return clientSubscriptions
      .filter(s => s.client_email.toLowerCase().trim() === email)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [currentUser, clientSubscriptions]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login?redirectTo=/my-inquiries', { replace: true });
    }
  }, [authLoading, currentUser, navigate]);

  if (!currentUser) return null;

  const activeCount = myInquiries.filter(
    inq => !['finished', 'archived'].includes(inq.status)
  ).length;
  const completedCount = myInquiries.filter(
    inq => inq.status === 'finished' || inq.status === 'payment_completed'
  ).length;

  const handleOpenPayment = (
    inq: any,
    type: 'advance_deposit' | 'milestone_payment',
    amount: number
  ) => {
    setPaymentModalState({
      isOpen: true,
      title: type === 'advance_deposit' ? `Advance Project Deposit: ${inq.project_type}` : `Milestone Settlement: ${inq.project_type}`,
      description: `Payment for project #${inq.id.slice(0, 8).toUpperCase()}`,
      amount,
      paymentType: type,
      inquiryId: inq.id,
    });
  };

  return (
    <>
      <SEO
        title="Client Workspace & Project Hub | Web Smith Labs"
        description="Track your custom project milestones, pay agreed invoices securely in INR (₹), review deliverables, and collaborate directly with senior engineers at Web Smith Labs."
      />

      <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-[#FAFAFC] text-left transition-colors">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 light:border-indigo-200 light:bg-indigo-50 text-xs font-mono font-semibold text-indigo-300 light:text-indigo-600 mb-2">
                <ClipboardList className="w-3.5 h-3.5" />
                <span>CLIENT WORKSPACE &amp; DASHBOARD</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
                Projects, Milestones &amp; Payments
              </h1>
              <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1">
                Collaborate with our engineering squad, track custom milestones, and settle project invoices in INR (₹).
              </p>
            </div>

            <div className="flex items-center gap-2">
              {settings.enable_store && (
                <Link
                  to="/store"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#252A36] dark:border-[#252A36] light:border-slate-300 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 bg-[#121620] dark:bg-[#121620] light:bg-white hover:bg-[#181D2A] light:hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <span>Browse Store</span>
                </Link>
              )}
              <Link
                to="/start-project"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all active:scale-95 shrink-0"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>New Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200 pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-100'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Projects &amp; Inquiries ({myInquiries.length})</span>
            </button>
            {settings.enable_maintenance && (
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'subscriptions'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Active Retainers ({mySubscriptions.length})</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-100'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Invoices &amp; Receipts ({myPayments.length})</span>
            </button>
          </div>

          {/* TAB 1: INQUIRIES & PROJECTS */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              {/* Stats Bar */}
              {myInquiries.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white text-center shadow-sm">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900">{myInquiries.length}</div>
                    <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-500 uppercase tracking-wider mt-0.5">Total</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-indigo-500/20 light:border-indigo-200 bg-indigo-500/5 light:bg-indigo-50/70 text-center shadow-sm">
                    <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 light:text-indigo-600">{activeCount}</div>
                    <div className="text-[11px] font-mono text-indigo-400/70 light:text-indigo-600/80 uppercase tracking-wider mt-0.5">Active</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-emerald-500/20 light:border-emerald-200 bg-emerald-500/5 light:bg-emerald-50/70 text-center shadow-sm">
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 light:text-emerald-600">{completedCount}</div>
                    <div className="text-[11px] font-mono text-emerald-400/70 light:text-emerald-600/80 uppercase tracking-wider mt-0.5">Completed</div>
                  </div>
                </div>
              )}

              {/* Cards List */}
              {myInquiries.length > 0 ? (
                <div className="space-y-4">
                  {myInquiries.map(inquiry => (
                    <InquiryCard
                      key={inquiry.id}
                      inquiry={inquiry}
                      onTriggerPayment={handleOpenPayment}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 space-y-4 rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/40 dark:bg-[#121620]/40 light:bg-white p-8">
                  <ClipboardList className="w-12 h-12 text-zinc-500 light:text-slate-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">No active project inquiries</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 max-w-sm mx-auto">
                    Submit your project specifications to begin design workshops and Sprint 1 development.
                  </p>
                  <Link
                    to="/start-project"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-500/20"
                  >
                    <span>Start a Project</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE RETAINERS & SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              {mySubscriptions.length > 0 ? (
                <div className="space-y-4">
                  {mySubscriptions.map(sub => (
                    <div
                      key={sub.id}
                      className="p-6 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {sub.status}
                          </span>
                          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-500 light:text-slate-400">
                            ID: {sub.id}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">{sub.plan_name}</h3>
                        <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                          {formatCurrency(sub.amount, sub.currency)} / {sub.billing_cycle} &bull; Next renewal: {new Date(sub.next_billing_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to="/maintenance"
                          className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                        >
                          Change Plan
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-dashed border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#121620]/30 dark:bg-[#121620]/30 light:bg-white text-center space-y-4">
                  <ShieldCheck className="w-12 h-12 text-indigo-400 light:text-indigo-600 mx-auto" />
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">No Active Website Retainers</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 max-w-md mx-auto">
                    Subscribe to continuous performance monitoring, weekly secure backups, and dedicated developer support hours with direct senior engineer access.
                  </p>
                  <Link
                    to="/maintenance"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
                  >
                    <span>View Maintenance Plans</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAYMENTS & INVOICES */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {myPayments.length > 0 ? (
                <div className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-xs">
                      <thead className="bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-mono uppercase text-[10px] border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                        <tr>
                          <th className="p-4">Invoice #</th>
                          <th className="p-4">Description</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Gateway</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4 text-right">Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#252A36] dark:divide-[#252A36] light:divide-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                        {myPayments.map(pay => (
                          <tr key={pay.id} className="hover:bg-white/[0.02] dark:hover:bg-white/[0.02] light:hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-mono font-bold text-indigo-400 light:text-indigo-600">
                              {pay.invoice_number}
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-white dark:text-white light:text-slate-900 block">{pay.title}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">{pay.payment_id}</span>
                            </td>
                            <td className="p-4 text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                              {new Date(pay.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4 uppercase font-mono font-semibold text-emerald-400 light:text-emerald-700">
                              {pay.gateway}
                            </td>
                            <td className="p-4 font-bold text-white dark:text-white light:text-slate-900">
                              {formatCurrency(pay.amount, pay.currency)}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 hover:bg-[#181D2A] light:hover:bg-slate-100 text-[11px] font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 cursor-pointer shadow-sm"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Print</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-dashed border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#121620]/30 dark:bg-[#121620]/30 light:bg-white text-center space-y-4">
                  <Receipt className="w-12 h-12 text-zinc-500 light:text-slate-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">No Payment Records Found</h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                    Invoices and official GST receipts will appear here after your first milestone or template payment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModalState && (
        <PaymentModal
          isOpen={paymentModalState.isOpen}
          onClose={() => setPaymentModalState(null)}
          title={paymentModalState.title}
          description={paymentModalState.description}
          amount={paymentModalState.amount}
          currency="INR"
          paymentType={paymentModalState.paymentType}
          inquiryId={paymentModalState.inquiryId}
          onPaymentComplete={() => {
            setPaymentModalState(null);
          }}
        />
      )}
    </>
  );
};
