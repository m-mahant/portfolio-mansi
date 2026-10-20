import React from 'react';
import { PublicContainer } from './public-container';

interface PublicSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  surface?: 'transparent' | 'card' | 'dark';
}

// Wraps major public content sections with responsive vertical padding and theme surface styling.
export const PublicSection: React.FC<PublicSectionProps> = ({
  children,
  id,
  className = '',
  containerClassName = '',
  surface = 'transparent',
}) => {
  const getSurfaceClass = () => {
    switch (surface) {
      case 'card':
        return 'bg-[var(--color-surface)]/60 border-y border-[var(--color-border)] backdrop-blur-sm';
      case 'dark':
        return 'bg-[var(--color-background)] border-y border-[var(--color-border)]';
      default:
        return 'bg-transparent';
    }
  };

  return (
    <section id={id} className={`py-12 sm:py-16 lg:py-20 ${getSurfaceClass()} ${className}`}>
      <PublicContainer className={containerClassName}>{children}</PublicContainer>
    </section>
  );
};
