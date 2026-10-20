"use client";

// Interactive Admin Theme Editor for customizing Color Palettes, semantic typography roles, UI style tokens, and animation settings.

import React, { useState } from "react";
import { ThemeSettings, ThemeColors } from "@/types/admin.types";
import { APPROVED_FONT_CATALOG } from "@/utils/font-registry";
import { DEFAULT_LIGHT_COLORS, DEFAULT_DARK_COLORS } from "@/context/theme-runtime";

interface ThemeEditorProps {
  theme: ThemeSettings;
  onChange: (updated: ThemeSettings) => void;
}

const COLOR_TOKEN_DEFINITIONS: Array<{
  key: keyof ThemeColors;
  label: string;
  description: string;
}> = [
  {
    key: "primary",
    label: "Primary Brand Color",
    description: "Main brand actions, highlights & active states",
  },
  {
    key: "secondary",
    label: "Secondary Color",
    description: "Supporting elements, gradients & secondary accents",
  },
  {
    key: "accent",
    label: "Accent Color",
    description: "Attention callouts, badges & interactive highlights",
  },
  {
    key: "background",
    label: "Background Color",
    description: "Page backdrop & overall foundation background",
  },
  {
    key: "surface",
    label: "Surface / Card Background",
    description: "Cards, modals, sidebars & elevated containers",
  },
  {
    key: "text",
    label: "Primary Text Color",
    description: "Headings, primary labels & main readable content",
  },
  {
    key: "mutedText",
    label: "Muted Text Color",
    description: "Secondary labels, timestamps & descriptive captions",
  },
  {
    key: "border",
    label: "Border & Divider Color",
    description: "Card borders, section dividers & input outlines",
  },
];

// Font Selector Row Component with semantic tokens
const FontSelector: React.FC<{
  label: string;
  description: string;
  value: string;
  onChange: (val: string) => void;
}> = ({ label, description, value, onChange }) => (
  <div className="space-y-2 p-3.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border)]">
    <div className="flex items-center justify-between gap-2">
      <div>
        <label className="text-xs font-bold text-[var(--color-text)]">{label}</label>
        <p className="text-[11px] text-[var(--color-muted)]">{description}</p>
      </div>
      <div className="text-xs text-[var(--color-primary)] font-medium font-mono shrink-0">{value}</div>
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-xs bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] rounded-lg px-3 py-2 focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none transition-colors"
    >
      {APPROVED_FONT_CATALOG.map((font) => (
        <option key={font.name} value={font.name} className="bg-[var(--color-surface)] text-[var(--color-text)]">
          {font.name} ({font.category})
        </option>
      ))}
    </select>
  </div>
);

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  theme,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<
    "colors" | "fonts" | "styles" | "animations"
  >("colors");

  const [editingMode, setEditingMode] = useState<"light" | "dark">("light");

  const activePalette: ThemeColors =
    editingMode === "light"
      ? theme.lightColors || DEFAULT_LIGHT_COLORS
      : theme.darkColors || theme.colors || DEFAULT_DARK_COLORS;

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    const updatedPalette = { ...activePalette, [key]: value };
    if (editingMode === "light") {
      onChange({
        ...theme,
        lightColors: updatedPalette,
      });
    } else {
      onChange({
        ...theme,
        darkColors: updatedPalette,
        colors: updatedPalette,
      });
    }
  };

  const handleFontChange = (
    key: keyof ThemeSettings["fonts"],
    value: string,
  ) => {
    onChange({
      ...theme,
      fonts: {
        ...theme.fonts,
        [key]: value,
      },
    });
  };

  const handleStyleChange = (
    key: keyof ThemeSettings["styles"],
    value: string,
  ) => {
    onChange({
      ...theme,
      styles: {
        ...theme.styles,
        [key]: value,
      },
    });
  };

  const handleAnimationChange = (
    key: keyof ThemeSettings["animations"],
    value: boolean | string,
  ) => {
    onChange({
      ...theme,
      animations: {
        ...theme.animations,
        [key]: value,
      },
    });
  };

  return (
    <div className="flex flex-col bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-xl overflow-hidden text-[var(--color-text)]">
      {/* Informative Guidance Banner */}
      <div className="p-3.5 border-b border-[var(--color-border)] bg-[var(--color-primary)]/10 text-xs text-[var(--color-text)] flex items-start gap-3">
        <span className="text-base leading-none mt-0.5">✨</span>
        <div className="space-y-0.5">
          <span className="font-bold block">Dynamic System Theme Engine</span>
          <p className="text-[var(--color-muted)] leading-relaxed text-[11px]">
            Configure global design system color palettes (Light & Dark), typography roles, UI tokens, and animation presets. Changes propagate live across both Admin and Public views.
          </p>
        </div>
      </div>

      {/* Editor Tabs Header */}
      <div className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-background)]/50 p-1.5 overflow-x-auto">
        {(
          [
            { id: "colors", label: "Color Palettes" },
            { id: "fonts", label: "Semantic Typography" },
            { id: "styles", label: "UI Tokens" },
            { id: "animations", label: "Animations" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`py-2 px-4 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30"
                : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--glass-highlight)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Body */}
      <div className="p-4 overflow-y-auto max-h-[600px] space-y-4">
        {/* Color Palettes Tab */}
        {activeTab === "colors" && (
          <div className="space-y-4">
            {/* Target Palette Sub-Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--color-background)]/60 border border-[var(--color-border)]">
              <div>
                <span className="text-xs font-bold text-[var(--color-text)] block">
                  Editing Palette Target
                </span>
                <span className="text-[11px] text-[var(--color-muted)]">
                  Switch between Light and Dark mode palette definitions
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-[var(--color-surface)] p-1 rounded-lg border border-[var(--color-border)] shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingMode("light")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                    editingMode === "light"
                      ? "bg-[var(--color-primary)] text-white shadow-xs"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  ☀️ Light Palette
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMode("dark")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                    editingMode === "dark"
                      ? "bg-[var(--color-primary)] text-white shadow-xs"
                      : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  🌙 Dark Palette
                </button>
              </div>
            </div>

            {/* 8 Color Token Cards in 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {COLOR_TOKEN_DEFINITIONS.map((def) => {
                const val = activePalette[def.key] || "#000000";
                return (
                  <div
                    key={def.key}
                    className="p-3.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border)] flex flex-col justify-between space-y-3"
                  >
                    {/* TOP: Label & Color Swatch */}
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-bold text-[var(--color-text)]">
                        {def.label}
                      </label>
                      <div
                        className="w-5 h-5 rounded-full border border-[var(--color-border)] shadow-xs shrink-0"
                        style={{ backgroundColor: val }}
                        aria-label={`${def.label} swatch`}
                      />
                    </div>

                    {/* MIDDLE: Description */}
                    <p className="text-[11px] text-[var(--color-muted)] leading-relaxed h-7 flex items-center">
                      {def.description}
                    </p>

                    {/* BOTTOM: Color Picker + HEX Input */}
                    <div className="flex items-center gap-2 pt-1 border-t border-[var(--color-border)]/50">
                      <input
                        type="color"
                        value={val}
                        onChange={(e) => handleColorChange(def.key, e.target.value)}
                        aria-label={`${def.label} color picker`}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-[var(--color-border)] p-0 bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleColorChange(def.key, e.target.value)}
                        aria-label={`${def.label} hex code`}
                        className="w-28 text-xs font-mono uppercase px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Semantic Typography Tab */}
        {activeTab === "fonts" && (
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-[var(--color-background)]/50 border border-[var(--color-border)] text-xs text-[var(--color-muted)] leading-relaxed">
              Configure component typography by functional role. Changes
              automatically update matching UI components across all public and admin views.
            </div>

            <FontSelector
              label="1. Heading Typography"
              description="Applied to section titles, hero headings & major page headers"
              value={theme.fonts.headingFont}
              onChange={(val) => handleFontChange("headingFont",val)}
            />
            <FontSelector
              label="2. Body Typography"
              description="Applied to main paragraphs, descriptions & general text"
              value={theme.fonts.bodyFont}
              onChange={(val) => handleFontChange("bodyFont", val)}
            />
            <FontSelector
              label="3. Accent / Creative Typography"
              description="Applied to creative subheadings, artistic callouts & display text"
              value={theme.fonts.accentFont}
              onChange={(val) => handleFontChange("accentFont", val)}
            />
            <FontSelector
              label="4. Button Typography"
              description="Applied to interactive buttons, CTAs & action elements"
              value={theme.fonts.buttonFont || "Inter"}
              onChange={(val) => handleFontChange("buttonFont", val)}
            />
            <FontSelector
              label="5. Card Title Typography"
              description="Applied to title headings inside project and artwork cards"
              value={theme.fonts.cardTitleFont || "Cinzel"}
              onChange={(val) => handleFontChange("cardTitleFont", val)}
            />
            <FontSelector
              label="6. Card Subtitle Typography"
              description="Applied to subheadings & dates inside cards"
              value={theme.fonts.cardSubtitleFont || "Inter"}
              onChange={(val) => handleFontChange("cardSubtitleFont", val)}
            />
            <FontSelector
              label="7. Card Description Typography"
              description="Applied to body summary text inside project & artwork cards"
              value={theme.fonts.cardDescriptionFont || "Inter"}
              onChange={(val) => handleFontChange("cardDescriptionFont", val)}
            />
            <FontSelector
              label="8. Tag Typography"
              description="Applied to technology badges, category tags & material chips"
              value={theme.fonts.tagFont || "Fira Code"}
              onChange={(val) => handleFontChange("tagFont", val)}
            />
            <FontSelector
              label="9. Navigation Typography"
              description="Applied to main desktop header links & mobile menu items"
              value={theme.fonts.navigationFont || "Inter"}
              onChange={(val) => handleFontChange("navigationFont", val)}
            />
            <FontSelector
              label="10. Mono / Technical Typography"
              description="Applied to code snippets, technical metrics & metadata"
              value={theme.fonts.monoFont || "Fira Code"}
              onChange={(val) => handleFontChange("monoFont", val)}
            />
          </div>
        )}

        {/* UI Tokens Tab */}
        {activeTab === "styles" && (
          <div className="space-y-4">
            {/* Border Radius */}
            <div className="p-3.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border)] space-y-2">
              <label className="text-xs font-semibold text-[var(--color-text)]">
                Border Radius (Corners)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Sharp", val: "0rem" },
                  { label: "Rounded", val: "0.5rem" },
                  { label: "Pill", val: "0.75rem" },
                  { label: "Curved", val: "1rem" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => handleStyleChange("borderRadius", opt.val)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                      theme.styles.borderRadius === opt.val
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs"
                        : "bg-[var(--color-background)] text-[var(--color-muted)] border-[var(--color-border)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Style */}
            <div className="p-3.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border)] space-y-2">
              <label className="text-xs font-semibold text-[var(--color-text)]">
                Card Visual Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { label: "Glassmorphism", val: "glassmorphism" },
                  { label: "Bordered", val: "bordered" },
                  { label: "Flat", val: "flat" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => handleStyleChange("cardStyle", opt.val)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                      theme.styles.cardStyle === opt.val
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs"
                        : "bg-[var(--color-background)] text-[var(--color-muted)] border-[var(--color-border)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Button Style */}
            <div className="p-3.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border)] space-y-2">
              <label className="text-xs font-semibold text-[var(--color-text)]">
                Button Preset Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { label: "Glass", val: "glass" },
                  { label: "Solid", val: "solid" },
                  { label: "Outline", val: "outline" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => handleStyleChange("buttonStyle", opt.val)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                      theme.styles.buttonStyle === opt.val
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs"
                        : "bg-[var(--color-background)] text-[var(--color-muted)] border-[var(--color-border)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Animations Tab */}
        {activeTab === "animations" && (
          <div className="space-y-4">
            {/* Page Transitions */}
            <div className="p-3.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border)] space-y-2">
              <label className="text-xs font-semibold text-[var(--color-text)]">
                Page Transition Motion
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { label: "Smooth", val: "smooth" },
                  { label: "Fade", val: "fade" },
                  { label: "None", val: "none" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() =>
                      handleAnimationChange("pageTransitions", opt.val)
                    }
                    className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                      theme.animations.pageTransitions === opt.val
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs"
                        : "bg-[var(--color-background)] text-[var(--color-muted)] border-[var(--color-border)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border)] cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-[var(--color-text)] block">
                    Scroll Reveal Animations
                  </span>
                  <span className="text-[11px] text-[var(--color-muted)]">
                    Animate elements into view on scroll
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={theme.animations.scrollReveal}
                  onChange={(e) =>
                    handleAnimationChange("scrollReveal", e.target.checked)
                  }
                  className="w-4 h-4 rounded text-[var(--color-primary)] bg-[var(--color-background)] border-[var(--color-border)] focus:ring-[var(--color-primary)] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border)] cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-[var(--color-text)] block">
                    Button & Card Hover Effects
                  </span>
                  <span className="text-[11px] text-[var(--color-muted)]">
                    Subtle hover translation and shadow glow
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={theme.animations.hoverEffects}
                  onChange={(e) =>
                    handleAnimationChange("hoverEffects", e.target.checked)
                  }
                  className="w-4 h-4 rounded text-[var(--color-primary)] bg-[var(--color-background)] border-[var(--color-border)] focus:ring-[var(--color-primary)] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--color-border)] cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-[var(--color-text)] block">
                    Image Hover Zoom & Filters
                  </span>
                  <span className="text-[11px] text-[var(--color-muted)]">
                    Zoom and brightness transition on artwork images
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={theme.animations.imageHoverEffects}
                  onChange={(e) =>
                    handleAnimationChange("imageHoverEffects", e.target.checked)
                  }
                  className="w-4 h-4 rounded text-[var(--color-primary)] bg-[var(--color-background)] border-[var(--color-border)] focus:ring-[var(--color-primary)] cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
