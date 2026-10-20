import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Experience } from '@/types/public.types';

interface ExperienceCardProps {
  experience: Experience;
  className?: string;
}

// Professional role card with dates, responsibilities, achievements, and tech tags.
export function ExperienceCard({ experience, className = '' }: ExperienceCardProps) {
  const hasResponsibilities = Array.isArray(experience.responsibilities) && experience.responsibilities.length > 0;
  const hasTechnologies = Array.isArray(experience.technologies) && experience.technologies.length > 0;
  const hasAchievements = Array.isArray(experience.achievements) && experience.achievements.length > 0;
  const displayEndDate = experience.isCurrent ? 'Present' : experience.endDate || 'Present';

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-6 sm:p-8 space-y-5 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className="text-xl md:text-2xl font-bold text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-heading, inherit)' }}
            >
              {experience.role}
            </h3>
            {experience.isCurrent && (
              <span className="inline-flex items-center rounded-full border border-[var(--color-primary)]/35 bg-[var(--color-primary)]/12 px-2.5 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                Current
              </span>
            )}
          </div>
          <p className="text-base font-semibold text-[var(--color-primary)]">{experience.company}</p>
          <div className="flex flex-wrap items-center gap-2">
            {experience.employmentType && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-tag border border-[var(--color-border)] text-[var(--color-muted)]">
                {experience.employmentType}
              </span>
            )}
            {experience.location && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)]">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {experience.location}
              </span>
            )}
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] shrink-0">
          <Calendar className="h-4 w-4" aria-hidden />
          <span>
            {experience.startDate} — {displayEndDate}
          </span>
        </div>
      </div>

      {experience.description && (
        <p className="text-[var(--color-muted)] text-sm sm:text-base leading-relaxed">{experience.description}</p>
      )}

      {hasResponsibilities && (
        <div className="space-y-2">
          <h4
            className="text-sm font-semibold text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            Responsibilities
          </h4>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            {experience.responsibilities.map((resp, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                <span className="leading-relaxed">{resp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasAchievements && (
        <div className="space-y-2 rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/8 p-4 sm:p-5">
          <h4
            className="text-sm font-semibold text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            Achievements
          </h4>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            {experience.achievements.map((ach, idx) => (
              <li key={idx} className="leading-relaxed">
                {ach}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasTechnologies && (
        <div className="flex flex-wrap gap-2 pt-1">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-lg text-[11px] font-tag bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
