import React from 'react';
import { Logo } from './Logo';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
      <Logo size="lg" linkToHome={false} />
      <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        <span>Initializing Experience...</span>
      </div>
    </div>
  );
};
