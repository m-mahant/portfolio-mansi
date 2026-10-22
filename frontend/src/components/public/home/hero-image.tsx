'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MediaRef } from '@/types/public.types';
import { BRAND_NAME, SAMPLE_PERSON_NAME } from '@/lib/brand';

interface HeroImageProps {
  image?: MediaRef;
  name?: string;
}

// Renders the backend-driven portrait image with responsive frame, ambient glow, and optimized fallback.
export const HeroImage: React.FC<HeroImageProps> = ({ image, name = SAMPLE_PERSON_NAME }) => {
  const [imageError, setImageError] = useState<boolean>(false);

  const imageUrl = image?.url;
  const altText = image?.altText || `${name} - Software Developer & Creative Artist`;

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
      {/* Soft gradient glow behind the frame for a more crafted feel */}
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--color-primary)]/30 via-[var(--color-accent)]/20 to-transparent blur-2xl opacity-70 pointer-events-none" />

      {!imageUrl || imageError ? (
        <div className="relative aspect-[3/4] rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-6 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 flex items-center justify-center mb-4 text-3xl font-bold text-[var(--color-primary)] shadow-inner">
            {name.charAt(0)}
          </div>
          <p className="text-sm font-semibold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading, inherit)' }}>
            {name}
          </p>
          <p className="text-xs text-[var(--color-primary)] mt-1 font-mono">{BRAND_NAME}</p>
        </div>
      ) : (
        <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl transition-all duration-300 hover:border-[var(--color-primary)]/40">
          {/* Decorative Frame Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/80 via-transparent to-transparent z-10 opacity-60 pointer-events-none" />

          <Image
            src={imageUrl}
            alt={altText}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            priority
          />
        </div>
      )}
    </div>
  );
};
