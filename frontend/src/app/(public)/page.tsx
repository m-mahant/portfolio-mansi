import React from 'react';
import { getHome, getIntro } from '@/services/api/public-api';
import { generatePublicMetadata } from '@/utils/seo.utils';
import { IntroScreen } from '@/components/public/intro/intro-screen';
import { HomeHero } from '@/components/public/home/home-hero';
import { HomePageConfig, IntroPageConfig } from '@/types/public.types';

export const metadata = generatePublicMetadata({
  titleOverride: 'Mansi Mahant — Home',
  descriptionOverride: 'Dynamic portfolio fusing software engineering precision and creative digital artwork.',
});

// Renders the root public home page with backend-driven profile hero and creative intro screen wrapper.
export default async function PublicHomePage() {
  let introConfig: IntroPageConfig | null = null;
  let homeConfig: HomePageConfig | null = null;

  try {
    const [introRes, homeRes] = await Promise.all([
      getIntro().catch(() => null),
      getHome().catch(() => null),
    ]);

    introConfig = introRes;
    homeConfig = homeRes?.config || null;
  } catch {
    // Graceful fallback to default mock/null state if backend API is initializing
  }

  // Preloads the hero portrait while the intro screen plays, so it's already cached by the
  // time "home" renders instead of only starting to fetch after the user clicks through.
  const heroImageUrl = homeConfig?.hero?.profileImage?.url;

  return (
    <>
      {heroImageUrl && <link rel="preload" as="image" fetchPriority="high" href={heroImageUrl} />}
      <IntroScreen introConfig={introConfig}>
        <div className="w-full">
          {/* Home renders hero only: profile, dual identity, CTAs, and portrait. */}
          <HomeHero homeConfig={homeConfig} />
        </div>
      </IntroScreen>
    </>
  );
}
