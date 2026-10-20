import React from 'react';
import { Experience } from '@/types/public.types';
import { ExperienceCard } from './experience-card';

interface ExperienceTimelineProps {
  experiences: Experience[];
  className?: string;
}

// Vertical timeline of professional roles with a theme-colored axis on desktop.
export function ExperienceTimeline({ experiences, className = '' }: ExperienceTimelineProps) {
  if (experiences.length === 0) {
    return null;
  }

  return (
    <div className={`relative space-y-6 md:space-y-8 ${className}`}>
      <div className="hidden md:block absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)]/30 to-transparent" />

      {experiences.map((exp, idx) => (
        <div key={exp.id || idx} className="relative md:pl-16">
          <div className="hidden md:block absolute left-8 top-8 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-background)]" />
          <ExperienceCard experience={exp} />
        </div>
      ))}
    </div>
  );
}
