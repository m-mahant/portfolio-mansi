'use client';

// Hook enforcing authentication and admin authorization for protected routes.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/admin-auth-context';

export function useRequireAdmin() {
  const { user, idToken, isAuthorizedAdmin, isLoading, authError } = useAdminAuth();
  const router = useRouter();

  const isRedirectingToLogin = !isLoading && !user;

  useEffect(() => {
    if (isRedirectingToLogin) {
      router.push('/admin/login');
    }
  }, [isRedirectingToLogin, router]);

  return {
    user,
    idToken,
    isAuthorizedAdmin,
    // Treat "about to redirect" as still loading so callers never render protected
    // content for an unauthenticated user in the gap before router.push() takes effect.
    isLoading: isLoading || isRedirectingToLogin,
    isForbidden: !isLoading && Boolean(user) && !isAuthorizedAdmin,
    authError,
  };
}
