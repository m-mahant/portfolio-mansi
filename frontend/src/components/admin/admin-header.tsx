'use client';

// Admin header with mobile nav toggle, theme switcher, signed-in user, and sign out.

import React from 'react';
import { useAdminAuth } from '@/context/admin-auth-context';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

interface AdminHeaderProps {
  onMobileToggle?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMobileToggle }) => {
  const { user, logout, isAuthorizedAdmin } = useAdminAuth();

  return (
    <header className="h-14 sm:h-16 glass-header px-3 sm:px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onMobileToggle}
          className="md:hidden p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] glass-button shrink-0"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
        <ThemeSwitcher />

        {user && (
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <div className="hidden md:block text-right">
              <p className="font-semibold text-[var(--color-text)] truncate max-w-[10rem]">{user.email}</p>
              <p className="text-[10px] text-[var(--color-muted)] font-mono">
                {isAuthorizedAdmin ? 'Active Administrator' : 'Unauthorized Access'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 flex items-center justify-center font-bold text-[var(--color-primary)] shrink-0">
              {user.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        )}

        <Button variant="outline" size="sm" onClick={logout} className="text-[11px] py-1 px-2.5 glass-button hidden sm:inline-flex">
          Sign Out
        </Button>
        <Button variant="outline" size="sm" onClick={logout} className="text-[11px] py-1 px-2 glass-button sm:hidden" aria-label="Sign Out">
          Out
        </Button>
      </div>
    </header>
  );
};
