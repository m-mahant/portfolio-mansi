'use client';

import React, { useState, useMemo } from 'react';
import { Project } from '@/types/public.types';
import { ProjectCard } from './project-card';
import { ProjectFilter } from './project-filter';
import { PublicEmptyState } from '../public-empty-state';

interface ProjectGridProps {
  projects: Project[];
  className?: string;
}

// Renders a responsive grid of project cards with interactive technology and keyword filtering.
export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, className = '' }) => {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique technology tags across all published projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((p) => {
      p.technologies?.forEach((t) => techSet.add(t));
    });
    return Array.from(techSet).slice(0, 8);
  }, [projects]);

  // Compute filtered project list based on selected filter controls
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Featured filter check
      if (showFeaturedOnly && !p.isFeatured) return false;

      // Technology filter check
      if (selectedTech && !p.technologies?.includes(selectedTech)) return false;

      // Search keyword filter check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = p.title.toLowerCase().includes(query);
        const descMatch = p.shortDescription.toLowerCase().includes(query);
        const techMatch = p.technologies?.some((t) => t.toLowerCase().includes(query));
        const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(query));
        if (!titleMatch && !descMatch && !techMatch && !tagMatch) return false;
      }

      return true;
    });
  }, [projects, selectedTech, showFeaturedOnly, searchQuery]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filter Controls Bar */}
      {projects.length > 0 && (
        <ProjectFilter
          technologies={allTechnologies}
          selectedTech={selectedTech}
          onSelectTech={setSelectedTech}
          showFeaturedOnly={showFeaturedOnly}
          onToggleFeatured={setShowFeaturedOnly}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          projectCount={projects.length}
        />
      )}

      {/* Projects Grid or Empty State */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id || project.slug} project={project} />
          ))}
        </div>
      ) : (
        <PublicEmptyState
          title="No Matching Software Projects"
          description={
            projects.length === 0
              ? 'No published development projects are currently available.'
              : 'No projects match your selected filter criteria. Try clearing search or technology tags.'
          }
        />
      )}
    </div>
  );
};
