'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { MediaItem } from '@/types/admin.types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';

export interface SelectedMediaPayload {
  id: string;
  mediaId: string;
  url: string;
  storagePath: string;
  altText: string;
  fileId?: string;
}

interface MediaSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: SelectedMediaPayload) => void;
  title?: string;
  category?: 'site' | 'profile' | 'about' | 'development' | 'project' | 'art' | 'artwork' | 'blog';
  slug?: string;
  sectionContext?: string;
}

// Accessible modal dialog component allowing users to browse, upload, and select ImageKit media assets.
export function MediaSelector({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Asset',
  category = 'site',
  slug,
  sectionContext,
}: MediaSelectorProps) {
  const { idToken } = useAdminAuth();
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [subfolders, setSubfolders] = useState<Array<{ name: string; path: string }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [altTextInput, setAltTextInput] = useState<string>('');

  // Target directory resolution
  const targetFolder = React.useMemo(() => {
    if (category === 'profile' || category === 'about') return 'portfolio/profile';
    if (category === 'development' || category === 'project') return slug ? `portfolio/development/${slug}` : 'portfolio/development';
    if (category === 'art' || category === 'artwork') return slug ? `portfolio/art/${slug}` : 'portfolio/art';
    if (category === 'blog') return slug ? `portfolio/blog/${slug}` : 'portfolio/blog';
    return 'portfolio/site';
  }, [category, slug]);

  const [activeFolder, setActiveFolder] = useState<string>(targetFolder);

  useEffect(() => {
    setActiveFolder(targetFolder);
  }, [targetFolder]);

  // Fetch available media items from ImageKit repository backend.
  const loadMedia = useCallback(async (folderPath?: string) => {
    if (!idToken) return;
    setLoading(true);
    setError(null);
    const folderToFetch = folderPath || activeFolder;
    try {
      const res = await adminApi.getMediaList(idToken, folderToFetch);
      setMediaList(res.items || []);
      setSubfolders(res.subfolders || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load media assets.');
    } finally {
      setLoading(false);
    }
  }, [idToken, activeFolder]);

  useEffect(() => {
    if (isOpen) {
      loadMedia(activeFolder);
    }
  }, [isOpen, activeFolder, loadMedia]);

  // Handles uploading a new file via backend media upload API.
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !idToken) return;

    if ((category === 'development' || category === 'project' || category === 'art' || category === 'artwork' || category === 'blog') && !slug?.trim()) {
      const entityName = category === 'blog' ? 'a blog title/slug' : (category === 'art' || category === 'artwork') ? 'an artwork title/slug' : 'a project name/slug';
      setError(`Enter ${entityName} before uploading media.`);
      e.target.value = '';
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mediaType', category || 'site');
      if (slug) formData.append('slug', slug);
      if (sectionContext) formData.append('sectionContext', sectionContext);
      formData.append('altText', file.name.replace(/\.[^/.]+$/, ''));

      const uploaded = await adminApi.uploadMedia(formData, idToken);
      setMediaList((prev) => [uploaded, ...prev]);
      setSelectedItem(uploaded);
      setAltTextInput(uploaded.altText || '');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upload media file.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Confirms selection of the currently highlighted media item.
  const handleConfirmSelection = () => {
    if (!selectedItem) return;
    const storagePath = selectedItem.storagePath || selectedItem.filePath || selectedItem.url;
    onSelect({
      id: selectedItem.id,
      mediaId: selectedItem.id,
      url: selectedItem.url,
      storagePath,
      altText: altTextInput || selectedItem.altText || selectedItem.fileName,
      fileId: selectedItem.fileId,
    });
    onClose();
  };

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter((item) =>
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.altText && item.altText.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-selector-title"
    >
      <Card className="w-full max-w-4xl max-h-[85vh] flex flex-col bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] shadow-2xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface)]/50">
          <div>
            <h2 id="media-selector-title" className="text-xl font-bold text-[var(--color-text)]">
              {title}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-1 flex items-center gap-2">
              <span>Folder Context:</span>
              <span className="font-mono text-indigo-400 font-semibold bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
                /{activeFolder}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xl font-bold p-1"
            aria-label="Close media selector"
          >
            ✕
          </button>
        </div>

        {/* Search & Upload Bar */}
        <div className="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row gap-3 items-center justify-between bg-[var(--color-surface)]/50">
          <Input
            placeholder="Search by filename or alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] text-xs"
          />

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-md shadow-indigo-600/30">
              {uploading ? 'Uploading...' : '+ Upload New Media'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Subfolders Navigation */}
        {subfolders.length > 0 && (
          <div className="px-4 py-2.5 bg-[var(--color-surface)]/30 border-b border-[var(--color-border)] flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[var(--color-text-muted)] font-mono text-[10px] uppercase font-bold">Subfolders:</span>
            {subfolders.map((folder) => (
              <button
                key={folder.path}
                type="button"
                onClick={() => setActiveFolder(folder.path)}
                className="px-2.5 py-1 bg-[var(--color-surface)] hover:bg-indigo-600/10 border border-[var(--color-border)] hover:border-indigo-500/50 rounded-md font-mono text-[11px] text-[var(--color-text)] transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                <span>📂</span> {folder.name}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="px-4 pt-3">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Media Grid Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="py-16 flex justify-center items-center">
              <Loading label="Fetching media assets..." />
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="py-16 text-center text-[var(--color-text-muted)]">
              <p className="text-base font-medium">No media assets found in /{activeFolder}.</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Upload your first image asset using the button above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setAltTextInput(item.altText || '');
                    }}
                    className={`group relative rounded-xl border p-2 cursor-pointer transition-all duration-150 overflow-hidden bg-[var(--color-surface)] ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/50 bg-indigo-950/20'
                        : 'border-[var(--color-border)] hover:border-indigo-500/50'
                    }`}
                  >
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-[var(--color-surface-elevated)] flex items-center justify-center relative">
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt={item.altText || item.fileName}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-2 text-xs">
                      <p className="truncate font-medium text-[var(--color-text)]" title={item.fileName}>
                        {item.fileName}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 font-mono">
                        {item.fileSize ? `${(item.fileSize / 1024).toFixed(0)} KB` : 'CDN'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Media Alt Text & Footer */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]/70 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-1/2">
            {selectedItem ? (
              <Input
                label="Alt Text (for accessibility)"
                value={altTextInput}
                onChange={(e) => setAltTextInput(e.target.value)}
                placeholder="Describe image..."
                className="bg-[var(--color-surface)] border-[var(--color-border)] text-xs text-[var(--color-text)]"
              />
            ) : (
              <p className="text-xs text-[var(--color-text-muted)]">Select an asset above to attach.</p>
            )}
          </div>

          <div className="flex gap-3 w-full sm:w-auto justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!selectedItem}
              onClick={handleConfirmSelection}
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
            >
              Attach Asset
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
