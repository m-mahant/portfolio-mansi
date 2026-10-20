'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';

export interface LightboxImageItem {
  url: string;
  altText?: string;
  caption?: string;
}

interface ArtworkLightboxProps {
  images: LightboxImageItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

// Accessible full-screen lightbox modal for high-resolution artwork viewing.
export function ArtworkLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: ArtworkLightboxProps) {
  const currentImage = images[currentIndex];
  const totalImages = images.length;

  const handleNext = useCallback(() => {
    if (totalImages > 0) {
      onNavigate((currentIndex + 1) % totalImages);
    }
  }, [currentIndex, totalImages, onNavigate]);

  const handlePrev = useCallback(() => {
    if (totalImages > 0) {
      onNavigate((currentIndex - 1 + totalImages) % totalImages);
    }
  }, [currentIndex, totalImages, onNavigate]);

  // Keyboard navigation & body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentImage) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-background)]/95 backdrop-blur-xl p-4 md:p-8 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Artwork Image Lightbox"
    >
      {/* Background overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Top Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-auto">
        <div className="px-3 py-1.5 rounded-full bg-[var(--color-surface)]/90 border border-[var(--color-border)] text-xs font-mono text-[var(--color-text)]">
          Image {currentIndex + 1} of {totalImages}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2.5 rounded-full bg-[var(--color-surface)]/90 border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          aria-label="Close Lightbox"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative z-10 max-w-5xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center pointer-events-auto">
        <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
          <Image
            src={currentImage.url}
            alt={currentImage.altText || `Artwork view ${currentIndex + 1}`}
            fill
            sizes="100vw"
            className="object-contain max-h-[70vh]"
            priority
          />
        </div>

        {/* Caption */}
        {currentImage.caption && (
          <p className="mt-4 text-center text-xs md:text-sm text-[var(--color-text)] bg-[var(--color-surface)]/90 border border-[var(--color-border)] px-4 py-2 rounded-lg font-mono max-w-xl">
            {currentImage.caption}
          </p>
        )}
      </div>

      {/* Navigation Arrows */}
      {totalImages > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[var(--color-surface)]/90 border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            aria-label="Previous Image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[var(--color-surface)]/90 border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            aria-label="Next Image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
