import React from 'react';
import Link from 'next/link';

interface PublicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
}

// Renders reusable public action buttons matching dynamic theme button styles.
export const PublicButton: React.FC<PublicButtonProps> = ({
  children,
  variant = 'glass',
  size = 'md',
  href,
  target,
  rel,
  className = '',
  ...rest
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4.5 py-2.5 text-sm';
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'solid':
        return 'bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold shadow-lg shadow-[var(--color-primary)]/20 active:scale-[0.98]';
      case 'outline':
        return 'bg-transparent border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text)] font-medium';
      default:
        return 'bg-[var(--color-surface)] hover:bg-[var(--color-surface)]/80 border border-[var(--color-border)] text-[var(--color-text)] font-medium backdrop-blur-md hover:border-[var(--color-primary)]/50 shadow-md';
    }
  };

  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)] disabled:opacity-50 disabled:pointer-events-none font-button ${getSizeClass()} ${getVariantClass()} ${className}`;

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={baseClasses} {...rest}>
      {children}
    </button>
  );
};
