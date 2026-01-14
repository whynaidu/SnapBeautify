'use client'

import { motion } from 'framer-motion'
import { Section } from '../layout/section'
import { Badge } from '../shared/badge'
import { FadeIn } from '../animations/fade-in'
import {
  Upload,
  Sparkles,
  Download,
  ArrowDown,
  Wand2,
  Image,
  FileImage,
  Check,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Step 1: Upload Animation - Files flying into a box
function UploadAnimation() {
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      {/* Central upload box */}
      <motion.div
        className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-zinc-400 dark:border-zinc-600 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Upload className="w-8 h-8 text-zinc-500" />
      </motion.div>

      {/* Flying files */}
      {[
        { x: -60, y: -40, delay: 0, rotate: -15 },
        { x: 60, y: -30, delay: 0.5, rotate: 15 },
        { x: -50, y: 40, delay: 1, rotate: -10 },
        { x: 70, y: 50, delay: 1.5, rotate: 20 },
      ].map((file, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ x: file.x * 2, y: file.y * 2, opacity: 0, rotate: file.rotate }}
          animate={{
            x: [file.x * 2, 0],
            y: [file.y * 2, 0],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: file.delay,
            ease: 'easeInOut',
          }}
        >
          <FileImage className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
        </motion.div>
      ))}

      {/* Pulse ring */}
      <motion.div
        className="absolute w-32 h-32 rounded-2xl border border-zinc-300 dark:border-zinc-700"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  )
}

// Step 2: Magic Animation - Wand with sparkles and transformation
function MagicAnimation() {
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      {/* Before image (faded) */}
      <motion.div
        className="absolute left-8 w-16 h-16 rounded-lg bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Image className="w-6 h-6 text-zinc-500" />
      </motion.div>

      {/* Central wand */}
      <motion.div
        className="relative z-10"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-16 h-16 rounded-full bg-black dark:bg-white flex items-center justify-center">
          <Wand2 className="w-8 h-8 text-white dark:text-black" />
        </div>
      </motion.div>

      {/* Sparkles around wand */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180)
        const x = Math.cos(angle) * 50
        const y = Math.sin(angle) * 50
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          >
            <Sparkles className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          </motion.div>
        )
      })}

      {/* After image (enhanced) */}
      <motion.div
        className="absolute right-8 w-16 h-16 rounded-lg bg-black dark:bg-white flex items-center justify-center"
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Image className="w-6 h-6 text-white dark:text-black" />
      </motion.div>

      {/* Transformation line */}
      <motion.div
        className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-zinc-300 via-black dark:via-white to-zinc-300"
        animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ originX: 0 }}
      />
    </div>
  )
}

// Step 3: Download Animation - File coming down with checkmark
function DownloadAnimation() {
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      {/* Download container */}
      <div className="relative">
        {/* File */}
        <motion.div
          className="w-20 h-24 rounded-lg bg-black dark:bg-white flex flex-col items-center justify-center relative overflow-hidden"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Image className="w-8 h-8 text-white dark:text-black mb-2" />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ originX: 0 }}
          />
        </motion.div>

        {/* Checkmark badge */}
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      </div>

      {/* Download arrows */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: -20 - i * 15 }}
          animate={{ y: [0, 80], opacity: [1, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeIn',
          }}
        >
          <ArrowDown className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
        </motion.div>
      ))}

      {/* Formats floating around */}
      {['PNG', 'JPG', 'WebP'].map((format, i) => (
        <motion.div
          key={format}
          className="absolute px-2 py-1 rounded text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          style={{
            left: i === 0 ? '10%' : i === 1 ? '75%' : '60%',
            top: i === 0 ? '20%' : i === 1 ? '30%' : '70%',
          }}
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        >
          {format}
        </motion.div>
      ))}
    </div>
  )
}

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Screenshot',
    description: 'Simply drag and drop your screenshot or image. Supports JPG, PNG, WebP and more.',
    animation: UploadAnimation,
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    number: '02',
    icon: Wand2,
    title: 'Customize & Style',
    description: 'Choose backgrounds, add device frames, adjust shadows, overlay text, and make it perfect.',
    animation: MagicAnimation,
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    number: '03',
    icon: Download,
    title: 'Export & Share',
    description: 'Download in PNG, JPEG, or WebP at 1x-4x quality. Copy to clipboard or share directly.',
    animation: DownloadAnimation,
    color: 'from-green-500/20 to-emerald-500/20',
  },
]

// Vertical flow connector
function FlowConnector({ index }: { index: number }) {
  return (
    <>
      {/* Mobile connector - simple dots */}
      <div className="flex lg:hidden flex-col items-center py-6 sm:py-8">
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
        </motion.div>
      </div>

      {/* Desktop connector */}
      <div className="hidden lg:flex flex-col items-center py-4">
        <motion.div
          className="w-px h-16 bg-gradient-to-b from-zinc-300 dark:from-zinc-700 to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          style={{ originY: 0 }}
        />
        <motion.div
          className="w-3 h-3 rounded-full bg-black dark:bg-white"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.2 + 0.3 }}
        />
        <motion.div
          className="w-px h-16 bg-gradient-to-b from-transparent to-zinc-300 dark:to-zinc-700"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
          style={{ originY: 0 }}
        />
      </div>
    </>
  )
}

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white dark:bg-black" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

        {/* Large decorative numbers in background - hidden on mobile */}
        <div className="hidden lg:block absolute top-20 left-10 text-[20rem] font-bold text-zinc-100 dark:text-zinc-900 select-none opacity-50">
          1
        </div>
        <div className="hidden lg:block absolute top-1/3 right-10 text-[20rem] font-bold text-zinc-100 dark:text-zinc-900 select-none opacity-50">
          2
        </div>
        <div className="hidden lg:block absolute bottom-20 left-1/3 text-[20rem] font-bold text-zinc-100 dark:text-zinc-900 select-none opacity-50">
          3
        </div>
      </div>

      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-16 lg:mb-20 relative z-10 px-4 sm:px-0">
        <FadeIn>
          <Badge variant="default" className="mb-4">
            <Zap className="w-3 h-3 mr-2" />
            How It Works
          </Badge>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-3 sm:mb-4">
            Three Steps to{' '}
            <span className="text-zinc-500">Perfection</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Beautify any screenshot in seconds. No signup, no learning curve, just stunning results.
          </p>
        </FadeIn>
      </div>

      {/* Steps - Vertical Layout */}
      <div className="max-w-5xl mx-auto relative z-10 px-4 sm:px-6 lg:px-0">
        {steps.map((step, index) => {
          const Animation = step.animation
          const Icon = step.icon
          const isEven = index % 2 === 0

          return (
            <div key={index}>
              <FadeIn delay={index * 0.2}>
                <motion.div
                  className={cn(
                    'grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center',
                    !isEven && 'lg:flex-row-reverse'
                  )}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Content Side */}
                  <div className={cn('space-y-4 sm:space-y-6', !isEven && 'lg:order-2')}>
                    {/* Step number */}
                    <motion.div
                      className="inline-flex items-center gap-3 sm:gap-4"
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-4xl sm:text-5xl lg:text-7xl font-bold text-black dark:text-white">
                        {step.number}
                      </span>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-black dark:bg-white flex items-center justify-center">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white dark:text-black" />
                      </div>
                    </motion.div>

                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black dark:text-white">
                      {step.title}
                    </h3>

                    <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className={cn(
                            'h-2 rounded-full transition-all duration-300',
                            i <= index
                              ? 'w-8 bg-black dark:bg-white'
                              : 'w-2 bg-zinc-300 dark:bg-zinc-700'
                          )}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Animation Side */}
                  <motion.div
                    className={cn(
                      'relative rounded-2xl sm:rounded-3xl overflow-hidden',
                      !isEven && 'lg:order-1'
                    )}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={cn(
                      'absolute inset-0 bg-gradient-to-br opacity-50',
                      step.color
                    )} />
                    <div className="relative bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
                      <Animation />
                    </div>
                  </motion.div>
                </motion.div>
              </FadeIn>

              {/* Connector */}
              {index < steps.length - 1 && <FlowConnector index={index} />}
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <FadeIn delay={0.6}>
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center px-4 sm:px-0">
          <motion.a
            href="/app"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-base sm:text-lg hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            Try It Now — It's Free
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-3 sm:mt-4">
            No account required • Works on any device
          </p>
        </div>
      </FadeIn>
    </Section>
  )
}
