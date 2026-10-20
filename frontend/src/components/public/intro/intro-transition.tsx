'use client';

import React from 'react';

interface IntroTransitionProps {
  isEntering: boolean;
  isReducedMotion?: boolean;
  onTransitionComplete?: () => void;
}

// Manages visual transition overlays during navigation from the creative intro overlay into the home view.
export const IntroTransition: React.FC<IntroTransitionProps> = ({
  isEntering,
  isReducedMotion = false,
}) => {
  if (!isEntering) return null;

  return (
    <div
      className={`fixed inset-0 z-40 bg-[var(--color-background,#0f172a)] pointer-events-none ${
        isReducedMotion
          ? 'opacity-0'
          : 'animate-pulse transition-opacity duration-500 ease-out opacity-60'
      }`}
      aria-hidden="true"
    />
  );
};
