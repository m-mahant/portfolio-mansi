import React from 'react';
import { Project } from '@/types/public.types';
import { PublicImage } from '../public-image';
import { ProjectSectionHeading } from './project-section-heading';

interface ProjectArchitectureSectionProps {
  project: Project;
  className?: string;
}

// Architecture copy and diagram; omitted when disabled or empty.
export const ProjectArchitectureSection: React.FC<ProjectArchitectureSectionProps> = ({
  project,
  className = '',
}) => {
  const isEnabled = project.sections?.architecture !== false && Boolean(project.architecture?.enabled);
  const arch = project.architecture;

  if (!isEnabled || !arch || (!arch.description?.trim() && !arch.diagramUrl)) {
    return null;
  }

  return (
    <section
      className={`p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] space-y-6 ${className}`}
    >
      <ProjectSectionHeading description={arch.description}>Architecture</ProjectSectionHeading>

      {arch.diagramUrl && (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/40 p-2">
          <PublicImage
            src={arch.diagramUrl}
            alt={`${project.title} architecture`}
            className="w-full h-auto object-contain max-h-[600px] rounded-xl"
          />
        </div>
      )}
    </section>
  );
};
