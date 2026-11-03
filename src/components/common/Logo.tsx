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

  const badgeSizes = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {/* Geometric KS Monogram */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        {/* Subtle ambient glow behind logo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-transparent rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Framed Hexagon / Rounded Outer Shield */}
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
            <linearGradient id="ksLogoGrad" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="ksLogoAccent" x1="12" y1="20" x2="32" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>

          {/* Geometric "K" */}
          <path
            d="M12 11V29"
            stroke="url(#ksLogoGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M20 12L12.5 20.5L21 29"
            stroke="url(#ksLogoGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Geometric "S" */}
          <path
            d="M30 15C30 12.8 27.8 11 25.2 11C22.6 11 20.5 12.8 20.5 15C20.5 17.5 22.8 19 25.5 20.5C28.2 22 30 23.5 30 26C30 28.2 27.8 30 25.2 30C22.5 30 20.5 28 20.5 26"
            stroke="url(#ksLogoAccent)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Precision kinetic corner ticks */}
          <circle cx="29.5" cy="11.5" r="1.5" fill="#6366F1" />
          <circle cx="11.5" cy="28.5" r="1.5" fill="#8B5CF6" />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col tracking-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-[-0.03em] font-sans ${textSizes[size]} text-white dark:text-white light:text-slate-900 group-hover:text-indigo-400 transition-colors`}
            >
              KINETIC
            </span>
            <span
              className={`font-light tracking-[0.08em] font-sans ${textSizes[size]} text-indigo-400 dark:text-indigo-400 light:text-indigo-600`}
            >
              STUDIO
            </span>
            <span
              className={`ml-1 font-mono uppercase rounded font-semibold tracking-wider text-indigo-300 dark:text-indigo-300 light:text-indigo-700 bg-indigo-500/10 border border-indigo-500/20 ${badgeSizes[size]}`}
            >
              KS
            </span>
          </div>
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link to="/" aria-label="Kinetic Studio Homepage" className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
};
