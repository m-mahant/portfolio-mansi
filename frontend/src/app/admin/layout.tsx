'use client';

// Protected Admin Layout Shell with Liquid Glass background and mobile drawer state.

import React, { useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/context/admin-auth-context';
import { useRequireAdmin } from '@/hooks/use-require-admin';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading, isForbidden, authError } = useRequireAdmin();
  const { logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Allow login page to render directly.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <Loading size="lg" label="Verifying Administrator Authorization..." />
      </div>
    );
  }

  if (isForbidden) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 glass-panel text-center shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto text-2xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text)] font-heading">403 — Access Forbidden</h2>
          <p className="text-xs text-[var(--color-muted)]">
            {authError || 'Your account is authenticated but does not possess active administrator permissions.'}
          </p>
          <Button variant="danger" size="md" onClick={logout} className="w-full">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex text-[var(--color-text)] font-sans">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={closeMobile} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMobileToggle={() => setMobileOpen((prev) => !prev)} />
        <main className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 overflow-x-hidden overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
