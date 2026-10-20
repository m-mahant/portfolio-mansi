import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Artwork } from '@/types/public.types';
import { PublicImage } from '@/components/public/public-image';

interface ArtworkCardProps {
  artwork: Artwork;
  priorityImage?: boolean;
}

// Gallery card with cover, category, and a full-card detail link.
export function ArtworkCard({ artwork, priorityImage = false }: ArtworkCardProps) {
  const imageUrl = artwork.featuredImage?.url || artwork.images?.[0]?.url;
  const imageAlt = artwork.featuredImage?.altText || artwork.title;
  const detailUrl = `/work/art-crafts/${artwork.slug}`;

  return (
    <Link
      href={detailUrl}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/45 hover:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.55)]"
    >
      <div className="relative w-full overflow-hidden bg-[var(--color-background)]">
        <PublicImage
          src={imageUrl}
          alt={imageAlt}
          aspectRatio="video"
          priority={priorityImage}
          className="group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          {artwork.category && (
            <span className="rounded-full border border-[var(--color-accent)]/35 bg-[var(--color-background)]/80 px-2.5 py-1 text-[11px] font-medium text-[var(--color-accent)] backdrop-blur-md">
              {artwork.category}
            </span>
          )}
          {artwork.year && (
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-background)]/70 px-2.5 py-1 text-[11px] text-[var(--color-muted)] backdrop-blur-md">
              {artwork.year}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-3 p-5">
        <div className="flex-1 space-y-1.5">
          <h3
            className="text-lg font-semibold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)] line-clamp-1"
            style={{ fontFamily: 'var(--font-card-title, inherit)' }}
          >
            {artwork.title}
          </h3>
          {artwork.subtitle && (
            <p
              className="text-xs font-medium text-[var(--color-accent)] line-clamp-1"
              style={{ fontFamily: 'var(--font-card-subtitle, inherit)' }}
            >
              {artwork.subtitle}
            </p>
          )}
          {artwork.shortDescription && (
            <p
              className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-3"
              style={{ fontFamily: 'var(--font-card-description, inherit)' }}
            >
              {artwork.shortDescription}
            </p>
          )}
        </div>

        {artwork.materials && artwork.materials.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {artwork.materials.slice(0, 3).map((mat) => (
              <span
                key={mat}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)]/50 px-2 py-0.5 text-[11px] font-tag text-[var(--color-muted)]"
              >
                {mat}
              </span>
            ))}
          </div>
        )}

        <span
          className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-[var(--color-accent)]"
          style={{ fontFamily: 'var(--font-button, inherit)' }}
        >
          View artwork
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
