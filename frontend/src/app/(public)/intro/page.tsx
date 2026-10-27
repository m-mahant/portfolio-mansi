import React from 'react';
import { getIntro } from '@/services/api/public-api';
import { generatePublicMetadata } from '@/utils/seo.utils';
import { IntroStandaloneView } from '@/components/public/intro/intro-standalone-view';
import { IntroPageConfig } from '@/types/public.types';

// Noindexed: this is a redundant entry splash that redirects into / once its animation
// finishes, with no unique content of its own — indexing it alongside / as duplicate content
// was a confirmed contributor to a "Duplicate without user-selected canonical" exclusion.
export const metadata = generatePublicMetadata({
  titleOverride: 'Welcome | Mansi Mahant',
  descriptionOverride: "Entry experience for Mansi Mahant's portfolio.",
  seo: { noIndex: true },
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
