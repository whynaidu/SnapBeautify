'use client'

import { motion } from 'framer-motion'
import { Section } from '../layout/section'
import { Badge } from '../shared/badge'
import { FadeIn } from '../animations/fade-in'
import {
  Shield,
  Server,
  Eye,
  Cloud,
  Wifi,
  Lock,
  CheckCircle2,
  XCircle,
  Laptop,
  Globe,
  Fingerprint,
  ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

const privacyFeatures = [
  {
    icon: Server,
    title: 'No Server Uploads',
    description: 'Your images never leave your device',
  },
  {
    icon: Eye,
    title: 'Zero Tracking',
    description: 'No analytics, no cookies, no data mining',
  },
  {
    icon: Cloud,
    title: 'No Cloud Storage',
    description: 'Nothing stored externally, ever',
  },
  {
    icon: Wifi,
    title: 'Works Offline',
    description: 'Full functionality without internet',
  },
]

// Comparison data
const comparison = [
  { feature: 'Images uploaded to servers', us: false, others: true },
  { feature: 'User data collected', us: false, others: true },
  { feature: 'Third-party tracking', us: false, others: true },
  { feature: 'Works offline', us: true, others: false },
  { feature: '100% browser-based', us: true, others: false },
]

// Animated shield rings - Desktop version
function AnimatedShieldDesktop() {
  // Icons that orbit on the outer ring
  const outerOrbitIcons = [
    { icon: Lock, startAngle: 0 },
    { icon: Eye, startAngle: 90 },
    { icon: Server, startAngle: 180 },
    { icon: Wifi, startAngle: 270 },
  ]

  // Icons that orbit on the middle ring
  const middleOrbitIcons = [
    { icon: Fingerprint, startAngle: 45 },
    { icon: Cloud, startAngle: 225 },
  ]

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outermost rotating ring with icons */}
      <motion.div
        className="absolute w-72 h-72 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {/* Icons on this ring */}
        {outerOrbitIcons.map((item, index) => {
          const Icon = item.icon
          const angle = item.startAngle * (Math.PI / 180)
          const radius = 144 // Half of 288px (w-72)
          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: `calc(50% + ${Math.cos(angle) * radius}px - 20px)`,
                top: `calc(50% + ${Math.sin(angle) * radius}px - 20px)`,
              }}
            >
              <motion.div
                className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-lg"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              >
                <Icon className="w-5 h-5 text-black dark:text-white" />
              </motion.div>
            </div>
          )
        })}
      </motion.div>

      {/* Middle rotating ring with icons */}
      <motion.div
        className="absolute w-48 h-48 rounded-full border border-zinc-300 dark:border-zinc-700"
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {/* Icons on this ring */}
        {middleOrbitIcons.map((item, index) => {
          const Icon = item.icon
          const angle = item.startAngle * (Math.PI / 180)
          const radius = 96 // Half of 192px (w-48)
          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: `calc(50% + ${Math.cos(angle) * radius}px - 18px)`,
                top: `calc(50% + ${Math.sin(angle) * radius}px - 18px)`,
              }}
            >
              <motion.div
                className="w-9 h-9 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-md"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              >
                <Icon className="w-4 h-4 text-black dark:text-white" />
              </motion.div>
            </div>
          )
        })}
      </motion.div>

      {/* Inner pulsing ring */}
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Center shield */}
      <motion.div
        className="relative z-10 w-20 h-20 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-xl"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ShieldCheck className="w-10 h-10 text-white dark:text-black" />
      </motion.div>

      {/* Floating particles on outermost ring */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180)
        const radius = 156
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600"
            style={{
              left: `calc(50% + ${Math.cos(angle) * radius}px - 4px)`,
              top: `calc(50% + ${Math.sin(angle) * radius}px - 4px)`,
            }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        )
      })}
    </div>
  )
}

// Animated shield rings - Mobile version
function AnimatedShieldMobile() {
  // Icons that orbit on the outer ring (same as desktop)
  const outerOrbitIcons = [
    { icon: Lock, startAngle: 0 },
    { icon: Eye, startAngle: 90 },
    { icon: Server, startAngle: 180 },
    { icon: Wifi, startAngle: 270 },
  ]

  // Icons that orbit on the middle ring (same as desktop)
  const middleOrbitIcons = [
    { icon: Fingerprint, startAngle: 45 },
    { icon: Cloud, startAngle: 225 },
  ]

  return (
    <div className="relative w-full h-56 flex items-center justify-center">
      {/* Outer rotating ring with 4 icons */}
      <motion.div
        className="absolute w-48 h-48 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {/* Icons on outer ring */}
        {outerOrbitIcons.map((item, index) => {
          const Icon = item.icon
          const angle = item.startAngle * (Math.PI / 180)
          const radius = 96 // Half of 192px (w-48)
          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: `calc(50% + ${Math.cos(angle) * radius}px - 14px)`,
                top: `calc(50% + ${Math.sin(angle) * radius}px - 14px)`,
              }}
            >
              <motion.div
                className="w-7 h-7 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-md"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Icon className="w-3.5 h-3.5 text-black dark:text-white" />
              </motion.div>
            </div>
          )
        })}
      </motion.div>

      {/* Middle rotating ring with 2 icons */}
      <motion.div
        className="absolute w-28 h-28 rounded-full border border-zinc-300 dark:border-zinc-700"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        {/* Icons on middle ring */}
        {middleOrbitIcons.map((item, index) => {
          const Icon = item.icon
          const angle = item.startAngle * (Math.PI / 180)
          const radius = 56 // Half of 112px (w-28)
          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: `calc(50% + ${Math.cos(angle) * radius}px - 12px)`,
                top: `calc(50% + ${Math.sin(angle) * radius}px - 12px)`,
              }}
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              >
                <Icon className="w-3 h-3 text-black dark:text-white" />
              </motion.div>
            </div>
          )
        })}
      </motion.div>

      {/* Inner pulsing ring */}
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Center shield */}
      <motion.div
        className="relative z-10 w-11 h-11 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ShieldCheck className="w-5 h-5 text-white dark:text-black" />
      </motion.div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180)
        const radius = 108
        return (
          <motion.div
            key={`particle-mobile-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600"
            style={{
              left: `calc(50% + ${Math.cos(angle) * radius}px - 3px)`,
              top: `calc(50% + ${Math.sin(angle) * radius}px - 3px)`,
            }}
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        )
      })}
    </div>
  )
}

// Data flow animation
function DataFlowVisual() {
  return (
    <div className="relative h-24 flex items-center justify-center gap-4">
      {/* Your Device */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <div className="w-14 h-14 rounded-xl bg-black dark:bg-white flex items-center justify-center mb-2">
          <Laptop className="w-7 h-7 text-white dark:text-black" />
        </div>
        <span className="text-xs font-medium text-black dark:text-white">Your Device</span>
      </motion.div>

      {/* Animated dots - staying local */}
      <div className="flex items-center gap-1 px-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-green-500"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>

      {/* Lock icon - data stays */}
      <motion.div
        className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
      </motion.div>

      {/* Blocked arrow */}
      <div className="flex items-center gap-1 px-4">
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <XCircle className="w-5 h-5 text-red-500" />
        </motion.div>
      </div>

      {/* Server - crossed out */}
      <motion.div
        className="flex flex-col items-center opacity-40"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 0.4, x: 0 }}
        viewport={{ once: true }}
      >
        <div className="relative w-14 h-14 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-2">
          <Globe className="w-7 h-7 text-zinc-400" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-0.5 bg-red-500 rotate-45" />
          </div>
        </div>
        <span className="text-xs font-medium text-zinc-400">External Server</span>
      </motion.div>
    </div>
  )
}

export function PrivacySection() {
  return (
    <Section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />

        {/* Decorative circles - Desktop */}
        <motion.div
          className="hidden sm:block absolute -top-20 -right-20 w-96 h-96 rounded-full border border-zinc-200 dark:border-zinc-800"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="hidden sm:block absolute -bottom-20 -left-20 w-72 h-72 rounded-full border border-zinc-200 dark:border-zinc-800"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        />

        {/* Decorative circles - Mobile */}
        <motion.div
          className="sm:hidden absolute -top-10 -right-10 w-48 h-48 rounded-full border border-zinc-200 dark:border-zinc-800"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="sm:hidden absolute -bottom-10 -left-10 w-36 h-36 rounded-full border border-zinc-200 dark:border-zinc-800"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="sm:hidden absolute top-1/3 -right-8 w-24 h-24 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="sm:hidden absolute bottom-1/4 -left-6 w-20 h-20 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Header */}
      <div className="text-center mb-10 sm:mb-16 px-4 sm:px-0">
        <FadeIn>
          <Badge variant="default" className="mb-4">
            <Shield className="w-3 h-3 mr-2" />
            Privacy First
          </Badge>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-3 sm:mb-4">
            Your Data <span className="text-zinc-500">Never Leaves</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Everything happens in your browser. No uploads, no servers, no compromises.
          </p>
        </FadeIn>
      </div>

      {/* Data Flow Visual - hidden on mobile, shown on sm+ */}
      <FadeIn delay={0.3}>
        <div className="hidden sm:block mb-10 sm:mb-16 p-4 sm:p-8 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-w-3xl mx-auto">
          <p className="text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-4 sm:mb-6">How your data flows (spoiler: it doesn't leave)</p>
          <DataFlowVisual />
        </div>
      </FadeIn>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center px-4 sm:px-0">
        {/* Left - Animated Shield */}
        <FadeIn delay={0.2}>
          {/* Mobile version */}
          <div className="lg:hidden mb-8">
            <AnimatedShieldMobile />
          </div>
          {/* Desktop version */}
          <div className="hidden lg:block relative h-80 lg:h-96">
            <AnimatedShieldDesktop />
          </div>
        </FadeIn>

        {/* Right - Comparison table */}
        <FadeIn delay={0.3}>
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 sm:mb-6">
              SnapBeautify vs Others
            </h3>

            <div className="rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-3 bg-zinc-100 dark:bg-zinc-800 p-3 sm:p-4 text-xs sm:text-sm font-semibold">
                <div className="text-zinc-600 dark:text-zinc-400">Feature</div>
                <div className="text-center text-black dark:text-white">Us</div>
                <div className="text-center text-zinc-500">Others</div>
              </div>

              {/* Rows */}
              {comparison.map((item, index) => (
                <motion.div
                  key={index}
                  className="grid grid-cols-3 p-3 sm:p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">{item.feature}</div>
                  <div className="flex justify-center">
                    {item.us ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex justify-center">
                    {item.others ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    ) : (
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300 dark:text-zinc-600" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Bottom feature cards */}
      <FadeIn delay={0.4}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-10 sm:mt-16 px-4 sm:px-0">
          {privacyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-black dark:bg-white flex items-center justify-center mb-3 sm:mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white dark:text-black" />
              </motion.div>
              <h4 className="font-semibold text-sm sm:text-base text-black dark:text-white mb-1 sm:mb-2">
                {feature.title}
              </h4>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </FadeIn>
    </Section>
  )
}
