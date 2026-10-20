'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { SiteSettings } from '@/types/admin.types';
import { SiteForm } from '@/components/admin/site-form';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';

// Admin CMS route for managing global site settings.
export default function AdminSiteSettingsPage() {
  const { idToken } = useAdminAuth();
  const [siteData, setSiteData] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetches initial site settings from the Express backend API.
  useEffect(() => {
    async function loadData() {
      if (!idToken) return;
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getSiteSettings(idToken);
        setSiteData(data || {});
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch site settings.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [idToken]);

  // Handles updating site settings via PATCH request.
  const handleSave = async (updatedData: Partial<SiteSettings>) => {
    if (!idToken) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const res = await adminApi.updateSiteSettings(updatedData, idToken);
      setSiteData(res);
      setSuccess('Site settings updated successfully!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update site settings.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Site Settings..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Site Settings</h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Configure site branding, contact information, resume document, and global SEO metadata.
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <SiteForm initialData={siteData} onSave={handleSave} isSaving={saving} />
    </div>
  );
}
