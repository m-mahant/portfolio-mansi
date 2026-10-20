import React from 'react';
import { Project } from '@/types/public.types';
import { PublicImage } from '../public-image';
import { ProjectSectionHeading } from './project-section-heading';

interface ProjectGallerySectionProps {
  project: Project;
  className?: string;
}

// Screenshot gallery; omitted when disabled or empty.
export const ProjectGallerySection: React.FC<ProjectGallerySectionProps> = ({
  project,
  className = '',
}) => {
  const isEnabled = project.sections?.gallery !== false;
  const gallery = project.gallery || [];

  if (!isEnabled || gallery.length === 0) {
    return null;
  }

  return (
    <section className={`space-y-6 ${className}`}>
      <ProjectSectionHeading>Gallery</ProjectSectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {gallery.map((img, idx) => (
          <figure
            key={img.mediaId || img.url || idx}
            className="group overflow-hidden rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border)]"
          >
            <PublicImage
              src={img.url}
              alt={img.altText || `${project.title} gallery`}
              aspectRatio="video"
              className="group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {img.altText && (
              <figcaption className="p-3 text-xs text-[var(--color-muted)] text-center border-t border-[var(--color-border)]">
                {img.altText}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
};
