'use client';

import React from 'react';
import { HomePageConfig } from '@/types/public.types';
import { PublicContainer } from '../public-container';
import { HeroContent } from './hero-content';
import { HeroImage } from './hero-image';

interface HomeHeroProps {
  homeConfig?: HomePageConfig | null;
}

// Main Hero section wrapper combining profile content and portrait image in an asymmetric layout.
export const HomeHero: React.FC<HomeHeroProps> = ({ homeConfig }) => {
  const profileImage = homeConfig?.hero?.profileImage;

  return (
    <section className="relative overflow-hidden py-8 sm:py-12 lg:py-16">
      {/* Ambient background glow accents. Masked to fade out before the section's overflow-hidden
          edge so the blur never gets hard-clipped into a visible seam. */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-[var(--color-primary)]/10 blur-3xl [mask-image:radial-gradient(circle,black_0%,black_35%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-[var(--color-accent)]/10 blur-3xl [mask-image:radial-gradient(circle,black_0%,black_35%,transparent_70%)]" />

      <PublicContainer className="relative lg:min-h-[calc(100vh-220px)] flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12 items-center w-full">
          {/* Left Column: Profile Copy & Dual Identity Actions */}
          <div className="md:col-span-7 order-2 md:order-1">
            <HeroContent homeConfig={homeConfig} />
          </div>

          {/* Right Column: Hero Portrait Image Frame */}
          <div className="md:col-span-5 order-1 md:order-2 flex justify-center">
            <HeroImage image={profileImage} name={homeConfig?.hero?.mainHeading || 'Mansi Mahant'} />
          </div>
        </div>
      </PublicContainer>
    </section>
  );
};
