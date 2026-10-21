'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AboutProfile, MediaRef } from '@/types/admin.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { MediaSelector } from '@/components/admin/media-selector';
import { SeoForm } from '@/components/admin/seo-form';

interface AboutFormProps {
  initialData?: Partial<AboutProfile>;
  onSave: (data: Partial<AboutProfile>) => Promise<void>;
  isSaving: boolean;
}

// Form editor for About page story, dual identity, capabilities, and story portrait.
export function AboutForm({ initialData = {}, onSave, isSaving }: AboutFormProps) {
  const [formData, setFormData] = useState<Partial<AboutProfile>>({
    myStory: initialData.myStory || '',
    whatIDo: initialData.whatIDo || [],
    developerSide: initialData.developerSide || '',
    artistSide: initialData.artistSide || '',
    philosophy: initialData.philosophy || '',
    interests: initialData.interests || [],
    secondaryImage: initialData.secondaryImage,
    seo: initialData.seo || {},
  });

  const [mediaOpen, setMediaOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Updates form fields dynamically.
  const handleChange = (field: keyof AboutProfile, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Adds an item to string array lists (whatIDo or interests).
  const handleAddArrayItem = (field: 'whatIDo' | 'interests', itemInput: string) => {
    const trimmed = itemInput.trim();
    if (!trimmed) return;
    const currentList = (formData[field] as string[]) || [];
    if (!currentList.includes(trimmed)) {
      handleChange(field, [...currentList, trimmed]);
    }
  };

  // Removes an item from string array lists.
  const handleRemoveArrayItem = (field: 'whatIDo' | 'interests', itemToRemove: string) => {
    const currentList = (formData[field] as string[]) || [];
    handleChange(field, currentList.filter((item) => item !== itemToRemove));
  };

  // Saves only About-page fields so Home fallback profile data is not overwritten.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.myStory?.trim()) {
      setError('My Story is required.');
      return;
    }

    setError(null);
    try {
      await onSave({
        myStory: formData.myStory,
        whatIDo: formData.whatIDo,
        developerSide: formData.developerSide,
        artistSide: formData.artistSide,
        philosophy: formData.philosophy,
        interests: formData.interests,
        secondaryImage: formData.secondaryImage,
        seo: formData.seo,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save about profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <Card className="p-6 space-y-4">
        <div className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[11px] font-mono font-bold uppercase tracking-wider">
          Controls public About photo only — Home has its own portrait in Home CMS.
        </div>
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          My Story
        </h2>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">Story *</label>
          <textarea
            rows={6}
            placeholder="Personal journey narrative..."
            value={formData.myStory || ''}
            onChange={(e) => handleChange('myStory', e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div className="space-y-2 pt-2">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">
            Story Portrait (About page only)
          </label>
          <div className="flex items-center gap-3">
            {formData.secondaryImage?.url ? (
              <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
                <Image src={formData.secondaryImage.url} alt="Story" fill sizes="64px" className="object-cover" />
              </div>
            ) : (
              <div className="w-16 h-20 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-xs text-[var(--color-text-muted)]">
                None
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMediaOpen(true)}
              className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
            >
              {formData.secondaryImage ? 'Change Image' : 'Select Image'}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Dual Identity & Philosophy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">The Developer Side</label>
            <textarea
              rows={4}
              placeholder="Engineering practices and tech stack expertise..."
              value={formData.developerSide || ''}
              onChange={(e) => handleChange('developerSide', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">The Artist Side</label>
            <textarea
              rows={4}
              placeholder="Creative direction, visual aesthetics, and craft background..."
              value={formData.artistSide || ''}
              onChange={(e) => handleChange('artistSide', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">Core Philosophy</label>
          <textarea
            rows={3}
            placeholder="Your guiding design and engineering philosophy..."
            value={formData.philosophy || ''}
            onChange={(e) => handleChange('philosophy', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Capabilities & Personal Interests
        </h2>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">
            What I Do (Capabilities & Offerings)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="whatIDoInput"
              placeholder="e.g. Full Stack Web Apps, Generative Art..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddArrayItem('whatIDo', (e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const el = document.getElementById('whatIDoInput') as HTMLInputElement;
                if (el) {
                  handleAddArrayItem('whatIDo', el.value);
                  el.value = '';
                }
              }}
              className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
            >
              Add Capability
            </Button>
          </div>

          {(formData.whatIDo || []).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {(formData.whatIDo || []).map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30 text-xs"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('whatIDo', item)}
                    className="hover:text-red-400 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">
            Interests & Hobbies
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="interestsInput"
              placeholder="e.g. Photography, Algorithmic Trading, UI Design..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddArrayItem('interests', (e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const el = document.getElementById('interestsInput') as HTMLInputElement;
                if (el) {
                  handleAddArrayItem('interests', el.value);
                  el.value = '';
                }
              }}
              className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
            >
              Add Interest
            </Button>
          </div>

          {(formData.interests || []).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {(formData.interests || []).map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text)] border border-[var(--color-border)] text-xs"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('interests', item)}
                    className="hover:text-red-400 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>

      <SeoForm seo={formData.seo} onChange={(seo) => handleChange('seo', seo)} />

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
        >
          {isSaving ? 'Saving Changes...' : 'Save About Profile'}
        </Button>
      </div>

      <MediaSelector
        isOpen={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(media: MediaRef) => {
          handleChange('secondaryImage', media);
        }}
        title="Select Story Portrait"
        category="about"
      />
    </form>
  );
}
