'use client'

import { Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TestimonialCardProps {
  name: string
  role: string
  quote: string
  rating?: number
  className?: string
}

export function TestimonialCard({
  name,
  role,
  quote,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        'h-full p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900',
        'transition-all duration-300',
        'hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
        className
      )}
    >
      <div className="space-y-4">
        {/* Quote icon */}
        <Quote className="w-6 h-6 text-zinc-300 dark:text-zinc-700" />

        {/* Quote text */}
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
          &ldquo;{quote}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="w-9 h-9 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-semibold text-sm">
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-black dark:text-white text-sm">
              {name}
            </p>
            <p className="text-zinc-500 text-xs">{role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
