'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { Blog, BlogStatus } from '@/types/admin.types';
import { DeleteModal } from '@/components/admin/delete-modal';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Admin CMS page for managing blog posts list.
export default function AdminBlogsPage() {
  const { idToken } = useAdminAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetches blog posts list from backend API.
  const loadBlogs = useCallback(async () => {
    if (!idToken) return;
    try {
      const response = await adminApi.getBlogs(idToken);
      setBlogs(response?.items || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts.');
    } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBlogs();
  }, [loadBlogs]);

  // Handles deleting a blog post after user confirmation.
  const handleDeleteConfirm = async () => {
    if (!idToken || !deletingId) return;
    try {
      setIsDeleting(true);
      setError(null);
      await adminApi.deleteBlog(deletingId, idToken);
      setSuccess('Blog post deleted successfully.');
      setDeletingId(null);
      await loadBlogs();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog post.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filters blogs based on search term and status filter.
  const filteredBlogs = blogs.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Renders text-only status indicator.
  const renderStatusBadge = (status: BlogStatus) => {
    switch (status) {
      case 'published':
        return <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">Published</span>;
      case 'archived':
        return <span className="font-semibold text-xs text-[var(--color-text-muted)]">Archived</span>;
      default:
        return <span className="font-semibold text-xs text-amber-600 dark:text-amber-400">Draft</span>;
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Blog Posts..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Blog CMS Management</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Publish articles, tech guides, creative notes, and SEO metadata.
          </p>
        </div>

        <Link href="/admin/blogs/new">
          <Button variant="primary" size="md">
            + New Article
          </Button>
        </Link>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by title, slug, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-[var(--color-border)] rounded-md bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-md bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <p className="text-base font-medium">No blog posts found.</p>
            <p className="text-xs mt-1">Create your first article or try modifying search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[var(--color-surface)]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {blog.featuredImage?.url ? (
                          <img
                            src={blog.featuredImage.url}
                            alt={blog.title}
                            className="w-10 h-10 object-cover rounded-md border border-[var(--color-border)] shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-xs shrink-0">
                            📝
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[var(--color-text)] truncate max-w-xs">{blog.title}</p>
                          <p className="text-xs text-[var(--color-text-muted)] font-mono truncate max-w-xs">
                            /{blog.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-xs font-medium text-[var(--color-text-muted)]">
                      {blog.category || 'General'}
                    </td>

                    <td className="py-3 px-4">{renderStatusBadge(blog.status)}</td>

                    <td className="py-3 px-4 text-xs text-[var(--color-text-muted)]">
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString()
                        : new Date(blog.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blogs/${blog.id}`}>
                          <button
                            type="button"
                            className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                            title="Edit Article"
                          >
                            <Pencil size={16} />
                          </button>
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDeletingId(blog.id)}
                          className="p-1 text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingId}
        onCancel={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Blog Post"
        description="Are you sure you want to delete this article? This operation cannot be undone."
      />
    </div>
  );
}
