'use client';

import React, { useState } from 'react';
import { SocialLink } from '@/types/admin.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

interface SocialLinkFormProps {
  initialData?: Partial<SocialLink>;
  onSave: (data: Omit<SocialLink, 'id'> | Partial<SocialLink>) => Promise<void>;
  onCancel?: () => void;
  isSaving: boolean;
}

// Validates external URL strings against dangerous protocol schemes.
function isValidSafeUrl(urlStr: string): boolean {
  const lower = urlStr.trim().toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return false;
  }
  return true;
}

// Form editor component for creating and updating external social profile links.
export function SocialLinkForm({ initialData = {}, onSave, onCancel, isSaving }: SocialLinkFormProps) {
  const [formData, setFormData] = useState<Partial<SocialLink>>({
    platform: initialData.platform || 'github',
    label: initialData.label || '',
    url: initialData.url || '',
    icon: initialData.icon || '',
    displayOrder: initialData.displayOrder ?? 1,
    isVisible: initialData.isVisible ?? true,
  });

  const [error, setError] = useState<string | null>(null);

  // Updates form state values dynamically.
  const handleChange = (field: keyof SocialLink, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validates form input before triggering save action.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform?.trim()) {
      setError('Platform identifier is required.');
      return;
    }
    if (!formData.label?.trim()) {
      setError('Label is required.');
      return;
    }
    if (!formData.url?.trim()) {
      setError('URL is required.');
      return;
    }
    if (!isValidSafeUrl(formData.url)) {
      setError('The provided URL contains an unsafe or forbidden scheme.');
      return;
    }

    setError(null);
    try {
      await onSave(formData as Omit<SocialLink, 'id'>);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save social link.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
              Platform *
            </label>
            <select
              value={formData.platform}
              onChange={(e) => handleChange('platform', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="github">GitHub</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter / X</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="dribbble">Dribbble</option>
              <option value="behance">Behance</option>
              <option value="medium">Medium</option>
              <option value="other">Other Platform</option>
            </select>
          </div>

          <Input
            label="Display Label *"
            placeholder="e.g. GitHub Profile"
            value={formData.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
            required
          />
        </div>

        <Input
          label="Profile URL *"
          type="url"
          placeholder="https://github.com/username"
          value={formData.url || ''}
          onChange={(e) => handleChange('url', e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Input
            label="Icon Name / Class (optional)"
            placeholder="e.g. github, linkedin"
            value={formData.icon || ''}
            onChange={(e) => handleChange('icon', e.target.value)}
          />

          <Input
            label="Display Order"
            type="number"
            value={formData.displayOrder ?? 1}
            onChange={(e) => handleChange('displayOrder', parseInt(e.target.value, 10) || 0)}
          />

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">Visibility</label>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="socialIsVisible"
                checked={formData.isVisible}
                onChange={(e) => handleChange('isVisible', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-[var(--color-surface-elevated)] border-[var(--color-border)]"
              />
              <label htmlFor="socialIsVisible" className="text-xs text-[var(--color-text-muted)] cursor-pointer">
                Visible on public portfolio
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
          >
            {isSaving ? 'Saving Link...' : 'Save Social Link'}
          </Button>
        </div>
      </Card>
    </form>
  );
}
