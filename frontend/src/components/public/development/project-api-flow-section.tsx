import React from 'react';
import { Project } from '@/types/public.types';
import { ProjectSectionHeading } from './project-section-heading';

interface ProjectApiFlowSectionProps {
  project: Project;
  className?: string;
}

// Maps HTTP verbs to theme-friendly badge colors.
function getMethodBadgeStyle(method: string): string {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)]/30';
    case 'POST':
      return 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border-[var(--color-accent)]/30';
    case 'PUT':
      return 'bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] border-[var(--color-secondary)]/30';
    case 'DELETE':
      return 'bg-[var(--color-muted)]/20 text-[var(--color-text)] border-[var(--color-border)]';
    case 'PATCH':
      return 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/25';
    default:
      return 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]';
  }
}

// API endpoint list with method badges; omitted when disabled or empty.
export const ProjectApiFlowSection: React.FC<ProjectApiFlowSectionProps> = ({
  project,
  className = '',
}) => {
  const isEnabled = project.sections?.apiFlow !== false && Boolean(project.apiFlow?.enabled);
  const apiFlow = project.apiFlow;
  const endpoints = apiFlow?.endpoints || [];

  if (!isEnabled || !apiFlow || endpoints.length === 0) {
    return null;
  }

  return (
    <section
      className={`p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] space-y-5 ${className}`}
    >
      <ProjectSectionHeading description={apiFlow.description}>API</ProjectSectionHeading>

      <div className="space-y-2.5">
        {endpoints.map((ep, idx) => (
          <div
            key={`${ep.method}-${ep.path}-${idx}`}
            className="p-4 rounded-2xl bg-[var(--color-background)]/50 border border-[var(--color-border)] flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 flex-wrap min-w-0">
              <span
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border font-mono ${getMethodBadgeStyle(
                  ep.method
                )}`}
              >
                {ep.method}
              </span>
              <span className="text-sm font-mono font-medium text-[var(--color-text)] break-all">{ep.path}</span>
            </div>
            <p className="text-sm text-[var(--color-muted)] md:text-right md:max-w-md">{ep.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
