'use client';

import React from 'react';
import { IntroPageConfig } from '@/types/public.types';
import { ExploreButton } from './explore-button';

interface IntroContentProps {
  onExploreClick: () => void;
  isEntering?: boolean;
  isReducedMotion?: boolean;
  introConfig?: IntroPageConfig | null;
}

// Renders dynamic editorial headline, accent, subtitle, and single primary CTA for public intro.
export const IntroContent: React.FC<IntroContentProps> = ({
  onExploreClick,
  isEntering = false,
  isReducedMotion = false,
  introConfig,
}) => {
  const headline = introConfig?.headline || 'Where Logic Meets';
  const headlineAccent = introConfig?.headlineAccent || 'Imagination';
  const subtitle =
    introConfig?.subtitle ||
    'Engineering digital experiences with the precision of code and the freedom of art.';
  const exploreButtonLabel = introConfig?.exploreButtonLabel || 'Explore Lumenfolio';

  return (
    <div
      className={`relative z-20 flex flex-col items-center justify-center text-center max-w-4xl px-6 py-12 ${
        isReducedMotion ? '' : 'transition-all duration-500 ease-out'
      } ${
        isEntering ? 'opacity-0 scale-95 blur-sm pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Primary creative headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[var(--color-text,#f8fafc)] mb-6 font-[family-name:var(--font-heading)] leading-[1.1] break-words">
        {headline}{' '}
        {headlineAccent && (
          <>
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary,#6366f1)] via-[var(--color-secondary,#8b5cf6)] to-[var(--color-accent,#d97706)]">
              {headlineAccent}
            </span>
          </>
        )}
      </h1>

      {/* Dual identity conceptual subtitle */}
      {subtitle && (
        <p className="text-base sm:text-lg md:text-xl text-[var(--color-muted,#94a3b8)] max-w-2xl mx-auto mb-8 leading-relaxed font-[family-name:var(--font-body)]">
          {subtitle}
        </p>
      )}

      {/* Single Primary Call to Action */}
      <div className="mt-2 flex w-full items-center justify-center px-1">
        <ExploreButton
          onClick={onExploreClick}
          disabled={isEntering}
          isReducedMotion={isReducedMotion}
          label={exploreButtonLabel}
        />
      </div>
    </div>
  );
};
