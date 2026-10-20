'use client';

import React from 'react';
import { useThemeRuntime } from '@/context/theme-runtime';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useIntroExperience } from '@/hooks/use-intro-experience';
import { IntroPageConfig } from '@/types/public.types';
import { LoadingScreen } from './loading-screen';
import { IntroBackground } from './intro-background';
import { IntroDecoration } from './intro-decoration';
import { IntroContent } from './intro-content';
import { IntroTransition } from './intro-transition';

interface IntroScreenProps {
  children: React.ReactNode;
  introConfig?: IntroPageConfig | null;
}

// Master component managing entry loading, creative intro screen, and seamless transition to home content.
export const IntroScreen: React.FC<IntroScreenProps> = ({ children, introConfig }) => {
  const { isLoading: isThemeLoading } = useThemeRuntime();
  const isReducedMotion = useReducedMotion();

  const { state, handleExploreClick } = useIntroExperience({
    isThemeLoading,
    isReducedMotion,
    introConfig,
  });

  // When state reaches 'home', render actual Home page layout content
  if (state === 'home') {
    return <>{children}</>;
  }

  // Render initial minimal loading screen while theme/app is preparing
  if (state === 'loading') {
    return (
      <LoadingScreen
        isReducedMotion={isReducedMotion}
        loadingText={introConfig?.loadingText}
      />
    );
  }

  // Render creative intro experience screen (intro or entering states)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen overflow-hidden bg-[var(--color-background,#0f172a)] text-[var(--color-text,#f8fafc)] select-none">
      <IntroBackground />
      <IntroDecoration isReducedMotion={isReducedMotion} />
      <IntroContent
        onExploreClick={handleExploreClick}
        isEntering={state === 'entering'}
        isReducedMotion={isReducedMotion}
        introConfig={introConfig}
      />
      <IntroTransition isEntering={state === 'entering'} isReducedMotion={isReducedMotion} />
    </div>
  );
};
