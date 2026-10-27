import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ServiceOffering } from '@/types/public.types';

interface DevelopmentServicesProps {
  heading?: string;
  services?: ServiceOffering[];
  processSteps?: string[];
  ctaLabel?: string;
  ctaTarget?: string;
}

// CMS-driven "work with me" block: what's on offer, how the process works, and a CTA into the
// contact form — the case studies below prove capability, this section is what actually turns a
// visitor into an inquiry.
export function DevelopmentServices({
  heading,
  services,
  processSteps,
  ctaLabel,
  ctaTarget,
}: DevelopmentServicesProps) {
  if (!services?.length && !processSteps?.length) return null;

  return (
    <section className="relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-6 sm:p-8 space-y-8">
      {heading && (
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-heading, inherit)' }}
        >
          {heading}
        </h2>
      )}

      {services && services.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/50 p-5 space-y-2"
            >
              <h3 className="text-sm font-semibold text-[var(--color-text)]">{service.title}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      )}

      {processSteps && processSteps.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">How I Work</h3>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {processSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-text)]">
                <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] text-[11px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-snug">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {ctaLabel && (
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
