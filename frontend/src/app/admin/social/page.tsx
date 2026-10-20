'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { SocialLink } from '@/types/admin.types';
import { SocialLinkForm } from '@/components/admin/social-link-form';
import { DeleteModal } from '@/components/admin/delete-modal';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Admin CMS route for managing social profile links.
export default function AdminSocialLinksPage() {
  const { idToken } = useAdminAuth();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Loads all social links from the backend API.
  const loadLinks = useCallback(async () => {
    if (!idToken) return;
    try {
      const data = await adminApi.getSocialLinks(idToken);
      setLinks(data || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch social links.');
    } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLinks();
  }, [loadLinks]);

  // Handles saving a new or existing social link.
  const handleSave = async (formData: Omit<SocialLink, 'id'> | Partial<SocialLink>) => {
    if (!idToken) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      if (editingLink && editingLink.id) {
        await adminApi.updateSocialLink(editingLink.id, formData as Partial<SocialLink>, idToken);
        setSuccess('Social link updated successfully.');
      } else {
        await adminApi.createSocialLink(formData as Omit<SocialLink, 'id'>, idToken);
        setSuccess('Social link created successfully.');
      }
      setEditingLink(null);
      setIsCreating(false);
      await loadLinks();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save social link.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Handles deleting a social link entry after confirmation.
  const handleDeleteConfirm = async () => {
    if (!idToken || !deletingId) return;
    try {
      setIsDeleting(true);
      setError(null);
      await adminApi.deleteSocialLink(deletingId, idToken);
      setSuccess('Social link deleted successfully.');
      setDeletingId(null);
      await loadLinks();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete social link.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Social Links..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Social Links</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Manage external social media profiles, GitHub repositories, and contact shortcuts.
          </p>
        </div>
        {!isCreating && !editingLink && (
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsCreating(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
          >
            + Add Social Link
          </Button>
        )}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Editor Form Modal/Container */}
      {(isCreating || editingLink) && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-[var(--color-border)] pb-3 mb-4">
            <h2 className="text-base font-bold text-[var(--color-text)]">
              {editingLink ? `Edit Link: ${editingLink.label}` : 'Create New Social Link'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditingLink(null);
                setIsCreating(false);
              }}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              ✕ Close Editor
            </button>
          </div>
          <SocialLinkForm
            initialData={editingLink || undefined}
            onSave={handleSave}
            onCancel={() => {
              setEditingLink(null);
              setIsCreating(false);
            }}
            isSaving={saving}
          />
        </Card>
      )}

      {/* Social Links Table */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3 mb-4">
          All Social Links ({links.length})
        </h2>

        {links.length === 0 ? (
          <div className="text-center py-10 text-xs text-[var(--color-text-muted)]">
            No social profile links configured yet. Click &quot;+ Add Social Link&quot; above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs text-[var(--color-text)]">
              <thead className="bg-[var(--color-surface)] text-[var(--color-text-muted)] font-semibold border-b border-[var(--color-border)] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Label</th>
                  <th className="py-3 px-4">URL</th>
                  <th className="py-3 px-4 text-center">Order</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {links.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--color-surface-elevated)]/60">
                    <td className="py-3.5 px-4 font-bold text-[var(--color-text)] uppercase">{item.platform}</td>
                    <td className="py-3.5 px-4 font-medium text-[var(--color-text)]">{item.label}</td>
                    <td className="py-3.5 px-4 text-[var(--color-text-muted)] max-w-xs truncate">{item.url}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-[var(--color-text)]">{item.displayOrder}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-semibold text-xs ${
                          item.isVisible
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-[var(--color-text-muted)]'
                        }`}
                      >
                        {item.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          aria-label="Edit social link"
                          title="Edit social link"
                          onClick={() => {
                            setIsCreating(false);
                            setEditingLink(item);
                          }}
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors inline-flex items-center justify-center"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete social link"
                          title="Delete social link"
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
        title="Delete Social Link"
        description="Are you sure you want to remove this social link profile?"
        onCancel={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
