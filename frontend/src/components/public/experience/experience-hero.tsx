import React from 'react';

interface ExperienceHeroProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

// Page header for Experience & Education using CMS title and subtitle.
export function ExperienceHero({
  title = 'Professional Experience & Education',
  subtitle = 'A timeline of software engineering roles, technical leadership positions, cloud infrastructure projects, and formal academic background.',
  className = '',
}: ExperienceHeroProps) {
  return (
    <header className={`relative max-w-3xl space-y-3 ${className}`}>
      <h1
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.1]"
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        {title}
      </h1>
      {subtitle ? (
        <p className="text-[var(--color-muted)] text-base sm:text-lg leading-relaxed">{subtitle}</p>
      ) : null}
    </header>
  );
}
