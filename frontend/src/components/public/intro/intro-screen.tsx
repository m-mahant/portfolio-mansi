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
  const showOverlay = state !== 'home';
  return (
    <>
      <div inert={showOverlay}>{children}</div>
      {state === 'loading' && (
        <LoadingScreen
          isReducedMotion={isReducedMotion}
          loadingText={introConfig?.loadingText}
        />
      )}
      {(state === 'intro' || state === 'entering') && (
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
      )}
    </>
  );
};
