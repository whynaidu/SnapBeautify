'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Section } from '../layout/section'
import { Badge } from '../shared/badge'
import { FadeIn } from '../animations/fade-in'
import {
  Check,
  X,
  Zap,
  Crown,
  Gem,
  ArrowRight,
  Sparkles,
  Shield,
  CreditCard,
  RefreshCcw,
  Star,
  Infinity
} from 'lucide-react'
import { cn } from '@/lib/utils'

const pricingPlans = [
  {
    id: 'monthly',
    name: 'Monthly',
    icon: Zap,
    price: '199',
    originalPrice: null,
    period: '/month',
    description: 'Perfect for trying premium',
    highlight: 'Flexible',
    color: 'from-blue-500 to-cyan-500',
    features: [
      { text: 'All premium features', included: true },
      { text: 'Unlimited exports', included: true },
      { text: 'No watermarks', included: true },
      { text: 'Email support', included: true },
      { text: 'Priority support', included: false },
      { text: 'Early access', included: false },
    ],
    isPopular: false,
    ctaText: 'Start Monthly',
    savings: null,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    icon: Crown,
    price: '1,499',
    originalPrice: '2,388',
    period: '/year',
    description: 'Best for regular creators',
    highlight: 'Most Popular',
    color: 'from-violet-500 to-purple-500',
    features: [
      { text: 'All premium features', included: true },
      { text: 'Unlimited exports', included: true },
      { text: 'No watermarks', included: true },
      { text: 'Priority support', included: true },
      { text: 'Early access to features', included: true },
      { text: 'All future updates', included: true },
    ],
    isPopular: true,
    ctaText: 'Get Yearly Plan',
    savings: '37',
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    icon: Gem,
    price: '2,999',
    originalPrice: null,
    period: 'one-time',
    description: 'Pay once, own forever',
    highlight: 'Best Deal',
    color: 'from-amber-500 to-orange-500',
    features: [
      { text: 'All premium features', included: true },
      { text: 'Unlimited exports', included: true },
      { text: 'No watermarks', included: true },
      { text: 'Priority support', included: true },
      { text: 'Lifetime updates', included: true },
      { text: 'No recurring fees', included: true },
    ],
    isPopular: false,
    ctaText: 'Get Lifetime Access',
    savings: null,
  },
]

const guarantees = [
  { icon: Shield, title: '7-Day Refund', description: 'No questions asked' },
  { icon: CreditCard, title: 'Secure Payment', description: 'Powered by Razorpay' },
  { icon: RefreshCcw, title: 'Cancel Anytime', description: 'No lock-in period' },
]

export function PricingSection() {
  return (
    <Section id="pricing" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14 px-4 sm:px-0">
        <FadeIn>
          <Badge variant="default" className="mb-4">
            <Sparkles className="w-3 h-3 mr-2" />
            Simple Pricing
          </Badge>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-3 sm:mb-4">
            Start Free, <span className="text-zinc-400">Upgrade Anytime</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            No credit card required. Use free features forever or unlock everything with premium.
          </p>
        </FadeIn>
      </div>

      {/* Pricing Cards */}
      <FadeIn delay={0.3}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-4 sm:px-0">
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon
            const isPopular = plan.isPopular

            return (
              <motion.div
                key={plan.id}
                className={cn(
                  'relative',
                  isPopular && 'md:-mt-4 md:mb-4'
                )}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <motion.div
                      className={cn(
                        'px-4 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r',
                        plan.color
                      )}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="w-3 h-3 fill-white" />
                      {plan.highlight}
                    </motion.div>
                  </div>
                )}

                {/* Card */}
                <div
                  className={cn(
                    'relative h-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 transition-all duration-300 overflow-hidden',
                    isPopular
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-2xl shadow-violet-500/20'
                      : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl'
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br',
                            plan.color
                          )}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className={cn(
                            'text-lg font-bold',
                            isPopular ? 'text-white dark:text-black' : 'text-black dark:text-white'
                          )}>
                            {plan.name}
                          </h3>
                          <p className={cn(
                            'text-xs',
                            isPopular ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500'
                          )}>
                            {plan.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    {plan.savings && (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-500 text-white">
                        Save {plan.savings}%
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className={cn(
                        'text-4xl sm:text-5xl font-bold',
                        isPopular ? 'text-white dark:text-black' : 'text-black dark:text-white'
                      )}>
                        ₹{plan.price}
                      </span>
                      <span className={cn(
                        'text-sm',
                        isPopular ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500'
                      )}>
                        {plan.period}
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <p className={cn(
                        'text-sm line-through mt-1',
                        isPopular ? 'text-zinc-500' : 'text-zinc-400'
                      )}>
                        ₹{plan.originalPrice}/year
                      </p>
                    )}
                    {plan.id === 'yearly' && (
                      <p className={cn(
                        'text-xs mt-2',
                        isPopular ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500'
                      )}>
                        That's just ₹125/month
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link href="/app" className="block mb-6">
                    <motion.button
                      className={cn(
                        'w-full py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all',
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
                  <div className={cn(
                    'pt-6 border-t',
                    isPopular ? 'border-zinc-700 dark:border-zinc-300' : 'border-zinc-200 dark:border-zinc-800'
                  )}>
                    <p className={cn(
                      'text-xs font-semibold uppercase tracking-wider mb-4',
                      isPopular ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500'
                    )}>
                      What's included
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          {feature.included ? (
                            <div className={cn(
                              'w-5 h-5 rounded-full flex items-center justify-center',
                              isPopular ? 'bg-green-500/20' : 'bg-green-500/10'
                            )}>
                              <Check className="w-3 h-3 text-green-500" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-800">
                              <X className="w-3 h-3 text-zinc-400" />
                            </div>
                          )}
                          <span className={cn(
                            'text-sm',
                            feature.included
                              ? isPopular ? 'text-white dark:text-black' : 'text-zinc-700 dark:text-zinc-300'
                              : 'text-zinc-400 line-through'
                          )}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Lifetime badge */}
                  {plan.id === 'lifetime' && (
                    <div className="mt-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2">
                        <Infinity className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                          One payment, lifetime access. Never pay again.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </FadeIn>

      {/* Guarantees */}
      <FadeIn delay={0.4}>
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto px-4 sm:px-0">
          {guarantees.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-black dark:text-white">{item.title}</p>
                <p className="text-xs text-zinc-500">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </FadeIn>

      {/* View Full Pricing */}
      <FadeIn delay={0.5}>
        <div className="mt-8 text-center">
          <Link href="/pricing">
            <motion.button
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              whileHover={{ x: 5 }}
            >
              View full pricing details
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </FadeIn>
    </Section>
  )
}
