'use client';

// Admin CMS Navigation Sidebar with Liquid Glass styling and Mobile Drawer support.

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BRAND_NAME } from '@/lib/brand';

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: '📊', category: 'Overview' },
  { label: 'Intro Page', href: '/admin/intro', icon: '✨', category: 'Public Pages' },
  { label: 'Home Page', href: '/admin/home', icon: '🏠', category: 'Public Pages' },
  { label: 'About Page', href: '/admin/about', icon: '👤', category: 'Public Pages' },
  { label: 'Work Page', href: '/admin/work', icon: '💼', category: 'Public Pages' },
  { label: 'Development Page', href: '/admin/development', icon: '💻', category: 'Public Pages' },
  { label: 'Art Page', href: '/admin/art-crafts', icon: '🎨', category: 'Public Pages' },
  { label: 'Blog Page', href: '/admin/blog-page', icon: '📰', category: 'Public Pages' },
  { label: 'Experience Page', href: '/admin/experience-page', icon: '🧭', category: 'Public Pages' },
  { label: 'Contact Page', href: '/admin/contact', icon: '✉️', category: 'Public Pages' },
  { label: 'Privacy Page', href: '/admin/privacy', icon: '🔒', category: 'Public Pages' },
  { label: 'Projects', href: '/admin/projects', icon: '💻', category: 'Content Catalogs' },
  { label: 'Artworks', href: '/admin/artworks', icon: '🎨', category: 'Content Catalogs' },
  { label: 'Blogs', href: '/admin/blogs', icon: '📝', category: 'Content Catalogs' },
  { label: 'Experience', href: '/admin/experience', icon: '⏳', category: 'Content Catalogs' },
  { label: 'Education', href: '/admin/education', icon: '🎓', category: 'Content Catalogs' },
  { label: 'Social Links', href: '/admin/social', icon: '🔗', category: 'System' },
  { label: 'Site Settings', href: '/admin/site', icon: '⚙️', category: 'System' },
  { label: 'Media Assets', href: '/admin/media', icon: '🖼️', category: 'System' },
  { label: 'SEO Management', href: '/admin/seo', icon: '🔍', category: 'System' },
  { label: 'Theme Tokens', href: '/admin/theme', icon: '✨', category: 'System' },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen = false,
  onMobileClose = () => {},
}) => {
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    onMobileClose();
  }, [pathname, onMobileClose]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const categories = Array.from(new Set(NAV_ITEMS.map((item) => item.category)));

  const isActiveHref = (href: string) =>
    href === '/admin'
      ? pathname === '/admin'
      : pathname === href || pathname.startsWith(`${href}/`);

  const sidebarContent = (
    <div className="h-full flex flex-col min-h-0">
      <div className="h-14 sm:h-16 px-5 border-b border-[var(--glass-border)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center font-extrabold text-white text-base shadow-md shadow-[var(--color-primary)]/30 shrink-0">
            L
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm text-[var(--color-text)] leading-none font-heading truncate">
              Admin CMS
            </h1>
            <span className="text-[11px] text-[var(--color-muted)] font-mono truncate block">
              {BRAND_NAME}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onMobileClose}
          className="md:hidden p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)]"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav className="p-3 space-y-4 flex-1 min-h-0 overflow-y-auto">
        {categories.map((cat) => (
          <div key={cat} className="space-y-1">
            <div className="px-3.5 pt-1 pb-0.5 text-[10px] uppercase tracking-wider font-mono font-bold text-[var(--color-muted)]">
              {cat}
            </div>
            {NAV_ITEMS.filter((item) => item.category === cat).map((item) => {
              const isActive = isActiveHref(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 shadow-xs'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--glass-highlight)]'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="font-nav">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar — fixed height, never scrolls with the page; only nav scrolls internally if needed */}
      <aside className="hidden md:flex w-64 glass-panel-strong border-r border-[var(--glass-border)] text-[var(--color-text)] flex-col shrink-0 h-full z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[min(18rem,88vw)] glass-panel-strong border-r border-[var(--glass-border)] text-[var(--color-text)] z-50 md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
