'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Artwork } from '@/types/public.types';
import { ArtworkCard } from './artwork-card';
import { PublicEmptyState } from '@/components/public/public-empty-state';

interface ArtworkGridProps {
  artworks: Artwork[];
}

const pillClass = (active: boolean) =>
  `px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
    active
      ? 'bg-[var(--color-accent)] text-white shadow-sm'
      : 'bg-[var(--color-background)]/40 text-[var(--color-muted)] border border-[var(--color-border)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)]/40'
  }`;

// Filterable gallery grid with category pills and keyword search.
export function ArtworkGrid({ artworks }: ArtworkGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const set = new Set<string>();
    artworks.forEach((art) => {
      if (art.category) {
        set.add(art.category);
      }
    });
    return ['All', ...Array.from(set)];
  }, [artworks]);

  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        artwork.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        artwork.title.toLowerCase().includes(q) ||
        artwork.shortDescription?.toLowerCase().includes(q) ||
        artwork.category?.toLowerCase().includes(q) ||
        artwork.tags?.some((t) => t.toLowerCase().includes(q)) ||
        artwork.materials?.some((m) => m.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [artworks, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {artworks.length > 0 && (
        <div className="flex flex-col gap-4 p-4 sm:p-5 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50">
          <div className="relative w-full md:max-w-sm">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]"
              aria-hidden
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artworks, medium, tags..."
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/60 py-2.5 pl-10 pr-3 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)]/70 focus:outline-none focus:border-[var(--color-accent)]/70"
              aria-label="Filter artworks by keyword"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={pillClass(selectedCategory === category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredArtworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {filteredArtworks.map((artwork, idx) => (
            <ArtworkCard
              key={artwork.id || artwork.slug}
              artwork={artwork}
              priorityImage={idx < 6}
            />
          ))}
        </div>
      ) : (
        <PublicEmptyState
          title="No Artworks Match Your Filter"
          description={
            artworks.length === 0
              ? 'No published artworks are currently available.'
              : 'No artworks match your selected category or search. Try clearing filters.'
          }
        />
      )}
    </div>
  );
}
