import React from 'react';
import Link from 'next/link';
import { PublicContainer } from './public-container';

interface PublicFooterProps {
  siteName?: string;
  copyrightText?: string;
}

// Renders the global public website footer with navigation links and copyright information.
export const PublicFooter: React.FC<PublicFooterProps> = ({
  siteName = 'Mansi Mahant',
  copyrightText,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-transparent text-[var(--color-muted)] py-12 transition-colors duration-200">
      <PublicContainer className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <p className="font-semibold text-[var(--color-text)]">{siteName}</p>
          <p className="text-[var(--color-muted)] opacity-80">
            {copyrightText || `© ${currentYear} Mansi Mahant. All rights reserved.`}
          </p>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
          <li>
            <Link href="/" className="hover:text-[var(--color-text)] transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-[var(--color-text)] transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link href="/work/development" className="hover:text-[var(--color-text)] transition-colors">
              Development
            </Link>
          </li>
          <li>
            <Link href="/work/art-crafts" className="hover:text-[var(--color-text)] transition-colors">
              Art & Crafts
            </Link>
          </li>
          <li>
            <Link href="/experience" className="hover:text-[var(--color-text)] transition-colors">
              Experience
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-[var(--color-text)] transition-colors">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="hover:text-[var(--color-text)] transition-colors">
              Privacy
            </Link>
          </li>
        </ul>
      </PublicContainer>
    </footer>
  );
};
