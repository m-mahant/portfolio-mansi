'use client';

// Admin CMS for public Blog listing page chrome (/blog).

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { BlogPageConfig } from '@/types/admin.types';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminBlogPageCms() {
  const { idToken } = useAdminAuth();
  const [config, setConfig] = useState<Partial<BlogPageConfig>>({});
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
        const data = await adminApi.getBlogPageConfig(idToken);
        setConfig(data || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Blog Page configuration');
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
      const updated = await adminApi.updateBlogPageConfig(config, idToken);
      setConfig(updated);
      setSuccess('Blog page configuration saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update Blog Page configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Blog Page CMS..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">📰</span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Blog Page CMS</h1>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Controls the header on public /blog. Posts stay in Content Catalogs → Blogs.
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="glass-panel">
          <CardHeader>
            <div className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              CONTROLS PUBLIC SECTION: /blog header
            </div>
            <CardTitle className="text-base font-bold">Page Header</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Page Title</label>
              <Input
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                placeholder="e.g. Blog & Articles"
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

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Blog Page CMS'}
          </Button>
        </div>
      </form>
    </div>
  );
}
