import React from 'react';
import { publicApi } from '@/services/api/public-api';
import { PublicSection } from '@/components/public/public-section';
import { PublicError } from '@/components/public/public-error';
import { AboutStory } from '@/components/public/about/about-story';
import { AboutWhatIDo } from '@/components/public/about/about-what-i-do';
import { AboutDualIdentity } from '@/components/public/about/about-dual-identity';
import { AboutPhilosophy } from '@/components/public/about/about-philosophy';
import { AboutInterests } from '@/components/public/about/about-interests';
import { generatePublicMetadata, generateBreadcrumbJsonLd, safeJsonLd } from '@/utils/seo.utils';
import { AboutProfile } from '@/types/public.types';
import { BRAND_NAME } from '@/lib/brand';

// Was a static `metadata` export, which can't read Firestore — the About SEO form in Admin
// (title/description/keywords/noIndex) had no way to ever reach the live page. Converted to an
// async generateMetadata() like the other CMS-backed pages so about.seo actually gets used.
export async function generateMetadata() {
  try {
    const about = await publicApi.getAbout();
    return generatePublicMetadata({
      seo: about.seo,
      titleOverride: about.seo?.title || 'About Profile',
      descriptionOverride: about.seo?.description || "Learn more about the developer and artist behind Mansi Mahant's portfolio.",
      canonicalPath: '/about',
    });
  } catch {
    return generatePublicMetadata({
      titleOverride: 'About Profile',
      descriptionOverride: "Learn more about the developer and artist behind Mansi Mahant's portfolio.",
      canonicalPath: '/about',
    });
  }
}

// Server component fetching and assembling backend-driven biography, dual identity, and interests.
export default async function PublicAboutPage() {
  let about: AboutProfile | null = null;
  let errorMessage: string | null = null;

  try {
    about = await publicApi.getAbout();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unable to load profile data.';
  }

  if (errorMessage || !about) {
    return (
      <PublicSection surface="dark">
        <PublicError
          title="About Profile Unavailable"
          message={errorMessage || 'Unable to load profile data.'}
        />
      </PublicSection>
    );
  }

  const socialLinks = await publicApi.getSocialLinks().catch(() => []);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateModified: about.updatedAt,
    mainEntity: {
      '@type': 'Person',
      name: BRAND_NAME,
      url: `${siteUrl}/about`,
      jobTitle: 'Full-Stack Software Engineer & Digital Artist',
      description: about.shortBio,
      ...(about.profileImage?.url && { image: about.profileImage.url }),
      ...(about.whatIDo?.length && { knowsAbout: about.whatIDo }),
      ...(socialLinks?.length && {
        sameAs: socialLinks.filter((s) => s.isVisible).map((s) => s.url),
      }),
    },
  };

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);

  return (
    <PublicSection className="py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <div className="space-y-16 md:space-y-20 max-w-6xl mx-auto">
        <AboutStory story={about.myStory} image={about.secondaryImage} />

        <AboutDualIdentity
          developerSide={about.developerSide}
          artistSide={about.artistSide}
        />

        <AboutWhatIDo items={about.whatIDo} />

        <AboutPhilosophy philosophy={about.philosophy} />

        <AboutInterests interests={about.interests} />
      </div>
    </PublicSection>
  );
}
