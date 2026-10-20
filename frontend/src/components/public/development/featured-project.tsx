import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '@/types/public.types';
import { PublicImage } from '../public-image';

interface FeaturedProjectProps {
  project: Project;
  className?: string;
}

// Renders a prominent featured project hero card with tech summary and case-study CTA.
export const FeaturedProject: React.FC<FeaturedProjectProps> = ({ project, className = '' }) => {
  const detailUrl = `/work/development/${project.slug}`;

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border border-[var(--color-primary)]/25 bg-[var(--color-surface)]/50 p-5 sm:p-6 md:p-8 ${className}`}
    >
      <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-[var(--color-primary)]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <Link
          href={detailUrl}
          className="lg:col-span-7 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-lg group"
        >
          <PublicImage
            src={project.coverImage?.url}
            alt={project.coverImage?.altText || project.title}
            aspectRatio="video"
            priority
            className="group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
          {project.isFeatured && (
            <span className="inline-flex w-fit items-center rounded-full border border-[var(--color-primary)]/35 bg-[var(--color-primary)]/12 px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
              Featured
            </span>
          )}

          <div className="space-y-2">
            <h2
              className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-heading, inherit)' }}
            >
              <Link href={detailUrl} className="hover:text-[var(--color-primary)] transition-colors">
                {project.title}
              </Link>
            </h2>
            {project.subtitle && (
              <p
                className="text-sm font-medium text-[var(--color-primary)]"
                style={{ fontFamily: 'var(--font-card-subtitle, inherit)' }}
              >
                {project.subtitle}
              </p>
            )}
          </div>

          <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed line-clamp-4">
            {project.shortDescription}
          </p>

          {project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-tag bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <Link
            href={detailUrl}
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
            style={{ fontFamily: 'var(--font-button, inherit)' }}
          >
            Explore case study
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
};
