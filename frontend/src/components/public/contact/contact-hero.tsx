import React from 'react';
import { ContactPageConfig } from '@/types/public.types';

interface ContactHeroProps {
  contactConfig?: ContactPageConfig | null;
}

// Contact page header with a hoverable availability indicator beside the title.
export const ContactHero: React.FC<ContactHeroProps> = ({ contactConfig }) => {
  const availability =
    contactConfig?.availabilityStatus ||
    'Available for engineering projects & commissions';

  const title = contactConfig?.heading || "Let's Build & Create Together";
  const subtitle =
    contactConfig?.subtitle ||
    'Have a project in mind, a potential collaboration, or a technical inquiry? Send a message and I will get back to you promptly.';

  return (
    <header className="relative max-w-3xl space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.1]"
          style={{ fontFamily: 'var(--font-heading, inherit)' }}
        >
          {title}
        </h1>

        <span className="relative inline-flex shrink-0 group">
          <button
            type="button"
            className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80"
            aria-label={availability}
            aria-describedby="contact-availability-tooltip"
          >
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </button>
          <span
            id="contact-availability-tooltip"
            role="tooltip"
            className="pointer-events-none absolute left-0 top-full z-20 mt-3 w-max max-w-[min(20rem,calc(100vw-3rem))] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs leading-relaxed text-[var(--color-text)] opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:left-1/2 sm:-translate-x-1/2"
          >
            {availability}
          </span>
        </span>
      </div>

      <p className="text-[var(--color-muted)] text-base sm:text-lg leading-relaxed">{subtitle}</p>
    </header>
  );
};
