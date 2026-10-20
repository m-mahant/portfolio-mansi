'use client';

import React from 'react';
import { BRAND_LOADING_TEXT } from '@/lib/brand';

interface LoadingScreenProps {
  isReducedMotion?: boolean;
  loadingText?: string;
}

// Renders a minimal, theme-aware initial loading screen driven by introPage config or fallback.
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isReducedMotion = false,
  loadingText = BRAND_LOADING_TEXT,
}) => {
  return (
    <div
      role="status"
      aria-label={loadingText}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-background,#0f172a)] text-[var(--color-text,#f8fafc)] transition-opacity duration-300"
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Subtle glowing ring background */}
        <div
          className={`w-16 h-16 rounded-full border-2 border-[var(--color-primary,#6366f1)]/30 border-t-[var(--color-secondary,#8b5cf6)] ${
            isReducedMotion ? '' : 'animate-spin'
          }`}
        />

        {/* Dynamic loading identity label */}
        <div className="text-center">
          <span className="text-xs tracking-[0.25em] font-mono text-[var(--color-muted,#94a3b8)] uppercase">
            {loadingText}
          </span>
        </div>
      </div>
    </div>
  );
};
