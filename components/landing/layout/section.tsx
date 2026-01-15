import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Container } from './container'

interface SectionProps {
  children: React.ReactNode
  className?: string
  containerSize?: 'default' | 'narrow' | 'wide'
  id?: string
  background?: 'default' | 'muted'
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section({
  children,
  className,
  containerSize = 'default',
  id,
  background = 'default',
}, ref) {
  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        'py-16 md:py-24 lg:py-32',
        {
          'bg-white dark:bg-black': background === 'default',
          'bg-zinc-50 dark:bg-zinc-950': background === 'muted',
        },
        className
      )}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  )
})
