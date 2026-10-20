import React from 'react';
import { Artwork } from '@/types/public.types';
import { ArtworkCard } from './artwork-card';

interface RelatedArtworkProps {
  currentArtwork: Artwork;
  allArtworks: Artwork[];
}

// Renders a grid of up to 3 related artwork pieces sharing category or tags.
// Returns null if no related items exist (Hide Empty Sections).
export function RelatedArtwork({ currentArtwork, allArtworks }: RelatedArtworkProps) {
  const relatedList = allArtworks
    .filter(
      (art) =>
        art.id !== currentArtwork.id &&
        art.slug !== currentArtwork.slug &&
        (art.category === currentArtwork.category ||
          art.tags?.some((tag) => currentArtwork.tags?.includes(tag)))
    )
    .slice(0, 3);

  if (relatedList.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h2
        className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        Related
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {relatedList.map((art) => (
          <ArtworkCard key={art.id || art.slug} artwork={art} />
        ))}
      </div>
    </section>
  );
}
