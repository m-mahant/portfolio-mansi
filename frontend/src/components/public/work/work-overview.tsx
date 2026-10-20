import React from 'react';
import { Code2, Palette } from 'lucide-react';
import { WorkPageConfig } from '@/types/public.types';
import { WorkPathCard } from './work-path-card';

interface WorkOverviewProps {
  config?: WorkPageConfig | null;
}

// Editorial Work landing: CMS copy plus two equal destination cards for Development and Art.
export function WorkOverview({ config }: WorkOverviewProps) {
  const title = config?.title || 'Work Overview';
  const subtitle =
    config?.subtitle || 'Select a discipline to view published projects and creative artwork.';
  const description = config?.description;
  const devTitle = config?.devTitle || 'Development';
  const devDescription =
    config?.devDescription ||
    'Full-stack web engineering, cloud architecture diagrams, API specs, and technical case studies.';
  const artTitle = config?.artTitle || 'Art & Crafts';
  const artDescription =
    config?.artDescription ||
    'Digital illustrations, 3D modeling, creative media, and artistic process documentation.';

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="pointer-events-none absolute -top-20 left-0 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-24 right-0 h-64 w-64 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

      <div className="relative space-y-10 sm:space-y-12">
        <header className="max-w-2xl space-y-3">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.1]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            {title}
          </h1>
          <p className="text-[var(--color-muted)] text-base sm:text-lg leading-relaxed">{subtitle}</p>
          {description && description !== subtitle && (
            <p className="text-[var(--color-muted)] text-sm sm:text-base leading-relaxed">{description}</p>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          <WorkPathCard
            title={devTitle}
            description={devDescription}
            href="/work/development"
            icon={Code2}
            tone="primary"
          />
          <WorkPathCard
            title={artTitle}
            description={artDescription}
            href="/work/art-crafts"
            icon={Palette}
            tone="accent"
          />
        </div>
      </div>
    </div>
  );
}
