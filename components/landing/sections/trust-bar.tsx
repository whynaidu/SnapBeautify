'use client'

import { Container } from '../layout/container'
import { FadeIn } from '../animations/fade-in'
import { CreditCard, Smartphone, Building2 } from 'lucide-react'

const paymentMethods = [
  { name: 'UPI', icon: Smartphone },
  { name: 'Cards', icon: CreditCard },
  { name: 'Net Banking', icon: Building2 },
]

const trustBadges = [
  { text: '100% Browser-Based' },
  { text: 'No Data Collection' },
  { text: 'Secure Payments' },
]

export function TrustBar() {
  return (
    <section className="py-4 sm:py-6 border-y border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950">
      <Container>
        <FadeIn>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              {trustBadges.map((badge, index) => (
                <span
                  key={index}
                  className="text-[10px] sm:text-xs text-zinc-500 font-medium uppercase tracking-wider"
                >
                  {badge.text}
                </span>
              ))}
            </div>

            {/* Payment methods */}
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-600 uppercase tracking-wider">
                Payments via
              </span>
              <div className="flex items-center gap-2 sm:gap-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="flex items-center gap-1 sm:gap-1.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    <method.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-[10px] sm:text-xs font-medium">{method.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
