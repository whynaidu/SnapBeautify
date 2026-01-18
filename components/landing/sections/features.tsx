'use client'

import { motion } from 'framer-motion'
import { Section } from '../layout/section'
import { Badge } from '../shared/badge'
import { FadeIn } from '../animations/fade-in'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/lib/hooks/useWindowSize'
import {
  Palette,
  Sparkles,
  Smartphone,
  LayoutTemplate,
  Layers,
  Crop,
  LucideIcon,
  Zap,
  Image,
  Type,
  Grid3X3,
  Frame,
  ArrowRight,
  Monitor,
  Wand2,
  SunMedium,
  CheckCircle,
  BadgeCheck,
  FileImage,
} from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  gradient: string
  animation: React.FC<{ isMobile: boolean }>
}

// Pre-generated sparkle positions for stable rendering
const sparklePositions = [
  { left: '25%', top: '30%' },
  { left: '70%', top: '25%' },
  { left: '35%', top: '65%' },
  { left: '60%', top: '55%' },
  { left: '45%', top: '40%' },
  { left: '75%', top: '70%' },
]

// Animation: Background Removal - Layers peeling away
function BackgroundRemovalAnim({ isMobile }: { isMobile: boolean }) {
  // Static version for mobile
  if (isMobile) {
    return (
      <div className="relative w-full h-full min-h-[160px] flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-xl bg-zinc-300 dark:bg-zinc-700 translate-x-2 translate-y-2 opacity-50" />
        <div className="absolute w-20 h-20 rounded-xl bg-zinc-400 dark:bg-zinc-600 translate-x-1 translate-y-1 opacity-70" />
        <div className="relative w-16 h-16 rounded-xl bg-black dark:bg-white flex items-center justify-center z-10">
          <Image className="w-7 h-7 text-white dark:text-black" />
        </div>
        <div className="absolute bottom-4 right-4 z-20">
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-white dark:text-black" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[160px] sm:min-h-[200px] flex items-center justify-center">
      {/* Background layer */}
      <motion.div
        className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl bg-zinc-300 dark:bg-zinc-700"
        animate={{ x: [0, 15, 0], y: [0, 15, 0], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Middle layer */}
      <motion.div
        className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl bg-zinc-400 dark:bg-zinc-600"
        animate={{ x: [0, 8, 0], y: [0, 8, 0], opacity: [0.7, 0.5, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      />
      {/* Foreground - the subject */}
      <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-black dark:bg-white flex items-center justify-center z-10">
        <Image className="w-7 h-7 sm:w-10 sm:h-10 text-white dark:text-black" />
      </div>
      {/* Wand - static */}
      <div className="absolute bottom-4 right-4 sm:bottom-2 sm:right-2 z-20">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
          <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-black" />
        </div>
      </div>
      {/* Static sparkles */}
      {sparklePositions.slice(0, 3).map((pos, i) => (
        <div key={i} className="absolute opacity-50" style={pos}>
          <Sparkles className="w-4 h-4 text-zinc-400" />
        </div>
      ))}
    </div>
  )
}

// Animation: Smart Enhancement - Color bars rising
function EnhancementAnim({ isMobile }: { isMobile: boolean }) {
  const bars = [
    { height: '40%', delay: 0, color: 'bg-red-400' },
    { height: '60%', delay: 0.1, color: 'bg-orange-400' },
    { height: '80%', delay: 0.2, color: 'bg-yellow-400' },
    { height: '70%', delay: 0.3, color: 'bg-green-400' },
    { height: '50%', delay: 0.4, color: 'bg-blue-400' },
    { height: '65%', delay: 0.5, color: 'bg-purple-400' },
  ]

  // Static version for mobile
  if (isMobile) {
    return (
      <div className="relative w-full h-full min-h-[160px] flex items-end justify-center gap-1.5 pb-6">
        {bars.map((bar, i) => (
          <div key={i} className={cn('w-4 rounded-t-lg', bar.color)} style={{ height: bar.height }} />
        ))}
        <div className="absolute top-3 right-3">
          <Sparkles className="w-4 h-4 text-zinc-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[160px] sm:min-h-[200px] flex items-end justify-center gap-1.5 sm:gap-2 pb-6 sm:pb-8">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className={cn('w-4 sm:w-6 rounded-t-lg', bar.color)}
          initial={{ height: '20%' }}
          animate={{ height: ['20%', bar.height, '20%'] }}
          transition={{ duration: 2, repeat: Infinity, delay: bar.delay, ease: 'easeInOut' }}
        />
      ))}
      {/* Static sparkle */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-zinc-400" />
      </div>
    </div>
  )
}

// Animation: Shadow Detection - Sun casting shadow
function ShadowAnim({ isMobile }: { isMobile: boolean }) {
  // Static version for mobile
  if (isMobile) {
    return (
      <div className="relative w-full h-full min-h-[160px] flex items-center justify-center">
        <div className="absolute top-3 right-3">
          <SunMedium className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="relative">
          <div className="w-16 h-20 rounded-lg bg-black dark:bg-white" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-400 dark:bg-zinc-600 rounded-full blur-sm opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[160px] sm:min-h-[200px] flex items-center justify-center">
      {/* Sun - static */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <SunMedium className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
      </div>

      {/* Object */}
      <div className="relative">
        <motion.div
          className="w-16 h-20 rounded-lg bg-black dark:bg-white"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Shadow */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-400 dark:bg-zinc-600 rounded-full blur-sm"
          animate={{ scaleX: [1, 1.3, 1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Light rays - static, hidden on mobile */}
      <div className="hidden sm:block">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute top-8 right-12 w-24 h-0.5 bg-gradient-to-l from-yellow-400/30 to-transparent origin-right"
            style={{ transform: `rotate(${30 + i * 15}deg)` }}
          />
        ))}
      </div>
    </div>
  )
}

// Animation: Batch Processing - Multiple cards processing
function BatchAnim({ isMobile }: { isMobile: boolean }) {
  // Static version for mobile
  if (isMobile) {
    return (
      <div className="relative w-full h-full min-h-[160px] flex items-center justify-center">
        {/* Static stack of cards */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute w-16 h-11 rounded-md bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center"
            style={{
              left: `calc(50% - 32px + ${i * 6}px)`,
              top: `calc(50% - 22px + ${i * 5}px)`,
              zIndex: 4 - i,
            }}
          >
            <Image className="w-5 h-5 text-zinc-500" />
          </div>
        ))}
        {/* Static checkmarks */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[160px] sm:min-h-[200px] flex items-center justify-center">
      {/* Stack of cards */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-11 sm:w-20 sm:h-14 rounded-md sm:rounded-lg bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center"
          style={{
            left: `calc(50% - 32px + ${i * 6}px)`,
            top: `calc(50% - 22px + ${i * 5}px)`,
            zIndex: 4 - i,
          }}
          animate={{
            x: [0, -40, -40, 0],
            opacity: i === 0 ? [1, 1, 0, 1] : 1,
          }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
        >
          <Image className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-500" />
        </motion.div>
      ))}

      {/* Static checkmarks */}
      <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Animation: Premium Templates - Grid shuffle
function TemplatesAnim({ isMobile }: { isMobile: boolean }) {
  // Static version for mobile
  if (isMobile) {
    return (
      <div className="relative w-full h-full min-h-[160px] flex items-center justify-center">
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className={cn(
                'w-8 h-8 rounded-md border border-zinc-300 dark:border-zinc-700',
                i === 4 ? 'bg-black dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-800'
              )}
            >
              {i === 4 && (
                <div className="w-full h-full flex items-center justify-center">
                  <Grid3X3 className="w-4 h-4 text-white dark:text-black" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold">
          50+
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[160px] sm:min-h-[200px] flex items-center justify-center">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <motion.div
            key={i}
            className={cn(
              'w-8 h-8 sm:w-12 sm:h-12 rounded-md sm:rounded-lg border border-zinc-300 dark:border-zinc-700',
              i === 4 ? 'bg-black dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-800'
            )}
            animate={{
              scale: [1, i === 4 ? 1.1 : 0.95, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
          >
            {i === 4 && (
              <div className="w-full h-full flex items-center justify-center">
                <Grid3X3 className="w-4 h-4 sm:w-6 sm:h-6 text-white dark:text-black" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
      {/* "50+" badge - static */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] sm:text-xs font-bold">
        50+
      </div>
    </div>
  )
}

// Animation: No Watermark - Clean export
function NoWatermarkAnim({ isMobile }: { isMobile: boolean }) {
  // Static version for mobile
  if (isMobile) {
    return (
      <div className="relative w-full h-full min-h-[160px] flex items-center justify-center">
        <div className="relative w-20 h-28 rounded-lg bg-black dark:bg-white overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image className="w-8 h-8 text-white dark:text-black" />
          </div>
          <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <BadgeCheck className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="absolute top-6 left-6 px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/50">
          <span className="text-[10px] text-red-500 line-through">Watermark</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[160px] sm:min-h-[200px] flex items-center justify-center">
      {/* Image card */}
      <motion.div
        className="relative w-20 h-28 sm:w-28 sm:h-36 rounded-lg sm:rounded-xl bg-black dark:bg-white overflow-hidden"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Image className="w-8 h-8 sm:w-12 sm:h-12 text-white dark:text-black" />
        </div>
        {/* Clean badge - static */}
        <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center">
          <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      </motion.div>

      {/* Crossed out watermark text - static */}
      <div className="absolute top-6 left-6 sm:top-4 sm:left-4 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-red-500/20 border border-red-500/50">
        <span className="text-[10px] sm:text-xs text-red-500 line-through">Watermark</span>
      </div>

      {/* Sparkle - static */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
      </div>
    </div>
  )
}

const features: Feature[] = [
  {
    icon: Palette,
    title: 'Custom Backgrounds',
    description: 'Choose from solid colors, gradients, mesh patterns, text overlays, logo grids, and wave splits.',
    gradient: 'from-purple-500/10 via-transparent to-pink-500/10',
    animation: BackgroundRemovalAnim,
  },
  {
    icon: Frame,
    title: 'Device Frames',
    description: 'Showcase your screenshots in professional device mockups - macOS, Windows, iPhone, Android, and browsers.',
    gradient: 'from-orange-500/10 via-transparent to-yellow-500/10',
    animation: EnhancementAnim,
  },
  {
    icon: Sparkles,
    title: 'Complete Customization',
    description: 'Adjust padding, border radius, shadows, zoom, and rotation for pixel-perfect results.',
    gradient: 'from-yellow-500/10 via-transparent to-amber-500/10',
    animation: ShadowAnim,
  },
  {
    icon: Type,
    title: 'Text Overlays',
    description: 'Add draggable text with custom fonts, colors, and sizes. Perfect for annotations and branding.',
    gradient: 'from-blue-500/10 via-transparent to-cyan-500/10',
    animation: BatchAnim,
  },
  {
    icon: Crop,
    title: 'Smart Cropping',
    description: 'Interactive crop tool with resize handles. Revert to original anytime.',
    gradient: 'from-green-500/10 via-transparent to-emerald-500/10',
    animation: TemplatesAnim,
  },
  {
    icon: Grid3X3,
    title: 'Social Media Ready',
    description: 'Preset aspect ratios for Twitter, LinkedIn, Instagram, Stories, and more.',
    gradient: 'from-teal-500/10 via-transparent to-green-500/10',
    animation: NoWatermarkAnim,
  },
]

function FeatureCard({
  feature,
  index,
  isLarge = false,
  isWide = false,
  isMobile = false
}: {
  feature: Feature
  index: number
  isLarge?: boolean
  isWide?: boolean
  isMobile?: boolean
}) {
  const Icon = feature.icon
  const Animation = feature.animation

  // Simplified card for mobile - no motion animations
  if (isMobile) {
    return (
      <div
        className={cn(
          'group relative rounded-2xl overflow-hidden h-full',
          'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
        )}
      >
        <div className={cn(
          'relative h-full flex',
          isLarge ? 'flex-col' : isWide ? 'flex-col' : 'flex-col'
        )}>
          {/* Animation area */}
          <div className={cn(
            'relative',
            isLarge ? 'h-48' : isWide ? 'h-40' : 'h-40'
          )}>
            <Animation isMobile={true} />
          </div>

          {/* Content area */}
          <div className="p-4 flex flex-col justify-center">
            {/* Icon */}
            <div
              className={cn(
                'rounded-xl bg-black dark:bg-white flex items-center justify-center mb-3',
                isLarge ? 'w-11 h-11' : 'w-10 h-10'
              )}
            >
              <Icon className={cn(
                'text-white dark:text-black',
                isLarge ? 'w-5 h-5' : 'w-5 h-5'
              )} />
            </div>

            {/* Title */}
            <h3 className={cn(
              'font-bold text-black dark:text-white mb-1',
              isLarge ? 'text-xl' : 'text-base'
            )}>
              {feature.title}
            </h3>

            {/* Description */}
            <p className={cn(
              'text-zinc-600 dark:text-zinc-400 leading-relaxed',
              isLarge ? 'text-sm' : 'text-xs'
            )}>
              {feature.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        'group relative rounded-2xl sm:rounded-3xl overflow-hidden h-full',
        'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
        'hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-500'
      )}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Gradient background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
        feature.gradient
      )} />

      <div className={cn(
        'relative h-full flex',
        isLarge ? 'flex-col' : isWide ? 'flex-col sm:flex-row' : 'flex-col'
      )}>
        {/* Animation area */}
        <div className={cn(
          'relative',
          isLarge ? 'h-48 sm:h-64 lg:h-72' : isWide ? 'h-40 sm:h-auto sm:w-1/2' : 'h-40 sm:h-48'
        )}>
          <Animation isMobile={false} />
        </div>

        {/* Content area */}
        <div className={cn(
          'p-4 sm:p-6 flex flex-col justify-center',
          isLarge ? 'lg:p-8' : isWide ? 'sm:w-1/2' : ''
        )}>
          {/* Icon - static, no hover animation */}
          <div
            className={cn(
              'rounded-xl sm:rounded-2xl bg-black dark:bg-white flex items-center justify-center mb-3 sm:mb-4',
              isLarge ? 'w-11 h-11 sm:w-14 sm:h-14' : 'w-10 h-10 sm:w-12 sm:h-12'
            )}
          >
            <Icon className={cn(
              'text-white dark:text-black',
              isLarge ? 'w-5 h-5 sm:w-7 sm:h-7' : 'w-5 h-5 sm:w-6 sm:h-6'
            )} />
          </div>

          {/* Title */}
          <h3 className={cn(
            'font-bold text-black dark:text-white mb-1 sm:mb-2',
            isLarge ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-base sm:text-lg'
          )}>
            {feature.title}
          </h3>

          {/* Description */}
          <p className={cn(
            'text-zinc-600 dark:text-zinc-400 leading-relaxed',
            isLarge ? 'text-sm sm:text-base lg:text-lg' : 'text-xs sm:text-sm'
          )}>
            {feature.description}
          </p>

          {/* Learn more link for large card - static */}
          {isLarge && (
            <a
              href="#"
              className="inline-flex items-center gap-2 mt-3 sm:mt-4 text-black dark:text-white font-semibold text-sm sm:text-base"
            >
              Learn more
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          )}
        </div>
      </div>

    </motion.div>
  )
}

export function FeaturesSection() {
  const isMobile = useIsMobile();

  return (
    <Section id="features" className="relative overflow-hidden">
      {/* Background - simplified, no rotation animations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

        {/* Static decorative circles - no animation */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 hidden lg:block" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 hidden lg:block" />
      </div>

      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-16 px-4 sm:px-0">
        <FadeIn>
          <Badge variant="default" className="mb-4">
            <Zap className="w-3 h-3 mr-2" />
            Features
          </Badge>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-3 sm:mb-4">
            Powerful Tools,{' '}
            <span className="text-zinc-500">Simple Interface</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Everything you need to present your screenshots beautifully. Professional results without the complexity.
          </p>
        </FadeIn>
      </div>

      {/* Features Grid - Bento Style */}
      <div className="px-4 sm:px-0 space-y-4 lg:space-y-6">
        {/* Mobile: All cards in single column / Desktop: Bento layout */}

        {/* Large Featured Card - AI Background Removal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <FeatureCard feature={features[0]} index={0} isLarge isMobile={isMobile} />

          {/* Right side: 2 cards stacked + 1 wide card - on mobile this becomes a single column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <FeatureCard feature={features[1]} index={1} isMobile={isMobile} />
            <FeatureCard feature={features[2]} index={2} isMobile={isMobile} />
            {/* Wide card - full width on mobile, spans 2 cols on sm+ */}
            <div className="sm:col-span-2">
              <FeatureCard feature={features[3]} index={3} isWide isMobile={isMobile} />
            </div>
          </div>
        </div>

        {/* Bottom Row: 2 cards - stacks on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <FeatureCard feature={features[4]} index={4} isMobile={isMobile} />
          <FeatureCard feature={features[5]} index={5} isMobile={isMobile} />
        </div>
      </div>

      {/* Bottom CTA */}
      <FadeIn delay={0.5}>
        <div className="mt-10 sm:mt-16 text-center px-4 sm:px-0">
          <a
            href="/app"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-base sm:text-lg hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            Explore All Features
            <span>→</span>
          </a>
        </div>
      </FadeIn>
    </Section>
  )
}
