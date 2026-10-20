import React from 'react';

interface AboutDualIdentityProps {
  developerSide?: string;
  artistSide?: string;
  className?: string;
}

// Two editorial columns for engineering practice vs studio practice.
export function AboutDualIdentity({ developerSide, artistSide, className = '' }: AboutDualIdentityProps) {
  const hasDev = Boolean(developerSide && developerSide.trim());
  const hasArtist = Boolean(artistSide && artistSide.trim());

  if (!hasDev && !hasArtist) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 ${hasDev && hasArtist ? 'md:grid-cols-2' : ''} gap-5 ${className}`}>
      {hasDev && (
        <article className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-[var(--color-surface)]/50 border border-[var(--color-primary)]/25">
          <h2
            className="mb-4 text-2xl font-bold text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            Developer Side
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">{developerSide}</p>
        </article>
      )}

      {hasArtist && (
        <article className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-[var(--color-surface)]/50 border border-[var(--color-accent)]/25">
          <h2
            className="mb-4 text-2xl font-bold text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            Artist Side
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">{artistSide}</p>
        </article>
      )}
    </div>
  );
}
