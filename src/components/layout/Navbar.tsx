import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  ArrowRight,
  Menu,
  X,
  Shield,
  Sparkles,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useStudio } from '../../context/StudioContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, currentUser, isAdmin, logout, settings } = useStudio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Our Work', href: '/work' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-[#0B0D12]/85 dark:bg-[#0B0D12]/85 light:bg-white/90 backdrop-blur-xl border-b border-[#252A36]/80 light:border-slate-200/80 shadow-lg shadow-black/20'
          : 'py-5 bg-transparent border-b border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] dark:border-white/5 dark:bg-white/[0.02] light:border-slate-200 light:bg-slate-50/80 backdrop-blur-md">
            {navLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-white dark:text-white light:text-indigo-600 bg-indigo-500/15 dark:bg-indigo-500/20 light:bg-indigo-50 border border-indigo-500/30 font-semibold shadow-sm'
                      : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle visual theme"
              title={theme === 'dark' ? 'Switch to White Theme' : 'Switch to Dark Theme'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/60 dark:bg-[#121620]/60 light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:bg-slate-200 dark:hover:bg-[#181D2A] hover:border-indigo-400 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 focus:outline-none text-xs font-mono"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-medium hidden lg:inline">White Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[11px] font-medium hidden lg:inline">Dark Mode</span>
                </>
              )}
            </button>

            {/* Auth Button or User Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
                    title="Admin Dashboard"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}
                <div
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/60 dark:bg-[#121620]/60 light:bg-slate-50 text-xs"
                  title={`Signed in as ${currentUser.email}`}
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                    {(currentUser.full_name || currentUser.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden xl:inline text-zinc-300 dark:text-zinc-300 light:text-slate-700 font-medium max-w-[100px] truncate">
                    {currentUser.full_name || currentUser.email.split('@')[0]}
                  </span>
                  <button
                    onClick={() => logout()}
                    className="p-1 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-100 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Primary CTA */}
            <Link
              to="/start-project"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 group transform active:scale-95"
            >
              <span>{settings.primary_cta_text || 'Start a Project'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu & Theme Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to White Theme' : 'Switch to Dark Theme'}
              className="p-2 rounded-lg border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-lg border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-slate-100 text-white dark:text-white light:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#0B0D12]/98 dark:bg-[#0B0D12]/98 light:bg-white/98 backdrop-blur-2xl px-6 py-6 transition-all animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  `px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'text-white dark:text-white light:text-indigo-600 bg-indigo-500/15 dark:bg-indigo-500/20 light:bg-indigo-50 border border-indigo-500/30 font-semibold'
                      : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Mobile Auth Section */}
            {currentUser ? (
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                    {(currentUser.full_name || currentUser.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white dark:text-white light:text-slate-900">
                      {currentUser.full_name || 'Client'}
                    </div>
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-slate-500 max-w-[170px] truncate">
                      {currentUser.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-slate-50 text-sm font-semibold text-white dark:text-white light:text-slate-900"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl font-medium"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <div className="pt-4 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200 flex flex-col gap-3">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-slate-100 text-xs font-mono text-zinc-300 dark:text-zinc-300 light:text-slate-700"
              >
                <span>Current Theme:</span>
                <span className="flex items-center gap-1.5 font-bold text-indigo-400 light:text-indigo-600">
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Dark Theme (Tap for White)</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-indigo-600" />
                      <span>White Theme (Tap for Dark)</span>
                    </>
                  )}
                </span>
              </button>

              <Link
                to="/start-project"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/25"
              >
                <Sparkles className="w-4 h-4" />
                <span>{settings.primary_cta_text || 'Start a Project'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
