'use client';

// Admin CMS page for managing public Intro / Entry screen content and behavior.

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { IntroPageConfig } from '@/types/admin.types';
import { BRAND_EXPLORE_LABEL, BRAND_LOADING_TEXT, BRAND_NAME } from '@/lib/brand';

export default function AdminIntroPage() {
  const { idToken } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'action' | 'entry' | 'seo'>('content');

  const [formData, setFormData] = useState<IntroPageConfig>({
    headline: 'Where Logic Meets',
    headlineAccent: 'Imagination',
    subtitle: 'Engineering digital experiences with the precision of code and the freedom of art.',
    exploreButtonLabel: BRAND_EXPLORE_LABEL,
    exploreButtonTarget: '/',
    loadingText: BRAND_LOADING_TEXT,
    autoRedirect: false,
    autoRedirectDelay: 5000,
    showOnInitialVisit: true,
    redirectTarget: '/',
    enabled: true,
    seo: {
      title: `Welcome | ${BRAND_NAME}`,
      description: `Entry experience for ${BRAND_NAME}.`,
    },
  });

  useEffect(() => {
    async function loadData() {
      if (!idToken) return;
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getIntroPageConfig(idToken);
        if (data) {
          setFormData((prev) => ({
            ...prev,
            ...data,
            seo: data.seo || prev.seo,
          }));
        }
      } catch (err) {
        console.error('Failed to load Intro page config:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Intro page configuration.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [idToken]);

  const handleChange = (field: keyof IntroPageConfig, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSeoChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToken) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const updated = await adminApi.updateIntroPageConfig(formData, idToken);
      if (updated) {
        setFormData((prev) => ({
          ...prev,
          ...updated,
        }));
      }
      setSuccess('Intro page configuration updated successfully!');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to save Intro page config:', err);
      setError(err instanceof Error ? err.message : 'Failed to update Intro page configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-[var(--color-muted)] font-mono text-sm">
          <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          Loading Intro CMS Configuration...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-primary)] mb-1 uppercase tracking-wider">
            <span>PUBLIC PAGES</span>
            <span>/</span>
            <span>INTRO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-text)]">
            Intro Page CMS
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted)] mt-1">
            Manage the public intro / entry experience shown before visitors enter the Home page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/intro"
            target="_blank"
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--glass-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--glass-highlight)] transition-all flex items-center gap-1.5"
          >
            <span>👁️</span>
            Preview Public Intro
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white shadow-md shadow-[var(--color-primary)]/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <span>💾</span>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200">✕</button>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center justify-between">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-200">✕</button>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex gap-2 border-b border-[var(--glass-border)] pb-3 overflow-x-auto">
        {[
          { id: 'content', label: 'Intro Content', short: 'Content', icon: '📝' },
          { id: 'action', label: 'Primary Action', short: 'Action', icon: '🔘' },
          { id: 'entry', label: 'Entry Experience', short: 'Entry', icon: '⚡' },
          { id: 'seo', label: 'SEO Management', short: 'SEO', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-[var(--color-primary)] text-white shadow-md'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--glass-highlight)]'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="sm:hidden">{tab.short}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: INTRO CONTENT */}
        {activeTab === 'content' && (
          <div className="p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] space-y-5">
            <div className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              🎯 CONTROLS PUBLIC SECTION: Public Intro Hero Header (/intro)
            </div>
            <h2 className="text-base font-bold font-heading text-[var(--color-text)] flex items-center gap-2 border-b border-[var(--glass-border)] pb-3">
              <span>📝</span> Section A — Intro Content
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={formData.headline || ''}
                  onChange={(e) => handleChange('headline', e.target.value)}
                  placeholder="e.g. Where Logic Meets"
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--glass-border)] text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                  Accent Headline (Gradient Text)
                </label>
                <input
                  type="text"
                  value={formData.headlineAccent || ''}
                  onChange={(e) => handleChange('headlineAccent', e.target.value)}
                  placeholder="e.g. Imagination"
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--glass-border)] text-xs text-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                Subtitle
              </label>
              <textarea
                rows={3}
                value={formData.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Engineering digital experiences with the precision of code and the freedom of art."
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--glass-border)] text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 2: PRIMARY ACTION */}
        {activeTab === 'action' && (
          <div className="p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] space-y-6">
            <div className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              🎯 CONTROLS PUBLIC SECTION: Public Intro Button & Navigation (/intro)
            </div>
            <h2 className="text-base font-bold font-heading text-[var(--color-text)] flex items-center gap-2 border-b border-[var(--glass-border)] pb-3">
              <span>🔘</span> Section B — Primary Action
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={formData.exploreButtonLabel || ''}
                  onChange={(e) => handleChange('exploreButtonLabel', e.target.value)}
                  placeholder="e.g. Explore Portfolio"
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--glass-border)] text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                  Target Route / URL
                </label>
                <input
                  type="text"
                  value={formData.exploreButtonTarget || ''}
                  onChange={(e) => handleChange('exploreButtonTarget', e.target.value)}
                  placeholder="e.g. /"
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--glass-border)] text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ENTRY EXPERIENCE */}
        {activeTab === 'entry' && (
          <div className="p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] space-y-5">
            <h2 className="text-base font-bold font-heading text-[var(--color-text)] flex items-center gap-2 border-b border-[var(--glass-border)] pb-3">
              <span>⚡</span> Section C — Entry Experience
            </h2>

            <div>
              <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                Loading Screen Text
              </label>
              <input
                type="text"
                value={formData.loadingText || ''}
                onChange={(e) => handleChange('loadingText', e.target.value)}
                placeholder="e.g. MANSI MAHANT"
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--glass-border)] text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none font-mono"
              />
            </div>

            <div className="pt-4 border-t border-[var(--glass-border)] space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enabled !== false}
                  onChange={(e) => handleChange('enabled', e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--color-primary)] focus:ring-0 bg-[var(--color-background)] border-[var(--glass-border)]"
                />
                <div>
                  <span className="text-xs font-semibold text-[var(--color-text)]">Enable Intro Experience</span>
                  <p className="text-[11px] text-[var(--color-muted)]">When disabled, visitors bypass intro and go straight to Home.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showOnInitialVisit !== false}
                  onChange={(e) => handleChange('showOnInitialVisit', e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--color-primary)] focus:ring-0 bg-[var(--color-background)] border-[var(--glass-border)]"
                />
                <div>
                  <span className="text-xs font-semibold text-[var(--color-text)]">Show On First Visit Only (Session Check)</span>
                  <p className="text-[11px] text-[var(--color-muted)]">Uses session storage to display intro once per session.</p>
                </div>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.autoRedirect)}
                    onChange={(e) => handleChange('autoRedirect', e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--color-primary)] focus:ring-0 bg-[var(--color-background)] border-[var(--glass-border)]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-text)]">Auto Redirect to Home</span>
                    <p className="text-[11px] text-[var(--color-muted)]">Automatically transition after specified delay</p>
                  </div>
                </label>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                    Auto Redirect Delay (ms)
                  </label>
                  <input
                    type="number"
                    value={formData.autoRedirectDelay || 5000}
                    onChange={(e) => handleChange('autoRedirectDelay', parseInt(e.target.value, 10) || 0)}
                    placeholder="5000"
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--glass-border)] text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SEO MANAGEMENT */}
        {activeTab === 'seo' && (
          <div className="p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] space-y-6">
            <h2 className="text-base font-bold font-heading text-[var(--color-text)] flex items-center gap-2 border-b border-[var(--glass-border)] pb-3">
              <span>⚙️</span> Section D — SEO Management
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.seo?.title || ''}
                  onChange={(e) => handleSeoChange('title', e.target.value)}
                  placeholder="Welcome | Mansi Mahant"
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--glass-border)] text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                  Meta Description
                </label>
                <input
                  type="text"
                  value={formData.seo?.description || ''}
                  onChange={(e) => handleSeoChange('description', e.target.value)}
                  placeholder="Entry experience for Mansi Mahant..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-[var(--glass-border)] text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--glass-border)] pt-5">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white shadow-lg shadow-[var(--color-primary)]/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <span>💾</span>
                Save Intro Configuration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
