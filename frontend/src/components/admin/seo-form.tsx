'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SeoMetadata, MediaRef } from '@/types/admin.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MediaSelector } from '@/components/admin/media-selector';

interface SeoFormProps {
  seo?: SeoMetadata;
  onChange: (seo: SeoMetadata) => void;
}

// Renders a reusable form section for managing SEO metadata and OpenGraph images.
export function SeoForm({ seo = {}, onChange }: SeoFormProps) {
  const [isMediaOpen, setIsMediaOpen] = useState<boolean>(false);

  // Updates specific fields within the SEO metadata structure.
  const handleFieldChange = (field: keyof SeoMetadata, value: unknown) => {
    onChange({
      ...seo,
      [field]: value,
    });
  };

  // Handles adding a keyword tag to the keywords list.
  const handleAddKeyword = (keywordInput: string) => {
    const trimmed = keywordInput.trim();
    if (!trimmed) return;
    const currentKeywords = seo.keywords || [];
    if (!currentKeywords.includes(trimmed)) {
      onChange({
        ...seo,
        keywords: [...currentKeywords, trimmed],
      });
    }
  };

  // Removes a keyword tag from the keywords list.
  const handleRemoveKeyword = (tagToRemove: string) => {
    onChange({
      ...seo,
      keywords: (seo.keywords || []).filter((k) => k !== tagToRemove),
    });
  };

  return (
    <div className="space-y-4 bg-[var(--color-surface)]/60 p-5 rounded-xl border border-[var(--color-border)]">
      <h3 className="text-base font-semibold text-[var(--color-text)] border-b border-[var(--color-border)] pb-2 font-heading">
        Search Engine Optimization (SEO)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Meta Title"
          placeholder="Custom page title for search engines..."
          value={seo.title || ''}
          onChange={(e) => handleFieldChange('title', e.target.value)}
        />

        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
            Indexing Instruction
          </label>
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="noIndexToggle"
              checked={seo.noIndex || false}
              onChange={(e) => handleFieldChange('noIndex', e.target.checked)}
              className="w-4 h-4 rounded bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <label htmlFor="noIndexToggle" className="text-xs text-[var(--color-muted)] cursor-pointer">
              Hide from search engine indexing (noindex)
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
          Meta Description
        </label>
        <textarea
          rows={3}
          placeholder="Brief page summary for search engine snippet..."
          value={seo.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Keywords Management */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
          SEO Keywords
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="newKeywordInput"
            placeholder="Add keyword tag..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddKeyword((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-muted)] text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const el = document.getElementById('newKeywordInput') as HTMLInputElement;
              if (el) {
                handleAddKeyword(el.value);
                el.value = '';
              }
            }}
            className="text-xs"
          >
            Add Tag
          </Button>
        </div>
        {(seo.keywords || []).length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {(seo.keywords || []).map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-surface)] text-[var(--color-text)] text-xs border border-[var(--color-border)]"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:text-red-400 font-bold ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* OpenGraph Image */}
      <div className="space-y-2 pt-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
          Social Preview / OG Image URL
        </label>
        <div className="flex gap-3 items-center">
          <Input
            placeholder="URL to social sharing banner image..."
            value={seo.ogImage || ''}
            onChange={(e) => handleFieldChange('ogImage', e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsMediaOpen(true)}
            className="text-xs whitespace-nowrap"
          >
            Select Media
          </Button>
        </div>

        {seo.ogImage && (
          <div className="relative mt-2 w-36 aspect-video rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
            <Image src={seo.ogImage} alt="OG Preview" fill sizes="144px" className="object-cover" />
          </div>
        )}
      </div>

      <MediaSelector
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        onSelect={(media: MediaRef) => {
          handleFieldChange('ogImage', media.url);
        }}
        title="Select OpenGraph Image"
      />
    </div>
  );
}
