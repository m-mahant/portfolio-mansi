'use client';

import React, { useState } from 'react';
import { Experience } from '@/types/admin.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

interface ExperienceFormProps {
  initialData?: Partial<Experience>;
  onSave: (data: Omit<Experience, 'id'> | Partial<Experience>) => Promise<void>;
  onCancel?: () => void;
  isSaving: boolean;
}

// Form editor component for creating and updating professional work experience entries.
export function ExperienceForm({ initialData = {}, onSave, onCancel, isSaving }: ExperienceFormProps) {
  const [formData, setFormData] = useState<Partial<Experience>>({
    company: initialData.company || '',
    role: initialData.role || '',
    employmentType: initialData.employmentType || 'Full-time',
    location: initialData.location || '',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    isCurrent: initialData.isCurrent ?? false,
    description: initialData.description || '',
    responsibilities: initialData.responsibilities || [],
    technologies: initialData.technologies || [],
    achievements: initialData.achievements || [],
    displayOrder: initialData.displayOrder ?? 1,
    isVisible: initialData.isVisible ?? true,
  });

  const [error, setError] = useState<string | null>(null);

  // Updates form field values dynamically.
  const handleChange = (field: keyof Experience, value: unknown) => {
    if (field === 'isCurrent' && value === true) {
      setFormData((prev) => ({ ...prev, isCurrent: true, endDate: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Adds an item to array field lists (responsibilities, technologies, achievements).
  const handleAddArrayItem = (field: 'responsibilities' | 'technologies' | 'achievements', itemInput: string) => {
    const trimmed = itemInput.trim();
    if (!trimmed) return;
    const currentList = (formData[field] as string[]) || [];
    if (!currentList.includes(trimmed)) {
      handleChange(field, [...currentList, trimmed]);
    }
  };

  // Removes an item from array field lists.
  const handleRemoveArrayItem = (field: 'responsibilities' | 'technologies' | 'achievements', itemToRemove: string) => {
    const currentList = (formData[field] as string[]) || [];
    handleChange(field, currentList.filter((item) => item !== itemToRemove));
  };

  // Validates form input before dispatching onSave action.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company?.trim()) {
      setError('Company name is required.');
      return;
    }
    if (!formData.role?.trim()) {
      setError('Role title is required.');
      return;
    }
    if (!formData.startDate?.trim()) {
      setError('Start Date is required.');
      return;
    }
    if (!formData.description?.trim()) {
      setError('Role description is required.');
      return;
    }

    setError(null);
    try {
      await onSave(formData as Omit<Experience, 'id'>);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save experience entry.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Company & Role Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Name *"
            placeholder="e.g. Acme Corporation"
            value={formData.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            required
          />

          <Input
            label="Job Role / Title *"
            placeholder="e.g. Senior Frontend Engineer"
            value={formData.role || ''}
            onChange={(e) => handleChange('role', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
              Employment Type
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) => handleChange('employmentType', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <Input
            label="Location"
            placeholder="e.g. New York, NY (Hybrid)"
            value={formData.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Input
            label="Start Date *"
            placeholder="e.g. Jan 2023 or 2023-01"
            value={formData.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            required
          />

          <Input
            label="End Date"
            placeholder={formData.isCurrent ? 'Present (Current Role)' : 'e.g. Dec 2024'}
            value={formData.isCurrent ? '' : formData.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
            disabled={formData.isCurrent}
          />

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">Current Role</label>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isCurrentToggle"
                checked={formData.isCurrent || false}
                onChange={(e) => handleChange('isCurrent', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-[var(--color-surface-elevated)] border-[var(--color-border)] cursor-pointer"
              />
              <label htmlFor="isCurrentToggle" className="text-xs text-[var(--color-text-muted)] cursor-pointer">
                I currently work here
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-1 pt-2">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">
            Role Summary Description *
          </label>
          <textarea
            rows={4}
            placeholder="High-level summary of your position and impact..."
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
        </div>
      </Card>

      {/* Responsibilities, Technologies, Achievements */}
      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
          Key Responsibilities & Achievements
        </h2>

        {/* Responsibilities */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">Responsibilities</label>
          <div className="flex gap-2">
            <input
              type="text"
              id="respInput"
              placeholder="Add key responsibility..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddArrayItem('responsibilities', (e.target as HTMLInputElement).value);
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
                const el = document.getElementById('respInput') as HTMLInputElement;
                if (el) {
                  handleAddArrayItem('responsibilities', el.value);
                  el.value = '';
                }
              }}
              className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
            >
              Add Item
            </Button>
          </div>
          {(formData.responsibilities || []).length > 0 && (
            <ul className="space-y-1.5 pt-2">
              {(formData.responsibilities || []).map((item, idx) => (
                <li key={idx} className="flex justify-between items-center bg-[var(--color-surface)] p-2 rounded-lg text-xs text-[var(--color-text)] border border-[var(--color-border)]">
                  <span>• {item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('responsibilities', item)}
                    className="text-red-400 hover:text-red-300 text-xs ml-2 font-bold"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Technologies Used */}
        <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">Technologies Used</label>
          <div className="flex gap-2">
            <input
              type="text"
              id="techExpInput"
              placeholder="Add technology (e.g. React, TypeScript, Docker)..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddArrayItem('technologies', (e.target as HTMLInputElement).value);
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
                const el = document.getElementById('techExpInput') as HTMLInputElement;
                if (el) {
                  handleAddArrayItem('technologies', el.value);
                  el.value = '';
                }
              }}
              className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] text-xs"
            >
              Add Tech
            </Button>
          </div>
          {(formData.technologies || []).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {(formData.technologies || []).map((tech) => (
                <span key={tech} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950/60 text-indigo-300 text-xs border border-indigo-800">
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('technologies', tech)}
                    className="hover:text-red-400 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Major Achievements */}
        <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
          <label className="block text-xs font-medium text-[var(--color-text-muted)]">Notable Achievements</label>
          <div className="flex gap-2">
            <input
              type="text"
              id="achieveInput"
              placeholder="Add measurable achievement..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddArrayItem('achievements', (e.target as HTMLInputElement).value);
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
                const el = document.getElementById('achieveInput') as HTMLInputElement;
                if (el) {
                  handleAddArrayItem('achievements', el.value);
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
                  <span>🏆 {item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('achievements', item)}
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

      {/* Settings & Controls */}
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
                id="expIsVisible"
                checked={formData.isVisible}
                onChange={(e) => handleChange('isVisible', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-[var(--color-surface-elevated)] border-[var(--color-border)]"
              />
              <label htmlFor="expIsVisible" className="text-xs text-[var(--color-text-muted)] cursor-pointer">
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
          {isSaving ? 'Saving Experience...' : 'Save Experience Entry'}
        </Button>
      </div>
    </form>
  );
}
