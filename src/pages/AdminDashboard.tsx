import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  FolderGit2,
  Mail,
  Settings,
  FileEdit,
  Database,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Eye,
  EyeOff,
  Star,
  Save,
  Search,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { SEO } from '../components/common/SEO';
import { GoogleIcon } from '../components/common/SocialIcons';
import {
  ProjectItem,
  InquiryItem,
  ServiceItem,
  FaqItem,
  TestimonialItem,
  ProjectCategory,
  InquiryStatus,
} from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    adminUser,
    isAdmin,
    loginAdmin,
    registerAdmin,
    logoutAdmin,
    loginWithGoogle,
    logout,
    isConfigured,
    configuredUrl,
    connectSupabase,
    disconnectSupabase,
    testSupabaseConnection,
    seedSupabaseDatabase,
    settings,
    updateSettings,
    projects,
    addProject,
    updateProject,
    deleteProject,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    services,
    updateService,
    faqs,
    addFaq,
    deleteFaq,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } = useStudio();

  // Supabase dynamic setup state
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(configuredUrl || '');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [connTesting, setConnTesting] = useState(false);
  const [connMessage, setConnMessage] = useState<{
    success: boolean;
    text: string;
    tableCounts?: Record<string, number>;
  } | null>(null);
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [seedMessage, setSeedMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Auth form state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'inquiries' | 'settings' | 'content' | 'database'
  >('overview');

  // Notifications / feedback
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings form state
  const [formSettings, setFormSettings] = useState(settings);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<ProjectItem>>({
    title: '',
    slug: '',
    subtitle: '',
    category: 'Business Websites',
    client_name: '',
    summary: '',
    description: '',
    challenge: '',
    solution: '',
    results: '',
    thumbnail_url: '',
    screenshots: [],
    technologies: [],
    live_url: '',
    github_url: '',
    completion_date: '',
    is_featured: false,
    is_published: true,
    display_order: 1,
  });

  // Project Filter / Search
  const [projectSearch, setProjectSearch] = useState('');

  // Inquiry Filter / Search
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');

  // Content Sub-tab
  const [contentSubTab, setContentSubTab] = useState<'services' | 'faqs' | 'testimonials'>('services');

  // FAQ Modal / Form
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Testimonial Form
  const [newTestName, setNewTestName] = useState('');
  const [newTestRole, setNewTestRole] = useState('');
  const [newTestComp, setNewTestComp] = useState('');
  const [newTestQuote, setNewTestQuote] = useState('');

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsLoggingIn(true);
    const result = await loginAdmin(authEmail, authPassword);
    setIsLoggingIn(false);
    if (!result.success) {
      setAuthError(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  // Handle Admin Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please fill out all required fields.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    setIsLoggingIn(true);
    const result = await registerAdmin(authEmail, authPassword, authName.trim() || 'Admin');
    setIsLoggingIn(false);
    if (!result.success) {
      setAuthError(result.error || 'Registration failed.');
    } else {
      setAuthSuccess('Administrator account created! You can now sign in.');
      setAuthMode('login');
    }
  };

  // Handle Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateSettings(formSettings);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Handle Project Form Submit
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.slug) return;

    if (editingProject) {
      await updateProject(editingProject.id, projectForm);
    } else {
      await addProject(projectForm as Omit<ProjectItem, 'id'>);
    }
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const openNewProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      slug: '',
      subtitle: '',
      category: 'Business Websites',
      client_name: '',
      summary: '',
      description: '',
      challenge: '',
      solution: '',
      results: '',
      thumbnail_url: '',
      screenshots: [],
      technologies: [],
      live_url: '',
      github_url: '',
      completion_date: '',
      is_featured: false,
      is_published: true,
      display_order: projects.length + 1,
    });
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setProjectForm(proj);
    setIsProjectModalOpen(true);
  };

  // If NOT authenticated, show Login Screen
  if (!isAdmin) {
    return (
      <>
        <SEO title="Studio Administration | Web Smith Labs" />
        <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-[#FAFAFC] transition-colors">
          <div className="w-full max-w-md rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-8 sm:p-10 shadow-2xl text-left space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-white dark:text-white light:text-slate-900">
                Studio Admin Access
              </h1>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                Secure administration portal for Web Smith Labs. Connected to Supabase Auth.
              </p>
            </div>

            {currentUser ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 light:text-amber-800 space-y-2">
                  <div className="font-semibold text-sm text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Administrator Privileges Required</span>
                  </div>
                  <p>
                    You are currently signed in as <strong className="font-mono text-white dark:text-white light:text-slate-900">{currentUser.email}</strong>, which does not possess studio administrator authorization.
                  </p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                    Designated admin accounts (<span className="font-mono text-indigo-400">websmithlaps@gmail.com</span>) are granted immediate full access upon signing in.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all text-center cursor-pointer shadow-md shadow-indigo-500/20"
                  >
                    Sign Out & Switch Account
                  </button>
                  <a
                    href="/"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 border border-[#252A36] dark:border-[#252A36] light:border-slate-300 text-center transition-all"
                  >
                    Return to Homepage
                  </a>
                </div>
              </div>
            ) : (
              <>
                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={async () => {
                    await loginWithGoogle('/admin');
                  }}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-white text-xs font-semibold text-white dark:text-white light:text-slate-800 hover:bg-[#181D2A] dark:hover:bg-[#181D2A] light:hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                >
                  <GoogleIcon className="w-4 h-4 shrink-0" />
                  <span>Sign in with Google</span>
                </button>

                {/* Divider */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-mono">
                    <span className="px-2.5 bg-[#121620] dark:bg-[#121620] light:bg-white text-zinc-500">
                      Or with email
                    </span>
                  </div>
                </div>

                {/* Auth Mode Toggle */}
                <div className="grid grid-cols-2 p-1 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-100 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError('');
                      setAuthSuccess('');
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                      authMode === 'login'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white dark:text-zinc-400 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setAuthError('');
                      setAuthSuccess('');
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                      authMode === 'register'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white dark:text-zinc-400 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900'
                    }`}
                  >
                    Register Admin
                  </button>
                </div>

                {authError && (
                  <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {authSuccess && (
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                        Administrator Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Studio Lead"
                        value={authName}
                        onChange={e => setAuthName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 dark:placeholder:text-zinc-600 light:placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      Administrator Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="websmithlaps@gmail.com"
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 dark:placeholder:text-zinc-600 light:placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      Secure Password {authMode === 'register' && <span className="text-zinc-500 text-[10px]">(min 6 chars)</span>}
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 dark:placeholder:text-zinc-600 light:placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoggingIn
                      ? authMode === 'login'
                        ? 'Authenticating...'
                        : 'Creating Admin Account...'
                      : authMode === 'login'
                      ? 'Sign In to Dashboard'
                      : 'Register Administrator'}
                  </button>
                </form>

                <div className="pt-2 text-center space-y-2">
                  <div className="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-[11px] text-zinc-400 text-left flex items-start gap-2">
                    <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      Designated Admin: <span className="text-indigo-300 font-mono font-medium">websmithlaps@gmail.com</span> receives instant administrator permissions.
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 block">
                    Authentication powered by Supabase Auth &bull; Web Smith Labs
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  // Stats calculation
  const totalProjects = projects.length;
  const publishedProjects = projects.filter(p => p.is_published).length;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const pendingInquiries = inquiries.filter(i => i.status === 'new' || i.status === 'reviewing').length;

  return (
    <>
      <SEO title="Studio Administration | Web Smith Labs" />

      <div className="min-h-screen pt-28 pb-20 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-[#FAFAFC] text-left transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Admin Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 light:text-indigo-600">
                <Shield className="w-4 h-4" />
                <span>ADMINISTRATION COMMAND CENTER</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 mt-1">
                Studio Management Portal
              </h1>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                Signed in as <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-800">{adminUser?.email}</strong> &bull; Role:{' '}
                <span className="text-emerald-400 light:text-emerald-600 font-mono font-semibold uppercase">{adminUser?.role}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Supabase status badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border ${
                  isConfigured
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 light:border-emerald-300 light:text-emerald-700'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-300 light:border-amber-300 light:text-amber-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                <span>{isConfigured ? 'Supabase Connected' : 'Preview Storage (Awaiting Keys)'}</span>
              </div>

              <button
                onClick={logoutAdmin}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar border-b border-[#252A36]/60 dark:border-[#252A36]/60 light:border-slate-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 bg-[#121620] dark:bg-[#121620] light:bg-white border border-transparent light:border-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'projects'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 bg-[#121620] dark:bg-[#121620] light:bg-white border border-transparent light:border-slate-200'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Projects ({totalProjects})</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'inquiries'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 bg-[#121620] dark:bg-[#121620] light:bg-white border border-transparent light:border-slate-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Inquiries</span>
              {newInquiries > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {newInquiries}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 bg-[#121620] dark:bg-[#121620] light:bg-white border border-transparent light:border-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Website Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'content'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 bg-[#121620] dark:bg-[#121620] light:bg-white border border-transparent light:border-slate-200'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>Content Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'database'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 bg-[#121620] dark:bg-[#121620] light:bg-white border border-transparent light:border-slate-200'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Supabase Setup</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Metrics cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div className="p-6 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white space-y-1 shadow-sm">
                  <div className="text-xs font-mono uppercase text-zinc-400 dark:text-zinc-400 light:text-slate-500">Total Projects</div>
                  <div className="text-3xl font-extrabold text-white dark:text-white light:text-slate-900">{totalProjects}</div>
                  <div className="text-[11px] text-zinc-500">In database archive</div>
                </div>

                <div className="p-6 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white space-y-1 shadow-sm">
                  <div className="text-xs font-mono uppercase text-zinc-400 dark:text-zinc-400 light:text-slate-500">Published Projects</div>
                  <div className="text-3xl font-extrabold text-emerald-400 light:text-emerald-600">{publishedProjects}</div>
                  <div className="text-[11px] text-zinc-500">Live on public website</div>
                </div>

                <div className="p-6 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white space-y-1 shadow-sm">
                  <div className="text-xs font-mono uppercase text-zinc-400 dark:text-zinc-400 light:text-slate-500">New Inquiries</div>
                  <div className="text-3xl font-extrabold text-rose-400 light:text-rose-600">{newInquiries}</div>
                  <div className="text-[11px] text-zinc-500">Requires review</div>
                </div>

                <div className="p-6 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white space-y-1 shadow-sm">
                  <div className="text-xs font-mono uppercase text-zinc-400 dark:text-zinc-400 light:text-slate-500">Active Pipeline</div>
                  <div className="text-3xl font-extrabold text-indigo-400 light:text-indigo-600">{pendingInquiries}</div>
                  <div className="text-[11px] text-zinc-500">New &amp; reviewing</div>
                </div>
              </div>

              {/* Quick Actions & Recent Inquiries */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Inquiries List */}
                <div className="lg:col-span-2 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                    <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-400 light:text-indigo-600" />
                      <span>Recent Project Inquiries</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs text-indigo-400 light:text-indigo-600 hover:text-indigo-300 font-semibold"
                    >
                      View All &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {inquiries.slice(0, 4).map(inq => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-xl border border-white/5 dark:border-white/5 light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white dark:text-white light:text-slate-900">{inq.full_name}</span>
                            <span className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">({inq.email})</span>
                          </div>
                          <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1">
                            Type: <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-medium">{inq.project_type}</span> &bull; Budget:{' '}
                            <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-medium">{inq.budget_range}</span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            inq.status === 'new'
                              ? 'bg-rose-500/20 text-rose-300 light:bg-rose-100 light:text-rose-700 border border-rose-500/30 light:border-rose-300'
                              : inq.status === 'reviewing'
                              ? 'bg-amber-500/20 text-amber-300 light:bg-amber-100 light:text-amber-800 border border-amber-500/30 light:border-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300 light:bg-emerald-100 light:text-emerald-800 border border-emerald-500/30 light:border-emerald-300'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-6 space-y-4 shadow-sm">
                  <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 pb-3 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                    Quick Actions
                  </h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={openNewProjectModal}
                      className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Project</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full py-3 px-4 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 dark:hover:bg-[#181D2A] hover:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configure Company Info</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('database')}
                      className="w-full py-3 px-4 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 dark:hover:bg-[#181D2A] hover:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Database className="w-4 h-4" />
                      <span>Supabase Credentials Status</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PROJECTS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative min-w-[280px]">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={projectSearch}
                    onChange={e => setProjectSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#121620] dark:bg-[#121620] light:bg-white text-xs text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 shadow-sm"
                  />
                </div>

                <button
                  onClick={openNewProjectModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>

              {/* Projects Table */}
              <div className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-100 text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-mono uppercase tracking-wider border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                      <tr>
                        <th className="py-4 px-6">Project</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6">Featured</th>
                        <th className="py-4 px-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#252A36] dark:divide-[#252A36] light:divide-slate-200">
                      {projects
                        .filter(p => p.title.toLowerCase().includes(projectSearch.toLowerCase()))
                        .map(proj => (
                          <tr key={proj.id} className="hover:bg-white/[0.02] dark:hover:bg-white/[0.02] light:hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <img
                                  src={proj.thumbnail_url}
                                  alt={proj.title}
                                  className="w-12 h-9 rounded-lg object-cover border border-white/10 dark:border-white/10 light:border-slate-200 shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-white dark:text-white light:text-slate-900 text-sm">{proj.title}</div>
                                  <div className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-500">{proj.client_name}</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6 text-zinc-300 dark:text-zinc-300 light:text-slate-700 font-mono">{proj.category}</td>

                            <td className="py-4 px-6">
                              <button
                                onClick={() =>
                                  updateProject(proj.id, { is_published: !proj.is_published })
                                }
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                                  proj.is_published
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 light:bg-emerald-100 light:border-emerald-300 light:text-emerald-700'
                                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 light:bg-slate-100 light:border-slate-200 light:text-slate-600'
                                }`}
                              >
                                {proj.is_published ? (
                                  <>
                                    <Eye className="w-3 h-3" />
                                    <span>Published</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3 h-3" />
                                    <span>Draft</span>
                                  </>
                                )}
                              </button>
                            </td>

                            <td className="py-4 px-6">
                              <button
                                onClick={() =>
                                  updateProject(proj.id, { is_featured: !proj.is_featured })
                                }
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  proj.is_featured
                                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-400 light:bg-amber-50 light:border-amber-300 light:text-amber-600'
                                    : 'border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-zinc-600 dark:text-zinc-600 light:text-slate-400 hover:text-zinc-400'
                                }`}
                                title="Toggle Featured"
                              >
                                <Star className="w-4 h-4 fill-current" />
                              </button>
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openEditProjectModal(proj)}
                                  className="p-1.5 rounded-lg border border-zinc-700 dark:border-zinc-700 light:border-slate-300 hover:border-indigo-500 hover:text-indigo-400 text-zinc-300 dark:text-zinc-300 light:text-slate-700 transition-colors"
                                  title="Edit Project"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    if (confirm(`Delete project "${proj.title}"?`)) {
                                      deleteProject(proj.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg border border-zinc-700 dark:border-zinc-700 light:border-slate-300 hover:border-rose-500 hover:text-rose-400 text-zinc-300 dark:text-zinc-300 light:text-slate-700 transition-colors"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: INQUIRIES MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative min-w-[280px]">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search inquiries by name, email, company..."
                    value={inquirySearch}
                    onChange={e => setInquirySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#121620] dark:bg-[#121620] light:bg-white text-xs text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 shadow-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-mono">Status:</span>
                  <select
                    value={inquiryStatusFilter}
                    onChange={e => setInquiryStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#121620] dark:bg-[#121620] light:bg-white text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Inquiries</option>
                    <option value="new">New</option>
                    <option value="reviewing">In Review</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Inquiries Cards List */}
              <div className="space-y-4">
                {inquiries
                  .filter(i => {
                    if (inquiryStatusFilter !== 'all' && i.status !== inquiryStatusFilter)
                      return false;
                    if (!inquirySearch.trim()) return true;
                    const q = inquirySearch.toLowerCase();
                    return (
                      i.full_name.toLowerCase().includes(q) ||
                      i.email.toLowerCase().includes(q) ||
                      (i.company_name && i.company_name.toLowerCase().includes(q))
                    );
                  })
                  .map(inq => (
                    <div
                      key={inq.id}
                      className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-6 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">{inq.full_name}</h3>
                            {inq.company_name && (
                              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                                &bull; {inq.company_name}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-indigo-400 light:text-indigo-600 font-mono mt-0.5">
                            {inq.email} {inq.phone ? `&bull; ${inq.phone}` : ''}
                          </div>
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center gap-3">
                          <select
                            value={inq.status}
                            onChange={e =>
                              updateInquiryStatus(inq.id, e.target.value as InquiryStatus)
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider border ${
                              inq.status === 'new'
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 light:bg-rose-100 light:border-rose-300 light:text-rose-700'
                                : inq.status === 'reviewing'
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 light:bg-amber-100 light:border-amber-300 light:text-amber-700'
                                : inq.status === 'contacted'
                                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 light:bg-cyan-100 light:border-cyan-300 light:text-cyan-700'
                                : inq.status === 'converted'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 light:bg-emerald-100 light:border-emerald-300 light:text-emerald-700'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400 light:bg-slate-100 light:border-slate-200 light:text-slate-600'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="reviewing">In Review</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted</option>
                            <option value="archived">Archived</option>
                          </select>

                          <button
                            onClick={() => {
                              if (confirm(`Delete inquiry from ${inq.full_name}?`)) {
                                deleteInquiry(inq.id);
                              }
                            }}
                            className="p-2 rounded-lg border border-zinc-800 dark:border-zinc-800 light:border-slate-200 hover:border-rose-500 text-zinc-500 hover:text-rose-400 transition-colors"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Scope Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                        <div className="p-3 rounded-xl bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 border border-white/5 dark:border-white/5 light:border-slate-200">
                          <span className="text-zinc-500 light:text-slate-400 block">Project Type</span>
                          <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-900 font-semibold">{inq.project_type}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 border border-white/5 dark:border-white/5 light:border-slate-200">
                          <span className="text-zinc-500 light:text-slate-400 block">Budget Range</span>
                          <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-900 font-semibold">{inq.budget_range}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 border border-white/5 dark:border-white/5 light:border-slate-200">
                          <span className="text-zinc-500 light:text-slate-400 block">Timeframe</span>
                          <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-900 font-semibold">{inq.timeframe}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 border border-white/5 dark:border-white/5 light:border-slate-200">
                          <span className="text-zinc-500 light:text-slate-400 block">Submitted At</span>
                          <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                            {new Date(inq.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="p-4 rounded-xl bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 border border-white/5 dark:border-white/5 light:border-slate-200 text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                        <span className="text-zinc-500 light:text-slate-400 font-mono block mb-1">Project Scope:</span>
                        {inq.description}
                        {inq.reference_websites && (
                          <div className="mt-2 text-indigo-400 light:text-indigo-600 font-mono">
                            References: {inq.reference_websites}
                          </div>
                        )}
                      </div>

                      {/* Admin Internal Notes */}
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Add internal notes for team..."
                          defaultValue={inq.admin_notes || ''}
                          onBlur={e => updateInquiryStatus(inq.id, inq.status, e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-white text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-800 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: WEBSITE SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-8 animate-fadeIn">
              {saveSuccess && (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 light:bg-emerald-50 light:border-emerald-300 light:text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 light:text-emerald-600 shrink-0" />
                  <span>Website settings updated successfully!</span>
                </div>
              )}

              {/* Company Info */}
              <div className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 pb-3 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                  Company Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formSettings.company_name}
                      onChange={e =>
                        setFormSettings({ ...formSettings, company_name: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">Short Name</label>
                    <input
                      type="text"
                      value={formSettings.short_name}
                      onChange={e =>
                        setFormSettings({ ...formSettings, short_name: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      Studio Tagline
                    </label>
                    <input
                      type="text"
                      value={formSettings.tagline}
                      onChange={e =>
                        setFormSettings({ ...formSettings, tagline: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                    Operating Studio Address
                  </label>
                  <input
                    type="text"
                    value={formSettings.address}
                    onChange={e =>
                      setFormSettings({ ...formSettings, address: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Contact Channels */}
              <div className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 pb-3 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                  Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formSettings.contact_email}
                      onChange={e =>
                        setFormSettings({ ...formSettings, contact_email: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formSettings.phone_number}
                      onChange={e =>
                        setFormSettings({ ...formSettings, phone_number: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={formSettings.whatsapp_number}
                      onChange={e =>
                        setFormSettings({ ...formSettings, whatsapp_number: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 pb-3 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                  Social Media URLs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      X (Twitter) URL
                    </label>
                    <input
                      type="url"
                      value={formSettings.twitter_url}
                      onChange={e =>
                        setFormSettings({ ...formSettings, twitter_url: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={formSettings.linkedin_url}
                      onChange={e =>
                        setFormSettings({ ...formSettings, linkedin_url: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formSettings.github_url}
                      onChange={e =>
                        setFormSettings({ ...formSettings, github_url: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      Dribbble URL
                    </label>
                    <input
                      type="url"
                      value={formSettings.dribbble_url}
                      onChange={e =>
                        setFormSettings({ ...formSettings, dribbble_url: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section Texts */}
              <div className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 pb-3 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                  Hero Section Configuration
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={formSettings.hero_badge}
                      onChange={e =>
                        setFormSettings({ ...formSettings, hero_badge: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      Primary CTA Text
                    </label>
                    <input
                      type="text"
                      value={formSettings.primary_cta_text}
                      onChange={e =>
                        setFormSettings({ ...formSettings, primary_cta_text: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                    Main Heading Title
                  </label>
                  <input
                    type="text"
                    value={formSettings.hero_title}
                    onChange={e =>
                      setFormSettings({ ...formSettings, hero_title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                    Hero Supporting Description
                  </label>
                  <textarea
                    rows={3}
                    value={formSettings.hero_description}
                    onChange={e =>
                      setFormSettings({ ...formSettings, hero_description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* SEO & Footer */}
              <div className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 pb-3 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                  SEO &amp; Footer Notes
                </h3>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                    Meta Title Template
                  </label>
                  <input
                    type="text"
                    value={formSettings.meta_title}
                    onChange={e =>
                      setFormSettings({ ...formSettings, meta_title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={formSettings.meta_description}
                    onChange={e =>
                      setFormSettings({ ...formSettings, meta_description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                    Footer Statement
                  </label>
                  <input
                    type="text"
                    value={formSettings.footer_text}
                    onChange={e =>
                      setFormSettings({ ...formSettings, footer_text: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Website Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CONTENT MANAGER */}
          {/* ========================================================================= */}
          {activeTab === 'content' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200 pb-3">
                <button
                  onClick={() => setContentSubTab('services')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    contentSubTab === 'services'
                      ? 'bg-indigo-600 text-white'
                      : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
                  }`}
                >
                  Services ({services.length})
                </button>
                <button
                  onClick={() => setContentSubTab('faqs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    contentSubTab === 'faqs'
                      ? 'bg-indigo-600 text-white'
                      : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
                  }`}
                >
                  FAQs ({faqs.length})
                </button>
                <button
                  onClick={() => setContentSubTab('testimonials')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    contentSubTab === 'testimonials'
                      ? 'bg-indigo-600 text-white'
                      : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
                  }`}
                >
                  Testimonials ({testimonials.length})
                </button>
              </div>

              {/* Sub-tab Services */}
              {contentSubTab === 'services' && (
                <div className="space-y-4">
                  {services.map(svc => (
                    <div
                      key={svc.id}
                      className="p-5 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white flex items-center justify-between gap-4 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">{svc.title}</h4>
                          <span className="text-xs font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-500">({svc.category})</span>
                        </div>
                        <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1 max-w-xl">{svc.summary}</p>
                      </div>

                      <button
                        onClick={() => updateService(svc.id, { is_active: !svc.is_active })}
                        className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                          svc.is_active
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 light:bg-emerald-100 light:border-emerald-300 light:text-emerald-700'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 light:bg-slate-100 light:border-slate-200 light:text-slate-600'
                        }`}
                      >
                        {svc.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab FAQs */}
              {contentSubTab === 'faqs' && (
                <div className="space-y-6">
                  {/* New FAQ Form */}
                  <div className="p-5 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white space-y-3 shadow-sm">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 light:text-indigo-600">
                      Add New FAQ Item
                    </h4>
                    <input
                      type="text"
                      placeholder="Question..."
                      value={newFaqQ}
                      onChange={e => setNewFaqQ(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                    <textarea
                      rows={2}
                      placeholder="Answer..."
                      value={newFaqA}
                      onChange={e => setNewFaqA(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => {
                        if (newFaqQ && newFaqA) {
                          addFaq({
                            question: newFaqQ,
                            answer: newFaqA,
                            category: 'General',
                            display_order: faqs.length + 1,
                            is_active: true,
                          });
                          setNewFaqQ('');
                          setNewFaqA('');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                    >
                      Add FAQ
                    </button>
                  </div>

                  {/* List FAQs */}
                  <div className="space-y-3">
                    {faqs.map(f => (
                      <div
                        key={f.id}
                        className="p-4 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white flex items-start justify-between gap-4 shadow-sm"
                      >
                        <div>
                          <div className="text-sm font-bold text-white dark:text-white light:text-slate-900">{f.question}</div>
                          <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1">{f.answer}</div>
                        </div>
                        <button
                          onClick={() => deleteFaq(f.id)}
                          className="p-1.5 rounded-lg border border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-zinc-500 hover:text-rose-400 hover:border-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab Testimonials */}
              {contentSubTab === 'testimonials' && (
                <div className="space-y-6">
                  {/* New Testimonial Form */}
                  <div className="p-5 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white space-y-3 shadow-sm">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 light:text-indigo-600">
                      Add Client Testimonial
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Client Name..."
                        value={newTestName}
                        onChange={e => setNewTestName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Role / Title..."
                        value={newTestRole}
                        onChange={e => setNewTestRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Company Name..."
                        value={newTestComp}
                        onChange={e => setNewTestComp(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Quote..."
                      value={newTestQuote}
                      onChange={e => setNewTestQuote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => {
                        if (newTestName && newTestQuote) {
                          addTestimonial({
                            client_name: newTestName,
                            role_title: newTestRole,
                            company_name: newTestComp,
                            quote: newTestQuote,
                            rating: 5,
                            is_featured: true,
                            display_order: testimonials.length + 1,
                          });
                          setNewTestName('');
                          setNewTestRole('');
                          setNewTestComp('');
                          setNewTestQuote('');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                    >
                      Add Testimonial
                    </button>
                  </div>

                  <div className="space-y-3">
                    {testimonials.map(t => (
                      <div
                        key={t.id}
                        className="p-4 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white flex items-center justify-between gap-4 shadow-sm"
                      >
                        <div>
                          <div className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                            {t.client_name} &bull;{' '}
                            <span className="text-xs font-normal text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                              {t.role_title}, {t.company_name}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-700 italic mt-1">&ldquo;{t.quote}&rdquo;</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateTestimonial(t.id, { is_featured: !t.is_featured })
                            }
                            className={`p-1.5 rounded-lg border ${
                              t.is_featured
                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 light:bg-amber-50 light:border-amber-300 light:text-amber-600'
                                : 'border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-zinc-600 dark:text-zinc-600 light:text-slate-400'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>

                          <button
                            onClick={() => deleteTestimonial(t.id)}
                            className="p-1.5 rounded-lg border border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-zinc-500 hover:text-rose-400 hover:border-rose-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: SUPABASE CONNECTION & DATABASE CENTER */}
          {/* ========================================================================= */}
          {activeTab === 'database' && (
            <div className="rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-8 space-y-8 shadow-sm animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 light:text-emerald-600 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                      Supabase PostgreSQL Connection Center
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                      Connect live Supabase cloud database or manage schema &amp; sync for Web Smith Labs.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border ${
                      isConfigured
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                    <span>{isConfigured ? 'Live Connected' : 'Preview / Offline Cache'}</span>
                  </span>
                </div>
              </div>

              {/* Status Box */}
              <div
                className={`p-5 rounded-2xl border ${
                  isConfigured
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200 light:bg-emerald-50 light:border-emerald-300 light:text-emerald-800'
                    : 'border-amber-500/30 bg-amber-500/5 text-amber-200 light:bg-amber-50 light:border-amber-300 light:text-amber-800'
                }`}
              >
                <div className="text-sm font-bold flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${isConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <span>
                    Current Mode:{' '}
                    {isConfigured
                      ? 'Live Supabase Cloud Database Connected'
                      : 'Interactive Offline Mode (Ready for Supabase Credentials)'}
                  </span>
                </div>
                <p className="text-xs mt-1.5 text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                  {isConfigured
                    ? `Your website is connected to: ${configuredUrl || 'Supabase'}. All CRUD operations on site settings, services, portfolio projects, client inquiries, testimonials, and FAQs synchronize directly with PostgreSQL.`
                    : 'All features (CRUD for services, projects, FAQs, testimonials, settings, and contact inquiry submissions) are active in interactive browser storage. Connect your live Supabase project below to sync to your cloud PostgreSQL database.'}
                </p>
              </div>

              {/* Interactive Credentials Setup Form */}
              <div className="p-6 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0E1118] dark:bg-[#0E1118] light:bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                      Supabase Cloud Project Credentials
                    </h4>
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                      Enter your project URL and public Anon API key to connect instantly without rebuilding.
                    </p>
                  </div>
                  {isConfigured && (
                    <button
                      type="button"
                      onClick={() => {
                        disconnectSupabase();
                        setSupabaseUrlInput('');
                        setSupabaseKeyInput('');
                        setConnMessage(null);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-mono transition-colors"
                    >
                      Disconnect Keys
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      Project URL (VITE_SUPABASE_URL)
                    </label>
                    <input
                      type="text"
                      placeholder="https://your-project-ref.supabase.co"
                      value={supabaseUrlInput}
                      onChange={e => setSupabaseUrlInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-white text-xs font-mono text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
                      Public Anon API Key (VITE_SUPABASE_ANON_KEY)
                    </label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseKeyInput}
                      onChange={e => setSupabaseKeyInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-white text-xs font-mono text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={connTesting || !supabaseUrlInput.trim() || !supabaseKeyInput.trim()}
                    onClick={async () => {
                      setConnTesting(true);
                      setConnMessage(null);
                      const res = await connectSupabase(supabaseUrlInput, supabaseKeyInput);
                      if (res.success) {
                        const test = await testSupabaseConnection();
                        setConnMessage({
                          success: test.success,
                          text: test.message,
                          tableCounts: test.tableCounts,
                        });
                      } else {
                        setConnMessage({
                          success: false,
                          text: res.error || 'Failed to connect with provided credentials.',
                        });
                      }
                      setConnTesting(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-indigo-500/20"
                  >
                    {connTesting ? (
                      <span>Connecting &amp; Testing...</span>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Save Credentials &amp; Connect</span>
                      </>
                    )}
                  </button>

                  {isConfigured && (
                    <button
                      type="button"
                      disabled={connTesting}
                      onClick={async () => {
                        setConnTesting(true);
                        const test = await testSupabaseConnection();
                        setConnMessage({
                          success: test.success,
                          text: test.message,
                          tableCounts: test.tableCounts,
                        });
                        setConnTesting(false);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                    >
                      Verify / Ping Live Tables
                    </button>
                  )}
                </div>

                {connMessage && (
                  <div
                    className={`p-4 rounded-xl text-xs space-y-2 border ${
                      connMessage.success
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-2">
                      {connMessage.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{connMessage.text}</span>
                    </div>

                    {connMessage.tableCounts && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2 border-t border-emerald-500/20 text-center font-mono text-[11px]">
                        <div className="p-2 rounded bg-black/30">
                          <div className="text-zinc-400">Settings</div>
                          <div className="font-bold text-white text-sm">{connMessage.tableCounts.site_settings}</div>
                        </div>
                        <div className="p-2 rounded bg-black/30">
                          <div className="text-zinc-400">Services</div>
                          <div className="font-bold text-white text-sm">{connMessage.tableCounts.services}</div>
                        </div>
                        <div className="p-2 rounded bg-black/30">
                          <div className="text-zinc-400">Projects</div>
                          <div className="font-bold text-white text-sm">{connMessage.tableCounts.projects}</div>
                        </div>
                        <div className="p-2 rounded bg-black/30">
                          <div className="text-zinc-400">Inquiries</div>
                          <div className="font-bold text-white text-sm">{connMessage.tableCounts.inquiries}</div>
                        </div>
                        <div className="p-2 rounded bg-black/30">
                          <div className="text-zinc-400">FAQs</div>
                          <div className="font-bold text-white text-sm">{connMessage.tableCounts.faqs}</div>
                        </div>
                        <div className="p-2 rounded bg-black/30">
                          <div className="text-zinc-400">Testimonials</div>
                          <div className="font-bold text-white text-sm">{connMessage.tableCounts.testimonials}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Database Actions: Seed Database */}
              <div className="p-6 rounded-2xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0E1118] dark:bg-[#0E1118] light:bg-slate-50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                      Seed / Initialize Supabase Cloud Database
                    </h4>
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                      Populates your connected Supabase PostgreSQL tables with Web Smith Labs portfolio items, services, FAQs, and site configuration.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!isConfigured || seedingLoading}
                    onClick={async () => {
                      setSeedingLoading(true);
                      setSeedMessage(null);
                      const res = await seedSupabaseDatabase();
                      setSeedMessage({
                        success: res.success,
                        text: res.message,
                      });
                      setSeedingLoading(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 shrink-0"
                  >
                    {seedingLoading ? (
                      <span>Seeding Supabase...</span>
                    ) : (
                      <>
                        <Database className="w-3.5 h-3.5" />
                        <span>Seed Database Now</span>
                      </>
                    )}
                  </button>
                </div>

                {seedMessage && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                      seedMessage.success
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                    }`}
                  >
                    {seedMessage.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{seedMessage.text}</span>
                  </div>
                )}
              </div>

              {/* Instructions Steps */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 light:text-indigo-600">
                  How to Set Up Your Supabase Project (Quick Guide):
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-white/5 dark:border-white/5 light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 space-y-2">
                    <span className="font-mono text-indigo-400 light:text-indigo-600 font-bold">Step 1</span>
                    <div className="font-bold text-white dark:text-white light:text-slate-900">Create Project</div>
                    <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                      Sign in to <span className="text-indigo-300 light:text-indigo-600">supabase.com</span> and create a new project named &ldquo;Web Smith Labs&rdquo;.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/5 dark:border-white/5 light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 space-y-2">
                    <span className="font-mono text-indigo-400 light:text-indigo-600 font-bold">Step 2</span>
                    <div className="font-bold text-white dark:text-white light:text-slate-900">Run SQL Migration</div>
                    <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                      Open Supabase SQL Editor and execute <span className="text-indigo-300 light:text-indigo-600 font-mono">supabase/schema.sql</span> (and optional <span className="text-indigo-300 light:text-indigo-600 font-mono">seed.sql</span>).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/5 dark:border-white/5 light:border-slate-200 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 space-y-2">
                    <span className="font-mono text-indigo-400 light:text-indigo-600 font-bold">Step 3</span>
                    <div className="font-bold text-white dark:text-white light:text-slate-900">Paste Keys in UI or .env.local</div>
                    <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                      Enter credentials above or add them to <span className="text-indigo-300 light:text-indigo-600 font-mono">.env.local</span> in project root.
                    </p>
                  </div>
                </div>
              </div>

              {/* File reference snippet */}
              <div className="p-4 rounded-xl bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-900 border border-white/5 space-y-2">
                <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
                  <span>.env.local reference snippet:</span>
                </div>
                <pre className="font-mono text-xs text-indigo-300 p-3 rounded-lg bg-black/40 overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT PROJECT */}
      {/* ========================================================================= */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-3xl rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
              <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="text-zinc-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1 font-medium">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title || ''}
                    onChange={e =>
                      setProjectForm({
                        ...projectForm,
                        title: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^\w ]+/g, '')
                          .replace(/ +/g, '-'),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1 font-medium">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.slug || ''}
                    onChange={e => setProjectForm({ ...projectForm, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1 font-medium">Category *</label>
                  <select
                    value={projectForm.category}
                    onChange={e =>
                      setProjectForm({
                        ...projectForm,
                        category: e.target.value as ProjectCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Business Websites">Business Websites</option>
                    <option value="Custom Web Development">Custom Web Development</option>
                    <option value="Web Applications">Web Applications</option>
                    <option value="Product Websites">Product Websites</option>
                    <option value="Landing Pages">Landing Pages</option>
                    <option value="Experimental Projects">Experimental Projects</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1 font-medium">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.client_name || ''}
                    onChange={e => setProjectForm({ ...projectForm, client_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1 font-medium">Subtitle / Punchline</label>
                <input
                  type="text"
                  value={projectForm.subtitle || ''}
                  onChange={e => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1 font-medium">Summary (Short)</label>
                <textarea
                  rows={2}
                  value={projectForm.summary || ''}
                  onChange={e => setProjectForm({ ...projectForm, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1 font-medium">Detailed Description</label>
                <textarea
                  rows={3}
                  value={projectForm.description || ''}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1 font-medium">The Challenge</label>
                  <textarea
                    rows={2}
                    value={projectForm.challenge || ''}
                    onChange={e => setProjectForm({ ...projectForm, challenge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1 font-medium">The Solution</label>
                  <textarea
                    rows={2}
                    value={projectForm.solution || ''}
                    onChange={e => setProjectForm({ ...projectForm, solution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1 font-medium">The Results</label>
                  <textarea
                    rows={2}
                    value={projectForm.results || ''}
                    onChange={e => setProjectForm({ ...projectForm, results: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1 font-medium">Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={projectForm.thumbnail_url || ''}
                    onChange={e => setProjectForm({ ...projectForm, thumbnail_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1 font-medium">Live Website URL</label>
                  <input
                    type="url"
                    value={projectForm.live_url || ''}
                    onChange={e => setProjectForm({ ...projectForm, live_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.is_published}
                    onChange={e => setProjectForm({ ...projectForm, is_published: e.target.checked })}
                    className="rounded border-[#252A36] dark:border-[#252A36] light:border-slate-300 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-800">Published to public site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.is_featured}
                    onChange={e => setProjectForm({ ...projectForm, is_featured: e.target.checked })}
                    className="rounded border-[#252A36] dark:border-[#252A36] light:border-slate-300 text-purple-600 focus:ring-0"
                  />
                  <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-800">Featured on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/20"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
