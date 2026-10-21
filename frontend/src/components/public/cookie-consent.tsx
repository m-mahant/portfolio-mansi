'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GoogleAnalytics } from '@next/third-parties/google';
import { PublicButton } from './public-button';

const CONSENT_KEY = 'cookie-consent';
type ConsentValue = 'accepted' | 'declined';

interface CookieConsentProps {
  gaId?: string;
}

// Shows a cookie-consent banner on first visit; Google Analytics only loads after acceptance.
export function CookieConsent({ gaId }: CookieConsentProps) {
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === 'accepted' || stored === 'declined') {
        setConsent(stored);
      }
    } catch {
      // Private browsing / blocked storage: banner just shows each visit.
    }
  }, []);

  const choose = (value: ConsentValue) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Ignore storage failures; the choice still applies for this session.
    }
    setConsent(value);
  };

  if (!mounted) return null;

  return (
    <>
      {consent === 'accepted' && gaId && <GoogleAnalytics gaId={gaId} />}

      {consent === null && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed bottom-0 inset-x-0 z-[90] p-4 sm:p-5 bg-[var(--color-surface)]/95 backdrop-blur-md border-t border-[var(--color-border)] shadow-2xl"
        >
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center gap-4">
            <p className="text-xs sm:text-sm text-[var(--color-muted)] flex-1">
              This site uses cookies for analytics to understand site traffic. See the{' '}
              <Link href="/privacy" className="text-[var(--color-primary)] underline underline-offset-2">
                Privacy Policy
              </Link>{' '}
              for details.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <PublicButton variant="outline" size="sm" onClick={() => choose('declined')}>
                Decline
              </PublicButton>
              <PublicButton variant="solid" size="sm" onClick={() => choose('accepted')}>
                Accept
              </PublicButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
