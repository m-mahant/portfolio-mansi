import React from 'react';
import { publicApi } from '@/services/api/public-api';
import { PublicSection } from '@/components/public/public-section';
import { PublicHeading } from '@/components/public/public-heading';
import { BlogContent } from '@/components/public/blog/blog-content';
import { generatePublicMetadata } from '@/utils/seo.utils';

export const metadata = generatePublicMetadata({
  titleOverride: 'Privacy Policy',
  descriptionOverride: "How Mansi Mahant's portfolio collects and uses visitor data.",
  canonicalPath: '/privacy',
});

// Fallback used only if the backend is unreachable; the real content is edited in Admin.
const FALLBACK_CONTENT = `This is a personal portfolio site. Questions about data collected here can be sent to hello@mansimahant.com.`;

// Server component rendering the backend-driven Privacy Policy content (editable in Admin).
export default async function PrivacyPolicyPage() {
  let content = FALLBACK_CONTENT;

  try {
    const config = await publicApi.getPrivacyPage();
    if (config?.content) {
      content = config.content;
    }
  } catch {
    // Gracefully fall back to the static content above if the backend is down.
  }

  return (
    <PublicSection className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <PublicHeading level={1}>Privacy Policy</PublicHeading>
        <BlogContent content={content} />
      </div>
    </PublicSection>
  );
}
