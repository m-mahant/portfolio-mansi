'use client';

// Admin CMS for public Development listing page chrome (/work/development).

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { DevelopmentPageConfig } from '@/types/admin.types';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SeoForm } from '@/components/admin/seo-form';

export default function AdminDevelopmentPage() {
  const { idToken } = useAdminAuth();
  const [config, setConfig] = useState<Partial<DevelopmentPageConfig>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [newStep, setNewStep] = useState('');

  const handleAddService = () => {
    if (!newServiceTitle.trim() || !newServiceDescription.trim()) return;
    const current = config.services || [];
    setConfig({
      ...config,
      services: [...current, { title: newServiceTitle.trim(), description: newServiceDescription.trim() }],
    });
    setNewServiceTitle('');
    setNewServiceDescription('');
  };

  const handleRemoveService = (index: number) => {
    setConfig({ ...config, services: (config.services || []).filter((_, i) => i !== index) });
  };

  const handleAddStep = () => {
    if (!newStep.trim()) return;
    setConfig({ ...config, processSteps: [...(config.processSteps || []), newStep.trim()] });
    setNewStep('');
  };

  const handleRemoveStep = (index: number) => {
    setConfig({ ...config, processSteps: (config.processSteps || []).filter((_, i) => i !== index) });
  };

  useEffect(() => {
    async function loadData() {
      if (!idToken) return;
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getDevelopmentPageConfig(idToken);
        setConfig(data || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Development Page configuration');
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
      const updated = await adminApi.updateDevelopmentPageConfig(config, idToken);
      setConfig(updated);
      setSuccess('Development page configuration saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update Development Page configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Development Page CMS..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💻</span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Development Page CMS</h1>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Controls the header on public /work/development. Project items stay in Content Catalogs → Projects.
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="glass-panel">
          <CardHeader>
            <div className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              CONTROLS PUBLIC SECTION: /work/development header
            </div>
            <CardTitle className="text-base font-bold">Page Header</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Page Title</label>
              <Input
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                placeholder="e.g. Software Development Portfolio"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Subtitle</label>
              <textarea
                value={config.subtitle || ''}
                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                placeholder="Short intro under the title..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--color-text)] outline-none min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <div className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              CONTROLS PUBLIC SECTION: /work/development services block
            </div>
            <CardTitle className="text-base font-bold">Services &amp; Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Section Heading</label>
              <Input
                value={config.servicesHeading || ''}
                onChange={(e) => setConfig({ ...config, servicesHeading: e.target.value })}
                placeholder="e.g. Work With Me"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-2">Services Offered</label>
              <div className="space-y-2 mb-3">
                {(config.services || []).map((service, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--color-text)]">{service.title}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{service.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(i)}
                      className="text-[var(--color-text-muted)] hover:text-red-400 text-xs shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="space-y-2 p-3 rounded-xl border border-dashed border-[var(--glass-border)]">
                <Input
                  value={newServiceTitle}
                  onChange={(e) => setNewServiceTitle(e.target.value)}
                  placeholder="Service title, e.g. Maintenance & Support"
                />
                <textarea
                  value={newServiceDescription}
                  onChange={(e) => setNewServiceDescription(e.target.value)}
                  placeholder="Short description of this service..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--color-text)] outline-none min-h-[60px]"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddService}>
                  Add Service
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-2">How I Work (process steps)</label>
              <div className="space-y-1.5 mb-3">
                {(config.processSteps || []).map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                  >
                    <span className="text-xs text-[var(--color-text)]">
                      {i + 1}. {step}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(i)}
                      className="text-[var(--color-text-muted)] hover:text-red-400 text-xs shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  placeholder="e.g. Share your project or problem"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddStep}>
                  Add Step
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">CTA Button Label</label>
                <Input
                  value={config.ctaLabel || ''}
                  onChange={(e) => setConfig({ ...config, ctaLabel: e.target.value })}
                  placeholder="e.g. Start a Project"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">CTA Link</label>
                <Input
                  value={config.ctaTarget || ''}
                  onChange={(e) => setConfig({ ...config, ctaTarget: e.target.value })}
                  placeholder="/contact?type=new-build"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <SeoForm seo={config.seo} onChange={(seo) => setConfig({ ...config, seo })} />

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Development Page CMS'}
          </Button>
        </div>
      </form>
    </div>
  );
}
