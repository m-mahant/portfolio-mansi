import React from 'react';
import { Project } from '@/types/public.types';
import { ProjectSectionHeading } from './project-section-heading';

interface ProjectFeaturesSectionProps {
  project: Project;
  className?: string;
}

// Feature cards; hidden when the catalog list is empty.
export const ProjectFeaturesSection: React.FC<ProjectFeaturesSectionProps> = ({
  project,
  className = '',
}) => {
  const features = project.features || [];

  if (features.length === 0) {
    return null;
  }

  return (
    <section className={`space-y-6 ${className}`}>
      <ProjectSectionHeading>Features</ProjectSectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, idx) => (
          <div
            key={feature.title || idx}
            className="p-5 sm:p-6 rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] space-y-2 hover:border-[var(--color-primary)]/35 transition-colors"
          >
            <h3
              className="text-base font-bold text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-heading, inherit)' }}
            >
              {feature.title}
            </h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
