import React from 'react';
import { publicApi } from '@/services/api/public-api';
import { Project } from '@/types/public.types';
import { PublicSection } from '@/components/public/public-section';
import { PublicError } from '@/components/public/public-error';
import { FeaturedProject } from '@/components/public/development/featured-project';
import { ProjectGrid } from '@/components/public/development/project-grid';
import { generatePublicMetadata } from '@/utils/seo.utils';

export async function generateMetadata() {
  try {
    const page = await publicApi.getDevelopmentPage();
    return generatePublicMetadata({
      seo: page.seo,
      titleOverride: page.seo?.title || page.title || 'Software Development Portfolio',
      descriptionOverride:
        page.seo?.description ||
        page.subtitle ||
        'Explore technical case studies, full-stack web applications, and backend architecture.',
      canonicalPath: '/work/development',
    });
  } catch {
    return generatePublicMetadata({
      titleOverride: 'Software Development Portfolio',
      descriptionOverride:
        'Explore technical case studies, full-stack web applications, and backend architecture.',
      canonicalPath: '/work/development',
    });
  }
}

// Renders the public Software Development portfolio listing page with CMS-driven header.
export default async function PublicDevelopmentPage() {
  let projects: Project[] = [];
  let pageTitle = 'Software Development Portfolio';
  let pageSubtitle =
    'Explore software engineering case studies, full-stack architectures, API systems, and production implementations.';
  let fetchFailed = false;

  try {
    const [paginatedProjects, pageConfig] = await Promise.all([
      publicApi.getProjects({ limit: 50 }),
      publicApi.getDevelopmentPage().catch(() => null),
    ]);
    projects = paginatedProjects.items || [];
    if (pageConfig?.title) pageTitle = pageConfig.title;
    if (pageConfig?.subtitle) pageSubtitle = pageConfig.subtitle;
  } catch {
    fetchFailed = true;
  }

  if (fetchFailed) {
    return (
      <PublicSection className="py-16">
        <PublicError
          title="Unable to Load Portfolio Projects"
          message="We encountered an issue connecting to the project database. Please refresh or try again later."
        />
      </PublicSection>
    );
  }

  const primaryFeaturedProject = projects.find((p) => p.isFeatured);

  return (
    <PublicSection className="py-12 md:py-16">
      <div className="relative max-w-6xl mx-auto space-y-10 sm:space-y-12">
        <div className="pointer-events-none absolute -top-20 left-0 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />

        <header className="relative max-w-3xl space-y-3">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.1]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            {pageTitle}
          </h1>
          <p className="text-[var(--color-muted)] text-base sm:text-lg leading-relaxed">{pageSubtitle}</p>
        </header>

        {primaryFeaturedProject && <FeaturedProject project={primaryFeaturedProject} />}

        <div className="relative space-y-6">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            Projects
          </h2>
          <ProjectGrid projects={projects} />
        </div>
      </div>
    </PublicSection>
  );
}
