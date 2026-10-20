import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Blog } from '@/types/public.types';
import { PublicImage } from '@/components/public/public-image';
import { calculateReadTime, formatBlogDate } from '@/utils/blog.utils';

interface BlogCardProps {
  blog: Blog;
}

// Listing card for a published article with cover, excerpt, and tags.
export function BlogCard({ blog }: BlogCardProps) {
  const readTime = calculateReadTime(blog.content);
  const pubDate = formatBlogDate(blog.publishedAt || blog.createdAt);

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/45 hover:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.55)]"
    >
      <div className="relative w-full overflow-hidden bg-[var(--color-background)]">
        <PublicImage
          src={blog.featuredImage?.url}
          alt={blog.featuredImage?.altText || blog.title}
          aspectRatio="video"
          className="group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {blog.category && (
          <span className="absolute top-3 left-3 rounded-full border border-[var(--color-primary)]/35 bg-[var(--color-background)]/80 px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary)] backdrop-blur-md">
            {blog.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col space-y-3 p-5">
        <p className="text-xs text-[var(--color-muted)]">
          {pubDate}
          {pubDate ? ' · ' : ''}
          {readTime} min read
        </p>
        <h2
          className="text-lg font-semibold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)] line-clamp-2"
          style={{ fontFamily: 'var(--font-card-title, inherit)' }}
        >
          {blog.title}
        </h2>
        {blog.excerpt && (
          <p
            className="flex-1 text-sm text-[var(--color-muted)] leading-relaxed line-clamp-3"
            style={{ fontFamily: 'var(--font-card-description, inherit)' }}
          >
            {blog.excerpt}
          </p>
        )}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-2 py-0.5 text-[11px] font-tag text-[var(--color-primary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <span
          className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-[var(--color-primary)]"
          style={{ fontFamily: 'var(--font-button, inherit)' }}
        >
          Read article
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
