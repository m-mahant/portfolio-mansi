'use client';

import React from 'react';
import { SocialLink } from '@/types/public.types';

interface HomeSocialLinksProps {
  socialLinks?: SocialLink[];
  showSocialLinks?: boolean;
  resumeUrl?: string;
  resumeLabel?: string;
  showResume?: boolean;
}

// Renders visible social platform links and optional resume download action button.
export const HomeSocialLinks: React.FC<HomeSocialLinksProps> = ({
  socialLinks = [],
  showSocialLinks = true,
  resumeUrl,
  resumeLabel = 'Download Resume',
  showResume = true,
}) => {
  const visibleLinks = showSocialLinks
    ? socialLinks
        .filter((link) => link.isVisible && link.url)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    : [];

  const shouldRenderResume = showResume && !!resumeUrl;
  const hasContent = visibleLinks.length > 0 || shouldRenderResume;

  if (!hasContent) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--color-border)] mt-6">
      {shouldRenderResume && (
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-semibold transition-colors"
          aria-label={resumeLabel}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>{resumeLabel}</span>
        </a>
      )}

      {visibleLinks.map((link) => (
        <a
          key={link.id || link.platform || link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-surface)]/80 border border-[var(--color-border)] text-[var(--color-text)] text-xs font-medium transition-colors"
          aria-label={link.label || link.platform}
        >
          <span>{link.label || link.platform}</span>
          <svg className="w-3.5 h-3.5 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ))}
    </div>
  );
};
