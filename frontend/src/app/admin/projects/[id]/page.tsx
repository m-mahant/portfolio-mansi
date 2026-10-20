'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { Project } from '@/types/admin.types';
import { ProjectForm } from '@/components/admin/project-form';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';

// Admin CMS route for editing an existing engineering project.
export default function AdminEditProjectPage() {
  const { idToken } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetches project details by ID from the Express backend API.
  useEffect(() => {
    async function loadProject() {
      if (!idToken || !projectId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await adminApi.getProjectById(projectId, idToken);
        setProject(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project details.');
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [idToken, projectId]);

  // Updates the project via PATCH request and navigates back to list.
  const handleSave = async (formData: Omit<Project, 'id'> | Partial<Project>) => {
    if (!idToken || !projectId) return;
    try {
      setSaving(true);
      setError(null);
      await adminApi.updateProject(projectId, formData as Partial<Project>, idToken);
      router.push('/admin/projects');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update project.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Project Details..." />
      </div>
    );
  }

  if (!project && !error) {
    return (
      <div className="py-16 text-center text-[var(--color-text-muted)]">
        Project record not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
            <Link href="/admin/projects" className="hover:text-[var(--color-text)] font-medium">
              ← Back to Projects
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] font-heading">
            Edit Project: {project?.title}
          </h1>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {project && (
        <ProjectForm initialData={project} onSave={handleSave} isSaving={saving} />
      )}
    </div>
  );
}
