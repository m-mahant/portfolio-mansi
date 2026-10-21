'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Blog, BlogStatus, MediaRef } from '@/types/admin.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { MediaSelector } from '@/components/admin/media-selector';
import { SeoForm } from '@/components/admin/seo-form';

interface BlogFormProps {
  initialData?: Partial<Blog>;
  onSave: (data: Partial<Blog>) => Promise<void>;
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

// Form editor component for creating and updating blog posts.
export function BlogForm({ initialData = {}, onSave, isSaving }: BlogFormProps) {
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: initialData.title || '',
    slug: initialData.slug || '',
    content: initialData.content || '',
    excerpt: initialData.excerpt || '',
    category: initialData.category || 'General',
    tags: initialData.tags || [],
    status: initialData.status || 'draft',
    featuredImage: initialData.featuredImage,
    seo: initialData.seo || {},
  });

  const [tagInput, setTagInput] = useState('');
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamically updates form fields and auto-generates slug when title changes.
  const handleChange = (field: keyof Blog, value: unknown) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !prev.slug) {
        updated.slug = generateSlug(value as string);
      }
      return updated;
    });
  };

  // Adds a tag chip.
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    const currentTags = formData.tags || [];
    if (!currentTags.includes(trimmed)) {
      handleChange('tags', [...currentTags, trimmed]);
    }
    setTagInput('');
  };

  // Removes a tag chip.
  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = formData.tags || [];
    handleChange('tags', currentTags.filter((t) => t !== tagToRemove));
  };

  // Opens media selector modal ensuring title and slug exist.
  const handleOpenMediaSelector = () => {
    if (!formData.title?.trim() || !formData.slug?.trim()) {
      setError('Enter a blog title and URL slug before uploading media.');
      return;
    }
    setError(null);
    setIsMediaSelectorOpen(true);
  };

  // Validates form input before saving.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setError('Blog Title is required.');
      return;
    }
    if (!formData.slug?.trim()) {
      setError('URL Slug is required.');
      return;
    }
    if (!formData.content?.trim()) {
      setError('Blog Content is required.');
      return;
    }

    setError(null);
    try {
      await onSave(formData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save blog post.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Basic Post Information */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Blog Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Post Title *"
            placeholder="e.g. Exploring Modern Generative Art Workflows"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />

          <Input
            label="URL Slug *"
            placeholder="e.g. exploring-modern-generative-art-workflows"
            value={formData.slug || ''}
            onChange={(e) => handleChange('slug', generateSlug(e.target.value))}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
              Category
            </label>
            <Input
              placeholder="e.g. Design, Technology, Tutorials"
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
              Publishing Status
            </label>
            <select
              value={formData.status || 'draft'}
              onChange={(e) => handleChange('status', e.target.value as BlogStatus)}
              className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
            Short Excerpt / Summary
          </label>
          <textarea
            rows={3}
            placeholder="Brief preview text displayed on the blog listing page..."
            value={formData.excerpt || ''}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            className="w-full p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add tag and press Enter or click Add"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.tags || []).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Featured Cover Image */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Cover Image
        </h2>

        {formData.featuredImage?.url ? (
          <div className="relative group rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] max-w-md">
            <div className="relative w-full h-48">
              <Image
                src={formData.featuredImage.url}
                alt={formData.featuredImage.altText || 'Featured blog cover'}
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
            <div className="p-3 flex items-center justify-between bg-black/60 backdrop-blur-sm text-white">
              <span className="text-xs truncate max-w-[200px]">
                {formData.featuredImage.altText || 'Cover Image'}
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleOpenMediaSelector}
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => handleChange('featuredImage', undefined)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 border-2 border-dashed border-[var(--color-border)] rounded-xl flex flex-col items-center justify-center gap-3 text-center">
            <span className="text-3xl">🖼️</span>
            <p className="text-sm text-[var(--color-muted)]">
              No cover image selected for this article.
            </p>
            <Button type="button" variant="outline" onClick={handleOpenMediaSelector}>
              Select Cover Image
            </Button>
          </div>
        )}
      </Card>

      {/* Full Content */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Post Content *
        </h2>
        <textarea
          rows={15}
          placeholder="Write your article content using Markdown or HTML..."
          value={formData.content || ''}
          onChange={(e) => handleChange('content', e.target.value)}
          className="w-full p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          required
        />
      </Card>

      {/* SEO Metadata */}
      <SeoForm
        seo={formData.seo}
        onChange={(seoData) => handleChange('seo', seoData)}
      />

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving Article...' : 'Save Article'}
        </Button>
      </div>

      {/* Media Selector Dialog */}
      <MediaSelector
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelect={(media) => {
          const featured: MediaRef = {
            mediaId: media.mediaId || media.id || '',
            url: media.url,
            storagePath: media.storagePath || media.url,
            altText: media.altText || formData.title,
          };
          handleChange('featuredImage', featured);
          setIsMediaSelectorOpen(false);
        }}
        title="Select Blog Cover Image"
        category="blog"
        slug={formData.slug}
        sectionContext="cover"
      />
    </form>
  );
}
