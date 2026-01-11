'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Clock, CreditCard, HelpCircle, MapPin, ChevronRight, Zap, Shield, RefreshCcw, ArrowRight } from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: 'General Support',
    description: 'For inquiries, feedback, or technical help',
    contact: 'support@snapbeautify.com',
    response: '24-48 hours',
  },
  {
    icon: CreditCard,
    title: 'Billing & Payments',
    description: 'Subscription, refunds, or payment queries',
    contact: 'billing@snapbeautify.com',
    response: '24 hours',
  },
];

const faqs = [
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel from your account settings or by emailing us. Access continues until the billing period ends.',
    icon: RefreshCcw,
  },
  {
    question: 'How do I request a refund?',
    answer: 'Email support@snapbeautify.com with your payment details. See our Refund Policy for eligibility.',
    icon: CreditCard,
    link: '/refund',
  },
  {
    question: 'Are my images stored on your servers?',
    answer: 'No. All image processing happens in your browser. We never upload, store, or access your images.',
    icon: Shield,
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept UPI, Credit/Debit Cards, Net Banking, and popular wallets through Razorpay.',
    icon: CreditCard,
  },
];

const responseTimes = [
  { type: 'General inquiries', time: '24-48 hours' },
  { type: 'Technical support', time: '24-48 hours' },
  { type: 'Billing issues', time: '24 hours' },
  { type: 'Urgent matters', time: 'Priority handling' },
];

const quickLinks = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Refund Policy', href: '/refund' },
  { label: 'Delivery Policy', href: '/shipping' },
];

export default function ContactPage() {
  return (
    <div className="relative py-12 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black dark:bg-white mb-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <MessageCircle className="w-10 h-10 text-white dark:text-black" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            We&apos;re here to help! Reach out with any questions, concerns, or feedback about SnapBeautify.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {contactMethods.map((method, index) => (
            <motion.a
              key={index}
              href={`mailto:${method.contact}`}
              className="group relative p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl transition-all overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <motion.div
                className="w-14 h-14 rounded-xl bg-black dark:bg-white flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <method.icon className="w-7 h-7 text-white dark:text-black" />
              </motion.div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">{method.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">{method.description}</p>
              <p className="text-black dark:text-white font-medium mb-2">{method.contact}</p>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                <Clock className="w-3 h-3" />
                Response: {method.response}
              </div>
              <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
            </motion.a>
          ))}
        </motion.div>

        {/* Quick Response Banner */}
        <motion.div
          className="mb-12 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 text-center">
            <motion.div
              className="w-12 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Zap className="w-6 h-6 text-white dark:text-black" />
            </motion.div>
            <div>
              <p className="text-black dark:text-white font-medium">Quick Tip</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                For urgent matters, add <span className="text-black dark:text-white font-medium">&quot;URGENT&quot;</span> to your subject line
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <faq.icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black dark:text-white mb-2">{faq.question}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      {faq.answer}
                      {faq.link && (
                        <Link href={faq.link} className="text-black dark:text-white hover:underline ml-1 font-medium">
                          Learn more →
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Response Times */}
        <motion.div
          className="mb-12 p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-lg bg-black dark:bg-white flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <Clock className="w-5 h-5 text-white dark:text-black" />
            </motion.div>
            Response Times
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {responseTimes.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-zinc-600 dark:text-zinc-400">{item.type}</span>
                <span className="text-black dark:text-white font-medium px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-700 text-sm">
                  {item.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Business Address */}
        <motion.div
          className="mb-12 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-start gap-4">
            <motion.div
              className="w-12 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <MapPin className="w-6 h-6 text-white dark:text-black" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-black dark:text-white mb-2">Business Address</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                SnapBeautify<br />
                Bangalore, Karnataka<br />
                India
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="mb-12 p-8 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-semibold text-black dark:text-white mb-4 text-center">Quick Links</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map((link, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={link.href}
                  className="px-4 py-2 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-black dark:bg-white mx-auto mb-4 flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <HelpCircle className="w-8 h-8 text-white dark:text-black" />
            </motion.div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Still Have Questions?</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">We&apos;d love to hear from you</p>
            <motion.a
              href="mailto:support@snapbeautify.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mail className="w-4 h-4" />
              Send us an Email
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
