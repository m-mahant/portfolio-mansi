import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { ThemeRuntimeProvider } from '@/context/theme-runtime';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand';
import { CookieConsent } from '@/components/public/cookie-consent';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: BRAND_NAME,
  description: BRAND_TAGLINE,
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var pref = localStorage.getItem('portfolio-theme-preference');
                var isDark = pref === 'dark' || (!pref && window.matchMedia('(prefers-color-scheme: dark)').matches);
                var root = document.documentElement;
                if (isDark) {
                  root.classList.add('dark');
                  root.classList.remove('light');
                  root.setAttribute('data-theme', 'dark');
                } else {
                  root.classList.add('light');
                  root.classList.remove('dark');
                  root.setAttribute('data-theme', 'light');
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-background,#0f172a)] text-[var(--color-text,#f8fafc)] font-sans transition-colors duration-300 overflow-x-clip">
        <ThemeRuntimeProvider>{children}</ThemeRuntimeProvider>
        <Analytics />
        <SpeedInsights />
        <CookieConsent gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
