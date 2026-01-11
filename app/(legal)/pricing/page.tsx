'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Check,
  X,
  Zap,
  Crown,
  Gem,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  CreditCard,
  RefreshCcw,
  Star,
  Gift,
  Infinity,
  HelpCircle,
  ChevronDown,
  Smartphone,
  Globe,
  Clock,
  Users,
  Image,
  Layers,
  Wand2,
  Download,
  Palette,
  Scissors
} from 'lucide-react'
import { cn } from '@/lib/utils'

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    icon: Gift,
    price: '0',
    period: 'forever',
    description: 'Get started with basic features',
    color: 'from-zinc-500 to-zinc-600',
    features: [
      { text: 'Basic image enhancements', included: true },
      { text: 'Standard filters', included: true },
      { text: 'JPG & PNG export', included: true },
      { text: 'Small watermark on exports', included: true },
      { text: 'AI Background Removal', included: false },
      { text: 'Batch processing', included: false },
      { text: 'Priority support', included: false },
    ],
    ctaText: 'Start Free',
    ctaLink: '/app',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    icon: Zap,
    price: '199',
    period: '/month',
    description: 'Perfect for trying premium',
    color: 'from-blue-500 to-cyan-500',
    features: [
      { text: 'All premium features', included: true },
      { text: 'AI Background Removal', included: true },
      { text: 'Unlimited exports', included: true },
      { text: 'No watermarks', included: true },
      { text: 'All export formats', included: true },
      { text: 'Email support', included: true },
      { text: 'Early access to features', included: false },
    ],
    ctaText: 'Start Monthly',
    ctaLink: '/app',
  },
  {
    id: 'annual',
    name: 'Annual',
    icon: Crown,
    price: '1,499',
    originalPrice: '2,388',
    period: '/year',
    description: 'Best for regular creators',
    color: 'from-violet-500 to-purple-500',
    isPopular: true,
    savings: '37',
    features: [
      { text: 'All premium features', included: true },
      { text: 'AI Background Removal', included: true },
      { text: 'Unlimited exports', included: true },
      { text: 'No watermarks', included: true },
      { text: 'Priority support', included: true },
      { text: 'Early access to features', included: true },
      { text: 'All future updates', included: true },
    ],
    ctaText: 'Get Annual Plan',
    ctaLink: '/app',
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    icon: Gem,
    price: '2,999',
    period: 'one-time',
    description: 'Pay once, own forever',
    color: 'from-amber-500 to-orange-500',
    features: [
      { text: 'All premium features', included: true },
      { text: 'AI Background Removal', included: true },
      { text: 'Unlimited exports', included: true },
      { text: 'No watermarks', included: true },
      { text: 'Priority support', included: true },
      { text: 'Lifetime updates', included: true },
      { text: 'No recurring fees ever', included: true },
    ],
    ctaText: 'Get Lifetime Access',
    ctaLink: '/app',
  },
]

const featureComparison = [
  {
    category: 'Core Features',
    features: [
      { name: 'Basic Enhancements', free: true, monthly: true, annual: true, lifetime: true },
      { name: 'Standard Filters', free: true, monthly: true, annual: true, lifetime: true },
      { name: 'AI Background Removal', free: false, monthly: true, annual: true, lifetime: true },
      { name: 'Advanced Retouching', free: false, monthly: true, annual: true, lifetime: true },
      { name: 'Batch Processing', free: false, monthly: true, annual: true, lifetime: true },
      { name: 'Shadow Detection', free: false, monthly: true, annual: true, lifetime: true },
    ],
  },
  {
    category: 'Export Options',
    features: [
      { name: 'JPG Export', free: true, monthly: true, annual: true, lifetime: true },
      { name: 'PNG Export', free: true, monthly: true, annual: true, lifetime: true },
      { name: 'WebP Export', free: false, monthly: true, annual: true, lifetime: true },
      { name: 'High Resolution', free: false, monthly: true, annual: true, lifetime: true },
      { name: 'No Watermark', free: false, monthly: true, annual: true, lifetime: true },
    ],
  },
  {
    category: 'Support & Updates',
    features: [
      { name: 'Email Support', free: false, monthly: true, annual: true, lifetime: true },
      { name: 'Priority Support', free: false, monthly: false, annual: true, lifetime: true },
      { name: 'Early Access', free: false, monthly: false, annual: true, lifetime: true },
      { name: 'Future Updates', free: 'Basic', monthly: 'During subscription', annual: 'During subscription', lifetime: 'Lifetime' },
    ],
  },
]

const faqs = [
  {
    question: 'Can I try before I buy?',
    answer: 'Absolutely! Our free tier gives you access to basic features forever. Try it out and upgrade when you\'re ready for premium features.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, Rupay), Net Banking, and popular wallets through Razorpay.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Yes, you can cancel anytime from your account settings. You\'ll retain access until your current billing period ends. No questions asked.',
  },
  {
    question: 'What\'s your refund policy?',
    answer: 'We offer a 7-day money-back guarantee for Monthly plans, 30 days for Annual (pro-rata after 14 days), and 14 days for Lifetime purchases.',
  },
  {
    question: 'Is the Lifetime plan really lifetime?',
    answer: 'Yes! Pay once and get access forever. This includes all current features and future updates for as long as SnapBeautify exists.',
  },
  {
    question: 'Are my images uploaded to your servers?',
    answer: 'Never. All processing happens locally in your browser. Your images stay on your device at all times. We take your privacy seriously.',
  },
]

const stats = [
  { value: '50,000+', label: 'Happy Users' },
  { value: '10M+', label: 'Images Enhanced' },
  { value: '4.9/5', label: 'User Rating' },
  { value: '24/7', label: 'Support' },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors" />
            <span className="text-sm text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors">
              Back to Home
            </span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white dark:text-black" />
            </div>
            <span className="font-bold text-black dark:text-white">SnapBeautify</span>
          </Link>

          <Link
            href="/app"
            className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Open Editor
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50 to-white dark:from-violet-950/20 dark:to-black" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Simple, Transparent Pricing
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Choose Your Plan
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Start free and upgrade when you need more. No hidden fees, cancel anytime.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 sm:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-black dark:text-white">{stat.value}</p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon
              const isPopular = plan.isPopular

              return (
                <motion.div
                  key={plan.id}
                  className={cn(
                    'relative rounded-2xl p-6 transition-all',
                    isPopular
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-2xl shadow-violet-500/20 scale-105 z-10'
                      : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl'
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br', plan.color)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={cn('font-bold', isPopular ? 'text-white dark:text-black' : 'text-black dark:text-white')}>
                        {plan.name}
                      </h3>
                      <p className={cn('text-xs', isPopular ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500')}>
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className={cn('text-4xl font-bold', isPopular ? 'text-white dark:text-black' : 'text-black dark:text-white')}>
                        ₹{plan.price}
                      </span>
                      <span className={cn('text-sm', isPopular ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500')}>
                        {plan.period}
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <p className="text-sm text-zinc-500 line-through">₹{plan.originalPrice}/year</p>
                    )}
                    {plan.savings && (
                      <span className="text-xs font-bold text-green-500">Save {plan.savings}%</span>
                    )}
                  </div>

                  {/* CTA */}
                  <Link href={plan.ctaLink} className="block mb-6">
                    <motion.button
                      className={cn(
                        'w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all',
                        isPopular
                          ? 'bg-white dark:bg-black text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                          : 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {plan.ctaText}
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                        )}
                        <span className={cn(
                          'text-sm',
                          feature.included
                            ? isPopular ? 'text-zinc-200 dark:text-zinc-700' : 'text-zinc-600 dark:text-zinc-400'
                            : 'text-zinc-400 line-through'
                        )}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.id === 'lifetime' && (
                    <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2">
                        <Infinity className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                          Lifetime access, no recurring fees
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-4">
              Compare Plans
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              See what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left py-4 px-4 font-semibold text-black dark:text-white">Features</th>
                  <th className="text-center py-4 px-4 font-semibold text-zinc-500">Free</th>
                  <th className="text-center py-4 px-4 font-semibold text-blue-500">Monthly</th>
                  <th className="text-center py-4 px-4 font-semibold text-violet-500">Annual</th>
                  <th className="text-center py-4 px-4 font-semibold text-amber-500">Lifetime</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((category, catIndex) => (
                  <>
                    <tr key={`cat-${catIndex}`} className="bg-zinc-100 dark:bg-zinc-900">
                      <td colSpan={5} className="py-3 px-4 font-semibold text-sm text-black dark:text-white">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature, featIndex) => (
                      <tr key={`feat-${catIndex}-${featIndex}`} className="border-b border-zinc-100 dark:border-zinc-900">
                        <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{feature.name}</td>
                        <td className="py-3 px-4 text-center">
                          {typeof feature.free === 'boolean' ? (
                            feature.free ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-zinc-300 dark:text-zinc-700 mx-auto" />
                          ) : (
                            <span className="text-xs text-zinc-500">{feature.free}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {typeof feature.monthly === 'boolean' ? (
                            feature.monthly ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-zinc-300 dark:text-zinc-700 mx-auto" />
                          ) : (
                            <span className="text-xs text-zinc-500">{feature.monthly}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {typeof feature.annual === 'boolean' ? (
                            feature.annual ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-zinc-300 dark:text-zinc-700 mx-auto" />
                          ) : (
                            <span className="text-xs text-zinc-500">{feature.annual}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {typeof feature.lifetime === 'boolean' ? (
                            feature.lifetime ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-zinc-300 dark:text-zinc-700 mx-auto" />
                          ) : (
                            <span className="text-xs text-zinc-500">{feature.lifetime}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-4">
              Our Guarantees
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              className="text-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900"
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-black dark:text-white mb-2">Money-Back Guarantee</h3>
              <p className="text-sm text-zinc-500">7-day refund for monthly, 30-day for annual. No questions asked.</p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900"
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-black dark:text-white mb-2">Secure Payment</h3>
              <p className="text-sm text-zinc-500">Payments are secured by Razorpay with bank-level encryption.</p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900"
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
                <RefreshCcw className="w-7 h-7 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-bold text-black dark:text-white mb-2">Cancel Anytime</h3>
              <p className="text-sm text-zinc-500">No lock-in contracts. Cancel your subscription anytime you want.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-black dark:text-white">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-zinc-500 transition-transform',
                      openFaq === index && 'rotate-180'
                    )}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            className="p-8 sm:p-12 rounded-3xl bg-black dark:bg-white text-white dark:text-black"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to transform your photos?
            </h2>
            <p className="text-zinc-400 dark:text-zinc-600 mb-8 max-w-xl mx-auto">
              Join thousands of creators who trust SnapBeautify for their image editing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app">
                <motion.button
                  className="px-8 py-4 rounded-xl bg-white dark:bg-black text-black dark:text-white font-semibold flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Free Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
            <p className="text-zinc-500 text-sm mt-4">No credit card required</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">© {new Date().getFullYear()} SnapBeautify. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm text-zinc-500 hover:text-black dark:hover:text-white">Terms</Link>
            <Link href="/privacy" className="text-sm text-zinc-500 hover:text-black dark:hover:text-white">Privacy</Link>
            <Link href="/refund" className="text-sm text-zinc-500 hover:text-black dark:hover:text-white">Refund</Link>
            <Link href="/contact" className="text-sm text-zinc-500 hover:text-black dark:hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
