'use client';

// Renders the primary desktop and mobile navigation menu with accessible Work dropdown and Theme Switcher.

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/types/public.types';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Works',
    href: '/work',
    children: [
      { label: 'Development', href: '/work/development', description: 'Software engineering case studies & architecture' },
      { label: 'Art & Crafts', href: '/work/art-crafts', description: 'Digital illustration, concept art & photography' },
    ],
  },
  { label: 'Experience', href: '/experience' },
  { label: 'Blogs', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const PublicNavigation: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workDropdownOpen, setWorkDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close dropdown when clicking outside or pressing Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setWorkDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setWorkDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setWorkDropdownOpen(false);
  };

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="relative flex items-center gap-2 sm:gap-4" aria-label="Main Navigation">
      {/* Desktop Navigation Menu */}
      <ul className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium font-nav">
        {PUBLIC_NAV_ITEMS.map((item) => {
          const active = isLinkActive(item.href);

          if (item.children) {
            return (
              <li
                key={item.label}
                ref={dropdownRef}
                className="relative group"
                onMouseEnter={() => setWorkDropdownOpen(true)}
                onMouseLeave={() => setWorkDropdownOpen(false)}
              >
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={closeMenus}
                    className={`px-2.5 lg:px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                      active
                        ? 'text-[var(--color-primary)] font-semibold'
                        : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]/60'
                    }`}
                    aria-expanded={workDropdownOpen}
                  >
                    <span>{item.label}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        workDropdownOpen ? 'rotate-180 text-[var(--color-primary)]' : 'text-[var(--color-muted)]'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                </div>

                {workDropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] glass-panel-strong p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={closeMenus}
                          className={`block p-2.5 rounded-lg transition-all ${
                            childActive
                              ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)]/30'
                              : 'hover:bg-[var(--glass-highlight)] text-[var(--color-text)]'
                          }`}
                          role="menuitem"
                        >
                          <div className="text-xs font-semibold">{child.label}</div>
                          {child.description && (
                            <p className="text-[11px] text-[var(--color-muted)] font-normal mt-0.5">{child.description}</p>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          }

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`px-2.5 lg:px-3.5 py-2 rounded-lg transition-all text-xs font-semibold ${
                  active
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--glass-highlight)]'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="hidden md:block">
        <ThemeSwitcher />
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <ThemeSwitcher />
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="p-2 text-[var(--color-muted)] hover:text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-lg glass-button"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Full-bleed mobile navigation panel under header */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-14 sm:top-16 z-40 bg-black/40 md:hidden"
            onClick={closeMenus}
            aria-hidden="true"
          />
          <div className="fixed left-0 right-0 top-14 sm:top-16 z-50 p-4 glass-panel-strong border-b border-[var(--glass-border)] md:hidden max-h-[calc(100dvh-3.5rem)] overflow-y-auto flex flex-col gap-2 shadow-xl">
            {PUBLIC_NAV_ITEMS.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] border-b border-[var(--glass-border)]">
                      <span>{item.label}</span>
                    </div>
                    <div className="pl-2 space-y-1 mt-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={closeMenus}
                          className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            pathname === child.href
                              ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)]/30'
                              : 'text-[var(--color-muted)] hover:bg-[var(--glass-highlight)] hover:text-[var(--color-text)]'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenus}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isLinkActive(item.href)
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)]/30'
                      : 'text-[var(--color-muted)] hover:bg-[var(--glass-highlight)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </nav>
  );
};
