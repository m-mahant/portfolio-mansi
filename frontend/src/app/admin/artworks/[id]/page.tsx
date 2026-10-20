'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { Artwork } from '@/types/admin.types';
import { ArtworkForm } from '@/components/admin/artwork-form';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';

// Admin CMS route for editing an existing artwork record.
export default function AdminEditArtworkPage() {
  const { idToken } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const artworkId = params?.id as string;

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetches artwork record details by ID.
  useEffect(() => {
    async function loadArtwork() {
      if (!idToken || !artworkId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getArtworkById(artworkId, idToken);
        setArtwork(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch artwork details.');
      } finally {
        setLoading(false);
      }
    }
    loadArtwork();
  }, [idToken, artworkId]);

  // Updates artwork record via PATCH request and navigates back to artwork list.
  const handleSave = async (formData: Omit<Artwork, 'id'> | Partial<Artwork>) => {
    if (!idToken || !artworkId) return;
    try {
      setSaving(true);
      setError(null);
      await adminApi.updateArtwork(artworkId, formData as Partial<Artwork>, idToken);
      router.push('/admin/artworks');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update artwork.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Artwork Details..." />
      </div>
    );
  }

  if (!artwork && !error) {
    return (
      <div className="py-16 text-center text-[var(--color-text-muted)]">
        Artwork record not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
            <Link href="/admin/artworks" className="hover:text-[var(--color-text)]">
              ← Back to Artworks
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Edit Artwork: {artwork?.title}
          </h1>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {artwork && (
        <ArtworkForm initialData={artwork} onSave={handleSave} isSaving={saving} />
      )}
    </div>
  );
}
