'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { Education } from '@/types/admin.types';
import { EducationForm } from '@/components/admin/education-form';
import { DeleteModal } from '@/components/admin/delete-modal';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Admin CMS route for managing academic education entries.
export default function AdminEducationPage() {
  const { idToken } = useAdminAuth();
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Loads all education records from the Express backend API.
  const loadEducation = useCallback(async () => {
    if (!idToken) return;
    try {
      const data = await adminApi.getEducation(idToken);
      setEducations(data || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch education records.');
    } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEducation();
  }, [loadEducation]);

  // Saves a new or updated education entry.
  const handleSave = async (formData: Omit<Education, 'id'> | Partial<Education>) => {
    if (!idToken) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      if (editingEdu && editingEdu.id) {
        await adminApi.updateEducation(editingEdu.id, formData as Partial<Education>, idToken);
        setSuccess('Education entry updated successfully.');
      } else {
        await adminApi.createEducation(formData as Omit<Education, 'id'>, idToken);
        setSuccess('Education entry created successfully.');
      }
      setEditingEdu(null);
      setIsCreating(false);
      await loadEducation();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save education entry.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Deletes an education record after user confirmation.
  const handleDeleteConfirm = async () => {
    if (!idToken || !deletingId) return;
    try {
      setIsDeleting(true);
      setError(null);
      await adminApi.deleteEducation(deletingId, idToken);
      setSuccess('Education entry deleted successfully.');
      setDeletingId(null);
      await loadEducation();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete education entry.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Education History..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Academic Education</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Manage degrees, university institutions, field of study, and academic honors.
          </p>
        </div>
        {!isCreating && !editingEdu && (
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsCreating(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
          >
            + Add Education
          </Button>
        )}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Editor Container */}
      {(isCreating || editingEdu) && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-[var(--color-border)] pb-3 mb-4">
            <h2 className="text-base font-bold text-[var(--color-text)]">
              {editingEdu ? `Edit Education: ${editingEdu.degree} at ${editingEdu.institution}` : 'Add Academic Qualification'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditingEdu(null);
                setIsCreating(false);
              }}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              ✕ Close Editor
            </button>
          </div>
          <EducationForm
            initialData={editingEdu || undefined}
            onSave={handleSave}
            onCancel={() => {
              setEditingEdu(null);
              setIsCreating(false);
            }}
            isSaving={saving}
          />
        </Card>
      )}

      {/* Education List Table */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3 mb-4">
          All Education Entries ({educations.length})
        </h2>

        {educations.length === 0 ? (
          <div className="text-center py-10 text-xs text-[var(--color-text-muted)]">
            No education entries recorded yet. Click &quot;+ Add Education&quot; above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs text-[var(--color-text)]">
              <thead className="bg-[var(--color-surface)] text-[var(--color-text-muted)] font-semibold border-b border-[var(--color-border)] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Degree & Field</th>
                  <th className="py-3 px-4">Timeline</th>
                  <th className="py-3 px-4 text-center">Order</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {educations.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--color-surface-elevated)]/60">
                    <td className="py-3.5 px-4 font-bold text-[var(--color-text)]">{item.institution}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[var(--color-text)]">{item.degree}</div>
                      <div className="text-[11px] text-[var(--color-text-muted)]">{item.field}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[var(--color-text-muted)]">
                      {item.startDate} — {item.endDate || 'Present'}
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
                          aria-label="Edit education"
                          title="Edit education"
                          onClick={() => {
                            setIsCreating(false);
                            setEditingEdu(item);
                          }}
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors inline-flex items-center justify-center"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete education"
                          title="Delete education"
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
        title="Delete Academic Qualification"
        description="Are you sure you want to remove this academic education record?"
        onCancel={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
