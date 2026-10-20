import React from 'react';

interface PublicHeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

// Renders styled typography headings using the active theme font variables.
export const PublicHeading: React.FC<PublicHeadingProps> = ({
  children,
  level = 2,
  subtitle,
  className = '',
  align = 'left',
}) => {
  const getAlignmentClass = () => {
    switch (align) {
      case 'center':
        return 'text-center items-center';
      case 'right':
        return 'text-right items-end';
      default:
        return 'text-left items-start';
    }
  };

  const Component = `h${level}` as React.ElementType;

  const getSizeClass = () => {
    switch (level) {
      case 1:
        return 'text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight';
      case 2:
        return 'text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight';
      case 3:
        return 'text-xl sm:text-2xl font-semibold';
      case 4:
        return 'text-lg font-medium';
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${getAlignmentClass()} ${className}`}>
      <Component
        className={`text-[var(--color-text)] ${getSizeClass()}`}
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        {children}
      </Component>
      {subtitle && <p className="text-sm sm:text-base text-[var(--color-muted)] max-w-2xl">{subtitle}</p>}
    </div>
  );
};
