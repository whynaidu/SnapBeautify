'use client'

import { motion } from 'framer-motion';
import { Truck, Zap, Globe, CheckCircle2, Clock, Mail, Monitor, RefreshCcw, HelpCircle, Calendar, CreditCard, Infinity, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Monthly',
    icon: Calendar,
    delivery: 'Instant',
    duration: '30 days access',
  },
  {
    name: 'Yearly',
    icon: CreditCard,
    delivery: 'Instant',
    duration: '365 days access',
  },
  {
    name: 'Lifetime',
    icon: Infinity,
    delivery: 'Instant',
    duration: 'Permanent access',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Instant Activation',
    description: 'Premium features activate immediately after payment',
  },
  {
    icon: Globe,
    title: '24/7 Availability',
    description: 'Access from anywhere, anytime worldwide',
  },
  {
    icon: Monitor,
    title: 'No Downloads',
    description: 'Works directly in your browser',
  },
  {
    icon: RefreshCcw,
    title: '99.9% Uptime',
    description: 'Reliable cloud infrastructure',
  },
];

const activationSteps = [
  { step: 1, text: 'Complete payment through Razorpay', icon: CreditCard },
  { step: 2, text: 'Automatic verification (seconds)', icon: Clock },
  { step: 3, text: 'Account upgraded instantly', icon: Zap },
  { step: 4, text: 'Refresh to access all features', icon: RefreshCcw },
];

const confirmations = [
  { label: 'On-screen confirmation', desc: 'Immediate visual feedback' },
  { label: 'Email confirmation', desc: 'Payment & subscription details' },
  { label: 'Payment receipt', desc: 'From Razorpay for records' },
];

const noShipping = [
  'No physical products shipped',
  'No shipping charges apply',
  'No delivery address required',
  'Access from any device with internet',
];

const troubleshooting = ['Refresh browser', 'Log out & back in', 'Clear cache', 'Contact support'];

export default function ShippingPage() {
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
            <Truck className="w-10 h-10 text-white dark:text-black" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Delivery Policy
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            SnapBeautify is a digital service. No physical shipping required — everything is delivered instantly online.
          </p>
        </motion.div>

        {/* Digital Product Notice */}
        <motion.div
          className="mb-12 p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-black dark:bg-white flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Zap className="w-10 h-10 text-white dark:text-black" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">100% Digital Delivery</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Upon successful payment, your premium subscription is activated <strong className="text-black dark:text-white">instantly</strong>.
                No waiting, no shipping fees, no physical products — just immediate access to all premium features.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">What You Get</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className="w-6 h-6 text-white dark:text-black" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-black dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Subscription Plans */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">Delivery by Plan</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto rounded-xl bg-black dark:bg-white flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <plan.icon className="w-8 h-8 text-white dark:text-black" />
                </motion.div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{plan.name}</h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-black dark:text-white text-sm mb-3">
                  <Zap className="w-3 h-3" />
                  {plan.delivery}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">{plan.duration}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activation Process */}
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
            Activation Process
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {activationSteps.map((item, index) => (
              <motion.div
                key={item.step}
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">
                  {item.step}
                </div>
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-zinc-500 dark:text-zinc-500" />
                  <span className="text-zinc-600 dark:text-zinc-400">{item.text}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Confirmation */}
        <motion.div
          className="mb-12 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-black dark:text-white" />
            What You&apos;ll Receive
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {confirmations.map((item, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
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
        </motion.div>

        {/* No Physical Shipping */}
        <motion.div
          className="mb-12 p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-zinc-500" />
            No Physical Shipping
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {noShipping.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Access Issues */}
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
              whileHover={{ scale: 1.1 }}
            >
              <HelpCircle className="w-6 h-6 text-white dark:text-black" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-black dark:text-white mb-2">Having Access Issues?</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">Try these steps first:</p>
              <div className="flex flex-wrap gap-2">
                {troubleshooting.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm">
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-3">
                We resolve all access issues within 2 hours during business hours.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Delivery Questions?</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">We&apos;re here to ensure smooth access to your premium features</p>
            <motion.a
              href="mailto:support@snapbeautify.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mail className="w-4 h-4" />
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
