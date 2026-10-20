import React from 'react';
import { Project } from '@/types/public.types';
import { ProjectSectionHeading } from './project-section-heading';

interface ProjectPerformanceSectionProps {
  project: Project;
  className?: string;
}

// Performance summary and metric tiles; omitted when disabled or empty.
export const ProjectPerformanceSection: React.FC<ProjectPerformanceSectionProps> = ({
  project,
  className = '',
}) => {
  const isEnabled = project.sections?.performance !== false && Boolean(project.performance?.enabled);
  const perf = project.performance;
  const metrics = perf?.metrics || [];

  if (!isEnabled || !perf || (metrics.length === 0 && !perf.summary?.trim())) {
    return null;
  }

  return (
    <section
      className={`p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] space-y-6 ${className}`}
    >
      <ProjectSectionHeading description={perf.summary}>Performance</ProjectSectionHeading>

      {metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, idx) => (
            <div
              key={m.label || idx}
              className="p-5 rounded-2xl bg-[var(--color-background)]/40 border border-[var(--color-border)] space-y-1 text-center"
            >
              <div className="text-xs text-[var(--color-muted)]">{m.label}</div>
              <div
                className="text-2xl font-bold text-[var(--color-primary)]"
                style={{ fontFamily: 'var(--font-heading, inherit)' }}
              >
                {m.value}
              </div>
              {m.improvement && (
                <div className="text-xs text-[var(--color-muted)]">{m.improvement}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
