'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IntroPageConfig } from '@/types/public.types';
import { IntroBackground } from './intro-background';
import { IntroDecoration } from './intro-decoration';
import { IntroContent } from './intro-content';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useIntroExperience } from '@/hooks/use-intro-experience';

interface IntroStandaloneViewProps {
  introConfig: IntroPageConfig | null;
}

export const IntroStandaloneView: React.FC<IntroStandaloneViewProps> = ({ introConfig }) => {
  const router = useRouter();
  const isReducedMotion = useReducedMotion();

  const { state, handleExploreClick } = useIntroExperience({
    isThemeLoading: false,
    isReducedMotion,
    introConfig,
  });

  const targetUrl = introConfig?.exploreButtonTarget || introConfig?.redirectTarget || '/';

  // Handle redirect if disabled or when experience transitions to home
  useEffect(() => {
    if (introConfig?.enabled === false || state === 'home') {
      router.push(targetUrl);
    }
  }, [introConfig?.enabled, state, router, targetUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen overflow-hidden bg-[var(--color-background,#0f172a)] text-[var(--color-text,#f8fafc)] select-none">
      <IntroBackground />
      <IntroDecoration isReducedMotion={isReducedMotion} />
      <IntroContent
        onExploreClick={() => {
          handleExploreClick();
          // Fallback navigation if state transition completes or immediately
          setTimeout(() => {
            router.push(targetUrl);
          }, 650);
        }}
        isEntering={state === 'entering'}
        isReducedMotion={isReducedMotion}
        introConfig={introConfig}
      />
    </div>
  );
};
