import { db, isFirebaseInitialized } from '../config/firebase.config';
import { ThemeSettings } from '../types/database.types';
import { AppError } from '../errors/app-error';

// Default dynamic theme settings returned when document is missing or database is empty.
const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  mode: 'dark',
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#d97706',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    mutedText: '#94a3b8',
    border: '#334155',
  },
  lightColors: {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    accent: '#d97706',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    mutedText: '#64748b',
    border: '#e2e8f0',
  },
  darkColors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#d97706',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    mutedText: '#94a3b8',
    border: '#334155',
  },
  fonts: {
    headingFont: 'Cinzel',
    bodyFont: 'Inter',
    accentFont: 'Pacifico',
    buttonFont: 'Inter',
    cardTitleFont: 'Cinzel',
    cardSubtitleFont: 'Inter',
    cardDescriptionFont: 'Inter',
    tagFont: 'Fira Code',
    navigationFont: 'Inter',
    monoFont: 'Fira Code',
  },
  styles: {
    borderRadius: '0.75rem',
    cardStyle: 'glassmorphism',
    buttonStyle: 'glass',
  },
  animations: {
    pageTransitions: 'smooth',
    scrollReveal: true,
    hoverEffects: true,
    imageHoverEffects: true,
  },
  updatedAt: new Date().toISOString(),
};

// Memory fallback store for theme settings when Firestore is unavailable.
let inMemoryThemeSettings: ThemeSettings = { ...DEFAULT_THEME_SETTINGS };

// Repository for querying and updating active Theme Settings in Firestore.
export class ThemeRepository {
  // Retrieves active theme settings from Firestore or fallback memory store.
  async getActiveThemeSettings(): Promise<ThemeSettings> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryThemeSettings;
    }

    try {
      const docRef = db.collection('themeSettings').doc('active');
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return inMemoryThemeSettings;
      }
      const data = snapshot.data() as ThemeSettings;
      const rawMode = data?.mode;
      const mode = rawMode === 'light' || rawMode === 'dark' ? rawMode : 'dark';

      return {
        ...DEFAULT_THEME_SETTINGS,
        ...data,
        mode,
        colors: { ...DEFAULT_THEME_SETTINGS.colors, ...(data?.colors || {}) },
        lightColors: data?.lightColors ? { ...DEFAULT_THEME_SETTINGS.lightColors, ...data.lightColors } : DEFAULT_THEME_SETTINGS.lightColors,
        darkColors: data?.darkColors ? { ...DEFAULT_THEME_SETTINGS.darkColors, ...data.darkColors } : DEFAULT_THEME_SETTINGS.darkColors,
        fonts: { ...DEFAULT_THEME_SETTINGS.fonts, ...(data?.fonts || {}) },
        styles: { ...DEFAULT_THEME_SETTINGS.styles, ...(data?.styles || {}) },
        animations: { ...DEFAULT_THEME_SETTINGS.animations, ...(data?.animations || {}) },
      };
    } catch {
      return inMemoryThemeSettings;
    }
  }

  // Updates active theme settings document themeSettings/active in Firestore.
  async updateThemeSettings(updates: Partial<ThemeSettings>): Promise<ThemeSettings> {
    const current = await this.getActiveThemeSettings();
    const rawMode = updates.mode || current.mode;
    const mode = rawMode === 'light' || rawMode === 'dark' ? rawMode : 'dark';

    const updated: ThemeSettings = {
      mode,
      colors: { ...current.colors, ...updates.colors },
      lightColors: updates.lightColors
        ? { ...current.lightColors, ...updates.lightColors }
        : current.lightColors,
      darkColors: updates.darkColors
        ? { ...current.darkColors, ...updates.darkColors }
        : current.darkColors,
      fonts: { ...current.fonts, ...updates.fonts },
      styles: { ...current.styles, ...updates.styles },
      animations: { ...current.animations, ...updates.animations },
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      inMemoryThemeSettings = updated;
      return inMemoryThemeSettings;
    }

    try {
      const docRef = db.collection('themeSettings').doc('active');
      await docRef.set(updated, { merge: true });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update theme settings in database';
      throw AppError.internal(message);
    }
  }
}

export const themeRepository = new ThemeRepository();
