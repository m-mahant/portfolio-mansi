'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { IntroPageConfig } from '@/types/public.types';

export type IntroState = 'loading' | 'intro' | 'entering' | 'home';

const SESSION_STORAGE_KEY = 'dev_digital_intro_seen';
const MAX_LOADING_SAFETY_TIMEOUT_MS = 1500;
const TRANSITION_DURATION_MS = 600;

interface UseIntroExperienceOptions {
  isThemeLoading: boolean;
  isReducedMotion?: boolean;
  introConfig?: IntroPageConfig | null;
}

interface UseIntroExperienceReturn {
  state: IntroState;
  handleExploreClick: () => void;
  replayIntro: () => void;
  isIntroActive: boolean;
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
  };
}

function setStoredIntroStatus(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
  } catch {
    // Ignore storage quota or access errors
  }
}

// Manages the state transition lifecycle for the public entry experience from loading to home.
export function useIntroExperience({
  isThemeLoading,
  isReducedMotion = false,
  introConfig,
}: UseIntroExperienceOptions): UseIntroExperienceReturn {
  const hasSeenIntro = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [internalState, setInternalState] = useState<IntroState>('loading');

  // Compute effective state taking CMS config (enabled, showOnInitialVisit) into account
  const isEnabled = introConfig?.enabled !== false;
  const respectSessionStorage = introConfig?.showOnInitialVisit !== false;

  const shouldSkipToHome = !isEnabled || (respectSessionStorage && hasSeenIntro);
  const state: IntroState = shouldSkipToHome ? 'home' : internalState;

  // Handle theme loading safety timer and transition from loading to intro
  useEffect(() => {
    if (shouldSkipToHome) return;

    const delay = isThemeLoading ? MAX_LOADING_SAFETY_TIMEOUT_MS : 0;
    const timer = setTimeout(() => {
      setInternalState((prev) => (prev === 'loading' ? 'intro' : prev));
    }, delay);

    return () => clearTimeout(timer);
  }, [isThemeLoading, shouldSkipToHome]);

  // Triggers transition from intro screen into main home page layout.
  const handleExploreClick = useCallback(() => {
    if (state !== 'intro') return;

    setInternalState('entering');

    const duration = isReducedMotion ? 0 : TRANSITION_DURATION_MS;
    const timer = setTimeout(() => {
      setStoredIntroStatus();
      setInternalState('home');
    }, duration);

    return () => clearTimeout(timer);
  }, [state, isReducedMotion]);

  // Auto redirect timer if configured in CMS
  useEffect(() => {
    if (state !== 'intro') return;
    if (!introConfig?.autoRedirect) return;

    const delay = introConfig.autoRedirectDelay || 5000;
    const autoRedirectTimer = setTimeout(() => {
      handleExploreClick();
    }, delay);

    return () => clearTimeout(autoRedirectTimer);
  }, [state, introConfig?.autoRedirect, introConfig?.autoRedirectDelay, handleExploreClick]);

  // Allows manual replay of the intro experience.
  const replayIntro = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
    setInternalState('intro');
  }, []);

  const isIntroActive = state === 'loading' || state === 'intro' || state === 'entering';

  return {
    state,
    handleExploreClick,
    replayIntro,
    isIntroActive,
  };
}
