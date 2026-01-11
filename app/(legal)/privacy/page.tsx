'use client'

import { motion } from 'framer-motion';
import { Shield, User, Database, Share2, Lock, Cookie, UserCheck, Clock, Baby, Bell, Mail, ArrowRight, Check } from 'lucide-react';

const dataTypes = [
  {
    title: 'Personal Information',
    description: 'When you create an account or subscribe',
    items: ['Email address', 'Name (optional)', 'Payment info (via Razorpay)'],
    icon: User,
  },
  {
    title: 'Usage Data',
    description: 'Automatically collected',
    items: ['Browser type', 'Device info', 'IP address', 'Pages visited'],
    icon: Database,
  },
  {
    title: 'Images',
    description: 'Your privacy is protected',
    items: ['Processed in browser', 'NOT stored on servers', 'You retain full ownership'],
    icon: Shield,
  },
];

const sections = [
  {
    icon: Share2,
    title: 'Data Sharing',
    content: 'We do not sell your personal information. We may share data with:',
    list: [
      { label: 'Payment Processors', desc: 'Razorpay for secure transactions' },
      { label: 'Authentication', desc: 'For secure login (e.g., Google OAuth)' },
      { label: 'Analytics', desc: 'To understand usage patterns' },
      { label: 'Legal Requirements', desc: 'When required by law' },
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: 'We implement robust security measures:',
    list: [
      { label: 'SSL/TLS Encryption', desc: 'For all data transmission' },
      { label: 'Secure Auth', desc: 'Industry-standard authentication' },
      { label: 'Regular Audits', desc: 'Security assessments' },
      { label: 'Limited Access', desc: 'Strict data access controls' },
    ],
  },
  {
    icon: Cookie,
    title: 'Cookies & Tracking',
    content: 'We use cookies to:',
    simpleList: ['Keep you signed in', 'Remember preferences', 'Analyze site traffic'],
    note: 'You can control cookies through your browser settings.',
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: 'You have the right to:',
    simpleList: [
      'Access your personal data',
      'Correct inaccurate data',
      'Request data deletion',
      'Object to processing',
      'Export your data',
      'Withdraw consent',
    ],
  },
  {
    icon: Clock,
    title: 'Data Retention',
    content: 'We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and data at any time.',
  },
  {
    icon: Baby,
    title: "Children's Privacy",
    content: 'Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.',
  },
  {
    icon: Bell,
    title: 'Policy Changes',
    content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.',
  },
];

const howWeUse = [
  'Provide and maintain our Service',
  'Process subscriptions and payments',
  'Send important updates',
  'Respond to support requests',
  'Analyze usage to improve',
  'Prevent fraud and ensure security',
];

export default function PrivacyPage() {
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
            <Shield className="w-10 h-10 text-white dark:text-black" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            Your privacy matters to us. Here&apos;s how we handle your data with care and transparency.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">Last updated: January 2025</p>
        </motion.div>

        {/* Data Collection Cards */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">What We Collect</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {dataTypes.map((type, index) => (
              <motion.div
                key={index}
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <type.icon className="w-6 h-6 text-white dark:text-black" />
                </motion.div>
                <h3 className="font-semibold text-black dark:text-white mb-1">{type.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How We Use Data */}
        <motion.div
          className="mb-12 p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">How We Use Your Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {howWeUse.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
                  <span className="text-white dark:text-black font-semibold text-sm">{index + 1}</span>
                </div>
                <span className="text-zinc-600 dark:text-zinc-400">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex gap-4">
                <motion.div
                  className="flex-shrink-0 w-12 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <section.icon className="w-6 h-6 text-white dark:text-black" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-3">{section.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">{section.content}</p>

                  {section.list && (
                    <div className="grid md:grid-cols-2 gap-3">
                      {section.list.map((item, i) => (
                        <motion.div
                          key={i}
                          className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <p className="font-medium text-black dark:text-white text-sm">{item.label}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-500">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {section.simpleList && (
                    <div className="flex flex-wrap gap-2">
                      {section.simpleList.map((item, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {section.note && (
                    <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500 italic">{section.note}</p>
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
          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-black dark:bg-white flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Mail className="w-8 h-8 text-white dark:text-black" />
            </motion.div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-1">Privacy Questions?</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Contact us at{' '}
                <a href="mailto:support@snapbeautify.com" className="text-black dark:text-white hover:underline font-medium">
                  support@snapbeautify.com
                </a>
              </p>
            </div>
            <motion.a
              href="mailto:support@snapbeautify.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
