'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '../shared/badge'
import { Button } from '@/components/ui/button'
import { Container } from '../layout/container'
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

// Static background - no animations, pure CSS
function StaticBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-white dark:bg-black" />

      {/* Grid pattern - CSS only */}
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 70%, transparent 100%)',
        }}
      />

      {/* Static gradient orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-500/15 dark:bg-violet-400/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-pink-500/15 dark:bg-pink-400/10 blur-3xl" />
      <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-3xl" />
    </div>
  )
}

// Hero visual - completely static, no animations
function HeroVisual() {
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-0">
      {/* Main app mockup */}
      <div className="relative bg-zinc-100 dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl">
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
            {/* Before image - PRIORITY loading for LCP */}
            <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800">
              <Image
                src="/images/hero/before.webp"
                alt="Before beautification"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
              />
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-1 rounded-full bg-black/70 text-white text-[10px] sm:text-xs font-medium">
                Before
              </div>
              <div className="absolute inset-0 bg-zinc-400/20" />
            </div>

            {/* After image - PRIORITY loading for LCP */}
            <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-black dark:bg-white">
              <Image
                src="/images/hero/after.webp"
                alt="After beautification"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
              />
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 sm:px-3 py-1 rounded-full bg-green-500 text-white text-[10px] sm:text-xs font-medium flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                After
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-black dark:bg-white flex items-center justify-center">
                <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-black" />
              </div>
              <div>
                <p className="font-semibold text-black dark:text-white text-xs sm:text-sm">Beautification Complete</p>
                <p className="text-zinc-500 text-[10px] sm:text-xs">Ready to export</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-green-500 text-white text-xs sm:text-sm font-medium">
              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              Ready to download
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements - desktop only, static */}
      <div className="absolute -left-8 top-1/4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xl hidden lg:block">
        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-2">
          <ImageIcon className="w-6 h-6 text-white" />
        </div>
        <p className="font-semibold text-black dark:text-white text-sm">Drop files</p>
        <p className="text-zinc-500 text-xs">or click to upload</p>
      </div>

      <div className="absolute -right-8 top-1/3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xl hidden lg:block">
        <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mb-2">
          <Download className="w-6 h-6 text-white" />
        </div>
        <p className="font-semibold text-black dark:text-white text-sm">Export HD</p>
        <p className="text-zinc-500 text-xs">No watermark</p>
      </div>

      <div className="absolute -right-4 bottom-20 bg-white dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 shadow-xl hidden lg:flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium text-black dark:text-white">2.3s</span>
        <span className="text-xs text-zinc-500">avg. time</span>
      </div>
    </div>
  )
}

// Stats component - static
function Stats() {
  const stats = [
    { value: '10K+', label: 'Happy Users', icon: Users },
    { value: '500K+', label: 'Screenshots Beautified', icon: ImageIcon },
    { value: '4.9', label: 'User Rating', icon: Star },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <stat.icon className="w-5 h-5 text-zinc-400" />
            <span className="text-2xl lg:text-3xl font-bold text-black dark:text-white">
              {stat.value}
            </span>
          </div>
          <p className="text-sm text-zinc-500">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 lg:pt-32 lg:pb-24">
      <StaticBackground />

      <Container className="relative z-10">
        {/* Hero content - NO animations, immediate render */}
        <div className="text-center mb-12 lg:mb-16">
          <Badge variant="default" className="mb-6">
            <Sparkles className="w-3 h-3 mr-2" aria-hidden="true" />
            Screenshot Beautification Made Simple
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-black dark:text-white mb-6 max-w-4xl mx-auto text-balance">
            Make Your Screenshots{' '}
            <span className="relative">
              <span className="text-zinc-500">Stunning</span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-black dark:bg-white rounded-full" />
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
            Transform screenshots into beautiful presentations with custom backgrounds, device frames,
            and professional styling — all in your browser, completely private.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/app">
              <Button
                size="lg"
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 h-14 px-8 text-base font-semibold rounded-full"
              >
                Start Beautifying Free
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-base font-semibold rounded-full border-zinc-300 dark:border-zinc-700"
            >
              <Play className="w-5 h-5 mr-2 fill-current" aria-hidden="true" />
              Watch Demo
            </Button>
          </div>

          <p className="text-sm text-zinc-500 mb-12">
            ✓ No credit card required · ✓ Works on any device · ✓ 100% private
          </p>
        </div>

        <HeroVisual />

        <div className="mt-16 lg:mt-20">
          <Stats />
        </div>
      </Container>
    </section>
  )
}
