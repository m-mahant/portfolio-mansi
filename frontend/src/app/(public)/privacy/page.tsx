import React from 'react';
import { PublicSection } from '@/components/public/public-section';
import { PublicHeading } from '@/components/public/public-heading';
import { BlogContent } from '@/components/public/blog/blog-content';
import { generatePublicMetadata } from '@/utils/seo.utils';

export const metadata = generatePublicMetadata({
  titleOverride: 'Privacy Policy',
  descriptionOverride: "How Mansi Mahant's portfolio collects and uses visitor data.",
  canonicalPath: '/privacy',
});

const POLICY_CONTENT = `Last updated: October 2026

This is a personal portfolio site. This page explains what information is collected from visitors, why, and how it is handled.

## What is collected

- **Contact form**: name, email address, subject, message, and IP address (the IP is used only to prevent spam and is not shared).
- **Analytics**: anonymous visit and performance data via Vercel Analytics, Vercel Speed Insights, and Google Analytics. Google Analytics uses cookies; the Vercel tools do not.

## Why it is collected

- To respond to messages sent through the contact form.
- To prevent spam and abuse (rate limiting based on IP address).
- To understand site traffic and page performance.

## Third-party services used

- **Firebase (Google Cloud)** — stores site content and contact form submissions.
- **Resend** — sends an email notification when the contact form is submitted.
- **ImageKit** — hosts and serves images.
- **Vercel** — hosts the site and provides analytics/performance monitoring.
- **Google Analytics** — traffic analytics (uses cookies).

## Data retention

Contact form submissions are kept until manually deleted from the admin panel.

## Your rights

You can request that a message you submitted be deleted by emailing the address below.

## No selling of data

Your data is never sold or shared with third parties for marketing purposes.

## Contact

Questions about this policy can be sent to hello@mansimahant.com.`;

// Static legal page explaining what visitor data this site collects and why.
export default function PrivacyPolicyPage() {
  return (
    <PublicSection className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <PublicHeading level={1}>Privacy Policy</PublicHeading>
        <BlogContent content={POLICY_CONTENT} />
      </div>
    </PublicSection>
  );
}
