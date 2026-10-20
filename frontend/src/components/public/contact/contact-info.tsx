import React from 'react';
import { Mail, MapPin, Download } from 'lucide-react';
import { ContactPageConfig } from '@/types/public.types';
import { PublicButton } from '../public-button';

interface ContactInfoProps {
  contactConfig?: ContactPageConfig | null;
}

// Direct contact details card with email, location, and optional resume CTA.
export const ContactInfo: React.FC<ContactInfoProps> = ({ contactConfig }) => {
  const email = contactConfig?.email || 'contact@example.com';
  const location = contactConfig?.location || 'San Francisco, CA & Remote';
  const resumeUrl = contactConfig?.resumeUrl;
  const resumeLabel = contactConfig?.resumeLabel || 'Download Resume (PDF)';

  return (
    <div className="space-y-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-6 sm:p-8">
      <h2
        className="text-2xl font-bold tracking-tight text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        Direct Information
      </h2>

      <div className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 p-2.5 text-[var(--color-primary)]">
            <Mail className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[var(--color-muted)]">Email</p>
            <a
              href={`mailto:${email}`}
              className="mt-0.5 inline-block break-all font-medium text-[var(--color-primary)] hover:opacity-80 focus:outline-none focus:underline"
            >
              {email}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 p-2.5 text-[var(--color-primary)]">
            <MapPin className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-xs text-[var(--color-muted)]">Location</p>
            <p className="mt-0.5 font-medium text-[var(--color-text)]">{location}</p>
          </div>
        </div>
      </div>

      {resumeUrl && (
        <div className="border-t border-[var(--color-border)] pt-4">
          <PublicButton
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="solid"
            size="md"
            className="w-full justify-center"
          >
            <Download className="h-4 w-4" aria-hidden />
            {resumeLabel}
          </PublicButton>
        </div>
      )}
    </div>
  );
};
