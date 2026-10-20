'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MediaRef } from '@/types/public.types';

interface AboutPortraitProps {
  image?: MediaRef;
}

// Editorial 3:4 portrait unique to About — same proportions as Home, different frame.
export function AboutPortrait({ image }: AboutPortraitProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = image?.url;
  const altText = image?.altText || 'About portrait';

  if (!imageUrl || imageError) {
    return null;
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute -inset-3 sm:-inset-4 rounded-[1.75rem] bg-gradient-to-br from-[var(--color-primary)]/25 via-transparent to-[var(--color-accent)]/25 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-2/3 h-2/3 rounded-3xl border border-[var(--color-accent)]/30 pointer-events-none" />
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <Image
          src={imageUrl}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          className="object-cover object-center"
          onError={() => setImageError(true)}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/50 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
