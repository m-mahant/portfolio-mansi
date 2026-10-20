'use client';

// Color picker input component supporting HEX format validation and native color picker synchronization.

import React from 'react';

interface ColorPickerProps {
  label: string;
  description?: string;
  value: string;
  onChange: (color: string) => void;
}

// Validates whether a given string is a valid 6-character hex color code.
const isValidHex = (hex: string): boolean => /^#([A-Fa-f0-9]{6})$/.test(hex);

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  description,
  value,
  onChange,
}) => {
  const safeHex = isValidHex(value) ? value : '#000000';

  // Handles text input changes with automatic '#' prefixing.
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.trim();
    if (!input.startsWith('#')) {
      input = `#${input}`;
    }
    onChange(input);
  };

  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--color-text)]">{label}</label>
        <div className="flex items-center gap-2">
          {/* Color preview swatch and native picker input */}
          <div
            className="w-7 h-7 rounded-md border border-[var(--color-border)] shadow-inner relative overflow-hidden cursor-pointer"
            style={{ backgroundColor: safeHex }}
          >
            <input
              type="color"
              value={safeHex}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              aria-label={`Select color for ${label}`}
            />
          </div>
          {/* Hex code text input */}
          <input
            type="text"
            value={value}
            onChange={handleTextChange}
            placeholder="#000000"
            className="w-24 px-2 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded text-xs font-mono text-[var(--color-text)] uppercase focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>
      {description && <p className="text-[11px] text-[var(--color-text-muted)]">{description}</p>}
    </div>
  );
};
