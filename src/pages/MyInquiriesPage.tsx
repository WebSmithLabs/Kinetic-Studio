import React, { useMemo, useEffect } from 'react';
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
  DollarSign,
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
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useStudio } from '../context/StudioContext';
import { InquiryStatus } from '../types';

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
    icon: <DollarSign className="w-4 h-4" />,
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

const InquiryCard: React.FC<{
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
    status: InquiryStatus;
    created_at: string;
    updated_at?: string;
  };
}> = ({ inquiry }) => {
  const [expanded, setExpanded] = React.useState(false);
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
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-500 light:hover:text-slate-900 border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 hover:bg-[#181D2A] dark:hover:bg-[#181D2A] light:hover:bg-slate-100 transition-all cursor-pointer"
          >
            <span>{expanded ? 'Less' : 'Details'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
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
      </div>

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
              <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
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
          </div>
        </div>
      )}
    </div>
  );
};

export const MyInquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, inquiries, authLoading, settings } = useStudio();

  // Filter inquiries belonging to the current user (matched by email)
  const myInquiries = useMemo(() => {
    if (!currentUser) return [];
    const email = currentUser.email.toLowerCase().trim();
    return inquiries
      .filter(inq => inq.email.toLowerCase().trim() === email)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [currentUser, inquiries]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login?redirectTo=/my-inquiries', { replace: true });
    }
  }, [authLoading, currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const activeCount = myInquiries.filter(
    inq => !['finished', 'archived'].includes(inq.status)
  ).length;
  const completedCount = myInquiries.filter(
    inq => inq.status === 'finished' || inq.status === 'payment_completed'
  ).length;

  return (
    <>
      <SEO
        title="My Inquiries | Web Smith Labs"
        description="Track the status of your project inquiries and engineering submissions with Web Smith Labs."
      />

      <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-[#FAFAFC] text-left transition-colors">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 light:border-indigo-200 light:bg-indigo-50 text-xs font-mono font-semibold text-indigo-300 light:text-indigo-600 mb-2">
                <ClipboardList className="w-3.5 h-3.5" />
                <span>PROJECT TRACKER</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
                My Inquiries
              </h1>
              <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1">
                Track the status and progress of your project submissions.
              </p>
            </div>

            <Link
              to="/start-project"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 group active:scale-95 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>New Inquiry</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Stats Summary */}
          {myInquiries.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900">
                  {myInquiries.length}
                </div>
                <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-500 uppercase tracking-wider mt-0.5">
                  Total
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 light:border-indigo-200 light:bg-indigo-50 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 light:text-indigo-600">
                  {activeCount}
                </div>
                <div className="text-[11px] font-mono text-indigo-400/70 light:text-indigo-500 uppercase tracking-wider mt-0.5">
                  Active
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 light:border-emerald-200 light:bg-emerald-50 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 light:text-emerald-600">
                  {completedCount}
                </div>
                <div className="text-[11px] font-mono text-emerald-400/70 light:text-emerald-500 uppercase tracking-wider mt-0.5">
                  Completed
                </div>
              </div>
            </div>
          )}

          {/* Inquiry Cards */}
          {myInquiries.length > 0 ? (
            <div className="space-y-4">
              {myInquiries.map(inquiry => (
                <InquiryCard key={inquiry.id} inquiry={inquiry} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <ClipboardList className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-white light:text-slate-900 mb-2">
                  No Project Inquiries Yet
                </h2>
                <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-500 max-w-md mx-auto leading-relaxed">
                  You haven&apos;t submitted any project inquiries yet. Start by describing your project idea and our engineering team will review your submission.
                </p>
              </div>
              <Link
                to="/start-project"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all group"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

          {/* Help Section */}
          <div className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/60 dark:bg-[#121620]/60 light:bg-white p-5 sm:p-6">
            <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 mb-2">
              Need Help With Your Project?
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 leading-relaxed mb-3">
              If you have questions about your inquiry status or need to update your project requirements, reach out to our team directly.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 light:text-indigo-600 hover:text-indigo-300 light:hover:text-indigo-500 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{settings.contact_email}</span>
                </a>
              )}
              {settings.phone_number && (
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{settings.phone_number}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
