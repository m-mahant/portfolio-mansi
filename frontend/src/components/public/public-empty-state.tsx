import React from 'react';

interface PublicEmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

// Renders an accessible empty state UI when the API returns no published items.
export const PublicEmptyState: React.FC<PublicEmptyStateProps> = ({
  title = 'No Published Content Available',
  description = 'There are currently no items published in this gallery section.',
  icon,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 rounded-xl bg-[var(--color-surface)]/40 border border-[var(--color-border)] text-center gap-3 max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] text-xl">
        {icon || '📁'}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
        <p className="text-xs text-[var(--color-muted)] leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
