import React from 'react';
import { Artwork } from '@/types/public.types';

interface ArtworkMetaProps {
  artwork: Artwork;
}

interface MetaRowProps {
  label: string;
  children: React.ReactNode;
}

// One labeled specification row in the artwork sidebar.
function MetaRow({ label, children }: MetaRowProps) {
  return (
    <div className="space-y-1.5 pb-4 border-b border-[var(--color-border)] last:border-b-0 last:pb-0">
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <div className="text-sm text-[var(--color-text)]">{children}</div>
    </div>
  );
}

// Technical metadata sidebar; empty fields are omitted.
export function ArtworkMeta({ artwork }: ArtworkMetaProps) {
  const hasMaterials = Boolean(artwork.materials && artwork.materials.length > 0);
  const hasTags = Boolean(artwork.tags && artwork.tags.length > 0);

  if (!artwork.category && !artwork.year && !artwork.dimensions && !hasMaterials && !hasTags) {
    return null;
  }

  return (
    <aside className="p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] space-y-5">
      <h2
        className="text-2xl font-bold tracking-tight text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        Details
      </h2>

      <div className="space-y-4">
        {artwork.category && (
          <MetaRow label="Category">{artwork.category}</MetaRow>
        )}
        {artwork.year && <MetaRow label="Year">{artwork.year}</MetaRow>}
        {artwork.dimensions && <MetaRow label="Dimensions">{artwork.dimensions}</MetaRow>}

        {hasMaterials && (
          <MetaRow label="Materials">
            <div className="flex flex-wrap gap-1.5">
              {artwork.materials.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 rounded-lg bg-[var(--color-background)]/50 border border-[var(--color-border)] text-xs font-tag"
                >
                  {item}
                </span>
              ))}
            </div>
          </MetaRow>
        )}

        {hasTags && (
          <MetaRow label="Tags">
            <div className="flex flex-wrap gap-1.5">
              {artwork.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-xs font-tag text-[var(--color-accent)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </MetaRow>
        )}
      </div>
    </aside>
  );
}
