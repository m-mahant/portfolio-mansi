import React from 'react';
import { publicApi } from '@/services/api/public-api';
import { Artwork, ArtPageConfig } from '@/types/public.types';
import { PublicSection } from '@/components/public/public-section';
import { PublicError } from '@/components/public/public-error';
import { ArtworkHero } from '@/components/public/art-crafts/artwork-hero';
import { FeaturedArtwork } from '@/components/public/art-crafts/featured-artwork';
import { ArtworkGrid } from '@/components/public/art-crafts/artwork-grid';
import { generatePublicMetadata } from '@/utils/seo.utils';

export async function generateMetadata() {
  try {
    const page = await publicApi.getArtPage();
    return generatePublicMetadata({
      titleOverride: page.seo?.title || page.title || 'Art & Crafts Gallery',
      descriptionOverride:
        page.seo?.description ||
        page.subtitle ||
        'Explore 3D renders, digital illustrations, and handcrafted fine ceramics.',
      canonicalPath: '/work/art-crafts',
    });
  } catch {
    return generatePublicMetadata({
      titleOverride: 'Art & Crafts Gallery',
      descriptionOverride: 'Explore 3D renders, digital illustrations, and handcrafted fine ceramics.',
      canonicalPath: '/work/art-crafts',
    });
  }
}

// Renders the public Art & Crafts gallery listing with CMS-driven header.
export default async function PublicArtCraftsPage() {
  let artworks: Artwork[] = [];
  let pageConfig: ArtPageConfig | null = null;
  let fetchFailed = false;

  try {
    const [paginatedArtworks, artPage] = await Promise.all([
      publicApi.getArtworks({ limit: 50 }),
      publicApi.getArtPage().catch(() => null),
    ]);
    artworks = paginatedArtworks.items || [];
    pageConfig = artPage;
  } catch {
    fetchFailed = true;
  }

  if (fetchFailed) {
    return (
      <PublicSection className="py-16">
        <PublicError
          title="Unable to Load Art Gallery"
          message="We encountered an issue fetching artwork records. Please refresh or try again later."
        />
      </PublicSection>
    );
  }

  const primaryFeaturedArtwork = artworks.find((a) => a.isFeatured);
  const galleryHeading = pageConfig?.galleryHeading || 'Gallery';

  return (
    <PublicSection className="py-12 md:py-16">
      <div className="relative max-w-6xl mx-auto space-y-10 sm:space-y-12">
        <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

        <ArtworkHero pageConfig={pageConfig} />

        {primaryFeaturedArtwork && <FeaturedArtwork artwork={primaryFeaturedArtwork} />}

        <div className="relative space-y-6">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            {galleryHeading}
          </h2>
          <ArtworkGrid artworks={artworks} />
        </div>
      </div>
    </PublicSection>
  );
}
