'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PricingCardProps {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  isPopular?: boolean
  ctaText: string
  onSelect?: () => void
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  isPopular = false,
  ctaText,
  onSelect,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl p-6 transition-all duration-300',
        isPopular
          ? 'border-2 border-black dark:border-white bg-zinc-100 dark:bg-zinc-900'
          : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
      )}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-medium">
          Most Popular
        </div>
      )}

      {/* Plan name */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
          {name}
        </h3>
        <p className="text-zinc-500 text-sm">
          {description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-black dark:text-white">
          {price}
        </span>
        <span className="text-zinc-500 ml-2">
          {period}
        </span>
      </div>

      {/* CTA Button */}
      <Button
        variant={isPopular ? 'default' : 'outline'}
        size="lg"
        className={cn(
          'w-full mb-6',
          isPopular
            ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200'
            : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white'
        )}
        onClick={onSelect}
      >
        {ctaText}
      </Button>

      {/* Features list */}
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mt-0.5 flex-shrink-0" />
            <span className="text-zinc-600 dark:text-zinc-400 text-sm">
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
