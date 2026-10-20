import React from 'react';
import { Education } from '@/types/public.types';
import { EducationCard } from './education-card';

interface EducationTimelineProps {
  education: Education[];
  className?: string;
}

// Vertical list of education records with an accent timeline axis on desktop.
export function EducationTimeline({ education, className = '' }: EducationTimelineProps) {
  if (education.length === 0) {
    return null;
  }

  return (
    <div className={`relative space-y-6 md:space-y-8 ${className}`}>
      <div className="hidden md:block absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent)]/30 to-transparent" />

      {education.map((item, idx) => (
        <div key={item.id || idx} className="relative md:pl-16">
          <div className="hidden md:block absolute left-8 top-8 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-background)]" />
          <EducationCard education={item} />
        </div>
      ))}
    </div>
  );
}
