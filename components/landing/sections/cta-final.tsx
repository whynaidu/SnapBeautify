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

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#a1a1aa_1px,transparent_1px),linear-gradient(to_bottom,#a1a1aa_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#3f3f46_1px,transparent_1px),linear-gradient(to_bottom,#3f3f46_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] opacity-60" />

        {/* Floating circles - Mobile: smaller, Desktop: larger */}
        {/* Top left circle */}
        <div
          className="absolute rounded-full border border-zinc-400/40 dark:border-zinc-500/40 w-32 h-32 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] -left-8 -top-8 sm:-left-[5%] sm:-top-[10%]"
          style={{
            animation: 'cta-float-slow 8s ease-in-out infinite',
            willChange: 'transform'
          }}
        />
        {/* Top right circle */}
        <div
          className="absolute rounded-full border border-zinc-400/30 dark:border-zinc-500/30 w-24 h-24 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-[300px] lg:h-[300px] -right-6 -top-4 sm:right-[5%] sm:top-0"
          style={{
            animation: 'cta-float-medium 6s ease-in-out infinite',
            willChange: 'transform'
          }}
        />
        {/* Bottom right circle - hidden on mobile */}
        <div
          className="absolute rounded-full border border-zinc-400/30 dark:border-zinc-500/30 hidden sm:block sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-[350px] lg:h-[350px] sm:-right-[5%] sm:bottom-[10%]"
          style={{
            animation: 'cta-float-slow-reverse 9s ease-in-out infinite',
            willChange: 'transform'
          }}
        />
        {/* Bottom left circle - hidden on mobile/tablet */}
        <div
          className="absolute rounded-full border border-zinc-400/40 dark:border-zinc-500/40 hidden lg:block lg:w-[280px] lg:h-[280px] lg:-left-[8%] lg:bottom-[20%]"
          style={{
            animation: 'cta-float-medium-reverse 7s ease-in-out infinite',
            willChange: 'transform'
          }}
        />

        {/* Animated dots */}
        <div
          className="absolute w-3 h-3 rounded-full bg-zinc-500/60 dark:bg-zinc-400/60"
          style={{ left: '15%', top: '20%', animation: 'cta-pulse-float 3s ease-in-out infinite', willChange: 'transform, opacity' }}
        />
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-zinc-500/50 dark:bg-zinc-400/50"
          style={{ left: '85%', top: '25%', animation: 'cta-pulse-float 3.5s ease-in-out infinite 0.5s', willChange: 'transform, opacity' }}
        />
        <div
          className="absolute w-3.5 h-3.5 rounded-full bg-zinc-500/60 dark:bg-zinc-400/60 hidden sm:block"
          style={{ left: '75%', top: '70%', animation: 'cta-pulse-float 3s ease-in-out infinite', willChange: 'transform, opacity' }}
        />
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-zinc-500/50 dark:bg-zinc-400/50 hidden sm:block"
          style={{ left: '20%', top: '75%', animation: 'cta-pulse-float 3.5s ease-in-out infinite 0.5s', willChange: 'transform, opacity' }}
        />
        <div
          className="absolute w-3 h-3 rounded-full bg-zinc-500/60 dark:bg-zinc-400/60 hidden md:block"
          style={{ left: '50%', top: '10%', animation: 'cta-pulse-float 3s ease-in-out infinite', willChange: 'transform, opacity' }}
        />
        <div
          className="absolute w-2 h-2 rounded-full bg-zinc-500/40 dark:bg-zinc-400/40 hidden md:block"
          style={{ left: '60%', top: '85%', animation: 'cta-pulse-float 3.5s ease-in-out infinite 0.5s', willChange: 'transform, opacity' }}
        />
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-zinc-500/50 dark:bg-zinc-400/50 hidden lg:block"
          style={{ left: '35%', top: '55%', animation: 'cta-pulse-float 3s ease-in-out infinite', willChange: 'transform, opacity' }}
        />
        <div
          className="absolute w-3 h-3 rounded-full bg-zinc-500/60 dark:bg-zinc-400/60 hidden lg:block"
          style={{ left: '90%', top: '50%', animation: 'cta-pulse-float 3.5s ease-in-out infinite 0.5s', willChange: 'transform, opacity' }}
        />

        {/* Pulsing rings */}
        <div
          className="absolute rounded-full border-2 border-zinc-500/30 dark:border-zinc-400/30"
          style={{
            width: 200,
            height: 200,
            left: '15%',
            top: '20%',
            animation: 'cta-ring-pulse 4s ease-out infinite',
            willChange: 'transform, opacity'
          }}
        />
        <div
          className="absolute rounded-full border-2 border-zinc-500/30 dark:border-zinc-400/30 hidden sm:block"
          style={{
            width: 180,
            height: 180,
            right: '10%',
            top: '30%',
            animation: 'cta-ring-pulse 4s ease-out infinite 1s',
            willChange: 'transform, opacity'
          }}
        />
        <div
          className="absolute rounded-full border border-zinc-500/20 dark:border-zinc-400/20 hidden lg:block"
          style={{
            width: 150,
            height: 150,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'cta-ring-pulse 4s ease-out infinite 0.5s',
            willChange: 'transform, opacity'
          }}
        />

        {/* Plus signs */}
        <div
          className="absolute"
          style={{ left: '25%', top: '30%', animation: 'cta-cross-float 5s ease-in-out infinite', willChange: 'transform, opacity' }}
        >
          <div className="w-6 h-0.5 bg-zinc-500/50 dark:bg-zinc-400/50 rounded-full" />
          <div className="w-0.5 h-6 bg-zinc-500/50 dark:bg-zinc-400/50 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div
          className="absolute hidden sm:block"
          style={{ left: '70%', top: '20%', animation: 'cta-cross-float 6s ease-in-out infinite 0.8s', willChange: 'transform, opacity' }}
        >
          <div className="w-5 h-0.5 bg-zinc-500/40 dark:bg-zinc-400/40 rounded-full" />
          <div className="w-0.5 h-5 bg-zinc-500/40 dark:bg-zinc-400/40 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div
          className="absolute hidden md:block"
          style={{ right: '15%', bottom: '25%', animation: 'cta-cross-float 5s ease-in-out infinite', willChange: 'transform, opacity' }}
        >
          <div className="w-7 h-0.5 bg-zinc-500/50 dark:bg-zinc-400/50 rounded-full" />
          <div className="w-0.5 h-7 bg-zinc-500/50 dark:bg-zinc-400/50 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div
          className="absolute hidden lg:block"
          style={{ left: '15%', bottom: '30%', animation: 'cta-cross-float 6s ease-in-out infinite 0.8s', willChange: 'transform, opacity' }}
        >
          <div className="w-5 h-0.5 bg-zinc-500/40 dark:bg-zinc-400/40 rounded-full" />
          <div className="w-0.5 h-5 bg-zinc-500/40 dark:bg-zinc-400/40 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
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
