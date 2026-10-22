'use client';

// Renders the global public website header as a floating liquid-glass navigation bar.

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SiteSettings } from '@/types/public.types';
import { PublicNavigation } from './public-navigation';

interface PublicHeaderProps {
  siteName?: string;
  site?: SiteSettings | null;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ siteName = 'Mansi Mahant', site }) => {
  const name = site?.siteName || siteName;
  const logoUrl = site?.logo?.url;
  const logoAlt = site?.logo?.altText || name;

  return (
    <div className="sticky top-0 z-40 w-full py-3 sm:py-4 px-3 sm:px-4">
      <header
        className="mx-auto max-w-6xl rounded-[2rem] border border-[var(--glass-border)] shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-200"
        style={{ background: 'var(--glass-bg-faint)' }}
      >
        <div className="relative flex h-14 sm:h-16 items-center justify-between gap-3 px-4 sm:px-5">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 md:flex-none text-sm sm:text-base font-bold tracking-tight text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors group"
          >
            {logoUrl ? (
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shrink-0 group-hover:border-[var(--color-primary)] transition-colors">
                <Image src={logoUrl} alt={logoAlt} fill className="object-contain p-0.5" />
              </div>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] shadow-sm shadow-[var(--color-primary)] animate-pulse shrink-0" />
            )}
            <span
              style={{ fontFamily: 'var(--font-heading, inherit)' }}
              className="tracking-wide truncate max-w-[11rem] sm:max-w-[18rem] md:max-w-none"
            >
              {name}
            </span>
          </Link>

          <div className="shrink-0">
            <PublicNavigation />
          </div>
        </div>
      </header>
    </div>
  );
};
