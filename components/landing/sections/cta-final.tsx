'use client'

import Link from 'next/link'
import { Container } from '../layout/container'
import { Button } from '@/components/ui/button'
import { FadeIn } from '../animations/fade-in'
import { ArrowRight } from 'lucide-react'

export function CTAFinalSection() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden border-t border-zinc-200 dark:border-zinc-900">
      {/* Base Background */}
      <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-950" />

      {/* Simple Background - static, no animations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern - static */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#a1a1aa_1px,transparent_1px),linear-gradient(to_bottom,#a1a1aa_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#3f3f46_1px,transparent_1px),linear-gradient(to_bottom,#3f3f46_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] opacity-30" />

        {/* Static decorative circles - no animation */}
        <div className="absolute rounded-full border border-zinc-400/20 dark:border-zinc-500/20 w-32 h-32 sm:w-64 sm:h-64 lg:w-[300px] lg:h-[300px] -left-16 -top-16 sm:-left-[5%] sm:-top-[10%]" />
        <div className="absolute rounded-full border border-zinc-400/15 dark:border-zinc-500/15 w-24 h-24 sm:w-48 sm:h-48 lg:w-[250px] lg:h-[250px] -right-12 -top-8 sm:right-[5%] sm:top-0" />
        <div className="absolute rounded-full border border-zinc-400/15 dark:border-zinc-500/15 hidden sm:block sm:w-48 sm:h-48 lg:w-[280px] lg:h-[280px] sm:-right-[5%] sm:bottom-[10%]" />
      </div>

      <Container className="relative z-10 px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-zinc-600 dark:text-zinc-400 text-[10px] sm:text-xs font-medium mb-4 sm:mb-6">
              Start transforming your photos today
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4 sm:mb-6">
              Ready to Create Stunning Photos?
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-400 mb-6 sm:mb-8 max-w-xl mx-auto px-2 sm:px-0">
              Join thousands of creators who trust SnapBeautify for their image
              editing needs. Start free, upgrade when you&apos;re ready.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/app">
                <Button
                  size="lg"
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base shadow-lg w-full sm:w-auto"
                >
                  Start Enhancing Free
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="text-zinc-500 dark:text-zinc-600 text-xs sm:text-sm mt-4 sm:mt-6">
              No credit card required • Works on any device • Cancel anytime
            </p>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
