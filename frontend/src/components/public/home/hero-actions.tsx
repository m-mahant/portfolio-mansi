'use client';

import React from 'react';
import Link from 'next/link';

interface HeroActionsProps {
  devCtaText?: string;
  artCtaText?: string;
  developmentUrl?: string;
  artUrl?: string;
}

// Renders primary call-to-action buttons for exploring development work and viewing art & crafts.
export const HeroActions: React.FC<HeroActionsProps> = ({
  devCtaText = 'Explore Development',
  artCtaText = 'View Art & Crafts',
  developmentUrl = '/work/development',
  artUrl = '/work/art-crafts',
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 my-6">
      <Link
        href={developmentUrl}
        className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-[var(--color-primary)]/25 flex items-center gap-2 group"
      >
        <span>{devCtaText}</span>
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>

      <Link
        href={artUrl}
        className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl bg-[var(--color-surface)]/80 hover:bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] font-medium text-sm transition-all duration-200 shadow-md backdrop-blur-md flex items-center gap-2 group"
      >
        <span>{artCtaText}</span>
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[var(--color-accent)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  );
};
