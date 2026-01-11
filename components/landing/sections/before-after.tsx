'use client'

import { useState } from 'react'
import { Section } from '../layout/section'
import { Badge } from '../shared/badge'
import { ComparisonSlider } from '../shared/comparison-slider'
import { FadeIn } from '../animations/fade-in'
import { cn } from '@/lib/utils'

const examples = [
  {
    id: 'product',
    label: 'Product',
    before:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=500&fit=crop&q=60',
    after:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=500&fit=crop&q=95&sat=30&con=15',
  },
  {
    id: 'portrait',
    label: 'Portrait',
    before:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=500&fit=crop&q=60',
    after:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=500&fit=crop&q=95&sat=20&con=10',
  },
  {
    id: 'landscape',
    label: 'Landscape',
    before:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&q=60',
    after:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&q=95&sat=40&con=20',
  },
]

export function BeforeAfterSection() {
  const [activeExample, setActiveExample] = useState(examples[0])

  return (
    <Section background="muted">
      {/* Section Header */}
      <div className="text-center mb-12">
        <FadeIn>
          <Badge variant="default" className="mb-4">
            See The Difference
          </Badge>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4">
            Real Results, <span className="text-zinc-500">Real Magic</span>
          </h2>
        </FadeIn>
      </div>

      {/* Category Tabs */}
      <FadeIn delay={0.2}>
        <div className="flex justify-center gap-2 mb-8">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => setActiveExample(example)}
              className={cn(
                'px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                activeExample.id === example.id
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
              )}
            >
              {example.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Comparison Slider */}
      <FadeIn delay={0.3}>
        <div className="max-w-4xl mx-auto">
          <ComparisonSlider
            beforeImage={activeExample.before}
            afterImage={activeExample.after}
            className="aspect-[16/10]"
          />
        </div>
      </FadeIn>
    </Section>
  )
}
