import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Artwork } from '@/types/public.types';
import { PublicImage } from '@/components/public/public-image';

interface ArtworkDetailHeroProps {
  artwork: Artwork;
}

// Artwork detail hero: back link, title, tags, and cover image.
export function ArtworkDetailHero({ artwork }: ArtworkDetailHeroProps) {
  const coverUrl = artwork.featuredImage?.url || artwork.images?.[0]?.url;
  const coverAlt = artwork.featuredImage?.altText || artwork.title;

  return (
    <section className="space-y-8">
      <Link
        href="/work/art-crafts"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
        style={{ fontFamily: 'var(--font-button, inherit)' }}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to Art & Crafts Gallery
      </Link>

      <div className="space-y-4 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
          {artwork.category && (
            <span className="px-3 py-1 rounded-lg text-xs font-tag bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
              {artwork.category}
            </span>
          )}
          {artwork.year && (
            <span className="px-3 py-1 rounded-lg text-xs font-tag text-[var(--color-muted)] border border-[var(--color-border)]">
              {artwork.year}
            </span>
          )}
          {artwork.dimensions && (
            <span className="px-3 py-1 rounded-lg text-xs font-tag text-[var(--color-muted)] border border-[var(--color-border)]">
              {artwork.dimensions}
            </span>
          )}
        </div>

        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.1]"
          style={{ fontFamily: 'var(--font-heading, inherit)' }}
        >
          {artwork.title}
        </h1>

        {artwork.subtitle && (
          <p className="text-lg md:text-xl font-medium text-[var(--color-accent)] leading-relaxed">
            {artwork.subtitle}
          </p>
        )}

        {artwork.shortDescription && (
          <p className="text-base text-[var(--color-muted)] max-w-3xl leading-relaxed">
            {artwork.shortDescription}
          </p>
        )}
      </div>

      {coverUrl && (
        <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 shadow-2xl">
          <PublicImage
            src={coverUrl}
            alt={coverAlt}
            aspectRatio="video"
            priority
            className="w-full h-auto object-cover max-h-[550px]"
          />
        </div>
      )}
    </section>
  );
}
