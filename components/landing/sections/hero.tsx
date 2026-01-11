'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '../shared/badge'
import { Button } from '@/components/ui/button'
import { Container } from '../layout/container'
import { FadeIn } from '../animations/fade-in'
import {
  Sparkles,
  ArrowRight,
  Play,
  Zap,
  Wand2,
  Download,
  Check,
  Star,
  Users,
  ImageIcon
} from 'lucide-react'

// Pre-defined particle positions to avoid Math.random during render
const particles = [
  { left: 5, top: 15, xOffset: 8, duration: 3.2, delay: 0.1 },
  { left: 12, top: 45, xOffset: -5, duration: 4.1, delay: 0.8 },
  { left: 20, top: 70, xOffset: 10, duration: 3.5, delay: 1.5 },
  { left: 28, top: 25, xOffset: -8, duration: 4.5, delay: 0.3 },
  { left: 35, top: 55, xOffset: 6, duration: 3.8, delay: 2.1 },
  { left: 45, top: 85, xOffset: -3, duration: 4.2, delay: 0.6 },
  { left: 52, top: 35, xOffset: 9, duration: 3.3, delay: 1.2 },
  { left: 60, top: 65, xOffset: -7, duration: 4.8, delay: 1.8 },
  { left: 68, top: 20, xOffset: 4, duration: 3.6, delay: 2.5 },
  { left: 75, top: 50, xOffset: -6, duration: 4.3, delay: 0.4 },
  { left: 82, top: 80, xOffset: 7, duration: 3.9, delay: 1.0 },
  { left: 90, top: 40, xOffset: -4, duration: 4.6, delay: 2.2 },
  { left: 95, top: 60, xOffset: 5, duration: 3.4, delay: 0.7 },
  { left: 8, top: 90, xOffset: -9, duration: 4.0, delay: 1.6 },
  { left: 42, top: 10, xOffset: 3, duration: 3.7, delay: 2.8 },
]

// Animated background component
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-x-clip">
      <div className="absolute inset-0 bg-white dark:bg-black" />

      {/* Grid pattern - light mode */}
      <div
        className="absolute inset-0 opacity-[0.15] dark:hidden"
        style={{
          backgroundImage: `linear-gradient(to right, #52525b 1px, transparent 1px), linear-gradient(to bottom, #52525b 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 70%, transparent 100%)',
        }}
      />
      {/* Grid pattern - dark mode */}
      <div
        className="absolute inset-0 opacity-[0.15] hidden dark:block"
        style={{
          backgroundImage: `linear-gradient(to right, #d4d4d8 1px, transparent 1px), linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 70%, transparent 100%)',
        }}
      />

      {/* Large gradient orbs - more visible */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-500/20 dark:bg-violet-400/15 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-pink-500/20 dark:bg-pink-400/15 blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Rotating rings - more visible */}
      <motion.div
        className="absolute top-16 left-16 w-72 h-72 rounded-full border-2 border-zinc-300 dark:border-zinc-600"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-16 left-16 w-64 h-64 rounded-full border border-zinc-200 dark:border-zinc-700"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-16 right-16 w-80 h-80 rounded-full border-2 border-zinc-300 dark:border-zinc-600"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-16 right-16 w-72 h-72 rounded-full border border-zinc-200 dark:border-zinc-700"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating particles - more visible */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Larger floating dots - more visible */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.div
          key={`large-${i}`}
          className="absolute w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600"
          style={{
            left: `${8 + i * 12}%`,
            top: `${15 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 3.5 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Animated horizontal lines - light mode - more visible */}
      <motion.div
        className="absolute top-[25%] left-0 w-full h-[2px] dark:hidden"
        style={{ background: 'linear-gradient(90deg, transparent, #a1a1aa, transparent)' }}
        animate={{ opacity: [0, 0.8, 0], scaleX: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[65%] left-0 w-full h-[2px] dark:hidden"
        style={{ background: 'linear-gradient(90deg, transparent, #a1a1aa, transparent)' }}
        animate={{ opacity: [0, 0.8, 0], scaleX: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5, ease: 'easeInOut' }}
      />
      {/* Animated horizontal lines - dark mode - more visible */}
      <motion.div
        className="absolute top-[25%] left-0 w-full h-[2px] hidden dark:block"
        style={{ background: 'linear-gradient(90deg, transparent, #71717a, transparent)' }}
        animate={{ opacity: [0, 0.8, 0], scaleX: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[65%] left-0 w-full h-[2px] hidden dark:block"
        style={{ background: 'linear-gradient(90deg, transparent, #71717a, transparent)' }}
        animate={{ opacity: [0, 0.8, 0], scaleX: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5, ease: 'easeInOut' }}
      />

      {/* Vertical light beams - light mode - more visible */}
      <motion.div
        className="absolute top-0 w-1 h-full dark:hidden"
        style={{ background: 'linear-gradient(180deg, transparent, #a1a1aa, transparent)', left: '10%' }}
        animate={{ opacity: [0, 0.7, 0], y: [-200, 200, -200] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-0 w-1 h-full dark:hidden"
        style={{ background: 'linear-gradient(180deg, transparent, #a1a1aa, transparent)', right: '10%' }}
        animate={{ opacity: [0, 0.7, 0], y: [200, -200, 200] }}
        transition={{ duration: 5, repeat: Infinity, delay: 2.5, ease: 'easeInOut' }}
      />
      {/* Vertical light beams - dark mode - more visible */}
      <motion.div
        className="absolute top-0 w-1 h-full hidden dark:block"
        style={{ background: 'linear-gradient(180deg, transparent, #71717a, transparent)', left: '10%' }}
        animate={{ opacity: [0, 0.7, 0], y: [-200, 200, -200] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-0 w-1 h-full hidden dark:block"
        style={{ background: 'linear-gradient(180deg, transparent, #71717a, transparent)', right: '10%' }}
        animate={{ opacity: [0, 0.7, 0], y: [200, -200, 200] }}
        transition={{ duration: 5, repeat: Infinity, delay: 2.5, ease: 'easeInOut' }}
      />

      {/* Geometric shapes - more visible */}
      <motion.div
        className="absolute top-[20%] right-[15%] w-20 h-20 border-2 border-zinc-300 dark:border-zinc-600"
        animate={{ rotate: [0, 360], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[12%] w-16 h-16 border-2 border-zinc-300 dark:border-zinc-600 rotate-45"
        animate={{ rotate: [45, 405], y: [0, -25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[45%] left-[5%] w-14 h-14 border-2 border-zinc-200 dark:border-zinc-700"
        animate={{ rotate: [0, -360], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-[55%] right-[8%] w-12 h-12 border-2 border-zinc-300 dark:border-zinc-600 rotate-12"
        animate={{ rotate: [12, 372], scale: [1, 1.2, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {/* Sparkles - more visible */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          style={{
            left: `${12 + i * 15}%`,
            top: `${8 + (i % 2) * 78}%`,
          }}
          animate={{
            scale: [0, 1.3, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.35,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
        </motion.div>
      ))}

      {/* Floating plus signs - more visible */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`plus-${i}`}
          className="absolute text-zinc-300 dark:text-zinc-600 text-2xl font-light"
          style={{
            left: `${20 + i * 22}%`,
            top: `${35 + (i % 2) * 25}%`,
          }}
          animate={{
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.4, 1, 0.4],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          +
        </motion.div>
      ))}

      {/* Center pulsing glow - more visible */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-400/20 dark:bg-violet-500/15 blur-3xl"
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Animated glowing dots - highly visible */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={`glow-dot-${i}`}
          className="absolute w-4 h-4 rounded-full bg-violet-500 dark:bg-violet-400 shadow-lg shadow-violet-500/50"
          style={{
            left: `${15 + i * 18}%`,
            top: '15%',
          }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating gradient orb - very visible */}
      <motion.div
        className="absolute top-[30%] right-[20%] w-32 h-32 rounded-full bg-gradient-to-br from-violet-500/30 to-pink-500/30 dark:from-violet-400/25 dark:to-pink-400/25 blur-xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Pulsing ring - visible */}
      <motion.div
        className="absolute top-[60%] left-[15%] w-24 h-24 rounded-full border-4 border-violet-400/50 dark:border-violet-300/40"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// Animated mockup showing the transformation process
function HeroVisual() {
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-0">
      {/* Main app mockup */}
      <motion.div
        className="relative bg-zinc-100 dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* App header bar */}
        <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-3 sm:px-4 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] sm:text-xs text-zinc-500">
              snapbeautify.com/app
            </div>
          </div>
        </div>

        {/* App content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Before image */}
            <motion.div
              className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-10 h-10 sm:w-16 sm:h-16 text-zinc-400 mx-auto mb-2" />
                  <p className="text-zinc-500 text-xs sm:text-sm">Original Image</p>
                </div>
              </div>
              {/* Before label */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-1 rounded-full bg-black/70 text-white text-[10px] sm:text-xs font-medium">
                Before
              </div>
              {/* Dull overlay effect */}
              <div className="absolute inset-0 bg-zinc-400/20" />
            </motion.div>

            {/* After image */}
            <motion.div
              className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-black dark:bg-white"
              initial={{ scale: 0.95 }}
              animate={{ scale: [0.95, 1, 0.95] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-10 h-10 sm:w-16 sm:h-16 text-white dark:text-black mx-auto mb-2" />
                  <p className="text-zinc-300 dark:text-zinc-700 text-xs sm:text-sm">Enhanced</p>
                </div>
              </div>
              {/* After label */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 sm:px-3 py-1 rounded-full bg-green-500 text-white text-[10px] sm:text-xs font-medium flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                After
              </div>
              {/* Sparkle effects - hidden on mobile */}
              <div className="hidden sm:block">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 3) * 20}%`,
                    }}
                    animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <Sparkles className="w-4 h-4 text-white/50 dark:text-black/50" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Action bar */}
          <motion.div
            className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-black dark:bg-white flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-black" />
              </motion.div>
              <div>
                <p className="font-semibold text-black dark:text-white text-xs sm:text-sm">AI Enhancement</p>
                <p className="text-zinc-500 text-[10px] sm:text-xs">Processing complete</p>
              </div>
            </div>
            <motion.div
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-green-500 text-white text-xs sm:text-sm font-medium"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              Ready to download
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating elements around the mockup */}
      {/* Upload card */}
      <motion.div
        className="absolute -left-8 top-1/4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xl hidden lg:block"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-2">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <p className="font-semibold text-black dark:text-white text-sm">Drop files</p>
          <p className="text-zinc-500 text-xs">or click to upload</p>
        </motion.div>
      </motion.div>

      {/* Download card */}
      <motion.div
        className="absolute -right-8 top-1/3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xl hidden lg:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mb-2">
            <Download className="w-6 h-6 text-white" />
          </div>
          <p className="font-semibold text-black dark:text-white text-sm">Export HD</p>
          <p className="text-zinc-500 text-xs">No watermark</p>
        </motion.div>
      </motion.div>

      {/* Processing speed indicator */}
      <motion.div
        className="absolute -right-4 bottom-20 bg-white dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 shadow-xl hidden lg:flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Zap className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium text-black dark:text-white">2.3s</span>
        <span className="text-xs text-zinc-500">avg. time</span>
      </motion.div>
    </div>
  )
}

// Stats component
function Stats() {
  const stats = [
    { value: '10K+', label: 'Happy Users', icon: Users },
    { value: '500K+', label: 'Photos Enhanced', icon: ImageIcon },
    { value: '4.9', label: 'User Rating', icon: Star },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + index * 0.1 }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <stat.icon className="w-5 h-5 text-zinc-400" />
            <span className="text-2xl lg:text-3xl font-bold text-black dark:text-white">
              {stat.value}
            </span>
          </div>
          <p className="text-sm text-zinc-500">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* Animated Background */}
      <AnimatedBackground />

      <Container className="relative z-10">
        {/* Hero content - Centered */}
        <div className="text-center mb-12 lg:mb-16">
          <FadeIn immediate>
            <Badge variant="default" className="mb-6">
              <Zap className="w-3 h-3 mr-2" />
              AI-Powered Image Enhancement
            </Badge>
          </FadeIn>

          <FadeIn delay={0.1} immediate>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-black dark:text-white mb-6 max-w-4xl mx-auto">
              Transform Any Photo Into{' '}
              <span className="relative">
                <span className="text-zinc-500">Perfection</span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-black dark:bg-white rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2} immediate>
            <p className="text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Professional image enhancement powered by AI. Remove backgrounds, enhance colors,
              and create stunning visuals — all in your browser, completely private.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} immediate>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/app">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 h-14 px-8 text-base font-semibold rounded-full"
                  >
                    Start Enhancing Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base font-semibold rounded-full border-zinc-300 dark:border-zinc-700"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Watch Demo
                </Button>
              </motion.div>
            </div>
          </FadeIn>

          <FadeIn delay={0.4} immediate>
            <p className="text-sm text-zinc-500 mb-12">
              ✓ No credit card required · ✓ Works on any device · ✓ 100% private
            </p>
          </FadeIn>
        </div>

        {/* Hero visual */}
        <HeroVisual />

        {/* Stats */}
        <div className="mt-16 lg:mt-20">
          <Stats />
        </div>
      </Container>
    </section>
  )
}
