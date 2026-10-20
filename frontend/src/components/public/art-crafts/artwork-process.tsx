import React from 'react';
import { Artwork } from '@/types/public.types';

interface ArtworkProcessProps {
  artwork: Artwork;
}

// Creative process copy; omitted when empty. Line breaks stay as paragraphs, without step numbers.
export function ArtworkProcess({ artwork }: ArtworkProcessProps) {
  if (!artwork.process) {
    return null;
  }

  const processSteps = artwork.process
    .split('\n')
    .filter((step) => step.trim().length > 0);

  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] space-y-5">
      <h2
        className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        Process
      </h2>

      {processSteps.length > 1 ? (
        <div className="space-y-3">
          {processSteps.map((step, idx) => (
            <p
              key={idx}
              className="p-4 rounded-2xl bg-[var(--color-background)]/40 border border-[var(--color-border)] text-sm text-[var(--color-muted)] leading-relaxed"
            >
              {step.replace(/^\d+\.\s*/, '')}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed whitespace-pre-line">
          {artwork.process}
        </p>
      )}
    </section>
  );
}
