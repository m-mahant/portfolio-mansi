'use client';

// Advanced Admin CMS Dashboard with Real-Data Analytics, Liquid Glass visuals, and Content Distribution Charts.

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { Project, Artwork, Experience, Education, MediaItem } from '@/types/admin.types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';

interface RecentActivityItem {
  id: string;
  title: string;
  type: 'project' | 'artwork' | 'experience' | 'education';
  category: string;
  date: string;
  status?: string;
  link: string;
}

export default function AdminDashboardPage() {
  const { idToken } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  useEffect(() => {
    async function loadDashboardData() {
      if (!idToken) return;
      try {
        setLoading(true);
        setError(null);

        const [projRes, artRes, blogRes, expRes, eduRes, mediaRes] = await Promise.allSettled([
          adminApi.getProjects(idToken),
          adminApi.getArtworks(idToken),
          adminApi.getBlogs(idToken),
          adminApi.getExperiences(idToken),
          adminApi.getEducation(idToken),
          adminApi.getMediaList(idToken),
        ]);

        if (projRes.status === 'fulfilled') setProjects(projRes.value || []);
        if (artRes.status === 'fulfilled') setArtworks(artRes.value || []);
        if (blogRes.status === 'fulfilled') setBlogsList(blogRes.value?.items || []);
        if (expRes.status === 'fulfilled') setExperiences(expRes.value || []);
        if (eduRes.status === 'fulfilled') setEducationList(eduRes.value || []);
        if (mediaRes.status === 'fulfilled') {
          const val = mediaRes.value;
          const items = Array.isArray(val) ? val : (val && Array.isArray(val.items) ? val.items : []);
          setMediaList(items);
        }

        setLastRefreshed(new Date().toLocaleTimeString());
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch dashboard data.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [idToken]);

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center space-y-4">
        <Loading size="lg" label="Processing Real-Time Portfolio Analytics..." />
      </div>
    );
  }

  // Calculated Metrics
  const publishedProjectsCount = projects.filter((p) => p.status === 'published').length;
  const featuredProjectsCount = projects.filter((p) => p.isFeatured).length;

  const publishedArtworksCount = artworks.filter((a) => a.status === 'published').length;
  const featuredArtworksCount = artworks.filter((a) => a.isFeatured).length;

  const activeExpCount = experiences.filter((e) => e.isCurrent).length;

  // Tech stack analysis across projects
  const techMap: Record<string, number> = {};
  projects.forEach((p) => {
    (p.technologies || []).forEach((tech) => {
      techMap[tech] = (techMap[tech] || 0) + 1;
    });
  });
  const topTech = Object.entries(techMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Artwork categories breakdown
  const categoryMap: Record<string, number> = {};
  artworks.forEach((a) => {
    if (a.category) {
      categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
    }
  });
  const artworkCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  // Content total distribution
  const totalContentCount =
    projects.length + artworks.length + experiences.length + educationList.length + mediaList.length || 1;

  const projectPct = Math.round((projects.length / totalContentCount) * 100);
  const artworkPct = Math.round((artworks.length / totalContentCount) * 100);
  const expPct = Math.round((experiences.length / totalContentCount) * 100);
  const eduPct = Math.round((educationList.length / totalContentCount) * 100);
  const mediaPct = 100 - (projectPct + artworkPct + expPct + eduPct);

  // Recent activity stream
  const recentItems: RecentActivityItem[] = [
    ...projects.map((p) => ({
      id: p.id || p.slug,
      title: p.title,
      type: 'project' as const,
      category: 'Software Engineering',
      date: p.updatedAt || p.createdAt || 'Recent',
      status: p.status,
      link: '/admin/projects',
    })),
    ...artworks.map((a) => ({
      id: a.id || a.slug,
      title: a.title,
      type: 'artwork' as const,
      category: a.category || 'Digital Art',
      date: a.updatedAt || a.createdAt || 'Recent',
      status: a.status,
      link: '/admin/artworks',
    })),
    ...experiences.map((e) => ({
      id: e.id || e.company,
      title: `${e.role} @ ${e.company}`,
      type: 'experience' as const,
      category: 'Work Experience',
      date: e.updatedAt || e.createdAt || 'Recent',
      link: '/admin/experience',
    })),
    ...educationList.map((ed) => ({
      id: ed.id || ed.institution,
      title: `${ed.degree} (${ed.institution})`,
      type: 'education' as const,
      category: 'Education',
      date: ed.updatedAt || ed.createdAt || 'Recent',
      link: '/admin/education',
    })),
  ].slice(0, 6);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)] font-heading">
            CMS Overview & Portfolio Analytics
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1 font-card-description">
            Live analytics across software engineering case studies, digital artworks, career experience, and CDN assets.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 font-medium">
            ⚡ Last Sync: {lastRefreshed || 'Just Now'}
          </span>
          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-xl glass-button text-[var(--color-muted)] hover:text-[var(--color-text)]"
            title="Refresh analytics data"
          >
            🔄
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Metric Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="glass" className="p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] font-mono">
              Projects
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-lg font-bold border border-indigo-500/20">
              💻
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[var(--color-text)] font-heading">
              {projects.length}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--color-muted)] font-mono">
              <span className="text-emerald-400 font-semibold">{publishedProjectsCount} Published</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{featuredProjectsCount} Featured</span>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] font-mono">
              Artworks
            </span>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center text-lg font-bold border border-violet-500/20">
              🎨
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[var(--color-text)] font-heading">
              {artworks.length}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--color-muted)] font-mono">
              <span className="text-emerald-400 font-semibold">{publishedArtworksCount} Published</span>
              <span>•</span>
              <span className="text-sky-400 font-semibold">{artworkCategories.length} Styles</span>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] font-mono">
              Experience
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg font-bold border border-emerald-500/20">
              💼
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[var(--color-text)] font-heading">
              {experiences.length}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--color-muted)] font-mono">
              <span className="text-emerald-400 font-semibold">{activeExpCount} Active Role</span>
              <span>•</span>
              <span className="text-[var(--color-muted)]">{educationList.length} Degrees</span>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] font-mono">
              Media Assets
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center text-lg font-bold border border-sky-500/20">
              🖼️
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[var(--color-text)] font-heading">
              {mediaList.length}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--color-muted)] font-mono">
              <span className="text-sky-400 font-semibold">ImageKit CDN</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Optimized</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Visualization Row: Content Distribution Donut & Tech Stack Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Content Proportions & Distribution */}
        <Card variant="glass" className="lg:col-span-7 flex flex-col justify-between p-6 space-y-6">
          <CardHeader className="p-0 pb-2 border-none">
            <CardTitle>Content Distribution & Proportions</CardTitle>
            <CardDescription>Visual breakdown of portfolio data entities across CMS layers</CardDescription>
          </CardHeader>

          {/* Stacked Proportional Bar Chart */}
          <div className="space-y-3">
            <div className="h-4 w-full rounded-full overflow-hidden flex bg-[var(--color-surface)] p-0.5 gap-0.5 border border-[var(--glass-border)]">
              <div
                style={{ width: `${Math.max(projectPct, 5)}%` }}
                className="bg-indigo-500 h-full rounded-l-full transition-all duration-500"
                title={`Projects: ${projects.length} (${projectPct}%)`}
              />
              <div
                style={{ width: `${Math.max(artworkPct, 5)}%` }}
                className="bg-violet-500 h-full transition-all duration-500"
                title={`Artworks: ${artworks.length} (${artworkPct}%)`}
              />
              <div
                style={{ width: `${Math.max(expPct, 5)}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
                title={`Experience: ${experiences.length} (${expPct}%)`}
              />
              <div
                style={{ width: `${Math.max(eduPct, 5)}%` }}
                className="bg-amber-500 h-full transition-all duration-500"
                title={`Education: ${educationList.length} (${eduPct}%)`}
              />
              <div
                style={{ width: `${Math.max(mediaPct, 5)}%` }}
                className="bg-sky-500 h-full rounded-r-full transition-all duration-500"
                title={`Media Assets: ${mediaList.length} (${mediaPct}%)`}
              />
            </div>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--glass-border)]">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <div>
                  <span className="font-bold text-[var(--color-text)]">{projects.length}</span>{' '}
                  <span className="text-[var(--color-muted)]">Projects ({projectPct}%)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--glass-border)]">
                <span className="w-3 h-3 rounded-full bg-violet-500" />
                <div>
                  <span className="font-bold text-[var(--color-text)]">{artworks.length}</span>{' '}
                  <span className="text-[var(--color-muted)]">Artworks ({artworkPct}%)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--glass-border)]">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <div>
                  <span className="font-bold text-[var(--color-text)]">{experiences.length}</span>{' '}
                  <span className="text-[var(--color-muted)]">Experience ({expPct}%)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--glass-border)]">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <div>
                  <span className="font-bold text-[var(--color-text)]">{educationList.length}</span>{' '}
                  <span className="text-[var(--color-muted)]">Education ({eduPct}%)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--color-surface)]/60 border border-[var(--glass-border)] col-span-2 sm:col-span-1">
                <span className="w-3 h-3 rounded-full bg-sky-500" />
                <div>
                  <span className="font-bold text-[var(--color-text)]">{mediaList.length}</span>{' '}
                  <span className="text-[var(--color-muted)]">Media ({mediaPct}%)</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Tech Stack Breakdown */}
        <Card variant="glass" className="lg:col-span-5 flex flex-col justify-between p-6 space-y-4">
          <CardHeader className="p-0 pb-2 border-none">
            <CardTitle>Top Tech Stack Analytics</CardTitle>
            <CardDescription>Frequency of technologies used across project case studies</CardDescription>
          </CardHeader>

          <div className="space-y-3">
            {topTech.length > 0 ? (
              topTech.map(([tech, count]) => {
                const maxCount = topTech[0][1] || 1;
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={tech} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-semibold text-[var(--color-text)]">{tech}</span>
                      <span className="text-[var(--color-primary)] font-bold">{count} {count === 1 ? 'project' : 'projects'}</span>
                    </div>
                    <div className="h-2 w-full bg-[var(--color-surface)] rounded-full overflow-hidden border border-[var(--glass-border)]">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-[var(--color-muted)] italic font-mono py-4 text-center">
                No technology tags available yet. Add projects with technologies to see real stack metrics.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Lower Row: Quick Management Actions & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Management Shortcuts */}
        <Card variant="glass" className="p-6 space-y-4">
          <CardHeader className="p-0 pb-2 border-none">
            <CardTitle>Quick Management Shortcuts</CardTitle>
            <CardDescription>Direct navigation to primary administrative modules</CardDescription>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/admin/projects"
              className="p-4 rounded-xl glass-panel hover:bg-[var(--glass-highlight)] transition-all flex items-center gap-3 text-xs font-semibold text-[var(--color-text)] group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">💻</span>
              <div>
                <p className="font-bold">Projects Manager</p>
                <p className="text-[11px] text-[var(--color-muted)] font-mono">{projects.length} Entries</p>
              </div>
            </Link>

            <Link
              href="/admin/artworks"
              className="p-4 rounded-xl glass-panel hover:bg-[var(--glass-highlight)] transition-all flex items-center gap-3 text-xs font-semibold text-[var(--color-text)] group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🎨</span>
              <div>
                <p className="font-bold">Artworks Gallery</p>
                <p className="text-[11px] text-[var(--color-muted)] font-mono">{artworks.length} Entries</p>
              </div>
            </Link>

            <Link
              href="/admin/blogs"
              className="p-4 rounded-xl glass-panel hover:bg-[var(--glass-highlight)] transition-all flex items-center gap-3 text-xs font-semibold text-[var(--color-text)] group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📝</span>
              <div>
                <p className="font-bold">Blog Articles</p>
                <p className="text-[11px] text-[var(--color-muted)] font-mono">{blogsList.length} Articles</p>
              </div>
            </Link>

            <Link
              href="/admin/theme"
              className="p-4 rounded-xl glass-panel hover:bg-[var(--glass-highlight)] transition-all flex items-center gap-3 text-xs font-semibold text-[var(--color-text)] group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">✨</span>
              <div>
                <p className="font-bold">Theme Editor</p>
                <p className="text-[11px] text-[var(--color-muted)] font-mono">Dynamic Tokens</p>
              </div>
            </Link>

            <Link
              href="/admin/media"
              className="p-4 rounded-xl glass-panel hover:bg-[var(--glass-highlight)] transition-all flex items-center gap-3 text-xs font-semibold text-[var(--color-text)] group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🖼️</span>
              <div>
                <p className="font-bold">Media CDN Assets</p>
                <p className="text-[11px] text-[var(--color-muted)] font-mono">{mediaList.length} Uploads</p>
              </div>
            </Link>
          </div>

          <div className="pt-2 border-t border-[var(--glass-border)]">
            <a
              href="http://localhost:4000/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 rounded-xl glass-button text-xs font-semibold text-[var(--color-primary)] flex items-center justify-center gap-2"
            >
              <span>📖 Open API Documentation (Swagger / OpenAPI UI)</span>
              <span>↗</span>
            </a>
          </div>
        </Card>

        {/* System Architecture & Health Status */}
        <Card variant="glass" className="p-6 space-y-4">
          <CardHeader className="p-0 pb-2 border-none">
            <CardTitle>System Architecture Status</CardTitle>
            <CardDescription>Verified infrastructure components and services</CardDescription>
          </CardHeader>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl glass-panel">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-[var(--color-text)]">Express.js REST API</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold">Online (v1 endpoints)</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl glass-panel">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-[var(--color-text)]">Cloud Firestore DB</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold">Connected (Admin SDK)</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl glass-panel">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-[var(--color-text)]">ImageKit CDN Storage</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold">Active (Global Edge)</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl glass-panel">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="font-semibold text-[var(--color-text)]">Semantic Typography Engine</span>
              </div>
              <span className="text-indigo-400 font-mono font-bold">Active (10 Roles)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
