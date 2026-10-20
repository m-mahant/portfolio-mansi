'use client';

// Hook enforcing authentication and admin authorization for protected routes.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/admin-auth-context';

export function useRequireAdmin() {
  const { user, idToken, isAuthorizedAdmin, isLoading, authError } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isLoading, router]);

  return {
    user,
    idToken,
    isAuthorizedAdmin,
    isLoading,
    isForbidden: !isLoading && Boolean(user) && !isAuthorizedAdmin,
    authError,
  };
}
