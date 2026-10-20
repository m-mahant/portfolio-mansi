import React from 'react';
import { Project } from '@/types/public.types';
import { ProjectSectionHeading } from './project-section-heading';

interface ProjectOverviewSectionProps {
  project: Project;
  className?: string;
}

const narrativeCard =
  'p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] space-y-3';

// Narrative blocks (overview, problem, solution, challenges, results); omitted when empty.
export const ProjectOverviewSection: React.FC<ProjectOverviewSectionProps> = ({
  project,
  className = '',
}) => {
  const sections = project.sections || {};

  const hasOverview = sections.overview !== false && Boolean(project.overview?.trim());
  const hasProblem = sections.problem !== false && Boolean(project.problem?.trim());
  const hasSolution = sections.solution !== false && Boolean(project.solution?.trim());
  const hasChallenges = sections.challenges !== false && Boolean(project.challenges?.trim());
  const hasResults = sections.results !== false && Boolean(project.results?.trim());

  if (!hasOverview && !hasProblem && !hasSolution && !hasChallenges && !hasResults) {
    return null;
  }

  return (
    <section className={`space-y-6 ${className}`}>
      {hasOverview && (
        <div className={narrativeCard}>
          <ProjectSectionHeading>Overview</ProjectSectionHeading>
          <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed whitespace-pre-line">
            {project.overview}
          </p>
        </div>
      )}

      {(hasProblem || hasSolution) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hasProblem && (
            <div className={`${narrativeCard} border-[var(--color-accent)]/25`}>
              <h3
                className="text-xl font-bold text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-heading, inherit)' }}
              >
                Problem
              </h3>
              <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed whitespace-pre-line">
                {project.problem}
              </p>
            </div>
          )}

          {hasSolution && (
            <div className={`${narrativeCard} border-[var(--color-primary)]/25`}>
              <h3
                className="text-xl font-bold text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-heading, inherit)' }}
              >
                Solution
              </h3>
              <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed whitespace-pre-line">
                {project.solution}
              </p>
            </div>
          )}
        </div>
      )}

      {(hasChallenges || hasResults) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hasChallenges && (
            <div className={narrativeCard}>
              <h3
                className="text-xl font-bold text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-heading, inherit)' }}
              >
                Challenges
              </h3>
              <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed whitespace-pre-line">
                {project.challenges}
              </p>
            </div>
          )}

          {hasResults && (
            <div className={narrativeCard}>
              <h3
                className="text-xl font-bold text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-heading, inherit)' }}
              >
                Results
              </h3>
              <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed whitespace-pre-line">
                {project.results}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
