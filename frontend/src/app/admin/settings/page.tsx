'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Alias route redirecting /admin/settings to /admin/site.
export default function AdminSettingsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/site');
  }, [router]);

  return null;
}
