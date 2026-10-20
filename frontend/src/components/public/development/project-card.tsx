import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '@/types/public.types';
import { PublicImage } from '../public-image';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

// Project listing card with cover, stack tags, and a full-card case-study link.
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, className = '' }) => {
  const detailUrl = `/work/development/${project.slug}`;

  return (
    <Link
      href={detailUrl}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/45 hover:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.55)] ${className}`}
    >
      <div className="relative w-full overflow-hidden bg-[var(--color-background)]">
        <PublicImage
          src={project.coverImage?.url}
          alt={project.coverImage?.altText || project.title}
          aspectRatio="video"
          className="group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {project.isFeatured && (
          <span className="absolute top-3 left-3 z-10 rounded-full border border-[var(--color-primary)]/40 bg-[var(--color-background)]/80 px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary)] backdrop-blur-md">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 space-y-3">
        {(project.technologies.length > 0 || project.tags.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md text-[11px] font-tag bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20"
              >
                {tech}
              </span>
            ))}
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[11px] font-tag bg-[var(--color-background)]/50 text-[var(--color-muted)] border border-[var(--color-border)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-1.5 flex-1">
          <h3
            className="text-lg font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors"
            style={{ fontFamily: 'var(--font-card-title, inherit)' }}
          >
            {project.title}
          </h3>
          {project.subtitle && (
            <p
              className="text-xs font-medium text-[var(--color-primary)] line-clamp-1"
              style={{ fontFamily: 'var(--font-card-subtitle, inherit)' }}
            >
              {project.subtitle}
            </p>
          )}
          <p
            className="text-sm text-[var(--color-muted)] line-clamp-3 leading-relaxed"
            style={{ fontFamily: 'var(--font-card-description, inherit)' }}
          >
            {project.shortDescription}
          </p>
        </div>

        <span
          className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-[var(--color-primary)]"
          style={{ fontFamily: 'var(--font-button, inherit)' }}
        >
          View case study
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
};
