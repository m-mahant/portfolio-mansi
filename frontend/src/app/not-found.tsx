import React from 'react';
import { PublicSection } from '@/components/public/public-section';
import { PublicHeading } from '@/components/public/public-heading';
import { PublicButton } from '@/components/public/public-button';

// Renders the global 404 Page Not Found error view.
export default function NotFoundPage() {
  return (
    <PublicSection surface="dark" className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center gap-6 max-w-md mx-auto">
        <div className="text-6xl font-mono font-extrabold text-indigo-400">404</div>
        <PublicHeading align="center" level={2} subtitle="The page or gallery item you are looking for could not be found.">
          Page Not Found
        </PublicHeading>
        <PublicButton href="/" variant="solid">
          Return to Home
        </PublicButton>
      </div>
    </PublicSection>
  );
}
