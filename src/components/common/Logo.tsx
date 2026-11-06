import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  linkToHome?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  showWordmark = true,
  size = 'md',
  className = '',
  linkToHome = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {/* Modern WSL Monogram Shield */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        {/* Subtle ambient glow behind logo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/25 via-violet-500/20 to-cyan-400/20 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Outer Rounded Container */}
          <rect
            x="1.5"
            y="1.5"
            width="37"
            height="37"
            rx="9"
            className="stroke-[#252A36] dark:stroke-[#252A36] light:stroke-slate-200 fill-[#0B0D12] dark:fill-[#0B0D12] light:fill-white"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="wslGrad" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="60%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="wslAccent" x1="10" y1="20" x2="30" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>

          {/* Geometric "W" Forge Lines */}
          <path
            d="M9 13L14.5 27L19.5 15.5L20.5 15.5L25.5 27L31 13"
            stroke="url(#wslGrad)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Precision Anvil/Lab Diamond node */}
          <circle cx="20" cy="11" r="1.75" fill="#38BDF8" />
          <circle cx="9" cy="13" r="1.25" fill="#6366F1" />
          <circle cx="31" cy="13" r="1.25" fill="#06B6D4" />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex items-center tracking-tight">
          <span
            className={`font-black tracking-[-0.02em] font-sans ${textSizes[size]} text-white dark:text-white light:text-slate-900 transition-colors whitespace-nowrap inline-flex items-center gap-1.5`}
          >
            <span className="group-hover:text-indigo-400 transition-colors">WEB SMITH</span>
            <span className="text-indigo-400 dark:text-indigo-400 light:text-indigo-600 font-black tracking-normal">
              LABS
            </span>
          </span>
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link to="/" aria-label="Web Smith Labs Homepage" className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
};
