'use client';

// Admin CMS page for controlling the content displayed on the public Work overview page (/work).

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { WorkPageConfig } from '@/types/admin.types';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminWorkPage() {
  const { idToken } = useAdminAuth();
  const [config, setConfig] = useState<Partial<WorkPageConfig>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!idToken) return;
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getWorkPageConfig(idToken);
        setConfig(data || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Work Page configuration');
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
      const updated = await adminApi.updateWorkPageConfig(config, idToken);
      setConfig(updated);
      setSuccess('Work page configuration saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update Work Page configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Work Page CMS..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💼</span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Work Page CMS</h1>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          1:1 Content Management for your public Work landing page (/work).
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="glass-panel">
          <CardHeader>
            <div className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              🎯 CONTROLS PUBLIC SECTION: Public Work Header & Banner (/work)
            </div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <span>📄</span> Header & Overview Banner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Page Title
              </label>
              <Input
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                placeholder="e.g. Selected Work & Portfolio"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Subtitle
              </label>
              <Input
                value={config.subtitle || ''}
                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                placeholder="e.g. A collection of engineering projects and digital artwork"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Intro Description
              </label>
              <textarea
                value={config.description || ''}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder="Detailed introduction to your portfolio disciplines..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none min-h-[90px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <span>🏷️</span> Discipline Cards Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 border-b border-[var(--glass-border)] pb-4">
              <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                Software Development Section
              </h3>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Development Card Title
                </label>
                <Input
                  value={config.devTitle || ''}
                  onChange={(e) => setConfig({ ...config, devTitle: e.target.value })}
                  placeholder="e.g. Software Development & Engineering"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Development Description
                </label>
                <textarea
                  value={config.devDescription || ''}
                  onChange={(e) => setConfig({ ...config, devDescription: e.target.value })}
                  placeholder="Full-stack web applications, microservices..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--color-text)] outline-none min-h-[60px]"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider">
                Art & Crafts Section
              </h3>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Art & Crafts Card Title
                </label>
                <Input
                  value={config.artTitle || ''}
                  onChange={(e) => setConfig({ ...config, artTitle: e.target.value })}
                  placeholder="e.g. Visual Art, UI/UX & Craft"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Art & Crafts Description
                </label>
                <textarea
                  value={config.artDescription || ''}
                  onChange={(e) => setConfig({ ...config, artDescription: e.target.value })}
                  placeholder="Digital illustrations, 3D modeling..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--color-text)] outline-none min-h-[60px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Work Page CMS'}
          </Button>
        </div>
      </form>
    </div>
  );
}
