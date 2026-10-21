'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
  className?: string;
}

// Lightweight share links (X, LinkedIn, WhatsApp) plus copy-to-clipboard — no login required, unlike comments.
export function ShareButtons({ title, url, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const shareUrl = url || window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (unsupported browser or permission denied); no-op.
    }
  };

  const buildHref = (platform: 'x' | 'linkedin' | 'whatsapp') => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    switch (platform) {
      case 'x':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      case 'whatsapp':
        return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    }
  };

  const buttonClass =
    'px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50 transition-colors';

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs font-medium text-[var(--color-muted)]">Share:</span>
      <a href={buildHref('x')} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        X
      </a>
      <a href={buildHref('linkedin')} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        LinkedIn
      </a>
      <a href={buildHref('whatsapp')} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        WhatsApp
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        className={`${buttonClass} inline-flex items-center gap-1.5`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" aria-hidden />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" aria-hidden />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
