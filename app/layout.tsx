import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/context';
import { SubscriptionProvider } from '@/lib/subscription/context';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';
import { GlobalAuthModal } from '@/components/auth/GlobalAuthModal';
import { AuthGate } from '@/components/auth/AuthGate';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Lato:wght@100;300;400;700;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Nunito:wght@200;300;400;500;600;700;800;900&family=Ubuntu:wght@300;400;500;700&family=Work+Sans:wght@100;200;300;400;500;600;700;800;900&family=Rubik:wght@300;400;500;600;700;800;900&family=Quicksand:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700;900&family=Lora:wght@400;500;600;700&family=PT+Serif:wght@400;700&family=Crimson+Text:wght@400;600;700&family=EB+Garamond:wght@400;500;600;700;800&family=Libre+Baskerville:wght@400;700&family=Cormorant:wght@300;400;500;600;700&family=Cinzel:wght@400;500;600;700;800;900&family=Spectral:wght@200;300;400;500;600;700;800&family=Bebas+Neue&family=Righteous&family=Anton&family=Archivo+Black&family=Oswald:wght@200;300;400;500;600;700&family=Fredoka:wght@300;400;500;600;700&family=Titan+One&family=Bungee&family=Black+Ops+One&family=Alfa+Slab+One&family=Staatliches&family=Press+Start+2P&family=Londrina+Solid:wght@100;300;400;900&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Satisfy&family=Great+Vibes&family=Caveat:wght@400;500;600;700&family=Shadows+Into+Light&family=Kalam:wght@300;400;700&family=Permanent+Marker&family=Cookie&family=Sacramento&family=Roboto+Mono:wght@100;200;300;400;500;600;700&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&family=Fira+Code:wght@300;400;500;600;700&family=Source+Code+Pro:wght@200;300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&family=IBM+Plex+Mono:wght@100;200;300;400;500;600;700&family=Courier+Prime:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <SubscriptionProvider>
                <AuthGate>
                  {children}
                </AuthGate>
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
