'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Artwork } from '@/types/public.types';
import { ArtworkLightbox } from './artwork-lightbox';
import { getArtworkLightboxImages } from '@/utils/artwork.utils';

interface ArtworkGalleryProps {
  artwork: Artwork;
}

// Renders the interactive thumbnail gallery grid and handles full-screen lightbox trigger.
// Returns null if no images are present (Hide Empty Sections).
export function ArtworkGallery({ artwork }: ArtworkGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const galleryImages = useMemo(() => getArtworkLightboxImages(artwork), [artwork]);

  if (galleryImages.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] space-y-5">
      <h2
        className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        Gallery
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {galleryImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => openLightbox(idx)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            <Image
              src={img.url}
              alt={img.altText || `Gallery image ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-[var(--color-background)]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <ArtworkLightbox
        images={galleryImages}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </section>
  );
}
