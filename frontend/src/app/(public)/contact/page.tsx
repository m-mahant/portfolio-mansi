import React from 'react';
import { PublicSection } from '@/components/public/public-section';
import { generatePublicMetadata, safeJsonLd } from '@/utils/seo.utils';
import { getSocialLinks, getContactPage } from '@/services/api/public-api';
import { SocialLink, ContactPageConfig } from '@/types/public.types';
import { ContactHero } from '@/components/public/contact/contact-hero';
import { ContactInfo } from '@/components/public/contact/contact-info';
import { ContactSocials } from '@/components/public/contact/contact-socials';
import { ContactForm } from '@/components/public/contact/contact-form';
import { BRAND_NAME } from '@/lib/brand';

export const dynamic = 'force-dynamic';

export const metadata = generatePublicMetadata({
  titleOverride: 'Contact',
  descriptionOverride: 'Get in touch for software development opportunities, commissions, or technical collaborations.',
  canonicalPath: '/contact',
});

// Renders the public Contact page driven by backend API data and interactive Firestore submission form.
export default async function PublicContactPage() {
  let contactConfig: ContactPageConfig | null = null;
  let socialLinks: SocialLink[] = [];

  try {
    const [contactCfgRes, socialsRes] = await Promise.all([
      getContactPage().catch(() => null),
      getSocialLinks().catch(() => []),
    ]);
    contactConfig = contactCfgRes;
    socialLinks = socialsRes || [];
  } catch {
    // Fallback gracefully if API calls fail during initial render
  }

  const showContact = contactConfig?.showForm ?? true;

  const closedTitle = contactConfig?.closedTitle || 'Inquiries Temporarily Closed';
  const closedMessage =
    contactConfig?.closedMessage ||
    'Direct form submissions are currently unavailable. Please connect via direct email or social profiles.';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'Freelance Full-Stack Software Development',
        serviceType: 'Software Development',
        provider: { '@type': 'Person', name: BRAND_NAME, url: siteUrl },
        areaServed: 'Worldwide',
        description:
          'Full-stack web application development, REST APIs, role-based systems, and database architecture using React.js, Next.js, Node.js, and Laravel.',
        url: `${siteUrl}/work/development`,
      },
      {
        '@type': 'Service',
        name: 'Digital Art & Illustration Commissions',
        serviceType: 'Digital Art',
        provider: { '@type': 'Person', name: BRAND_NAME, url: siteUrl },
        areaServed: 'Worldwide',
        description: 'Digital illustration, concept art, and custom artwork commissions.',
        url: `${siteUrl}/work/art-crafts`,
      },
    ],
  };

  return (
    <PublicSection className="py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(servicesJsonLd) }} />
      <div className="relative space-y-12 max-w-6xl mx-auto">
        <div className="pointer-events-none absolute -top-20 left-0 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        <ContactHero contactConfig={contactConfig} />

        {showContact ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Direct Info & Social Profiles */}
            <div className="lg:col-span-5 space-y-6">
              <ContactInfo contactConfig={contactConfig} />
              <ContactSocials socialLinks={socialLinks} />
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] text-center space-y-3">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">{closedTitle}</h3>
            <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
              {closedMessage}
            </p>
            <ContactInfo contactConfig={contactConfig} />
          </div>
        )}
      </div>
    </PublicSection>
  );
}
