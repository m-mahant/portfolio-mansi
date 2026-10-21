'use client';

// Real-time search engine result snippet and social card preview component.

import React from 'react';
import Image from 'next/image';
import { SeoMetadata } from '@/types/admin.types';

interface SeoPreviewProps {
  seo: SeoMetadata;
  defaultTitle?: string;
  defaultDescription?: string;
  siteName?: string;
  slug?: string;
}

export const SeoPreview: React.FC<SeoPreviewProps> = ({
  seo,
  defaultTitle = 'Mansi Mahant',
  defaultDescription = 'Dynamic portfolio fusing software engineering and digital craft.',
  siteName = 'Mansi Mahant',
  slug = '',
}) => {
  const displayTitle = seo.title?.trim() || defaultTitle;
  const displayDescription = seo.description?.trim() || defaultDescription;
  const displayOgImage = seo.ogImage?.trim() || '';
  const displayUrl = `https://gallery.dev${slug ? `/${slug}` : ''}`;

  const titleLength = displayTitle.length;
  const descLength = displayDescription.length;

  return (
    <div className="space-y-6">
      {/* Google Search Snippet Preview */}
      <div className="bg-[var(--color-surface)]/60 rounded-xl border border-[var(--color-border)] p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
          <h4 className="text-xs font-bold text-[var(--color-text)] flex items-center gap-2 font-heading">
            <span>🌐</span> Google Search Result Preview
          </h4>
          <span className="text-[10px] font-mono text-[var(--color-muted)]">Desktop View</span>
        </div>

        <div className="bg-white p-4 rounded-lg space-y-1 font-sans text-left shadow-sm border border-slate-200">
          {/* Breadcrumb / URL */}
          <div className="flex items-center gap-1.5 text-xs text-[#202124]">
            <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-700 border border-slate-300">
              G
            </span>
            <span className="text-xs text-[#202124] font-medium">{siteName}</span>
            <span className="text-xs text-[#5f6368]">{displayUrl}</span>
          </div>

          {/* Snippet Title */}
          <h3 className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug truncate">
            {displayTitle}
          </h3>

          {/* Snippet Description */}
          <p className="text-xs text-[#4d5156] leading-normal line-clamp-2">
            {displayDescription}
          </p>
        </div>

        {/* Character Count Recommendation Badges */}
        <div className="flex items-center gap-4 text-[11px]">
          <div>
            <span className="text-[var(--color-muted)]">Title: </span>
            <span
              className={`font-mono font-bold ${
                titleLength >= 30 && titleLength <= 60
                  ? 'text-emerald-500'
                  : titleLength > 60
                  ? 'text-amber-500'
                  : 'text-[var(--color-muted)]'
              }`}
            >
              {titleLength} / 60 chars
            </span>
          </div>
          <div>
            <span className="text-[var(--color-muted)]">Description: </span>
            <span
              className={`font-mono font-bold ${
                descLength >= 120 && descLength <= 160
                  ? 'text-emerald-500'
                  : descLength > 160
                  ? 'text-amber-500'
                  : 'text-[var(--color-muted)]'
              }`}
            >
              {descLength} / 160 chars
            </span>
          </div>
        </div>
      </div>

      {/* Open Graph / Social Sharing Preview */}
      <div className="bg-[var(--color-surface)]/60 rounded-xl border border-[var(--color-border)] p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
          <h4 className="text-xs font-bold text-[var(--color-text)] flex items-center gap-2 font-heading">
            <span>📲</span> Open Graph / Social Share Card Preview
          </h4>
          <span className="text-[10px] font-mono text-[var(--color-muted)]">Twitter / LinkedIn / Discord</span>
        </div>

        <div className="bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-md">
          {displayOgImage ? (
            <div className="relative aspect-video w-full bg-[var(--color-surface)] overflow-hidden border-b border-[var(--color-border)]">
              <Image src={displayOgImage} alt="OG Banner" fill sizes="400px" className="object-cover" />
            </div>
          ) : (
            <div className="aspect-video w-full bg-[var(--color-surface)]/60 border-b border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] text-xs italic">
              No OpenGraph Image Selected (Fallback to Default Banner)
            </div>
          )}

          <div className="p-4 space-y-1.5 bg-[var(--color-surface)]">
            <span className="text-[10px] uppercase font-mono text-[var(--color-muted)] tracking-wider">
              gallery.dev
            </span>
            <h4 className="text-sm font-bold text-[var(--color-text)] line-clamp-1">{displayTitle}</h4>
            <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">
              {displayDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
