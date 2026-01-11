'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Sparkles,
  Heart,
  Shield,
  Zap,
  Users,
  Globe,
  Lock,
  Eye,
  Server,
  Target,
  Lightbulb,
  ArrowRight,
  ImageIcon,
  Wand2,
  Camera,
  ShieldCheck,
  Fingerprint,
  Cloud,
  Wifi
} from 'lucide-react'

const stats = [
  { value: '10K+', label: 'Happy Users', icon: Users },
  { value: '100K+', label: 'Photos Enhanced', icon: ImageIcon },
  { value: '100%', label: 'Privacy', icon: Shield },
  { value: '0', label: 'Images Stored', icon: Server },
]

const values = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your images never leave your device. We built SnapBeautify to process everything locally in your browser.',
  },
  {
    icon: Zap,
    title: 'Speed Matters',
    description: 'No uploads, no waiting. Get instant results with our optimized AI that runs directly on your device.',
  },
  {
    icon: Heart,
    title: 'User Focused',
    description: 'We design for real people. Simple interface, powerful features, no unnecessary complexity.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation Driven',
    description: 'Constantly improving our AI models to give you the best possible image enhancement.',
  },
]

const features = [
  {
    icon: Wand2,
    title: 'AI Enhancement',
    description: 'Smart algorithms that understand and enhance your photos automatically.',
  },
  {
    icon: Camera,
    title: 'Background Removal',
    description: 'One-click background removal powered by advanced AI technology.',
  },
  {
    icon: Sparkles,
    title: 'Beautification',
    description: 'Portrait enhancement, skin smoothing, and professional touch-ups.',
  },
]

const timeline = [
  {
    year: '2024',
    title: 'The Beginning',
    description: 'SnapBeautify was born from a simple idea: professional photo editing should be accessible to everyone.',
  },
  {
    year: '2024',
    title: 'Launch',
    description: 'We launched our browser-based editor, proving that powerful AI can run entirely on your device.',
  },
  {
    year: '2025',
    title: 'Growing',
    description: 'Thousands of users trust SnapBeautify for their daily image editing needs.',
  },
]

// Orbiting Shield Animation Component
function OrbitingShield() {
  const outerOrbitIcons = [
    { icon: Lock, startAngle: 0 },
    { icon: Eye, startAngle: 90 },
    { icon: Server, startAngle: 180 },
    { icon: Wifi, startAngle: 270 },
  ]

  const middleOrbitIcons = [
    { icon: Fingerprint, startAngle: 45 },
    { icon: Cloud, startAngle: 225 },
  ]

  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      {/* Outer rotating ring with icons */}
      <motion.div
        className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {outerOrbitIcons.map((item, index) => {
          const Icon = item.icon
          const angle = item.startAngle * (Math.PI / 180)
          const radius = 128
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
        className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-zinc-300 dark:border-zinc-700"
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {middleOrbitIcons.map((item, index) => {
          const Icon = item.icon
          const angle = item.startAngle * (Math.PI / 180)
          const radius = 80
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
        className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Center shield */}
      <motion.div
        className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-xl"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white dark:text-black" />
      </motion.div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180)
        const radius = 145
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

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-white dark:bg-black" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">

        {/* Hero Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            About SnapBeautify
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Making Photo Editing
            <br />
            <span className="text-zinc-400">Accessible & Private</span>
          </motion.h1>

          <motion.p
            className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We believe everyone deserves access to professional-quality image editing tools,
            without compromising on privacy.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="w-12 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 10 }}
              >
                <stat.icon className="w-6 h-6 text-white dark:text-black" />
              </motion.div>
              <div className="text-3xl font-bold text-black dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Section with Orbiting Shield */}
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-6">
              <Target className="w-3 h-3" />
              Our Mission
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-6">
              Your Photos. <span className="text-zinc-400">Your Privacy.</span>
            </h2>

            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Unlike other tools, SnapBeautify processes everything directly in your browser.
              Your images never touch our servers. Your privacy isn't a feature — it's our foundation.
            </p>

            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Whether you're an e-commerce seller, content creator, or someone who just wants
              better-looking pictures, SnapBeautify has you covered.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <OrbitingShield />
          </motion.div>
        </motion.div>

        {/* What We Do Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Wand2 className="w-3 h-3" />
              What We Do
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Powerful Tools, <span className="text-zinc-400">Simple Experience</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="w-14 h-14 rounded-xl bg-black dark:bg-white flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="w-7 h-7 text-white dark:text-black" />
                </motion.div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Heart className="w-3 h-3" />
              Our Values
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-black dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              What We <span className="text-zinc-400">Stand For</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="group p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start gap-5">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: 10 }}
                  >
                    <value.icon className="w-6 h-6 text-white dark:text-black" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white mb-2">{value.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Zap className="w-3 h-3" />
              Our Journey
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-black dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              How We <span className="text-zinc-400">Got Here</span>
            </motion.h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800 md:-translate-x-1/2" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className={`relative flex items-start gap-8 md:gap-0 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-black dark:bg-white md:-translate-x-1/2 ring-4 ring-white dark:ring-black z-10"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.2 }}
                  />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <motion.div
                      className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                      whileHover={{ y: -3 }}
                    >
                      <span className="inline-block px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold mb-3">
                        {item.year}
                      </span>
                      <h3 className="text-lg font-bold text-black dark:text-white mb-2">{item.title}</h3>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm">{item.description}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Made in India Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
              <motion.div
                className="text-5xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🇮🇳
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                  Made with
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500 inline" />
                  </motion.span>
                  in India
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  SnapBeautify is proudly built in India, for the world. Supporting local payments including UPI.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="p-12 rounded-3xl bg-black dark:bg-white relative overflow-hidden">
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="w-12 h-12 text-white dark:text-black mx-auto mb-6" />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white dark:text-black mb-4">
                Ready to Transform Your Photos?
              </h2>
              <p className="text-zinc-400 dark:text-zinc-600 max-w-xl mx-auto mb-8">
                Join thousands of users who trust SnapBeautify for their image editing needs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/app">
                  <motion.button
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white dark:bg-black text-black dark:text-white font-semibold hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Editing Free
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/pricing">
                  <motion.button
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-transparent text-white dark:text-black font-semibold border border-zinc-700 dark:border-zinc-300 hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Pricing
                  </motion.button>
                </Link>
              </div>

              <p className="text-zinc-500 text-sm mt-6">
                No signup required • Works on any device
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
