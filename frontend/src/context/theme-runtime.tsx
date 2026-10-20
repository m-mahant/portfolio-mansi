"use client";

// Manages public dynamic theme tokens, user-controlled light/dark/system preference, font loading, and CSS root property injection.

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { ThemeSettings, ThemeColors, UserThemePreference } from "@/types/public.types";
import { publicApi } from "@/services/api/public-api";
import {
  getSafeFontStack,
  loadGoogleFont,
  DEFAULT_HEADING_FONT,
  DEFAULT_BODY_FONT,
  DEFAULT_ACCENT_FONT,
  DEFAULT_MONO_FONT,
} from "@/utils/font-registry";

export const DEFAULT_DARK_COLORS: ThemeColors = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  accent: "#d97706",
  background: "#0f172a",
  surface: "#1e293b",
  text: "#f8fafc",
  mutedText: "#94a3b8",
  border: "#334155",
};

export const DEFAULT_LIGHT_COLORS: ThemeColors = {
  primary: "#4f46e5",
  secondary: "#7c3aed",
  accent: "#d97706",
  background: "#f8fafc",
  surface: "#ffffff",
  text: "#0f172a",
  mutedText: "#64748b",
  border: "#e2e8f0",
};

// Default visual identity: BLUE × PURPLE fallback theme.
export const DEFAULT_THEME: ThemeSettings = {
  mode: "dark",
  colors: DEFAULT_DARK_COLORS,
  lightColors: DEFAULT_LIGHT_COLORS,
  darkColors: DEFAULT_DARK_COLORS,
  fonts: {
    headingFont: DEFAULT_HEADING_FONT,
    bodyFont: DEFAULT_BODY_FONT,
    accentFont: DEFAULT_ACCENT_FONT,
    buttonFont: DEFAULT_BODY_FONT,
    cardTitleFont: DEFAULT_HEADING_FONT,
    cardSubtitleFont: DEFAULT_BODY_FONT,
    cardDescriptionFont: DEFAULT_BODY_FONT,
    tagFont: DEFAULT_MONO_FONT,
    navigationFont: DEFAULT_BODY_FONT,
    monoFont: DEFAULT_MONO_FONT,
  },
  styles: {
    borderRadius: "0.75rem",
    cardStyle: "glassmorphism",
    buttonStyle: "glass",
  },
  animations: {
    pageTransitions: "smooth",
    scrollReveal: true,
    hoverEffects: true,
    imageHoverEffects: true,
  },
};

export const THEME_PREFERENCE_STORAGE_KEY = "portfolio-theme-preference";

// Helper to determine the OS / browser color scheme preference
export function getSystemThemeMode(): "light" | "dark" {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Helper to resolve userPreference ('light' | 'dark' | null) to activeMode ('light' | 'dark')
export function resolveActiveThemeMode(preference: UserThemePreference): "light" | "dark" {
  if (preference === "light") return "light";
  if (preference === "dark") return "dark";
  return getSystemThemeMode();
}

interface ThemeContextType {
  theme: ThemeSettings;
  userPreference: UserThemePreference;
  activeMode: "light" | "dark";
  isLoading: boolean;
  error: string | null;
  setUserPreference: (preference: UserThemePreference) => void;
  toggleThemeMode: () => void;
  refreshTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
  userPreference: null,
  activeMode: "dark",
  isLoading: true,
  error: null,
  setUserPreference: () => {},
  toggleThemeMode: () => {},
  refreshTheme: async () => {},
});

// Helper function to safely apply structured CSS custom properties onto document root.
export function applyThemeToDocument(
  theme: ThemeSettings,
  effectiveMode: "light" | "dark",
  pathname: string = "/",
): "light" | "dark" {
  if (typeof document === "undefined") return effectiveMode;

  const root = document.documentElement;
  const isDark = effectiveMode === "dark";

  // Choose palette based on effectiveMode
  let palette: ThemeColors;
  if (isDark) {
    palette = theme.darkColors || theme.colors || DEFAULT_DARK_COLORS;
  } else {
    palette = theme.lightColors || DEFAULT_LIGHT_COLORS;
  }

  // Set class & data-theme on document element for mode targeting
  if (isDark) {
    root.classList.add("dark");
    root.classList.remove("light");
    root.setAttribute("data-theme", "dark");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  }

  // Apply color custom properties
  root.style.setProperty(
    "--color-primary",
    palette.primary ||
      (isDark ? DEFAULT_DARK_COLORS.primary : DEFAULT_LIGHT_COLORS.primary),
  );
  root.style.setProperty(
    "--color-secondary",
    palette.secondary ||
      (isDark ? DEFAULT_DARK_COLORS.secondary : DEFAULT_LIGHT_COLORS.secondary),
  );
  root.style.setProperty(
    "--color-accent",
    palette.accent ||
      (isDark ? DEFAULT_DARK_COLORS.accent : DEFAULT_LIGHT_COLORS.accent),
  );
  const bgVal =
    palette.background ||
    (isDark ? DEFAULT_DARK_COLORS.background : DEFAULT_LIGHT_COLORS.background);
  root.style.setProperty("--color-background", bgVal);
  root.style.setProperty("--color-bg", bgVal);

  root.style.setProperty(
    "--color-surface",
    palette.surface ||
      (isDark ? DEFAULT_DARK_COLORS.surface : DEFAULT_LIGHT_COLORS.surface),
  );
  root.style.setProperty(
    "--color-surface-elevated",
    isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
  );
  root.style.setProperty(
    "--color-text",
    palette.text ||
      (isDark ? DEFAULT_DARK_COLORS.text : DEFAULT_LIGHT_COLORS.text),
  );

  const mutedVal =
    palette.mutedText ||
    (isDark ? DEFAULT_DARK_COLORS.mutedText : DEFAULT_LIGHT_COLORS.mutedText);
  root.style.setProperty("--color-muted", mutedVal);
  root.style.setProperty("--color-text-muted", mutedVal);

  root.style.setProperty(
    "--color-border",
    palette.border ||
      (isDark ? DEFAULT_DARK_COLORS.border : DEFAULT_LIGHT_COLORS.border),
  );

  // Apply Liquid Glass mode-tuned custom properties
  if (isDark) {
    root.style.setProperty("--glass-bg", "rgba(30, 41, 59, 0.65)");
    root.style.setProperty("--glass-bg-strong", "rgba(15, 23, 42, 0.85)");
    root.style.setProperty("--glass-border", "rgba(255, 255, 255, 0.12)");
    root.style.setProperty("--glass-highlight", "rgba(255, 255, 255, 0.08)");
    root.style.setProperty("--glass-shadow", "0 8px 32px 0 rgba(0, 0, 0, 0.37)");
  } else {
    root.style.setProperty("--glass-bg", "rgba(255, 255, 255, 0.75)");
    root.style.setProperty("--glass-bg-strong", "rgba(248, 250, 252, 0.90)");
    root.style.setProperty("--glass-border", "rgba(15, 23, 42, 0.08)");
    root.style.setProperty("--glass-highlight", "rgba(255, 255, 255, 0.60)");
    root.style.setProperty("--glass-shadow", "0 8px 32px 0 rgba(15, 23, 42, 0.06)");
  }
  root.style.setProperty("--glass-blur", "blur(16px)");

  // Apply style custom properties
  const radius = theme.styles?.borderRadius || "0.75rem";
  root.style.setProperty("--radius-base", radius);
  root.style.setProperty("--radius-sm", `calc(${radius} * 0.5)`);
  root.style.setProperty("--radius-md", radius);
  root.style.setProperty("--radius-lg", `calc(${radius} * 1.5)`);
  root.style.setProperty("--radius-xl", `calc(${radius} * 2)`);

  // Apply motion properties
  const motionEnabled = theme.animations?.hoverEffects ?? true;
  root.style.setProperty("--motion-enabled", motionEnabled ? "1" : "0");
  root.style.setProperty(
    "--motion-duration",
    theme.animations?.pageTransitions === "none" ? "0ms" : "300ms",
  );

  // 2. Resolve 10 Semantic Typography Roles
  const headingFont = theme.fonts?.headingFont || DEFAULT_HEADING_FONT;
  const bodyFont = theme.fonts?.bodyFont || DEFAULT_BODY_FONT;
  const accentFont = theme.fonts?.accentFont || DEFAULT_ACCENT_FONT;
  const buttonFont = theme.fonts?.buttonFont || bodyFont;
  const cardTitleFont = theme.fonts?.cardTitleFont || headingFont;
  const cardSubtitleFont = theme.fonts?.cardSubtitleFont || bodyFont;
  const cardDescriptionFont = theme.fonts?.cardDescriptionFont || bodyFont;
  const tagFont =
    theme.fonts?.tagFont || theme.fonts?.monoFont || DEFAULT_MONO_FONT;
  const navigationFont = theme.fonts?.navigationFont || bodyFont;
  const monoFont = theme.fonts?.monoFont || DEFAULT_MONO_FONT;

  loadGoogleFont(headingFont);
  loadGoogleFont(bodyFont);
  loadGoogleFont(accentFont);
  loadGoogleFont(buttonFont);
  loadGoogleFont(cardTitleFont);
  loadGoogleFont(cardSubtitleFont);
  loadGoogleFont(cardDescriptionFont);
  loadGoogleFont(tagFont);
  loadGoogleFont(navigationFont);
  loadGoogleFont(monoFont);

  root.style.setProperty(
    "--font-heading",
    getSafeFontStack(headingFont, DEFAULT_HEADING_FONT),
  );
  root.style.setProperty(
    "--font-body",
    getSafeFontStack(bodyFont, DEFAULT_BODY_FONT),
  );
  root.style.setProperty(
    "--font-accent",
    getSafeFontStack(accentFont, DEFAULT_ACCENT_FONT),
  );
  root.style.setProperty(
    "--font-button",
    getSafeFontStack(buttonFont, DEFAULT_BODY_FONT),
  );
  root.style.setProperty(
    "--font-card-title",
    getSafeFontStack(cardTitleFont, DEFAULT_HEADING_FONT),
  );
  root.style.setProperty(
    "--font-card-subtitle",
    getSafeFontStack(cardSubtitleFont, DEFAULT_BODY_FONT),
  );
  root.style.setProperty(
    "--font-card-description",
    getSafeFontStack(cardDescriptionFont, DEFAULT_BODY_FONT),
  );
  root.style.setProperty(
    "--font-tag",
    getSafeFontStack(tagFont, DEFAULT_MONO_FONT),
  );
  root.style.setProperty(
    "--font-nav",
    getSafeFontStack(navigationFont, DEFAULT_BODY_FONT),
  );
  root.style.setProperty(
    "--font-mono",
    getSafeFontStack(monoFont, DEFAULT_MONO_FONT),
  );

  return effectiveMode;
}

// Context provider wrapping the public layout to manage theme state, mode switching, and CSS variables.
export const ThemeRuntimeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [userPreference, setUserPreferenceState] = useState<UserThemePreference>(null);
  const [activeMode, setActiveMode] = useState<"light" | "dark">("dark");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  // Load saved preference ('light' | 'dark') from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY) as UserThemePreference;
      if (saved === "light" || saved === "dark") {
        setUserPreferenceState(saved);
      } else {
        setUserPreferenceState(null);
      }
    } catch {
      setUserPreferenceState(null);
    }
  }, []);

  const setUserPreference = useCallback((preference: UserThemePreference) => {
    setUserPreferenceState(preference);
    try {
      if (preference === "light" || preference === "dark") {
        localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, preference);
      } else {
        localStorage.removeItem(THEME_PREFERENCE_STORAGE_KEY);
      }
    } catch (err) {
      console.warn("Could not update theme preference in localStorage:", err);
    }
  }, []);

  const toggleThemeMode = useCallback(() => {
    const nextMode = activeMode === "dark" ? "light" : "dark";
    setUserPreference(nextMode);
  }, [activeMode, setUserPreference]);

  const fetchAndApplyTheme = useCallback(async () => {
    try {
      const remoteTheme = await publicApi.getTheme();
      if (remoteTheme) {
        setTheme(remoteTheme);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load remote theme",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchAndApplyTheme().then(() => {
      if (!isMounted) return;
    });
    return () => {
      isMounted = false;
    };
  }, [fetchAndApplyTheme]);

  // Apply theme to document whenever theme, userPreference, or pathname changes
  useEffect(() => {
    const computedMode = resolveActiveThemeMode(userPreference);
    setActiveMode(computedMode);
    applyThemeToDocument(theme, computedMode, pathname);
  }, [userPreference, theme, pathname]);

  // Listen for OS system theme changes ONLY when user has no explicit preference (userPreference === null)
  useEffect(() => {
    if (userPreference !== null) return;
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = (e: MediaQueryListEvent) => {
      const computedMode = e.matches ? "dark" : "light";
      setActiveMode(computedMode);
      applyThemeToDocument(theme, computedMode, pathname);
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [userPreference, theme, pathname]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        userPreference,
        activeMode,
        isLoading,
        error,
        setUserPreference,
        toggleThemeMode,
        refreshTheme: fetchAndApplyTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom React hook to access public theme state.
export function useThemeRuntime(): ThemeContextType {
  return useContext(ThemeContext);
}
