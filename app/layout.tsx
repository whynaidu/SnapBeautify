import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/context';
import { SubscriptionProvider } from '@/lib/subscription/context';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';
import { GlobalAuthModal } from '@/components/auth/GlobalAuthModal';

// Optimize font loading with next/font (bundle-defer-third-party)
// Only load Inter for UI - editor fonts loaded lazily via FontLoader
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SnapBeautify - Transform Your Photos Instantly',
  description:
    'Professional-quality image enhancement that works entirely in your browser. AI-powered background removal, smart enhancement, and more.',
  keywords: [
    'screenshot',
    'beautify',
    'mockup',
    'design',
    'social media',
    'image editor',
    'screenshot tool',
    'photo enhancement',
    'AI photo editor',
  ],
  authors: [{ name: 'SnapBeautify' }],
  openGraph: {
    title: 'SnapBeautify - Transform Your Photos Instantly',
    description:
      'Professional-quality image enhancement that works entirely in your browser.',
    type: 'website',
  },
};

import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Preconnect for editor fonts loaded lazily via FontLoader */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          REMOVED: Massive 50+ font families Google Fonts link (~200KB blocking)
          Editor fonts are now lazy loaded via FontLoader component
          This reduces initial bundle size significantly
        */}
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange
          >
            <AuthProvider>
              <SubscriptionProvider>
                {children}
                <UpgradeModal />
                <GlobalAuthModal />
              </SubscriptionProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
