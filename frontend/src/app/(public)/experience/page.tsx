import React from 'react';
import { publicApi } from '@/services/api/public-api';
import { PublicSection } from '@/components/public/public-section';
import { PublicError } from '@/components/public/public-error';
import { PublicEmptyState } from '@/components/public/public-empty-state';
import { ExperienceHero } from '@/components/public/experience/experience-hero';
import { ExperienceTimeline } from '@/components/public/experience/experience-timeline';
import { EducationSection } from '@/components/public/education/education-section';
import { generatePublicMetadata } from '@/utils/seo.utils';
import { Experience, Education } from '@/types/public.types';

export async function generateMetadata() {
  try {
    const page = await publicApi.getExperiencePage();
    return generatePublicMetadata({
      titleOverride: page.seo?.title || page.title || 'Career Experience & Education',
      descriptionOverride:
        page.seo?.description ||
        page.subtitle ||
        'Explore professional engineering roles and education history.',
      canonicalPath: '/experience',
    });
  } catch {
    return generatePublicMetadata({
      titleOverride: 'Career Experience & Education',
      descriptionOverride: 'Explore professional engineering roles and education history.',
      canonicalPath: '/experience',
    });
  }
}

// Server component fetching experience/education catalogs plus CMS page chrome.
export default async function PublicExperiencePage() {
  let experiencesRaw: Experience[] = [];
  let educationRaw: Education[] = [];
  let pageTitle = 'Professional Experience & Education';
  let pageSubtitle =
    'A timeline of software engineering roles, technical leadership positions, cloud infrastructure projects, and formal academic background.';
  let educationSectionTitle = 'Education & Certifications';
  let educationSectionSubtitle =
    'Academic degrees, specialized technical research, and computational certifications.';
  let errorMessage: string | null = null;

  try {
    const [expRes, eduRes, pageConfig] = await Promise.all([
      publicApi.getExperience().catch(() => []),
      publicApi.getEducation().catch(() => []),
      publicApi.getExperiencePage().catch(() => null),
    ]);

    experiencesRaw = expRes;
    educationRaw = eduRes;
    if (pageConfig?.title) pageTitle = pageConfig.title;
    if (pageConfig?.subtitle) pageSubtitle = pageConfig.subtitle;
    if (pageConfig?.educationSectionTitle) educationSectionTitle = pageConfig.educationSectionTitle;
    if (pageConfig?.educationSectionSubtitle) {
      educationSectionSubtitle = pageConfig.educationSectionSubtitle;
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unable to load experience timeline.';
  }

  if (errorMessage) {
    return (
      <PublicSection className="py-16">
        <PublicError title="Experience Timeline Unavailable" message={errorMessage} />
      </PublicSection>
    );
  }

  const visibleExperiences = experiencesRaw
    .filter((exp) => exp.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const visibleEducation = educationRaw
    .filter((edu) => edu.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <PublicSection className="py-12 md:py-16">
      <div className="relative max-w-6xl mx-auto space-y-12 md:space-y-16">
        <div className="pointer-events-none absolute -top-20 left-0 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />

        <ExperienceHero title={pageTitle} subtitle={pageSubtitle} />

        <section className="relative space-y-6">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-heading, inherit)' }}
          >
            Experience
          </h2>

          {visibleExperiences.length > 0 ? (
            <ExperienceTimeline experiences={visibleExperiences} />
          ) : (
            <PublicEmptyState
              title="No Career Experience Listed"
              description="Professional experience records will appear here once published."
            />
          )}
        </section>

        <EducationSection
          education={visibleEducation}
          sectionTitle={educationSectionTitle}
          sectionSubtitle={educationSectionSubtitle}
        />
      </div>
    </PublicSection>
  );
}
