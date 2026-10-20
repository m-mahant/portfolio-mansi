'use client';

import React, { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { Blog } from '@/types/admin.types';
import { BlogForm } from '@/components/admin/blog-form';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

// Admin CMS route for editing an existing blog article.
export default function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { idToken } = useAdminAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadBlog = useCallback(async () => {
    if (!idToken || !id) return;
    try {
      setLoading(true);
      const data = await adminApi.getBlogById(id, idToken);
      setBlog(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load blog post.');
    } finally {
      setLoading(false);
    }
  }, [idToken, id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBlog();
  }, [loadBlog]);

  const handleSave = async (data: Partial<Blog>) => {
    if (!idToken || !id) {
      setError('Authentication token or blog ID missing.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await adminApi.updateBlog(id, data, idToken);
      router.push('/admin/blogs');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update blog post.');
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Article..." />
      </div>
    );
  }

  if (!blog && !loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Alert type="error" message={error || 'Blog post not found.'} />
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] font-medium hover:underline"
        >
          <ArrowLeft size={16} /> Return to Blog Management
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blogs"
          className="p-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors text-[var(--color-text-muted)]"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Edit Article</h1>
          <p className="text-xs text-[var(--color-text-muted)] font-mono">ID: {id}</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {blog && <BlogForm initialData={blog} onSave={handleSave} isSaving={isSaving} />}
    </div>
  );
}
