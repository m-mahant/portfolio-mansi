import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Education } from '@/types/public.types';

interface EducationCardProps {
  education: Education;
  className?: string;
}

// Academic degree or certification card; empty optional fields stay hidden.
export function EducationCard({ education, className = '' }: EducationCardProps) {
  const hasAchievements = Array.isArray(education.achievements) && education.achievements.length > 0;
  const dateText = education.endDate ? `${education.startDate} — ${education.endDate}` : education.startDate;

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-6 sm:p-8 space-y-4 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h3
            className="text-xl font-bold text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            {education.degree}
            {education.field ? ` in ${education.field}` : ''}
          </h3>
          <p className="text-base font-semibold text-[var(--color-accent)]">{education.institution}</p>
        </div>

        {dateText && (
          <div className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] shrink-0">
            <GraduationCap className="h-4 w-4" aria-hidden />
            <span>{dateText}</span>
          </div>
        )}
      </div>

      {education.description && (
        <p className="text-[var(--color-muted)] text-sm sm:text-base leading-relaxed">{education.description}</p>
      )}

      {hasAchievements && (
        <div className="space-y-2">
          <h4
            className="text-sm font-semibold text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            Highlights
          </h4>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            {education.achievements.map((ach, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                <span className="leading-relaxed">{ach}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
