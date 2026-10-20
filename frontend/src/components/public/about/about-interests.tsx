import React from 'react';

interface AboutInterestsProps {
  interests?: string[];
  className?: string;
}

// Soft interest chips for the About page.
export function AboutInterests({ interests, className = '' }: AboutInterestsProps) {
  if (!interests || interests.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Curiosity</p>
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-heading, inherit)' }}
        >
          Areas of Interest
        </h2>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {interests.map((interest, idx) => (
          <span
            key={idx}
            className="px-4 py-2 rounded-full text-sm text-[var(--color-text)] bg-[var(--color-surface)]/70 border border-[var(--color-border)]"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  );
}
