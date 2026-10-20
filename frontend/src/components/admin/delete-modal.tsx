'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DeleteModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Renders an accessible confirmation dialog modal for destructive deletion actions.
export function DeleteModal({
  isOpen,
  title,
  description,
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <Card className="w-full max-w-md bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] shadow-2xl p-6 rounded-xl">
        <h2 id="delete-modal-title" className="text-xl font-bold text-[var(--color-text)] mb-2">
          {title}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex justify-end items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
            className="border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-text)]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            isLoading={isDeleting}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
