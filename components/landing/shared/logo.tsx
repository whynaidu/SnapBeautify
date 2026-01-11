'use client'

import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-xl bg-black dark:bg-white flex items-center justify-center',
          sizes[size]
        )}
      >
        <Sparkles className={cn('text-white dark:text-black', iconSizes[size])} />
      </div>
      {showText && (
        <span
          className={cn(
            'font-bold text-black dark:text-white',
            textSizes[size]
          )}
        >
          SnapBeautify
        </span>
      )}
    </div>
  )
}
