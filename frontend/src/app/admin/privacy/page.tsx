'use client';

// Admin CMS page for controlling content displayed on the public Privacy Policy page (/privacy).

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { PrivacyPageConfig } from '@/types/admin.types';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlogContent } from '@/components/public/blog/blog-content';

export default function AdminPrivacyPage() {
  const { idToken } = useAdminAuth();
  const [config, setConfig] = useState<Partial<PrivacyPageConfig>>({});
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
        const data = await adminApi.getPrivacyPageConfig(idToken);
        setConfig(data || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Privacy Page configuration');
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
      const updated = await adminApi.updatePrivacyPageConfig(config, idToken);
      setConfig(updated);
      setSuccess('Privacy page configuration saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update Privacy Page configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Privacy Page CMS..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔒</span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Privacy Page CMS</h1>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          1:1 Content Management for your public Privacy Policy page (/privacy).
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <span>📄</span> Policy Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Supports <code>## Heading</code>, <code>**bold**</code>, and <code>- list</code> lines.
            </p>
            <textarea
              value={config.content || ''}
              onChange={(e) => setConfig({ ...config, content: e.target.value })}
              placeholder="## What is collected&#10;&#10;- Contact form: name, email, message..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none min-h-[360px]"
            />
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <span>👁️</span> Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {config.content ? (
              <BlogContent content={config.content} />
            ) : (
              <p className="text-xs text-[var(--color-text-muted)]">Start typing above to see a preview.</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Privacy Page CMS'}
          </Button>
        </div>
      </form>
    </div>
  );
}
