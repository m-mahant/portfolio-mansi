import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Artwork } from '@/types/public.types';
import { PublicImage } from '@/components/public/public-image';

interface FeaturedArtworkProps {
  artwork: Artwork;
}

// Featured artwork banner with cover, materials, and detail CTA.
export function FeaturedArtwork({ artwork }: FeaturedArtworkProps) {
  const imageUrl = artwork.featuredImage?.url || artwork.images?.[0]?.url;
  const imageAlt = artwork.featuredImage?.altText || artwork.title;
  const detailUrl = `/work/art-crafts/${artwork.slug}`;

  return (
    <article className="relative overflow-hidden rounded-3xl border border-[var(--color-accent)]/25 bg-[var(--color-surface)]/50 p-5 sm:p-6 md:p-8">
      <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-[var(--color-accent)]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <Link
          href={detailUrl}
          className="lg:col-span-7 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-lg group"
        >
          <PublicImage
            src={imageUrl}
            alt={imageAlt}
            aspectRatio="video"
            priority
            className="group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {artwork.isFeatured && (
              <span className="inline-flex w-fit items-center rounded-full border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/12 px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
                Featured
              </span>
            )}
            {artwork.category && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-tag border border-[var(--color-border)] text-[var(--color-muted)]">
                {artwork.category}
              </span>
            )}
            {artwork.year && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-tag border border-[var(--color-border)] text-[var(--color-muted)]">
                {artwork.year}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h2
              className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-heading, inherit)' }}
            >
              <Link href={detailUrl} className="hover:text-[var(--color-accent)] transition-colors">
                {artwork.title}
              </Link>
            </h2>
            {artwork.subtitle && (
              <p
                className="text-sm font-medium text-[var(--color-accent)]"
                style={{ fontFamily: 'var(--font-card-subtitle, inherit)' }}
              >
                {artwork.subtitle}
              </p>
            )}
          </div>

          {artwork.shortDescription && (
            <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed line-clamp-4">
              {artwork.shortDescription}
            </p>
          )}

          {artwork.materials && artwork.materials.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {artwork.materials.slice(0, 6).map((material) => (
                <span
                  key={material}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-tag bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20"
                >
                  {material}
                </span>
              ))}
            </div>
          )}

          <Link
            href={detailUrl}
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)]"
            style={{ fontFamily: 'var(--font-button, inherit)' }}
          >
            View artwork
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
