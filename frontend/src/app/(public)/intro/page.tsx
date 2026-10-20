import React from 'react';
import { getIntro } from '@/services/api/public-api';
import { generatePublicMetadata } from '@/utils/seo.utils';
import { IntroStandaloneView } from '@/components/public/intro/intro-standalone-view';
import { IntroPageConfig } from '@/types/public.types';

export const metadata = generatePublicMetadata({
  titleOverride: 'Welcome | Lumenfolio',
  descriptionOverride: 'Entry experience for Lumenfolio portfolio.',
});

export const dynamic = 'force-dynamic';

// Standalone public Intro page route (/intro) driven by backend introPage/config.
export default async function PublicIntroPage() {
  let introConfig: IntroPageConfig | null = null;

  try {
    introConfig = await getIntro();
  } catch (err) {
    console.error('Failed to fetch public intro config:', err);
  }

  return <IntroStandaloneView introConfig={introConfig} />;
}
