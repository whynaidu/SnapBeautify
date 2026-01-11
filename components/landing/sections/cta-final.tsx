'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Container } from '../layout/container'
import { Button } from '@/components/ui/button'
import { FadeIn } from '../animations/fade-in'
import { ArrowRight } from 'lucide-react'

// Large animated circles with thick borders - Desktop
const floatingCircles = [
  { size: 500, x: '-5%', y: '-10%', duration: 20, borderWidth: 2 },
  { size: 400, x: '70%', y: '-5%', duration: 18, borderWidth: 2 },
  { size: 350, x: '80%', y: '50%', duration: 22, borderWidth: 1.5 },
  { size: 450, x: '-10%', y: '60%', duration: 25, borderWidth: 2 },
]

// Smaller circles for mobile
const mobileFloatingCircles = [
  { size: 200, x: '-10%', y: '10%', duration: 15, borderWidth: 1.5 },
  { size: 150, x: '80%', y: '5%', duration: 18, borderWidth: 1 },
  { size: 180, x: '85%', y: '60%', duration: 20, borderWidth: 1.5 },
]

// Visible animated dots - Desktop
const animatedDots = [
  { size: 12, x: '15%', y: '20%', duration: 3 },
  { size: 10, x: '30%', y: '15%', duration: 4 },
  { size: 14, x: '85%', y: '25%', duration: 3.5 },
  { size: 11, x: '75%', y: '70%', duration: 4.5 },
  { size: 13, x: '20%', y: '75%', duration: 3.8 },
  { size: 9, x: '60%', y: '20%', duration: 4.2 },
  { size: 12, x: '45%', y: '80%', duration: 3.2 },
  { size: 10, x: '90%', y: '50%', duration: 4 },
  { size: 11, x: '10%', y: '45%', duration: 3.6 },
  { size: 14, x: '50%', y: '10%', duration: 4.8 },
  { size: 8, x: '65%', y: '85%', duration: 3.4 },
  { size: 12, x: '35%', y: '55%', duration: 4.1 },
]

// Fewer dots for mobile
const mobileAnimatedDots = [
  { size: 8, x: '10%', y: '15%', duration: 3 },
  { size: 10, x: '90%', y: '20%', duration: 4 },
  { size: 9, x: '85%', y: '75%', duration: 3.5 },
  { size: 8, x: '15%', y: '80%', duration: 4.5 },
  { size: 10, x: '50%', y: '10%', duration: 3.8 },
]

// Pulsing rings - ripple effect - Desktop
const pulsingRings = [
  { size: 300, x: '15%', y: '20%', duration: 3, delay: 0 },
  { size: 250, x: '80%', y: '30%', duration: 3.5, delay: 0.5 },
  { size: 280, x: '75%', y: '65%', duration: 3.2, delay: 1 },
  { size: 220, x: '20%', y: '70%', duration: 4, delay: 1.5 },
  { size: 200, x: '50%', y: '50%', duration: 3.8, delay: 0.8 },
]

// Smaller pulsing rings for mobile
const mobilePulsingRings = [
  { size: 120, x: '10%', y: '20%', duration: 3, delay: 0 },
  { size: 100, x: '80%', y: '70%', duration: 3.5, delay: 0.5 },
]

// Floating crosses/plus signs - Desktop
const floatingCrosses = [
  { size: 30, x: '25%', y: '30%', duration: 6, rotation: 45 },
  { size: 24, x: '70%', y: '20%', duration: 7, rotation: 0 },
  { size: 28, x: '80%', y: '75%', duration: 5.5, rotation: 15 },
  { size: 22, x: '15%', y: '65%', duration: 6.5, rotation: -15 },
  { size: 26, x: '55%', y: '85%', duration: 5, rotation: 30 },
]

// Smaller crosses for mobile
const mobileFloatingCrosses = [
  { size: 18, x: '15%', y: '25%', duration: 6, rotation: 45 },
  { size: 16, x: '85%', y: '70%', duration: 7, rotation: 0 },
]

function FloatingCircle({ size, x, y, duration, borderWidth }: typeof floatingCircles[0]) {
  return (
    <motion.div
      className="absolute rounded-full border-zinc-400 dark:border-zinc-500"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        borderWidth: borderWidth,
        borderStyle: 'solid',
      }}
      animate={{
        x: [0, 30, -20, 15, 0],
        y: [0, -20, 25, -15, 0],
        rotate: [0, 8, -8, 5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

function AnimatedDot({ size, x, y, duration }: typeof animatedDots[0]) {
  return (
    <motion.div
      className="absolute rounded-full bg-zinc-500 dark:bg-zinc-400"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
      }}
      animate={{
        y: [0, -25, 0],
        scale: [1, 1.5, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

function PulsingRing({ size, x, y, duration, delay }: typeof pulsingRings[0]) {
  return (
    <motion.div
      className="absolute rounded-full border-2 border-zinc-500 dark:border-zinc-400"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
      }}
      animate={{
        scale: [0.8, 2, 0.8],
        opacity: [0.8, 0, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  )
}

function FloatingCross({ size, x, y, duration, rotation }: typeof floatingCrosses[0]) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: x,
        top: y,
        rotate: rotation,
      }}
      animate={{
        y: [0, -15, 0],
        rotate: [rotation, rotation + 90, rotation],
        opacity: [0.5, 0.9, 0.5],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Horizontal line */}
      <div
        className="absolute bg-zinc-500 dark:bg-zinc-400 rounded-full"
        style={{
          width: size,
          height: 3,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* Vertical line */}
      <div
        className="absolute bg-zinc-500 dark:bg-zinc-400 rounded-full"
        style={{
          width: 3,
          height: size,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </motion.div>
  )
}

export function CTAFinalSection() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden border-t border-zinc-200 dark:border-zinc-900">
      {/* Base Background */}
      <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-950" />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern - more visible */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#a1a1aa_1px,transparent_1px),linear-gradient(to_bottom,#a1a1aa_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#3f3f46_1px,transparent_1px),linear-gradient(to_bottom,#3f3f46_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] opacity-60" />

        {/* Floating circles - Mobile version */}
        <div className="sm:hidden">
          {mobileFloatingCircles.map((circle, index) => (
            <FloatingCircle key={`mobile-circle-${index}`} {...circle} />
          ))}
        </div>

        {/* Floating circles - Desktop version */}
        <div className="hidden sm:block">
          {floatingCircles.map((circle, index) => (
            <FloatingCircle key={`circle-${index}`} {...circle} />
          ))}
        </div>

        {/* Animated dots - Mobile version */}
        <div className="md:hidden">
          {mobileAnimatedDots.map((dot, index) => (
            <AnimatedDot key={`mobile-dot-${index}`} {...dot} />
          ))}
        </div>

        {/* Animated dots - Desktop version */}
        <div className="hidden md:block">
          {animatedDots.map((dot, index) => (
            <AnimatedDot key={`dot-${index}`} {...dot} />
          ))}
        </div>

        {/* Pulsing rings - Mobile version */}
        <div className="lg:hidden">
          {mobilePulsingRings.map((ring, index) => (
            <PulsingRing key={`mobile-ring-${index}`} {...ring} />
          ))}
        </div>

        {/* Pulsing rings - Desktop version */}
        <div className="hidden lg:block">
          {pulsingRings.map((ring, index) => (
            <PulsingRing key={`ring-${index}`} {...ring} />
          ))}
        </div>

        {/* Floating crosses - Mobile version */}
        <div className="md:hidden">
          {mobileFloatingCrosses.map((cross, index) => (
            <FloatingCross key={`mobile-cross-${index}`} {...cross} />
          ))}
        </div>

        {/* Floating crosses - Desktop version */}
        <div className="hidden md:block">
          {floatingCrosses.map((cross, index) => (
            <FloatingCross key={`cross-${index}`} {...cross} />
          ))}
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
