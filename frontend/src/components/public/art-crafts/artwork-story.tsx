import React from 'react';
import { Artwork } from '@/types/public.types';

interface ArtworkStoryProps {
  artwork: Artwork;
}

const headingStyle = { fontFamily: 'var(--font-heading, inherit)' };

// Story, inspiration, and description; omitted when all are empty.
export function ArtworkStory({ artwork }: ArtworkStoryProps) {
  const hasStory = Boolean(artwork.story || artwork.inspiration || artwork.description);

  if (!hasStory) {
    return null;
  }

  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] space-y-6">
      <h2
        className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]"
        style={headingStyle}
      >
        Story
      </h2>

      <div className="space-y-6 text-[var(--color-muted)] text-sm sm:text-base leading-relaxed">
        {artwork.story && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--color-text)]" style={headingStyle}>
              Narrative
            </h3>
            <p className="whitespace-pre-line">{artwork.story}</p>
          </div>
        )}

        {artwork.inspiration && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--color-text)]" style={headingStyle}>
              Inspiration
            </h3>
            <p className="whitespace-pre-line">{artwork.inspiration}</p>
          </div>
        )}

        {artwork.description && !artwork.story && (
          <p className="whitespace-pre-line">{artwork.description}</p>
        )}
      </div>
    </section>
  );
}
