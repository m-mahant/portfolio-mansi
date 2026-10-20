'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { Artwork, PublishStatus } from '@/types/admin.types';
import { DeleteModal } from '@/components/admin/delete-modal';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Admin CMS route listing all creative artwork entries.
export default function AdminArtworksPage() {
  const { idToken } = useAdminAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetches artwork list from Express backend API.
  const loadArtworks = useCallback(async () => {
    if (!idToken) return;
    try {
      const data = await adminApi.getArtworks(idToken);
      setArtworks(data || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch artworks list.');
    } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadArtworks();
  }, [loadArtworks]);

  // Handles deleting an artwork after user confirmation.
  const handleDeleteConfirm = async () => {
    if (!idToken || !deletingId) return;
    try {
      setIsDeleting(true);
      setError(null);
      await adminApi.deleteArtwork(deletingId, idToken);
      setSuccess('Artwork deleted successfully.');
      setDeletingId(null);
      await loadArtworks();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete artwork.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filters artworks based on search input and status dropdown.
  const filteredArtworks = artworks.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Renders text-only status indicators.
  const renderStatusBadge = (status: PublishStatus) => {
    switch (status) {
      case 'published':
        return <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">Published</span>;
      case 'archived':
        return <span className="font-semibold text-xs text-[var(--color-text-muted)]">Archived</span>;
      default:
        return <span className="font-semibold text-xs text-amber-600 dark:text-amber-400">Draft</span>;
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Artworks..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Artworks Management</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Manage digital artwork galleries, creative experiments, materials, and creation narratives.
          </p>
        </div>
        <Link href="/admin/artworks/new">
          <Button type="button" variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
            + Create New Artwork
          </Button>
        </Link>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search artworks by title, category, or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>
      </Card>

      {/* Artworks Table */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3 mb-4">
          Artwork Records ({filteredArtworks.length})
        </h2>

        {filteredArtworks.length === 0 ? (
          <div className="text-center py-12 text-xs text-[var(--color-text-muted)]">
            No artworks found matching the specified filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs text-[var(--color-text)]">
              <thead className="bg-[var(--color-surface)] text-[var(--color-text-muted)] font-semibold border-b border-[var(--color-border)] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Artwork</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 font-mono text-center">Year</th>
                  <th className="py-3 px-4 text-center">Order</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredArtworks.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--color-surface-elevated)]/60">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {item.featuredImage?.url ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shrink-0">
                            <img src={item.featuredImage.url} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] shrink-0 flex items-center justify-center text-[var(--color-text-muted)] text-xs">
                            🎨
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-[var(--color-text)]">{item.title}</div>
                          <div className="text-[11px] text-[var(--color-text-muted)] font-mono">{item.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text)] font-medium">{item.category}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-[var(--color-text-muted)]">{item.year || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-[var(--color-text)]">{item.displayOrder}</td>
                    <td className="py-3.5 px-4 text-center">{renderStatusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/artworks/${item.id}`} title="Edit artwork">
                          <button
                            type="button"
                            aria-label="Edit artwork"
                            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors inline-flex items-center justify-center"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          type="button"
                          aria-label="Delete artwork"
                          title="Delete artwork"
                          onClick={() => setDeletingId(item.id || null)}
                          className="p-1.5 rounded-lg text-red-500/80 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors inline-flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <DeleteModal
        isOpen={deletingId !== null}
        title="Delete Artwork Piece"
        description="Are you sure you want to remove this artwork piece record?"
        onCancel={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
