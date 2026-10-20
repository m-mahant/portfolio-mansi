'use client';

// Accessible modal dialog for detailed media asset inspection, URL copying, and deletion.

import React, { useState } from 'react';
import { MediaItem } from '@/types/admin.types';

interface MediaPreviewDialogProps {
  media: MediaItem | null;
  onClose: () => void;
  onDelete: (mediaId: string) => void;
}

// Formats byte numbers into human readable size strings (KB / MB).
const formatBytes = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const MediaPreviewDialog: React.FC<MediaPreviewDialogProps> = ({
  media,
  onClose,
  onDelete,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!media) return null;

  // Copies the media asset direct CDN URL to the browser clipboard.
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(media.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.warn('Clipboard write failed.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-preview-title"
    >
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface)]/60">
          <div>
            <h2 id="media-preview-title" className="text-base font-bold text-[var(--color-text)] truncate max-w-md">
              {media.fileName}
            </h2>
            <p className="text-[11px] text-[var(--color-text-muted)]">ImageKit Media Asset Details</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-lg font-bold px-2 py-1"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Image Asset Viewport */}
          <div className="md:col-span-7 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-3 flex flex-col items-center justify-center min-h-[250px] max-h-[400px]">
            <img
              src={media.url}
              alt={media.altText || media.fileName}
              className="max-h-[350px] w-auto object-contain rounded shadow-md"
            />
          </div>

          {/* Asset Metadata Sidebar */}
          <div className="md:col-span-5 space-y-4">
            <div className="space-y-2 bg-[var(--color-surface)]/60 p-4 rounded-lg border border-[var(--color-border)] text-xs">
              <h3 className="font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-2 mb-2">
                Metadata Specs
              </h3>

              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">File Name:</span>
                <span className="font-mono text-[var(--color-text)] truncate max-w-[150px]" title={media.fileName}>
                  {media.fileName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">File Size:</span>
                <span className="font-mono text-[var(--color-text)]">{formatBytes(media.fileSize)}</span>
              </div>

              {media.width && media.height && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Dimensions:</span>
                  <span className="font-mono text-[var(--color-text)]">
                    {media.width} × {media.height} px
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">MIME Type:</span>
                <span className="font-mono text-[var(--color-text)]">{media.mimeType || 'image/jpeg'}</span>
              </div>

              {media.createdAt && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Uploaded:</span>
                  <span className="font-mono text-[var(--color-text)] text-[10px]">
                    {new Date(media.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Alt Description */}
            <div className="bg-[var(--color-surface)]/60 p-4 rounded-lg border border-[var(--color-border)] text-xs space-y-1">
              <span className="text-[var(--color-text-muted)] block font-semibold">Alt Description:</span>
              <p className="text-[var(--color-text)] text-xs italic">
                {media.altText || 'No alt text description specified.'}
              </p>
            </div>

            {/* Direct URL & Copy Button */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-muted)] block">CDN Direct URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={media.url}
                  className="flex-1 px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-[11px] font-mono text-[var(--color-text)] truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3 py-1.5 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-border)] text-[var(--color-text)] text-xs font-semibold rounded border border-[var(--color-border)] transition-colors shrink-0"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]/60 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onDelete(media.id);
              onClose();
            }}
            className="px-4 py-2 bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold rounded-lg border border-rose-700/50 transition-colors"
          >
            Delete Media Asset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[var(--color-surface-elevated)] hover:bg-[var(--color-border)] text-[var(--color-text)] text-xs font-semibold rounded-lg border border-[var(--color-border)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
