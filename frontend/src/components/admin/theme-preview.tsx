'use client';

// Interactive live dual-mode theme preview component visualizing ThemeSettings tokens in real-time for both Light and Dark modes.

import React, { useEffect, useState } from 'react';
import { ThemeSettings, ThemeColors } from '@/types/admin.types';
import { loadGoogleFont, getSafeFontStack } from '@/utils/font-registry';
import { DEFAULT_LIGHT_COLORS, DEFAULT_DARK_COLORS } from '@/context/theme-runtime';

interface ThemePreviewProps {
  theme: ThemeSettings;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  const [viewMode, setViewMode] = useState<'split' | 'dark' | 'light'>('split');
  const { fonts, styles } = theme;

  const darkPalette: ThemeColors = theme.darkColors || theme.colors || DEFAULT_DARK_COLORS;
  const lightPalette: ThemeColors = theme.lightColors || DEFAULT_LIGHT_COLORS;

  // Load Google Fonts for all 10 semantic typography roles
  useEffect(() => {
    loadGoogleFont(fonts.headingFont);
    loadGoogleFont(fonts.bodyFont);
    loadGoogleFont(fonts.accentFont);
    loadGoogleFont(fonts.buttonFont || 'Inter');
    loadGoogleFont(fonts.cardTitleFont || 'Cinzel');
    loadGoogleFont(fonts.cardSubtitleFont || 'Inter');
    loadGoogleFont(fonts.cardDescriptionFont || 'Inter');
    loadGoogleFont(fonts.tagFont || 'Fira Code');
    loadGoogleFont(fonts.navigationFont || 'Inter');
    loadGoogleFont(fonts.monoFont || 'Fira Code');
  }, [fonts]);

  const renderPreviewPane = (modeLabel: string, colors: ThemeColors, isDark: boolean) => {
    const cardBg = styles.cardStyle === 'glassmorphism'
      ? `${colors.surface}${isDark ? '90' : 'cc'}`
      : colors.surface;

    const cardBorder = styles.cardStyle === 'bordered'
      ? `2px solid ${colors.primary}`
      : `1px solid ${colors.border}`;

    return (
      <div
        className="flex-1 p-4 overflow-y-auto space-y-4 transition-all duration-300 flex flex-col justify-between"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          fontFamily: getSafeFontStack(fonts.bodyFont, 'sans-serif'),
        }}
      >
        <div className="space-y-4">
          {/* Header & Navigation */}
          <header
            className="p-3 rounded-lg flex items-center justify-between shadow-sm"
            style={{
              backgroundColor: `${colors.surface}aa`,
              border: `1px solid ${colors.border}`,
              borderRadius: styles.borderRadius,
            }}
          >
            <div
              className="text-base font-bold"
              style={{
                fontFamily: getSafeFontStack(fonts.headingFont, 'serif'),
                color: colors.primary,
              }}
            >
              Portfolio
            </div>
            <nav
              className="flex items-center gap-3 text-xs font-medium"
              style={{
                fontFamily: getSafeFontStack(fonts.navigationFont || fonts.bodyFont, 'sans-serif'),
                color: colors.mutedText,
              }}
            >
              <span className="font-semibold" style={{ color: colors.text }}>Home</span>
              <span>Work</span>
              <span>About</span>
            </nav>
          </header>

          {/* Hero Accent Tag & Title */}
          <div className="space-y-2">
            <div
              className="inline-block px-2.5 py-0.5 text-xs rounded-full font-medium"
              style={{
                backgroundColor: `${colors.accent}20`,
                color: colors.accent,
                border: `1px solid ${colors.accent}40`,
                fontFamily: getSafeFontStack(fonts.accentFont, 'serif'),
              }}
            >
              ★ {modeLabel} Preview
            </div>

            <h2
              className="text-xl font-bold leading-tight"
              style={{
                fontFamily: getSafeFontStack(fonts.headingFont, 'serif'),
                color: colors.text,
              }}
            >
              Design & <span style={{ color: colors.primary }}>Engineering</span>
            </h2>

            <p
              className="text-xs leading-relaxed"
              style={{
                color: colors.mutedText,
                fontFamily: getSafeFontStack(fonts.bodyFont, 'sans-serif'),
              }}
            >
              Demonstrating semantic typography & color mode propagation.
            </p>
          </div>

          {/* Interactive Button */}
          <div>
            <button
              style={{
                backgroundColor: styles.buttonStyle === 'outline' ? 'transparent' : colors.primary,
                color: styles.buttonStyle === 'outline' ? colors.primary : '#ffffff',
                border: styles.buttonStyle === 'outline' ? `1.5px solid ${colors.primary}` : 'none',
                borderRadius: styles.borderRadius,
                fontFamily: getSafeFontStack(fonts.buttonFont || fonts.bodyFont, 'sans-serif'),
              }}
              className="px-3.5 py-1.5 text-xs font-semibold shadow transition-transform hover:scale-[1.02]"
            >
              Explore Work →
            </button>
          </div>

          {/* Card Preview showcasing Card Title, Subtitle, Description, Tag & Mono */}
          <div
            className="p-3.5 rounded-lg space-y-2.5 transition-all shadow-sm"
            style={{
              backgroundColor: cardBg,
              border: cardBorder,
              borderRadius: styles.borderRadius,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                  fontFamily: getSafeFontStack(fonts.tagFont || fonts.monoFont, 'monospace'),
                }}
              >
                React × Next.js
              </span>
              <span
                className="text-[10px] font-mono"
                style={{
                  color: colors.mutedText,
                  fontFamily: getSafeFontStack(fonts.monoFont, 'monospace'),
                }}
              >
                2026.09
              </span>
            </div>

            <h3
              className="text-sm font-bold"
              style={{
                fontFamily: getSafeFontStack(fonts.cardTitleFont || fonts.headingFont, 'serif'),
                color: colors.text,
              }}
            >
              Project Card Title
            </h3>

            <p
              className="text-[11px] font-medium"
              style={{
                color: colors.primary,
                fontFamily: getSafeFontStack(fonts.cardSubtitleFont || fonts.bodyFont, 'sans-serif'),
              }}
            >
              Full-Stack System Architecture
            </p>

            <p
              className="text-[11px] leading-relaxed line-clamp-2"
              style={{
                color: colors.mutedText,
                fontFamily: getSafeFontStack(fonts.cardDescriptionFont || fonts.bodyFont, 'sans-serif'),
              }}
            >
              Card description rendered using cardDescriptionFont semantic token.
            </p>
          </div>
        </div>

        {/* Footer Mode Indicator */}
        <div
          className="pt-2 border-t flex items-center justify-between text-[10px] font-mono"
          style={{
            borderColor: colors.border,
            color: colors.mutedText,
            fontFamily: getSafeFontStack(fonts.monoFont, 'monospace'),
          }}
        >
          <span>Dual Mode Live Preview</span>
          <span>{modeLabel}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-2xl">
      {/* Header bar with View Mode Switcher */}
      <div className="px-4 py-2.5 bg-[var(--color-background)]/80 border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-xs font-mono text-[var(--color-text)]">Live Dual Preview</span>
        </div>

        {/* Split / Light / Dark Toggle Buttons */}
        <div className="flex items-center gap-1 bg-[var(--color-surface)] p-1 rounded-lg border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-0.5 text-[11px] font-semibold rounded transition-colors ${
              viewMode === 'split'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setViewMode('light')}
            className={`px-2.5 py-0.5 text-[11px] font-semibold rounded transition-colors ${
              viewMode === 'light'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            ☀️ Light
          </button>
          <button
            type="button"
            onClick={() => setViewMode('dark')}
            className={`px-2.5 py-0.5 text-[11px] font-semibold rounded transition-colors ${
              viewMode === 'dark'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            🌙 Dark
          </button>
        </div>
      </div>

      {/* Preview Viewport Container */}
      <div className="flex-1 flex overflow-hidden divide-x divide-[var(--color-border)]">
        {(viewMode === 'split' || viewMode === 'light') &&
          renderPreviewPane('Light Mode', lightPalette, false)}
        {(viewMode === 'split' || viewMode === 'dark') &&
          renderPreviewPane('Dark Mode', darkPalette, true)}
      </div>
    </div>
  );
};
