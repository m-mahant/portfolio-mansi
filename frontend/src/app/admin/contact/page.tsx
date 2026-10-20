'use client';

// Admin CMS page for controlling content displayed on the public Contact page (/contact).

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { ContactPageConfig } from '@/types/admin.types';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminContactPage() {
  const { idToken } = useAdminAuth();
  const [config, setConfig] = useState<Partial<ContactPageConfig>>({});
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
        const data = await adminApi.getContactPageConfig(idToken);
        setConfig(data || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Contact Page configuration');
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
      const updated = await adminApi.updateContactPageConfig(config, idToken);
      setConfig(updated);
      setSuccess('Contact page configuration saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update Contact Page configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Contact Page CMS..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">✉️</span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Contact Page CMS</h1>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          1:1 Content Management for your public Contact page (/contact).
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="glass-panel">
          <CardHeader>
            <div className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              🎯 CONTROLS PUBLIC SECTION: Public Contact Header & Availability (/contact)
            </div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <span>📄</span> Header & Availability Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Main Heading
              </label>
              <Input
                value={config.heading || ''}
                onChange={(e) => setConfig({ ...config, heading: e.target.value })}
                placeholder="e.g. Let's Build & Create Together"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Subtitle / Intro Text
              </label>
              <textarea
                value={config.subtitle || ''}
                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                placeholder="Have a project in mind..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none min-h-[80px]"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="showForm"
                checked={config.showForm ?? true}
                onChange={(e) => setConfig({ ...config, showForm: e.target.checked })}
                className="w-4 h-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-[var(--glass-bg)] border-[var(--glass-border)]"
              />
              <label htmlFor="showForm" className="text-xs font-semibold text-[var(--color-text)] cursor-pointer">
                Enable Public Direct Message Contact Form
              </label>
            </div>

            <div className="space-y-4 rounded-xl border border-[var(--glass-border)] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Closed-form copy (used when the public form is disabled)
              </p>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Closed Form Title
                </label>
                <Input
                  value={config.closedTitle || ''}
                  onChange={(e) => setConfig({ ...config, closedTitle: e.target.value })}
                  placeholder="Inquiries Temporarily Closed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Closed Form Message
                </label>
                <textarea
                  value={config.closedMessage || ''}
                  onChange={(e) => setConfig({ ...config, closedMessage: e.target.value })}
                  placeholder="Direct form submissions are currently unavailable..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none min-h-[80px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Availability Status Badge Message
              </label>
              <Input
                value={config.availabilityStatus || ''}
                onChange={(e) => setConfig({ ...config, availabilityStatus: e.target.value })}
                placeholder="e.g. Available for engineering projects & commissions"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <span>📍</span> Contact Info & Direct Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Primary Contact Email
                </label>
                <Input
                  value={config.email || ''}
                  onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  placeholder="e.g. contact@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Location Text
                </label>
                <Input
                  value={config.location || ''}
                  onChange={(e) => setConfig({ ...config, location: e.target.value })}
                  placeholder="e.g. Based in Mumbai, India — Available Worldwide"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Resume Download URL
                </label>
                <Input
                  value={config.resumeUrl || ''}
                  onChange={(e) => setConfig({ ...config, resumeUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Resume Button Label
                </label>
                <Input
                  value={config.resumeLabel || ''}
                  onChange={(e) => setConfig({ ...config, resumeLabel: e.target.value })}
                  placeholder="Download Resume"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Contact Page CMS'}
          </Button>
        </div>
      </form>
    </div>
  );
}
