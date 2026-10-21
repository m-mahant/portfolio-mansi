import React from 'react';
import { notFound } from 'next/navigation';
import { publicApi } from '@/services/api/public-api';
import { Artwork } from '@/types/public.types';
import { PublicSection } from '@/components/public/public-section';
import { ArtworkDetailHero } from '@/components/public/art-crafts/artwork-detail-hero';
import { ArtworkStory } from '@/components/public/art-crafts/artwork-story';
import { ArtworkProcess } from '@/components/public/art-crafts/artwork-process';
import { ArtworkMeta } from '@/components/public/art-crafts/artwork-meta';
import { ArtworkGallery } from '@/components/public/art-crafts/artwork-gallery';
import { RelatedArtwork } from '@/components/public/art-crafts/related-artwork';
import { ShareButtons } from '@/components/public/share-buttons';
import { generatePublicMetadata } from '@/utils/seo.utils';
import { BRAND_NAME } from '@/lib/brand';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generates dynamic SEO metadata for artwork detail pages using backend SEO settings.
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const artwork = await publicApi.getArtworkBySlug(slug);
    return generatePublicMetadata({
      seo: artwork.seo,
      titleOverride: `${artwork.title} | Art & Crafts Gallery`,
      descriptionOverride: artwork.shortDescription || artwork.subtitle,
      canonicalPath: `/work/art-crafts/${artwork.slug}`,
      ogType: 'article',
    });
  } catch {
    return generatePublicMetadata({
      titleOverride: 'Artwork Not Found',
    });
  }
}

// Artwork detail: story, process, gallery, and specs. Back link is hero-only; no prev/next pager.
export default async function PublicArtworkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let artwork: Artwork;
  let allArtworks: Artwork[] = [];

  try {
    artwork = await publicApi.getArtworkBySlug(slug);
    const paginated = await publicApi.getArtworks({ limit: 50 });
    allArtworks = paginated.items || [];
  } catch {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: artwork.title,
    description: artwork.shortDescription || artwork.subtitle,
    image: artwork.featuredImage?.url ? [artwork.featuredImage.url] : undefined,
    artform: artwork.category,
    dateCreated: artwork.year || artwork.createdAt,
    artMedium: artwork.materials?.join(', '),
    keywords: artwork.tags?.join(', '),
    creator: { '@type': 'Person', name: BRAND_NAME },
  };

  return (
    <PublicSection className="py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative max-w-6xl mx-auto space-y-12 md:space-y-16">
        <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

        <ArtworkDetailHero artwork={artwork} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <ArtworkStory artwork={artwork} />
            <ArtworkProcess artwork={artwork} />
            <ArtworkGallery artwork={artwork} />

            <div className="pt-6 border-t border-[var(--color-border)]">
              <ShareButtons title={artwork.title} />
            </div>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <ArtworkMeta artwork={artwork} />
          </div>
        </div>

        <RelatedArtwork currentArtwork={artwork} allArtworks={allArtworks} />
      </div>
    </PublicSection>
  );
}
