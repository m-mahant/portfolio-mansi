import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ServiceOffering } from '@/types/public.types';

interface ArtworkCommissionsProps {
  heading?: string;
  commissionsOpen?: boolean;
  commissionTypes?: ServiceOffering[];
  ctaLabel?: string;
  ctaTarget?: string;
}

// CMS-driven commissions block: makes clear this gallery isn't just a personal portfolio — the
// work shown below is also available to commission, with an open/closed status and a CTA into
// the contact form.
export function ArtworkCommissions({
  heading,
  commissionsOpen,
  commissionTypes,
  ctaLabel,
  ctaTarget,
}: ArtworkCommissionsProps) {
  if (!commissionTypes?.length) return null;

  return (
    <section className="relative rounded-3xl border border-[var(--color-accent)]/25 bg-[var(--color-surface)]/50 p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {heading && (
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            {heading}
          </h2>
        )}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
            commissionsOpen === false
              ? 'border-[var(--color-border)] text-[var(--color-muted)]'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${commissionsOpen === false ? 'bg-[var(--color-muted)]' : 'bg-emerald-400'}`} />
          {commissionsOpen === false ? 'Currently closed' : 'Currently open'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {commissionTypes.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/50 p-5 space-y-2"
          >
            <h3 className="text-sm font-semibold text-[var(--color-text)]">{item.title}</h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {ctaLabel && commissionsOpen !== false && (
        <Link
          href={ctaTarget || '/contact'}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)]"
        >
          {ctaLabel}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </section>
  );
}
