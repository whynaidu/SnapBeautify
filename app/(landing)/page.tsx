import dynamic from 'next/dynamic'

// Direct imports for above-the-fold content (loads immediately)
import { Header } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/sections/hero'
import { TrustBar } from '@/components/landing/sections/trust-bar'

// Dynamic imports for below-the-fold sections (bundle-dynamic-imports optimization)
// These sections load lazily, reducing initial bundle size by ~50KB (framer-motion)
const FeaturesSection = dynamic(
  () => import('@/components/landing/sections/features').then(mod => ({ default: mod.FeaturesSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true
  }
)

const HowItWorksSection = dynamic(
  () => import('@/components/landing/sections/how-it-works').then(mod => ({ default: mod.HowItWorksSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true
  }
)

const PricingSection = dynamic(
  () => import('@/components/landing/sections/pricing').then(mod => ({ default: mod.PricingSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true
  }
)

const PrivacySection = dynamic(
  () => import('@/components/landing/sections/privacy').then(mod => ({ default: mod.PrivacySection })),
  {
    loading: () => <SectionSkeleton height="h-64" />,
    ssr: true
  }
)

const TestimonialsSection = dynamic(
  () => import('@/components/landing/sections/testimonials').then(mod => ({ default: mod.TestimonialsSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true
  }
)

const FAQSection = dynamic(
  () => import('@/components/landing/sections/faq').then(mod => ({ default: mod.FAQSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true
  }
)

const CTAFinalSection = dynamic(
  () => import('@/components/landing/sections/cta-final').then(mod => ({ default: mod.CTAFinalSection })),
  {
    loading: () => <SectionSkeleton height="h-48" />,
    ssr: true
  }
)

const Footer = dynamic(
  () => import('@/components/landing/footer').then(mod => ({ default: mod.Footer })),
  { ssr: true }
)

// Minimal loading skeleton for sections
function SectionSkeleton({ height = 'h-96' }: { height?: string }) {
  return (
    <div className={`${height} w-full flex items-center justify-center`}>
      <div className="w-8 h-8 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-600 dark:border-t-zinc-400 rounded-full animate-spin" />
    </div>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Above the fold - static imports for immediate render */}
      <Header />
      <HeroSection />
      <TrustBar />

      {/* Below the fold - dynamic imports for reduced initial bundle */}
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <PrivacySection />
      <TestimonialsSection />
      <FAQSection />
      <CTAFinalSection />
      <Footer />
    </main>
  )
}
