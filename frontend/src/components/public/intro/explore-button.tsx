'use client';

import React from 'react';

interface ExploreButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isReducedMotion?: boolean;
  label?: string;
}

// Renders the primary entry call-to-action button with accessible keyboard navigation and hover effects.
export const ExploreButton: React.FC<ExploreButtonProps> = ({
  onClick,
  disabled = false,
  isReducedMotion = false,
  label = 'Explore Portfolio',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`group relative inline-flex w-full max-w-md sm:w-auto justify-center items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-[var(--radius-base,0.5rem)] text-sm md:text-base font-medium text-[var(--color-text,#f8fafc)] bg-[var(--color-surface,#1e293b)]/80 border border-[var(--color-primary,#6366f1)]/40 backdrop-blur-md shadow-lg shadow-[var(--color-primary,#6366f1)]/10 hover:shadow-[var(--color-primary,#6366f1)]/25 hover:border-[var(--color-primary,#6366f1)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary,#8b5cf6)] focus:ring-offset-2 focus:ring-offset-[var(--color-background,#0f172a)] disabled:opacity-50 disabled:cursor-not-allowed ${
        isReducedMotion
          ? ''
          : 'transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]'
      }`}
    >
      {/* Background glow hover layer */}
      <span className="absolute inset-0 rounded-[var(--radius-base,0.5rem)] bg-gradient-to-r from-[var(--color-primary,#6366f1)]/20 to-[var(--color-secondary,#8b5cf6)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Button label */}
      <span className="relative z-10 tracking-wide font-sans">
        {label}
      </span>

      {/* Arrow icon indicator */}
      <svg
        className={`relative z-10 w-4 h-4 text-[var(--color-primary,#6366f1)] group-hover:text-[var(--color-text,#f8fafc)] ${
          isReducedMotion ? '' : 'transition-transform duration-300 group-hover:translate-x-1'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </button>
  );
};
