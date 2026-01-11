'use client'

import { motion } from 'framer-motion'
import { Section } from '../layout/section'
import { Badge } from '../shared/badge'
import { FadeIn } from '../animations/fade-in'
import { Star, Quote, MessageSquare } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'E-commerce Seller',
    avatar: 'PS',
    rating: 5,
    quote: 'I used to spend hours editing product photos. Now it takes seconds. My listings look so much more professional!',
  },
  {
    name: 'Rahul Verma',
    role: 'Content Creator',
    avatar: 'RV',
    rating: 5,
    quote: 'The background removal is magic! My Instagram posts have never looked better. Worth every rupee.',
  },
  {
    name: 'Anita Desai',
    role: 'Small Business Owner',
    avatar: 'AD',
    rating: 5,
    quote: 'Saved me thousands on professional photography. This tool pays for itself in the first week!',
  },
  {
    name: 'Vikram Patel',
    role: 'Photographer',
    avatar: 'VP',
    rating: 5,
    quote: 'The batch processing feature is a game-changer. I can edit hundreds of photos in minutes.',
  },
  {
    name: 'Sneha Gupta',
    role: 'Social Media Manager',
    avatar: 'SG',
    rating: 5,
    quote: 'Finally, a tool that respects my privacy. Love that everything stays on my device.',
  },
  {
    name: 'Arjun Singh',
    role: 'Freelance Designer',
    avatar: 'AS',
    rating: 5,
    quote: 'Simple, fast, and the results are incredible. I recommend it to all my clients.',
  },
  {
    name: 'Meera Krishnan',
    role: 'Marketing Lead',
    avatar: 'MK',
    rating: 5,
    quote: 'Our team productivity increased 3x. The AI enhancement is surprisingly accurate.',
  },
  {
    name: 'Karthik Rajan',
    role: 'Startup Founder',
    avatar: 'KR',
    rating: 5,
    quote: 'We switched from expensive software to SnapBeautify. Best decision for our startup.',
  },
]

// Split testimonials into two rows
const row1 = testimonials.slice(0, 4)
const row2 = testimonials.slice(4, 8)

interface TestimonialCardProps {
  name: string
  role: string
  avatar: string
  rating: number
  quote: string
}

function TestimonialCard({ name, role, avatar, rating, quote }: TestimonialCardProps) {
  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[350px] md:w-[400px] mx-2 sm:mx-3">
      <div className="h-full p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
        {/* Quote icon */}
        <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-200 dark:text-zinc-800 mb-3 sm:mb-4" />

        {/* Quote text */}
        <p className="text-zinc-700 dark:text-zinc-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
          "{quote}"
        </p>

        {/* Rating */}
        <div className="flex gap-1 mb-3 sm:mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-semibold text-xs sm:text-sm">
            {avatar}
          </div>
          <div>
            <p className="font-semibold text-black dark:text-white text-xs sm:text-sm">
              {name}
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-xs">
              {role}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({ testimonials, direction = 'left', speed = 30 }: { testimonials: TestimonialCardProps[], direction?: 'left' | 'right', speed?: number }) {
  // Duplicate testimonials for seamless loop
  const duplicated = [...testimonials, ...testimonials, ...testimonials]

  return (
    <div className="relative overflow-hidden py-2">
      <motion.div
        className="flex"
        animate={{
          x: direction === 'left' ? ['0%', '-33.33%'] : ['-33.33%', '0%'],
        }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {duplicated.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </motion.div>
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <Section className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      </div>

      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
        <FadeIn>
          <Badge variant="default" className="mb-4">
            <MessageSquare className="w-3 h-3 mr-2" />
            Testimonials
          </Badge>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-3 sm:mb-4">
            Loved by <span className="text-zinc-500">Thousands</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Join creators, businesses, and photographers who trust SnapBeautify.
          </p>
        </FadeIn>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Left fade gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 md:w-64 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none" />

        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 md:w-64 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none" />

        {/* Scrolling rows */}
        <div className="space-y-4">
          <MarqueeRow testimonials={row1} direction="left" speed={35} />
          <MarqueeRow testimonials={row2} direction="right" speed={40} />
        </div>
      </div>

      {/* Stats bar */}
      <FadeIn delay={0.4}>
        <div className="mt-10 sm:mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-16 px-4 sm:px-0">
          <div className="text-center">
            <motion.div
              className="text-2xl sm:text-3xl md:text-5xl font-bold text-black dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              10K+
            </motion.div>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">Happy Users</p>
          </div>
          <div className="h-8 sm:h-12 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
          <div className="text-center">
            <motion.div
              className="text-2xl sm:text-3xl md:text-5xl font-bold text-black dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              500K+
            </motion.div>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">Photos Enhanced</p>
          </div>
          <div className="h-8 sm:h-12 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
          <div className="text-center">
            <motion.div
              className="text-2xl sm:text-3xl md:text-5xl font-bold text-black dark:text-white flex items-center justify-center gap-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              4.9
              <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-yellow-400 text-yellow-400" />
            </motion.div>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">Rating</p>
          </div>
        </div>
      </FadeIn>
    </Section>
  )
}
