'use client'

import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, AlertCircle, Scale, Globe, Shield, CreditCard, Users, Ban, Edit3, Gavel, ArrowRight } from 'lucide-react';

const sections = [
  {
    icon: CheckCircle2,
    title: 'Acceptance of Terms',
    content: 'By accessing and using SnapBeautify ("the Service"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Service.',
  },
  {
    icon: Globe,
    title: 'Description of Service',
    content: 'SnapBeautify is a web-based image beautification and screenshot enhancement tool that allows users to create professional-looking images with backgrounds, frames, and text overlays. The Service is provided on both free and premium subscription tiers.',
  },
  {
    icon: Users,
    title: 'User Accounts',
    content: 'To access certain features, you must create an account.',
    list: [
      'Maintaining the confidentiality of your account credentials',
      'All activities that occur under your account',
      'Notifying us immediately of any unauthorized use',
    ],
  },
  {
    icon: CreditCard,
    title: 'Subscription and Payments',
    content: 'Premium features require a paid subscription. By subscribing, you agree to:',
    list: [
      'Pay all applicable fees as per the chosen plan',
      'Automatic renewal of subscriptions unless cancelled',
      'Receive pre-debit notifications before recurring charges',
    ],
    note: 'Payments are processed securely through Razorpay. All prices are in Indian Rupees (INR) and inclusive of applicable taxes.',
  },
  {
    icon: Shield,
    title: 'Intellectual Property',
    content: 'The Service and its original content, features, and functionality are owned by SnapBeautify and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of images you upload and create using our Service.',
  },
  {
    icon: Ban,
    title: 'Acceptable Use',
    content: 'You agree not to use the Service to:',
    list: [
      'Upload or create illegal, harmful, or offensive content',
      'Infringe on intellectual property rights of others',
      'Attempt to gain unauthorized access to the Service',
      'Use the Service for any unlawful purpose',
    ],
  },
  {
    icon: AlertCircle,
    title: 'Limitation of Liability',
    content: 'SnapBeautify shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. Our total liability shall not exceed the amount paid by you for the Service in the past 12 months.',
  },
  {
    icon: Edit3,
    title: 'Modifications to Service',
    content: 'We reserve the right to modify or discontinue the Service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.',
  },
  {
    icon: Gavel,
    title: 'Governing Law',
    content: 'These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.',
  },
];

export default function TermsPage() {
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
            <FileText className="w-10 h-10 text-white dark:text-black" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            Last updated: January 2025
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              {...(index < 3
                ? { animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 + index * 0.1 } }
                : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' }, transition: { duration: 0.5, delay: index * 0.05 } }
              )}
              whileHover={{ y: -2 }}
              className="group relative bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex gap-4">
                <motion.div
                  className="flex-shrink-0 w-12 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <section.icon className="w-6 h-6 text-white dark:text-black" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                    <span className="text-zinc-400 dark:text-zinc-600 text-sm font-normal">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {section.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {section.content}
                  </p>
                  {section.list && (
                    <ul className="mt-4 space-y-2">
                      {section.list.map((item, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * i }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                  {section.note && (
                    <div className="mt-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{section.note}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          className="mt-12 p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Questions about our Terms?</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">We&apos;re here to help clarify anything.</p>
            <motion.a
              href="mailto:support@snapbeautify.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
