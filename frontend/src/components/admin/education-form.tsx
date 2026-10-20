'use client';

import React, { useState } from 'react';
import { Education } from '@/types/admin.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

interface EducationFormProps {
  initialData?: Partial<Education>;
  onSave: (data: Omit<Education, 'id'> | Partial<Education>) => Promise<void>;
  onCancel?: () => void;
  isSaving: boolean;
}

// Form editor component for managing academic background and qualification entries.
export function EducationForm({ initialData = {}, onSave, onCancel, isSaving }: EducationFormProps) {
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: initialData.institution || '',
    degree: initialData.degree || '',
    field: initialData.field || '',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    description: initialData.description || '',
    achievements: initialData.achievements || [],
    displayOrder: initialData.displayOrder ?? 1,
    isVisible: initialData.isVisible ?? true,
  });

  const [error, setError] = useState<string | null>(null);

  // Updates form state fields dynamically.
  const handleChange = (field: keyof Education, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Adds an achievement tag or bullet item.
  const handleAddAchievement = (itemInput: string) => {
    const trimmed = itemInput.trim();
    if (!trimmed) return;
    const currentList = formData.achievements || [];
    if (!currentList.includes(trimmed)) {
      handleChange('achievements', [...currentList, trimmed]);
    }
  };

  // Removes an achievement bullet item.
  const handleRemoveAchievement = (itemToRemove: string) => {
    handleChange('achievements', (formData.achievements || []).filter((item) => item !== itemToRemove));
  };

  // Validates form inputs before executing onSave callback.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution?.trim()) {
      setError('Institution name is required.');
      return;
    }
    if (!formData.degree?.trim()) {
      setError('Degree or qualification title is required.');
      return;
    }
    if (!formData.field?.trim()) {
      setError('Field of study is required.');
      return;
    }
    if (!formData.startDate?.trim()) {
      setError('Start Date is required.');
      return;
    }

    setError(null);
    try {
      await onSave(formData as Omit<Education, 'id'>);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save education entry.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Academic Qualification & Institution
        </h2>

        <Input
          label="Institution / University Name *"
          placeholder="e.g. Stanford University"
          value={formData.institution || ''}
          onChange={(e) => handleChange('institution', e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Degree Title *"
            placeholder="e.g. Bachelor of Science"
            value={formData.degree || ''}
            onChange={(e) => handleChange('degree', e.target.value)}
            required
          />

          <Input
            label="Field of Study *"
            placeholder="e.g. Computer Science & Software Engineering"
            value={formData.field || ''}
            onChange={(e) => handleChange('field', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date *"
            placeholder="e.g. 2019 or Sep 2019"
            value={formData.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            required
          />

          <Input
            label="End Date / Completion"
            placeholder="e.g. 2023 or May 2023"
            value={formData.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>

        <div className="space-y-1 pt-2">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">
            Description / Overview (optional)
          </label>
          <textarea
            rows={3}
            placeholder="Brief overview of coursework, focus areas, or honors..."
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </Card>

      {/* Achievements & Activities */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Honors & Achievements
        </h2>

        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              id="eduAchieveInput"
              placeholder="Add academic honor or achievement..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAchievement((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const el = document.getElementById('eduAchieveInput') as HTMLInputElement;
                if (el) {
                  handleAddAchievement(el.value);
                  el.value = '';
                }
              }}
              className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
            >
              Add Item
            </Button>
          </div>

          {(formData.achievements || []).length > 0 && (
            <ul className="space-y-1.5 pt-2">
              {(formData.achievements || []).map((item, idx) => (
                <li key={idx} className="flex justify-between items-center bg-[var(--color-surface)] p-2 rounded-lg text-xs text-[var(--color-text)] border border-[var(--color-border)]">
                  <span>🎓 {item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAchievement(item)}
                    className="text-red-400 hover:text-red-300 text-xs ml-2 font-bold"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      {/* Display Settings */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Display Settings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Display Order"
            type="number"
            value={formData.displayOrder ?? 1}
            onChange={(e) => handleChange('displayOrder', parseInt(e.target.value, 10) || 0)}
          />

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">Visibility</label>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="eduIsVisible"
                checked={formData.isVisible}
                onChange={(e) => handleChange('isVisible', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-[var(--color-surface-elevated)] border-[var(--color-border)]"
              />
              <label htmlFor="eduIsVisible" className="text-xs text-[var(--color-text-muted)] cursor-pointer">
                Visible on public portfolio
              </label>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)]">
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
        >
          {isSaving ? 'Saving Education...' : 'Save Education Entry'}
        </Button>
      </div>
    </form>
  );
}
