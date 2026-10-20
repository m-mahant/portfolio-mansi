import React from 'react';
import { MediaRef } from '@/types/public.types';
import { AboutPortrait } from './about-portrait';

interface AboutStoryProps {
  story?: string;
  image?: MediaRef;
  className?: string;
}

// Renders My Story as an editorial split: portrait first on large screens, then narrative.
export function AboutStory({ story, image, className = '' }: AboutStoryProps) {
  if (!story || !story.trim()) {
    return null;
  }

  const hasImage = Boolean(image?.url);

  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute -top-16 left-1/4 h-64 w-64 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />

      <div
        className={`relative grid grid-cols-1 ${hasImage ? 'lg:grid-cols-12' : ''} gap-10 lg:gap-14 items-center`}
      >
        {hasImage && (
          <div className="lg:col-span-5">
            <AboutPortrait image={image} />
          </div>
        )}

        <div className={hasImage ? 'lg:col-span-7 space-y-5 min-w-0' : 'space-y-5'}>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.1]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            My Story
          </h1>
          <p className="text-[var(--color-muted)] text-base sm:text-lg leading-relaxed whitespace-pre-line max-w-2xl">
            {story}
          </p>
        </div>
      </div>
    </div>
  );
}
