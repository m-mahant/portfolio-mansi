import React from 'react';

interface AboutWhatIDoProps {
  items?: string[];
  className?: string;
}

// Capability grid for the About page.
export function AboutWhatIDo({ items, className = '' }: AboutWhatIDoProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Practice</p>
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-heading, inherit)' }}
        >
          What I Do
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[var(--color-surface)]/40 border border-[var(--color-border)] hover:border-[var(--color-primary)]/35 transition-colors"
          >
            <span className="text-sm sm:text-base font-medium text-[var(--color-text)] leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
