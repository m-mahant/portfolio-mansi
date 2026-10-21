import React from 'react';
import { publicApi } from '@/services/api/public-api';
import { Blog } from '@/types/public.types';
import { PublicSection } from '@/components/public/public-section';
import { PublicError } from '@/components/public/public-error';
import { PublicEmptyState } from '@/components/public/public-empty-state';
import { BlogCard } from '@/components/public/blog/blog-card';
import { generatePublicMetadata } from '@/utils/seo.utils';

// Adds the RSS feed auto-discovery link to blog listing metadata.
function withRssAlternate(metadata: ReturnType<typeof generatePublicMetadata>) {
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      types: { 'application/rss+xml': '/blog/rss.xml' },
    },
  };
}

export async function generateMetadata() {
  try {
    const page = await publicApi.getBlogPage();
    return withRssAlternate(
      generatePublicMetadata({
        titleOverride: page.seo?.title || page.title || 'Blogs & Articles',
        descriptionOverride:
          page.seo?.description ||
          page.subtitle ||
          'Read articles, technical deep dives, and creative notes.',
        canonicalPath: '/blog',
      })
    );
  } catch {
    return withRssAlternate(
      generatePublicMetadata({
        titleOverride: 'Blogs & Articles',
        descriptionOverride: 'Read articles, technical deep dives, and creative notes.',
        canonicalPath: '/blog',
      })
    );
  }
}

// Public blogs listing with CMS header and article cards.
export default async function PublicBlogPage() {
  let blogs: Blog[] = [];
  let pageTitle = 'Blogs & Articles';
  let pageSubtitle = 'Insights, engineering reflections, design patterns, and creative notes.';
  let fetchFailed = false;

  try {
    const [paginatedBlogs, pageConfig] = await Promise.all([
      publicApi.getBlogs({ limit: 50 }),
      publicApi.getBlogPage().catch(() => null),
    ]);
    blogs = paginatedBlogs.items || [];
    if (pageConfig?.title) pageTitle = pageConfig.title;
    if (pageConfig?.subtitle) pageSubtitle = pageConfig.subtitle;
  } catch {
    fetchFailed = true;
  }

  if (fetchFailed) {
    return (
      <PublicSection className="py-16">
        <PublicError
          title="Unable to Load Blog Posts"
          message="We encountered an issue connecting to the blog repository. Please try again later."
        />
      </PublicSection>
    );
  }

  return (
    <PublicSection className="py-12 md:py-16">
      <div className="relative max-w-6xl mx-auto space-y-10 sm:space-y-12">
        <div className="pointer-events-none absolute -top-20 left-0 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />

        <header className="relative max-w-3xl space-y-3">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.1]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            {pageTitle}
          </h1>
          <p className="text-[var(--color-muted)] text-base sm:text-lg leading-relaxed">{pageSubtitle}</p>
        </header>

        {blogs.length === 0 ? (
          <PublicEmptyState
            title="No articles published yet"
            description="Check back soon for new posts and technical notes."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id || blog.slug} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </PublicSection>
  );
}
