'use client';

import React from 'react';

interface DualIdentityProps {
  devCardTitle?: string;
  devCardDescription?: string;
  artCardTitle?: string;
  artCardDescription?: string;
}

// Renders the dual identity breakdown cards for Software Developer and Creative Artist.
export const DualIdentity: React.FC<DualIdentityProps> = ({
  devCardTitle,
  devCardDescription,
  artCardTitle,
  artCardDescription,
}) => {
  const devTitle = devCardTitle || 'Software Engineering';
  const artTitle = artCardTitle || 'Creative Visual Art';

  if (!devCardDescription && !artCardDescription) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
      {devCardDescription && (
        <div className="group p-5 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 backdrop-blur-sm hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/40 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center gap-2.5 mb-2.5 text-[var(--color-primary)] font-semibold text-sm">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-primary)]/15 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </span>
            <span>{devTitle}</span>
          </div>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed font-normal">{devCardDescription}</p>
        </div>
      )}

      {artCardDescription && (
        <div className="group p-5 rounded-2xl bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 backdrop-blur-sm hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/40 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center gap-2.5 mb-2.5 text-[var(--color-accent)] font-semibold text-sm">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-accent)]/15 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </span>
            <span>{artTitle}</span>
          </div>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed font-normal">{artCardDescription}</p>
        </div>
      )}
    </div>
  );
};
