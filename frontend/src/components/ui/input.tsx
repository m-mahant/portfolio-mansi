// Form Input component supporting label, helper text, and error states.

import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3.5 py-2 text-sm rounded-lg border transition-colors focus:outline-none focus:ring-2 bg-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-muted)] ${
            error
              ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500'
              : 'border-[var(--color-border)] focus:ring-indigo-500/20 focus:border-indigo-500'
          } ${className}`}
          {...props}
        />
        {error ? (
          <span className="text-xs text-rose-500 font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-[var(--color-muted)]">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
