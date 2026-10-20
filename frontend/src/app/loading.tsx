import React from 'react';
import { PublicLoading } from '@/components/public/public-loading';

// Renders the global App Router loading boundary state.
export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-text)]">
      <PublicLoading message="Initializing gallery environment..." />
    </div>
  );
}
