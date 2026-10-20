'use client';

import React from 'react';
import { HomePageConfig, SocialLink } from '@/types/public.types';
import { PublicSection } from '../public-section';
import { HeroContent } from './hero-content';
import { HeroImage } from './hero-image';

interface HomeHeroProps {
  socialLinks?: SocialLink[];
  homeConfig?: HomePageConfig | null;
}

// Main Hero section wrapper combining profile content and portrait image in an asymmetric layout.
export const HomeHero: React.FC<HomeHeroProps> = ({ socialLinks = [], homeConfig }) => {
  const profileImage = homeConfig?.hero?.profileImage;

  return (
    <PublicSection className="pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Profile Copy & Dual Identity Actions */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <HeroContent socialLinks={socialLinks} homeConfig={homeConfig} />
        </div>

        {/* Right Column: Hero Portrait Image Frame */}
        <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
          <HeroImage image={profileImage} name={homeConfig?.hero?.mainHeading || 'Mansi Mahant'} />
        </div>
      </div>
    </PublicSection>
  );
};
