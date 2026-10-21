'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Project, MediaRef, PublishStatus } from '@/types/admin.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { MediaSelector } from '@/components/admin/media-selector';
import { SeoForm } from '@/components/admin/seo-form';

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSave: (data: Omit<Project, 'id'> | Partial<Project>) => Promise<void>;
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

// Validates URL schemes against dangerous protocols like javascript: or data:.
function isValidSafeUrl(urlStr: string): boolean {
  const lower = urlStr.trim().toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return false;
  }
  return true;
}

// Form editor component for creating and updating engineering project case studies.
export function ProjectForm({ initialData = {}, onSave, isSaving }: ProjectFormProps) {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: initialData.title || '',
    slug: initialData.slug || '',
    subtitle: initialData.subtitle || '',
    shortDescription: initialData.shortDescription || '',
    description: initialData.description || '',
    coverImage: initialData.coverImage,
    status: initialData.status || 'draft',
    isFeatured: initialData.isFeatured ?? false,
    displayOrder: initialData.displayOrder ?? 1,
    tags: initialData.tags || [],
    technologies: initialData.technologies || [],
    overview: initialData.overview || '',
    problem: initialData.problem || '',
    solution: initialData.solution || '',
    features: initialData.features || [],
    architecture: initialData.architecture || { enabled: false, description: '' },
    workflow: initialData.workflow || { enabled: false, steps: [] },
    apiFlow: initialData.apiFlow || { enabled: false, endpoints: [] },
    performance: initialData.performance || { enabled: false, summary: '', metrics: [] },
    challenges: initialData.challenges || '',
    results: initialData.results || '',
    gallery: initialData.gallery || [],
    links: initialData.links || [],
    seo: initialData.seo || {},
  });

  const [activeMediaTarget, setActiveMediaTarget] = useState<
    'cover' | 'archDiagram' | 'gallery' | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  // Updates form state values dynamically.
  const handleChange = (field: keyof Project, value: unknown) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !prev.slug) {
        updated.slug = generateSlug(value as string);
      }
      return updated;
    });
  };

  // Adds a tag or technology chip item.
  const handleAddChip = (field: 'tags' | 'technologies', inputStr: string) => {
    const trimmed = inputStr.trim();
    if (!trimmed) return;
    const current = (formData[field] as string[]) || [];
    if (!current.includes(trimmed)) {
      handleChange(field, [...current, trimmed]);
    }
  };

  // Removes a chip item from tags or technologies.
  const handleRemoveChip = (field: 'tags' | 'technologies', itemToRemove: string) => {
    const current = (formData[field] as string[]) || [];
    handleChange(field, current.filter((item) => item !== itemToRemove));
  };

  // Adds a new feature item to the project features list.
  const handleAddFeature = (title: string, description: string) => {
    if (!title.trim()) return;
    const current = formData.features || [];
    handleChange('features', [...current, { title: title.trim(), description: description.trim() }]);
  };

  // Removes a feature item from the list.
  const handleRemoveFeature = (index: number) => {
    handleChange('features', (formData.features || []).filter((_, i) => i !== index));
  };

  // Adds a new link item (e.g. GitHub, Live Demo) with scheme validation.
  const handleAddLink = (label: string, url: string, type: string) => {
    if (!label.trim() || !url.trim()) return;
    if (!isValidSafeUrl(url)) {
      setError('Invalid link URL protocol scheme.');
      return;
    }
    const current = formData.links || [];
    handleChange('links', [
      ...current,
      { label: label.trim(), url: url.trim(), type: type || 'external', isVisible: true, displayOrder: current.length + 1 },
    ]);
  };

  // Removes a link from the project links list.
  const handleRemoveLink = (index: number) => {
    handleChange('links', (formData.links || []).filter((_, i) => i !== index));
  };

  // Opens the media selector modal ensuring a project title and slug exist first.
  const handleOpenMediaSelector = (target: 'cover' | 'archDiagram' | 'gallery') => {
    if (!formData.title?.trim() || !formData.slug?.trim()) {
      setError('Enter a project name/slug before uploading media.');
      return;
    }
    setError(null);
    setActiveMediaTarget(target);
  };

  // Reorders gallery images position up or down.
  const handleMoveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const images = [...(formData.gallery || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const temp = images[index];
    images[index] = images[targetIndex];
    images[targetIndex] = temp;

    const reordered = images.map((img, i) => ({ ...img, displayOrder: i + 1 }));
    handleChange('gallery', reordered);
  };

  // Validates project form inputs prior to saving.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setError('Project Title is required.');
      return;
    }
    if (!formData.slug?.trim()) {
      setError('URL Slug is required.');
      return;
    }
    if (!formData.shortDescription?.trim()) {
      setError('Short Description is required.');
      return;
    }

    // Validate any links URLs
    for (const link of formData.links || []) {
      if (!isValidSafeUrl(link.url)) {
        setError(`Unsafe URL scheme detected in link "${link.label}".`);
        return;
      }
    }

    setError(null);
    try {
      await onSave(formData as Omit<Project, 'id'>);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save project.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Basic Information */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Basic Project Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Project Title *"
            placeholder="e.g. Antigravity AI Engine"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />

          <Input
            label="URL Slug *"
            placeholder="e.g. antigravity-ai-engine"
            value={formData.slug || ''}
            onChange={(e) => handleChange('slug', generateSlug(e.target.value))}
            required
          />
        </div>

        <Input
          label="Subtitle / Tagline"
          placeholder="e.g. High-throughput distributed agent platform"
          value={formData.subtitle || ''}
          onChange={(e) => handleChange('subtitle', e.target.value)}
        />

        <div className="space-y-1">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">
            Short Description *
          </label>
          <textarea
            rows={3}
            placeholder="Brief summary for project cards and search listings..."
            value={formData.shortDescription || ''}
            onChange={(e) => handleChange('shortDescription', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
        </div>

        {/* Tags & Technologies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">Project Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="projTagInput"
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
                  const el = document.getElementById('projTagInput') as HTMLInputElement;
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
                {(formData.tags || []).map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-surface-elevated)] text-[var(--color-text)] text-xs border border-[var(--color-border)]">
                    {tag}
                    <button type="button" onClick={() => handleRemoveChip('tags', tag)} className="hover:text-red-400 font-bold">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">Technologies Used</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="projTechInput"
                placeholder="Add tech..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChip('technologies', (e.target as HTMLInputElement).value);
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
                  const el = document.getElementById('projTechInput') as HTMLInputElement;
                  if (el) {
                    handleAddChip('technologies', el.value);
                    el.value = '';
                  }
                }}
                className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
              >
                Add Tech
              </Button>
            </div>
            {(formData.technologies || []).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {(formData.technologies || []).map((tech) => (
                  <span key={tech} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-xs border border-[var(--color-primary-border)]">
                    {tech}
                    <button type="button" onClick={() => handleRemoveChip('technologies', tech)} className="hover:text-red-400 font-bold">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Cover Image */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Cover Image / Hero Banner
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {formData.coverImage?.url ? (
            <div className="w-full max-w-56 aspect-video rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] relative">
              <Image src={formData.coverImage.url} alt={formData.title || 'Cover'} fill sizes="224px" className="object-cover" />
            </div>
          ) : (
            <div className="w-full max-w-56 aspect-video rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-xs text-[var(--color-text-muted)]">
              No Cover Image Selected
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenMediaSelector('cover')}
            className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
          >
            {formData.coverImage ? 'Change Cover Image' : 'Select Cover Image'}
          </Button>
        </div>
      </Card>

      {/* Optional Content Sections */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Optional Case Study Sections
        </h2>
        <p className="text-xs text-[var(--color-text-muted)]">
          Leave optional sections empty if not applicable. The backend automatically computes available sections for public display.
        </p>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">Overview</label>
            <textarea
              rows={3}
              placeholder="High-level project overview..."
              value={formData.overview || ''}
              onChange={(e) => handleChange('overview', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[var(--color-text-muted)]">Problem Statement</label>
              <textarea
                rows={4}
                placeholder="The core problem solved by this project..."
                value={formData.problem || ''}
                onChange={(e) => handleChange('problem', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-[var(--color-text-muted)]">Solution Approach</label>
              <textarea
                rows={4}
                placeholder="The technical solution architecture and design..."
                value={formData.solution || ''}
                onChange={(e) => handleChange('solution', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[var(--color-text-muted)]">Technical Challenges</label>
              <textarea
                rows={3}
                placeholder="Key engineering challenges faced during development..."
                value={formData.challenges || ''}
                onChange={(e) => handleChange('challenges', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-[var(--color-text-muted)]">Results & Impact</label>
              <textarea
                rows={3}
                placeholder="Measurable results, performance gains, or user impact..."
                value={formData.results || ''}
                onChange={(e) => handleChange('results', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Features List */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Key Features Highlight List
        </h2>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            id="featTitleInput"
            placeholder="Feature Title..."
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="text"
            id="featDescInput"
            placeholder="Feature Description..."
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const tEl = document.getElementById('featTitleInput') as HTMLInputElement;
              const dEl = document.getElementById('featDescInput') as HTMLInputElement;
              if (tEl && dEl) {
                handleAddFeature(tEl.value, dEl.value);
                tEl.value = '';
                dEl.value = '';
              }
            }}
            className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs whitespace-nowrap"
          >
            + Add Feature
          </Button>
        </div>

        {(formData.features || []).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(formData.features || []).map((feat, idx) => (
              <div key={idx} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-lg flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text)]">{feat.title}</h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{feat.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="text-red-400 hover:text-red-300 text-xs ml-2 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Architecture Diagram Media */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--color-border)] pb-3">
          <h2 className="text-lg font-bold text-[var(--color-text)]">System Architecture Diagram</h2>
          <label className="flex items-center gap-2 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={formData.architecture?.enabled || false}
              onChange={(e) =>
                handleChange('architecture', {
                  ...formData.architecture,
                  enabled: e.target.checked,
                })
              }
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-[var(--color-surface-elevated)] border-[var(--color-border)]"
            />
            <span className="text-xs font-medium text-[var(--color-text-muted)]">Enable Architecture Section</span>
          </label>
        </div>

        {formData.architecture?.enabled && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[var(--color-text-muted)]">Architecture Description</label>
              <textarea
                rows={3}
                placeholder="High-level architectural narrative..."
                value={formData.architecture?.description || ''}
                onChange={(e) =>
                  handleChange('architecture', {
                    ...formData.architecture,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {formData.architecture?.diagramUrl ? (
                <div className="w-full max-w-56 aspect-video rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] relative">
                  <Image src={formData.architecture.diagramUrl} alt="Architecture Diagram" fill sizes="224px" className="object-cover" />
                </div>
              ) : (
                <div className="w-full max-w-56 aspect-video rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-xs text-[var(--color-text-muted)]">
                  No Diagram Image Attached
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenMediaSelector('archDiagram')}
                className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
              >
                {formData.architecture?.diagramUrl ? 'Change Diagram' : 'Select Diagram Media'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* External Links */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          External Links (Live Demo, GitHub, Docs)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <input
            type="text"
            id="linkTitleInput"
            placeholder="Link Label (e.g. GitHub)..."
            className="px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="url"
            id="linkUrlInput"
            placeholder="https://..."
            className="sm:col-span-2 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const lEl = document.getElementById('linkTitleInput') as HTMLInputElement;
              const uEl = document.getElementById('linkUrlInput') as HTMLInputElement;
              if (lEl && uEl) {
                handleAddLink(lEl.value, uEl.value, 'external');
                lEl.value = '';
                uEl.value = '';
              }
            }}
            className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
          >
            + Add Link
          </Button>
        </div>

        {(formData.links || []).length > 0 && (
          <div className="space-y-2 pt-2">
            {(formData.links || []).map((link, idx) => (
              <div key={idx} className="flex justify-between items-center bg-[var(--color-surface)] p-2.5 rounded-lg border border-[var(--color-border)] text-xs">
                <div className="truncate pr-2">
                  <span className="font-bold text-[var(--color-text)]">{link.label}: </span>
                  <span className="text-[var(--color-text-muted)]">{link.url}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(idx)}
                  className="text-red-400 hover:text-red-300 font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Gallery Images */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--color-border)] pb-3">
          <h2 className="text-lg font-bold text-[var(--color-text)]">Project Screenshots & Gallery</h2>
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

        {(formData.gallery || []).length === 0 ? (
          <div className="text-center py-6 text-xs text-[var(--color-text-muted)]">
            No gallery screenshots attached.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(formData.gallery || []).map((img, idx) => (
              <div key={idx} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 space-y-2">
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-[var(--color-surface-elevated)] relative">
                  <Image src={img.url} alt={img.altText || 'Gallery'} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="flex justify-between items-center pt-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveGalleryImage(idx, 'up')}
                      className="px-2 py-0.5 rounded bg-[var(--color-surface-elevated)] hover:opacity-80 text-xs text-[var(--color-text)] disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      disabled={idx === (formData.gallery || []).length - 1}
                      onClick={() => handleMoveGalleryImage(idx, 'down')}
                      className="px-2 py-0.5 rounded bg-[var(--color-surface-elevated)] hover:opacity-80 text-xs text-[var(--color-text)] disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (formData.gallery || []).filter((_, i) => i !== idx);
                      handleChange('gallery', updated);
                    }}
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

      {/* Status, Featured & Display Order */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Publishing Lifecycle & Featuring
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">Featured Highlight</label>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isFeaturedToggle"
                checked={formData.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-[var(--color-surface-elevated)] border-[var(--color-border)] cursor-pointer"
              />
              <label htmlFor="isFeaturedToggle" className="text-xs text-[var(--color-text-muted)] cursor-pointer">
                Highlight as Featured Project
              </label>
            </div>
          </div>
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
          {isSaving ? 'Saving Project...' : 'Save Project Record'}
        </Button>
      </div>

      <MediaSelector
        isOpen={activeMediaTarget !== null}
        onClose={() => setActiveMediaTarget(null)}
        onSelect={(media: MediaRef) => {
          if (activeMediaTarget === 'cover') {
            handleChange('coverImage', media);
          } else if (activeMediaTarget === 'archDiagram') {
            handleChange('architecture', {
              ...formData.architecture,
              enabled: true,
              diagramMediaId: media.mediaId || media.id,
              diagramUrl: media.url,
            });
          } else if (activeMediaTarget === 'gallery') {
            const currentGal = formData.gallery || [];
            handleChange('gallery', [
              ...currentGal,
              {
                mediaId: media.mediaId || media.id || '',
                url: media.url,
                storagePath: media.storagePath || media.url,
                altText: media.altText,
                displayOrder: currentGal.length + 1,
              },
            ]);
          }
        }}
        title={`Select ${
          activeMediaTarget === 'cover'
            ? 'Cover Image'
            : activeMediaTarget === 'archDiagram'
            ? 'Architecture Diagram Image'
            : 'Gallery Screenshot'
        }`}
        category="project"
        slug={formData.slug}
        sectionContext={activeMediaTarget || undefined}
      />
    </form>
  );
}
