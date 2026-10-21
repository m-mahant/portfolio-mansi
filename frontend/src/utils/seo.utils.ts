// Utility functions to generate Next.js Metadata objects for site-wide and page-level SEO.

import type { Metadata } from 'next';
import { SeoMetadata, SiteSettings } from '@/types/public.types';
import { BRAND_DESCRIPTION, BRAND_NAME } from '@/lib/brand';

export interface SeoOptions {
  site?: SiteSettings | null;
  seo?: SeoMetadata | null;
  titleOverride?: string;
  descriptionOverride?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

// Builds schema.org BreadcrumbList JSON-LD so Google can show the page's hierarchy in search results.
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

const DEFAULT_SITE_TITLE = BRAND_NAME;
const DEFAULT_SITE_DESCRIPTION = BRAND_DESCRIPTION;

// Generates standardized Next.js Metadata for public pages.
export function generatePublicMetadata(options?: SeoOptions): Metadata {
  const site = options?.site;
  const seo = options?.seo;

  const baseTitle = site?.siteTitle || site?.siteName || DEFAULT_SITE_TITLE;
  const pageTitle = options?.titleOverride || seo?.title || baseTitle;
  const title = pageTitle === baseTitle ? baseTitle : `${pageTitle} | ${baseTitle}`;

  const description =
    options?.descriptionOverride ||
    seo?.description ||
    site?.shortDescription ||
    DEFAULT_SITE_DESCRIPTION;

  // Falls back to the generated opengraph-image.tsx route (not a dead /og-default.jpg
  // link) when no real site logo or per-page SEO image is configured.
  const ogImage = seo?.ogImage || site?.logo?.url || '/opengraph-image';
  const canonicalUrl = options?.canonicalPath ? options.canonicalPath : undefined;
  const isNoIndex = Boolean(seo?.noIndex);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: seo?.keywords || ['Software Developer', 'Digital Art', 'Portfolio', 'Full-Stack Engineer'],
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    robots: {
      index: !isNoIndex,
      follow: !isNoIndex,
    },
    openGraph: {
      title,
      description,
      type: options?.ogType || 'website',
      // Omitted (not an empty array) when unset, so Next.js falls back to opengraph-image.tsx.
      ...(ogImage ? { images: [{ url: ogImage, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
