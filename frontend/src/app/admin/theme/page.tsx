'use client';
/* eslint-disable react-hooks/set-state-in-effect */

// Admin Theme Tokens Editor Page managing visual branding, typography, and animation presets.

import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { ThemeSettings } from '@/types/admin.types';
import { ThemeEditor } from '@/components/admin/theme-editor';
import { ThemePreview } from '@/components/admin/theme-preview';
import { DeleteModal } from '@/components/admin/delete-modal';
import { useThemeRuntime, applyThemeToDocument } from '@/context/theme-runtime';

const DEFAULT_THEME: ThemeSettings = {
  mode: 'dark',
  colors: {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    accent: '#06b6d4',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    mutedText: '#94a3b8',
    border: '#334155',
  },
  darkColors: {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    accent: '#06b6d4',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    mutedText: '#94a3b8',
    border: '#334155',
  },
  lightColors: {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    accent: '#0891b2',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    mutedText: '#64748b',
    border: '#e2e8f0',
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
};

export default function AdminThemePage() {
  const { idToken } = useAdminAuth();
  const { activeMode, refreshTheme } = useThemeRuntime();
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [originalTheme, setOriginalTheme] = useState<ThemeSettings>(DEFAULT_THEME);

  // Apply theme edits live to document CSS variables in real time
  useEffect(() => {
    if (theme) {
      applyThemeToDocument(theme, activeMode);
    }
  }, [theme, activeMode]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState<boolean>(false);

  // Loads current active theme settings from the Express backend API.
  const loadThemeSettings = useCallback(async () => {
    if (!idToken) return;
    setLoading(true);
    try {
      const data = await adminApi.getThemeSettings(idToken);
      if (data && data.colors) {
        setTheme(data);
        setOriginalTheme(data);
      }
    } catch (err: unknown) {
      console.warn('Could not load existing theme settings, using defaults.', err);
    } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    loadThemeSettings();
  }, [loadThemeSettings]);

  // Saves current theme configuration to backend Firestore repository.
  const handleSaveTheme = async () => {
    if (!idToken) return;
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await adminApi.updateThemeSettings(theme, idToken);
      setTheme(updated);
      setOriginalTheme(updated);
      // Sync the app-wide theme provider so the new theme stays applied after navigating
      // away from this page, instead of reverting to whatever it had cached on load.
      await refreshTheme();
      setFeedback({ type: 'success', message: 'Theme settings updated successfully!' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save theme settings.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  // Resets local theme edits to the last saved original state.
  const handleResetChanges = () => {
    setTheme(originalTheme);
    setFeedback({ type: 'success', message: 'Unsaved changes reverted to saved theme.' });
  };

  // Restores default portfolio design theme.
  const handleConfirmRestoreDefaults = () => {
    setTheme(DEFAULT_THEME);
    setShowRestoreModal(false);
    setFeedback({ type: 'success', message: 'Theme tokens restored to default Blue × Purple preset. Click Save to persist.' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-[var(--color-text-muted)] text-sm font-medium">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading visual theme configurations...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)]/60 p-5 rounded-xl border border-[var(--color-border)] backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2 font-heading">
            <span>✨</span> Dynamic Theme Editor
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Customize portfolio semantic typography, UI container styles, and animation tokens.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowRestoreModal(true)}
            className="px-3.5 py-2 bg-[var(--color-surface)] hover:bg-[var(--glass-highlight)] text-[var(--color-text)] rounded-lg text-xs font-semibold border border-[var(--color-border)] transition-colors"
          >
            Restore Defaults
          </button>
          <button
            type="button"
            onClick={handleResetChanges}
            className="px-3.5 py-2 bg-[var(--color-surface)] hover:bg-[var(--glass-highlight)] text-[var(--color-text)] rounded-lg text-xs font-semibold border border-[var(--color-border)] transition-colors"
          >
            Reset Changes
          </button>
          <button
            type="button"
            onClick={handleSaveTheme}
            disabled={saving}
            className="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Theme'
            )}
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-lg text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-[var(--color-muted)] hover:text-[var(--color-text)] ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Theme Controls (5 columns on LG) */}
        <div className="lg:col-span-6 xl:col-span-5">
          <ThemeEditor theme={theme} onChange={setTheme} />
        </div>

        {/* Live Site Preview (7 columns on LG) */}
        <div className="lg:col-span-6 xl:col-span-7 h-[650px]">
          <ThemePreview theme={theme} />
        </div>
      </div>

      {/* Restore Defaults Confirmation Modal */}
      <DeleteModal
        isOpen={showRestoreModal}
        title="Restore Default Theme?"
        description="Are you sure you want to reset all custom fonts and style tokens back to default settings? Unsaved edits will be replaced."
        onConfirm={handleConfirmRestoreDefaults}
        onCancel={() => setShowRestoreModal(false)}
      />
    </div>
  );
}
