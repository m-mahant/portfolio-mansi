'use client';

// Typography font selection component supporting approved Google Fonts catalog with single font selector and live sample preview.

import React, { useEffect } from 'react';
import {
  APPROVED_FONT_CATALOG,
  loadGoogleFont,
  getSafeFontStack,
  isApprovedFont,
} from '@/utils/font-registry';

interface FontSelectorProps {
  label: string;
  description?: string;
  value: string;
  onChange: (font: string) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  label,
  description,
  value,
  onChange,
}) => {
  useEffect(() => {
    if (value && isApprovedFont(value)) {
      loadGoogleFont(value);
    }
  }, [value]);

  const safeFontFamily = getSafeFontStack(value, 'Cinzel');

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1">
          <label className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider block">
            {label}
          </label>
          {description && (
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1 leading-relaxed">{description}</p>
          )}
        </div>

        {/* Single Canonical Font Selector */}
        <select
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            loadGoogleFont(e.target.value);
          }}
          className="w-full sm:w-auto min-w-[220px] px-3 py-1.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg text-xs font-medium text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
        >
          {APPROVED_FONT_CATALOG.map((font) => (
            <option key={font.id} value={font.name}>
              {font.name} ({font.category})
            </option>
          ))}
        </select>
      </div>

      {/* Visual Sample Text Preview Box */}
      <div className="p-3.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] space-y-1.5 transition-all">
        <div className="flex items-center justify-between text-[10px] text-[var(--color-text-muted)] font-mono">
          <span>SAMPLE PREVIEW — {value}</span>
          <span>{safeFontFamily}</span>
        </div>
        <p
          className="text-base text-[var(--color-text)] leading-snug"
          style={{ fontFamily: safeFontFamily }}
        >
          Where Logic Meets Imagination
        </p>
        <p
          className="text-xs text-[var(--color-text-muted)]"
          style={{ fontFamily: safeFontFamily }}
        >
          The quick brown fox jumps over the lazy dog. 1234567890
        </p>
      </div>
    </div>
  );
};
