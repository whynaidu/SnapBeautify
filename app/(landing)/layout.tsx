import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export const metadata: Metadata = {
  title: 'SnapBeautify - Beautiful Screenshots in Seconds | Free Tool',
  description:
    'Transform screenshots into stunning visuals with backgrounds & device frames. Browser-based, 100% private.',
  keywords: [
    'screenshot beautifier',
    'image enhancement',
    'photo editor',
    'AI photo editor',
    'background removal',
    'screenshot editor online',
    'free photo editor',
    'browser based editor',
    'mockup generator',
    'device frame mockup',
  ],
  authors: [{ name: 'SnapBeautify' }],
  creator: 'SnapBeautify',
  publisher: 'SnapBeautify',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'SnapBeautify - Transform Your Screenshots Into Stunning Visuals',
    description:
      'Professional screenshot beautification in your browser. Add backgrounds, frames, and styling. 100% private.',
    type: 'website',
    url: 'https://snapbeautify.com',
    siteName: 'SnapBeautify',
    locale: 'en_US',
    images: [
      {
        url: 'https://snapbeautify.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SnapBeautify - Screenshot Beautification Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnapBeautify - Transform Your Screenshots Into Stunning Visuals',
    description:
      'Professional screenshot beautification in your browser. 100% private.',
    images: ['https://snapbeautify.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://snapbeautify.com',
  },
  category: 'technology',
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Landing page layout without AuthGate - public access
  return <>{children}</>
}
