'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { Experience } from '@/types/admin.types';
import { ExperienceForm } from '@/components/admin/experience-form';
import { DeleteModal } from '@/components/admin/delete-modal';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Admin CMS route for managing work experience history.
export default function AdminExperiencePage() {
  const { idToken } = useAdminAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetches work experience list from the Express backend API.
  const loadExperiences = useCallback(async () => {
    if (!idToken) return;
    try {
      const data = await adminApi.getExperiences(idToken);
      setExperiences(data || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch work experience history.');
    } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadExperiences();
  }, [loadExperiences]);

  // Saves a new or updated work experience entry.
  const handleSave = async (formData: Omit<Experience, 'id'> | Partial<Experience>) => {
    if (!idToken) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      if (editingExp && editingExp.id) {
        await adminApi.updateExperience(editingExp.id, formData as Partial<Experience>, idToken);
        setSuccess('Work experience entry updated successfully.');
      } else {
        await adminApi.createExperience(formData as Omit<Experience, 'id'>, idToken);
        setSuccess('Work experience entry created successfully.');
      }
      setEditingExp(null);
      setIsCreating(false);
      await loadExperiences();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save experience entry.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Deletes an experience entry after confirmation.
  const handleDeleteConfirm = async () => {
    if (!idToken || !deletingId) return;
    try {
      setIsDeleting(true);
      setError(null);
      await adminApi.deleteExperience(deletingId, idToken);
      setSuccess('Experience entry deleted successfully.');
      setDeletingId(null);
      await loadExperiences();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete experience entry.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Work Experience..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Work Experience</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Manage professional employment history, responsibilities, and technical achievements.
          </p>
        </div>
        {!isCreating && !editingExp && (
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsCreating(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
          >
            + Add Experience
          </Button>
        )}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Editor Section */}
      {(isCreating || editingExp) && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-[var(--color-border)] pb-3 mb-4">
            <h2 className="text-base font-bold text-[var(--color-text)]">
              {editingExp ? `Edit Position: ${editingExp.role} at ${editingExp.company}` : 'Add Work Experience Entry'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditingExp(null);
                setIsCreating(false);
              }}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              ✕ Close Editor
            </button>
          </div>
          <ExperienceForm
            initialData={editingExp || undefined}
            onSave={handleSave}
            onCancel={() => {
              setEditingExp(null);
              setIsCreating(false);
            }}
            isSaving={saving}
          />
        </Card>
      )}

      {/* Experience Table List */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3 mb-4">
          All Experience Entries ({experiences.length})
        </h2>

        {experiences.length === 0 ? (
          <div className="text-center py-10 text-xs text-[var(--color-text-muted)]">
            No work experience entries recorded yet. Click &quot;+ Add Experience&quot; above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs text-[var(--color-text)]">
              <thead className="bg-[var(--color-surface)] text-[var(--color-text-muted)] font-semibold border-b border-[var(--color-border)] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Role & Company</th>
                  <th className="py-3 px-4">Employment Type</th>
                  <th className="py-3 px-4">Timeline</th>
                  <th className="py-3 px-4 text-center">Order</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {experiences.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--color-surface-elevated)]/60">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[var(--color-text)]">{item.role}</div>
                      <div className="text-[11px] text-[var(--color-text-muted)]">{item.company} {item.location ? `• ${item.location}` : ''}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text)]">{item.employmentType || 'Full-time'}</td>
                    <td className="py-3.5 px-4 font-mono text-[var(--color-text-muted)]">
                      {item.startDate} — {item.isCurrent ? <span className="text-indigo-400 font-bold">Present</span> : item.endDate || 'N/A'}
                    </td>
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
                          aria-label="Edit experience"
                          title="Edit experience"
                          onClick={() => {
                            setIsCreating(false);
                            setEditingExp(item);
                          }}
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors inline-flex items-center justify-center"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete experience"
                          title="Delete experience"
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
        title="Delete Work Experience"
        description="Are you sure you want to remove this work experience entry?"
        onCancel={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
