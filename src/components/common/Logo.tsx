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
      {/* WSL Globe Icon from public */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        {/* Subtle ambient glow behind logo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 via-violet-500/20 to-cyan-400/25 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* High-res icon with fallback to Logo.png */}
        <img
          src="/icon.png"
          alt="Web Smith Labs"
          className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-105 select-none drop-shadow-[0_2px_8px_rgba(99,102,241,0.35)]"
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.src.endsWith('/Logo.png')) {
              img.src = '/Logo.png';
            }
          }}
        />
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
