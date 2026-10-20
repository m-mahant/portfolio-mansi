'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface ProjectFilterProps {
  technologies: string[];
  selectedTech: string | null;
  onSelectTech: (tech: string | null) => void;
  showFeaturedOnly: boolean;
  onToggleFeatured: (featured: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  projectCount: number;
}

const pillClass = (active: boolean) =>
  `px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
    active
      ? 'bg-[var(--color-primary)] text-white shadow-sm'
      : 'bg-[var(--color-background)]/40 text-[var(--color-muted)] border border-[var(--color-border)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)]/40'
  }`;

// Filter bar for technology tags, featured toggle, and keyword search.
export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  technologies,
  selectedTech,
  onSelectTech,
  showFeaturedOnly,
  onToggleFeatured,
  searchQuery,
  onSearchChange,
  projectCount,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50">
      <div className="relative w-full md:max-w-sm">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]"
          aria-hidden
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects or tech..."
          className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/60 py-2.5 pl-10 pr-3 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)]/70 focus:outline-none focus:border-[var(--color-primary)]/70"
          aria-label="Filter projects by keyword"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            onSelectTech(null);
            onToggleFeatured(false);
          }}
          className={pillClass(selectedTech === null && !showFeaturedOnly)}
        >
          All ({projectCount})
        </button>

        <button
          type="button"
          onClick={() => {
            onToggleFeatured(!showFeaturedOnly);
            onSelectTech(null);
          }}
          className={pillClass(showFeaturedOnly)}
        >
          Featured
        </button>

        {technologies.map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => {
              onSelectTech(selectedTech === tech ? null : tech);
              onToggleFeatured(false);
            }}
            className={pillClass(selectedTech === tech)}
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  );
};
