import React from 'react';

interface ProjectSectionHeadingProps {
  children: React.ReactNode;
  description?: string;
}

// Shared case-study section title using theme heading tokens.
export function ProjectSectionHeading({ children, description }: ProjectSectionHeadingProps) {
  return (
    <div className="space-y-2">
      <h2
        className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        {children}
      </h2>
      {description ? (
        <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-3xl">{description}</p>
      ) : null}
    </div>
  );
}
