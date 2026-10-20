'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { Blog } from '@/types/admin.types';
import { BlogForm } from '@/components/admin/blog-form';
import { Alert } from '@/components/ui/alert';

// Admin CMS route for drafting and publishing a new blog article.
export default function NewBlogPage() {
  const router = useRouter();
  const { idToken } = useAdminAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (data: Partial<Blog>) => {
    if (!idToken) {
      setError('Authentication token expired. Please log in again.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await adminApi.createBlog(data, idToken);
      router.push('/admin/blogs');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create blog post.');
      setIsSaving(false);
    }
  };

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
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Create New Article</h1>
          <p className="text-xs text-[var(--color-text-muted)]">
            Draft a new post, assign cover image, categories, and SEO tags.
          </p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <BlogForm onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
