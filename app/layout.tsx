import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SnapBeautify - Beautiful Screenshots Instantly',
  description:
    'Transform plain screenshots into stunning visuals with beautiful backgrounds, shadows, and frames. Free online screenshot beautifier tool.',
  keywords: [
    'screenshot',
    'beautify',
    'mockup',
    'design',
    'social media',
    'image editor',
    'screenshot tool',
  ],
  authors: [{ name: 'SnapBeautify' }],
  openGraph: {
    title: 'SnapBeautify - Beautiful Screenshots Instantly',
    description:
      'Transform plain screenshots into stunning visuals with beautiful backgrounds, shadows, and frames.',
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
