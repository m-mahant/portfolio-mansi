'use client';

import React, { useEffect, useRef } from 'react';
import { useThemeRuntime } from '@/context/theme-runtime';

const GISCUS_REPO = 'm-mahant/portfolio-mansi';
const GISCUS_REPO_ID = 'R_kgDOVQphjg';
const GISCUS_CATEGORY = 'Announcements';
const GISCUS_CATEGORY_ID = 'DIC_kwDOVQphjs4DJOok';

// Embeds GitHub-Discussions-backed comments on a blog post, synced to the site's active light/dark theme.
export function GiscusComments() {
  const { activeMode } = useThemeRuntime();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', GISCUS_REPO);
    script.setAttribute('data-repo-id', GISCUS_REPO_ID);
    script.setAttribute('data-category', GISCUS_CATEGORY);
    script.setAttribute('data-category-id', GISCUS_CATEGORY_ID);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', activeMode === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', 'en');

    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
    // Script is injected once; theme updates after mount go through postMessage below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const iframe = containerRef.current?.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (!iframe) return;
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: activeMode === 'dark' ? 'dark' : 'light' } } },
      'https://giscus.app'
    );
  }, [activeMode]);

  return <div ref={containerRef} className="mt-4" />;
}
