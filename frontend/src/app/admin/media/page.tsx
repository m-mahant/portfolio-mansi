'use client';
/* eslint-disable react-hooks/set-state-in-effect */

// Enhanced Admin Media Assets Library page with folder tree navigation, search, MIME filtering, pagination, and asset preview.

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { MediaItem } from '@/types/admin.types';
import { DeleteModal } from '@/components/admin/delete-modal';
import { MediaPreviewDialog } from '@/components/admin/media-preview-dialog';

const PAGE_SIZE = 12;

export default function AdminMediaPage() {
  const { idToken } = useAdminAuth();
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [subfolders, setSubfolders] = useState<Array<{ name: string; path: string }>>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('portfolio');
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Filter & View Controls
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mimeCategory, setMimeCategory] = useState<'all' | 'image' | 'svg' | 'document'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  // Upload inputs
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Loads all media assets and subfolders for the current directory path.
  const loadMedia = useCallback(async (folderPath?: string) => {
    if (!idToken) return;
    setLoading(true);
    const targetPath = folderPath ?? currentFolder;
    try {
      const data = await adminApi.getMediaList(idToken, targetPath);
      setMediaList(data.items || []);
      setSubfolders(data.subfolders || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch media assets.');
    } finally {
      setLoading(false);
    }
  }, [idToken, currentFolder]);

  useEffect(() => {
    loadMedia(currentFolder);
  }, [idToken, currentFolder, loadMedia]);

  // Handles uploading a new file to the active folder path.
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToken || !selectedFile) return;

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append('file', selectedFile);

      // Determine context from active folder path
      let mediaType = 'site';
      let slug = '';
      const pathParts = currentFolder.split('/');
      if (pathParts.includes('profile')) {
        mediaType = 'profile';
      } else if (pathParts.includes('development')) {
        mediaType = 'development';
        slug = pathParts[pathParts.indexOf('development') + 1] || '';
      } else if (pathParts.includes('art')) {
        mediaType = 'art';
        slug = pathParts[pathParts.indexOf('art') + 1] || '';
      }

      formData.append('mediaType', mediaType);
      if (slug) formData.append('slug', slug);
      if (altText) formData.append('altText', altText);

      await adminApi.uploadMedia(formData, idToken);
      setSuccess(`Media asset uploaded successfully to ${currentFolder}.`);
      setSelectedFile(null);
      setAltText('');
      await loadMedia(currentFolder);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upload media file.');
    } finally {
      setUploading(false);
    }
  };

  // Deletes an asset after user confirmation.
  const handleDeleteConfirm = async () => {
    if (!idToken || !deletingId) return;
    try {
      setIsDeleting(true);
      setError(null);
      await adminApi.deleteMedia(deletingId, idToken);
      setSuccess('Media asset deleted successfully.');
      setDeletingId(null);
      if (previewMedia && previewMedia.id === deletingId) {
        setPreviewMedia(null);
      }
      await loadMedia(currentFolder);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete media asset.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Breadcrumb path parts computation
  const breadcrumbs = useMemo(() => {
    const parts = currentFolder.split('/').filter(Boolean);
    const crumbs = [];
    let accPath = '';
    for (let i = 0; i < parts.length; i++) {
      accPath = i === 0 ? parts[i] : `${accPath}/${parts[i]}`;
      crumbs.push({ label: parts[i], path: accPath });
    }
    return crumbs;
  }, [currentFolder]);

  // Filters media list by search query and category tab.
  const filteredMedia = useMemo(() => {
    return mediaList.filter((item) => {
      const matchesSearch =
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.altText && item.altText.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      const mime = (item.mimeType || '').toLowerCase();
      if (mimeCategory === 'image') {
        return mime.startsWith('image/') && !mime.includes('svg');
      }
      if (mimeCategory === 'svg') {
        return mime.includes('svg') || item.fileName.endsWith('.svg');
      }
      if (mimeCategory === 'document') {
        return mime.includes('pdf') || mime.includes('doc') || mime.includes('text');
      }

      return true;
    });
  }, [mediaList, searchQuery, mimeCategory]);

  // Paginated items slice based on active page.
  const totalPages = Math.ceil(filteredMedia.length / PAGE_SIZE) || 1;
  const paginatedMedia = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredMedia.slice(start, start + PAGE_SIZE);
  }, [filteredMedia, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, mimeCategory, currentFolder]);

  return (
    <div className="space-y-6">
      {/* Top Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)]/60 p-5 rounded-xl border border-[var(--color-border)] backdrop-blur-sm shadow-md">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <span>🖼️</span> Media Assets Library
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Canonical ImageKit media browser with folder tree navigation, search, and context-aware upload routing.
          </p>
        </div>

        <div className="text-xs text-[var(--color-text-muted)] font-mono bg-[var(--color-surface)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
          Assets in Folder: <span className="text-indigo-400 font-bold">{mediaList.length}</span>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800/60 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            ✕
          </button>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 text-xs font-semibold flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            ✕
          </button>
        </div>
      )}

      {/* Folder Navigation & Breadcrumbs Bar */}
      <div className="bg-[var(--color-surface)]/80 p-4 rounded-xl border border-[var(--color-border)] space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-xs font-mono overflow-x-auto text-[var(--color-text)]">
          <span className="text-[var(--color-text-muted)] font-bold">📁 Directory:</span>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.path}>
              {idx > 0 && <span className="text-[var(--color-text-muted)]">/</span>}
              <button
                type="button"
                onClick={() => setCurrentFolder(crumb.path)}
                className={`hover:underline rounded px-1.5 py-0.5 ${
                  crumb.path === currentFolder
                    ? 'font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-500/30'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Subdirectories Grid */}
        {subfolders.length > 0 && (
          <div className="pt-2 border-t border-[var(--color-border)]">
            <p className="text-[11px] font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">Subfolders</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {subfolders.map((folder) => (
                <button
                  key={folder.path}
                  type="button"
                  onClick={() => setCurrentFolder(folder.path)}
                  className="flex items-center gap-2 p-2.5 bg-[var(--color-surface-elevated)] hover:bg-indigo-600/10 border border-[var(--color-border)] hover:border-indigo-500/50 rounded-lg text-xs font-medium text-[var(--color-text)] transition-all group text-left"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">📂</span>
                  <span className="truncate">{folder.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Form Card */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
          <h2 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
            <span>📤</span> Upload Asset
          </h2>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-950/40 px-2.5 py-1 rounded-md border border-indigo-500/30">
            Target: /{currentFolder}
          </span>
        </div>

        <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-6 space-y-1">
            <label className="block text-xs font-semibold text-[var(--color-text)]">Select Image File *</label>
            <input
              type="file"
              accept="image/*,.svg,.pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-[var(--color-text)] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30 bg-[var(--color-surface-elevated)] p-1.5 border border-[var(--color-border)] rounded-lg cursor-pointer"
              required
            />
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="block text-xs font-semibold text-[var(--color-text)]">Alt Text Description</label>
            <input
              type="text"
              placeholder="Accessibility description..."
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Asset'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Filter, Search & View Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[var(--color-surface)]/40 p-4 rounded-xl border border-[var(--color-border)]">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto bg-[var(--color-surface-elevated)] p-1 rounded-lg border border-[var(--color-border)]">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'image', label: 'Images' },
            { id: 'svg', label: 'Vector / SVG' },
            { id: 'document', label: 'Documents' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMimeCategory(tab.id as 'all' | 'image' | 'svg' | 'document')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                mimeCategory === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search filename or alt text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] focus:outline-none focus:border-indigo-500"
            />
            <span className="absolute left-2.5 top-2 text-[var(--color-text-muted)] text-xs">🔍</span>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-[var(--color-surface-elevated)] p-1 rounded-lg border border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 text-xs rounded ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
              title="Grid View"
            >
              ▦
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 text-xs rounded ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
              title="List View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Assets Collection Area */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex items-center gap-3 text-[var(--color-text-muted)] text-sm font-medium">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            Loading assets in /{currentFolder}...
          </div>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-12 text-center text-[var(--color-text-muted)] space-y-2">
          <p className="text-sm font-semibold">No media assets found in /{currentFolder}.</p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Use the form above to upload an asset to this directory, or select a subfolder.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Grid View Mode */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {paginatedMedia.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setPreviewMedia(item)}
                  className="group bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-indigo-500/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-lg"
                >
                  <div className="aspect-square w-full bg-[var(--color-surface-elevated)] overflow-hidden relative flex items-center justify-center p-1">
                    <Image
                      src={item.thumbnailUrl || item.url}
                      alt={item.altText || item.fileName}
                      fill
                      sizes="(max-width: 768px) 50vw, 200px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
                    />
                  </div>

                  <div className="p-2.5 space-y-1 bg-[var(--color-surface)]/90 border-t border-[var(--color-border)]">
                    <p className="text-xs font-semibold text-[var(--color-text)] truncate" title={item.fileName}>
                      {item.fileName}
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-[var(--color-text-muted)]">
                      <span>{item.fileSize ? `${(item.fileSize / 1024).toFixed(0)} KB` : 'CDN'}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(item.id);
                        }}
                        className="text-rose-400 hover:text-rose-300 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View Mode */
            <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] uppercase font-mono text-[10px] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="p-3">Preview</th>
                    <th className="p-3">File Name</th>
                    <th className="p-3">Alt Description</th>
                    <th className="p-3">File Size</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text)]">
                  {paginatedMedia.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setPreviewMedia(item)}
                      className="hover:bg-[var(--color-surface-elevated)] cursor-pointer transition-colors"
                    >
                      <td className="p-3">
                        <div className="relative w-10 h-10 rounded bg-[var(--color-surface-elevated)] overflow-hidden border border-[var(--color-border)]">
                          <Image
                            src={item.thumbnailUrl || item.url}
                            alt={item.fileName}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-[var(--color-text)]">{item.fileName}</td>
                      <td className="p-3 text-[var(--color-text-muted)] italic max-w-xs truncate">
                        {item.altText || 'No alt text'}
                      </td>
                      <td className="p-3 font-mono text-[var(--color-text-muted)]">
                        {item.fileSize ? `${(item.fileSize / 1024).toFixed(1)} KB` : '-'}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewMedia(item);
                          }}
                          className="px-2 py-1 bg-[var(--color-surface-elevated)] text-[var(--color-text)] rounded hover:bg-[var(--color-surface)] border border-[var(--color-border)]"
                        >
                          View Specs
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingId(item.id);
                          }}
                          className="px-2 py-1 bg-rose-900/40 text-rose-300 rounded hover:bg-rose-900/60"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-[var(--color-surface)]/60 rounded-xl border border-[var(--color-border)] text-xs">
              <span className="text-[var(--color-text-muted)]">
                Page <strong className="text-[var(--color-text)]">{currentPage}</strong> of{' '}
                <strong className="text-[var(--color-text)]">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-[var(--color-surface-elevated)] disabled:opacity-40 text-[var(--color-text)] border border-[var(--color-border)] rounded font-medium hover:bg-[var(--color-surface)]"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-[var(--color-surface-elevated)] disabled:opacity-40 text-[var(--color-text)] border border-[var(--color-border)] rounded font-medium hover:bg-[var(--color-surface)]"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Asset Preview Modal Dialog */}
      <MediaPreviewDialog
        media={previewMedia}
        onClose={() => setPreviewMedia(null)}
        onDelete={(id) => setDeletingId(id)}
      />

      {/* Confirmation Delete Modal */}
      <DeleteModal
        isOpen={deletingId !== null}
        title="Delete Media Asset"
        description="Are you sure you want to delete this media asset permanently from ImageKit CDN? Any existing references to this URL will be broken."
        onCancel={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
