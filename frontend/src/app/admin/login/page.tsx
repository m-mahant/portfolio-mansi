'use client';

// Admin CMS Login Page.

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/admin-auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BRAND_NAME } from '@/lib/brand';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login, isAuthorizedAdmin, user, isLoading, authError } = useAdminAuth();
  const router = useRouter();

  // Redirect to dashboard if user is already an authenticated admin.
  useEffect(() => {
    if (!isLoading && user && isAuthorizedAdmin) {
      router.push('/admin');
    }
  }, [isLoading, user, isAuthorizedAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await login(email, password);
      router.push('/admin');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please verify your credentials.';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)] text-[var(--color-text)] relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <Card variant="glass" className="border-[var(--color-border)] shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center p-6 pb-2 border-none">
            <div className="mx-auto w-12 h-12 mb-4 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/25">
              L
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-[var(--color-text)] font-heading">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-[var(--color-text-muted)] text-sm mt-1">
              {BRAND_NAME} Content Management
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-4">
            {(errorMsg || authError) && (
              <Alert
                type="error"
                message={errorMsg || authError || 'Authentication failed.'}
                className="mb-5"
                onClose={() => setErrorMsg(null)}
              />
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Administrator Email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/20"
                isLoading={isSubmitting || isLoading}
              >
                Sign In to CMS
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
          Protected System — Authorized Access Only
        </p>
      </div>
    </div>
  );
}
