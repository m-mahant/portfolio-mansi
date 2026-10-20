'use client';

// Renders the global public website header containing branding logo and primary navigation.

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SiteSettings } from '@/types/public.types';
import { PublicContainer } from './public-container';
import { PublicNavigation } from './public-navigation';

interface PublicHeaderProps {
  siteName?: string;
  site?: SiteSettings | null;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ siteName = 'Lumenfolio', site }) => {
  const name = site?.siteName || siteName;
  const logoUrl = site?.logo?.url;
  const logoAlt = site?.logo?.altText || name;

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-colors duration-200">
      <PublicContainer className="relative flex h-14 sm:h-16 items-center justify-between gap-3">
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
      </PublicContainer>
    </header>
  );
};
