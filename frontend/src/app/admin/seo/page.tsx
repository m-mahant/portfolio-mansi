'use client';
/* eslint-disable react-hooks/set-state-in-effect */

// Centralized SEO Management Dashboard page for site, project, and artwork search engine metadata.

import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { SiteSettings, Project, Artwork, SeoMetadata } from '@/types/admin.types';
import { SeoForm } from '@/components/admin/seo-form';
import { SeoPreview } from '@/components/admin/seo-preview';

export default function AdminSeoPage() {
  const { idToken } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'site' | 'projects' | 'artworks'>('site');

  // Data states
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Selection states
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedArtworkId, setSelectedArtworkId] = useState<string>('');

  // Editing state
  const [currentSeo, setCurrentSeo] = useState<SeoMetadata>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Loads overall site settings, projects, and artworks.
  const loadData = useCallback(async () => {
    if (!idToken) return;
    setLoading(true);
    setError(null);
    try {
      const [site, projList, artList] = await Promise.all([
        adminApi.getSiteSettings(idToken).catch(() => null),
        adminApi.getProjects(idToken).catch(() => []),
        adminApi.getArtworks(idToken).catch(() => []),
      ]);

      if (site) {
        setSiteSettings(site);
        setCurrentSeo(site.seo || {});
      }
      setProjects(projList || []);
      if (projList && projList.length > 0) {
        setSelectedProjectId(projList[0].id || '');
      }
      setArtworks(artList || []);
      if (artList && artList.length > 0) {
        setSelectedArtworkId(artList[0].id || '');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load SEO configuration.');
    } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Syncs currentSeo editing state when activeTab or selected items change.
  useEffect(() => {
    if (activeTab === 'site') {
      setCurrentSeo(siteSettings?.seo || {});
    } else if (activeTab === 'projects') {
      const proj = projects.find((p) => p.id === selectedProjectId);
      setCurrentSeo(proj?.seo || {});
    } else if (activeTab === 'artworks') {
      const art = artworks.find((a) => a.id === selectedArtworkId);
      setCurrentSeo(art?.seo || {});
    }
  }, [activeTab, selectedProjectId, selectedArtworkId, siteSettings, projects, artworks]);

  // Saves SEO metadata updates back to backend.
  const handleSaveSeo = async () => {
    if (!idToken) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (activeTab === 'site' && siteSettings) {
        const updated = await adminApi.updateSiteSettings({ seo: currentSeo }, idToken);
        setSiteSettings(updated);
        setSuccess('Global Site SEO metadata updated successfully!');
      } else if (activeTab === 'projects' && selectedProjectId) {
        const updated = await adminApi.updateProject(selectedProjectId, { seo: currentSeo }, idToken);
        setProjects((prev) => prev.map((p) => (p.id === selectedProjectId ? updated : p)));
        setSuccess(`Project '${updated.title}' SEO metadata updated!`);
      } else if (activeTab === 'artworks' && selectedArtworkId) {
        const updated = await adminApi.updateArtwork(selectedArtworkId, { seo: currentSeo }, idToken);
        setArtworks((prev) => prev.map((a) => (a.id === selectedArtworkId ? updated : a)));
        setSuccess(`Artwork '${updated.title}' SEO metadata updated!`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save SEO metadata.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-[var(--color-text-muted)] text-sm font-medium">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading SEO Management Engine...
        </div>
      </div>
    );
  }

  const activeProject = projects.find((p) => p.id === selectedProjectId);
  const activeArtwork = artworks.find((a) => a.id === selectedArtworkId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)]/60 p-5 rounded-xl border border-[var(--color-border)] backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2 font-heading">
            <span>🔍</span> Centralized SEO Administration
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Manage meta tags, OpenGraph social cards, indexing instructions, and canonical URLs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSeo}
          disabled={saving}
          className="px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            'Save SEO Settings'
          )}
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
            ✕
          </button>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
            ✕
          </button>
        </div>
      )}

      {/* Scope Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[var(--color-surface)]/40 p-4 rounded-xl border border-[var(--color-border)]">
        <div className="flex items-center gap-1 overflow-x-auto bg-[var(--color-surface)] p-1 rounded-lg border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setActiveTab('site')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'site'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--glass-highlight)]'
            }`}
          >
            Global Site SEO
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--glass-highlight)]'
            }`}
          >
            Projects SEO ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('artworks')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'artworks'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--glass-highlight)]'
            }`}
          >
            Artworks SEO ({artworks.length})
          </button>
        </div>

        {/* Dropdown item selectors for Projects and Artworks */}
        {activeTab === 'projects' && (
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] focus:outline-none focus:border-indigo-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.slug})
              </option>
            ))}
          </select>
        )}

        {activeTab === 'artworks' && (
          <select
            value={selectedArtworkId}
            onChange={(e) => setSelectedArtworkId(e.target.value)}
            className="px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] focus:outline-none focus:border-indigo-500"
          >
            {artworks.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.slug})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Main Grid: Form Editor & Live Snippet Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Editor (6 cols) */}
        <div className="lg:col-span-6">
          <SeoForm seo={currentSeo} onChange={setCurrentSeo} />
        </div>

        {/* Live Search & Social Snippet Preview (6 cols) */}
        <div className="lg:col-span-6">
          <SeoPreview
            seo={currentSeo}
            defaultTitle={
              activeTab === 'site'
                ? siteSettings?.siteTitle || 'Mansi Mahant'
                : activeTab === 'projects'
                ? activeProject?.title || 'Project Case Study'
                : activeArtwork?.title || 'Artwork Piece'
            }
            defaultDescription={
              activeTab === 'site'
                ? siteSettings?.shortDescription ||
                  'A dynamic CMS for every kind of work you ship.'
                : activeTab === 'projects'
                ? activeProject?.shortDescription || 'Technical software project case study.'
                : activeArtwork?.shortDescription || 'Creative digital artwork piece.'
            }
            slug={
              activeTab === 'projects'
                ? `projects/${activeProject?.slug || ''}`
                : activeTab === 'artworks'
                ? `artworks/${activeArtwork?.slug || ''}`
                : ''
            }
          />
        </div>
      </div>
    </div>
  );
}
