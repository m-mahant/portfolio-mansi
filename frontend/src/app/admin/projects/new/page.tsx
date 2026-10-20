'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { Project } from '@/types/admin.types';
import { ProjectForm } from '@/components/admin/project-form';
import { Alert } from '@/components/ui/alert';

// Admin CMS route for creating a new project case study.
export default function AdminCreateProjectPage() {
  const { idToken } = useAdminAuth();
  const router = useRouter();
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Submits the new project payload to the backend API.
  const handleSave = async (formData: Omit<Project, 'id'> | Partial<Project>) => {
    if (!idToken) return;
    try {
      setSaving(true);
      setError(null);
      await adminApi.createProject(formData as Omit<Project, 'id'>, idToken);
      router.push('/admin/projects');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create project.');
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
            <Link href="/admin/projects" className="hover:text-[var(--color-text)] font-medium">
              ← Back to Projects
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] font-heading">Create New Project</h1>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <ProjectForm onSave={handleSave} isSaving={saving} />
    </div>
  );
}
