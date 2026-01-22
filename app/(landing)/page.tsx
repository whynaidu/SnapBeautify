import dynamic from 'next/dynamic'
import Script from 'next/script'

// Direct imports for above-the-fold content (loads immediately)
import { Header } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/sections/hero'
import { TrustBar } from '@/components/landing/sections/trust-bar'

// Structured data for SEO (Organization + WebApplication + FAQ)
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://snapbeautify.com/#organization",
      "name": "SnapBeautify",
      "url": "https://snapbeautify.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://snapbeautify.com/logo.png"
      },
      "sameAs": []
    },
    {
      "@type": "WebApplication",
      "@id": "https://snapbeautify.com/#webapp",
      "name": "SnapBeautify",
      "description": "Transform screenshots into beautiful presentations with custom backgrounds, device frames, and professional styling — all in your browser, completely private.",
      "url": "https://snapbeautify.com",
      "applicationCategory": "DesignApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "10000"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is SnapBeautify free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! SnapBeautify offers a free tier with essential features. Premium features are available with our Pro subscription."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data private?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All image processing happens directly in your browser. Your images are never uploaded to our servers."
          }
        },
        {
          "@type": "Question",
          "name": "What browsers are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SnapBeautify works on all modern browsers including Chrome, Firefox, Safari, and Edge."
          }
        }
      ]
    }
  ]
}

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
    <>
      {/* Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Header />

      <main id="main-content" className="min-h-screen" role="main" tabIndex={-1}>
        {/* Above the fold - static imports for immediate render */}
        <HeroSection />
        <TrustBar />

        {/* Below the fold - dynamic imports for reduced initial bundle */}
        <section id="features" aria-label="Features">
          <FeaturesSection />
        </section>
        <section id="how-it-works" aria-label="How It Works">
          <HowItWorksSection />
        </section>
        <section id="pricing" aria-label="Pricing">
          <PricingSection />
        </section>
        <PrivacySection />
        <TestimonialsSection />
        <section id="faq" aria-label="Frequently Asked Questions">
          <FAQSection />
        </section>
        <CTAFinalSection />
      </main>

      <Footer />
    </>
  )
}
