import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Project } from '@/types/public.types';
import { PublicImage } from '../public-image';

interface ProjectHeroProps {
  project: Project;
  className?: string;
}

// Case study hero: back link, title, stack tags, and cover media.
export const ProjectHero: React.FC<ProjectHeroProps> = ({ project, className = '' }) => {
  return (
    <section className={`space-y-8 ${className}`}>
      <Link
        href="/work/development"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
        style={{ fontFamily: 'var(--font-button, inherit)' }}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to Development Portfolio
      </Link>

      <div className="space-y-4 max-w-4xl">
        {project.isFeatured && (
          <span className="inline-flex w-fit items-center rounded-full border border-[var(--color-primary)]/35 bg-[var(--color-primary)]/12 px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
            Featured
          </span>
        )}

        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.1]"
          style={{ fontFamily: 'var(--font-heading, inherit)' }}
        >
          {project.title}
        </h1>

        {project.subtitle && (
          <p className="text-lg md:text-xl font-medium text-[var(--color-primary)] leading-relaxed">
            {project.subtitle}
          </p>
        )}

        <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-3xl">
          {project.shortDescription}
        </p>

        {(project.technologies.length > 0 || project.tags.length > 0) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-xs font-tag bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20"
              >
                {tech}
              </span>
            ))}
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg text-xs font-tag bg-[var(--color-surface)]/60 text-[var(--color-muted)] border border-[var(--color-border)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {project.coverImage?.url && (
        <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 shadow-2xl">
          <PublicImage
            src={project.coverImage.url}
            alt={project.coverImage.altText || project.title}
            aspectRatio="video"
            priority
            className="w-full h-auto object-cover max-h-[550px]"
          />
        </div>
      )}
    </section>
  );
};
