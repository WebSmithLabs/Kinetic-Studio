import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Logo } from '../components/common/Logo';
import { GoogleIcon } from '../components/common/SocialIcons';
import { useStudio, ADMIN_EMAILS } from '../context/StudioContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '';
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const {
    currentUser,
    isAdmin,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    resetPassword,
  } = useStudio();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      const res = await resetPassword(email);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage('Password reset instructions have been sent to your email.');
      } else {
        setErrorMessage(res.error || 'Failed to send password reset email.');
      }
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (mode === 'register') {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      setIsLoading(true);
      const res = await registerWithEmail(email, password, fullName);
      setIsLoading(false);

      if (res.success) {
        // Automatically authenticated; navigate directly to target destination
        const destination = redirectTo || (ADMIN_EMAILS.includes(email.toLowerCase()) ? '/admin' : '/');
        navigate(destination, { replace: true });
      } else {
        setErrorMessage(res.error || 'Registration failed.');
      }
      return;
    }

    // Login mode
    setIsLoading(true);
    const res = await loginWithEmail(email, password);
    setIsLoading(false);

    if (res.success) {
      const destination = redirectTo || (ADMIN_EMAILS.includes(email.toLowerCase()) ? '/admin' : '/');
      navigate(destination, { replace: true });
    } else {
      setErrorMessage(res.error || 'Invalid email or password.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    const destination = redirectTo || '/';
    const res = await loginWithGoogle(destination);
    setIsGoogleLoading(false);
    if (!res.success) {
      setErrorMessage(
        res.error ||
          'Google OAuth is not activated in this Supabase project. Please use email authentication below.'
      );
    }
  };

  return (
    <>
      <SEO
        title={`${
          mode === 'register' ? 'Create Account' : mode === 'forgot' ? 'Reset Password' : 'Sign In'
        } | Web Smith Labs`}
        description="Access your Web Smith Labs client portal, commission digital projects, and manage enterprise web builds."
      />

      <div className="min-h-screen flex items-center justify-center pt-28 pb-16 px-4 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-[#FAFAFC] transition-colors">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white p-7 sm:p-9 shadow-2xl shadow-black/40 text-left space-y-6">
            {/* Header with Logo */}
            <div className="text-center space-y-3">
              <div className="flex justify-center mb-1">
                <Logo size="md" />
              </div>

              <h1 className="text-2xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
                {mode === 'register'
                  ? 'Join Web Smith Labs'
                  : mode === 'forgot'
                  ? 'Reset Your Password'
                  : 'Welcome Back'}
              </h1>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 max-w-xs mx-auto">
                {mode === 'register'
                  ? 'Create an account to start new projects, track progress, and communicate directly with our engineering team.'
                  : mode === 'forgot'
                  ? 'Enter your email address and we will send you a secure link to reset your credentials.'
                  : redirectTo === '/start-project'
                  ? 'Sign in to submit your project brief and connect with our engineering team.'
                  : 'Sign in to start a new project, review proposals, or manage studio operations.'}
              </p>
            </div>

            {/* Already Authenticated Banner */}
            {currentUser && (
              <div className="p-4 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/10 light:bg-indigo-50 border border-indigo-500/30 text-xs space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                      {(currentUser.full_name || currentUser.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-white dark:text-white light:text-slate-900 block">
                        Currently Signed In
                      </span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                        {currentUser.email} ({currentUser.role})
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-medium underline cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>

                <Link
                  to={redirectTo || (isAdmin ? '/admin' : '/')}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  <span>
                    Continue to {redirectTo === '/start-project' ? 'Project Form' : isAdmin ? 'Admin Portal' : 'Homepage'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Mode Switcher Tabs */}
            {mode !== 'forgot' && (
              <div className="grid grid-cols-2 p-1 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-100 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 light:text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 light:text-emerald-700 text-xs flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="leading-relaxed">{successMessage}</span>
              </div>
            )}



            {/* Google OAuth Button */}
            {mode !== 'forgot' && (
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-white text-sm font-semibold text-white dark:text-white light:text-slate-800 hover:bg-[#181D2A] dark:hover:bg-[#181D2A] light:hover:bg-slate-50 transition-all duration-150 disabled:opacity-60 shadow-sm cursor-pointer"
                >
                  {isGoogleLoading ? (
                    <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon className="w-5 h-5 shrink-0" />
                  )}
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-mono">
                    <span className="px-3 bg-[#121620] dark:bg-[#121620] light:bg-white text-zinc-500 dark:text-zinc-500 light:text-slate-400">
                      Or with email
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Email / Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 dark:text-zinc-500 light:text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 dark:placeholder:text-zinc-600 light:placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 dark:text-zinc-500 light:text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 dark:placeholder:text-zinc-600 light:placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 light:text-indigo-600 light:hover:text-indigo-500 transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 dark:text-zinc-500 light:text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 dark:placeholder:text-zinc-600 light:placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 dark:text-zinc-500 light:text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-300 bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-slate-50 text-sm text-white dark:text-white light:text-slate-900 placeholder:text-zinc-600 dark:placeholder:text-zinc-600 light:placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'register'
                        ? 'Create Account & Proceed'
                        : mode === 'forgot'
                        ? 'Send Reset Link'
                        : 'Sign In to Account'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login from Forgot */}
            {mode === 'forgot' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 light:text-indigo-600 font-medium cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}

            {/* Admin Designation Callout */}
            <div className="pt-3 border-t border-[#252A36]/60 dark:border-[#252A36]/60 light:border-slate-200/80">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/5 light:bg-indigo-50/50 border border-indigo-500/15 dark:border-indigo-500/15 light:border-indigo-200 text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Admin Account Active: <span className="text-indigo-300 dark:text-indigo-300 light:text-indigo-700 font-mono font-medium">websmithlaps@gmail.com</span> has full administrative permissions.
                </span>
              </div>
            </div>

            {/* Back to Home Link */}
            <div className="text-center">
              <Link
                to="/"
                className="text-xs text-zinc-500 hover:text-zinc-300 dark:text-zinc-500 dark:hover:text-zinc-300 light:text-slate-500 light:hover:text-slate-700 transition-colors"
              >
                ← Return to Web Smith Labs Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
