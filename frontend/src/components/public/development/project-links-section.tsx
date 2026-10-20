import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '@/types/public.types';
import { PublicButton } from '../public-button';
import { ProjectSectionHeading } from './project-section-heading';

interface ProjectLinksSectionProps {
  project: Project;
  className?: string;
}

// Visible external project links (demo, GitHub, docs).
export const ProjectLinksSection: React.FC<ProjectLinksSectionProps> = ({
  project,
  className = '',
}) => {
  const links = (project.links || []).filter((l) => l.isVisible && l.url?.trim());

  if (links.length === 0) {
    return null;
  }

  return (
    <section
      className={`p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] space-y-5 ${className}`}
    >
      <ProjectSectionHeading>Links</ProjectSectionHeading>

      <div className="flex flex-wrap items-center gap-3">
        {links.map((link) => (
          <PublicButton
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            variant={link.type === 'demo' ? 'solid' : 'outline'}
            size="md"
          >
            {link.label}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </PublicButton>
        ))}
      </div>
    </section>
  );
};
