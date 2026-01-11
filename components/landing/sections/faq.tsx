'use client'

import { useState } from 'react'
import { Section } from '../layout/section'
import { Badge } from '../shared/badge'
import { FadeIn } from '../animations/fade-in'
import { ChevronDown, HelpCircle, Plus, Minus, MessageCircleQuestion, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: 'Is SnapBeautify really free?',
    answer:
      'Yes! Our free tier lets you use basic features with a small watermark. Upgrade to premium to remove the watermark and unlock advanced features like AI background removal, batch processing, and more.',
    category: 'pricing',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No account needed to try! You can start editing immediately. Only create an account when you want to save preferences or purchase premium.',
    category: 'general',
  },
  {
    question: 'Are my images uploaded to your servers?',
    answer:
      'Never. All processing happens locally in your browser. Your images stay on your device at all times. We take your privacy seriously.',
    category: 'privacy',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      "We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, Rupay), Net Banking, and popular wallets through Razorpay — India's most trusted payment gateway.",
    category: 'pricing',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      "Absolutely. Cancel anytime from your account settings. You'll retain access until your current billing period ends. No questions asked.",
    category: 'pricing',
  },
  {
    question: "What's your refund policy?",
    answer:
      'We offer full refunds within 7 days for Monthly plans, 30 days for Annual (pro-rata after 14 days), and 14 days for Lifetime. No questions asked within the refund window.',
    category: 'pricing',
  },
  {
    question: 'Does it work on mobile?',
    answer:
      'Yes! SnapBeautify works on any device with a modern browser — desktop, tablet, or mobile. The interface adapts to your screen size for the best experience.',
    category: 'general',
  },
]

// Floating question marks animation
function FloatingQuestions() {
  const questions = [
    { x: '10%', y: '20%', size: 20, duration: 4, delay: 0 },
    { x: '85%', y: '15%', size: 16, duration: 5, delay: 0.5 },
    { x: '90%', y: '60%', size: 18, duration: 4.5, delay: 1 },
    { x: '5%', y: '70%', size: 14, duration: 5.5, delay: 1.5 },
    { x: '75%', y: '80%', size: 22, duration: 4, delay: 0.8 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {questions.map((q, i) => (
        <motion.div
          key={i}
          className="absolute text-zinc-300 dark:text-zinc-700"
          style={{ left: q.x, top: q.y }}
          animate={{
            y: [0, -15, 0],
            rotate: [-5, 5, -5],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: q.duration,
            repeat: Infinity,
            delay: q.delay,
            ease: 'easeInOut',
          }}
        >
          <HelpCircle style={{ width: q.size, height: q.size }} />
        </motion.div>
      ))}
    </div>
  )
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <motion.div
      className={cn(
        'group relative rounded-2xl overflow-hidden transition-all duration-300',
        isOpen
          ? 'bg-black dark:bg-white'
          : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: isOpen ? 0 : -2 }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left"
      >
        {/* Number indicator */}
        <div
          className={cn(
            'flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold transition-colors duration-300',
            isOpen
              ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
          )}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Question text */}
        <span
          className={cn(
            'flex-1 font-semibold text-sm sm:text-base transition-colors duration-300',
            isOpen ? 'text-white dark:text-black' : 'text-black dark:text-white'
          )}
        >
          {question}
        </span>

        {/* Toggle icon */}
        <motion.div
          className={cn(
            'flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors duration-300',
            isOpen
              ? 'bg-white/20 dark:bg-black/20'
              : 'bg-zinc-100 dark:bg-zinc-800'
          )}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <Minus
              className={cn(
                'w-3.5 h-3.5 sm:w-4 sm:h-4',
                isOpen ? 'text-white dark:text-black' : 'text-zinc-500'
              )}
            />
          ) : (
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
          )}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pl-[3.25rem] sm:pl-[4.5rem]">
              <p className="text-zinc-300 dark:text-zinc-600 leading-relaxed text-sm sm:text-base">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // Split FAQs into two columns
  const midPoint = Math.ceil(faqs.length / 2)
  const leftColumn = faqs.slice(0, midPoint)
  const rightColumn = faqs.slice(midPoint)

  return (
    <Section id="faq" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />

        {/* Decorative circles */}
        <motion.div
          className="absolute -top-32 -left-32 w-64 h-64 rounded-full border border-zinc-200 dark:border-zinc-800"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full border border-zinc-200 dark:border-zinc-800"
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Floating question marks */}
      <FloatingQuestions />

      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-16 px-4 sm:px-0">
        <FadeIn>
          <Badge variant="default" className="mb-4">
            <MessageCircleQuestion className="w-3 h-3 mr-2" />
            FAQ
          </Badge>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-3 sm:mb-4">
            Got <span className="text-zinc-500">Questions?</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Everything you need to know about SnapBeautify.
          </p>
        </FadeIn>
      </div>

      {/* Two-column FAQ layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 px-4 sm:px-0">
        {/* Left column */}
        <div className="space-y-3 sm:space-y-4">
          {leftColumn.map((faq, index) => (
            <AccordionItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-3 sm:space-y-4">
          {rightColumn.map((faq, index) => {
            const actualIndex = index + midPoint
            return (
              <AccordionItem
                key={actualIndex}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === actualIndex}
                onToggle={() =>
                  setOpenIndex(openIndex === actualIndex ? null : actualIndex)
                }
                index={actualIndex}
              />
            )
          })}
        </div>
      </div>

      {/* Contact CTA */}
      <FadeIn delay={0.4}>
        <motion.div
          className="mt-10 sm:mt-16 text-center px-4 sm:px-0"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="inline-flex flex-col items-center gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-sm sm:max-w-none sm:w-auto sm:flex-row sm:gap-4">
            <div className="w-12 h-12 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-white dark:text-black" />
              </motion.div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <p className="font-semibold text-base text-black dark:text-white">
                Still have questions?
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                We're here to help you
              </p>
            </div>
            <a
              href="/contact"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-90 transition-opacity text-center"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </FadeIn>
    </Section>
  )
}
