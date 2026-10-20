import React from 'react';
import { Project } from '@/types/public.types';
import { ProjectSectionHeading } from './project-section-heading';

interface ProjectWorkflowSectionProps {
  project: Project;
  className?: string;
}

// Workflow step cards without numbered badges; hidden when empty.
export const ProjectWorkflowSection: React.FC<ProjectWorkflowSectionProps> = ({
  project,
  className = '',
}) => {
  const isEnabled = project.sections?.workflow !== false && Boolean(project.workflow?.enabled);
  const workflow = project.workflow;
  const steps = workflow?.steps || [];

  if (!isEnabled || !workflow || steps.length === 0) {
    return null;
  }

  return (
    <section className={`space-y-6 ${className}`}>
      <ProjectSectionHeading description={workflow.description}>Workflow</ProjectSectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, idx) => (
          <div
            key={step.title || idx}
            className="p-5 sm:p-6 rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] space-y-2"
          >
            <h3
              className="text-base font-bold text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-heading, inherit)' }}
            >
              {step.title}
            </h3>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
