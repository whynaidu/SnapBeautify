'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950',
        'transition-all duration-300',
        'hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900',
        className
      )}
    >
      <div className="space-y-4">
        {/* Icon container */}
        <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
          <Icon className="w-5 h-5 text-black dark:text-white" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {title}
        </h3>

        {/* Description */}
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </div>
  )
}
