'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from './layout/container'
import { Logo } from './shared/logo'
import {
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Mail,
  ArrowRight,
  Sparkles,
  Heart,
  Zap,
  Shield,
  Globe,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react'

const footerLinks = {
  product: {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Open Editor', href: '/app' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refund Policy', href: '/refund' },
    ],
  },
}

const socialLinks = [
  {
    icon: Twitter,
    href: 'https://twitter.com/snapbeautify',
    label: 'Twitter',
    color: 'hover:bg-blue-500 hover:border-blue-500',
  },
  {
    icon: Instagram,
    href: 'https://instagram.com/snapbeautify',
    label: 'Instagram',
    color: 'hover:bg-pink-500 hover:border-pink-500',
  },
  {
    icon: Youtube,
    href: 'https://youtube.com/@snapbeautify',
    label: 'YouTube',
    color: 'hover:bg-red-500 hover:border-red-500',
  },
  {
    icon: Linkedin,
    href: 'https://linkedin.com/company/snapbeautify',
    label: 'LinkedIn',
    color: 'hover:bg-blue-600 hover:border-blue-600',
  },
]

const features = [
  { icon: Zap, label: 'Fast Processing' },
  { icon: Shield, label: '100% Private' },
  { icon: Globe, label: 'Works Anywhere' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
        // Reset to idle after 5 seconds
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 5000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to subscribe')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <footer className="relative bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-zinc-300 dark:bg-zinc-800 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-zinc-300 dark:bg-zinc-800 rounded-full blur-3xl opacity-50" />

        {/* Animated floating elements */}
        <motion.div
          className="absolute top-20 right-[20%] w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 left-[15%] w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full"
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-40 right-[30%] w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full"
          animate={{ y: [0, -25, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Top decorative border */}
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" />

      <Container className="relative z-10 px-4 sm:px-6">
        {/* Main footer content */}
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">

            {/* Brand section - larger on desktop */}
            <div className="lg:col-span-5 space-y-6">
              <Link href="/" className="inline-block">
                <Logo />
              </Link>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed">
                Transform your photos in seconds with AI-powered enhancement.
                100% browser-based, 100% private. No uploads, no compromises.
              </p>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <feature.icon className="w-3.5 h-3.5 text-zinc-500" />
                    {feature.label}
                  </motion.div>
                ))}
              </div>

              {/* Newsletter section */}
              <div className="pt-4 sm:pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <p className="font-medium text-sm text-zinc-900 dark:text-white">Stay in the loop</p>
                </div>
                <p className="text-zinc-500 text-xs sm:text-sm mb-4">
                  Get updates on new features and tips for better photos.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={status === 'loading' || status === 'success'}
                      className="flex-1 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <motion.button
                      type="submit"
                      disabled={status === 'loading' || status === 'success'}
                      className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                      whileHover={status === 'idle' || status === 'error' ? { scale: 1.02 } : {}}
                      whileTap={status === 'idle' || status === 'error' ? { scale: 0.98 } : {}}
                    >
                      {status === 'loading' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : status === 'success' ? (
                        <>
                          <Check className="w-4 h-4" />
                          Subscribed
                        </>
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Status message */}
                  <AnimatePresence mode="wait">
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex items-center gap-2 text-xs ${
                          status === 'success'
                            ? 'text-green-600 dark:text-green-400'
                            : status === 'error'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {status === 'success' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : status === 'error' ? (
                          <AlertCircle className="w-3.5 h-3.5" />
                        ) : null}
                        {message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>

            {/* Links sections */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-8">
              {Object.values(footerLinks).map((group) => (
                <div key={group.title}>
                  <h4 className="font-semibold text-xs uppercase tracking-widest text-zinc-500 mb-4 sm:mb-5">
                    {group.title}
                  </h4>
                  <ul className="space-y-3">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm inline-flex items-center group"
                        >
                          <span className="relative">
                            {link.label}
                            <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-zinc-900 dark:bg-white transition-all group-hover:w-full" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Social & CTA section */}
            <div className="lg:col-span-3 space-y-6">
              {/* Quick CTA card */}
              <motion.div
                className="p-5 rounded-2xl bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
                whileHover={{ borderColor: 'rgb(161 161 170)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white dark:text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-zinc-900 dark:text-white">Ready to start?</p>
                    <p className="text-xs text-zinc-500">It's free, no signup</p>
                  </div>
                </div>
                <Link href="/app">
                  <motion.button
                    className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl font-medium text-sm transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Open Editor
                  </motion.button>
                </Link>
              </motion.div>

              {/* Social links */}
              <div>
                <p className="font-semibold text-xs uppercase tracking-widest text-zinc-500 mb-4">
                  Follow Us
                </p>
                <div className="flex gap-2">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-white transition-all ${social.color}`}
                      aria-label={social.label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-zinc-500 text-xs sm:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} SnapBeautify. All rights reserved.
            </p>

            {/* Made with love */}
            <motion.div
              className="flex items-center gap-1.5 text-zinc-500 text-xs sm:text-sm"
              whileHover={{ scale: 1.05 }}
            >
              Made with
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              </motion.span>
              in India
            </motion.div>

            {/* Back to top - desktop only */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hidden sm:flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-xs sm:text-sm transition-colors"
              whileHover={{ y: -2 }}
            >
              Back to top
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↑
              </motion.span>
            </motion.button>
          </div>
        </div>
      </Container>
    </footer>
  )
}
