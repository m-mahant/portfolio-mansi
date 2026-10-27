import React from 'react';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import { getSite, getAbout, getSocialLinks } from '@/services/api/public-api';
import { SiteSettings } from '@/types/public.types';
import { BRAND_NAME, SAMPLE_PERSON_NAME } from '@/lib/brand';
import { safeJsonLd } from '@/utils/seo.utils';

export const dynamic = 'force-dynamic';

// Global layout wrapper for all public pages including Header, Footer, and dynamic site settings context.
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let siteName = BRAND_NAME;
  let copyrightText: string | undefined;
  let site: SiteSettings | null = null;

  const sitePromise = getSite().catch(() => null);
  const aboutPromise = getAbout().catch(() => null);
  const socialLinksPromise = getSocialLinks().catch(() => []);

  const [fetchedSite, about, socialLinks] = await Promise.all([
    sitePromise,
    aboutPromise,
    socialLinksPromise,
  ]);

  if (fetchedSite) {
    site = fetchedSite;
    if (fetchedSite.siteName) siteName = fetchedSite.siteName;
    if (fetchedSite.copyrightText) copyrightText = fetchedSite.copyrightText;
  }

  const faviconUrl = site?.favicon?.url;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const personId = `${siteUrl}/#person`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        'name': siteName,
        'url': siteUrl,
        'inLanguage': 'en',
        'publisher': { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        'name': SAMPLE_PERSON_NAME,
        'jobTitle': 'Full-Stack Software Engineer & Digital Artist',
        'url': siteUrl,
        ...(about?.profileImage?.url && { image: about.profileImage.url }),
        ...(about?.shortBio && { description: about.shortBio }),
        ...(about?.whatIDo?.length && { knowsAbout: about.whatIDo }),
        ...(socialLinks?.length && {
          sameAs: socialLinks.filter((s) => s.isVisible).map((s) => s.url),
        }),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-300 overflow-x-clip">
      {faviconUrl && <link rel="icon" href={faviconUrl} key="dynamic-favicon" />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--color-primary)] focus:text-white focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Persistent ambient wash, fixed to the viewport so the transparent header/footer always
          have something to blur behind them instead of the flat page background. */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/3 -left-1/4 h-[70vmax] w-[70vmax] rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        <div className="absolute -bottom-1/3 -right-1/4 h-[70vmax] w-[70vmax] rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
      </div>

      <PublicHeader siteName={siteName} site={site} />
      <main id="main-content" className="flex-1 w-full min-w-0">{children}</main>
      <PublicFooter siteName={siteName} copyrightText={copyrightText} />
    </div>
  );
}
