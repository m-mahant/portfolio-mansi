import React from 'react';
import { getWorkPage } from '@/services/api/public-api';
import { PublicSection } from '@/components/public/public-section';
import { WorkOverview } from '@/components/public/work/work-overview';
import { generatePublicMetadata } from '@/utils/seo.utils';
import { WorkPageConfig } from '@/types/public.types';

export const metadata = generatePublicMetadata({
  titleOverride: 'Work Overview',
  descriptionOverride: 'Explore software development case studies and creative digital art portfolios.',
  canonicalPath: '/work',
});

// Renders the Work overview page directing visitors to Development and Art & Crafts.
export default async function PublicWorkPage() {
  let config: WorkPageConfig | null = null;

  try {
    const workRes = await getWorkPage().catch(() => null);
    config = workRes?.config || null;
  } catch {
    // Fallback to default copy if backend API is initializing
  }

  return (
    <PublicSection className="py-12 md:py-16">
      <WorkOverview config={config} />
    </PublicSection>
  );
}
