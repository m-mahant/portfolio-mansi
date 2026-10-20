'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { Artwork } from '@/types/admin.types';
import { ArtworkForm } from '@/components/admin/artwork-form';
import { Alert } from '@/components/ui/alert';

// Admin CMS route for creating a new artwork entry.
export default function AdminCreateArtworkPage() {
  const { idToken } = useAdminAuth();
  const router = useRouter();
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Submits new artwork payload to Express backend API.
  const handleSave = async (formData: Omit<Artwork, 'id'> | Partial<Artwork>) => {
    if (!idToken) return;
    try {
      setSaving(true);
      setError(null);
      await adminApi.createArtwork(formData as Omit<Artwork, 'id'>, idToken);
      router.push('/admin/artworks');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create artwork.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
            <Link href="/admin/artworks" className="hover:text-[var(--color-text)]">
              ← Back to Artworks
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Create New Artwork</h1>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <ArtworkForm onSave={handleSave} isSaving={saving} />
    </div>
  );
}
