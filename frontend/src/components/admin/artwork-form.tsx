'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Artwork, ArtworkImage, MediaRef, PublishStatus } from '@/types/admin.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { MediaSelector } from '@/components/admin/media-selector';
import { SeoForm } from '@/components/admin/seo-form';

interface ArtworkFormProps {
  initialData?: Partial<Artwork>;
  onSave: (data: Omit<Artwork, 'id'> | Partial<Artwork>) => Promise<void>;
  isSaving: boolean;
}

// Converts a title string into an SEO-friendly URL slug.
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Form editor component for creating and updating artwork & creative craft portfolio entries.
export function ArtworkForm({ initialData = {}, onSave, isSaving }: ArtworkFormProps) {
  const [formData, setFormData] = useState<Partial<Artwork>>({
    title: initialData.title || '',
    slug: initialData.slug || '',
    subtitle: initialData.subtitle || '',
    shortDescription: initialData.shortDescription || '',
    description: initialData.description || '',
    category: initialData.category || 'Digital Art',
    tags: initialData.tags || [],
    materials: initialData.materials || [],
    year: initialData.year || new Date().getFullYear().toString(),
    dimensions: initialData.dimensions || '',
    inspiration: initialData.inspiration || '',
    process: initialData.process || '',
    story: initialData.story || '',
    featuredImage: initialData.featuredImage,
    images: initialData.images || [],
    status: initialData.status || 'draft',
    displayOrder: initialData.displayOrder ?? 1,
    seo: initialData.seo || {},
  });

  const [activeMediaTarget, setActiveMediaTarget] = useState<'featured' | 'gallery' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dynamically updates form fields and auto-generates slug when title changes if slug was unmodified.
  const handleChange = (field: keyof Artwork, value: unknown) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !prev.slug) {
        updated.slug = generateSlug(value as string);
      }
      return updated;
    });
  };

  // Adds an item tag to materials or tags arrays.
  const handleAddChip = (field: 'materials' | 'tags', chipInput: string) => {
    const trimmed = chipInput.trim();
    if (!trimmed) return;
    const currentList = (formData[field] as string[]) || [];
    if (!currentList.includes(trimmed)) {
      handleChange(field, [...currentList, trimmed]);
    }
  };

  // Removes a chip item.
  const handleRemoveChip = (field: 'materials' | 'tags', chipToRemove: string) => {
    const currentList = (formData[field] as string[]) || [];
    handleChange(field, currentList.filter((item) => item !== chipToRemove));
  };

  // Removes an image from the gallery array.
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    const updatedImages = (formData.images || []).filter((_, idx) => idx !== indexToRemove);
    handleChange('images', updatedImages);
  };

  // Reorders a gallery image position up or down.
  const handleMoveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const images = [...(formData.images || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const temp = images[index];
    images[index] = images[targetIndex];
    images[targetIndex] = temp;

    // Update displayOrder attributes
    const reordered = images.map((img, i) => ({ ...img, displayOrder: i + 1 }));
    handleChange('images', reordered);
  };

  // Opens the media selector modal ensuring an artwork title and slug exist first.
  const handleOpenMediaSelector = (target: 'featured' | 'gallery') => {
    if (!formData.title?.trim() || !formData.slug?.trim()) {
      setError('Enter an artwork title/slug before uploading media.');
      return;
    }
    setError(null);
    setActiveMediaTarget(target);
  };

  // Validates form input before initiating save dispatch.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setError('Artwork Title is required.');
      return;
    }
    if (!formData.slug?.trim()) {
      setError('Slug is required.');
      return;
    }
    if (!formData.category?.trim()) {
      setError('Category is required.');
      return;
    }

    setError(null);
    try {
      await onSave(formData as Omit<Artwork, 'id'>);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save artwork.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Basic Information */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Basic Artwork Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Artwork Title *"
            placeholder="e.g. Celestial Symphony No. 4"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />

          <Input
            label="URL Slug *"
            placeholder="e.g. celestial-symphony-no-4"
            value={formData.slug || ''}
            onChange={(e) => handleChange('slug', generateSlug(e.target.value))}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="Digital Art">Digital Art</option>
              <option value="Illustration">Illustration</option>
              <option value="Portrait">Portrait</option>
              <option value="Fantasy & Concept Art">Fantasy & Concept Art</option>
              <option value="Nature & Botanical">Nature & Botanical</option>
              <option value="Abstract Art">Abstract Art</option>
              <option value="Photography">Photography</option>
              <option value="3D Render">3D Render</option>
              <option value="Generative Artwork">Generative Artwork</option>
              <option value="Physical Artwork">Physical Artwork</option>
              <option value="Interactive Craft">Interactive Craft</option>
              <option value="Other Craft">Other Craft</option>
            </select>
          </div>

          <Input
            label="Creation Year"
            placeholder="e.g. 2026"
            value={formData.year || ''}
            onChange={(e) => handleChange('year', e.target.value)}
          />

          <Input
            label="Dimensions / Specs"
            placeholder="e.g. 3840 × 2160 px or 24 × 36 in"
            value={formData.dimensions || ''}
            onChange={(e) => handleChange('dimensions', e.target.value)}
          />
        </div>

        <Input
          label="Subtitle / Catchphrase"
          placeholder="e.g. Generative shader experiment exploring chaos theory"
          value={formData.subtitle || ''}
          onChange={(e) => handleChange('subtitle', e.target.value)}
        />

        <div className="space-y-1">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">
            Short Summary Description
          </label>
          <textarea
            rows={3}
            placeholder="Brief summary for card preview..."
            value={formData.shortDescription || ''}
            onChange={(e) => handleChange('shortDescription', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Materials & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">Materials / Mediums Used</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="materialInput"
                placeholder="e.g. GLSL, Three.js, Canvas 2D..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChip('materials', (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const el = document.getElementById('materialInput') as HTMLInputElement;
                  if (el) {
                    handleAddChip('materials', el.value);
                    el.value = '';
                  }
                }}
                className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
              >
                Add Medium
              </Button>
            </div>
            {(formData.materials || []).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {(formData.materials || []).map((mat) => (
                  <span key={mat} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-surface-elevated)] text-[var(--color-text)] text-xs border border-[var(--color-border)]">
                    {mat}
                    <button type="button" onClick={() => handleRemoveChip('materials', mat)} className="hover:text-red-400 font-bold">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">Category Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="artTagInput"
                placeholder="Add tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChip('tags', (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const el = document.getElementById('artTagInput') as HTMLInputElement;
                  if (el) {
                    handleAddChip('tags', el.value);
                    el.value = '';
                  }
                }}
                className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
              >
                Add Tag
              </Button>
            </div>
            {(formData.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {(formData.tags || []).map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950/60 text-indigo-300 text-xs border border-indigo-800">
                    {t}
                    <button type="button" onClick={() => handleRemoveChip('tags', t)} className="hover:text-red-400 font-bold">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Featured Media */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Featured Image / Hero Banner
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {formData.featuredImage?.url ? (
            <div className="w-48 aspect-video rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] relative">
              <Image src={formData.featuredImage.url} alt={formData.title || 'Artwork'} fill sizes="192px" className="object-cover" />
            </div>
          ) : (
            <div className="w-48 aspect-video rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-xs text-[var(--color-text-muted)]">
              No Featured Image
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenMediaSelector('featured')}
            className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
          >
            {formData.featuredImage ? 'Change Featured Image' : 'Select Featured Image'}
          </Button>
        </div>
      </Card>

      {/* Story & Creative Process Sections */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Artwork Narrative & Creative Process
        </h2>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">Inspiration & Concept</label>
          <textarea
            rows={3}
            placeholder="The artistic inspiration behind this piece..."
            value={formData.inspiration || ''}
            onChange={(e) => handleChange('inspiration', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">Creative Process & Technique</label>
          <textarea
            rows={4}
            placeholder="Technical and creative step-by-step process..."
            value={formData.process || ''}
            onChange={(e) => handleChange('process', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">Behind-The-Scenes Story</label>
          <textarea
            rows={4}
            placeholder="Background story or anecdote about creating this piece..."
            value={formData.story || ''}
            onChange={(e) => handleChange('story', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </Card>

      {/* Artwork Gallery */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--color-border)] pb-3">
          <h2 className="text-lg font-bold text-[var(--color-text)]">Artwork Image Gallery</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleOpenMediaSelector('gallery')}
            className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
          >
            + Add Gallery Image
          </Button>
        </div>

        {(formData.images || []).length === 0 ? (
          <div className="text-center py-8 text-xs text-[var(--color-text-muted)]">
            No gallery images attached yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(formData.images || []).map((img, idx) => (
              <div key={idx} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 space-y-2">
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-[var(--color-surface-elevated)] relative">
                  <Image src={img.url} alt={img.altText || 'Gallery'} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <Input
                  placeholder="Image caption / description..."
                  value={img.caption || ''}
                  onChange={(e) => {
                    const updated = [...(formData.images || [])];
                    updated[idx] = { ...updated[idx], caption: e.target.value };
                    handleChange('images', updated);
                  }}
                  className="text-xs"
                />
                <div className="flex justify-between items-center pt-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveGalleryImage(idx, 'up')}
                      className="px-2 py-0.5 rounded bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface)] text-xs text-[var(--color-text)] disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      disabled={idx === (formData.images || []).length - 1}
                      onClick={() => handleMoveGalleryImage(idx, 'down')}
                      className="px-2 py-0.5 rounded bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface)] text-xs text-[var(--color-text)] disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="text-xs font-bold text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Publishing Status & Controls */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Publishing Lifecycle & Order
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
              Publish Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as PublishStatus)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="draft">Draft (Hidden from public site)</option>
              <option value="published">Published (Visible to public)</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <Input
            label="Display Order"
            type="number"
            value={formData.displayOrder ?? 1}
            onChange={(e) => handleChange('displayOrder', parseInt(e.target.value, 10) || 0)}
          />
        </div>
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
          {isSaving ? 'Saving Artwork...' : 'Save Artwork Record'}
        </Button>
      </div>

      <MediaSelector
        isOpen={activeMediaTarget !== null}
        onClose={() => setActiveMediaTarget(null)}
        onSelect={(media: MediaRef) => {
          if (activeMediaTarget === 'featured') {
            handleChange('featuredImage', media);
          } else if (activeMediaTarget === 'gallery') {
            const currentImages = formData.images || [];
            const newImg: ArtworkImage = {
              mediaId: media.mediaId || media.id || '',
              url: media.url,
              storagePath: media.storagePath || media.url,
              altText: media.altText,
              displayOrder: currentImages.length + 1,
            };
            handleChange('images', [...currentImages, newImg]);
          }
        }}
        title={`Select ${activeMediaTarget === 'featured' ? 'Featured Image' : 'Gallery Image'}`}
        category="artwork"
        slug={formData.slug}
        sectionContext={activeMediaTarget || undefined}
      />
    </form>
  );
}
