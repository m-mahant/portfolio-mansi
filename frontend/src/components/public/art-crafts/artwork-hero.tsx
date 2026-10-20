import React from 'react';
import { ArtPageConfig } from '@/types/public.types';

interface ArtworkHeroProps {
  pageConfig?: ArtPageConfig | null;
}

// CMS-driven Art & Crafts listing header (title, subtitle, description).
export function ArtworkHero({ pageConfig }: ArtworkHeroProps) {
  const title = pageConfig?.title || 'Art & Crafts Portfolio';
  const subtitle =
    pageConfig?.subtitle ||
    'Explore 3D renders, digital illustrations, generative code artwork, and tactile handcrafted ceramics.';
  const description = pageConfig?.description;

  return (
    <header className="relative max-w-3xl space-y-3">
      <h1
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.1]"
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        {title}
      </h1>
      <p className="text-[var(--color-muted)] text-base sm:text-lg leading-relaxed">{subtitle}</p>
      {description ? (
        <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">{description}</p>
      ) : null}
    </header>
  );
}
