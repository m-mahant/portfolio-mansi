import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { publicApi } from '@/services/api/public-api';
import { PublicSection } from '@/components/public/public-section';
import { PublicImage } from '@/components/public/public-image';
import { BlogContent } from '@/components/public/blog/blog-content';
import { generatePublicMetadata } from '@/utils/seo.utils';
import { calculateReadTime, formatBlogDate } from '@/utils/blog.utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generates dynamic SEO metadata for public blog post pages.
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const blog = await publicApi.getBlogBySlug(slug);
    return generatePublicMetadata({
      seo: blog.seo,
      titleOverride: `${blog.title} — Blogs`,
      descriptionOverride: blog.excerpt || blog.title,
      canonicalPath: `/blog/${blog.slug}`,
      ogType: 'article',
    });
  } catch {
    return generatePublicMetadata({
      titleOverride: 'Article Not Found',
    });
  }
}

// Article detail: hero, cover, and body. Back link is top-only.
export default async function PublicBlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let blog;

  try {
    blog = await publicApi.getBlogBySlug(slug);
  } catch {
    notFound();
  }

  const readTime = calculateReadTime(blog.content);
  const formattedDate = formatBlogDate(blog.publishedAt || blog.createdAt, 'long');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.title,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    image: blog.featuredImage?.url ? [blog.featuredImage.url] : undefined,
    keywords: blog.tags?.join(', '),
    articleSection: blog.category || 'General',
  };

  return (
    <article className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PublicSection className="py-12 md:py-16">
        <div className="relative max-w-3xl mx-auto space-y-10">
          <div className="pointer-events-none absolute -top-20 left-0 h-64 w-64 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />

          <Link
            href="/blog"
            className="relative inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
            style={{ fontFamily: 'var(--font-button, inherit)' }}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Blogs
          </Link>

          <header className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
              {blog.category && (
                <span className="px-3 py-1 rounded-lg text-xs font-tag bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                  {blog.category}
                </span>
              )}
              {formattedDate && <span>{formattedDate}</span>}
              <span>{readTime} min read</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.1]"
              style={{ fontFamily: 'var(--font-heading, inherit)' }}
            >
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="text-lg text-[var(--color-muted)] leading-relaxed">{blog.excerpt}</p>
            )}

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs font-tag border border-[var(--color-border)] text-[var(--color-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {blog.featuredImage?.url && (
            <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 shadow-2xl">
              <PublicImage
                src={blog.featuredImage.url}
                alt={blog.featuredImage.altText || blog.title}
                aspectRatio="video"
                priority
                className="w-full h-auto object-cover max-h-[520px]"
              />
            </div>
          )}

          <BlogContent content={blog.content} />
        </div>
      </PublicSection>
    </article>
  );
}
