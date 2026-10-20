import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, LucideIcon } from 'lucide-react';

interface WorkPathCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tone: 'primary' | 'accent';
}

const TONE_CLASSES = {
  primary: {
    border: 'border-[var(--color-primary)]/25 hover:border-[var(--color-primary)]/55',
    glow: 'bg-[var(--color-primary)]/15',
    iconWrap: 'bg-[var(--color-primary)]/12 text-[var(--color-primary)] border-[var(--color-primary)]/30',
    cta: 'text-[var(--color-primary)]',
  },
  accent: {
    border: 'border-[var(--color-accent)]/25 hover:border-[var(--color-accent)]/55',
    glow: 'bg-[var(--color-accent)]/15',
    iconWrap: 'bg-[var(--color-accent)]/12 text-[var(--color-accent)] border-[var(--color-accent)]/30',
    cta: 'text-[var(--color-accent)]',
  },
} as const;

// Destination card for a Work discipline (Development or Art) with hover depth and a full-card link.
export function WorkPathCard({ title, description, href, icon: Icon, tone }: WorkPathCardProps) {
  const styles = TONE_CLASSES[tone];

  return (
    <Link
      href={href}
      className={`group relative flex min-h-[280px] flex-col overflow-hidden rounded-3xl border bg-[var(--color-surface)]/50 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.55)] ${styles.border}`}
    >
      <div className={`pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full blur-3xl ${styles.glow}`} />

      <div className="relative">
        <span
          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${styles.iconWrap}`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
      </div>

      <h2
        className="relative mt-8 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        {title}
      </h2>
      <p
        className="relative mt-3 flex-1 text-sm sm:text-base leading-relaxed text-[var(--color-muted)]"
        style={{ fontFamily: 'var(--font-card-description, inherit)' }}
      >
        {description}
      </p>

      <span
        className={`relative mt-8 inline-flex items-center gap-2 text-sm font-semibold ${styles.cta}`}
        style={{ fontFamily: 'var(--font-button, inherit)' }}
      >
        Explore {title}
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
