import React from 'react';

interface PublicContainerProps {
  children: React.ReactNode;
  className?: string;
}

// Enforces standardized horizontal padding and max-width container bounds across viewport sizes.
export const PublicContainer: React.FC<PublicContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};
