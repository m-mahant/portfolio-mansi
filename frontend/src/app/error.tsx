'use client';

// Renders the global App Router error boundary handling unexpected runtime or network failures.

import React, { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { PublicError } from '@/components/public/public-error';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-slate-100">
      <PublicError
        title="Application Error"
        message="An unexpected error occurred while processing your request. Please click below to reload."
        onRetry={reset}
      />
    </div>
  );
}
