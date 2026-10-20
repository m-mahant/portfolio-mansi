import React from 'react';
import { SocialLink, ContactPageConfig } from '@/types/public.types';
import { PublicButton } from '../public-button';

interface AboutSocialLinksProps {
  socialLinks?: SocialLink[];
  contactConfig?: ContactPageConfig | null;
  className?: string;
}

// Renders visible social links and the Contact-owned resume download.
export function AboutSocialLinks({ socialLinks = [], contactConfig, className = '' }: AboutSocialLinksProps) {
  const visibleLinks = socialLinks.filter((link) => link.isVisible);
  const resumeUrl = contactConfig?.resumeUrl;
  const showResume = Boolean(resumeUrl);

  if (visibleLinks.length === 0 && !showResume) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Elsewhere</p>
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-heading, inherit)' }}
        >
          Connect
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showResume && resumeUrl && (
          <PublicButton
            href={resumeUrl}
            variant="solid"
            size="md"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {contactConfig?.resumeLabel || 'Download Resume'}
          </PublicButton>
        )}

        {visibleLinks.map((link) => (
          <PublicButton
            key={link.id}
            href={link.url}
            variant="outline"
            size="md"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label || link.platform}
          </PublicButton>
        ))}
      </div>
    </div>
  );
}
