import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Lock,
  KeyRound,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Trash2,
  ArrowRight,
  Save,
  Clock,
  Smartphone,
  Sparkles,
  Check,
  X,
  LogOut,
  Eye,
  EyeOff,
  ClipboardList,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { GoogleIcon } from '../components/common/SocialIcons';
import { useStudio } from '../context/StudioContext';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    isAdmin,
    authLoading,
    updateUserProfile,
    updatePassword,
    verifyEmail,
    resendVerificationEmail,
    deleteAccount,
    logout,
  } = useStudio();

  // Profile fields state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password fields state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Email verification state
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Account deletion modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Pre-fill user data when currentUser loads
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // If auth finished and no user is signed in, redirect to login
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login?redirectTo=/profile', { replace: true });
    }
  }, [authLoading, currentUser, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28 pb-16 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-[#FAFAFC]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 font-mono">Loading profile details...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setIsSavingProfile(true);

    const res = await updateUserProfile({
      full_name: fullName.trim(),
      phone: phone.trim() || undefined,
    });

    setIsSavingProfile(false);
    if (res.success) {
      setProfileMessage({ type: 'success', text: 'Profile details successfully updated!' });
      setTimeout(() => setProfileMessage(null), 4000);
    } else {
      setProfileMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
  };

  // Handle Password Change
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsSavingPassword(true);
    const res = await updatePassword(newPassword);
    setIsSavingPassword(false);

    if (res.success) {
      setPasswordMessage({
        type: 'success',
        text: 'Password updated successfully! You can now sign in with your email and this new password.',
      });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(null), 6000);
    } else {
      setPasswordMessage({ type: 'error', text: res.error || 'Failed to update password.' });
    }
  };

  // Handle Email Verification Click
  const handleVerifyNow = async () => {
    setVerificationMessage(null);
    setIsVerifyingEmail(true);
    const res = await verifyEmail();
    setIsVerifyingEmail(false);

    if (res.success) {
      setVerificationMessage({ type: 'success', text: 'Your email address has been verified successfully!' });
      setTimeout(() => setVerificationMessage(null), 4000);
    } else {
      setVerificationMessage({ type: 'error', text: res.error || 'Failed to verify email.' });
    }
  };

  const handleResendVerification = async () => {
    setVerificationMessage(null);
    setIsVerifyingEmail(true);
    const res = await resendVerificationEmail();
    setIsVerifyingEmail(false);

    if (res.success) {
      setVerificationMessage({
        type: 'success',
        text: 'Verification link sent! Please check your email inbox.',
      });
      setTimeout(() => setVerificationMessage(null), 5000);
    } else {
      setVerificationMessage({ type: 'error', text: res.error || 'Failed to send verification email.' });
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmationInput !== 'DELETE') {
      setDeleteError('Please type DELETE in capital letters to confirm.');
      return;
    }

    setDeleteError('');
    setIsDeletingAccount(true);
    const res = await deleteAccount();
    setIsDeletingAccount(false);

    if (res.success) {
      navigate('/', { replace: true });
    } else {
      setDeleteError(res.error || 'Failed to delete account. Please try again.');
    }
  };

  const formattedCreatedDate = currentUser.created_at
    ? new Date(currentUser.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  const formattedLastSignIn = currentUser.last_sign_in_at
    ? new Date(currentUser.last_sign_in_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Current session';

  return (
    <>
      <SEO
        title="Account Profile & Settings | Web Smith Labs"
        description="Manage your Web Smith Labs client account, password credentials, email verification status, and profile information."
      />

      <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-[#FAFAFC] text-left transition-colors">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-mono font-semibold text-indigo-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>USER ACCOUNT SETTINGS</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
                Profile & Security
              </h1>
              <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1">
                Manage your credentials, verify your email, and customize your client account.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {!isAdmin && (
                <Link
                  to="/my-inquiries"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all shadow-sm"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>My Inquiries</span>
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all shadow-sm"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Portal</span>
                </Link>
              )}
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all shadow-sm cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* User Summary Card */}
          <div className="rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {currentUser.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
                    {(currentUser.full_name || currentUser.email).charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-white light:text-slate-900">
                      {currentUser.full_name || 'Client User'}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider ${
                        isAdmin
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      }`}
                    >
                      {isAdmin ? 'Administrator' : 'Client Account'}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-600 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{currentUser.email}</span>
                  </p>
                </div>
              </div>

              {/* Meta stats */}
              <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-500 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Joined: {formattedCreatedDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Last active: {formattedLastSignIn}</span>
                </div>
              </div>
            </div>

            {/* Linked Auth Providers & Verification Indicator */}
            <div className="mt-6 pt-6 border-t border-[#252A36]/60 dark:border-[#252A36]/60 light:border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                  Authentication:
                </span>
                {currentUser.providers?.includes('google') && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-[#252A36] dark:border-[#252A36] light:border-slate-200 text-xs font-medium text-white dark:text-white light:text-slate-800">
                    <GoogleIcon className="w-3.5 h-3.5" />
                    <span>Google OAuth</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-[#252A36] dark:border-[#252A36] light:border-slate-200 text-xs font-medium text-white dark:text-white light:text-slate-800">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Email & Password</span>
                </span>
              </div>

              {/* Verification Status Pill */}
              <div>
                {currentUser.email_verified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Email Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Email Not Verified</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Email Verification Box (if unverified or wants to verify) */}
          {!currentUser.email_verified && (
            <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/5 light:bg-amber-50/70 p-6 sm:p-7 shadow-lg space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                    Verify Your Email Address
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                    Verifying your email (<span className="text-indigo-400 font-mono font-medium">{currentUser.email}</span>) ensures you receive official project notifications, technical assessments, and proposal updates from Web Smith Labs.
                  </p>
                </div>
              </div>

              {verificationMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    verificationMessage.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {verificationMessage.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{verificationMessage.text}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleVerifyNow}
                  disabled={isVerifyingEmail}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isVerifyingEmail ? 'Verifying...' : 'Verify Email Now (Instant)'}
                </button>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isVerifyingEmail}
                  className="px-4 py-2 rounded-xl border border-amber-500/30 bg-transparent text-amber-300 light:text-amber-700 hover:bg-amber-500/10 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  Resend Verification Email
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form 1: Profile Information */}
            <div className="rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-6 sm:p-8 shadow-xl space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-400">
                  <User className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                    Personal Information
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                  Update your display name and contact phone number.
                </p>
              </div>

              {profileMessage && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn ${
                    profileMessage.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 light:text-emerald-700'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-300 light:text-rose-700'
                  }`}
                >
                  {profileMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{profileMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                    User Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                    Email Address <span className="text-[10px] text-zinc-500 font-mono">(Read-only)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#252A36]/60 dark:border-[#252A36]/60 light:border-slate-200 bg-[#0B0D12]/60 dark:bg-[#0B0D12]/60 light:bg-slate-100 text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-500 cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSavingProfile ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Form 2: Password Management */}
            <div className="rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-6 sm:p-8 shadow-xl space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-400">
                  <KeyRound className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                    Change / Set Password
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                  Setting a password enables email sign-in even if you registered with Google.
                </p>
              </div>

              {passwordMessage && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn ${
                    passwordMessage.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 light:text-emerald-700'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-300 light:text-rose-700'
                  }`}
                >
                  {passwordMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSavePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                    New Password <span className="text-[10px] text-zinc-500">(min 6 characters)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 light:hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingPassword || !newPassword}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSavingPassword ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Danger Zone: Account Deletion */}
          <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/5 light:bg-rose-50/50 p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-400">
                  <Trash2 className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                    Delete Account
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 max-w-xl">
                  Permanently delete your user profile, active credentials, and linked accounts from Web Smith Labs. This action is irreversible.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmationInput('');
                  setDeleteError('');
                  setIsDeleteModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 light:text-rose-700 text-xs font-semibold transition-all shadow-sm cursor-pointer shrink-0"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/40 bg-[#121620] dark:bg-[#121620] light:bg-white p-7 sm:p-8 text-left shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white light:hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900">
                Are you absolutely sure?
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                This will permanently delete your account (<strong className="font-mono text-zinc-200 dark:text-zinc-200 light:text-slate-900">{currentUser.email}</strong>), remove your profile records, and invalidate all active sessions.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                Type <span className="font-mono font-bold text-rose-400">DELETE</span> to confirm
              </label>
              <input
                type="text"
                placeholder="DELETE"
                value={deleteConfirmationInput}
                onChange={e => setDeleteConfirmationInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-500/40 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm font-mono text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 text-xs font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationInput !== 'DELETE' || isDeletingAccount}
                onClick={handleDeleteAccount}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 transition-all shadow-md shadow-rose-600/30 cursor-pointer flex items-center gap-2"
              >
                {isDeletingAccount ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
