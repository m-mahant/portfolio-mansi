import React from 'react';
import { Education } from '@/types/public.types';
import { EducationTimeline } from './education-timeline';

interface EducationSectionProps {
  education: Education[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  className?: string;
}

// Education block with CMS heading; omitted when no visible records exist.
export function EducationSection({
  education,
  sectionTitle = 'Education & Certifications',
  sectionSubtitle = 'Academic degrees, specialized technical research, and computational certifications.',
  className = '',
}: EducationSectionProps) {
  const visibleEducation = education.filter((item) => item.isVisible);

  if (visibleEducation.length === 0) {
    return null;
  }

  return (
    <section className={`space-y-6 ${className}`} id="education">
      <div className="space-y-2 max-w-3xl">
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-heading, inherit)' }}
        >
          {sectionTitle}
        </h2>
        {sectionSubtitle ? (
          <p className="text-[var(--color-muted)] text-sm sm:text-base leading-relaxed">{sectionSubtitle}</p>
        ) : null}
      </div>

      <EducationTimeline education={visibleEducation} />
    </section>
  );
}
