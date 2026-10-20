'use client';

// Modern pill-shaped Liquid Glass Light/Dark sliding toggle switch.

import React from 'react';
import { useThemeRuntime } from '@/context/theme-runtime';

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const { activeMode, toggleThemeMode } = useThemeRuntime();

  const isDark = activeMode === 'dark';
  const targetLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleThemeMode}
      aria-label={targetLabel}
      title={targetLabel}
      className={`relative inline-flex items-center w-14 h-8 p-1 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-inner transition-colors duration-300 hover:border-[var(--color-primary)]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] select-none cursor-pointer ${className}`}
    >
      {/* Track Icons */}
      <span className="absolute left-1.5 text-xs transition-opacity duration-200 opacity-70">
        ☀️
      </span>
      <span className="absolute right-1.5 text-xs transition-opacity duration-200 opacity-70">
        🌙
      </span>

      {/* Sliding Thumb */}
      <span
        className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-primary)] text-white shadow-md transition-transform duration-300 ease-spring ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        <span className="text-[11px] leading-none transform transition-transform duration-300">
          {isDark ? '🌙' : '☀️'}
        </span>
      </span>
    </button>
  );
};
