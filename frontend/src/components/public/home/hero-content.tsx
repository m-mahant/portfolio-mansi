'use client';

import React from 'react';
import { HomePageConfig, SocialLink } from '@/types/public.types';
import { DualIdentity } from './dual-identity';
import { HeroActions } from './hero-actions';
import { HomeSocialLinks } from './home-social-links';

interface HeroContentProps {
  socialLinks?: SocialLink[];
  homeConfig?: HomePageConfig | null;
}

// Assembles profile text, dual discipline details, actions, and social links for the hero.
export const HeroContent: React.FC<HeroContentProps> = ({
  socialLinks = [],
  homeConfig,
}) => {
  const hero = homeConfig?.hero;
  const name = hero?.mainHeading || 'Mansi Mahant';
  const title = hero?.accentHeading || 'Software Developer × Creative Artist';
  const shortBio =
    hero?.description ||
    'Crafting robust software systems and expressive digital artwork with equal passion.';

  return (
    <div className="flex flex-col justify-center space-y-4 max-w-2xl">
      {/* Hero Primary Name Heading */}
      <h1
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.1] break-words"
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        <span className="block text-[var(--color-text)]">{name}</span>
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-amber-300 text-2xl sm:text-3xl lg:text-4xl mt-2 font-semibold">
          {title}
        </span>
      </h1>

      {/* Subtitle Short Bio */}
      <p className="text-base sm:text-lg text-[var(--color-muted)] font-normal leading-relaxed">
        {shortBio}
      </p>

      {/* Dual Identity Cards */}
      <DualIdentity
        devCardTitle={hero?.devCardTitle}
        devCardDescription={hero?.devCardDescription}
        artCardTitle={hero?.artCardTitle}
        artCardDescription={hero?.artCardDescription}
      />

      {/* Primary CTA Buttons */}
      <HeroActions
        devCtaText={hero?.devCtaText}
        artCtaText={hero?.artCtaText}
        developmentUrl={hero?.devCtaTarget}
        artUrl={hero?.artCtaTarget}
      />

      {/* Social Links & Resume Download */}
      <HomeSocialLinks
        socialLinks={socialLinks}
        showSocialLinks={true}
      />
    </div>
  );
};
