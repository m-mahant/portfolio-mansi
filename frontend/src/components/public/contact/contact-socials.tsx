import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SocialLink } from '@/types/public.types';

interface ContactSocialsProps {
  socialLinks?: SocialLink[];
}

// Visible social profile links for the contact sidebar.
export const ContactSocials: React.FC<ContactSocialsProps> = ({ socialLinks = [] }) => {
  const visibleLinks = socialLinks.filter((link) => link.isVisible);

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-6 sm:p-8">
      <h2
        className="text-2xl font-bold tracking-tight text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        Connect
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {visibleLinks.map((social) => (
          <a
            key={social.id || social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/40 p-3 text-[var(--color-text)] transition-all duration-200 hover:border-[var(--color-primary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <span className="rounded-xl bg-[var(--color-primary)]/10 p-1.5 text-[var(--color-primary)]">
              <ExternalLink className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 truncate text-xs font-medium">
              <span>{social.platform}</span>
              <span className="block truncate text-[11px] font-normal text-[var(--color-muted)]">
                {social.label}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
