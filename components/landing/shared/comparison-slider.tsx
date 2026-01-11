'use client'

import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from 'react-compare-slider'
import { cn } from '@/lib/utils'

interface ComparisonSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

export function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
}: ComparisonSliderProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800',
        className
      )}
    >
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage}
            alt={beforeLabel}
            style={{ objectFit: 'cover' }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterImage}
            alt={afterLabel}
            style={{ objectFit: 'cover' }}
          />
        }
        handle={
          <ReactCompareSliderHandle
            buttonStyle={{
              backdropFilter: 'blur(8px)',
              backgroundColor: '#ffffff',
              border: '2px solid #ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              color: '#000000',
              width: 48,
              height: 48,
            }}
            linesStyle={{
              width: 2,
              background: '#ffffff',
            }}
          />
        }
        style={{ height: '100%' }}
      />

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-600 dark:text-zinc-400 text-sm font-medium border border-zinc-200 dark:border-zinc-800">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium">
        {afterLabel}
      </div>
    </div>
  )
}
