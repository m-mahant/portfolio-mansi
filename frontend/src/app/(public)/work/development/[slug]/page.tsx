import React from 'react';
import { notFound } from 'next/navigation';
import { publicApi } from '@/services/api/public-api';
import { PublicSection } from '@/components/public/public-section';
import { generatePublicMetadata } from '@/utils/seo.utils';
import { ProjectHero } from '@/components/public/development/project-hero';
import { ProjectOverviewSection } from '@/components/public/development/project-overview-section';
import { ProjectFeaturesSection } from '@/components/public/development/project-features-section';
import { ProjectArchitectureSection } from '@/components/public/development/project-architecture-section';
import { ProjectWorkflowSection } from '@/components/public/development/project-workflow-section';
import { ProjectApiFlowSection } from '@/components/public/development/project-api-flow-section';
import { ProjectPerformanceSection } from '@/components/public/development/project-performance-section';
import { ProjectGallerySection } from '@/components/public/development/project-gallery-section';
import { ProjectLinksSection } from '@/components/public/development/project-links-section';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generates dynamic SEO metadata for project case study pages using backend project SEO properties.
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const project = await publicApi.getProjectBySlug(slug);
    return generatePublicMetadata({
      seo: project.seo,
      titleOverride: `${project.title} — Technical Case Study`,
      descriptionOverride: project.shortDescription,
      canonicalPath: `/work/development/${project.slug}`,
      ogType: 'article',
    });
  } catch {
    return generatePublicMetadata({
      titleOverride: 'Project Not Found',
    });
  }
}

// Renders the complete technical case study detail page for a specific software development project.
export default async function PublicProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let project;

  try {
    project = await publicApi.getProjectBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <article className="min-h-screen">
      <PublicSection className="py-12 md:py-16">
        <div className="relative max-w-6xl mx-auto space-y-12 md:space-y-16">
          <div className="pointer-events-none absolute -top-20 left-0 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />

          <ProjectHero project={project} />
          <ProjectOverviewSection project={project} />
          <ProjectFeaturesSection project={project} />
          <ProjectArchitectureSection project={project} />
          <ProjectWorkflowSection project={project} />
          <ProjectApiFlowSection project={project} />
          <ProjectPerformanceSection project={project} />
          <ProjectGallerySection project={project} />
          <ProjectLinksSection project={project} />
        </div>
      </PublicSection>
    </article>
  );
}
