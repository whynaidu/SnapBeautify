import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SnapBeautify - Transform Your Photos Instantly | AI-Powered Image Enhancement',
  description:
    'Professional-quality image enhancement that works entirely in your browser. No uploads, no learning curve, no compromises. AI-powered background removal, smart enhancement, and more.',
  keywords: [
    'image enhancement',
    'photo editor',
    'AI photo',
    'background removal',
    'screenshot beautifier',
    'image editor online',
    'free photo editor',
    'browser based editor',
  ],
  authors: [{ name: 'SnapBeautify' }],
  openGraph: {
    title: 'SnapBeautify - Transform Your Photos Instantly',
    description:
      'Professional-quality image enhancement that works entirely in your browser. AI-powered tools for stunning results.',
    type: 'website',
    url: 'https://snapbeautify.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnapBeautify - Transform Your Photos Instantly',
    description:
      'Professional-quality image enhancement that works entirely in your browser.',
  },
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Landing page layout without AuthGate - public access
  return <>{children}</>
}
