import React from 'react';

interface AboutPhilosophyProps {
  philosophy?: string;
  className?: string;
}

// Full-bleed quote block for the About philosophy statement.
export function AboutPhilosophy({ philosophy, className = '' }: AboutPhilosophyProps) {
  if (!philosophy || !philosophy.trim()) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl px-6 py-12 sm:px-12 sm:py-16 text-center ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/15 via-[var(--color-surface)]/80 to-[var(--color-accent)]/15" />
      <div className="pointer-events-none absolute inset-0 border border-[var(--color-border)] rounded-3xl" />
      <div className="relative space-y-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
          Philosophy
        </p>
        <blockquote
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--color-text)] max-w-3xl mx-auto leading-snug"
          style={{ fontFamily: 'var(--font-heading, inherit)' }}
        >
          &ldquo;{philosophy}&rdquo;
        </blockquote>
      </div>
    </div>
  );
}
