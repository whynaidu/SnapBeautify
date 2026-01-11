import {
  Header,
  Footer,
  HeroSection,
  TrustBar,
  FeaturesSection,
  HowItWorksSection,
  PricingSection,
  PrivacySection,
  TestimonialsSection,
  FAQSection,
  CTAFinalSection,
} from '@/components/landing'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <TrustBar />
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
