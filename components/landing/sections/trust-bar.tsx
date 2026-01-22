'use client'

import { Container } from '../layout/container'
import {
  Shield,
  Eye,
  Lock,
  MonitorSmartphone,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

const trustBadges = [
  {
    icon: MonitorSmartphone,
    text: '100% Browser-Based',
    description: 'No downloads needed',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Eye,
    text: 'No Data Collection',
    description: 'Your privacy matters',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Lock,
    text: 'Secure Payments',
    description: 'Powered by Razorpay',
    color: 'from-emerald-500 to-green-500',
  },
]

const paymentMethods = [
  { name: 'UPI', icon: Smartphone, label: 'Google Pay, PhonePe' },
  { name: 'Cards', icon: CreditCard, label: 'Visa, Mastercard' },
  { name: 'NetBanking', icon: Building2, label: 'All major banks' },
]

export function TrustBar() {
  return (
    <section className="relative py-8 sm:py-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

      <Container className="relative z-10">
        <div className="flex flex-col gap-8">
          {/* Trust badges - main row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {trustBadges.map((badge) => {
              const Icon = badge.icon
              return (
                <div
                  key={badge.text}
                  className="group relative"
                >
                  <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                    {/* Icon with gradient background */}
                    <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-white">
                          {badge.text}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white dark:bg-zinc-900 text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                Secure Payment Options
              </span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.name}
                  className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/50 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                      {method.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5 truncate">
                      {method.label}
                    </p>
                  </div>
                </div>
              )
            })}

            {/* Razorpay badge - same style as other pills */}
            <div
              className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/50 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                  Razorpay
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5 truncate">
                  Secure payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
