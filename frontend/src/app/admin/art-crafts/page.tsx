'use client';

// Admin CMS for public Art & Crafts listing page chrome (/work/art-crafts).

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { ArtPageConfig } from '@/types/admin.types';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SeoForm } from '@/components/admin/seo-form';

export default function AdminArtPage() {
  const { idToken } = useAdminAuth();
  const [config, setConfig] = useState<Partial<ArtPageConfig>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newCommissionTitle, setNewCommissionTitle] = useState('');
  const [newCommissionDescription, setNewCommissionDescription] = useState('');

  const handleAddCommissionType = () => {
    if (!newCommissionTitle.trim() || !newCommissionDescription.trim()) return;
    const current = config.commissionTypes || [];
    setConfig({
      ...config,
      commissionTypes: [...current, { title: newCommissionTitle.trim(), description: newCommissionDescription.trim() }],
    });
    setNewCommissionTitle('');
    setNewCommissionDescription('');
  };

  const handleRemoveCommissionType = (index: number) => {
    setConfig({ ...config, commissionTypes: (config.commissionTypes || []).filter((_, i) => i !== index) });
  };

  useEffect(() => {
    async function loadData() {
      if (!idToken) return;
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getArtPageConfig(idToken);
        setConfig(data || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Art Page configuration');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [idToken]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToken) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const updated = await adminApi.updateArtPageConfig(config, idToken);
      setConfig(updated);
      setSuccess('Art page configuration saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update Art Page configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Art Page CMS..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Art Page CMS</h1>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Controls the header on public /work/art-crafts. Artwork items stay in Content Catalogs → Artworks.
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="glass-panel">
          <CardHeader>
            <div className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              CONTROLS PUBLIC SECTION: /work/art-crafts header
            </div>
            <CardTitle className="text-base font-bold">Page Header</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Eyebrow Badge</label>
              <Input
                value={config.eyebrow || ''}
                onChange={(e) => setConfig({ ...config, eyebrow: e.target.value })}
                placeholder="e.g. Art & Crafts"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Page Title</label>
              <Input
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                placeholder="e.g. Art & Crafts Portfolio"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Subtitle</label>
              <textarea
                value={config.subtitle || ''}
                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--color-text)] outline-none min-h-[70px]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Description</label>
              <textarea
                value={config.description || ''}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--color-text)] outline-none min-h-[90px]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Gallery Section Heading</label>
              <Input
                value={config.galleryHeading || ''}
                onChange={(e) => setConfig({ ...config, galleryHeading: e.target.value })}
                placeholder="e.g. Art & Crafts Gallery"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <div className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              CONTROLS PUBLIC SECTION: /work/art-crafts commissions block
            </div>
            <CardTitle className="text-base font-bold">Commissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Section Heading</label>
              <Input
                value={config.commissionsHeading || ''}
                onChange={(e) => setConfig({ ...config, commissionsHeading: e.target.value })}
                placeholder="e.g. Commissions"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="commissionsOpenToggle"
                checked={config.commissionsOpen ?? true}
                onChange={(e) => setConfig({ ...config, commissionsOpen: e.target.checked })}
                className="w-4 h-4 rounded bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <label htmlFor="commissionsOpenToggle" className="text-xs text-[var(--color-text)] cursor-pointer">
                Commissions currently open
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-2">Commission Types</label>
              <div className="space-y-2 mb-3">
                {(config.commissionTypes || []).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--color-text)]">{item.title}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{item.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCommissionType(i)}
                      className="text-[var(--color-text-muted)] hover:text-red-400 text-xs shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="space-y-2 p-3 rounded-xl border border-dashed border-[var(--glass-border)]">
                <Input
                  value={newCommissionTitle}
                  onChange={(e) => setNewCommissionTitle(e.target.value)}
                  placeholder="Commission type, e.g. Hand-Painted Murals"
                />
                <textarea
                  value={newCommissionDescription}
                  onChange={(e) => setNewCommissionDescription(e.target.value)}
                  placeholder="Short description of this commission type..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--color-text)] outline-none min-h-[60px]"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddCommissionType}>
                  Add Commission Type
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">CTA Button Label</label>
                <Input
                  value={config.ctaLabel || ''}
                  onChange={(e) => setConfig({ ...config, ctaLabel: e.target.value })}
                  placeholder="e.g. Request a Commission"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">CTA Link</label>
                <Input
                  value={config.ctaTarget || ''}
                  onChange={(e) => setConfig({ ...config, ctaTarget: e.target.value })}
                  placeholder="/contact?type=art-commission"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <SeoForm seo={config.seo} onChange={(seo) => setConfig({ ...config, seo })} />

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Art Page CMS'}
          </Button>
        </div>
      </form>
    </div>
  );
}
