import React from 'react';

interface PublicLoadingProps {
  message?: string;
  className?: string;
}

// Renders an accessible skeleton loading indicator for public content sections.
export const PublicLoading: React.FC<PublicLoadingProps> = ({
  message = 'Loading gallery content...',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center text-[var(--color-muted)] gap-4 min-h-[250px] ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)]/20" />
        <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
      </div>
      <p className="text-xs font-mono tracking-wide text-[var(--color-muted)]">{message}</p>
    </div>
  );
};
