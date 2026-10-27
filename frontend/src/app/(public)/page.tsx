import React from 'react';
import { getHome, getIntro } from '@/services/api/public-api';
import { generatePublicMetadata } from '@/utils/seo.utils';
import { IntroScreen } from '@/components/public/intro/intro-screen';
import { HomeHero } from '@/components/public/home/home-hero';
import { HomePageConfig, IntroPageConfig } from '@/types/public.types';

export const metadata = generatePublicMetadata({
  titleOverride: 'Mansi Mahant — Home',
  descriptionOverride: 'Dynamic portfolio fusing software engineering precision and creative digital artwork.',
  canonicalPath: '/',
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

  return (
    <IntroScreen introConfig={introConfig}>
      <div className="w-full">
        <HomeHero homeConfig={homeConfig} />
      </div>
    </IntroScreen>
  );
}
