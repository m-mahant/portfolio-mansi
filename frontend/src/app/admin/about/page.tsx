'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { AboutProfile } from '@/types/admin.types';
import { AboutForm } from '@/components/admin/about-form';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';

// Admin CMS route for managing owner biography and dual-identity background.
export default function AdminAboutPage() {
  const { idToken } = useAdminAuth();
  const [aboutData, setAboutData] = useState<Partial<AboutProfile>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetches initial about profile from Express backend API.
  useEffect(() => {
    async function loadData() {
      if (!idToken) return;
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getAboutProfile(idToken);
        setAboutData(data || {});
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch about profile.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [idToken]);

  // Handles updating about profile via PATCH request.
  const handleSave = async (updatedData: Partial<AboutProfile>) => {
    if (!idToken) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const res = await adminApi.updateAboutProfile(updatedData, idToken);
      setAboutData(res);
      setSuccess('About profile updated successfully!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update about profile.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading About Profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">About Profile</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Manage developer narrative, biography, dual engineering/artistry sides, and personal images.
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <AboutForm initialData={aboutData} onSave={handleSave} isSaving={saving} />
    </div>
  );
}
