'use client';

import React from 'react';

interface IntroDecorationProps {
  isReducedMotion?: boolean;
}

// Renders subtle decorative vector motifs symbolizing the intersection of code and artistic vision.
export const IntroDecoration: React.FC<IntroDecorationProps> = ({ isReducedMotion = false }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Developer identity motif: Geometric nodes and precise grid vectors (Left side) */}
      <svg
        className="absolute top-1/4 -left-12 w-80 h-80 opacity-15 text-[var(--color-primary,#6366f1)] hidden md:block"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="100" cy="50" r="3" fill="currentColor" />
        <circle cx="150" cy="100" r="3" fill="currentColor" />
        <circle cx="100" cy="150" r="3" fill="currentColor" />
        <circle cx="50" cy="100" r="3" fill="currentColor" />
      </svg>

      {/* Artist identity motif: Fluid organic stroke vectors (Right side) */}
      <svg
        className="absolute bottom-1/4 -right-12 w-80 h-80 opacity-15 text-[var(--color-secondary,#8b5cf6)] hidden md:block"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M30,100 C70,20 130,180 170,100"
          stroke="currentColor"
          strokeWidth="1.5"
          className={isReducedMotion ? '' : 'transition-all duration-1000'}
        />
        <path
          d="M40,120 C80,40 120,160 160,80"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        <circle cx="120" cy="70" r="2" fill="currentColor" />
        <circle cx="80" cy="130" r="2" fill="currentColor" />
      </svg>
    </div>
  );
};
