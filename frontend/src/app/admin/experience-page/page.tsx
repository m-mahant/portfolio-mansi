'use client';

// Admin CMS for public Experience page chrome (/experience), including education section headings.

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { ExperiencePageConfig } from '@/types/admin.types';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminExperiencePageCms() {
  const { idToken } = useAdminAuth();
  const [config, setConfig] = useState<Partial<ExperiencePageConfig>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!idToken) return;
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getExperiencePageConfig(idToken);
        setConfig(data || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Experience Page configuration');
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
      const updated = await adminApi.updateExperiencePageConfig(config, idToken);
      setConfig(updated);
      setSuccess('Experience page configuration saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update Experience Page configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Experience Page CMS..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧭</span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Experience Page CMS</h1>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Controls headers on public /experience. Timeline items stay in Content Catalogs → Experience / Education.
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="glass-panel">
          <CardHeader>
            <div className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              CONTROLS PUBLIC SECTION: /experience hero
            </div>
            <CardTitle className="text-base font-bold">Page Hero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Page Title</label>
              <Input
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                placeholder="e.g. Professional Experience & Education"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Subtitle</label>
              <textarea
                value={config.subtitle || ''}
                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--color-text)] outline-none min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base font-bold">Education Section Headings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Section Title</label>
              <Input
                value={config.educationSectionTitle || ''}
                onChange={(e) => setConfig({ ...config, educationSectionTitle: e.target.value })}
                placeholder="e.g. Education & Certifications"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Section Subtitle</label>
              <Input
                value={config.educationSectionSubtitle || ''}
                onChange={(e) => setConfig({ ...config, educationSectionSubtitle: e.target.value })}
                placeholder="e.g. Academic background and professional certifications."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Experience Page CMS'}
          </Button>
        </div>
      </form>
    </div>
  );
}
