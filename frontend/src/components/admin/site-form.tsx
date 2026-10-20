'use client';

import React, { useState } from 'react';
import { SiteSettings, MediaRef } from '@/types/admin.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { MediaSelector } from '@/components/admin/media-selector';
import { SeoForm } from '@/components/admin/seo-form';

interface SiteFormProps {
  initialData?: Partial<SiteSettings>;
  onSave: (data: Partial<SiteSettings>) => Promise<void>;
  isSaving: boolean;
}

// Form editor component for configuring global site branding and SEO.
export function SiteForm({ initialData = {}, onSave, isSaving }: SiteFormProps) {
  const [formData, setFormData] = useState<Partial<SiteSettings>>({
    siteName: initialData.siteName || '',
    siteTitle: initialData.siteTitle || '',
    siteSubtitle: initialData.siteSubtitle || '',
    shortDescription: initialData.shortDescription || '',
    logo: initialData.logo,
    favicon: initialData.favicon,
    copyrightText: initialData.copyrightText || `© ${new Date().getFullYear()} All rights reserved.`,
    seo: initialData.seo || {},
  });

  const [activeMediaTarget, setActiveMediaTarget] = useState<'logo' | 'favicon' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Updates form state values dynamically.
  const handleChange = (field: keyof SiteSettings, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handles form submission with validation.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.siteName?.trim()) {
      setError('Site Name is required.');
      return;
    }
    if (!formData.siteTitle?.trim()) {
      setError('Site Title is required.');
      return;
    }

    setError(null);
    try {
      await onSave(formData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save site settings.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <Card className="p-6 space-y-6">
        <div className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
          🎯 CONTROLS PUBLIC SECTION: Global Brand, Header Logo & Title (Public Site)
        </div>
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Brand & General Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Site Name *"
            placeholder="Lumenfolio"
            value={formData.siteName || ''}
            onChange={(e) => handleChange('siteName', e.target.value)}
            required
          />

          <Input
            label="Site Title *"
            placeholder="Full Stack Developer & Creative Technologist"
            value={formData.siteTitle || ''}
            onChange={(e) => handleChange('siteTitle', e.target.value)}
            required
          />
        </div>

        <Input
          label="Site Subtitle"
          placeholder="Building digital experiences & interactive artwork"
          value={formData.siteSubtitle || ''}
          onChange={(e) => handleChange('siteSubtitle', e.target.value)}
        />

        <div className="space-y-1">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">
            Short Description
          </label>
          <textarea
            rows={3}
            placeholder="Brief portfolio introduction..."
            value={formData.shortDescription || ''}
            onChange={(e) => handleChange('shortDescription', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Branding Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Logo Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">Logo Image</label>
            <div className="flex items-center gap-3">
              {formData.logo?.url ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
                  <img src={formData.logo.url} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-xs text-[var(--color-text-muted)]">
                  None
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveMediaTarget('logo')}
                className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
              >
                {formData.logo ? 'Change Logo' : 'Select Logo'}
              </Button>
            </div>
          </div>

          {/* Favicon Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">Favicon Icon</label>
            <div className="flex items-center gap-3">
              {formData.favicon?.url ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
                  <img src={formData.favicon.url} alt="Favicon" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-xs text-[var(--color-text-muted)]">
                  None
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveMediaTarget('favicon')}
                className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
              >
                {formData.favicon ? 'Change Favicon' : 'Select Favicon'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact & Availability */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Footer
        </h2>
        <Input
          label="Copyright Text"
          placeholder="© 2026 Developer Portfolio. All rights reserved."
          value={formData.copyrightText || ''}
          onChange={(e) => handleChange('copyrightText', e.target.value)}
        />
      </Card>

      {/* SEO Section */}
      <SeoForm
        seo={formData.seo}
        onChange={(seo) => handleChange('seo', seo)}
      />

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
        >
          {isSaving ? 'Saving Changes...' : 'Save Site Settings'}
        </Button>
      </div>

      <MediaSelector
        isOpen={activeMediaTarget !== null}
        onClose={() => setActiveMediaTarget(null)}
        onSelect={(media: MediaRef) => {
          if (activeMediaTarget === 'logo') {
            handleChange('logo', media);
          } else if (activeMediaTarget === 'favicon') {
            handleChange('favicon', media);
          }
        }}
        title={`Select ${activeMediaTarget === 'logo' ? 'Logo Image' : 'Favicon Icon'}`}
        category="site"
      />
    </form>
  );
}
