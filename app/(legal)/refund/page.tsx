'use client'

import { motion } from 'framer-motion';
import { RefreshCcw, Calendar, CreditCard, Infinity, Mail, AlertTriangle, XCircle, CheckCircle2, Clock, HelpCircle, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Monthly',
    icon: Calendar,
    refundPeriod: '7 days',
    details: [
      { text: 'Full refund within 7 days of first payment', highlight: true },
      { text: 'No refunds after 7 days', highlight: false },
      { text: 'Cancel anytime to stop future charges', highlight: false },
    ],
  },
  {
    name: 'Yearly',
    icon: CreditCard,
    refundPeriod: '30 days',
    details: [
      { text: 'Full refund within 14 days', highlight: true },
      { text: 'Pro-rata refund within 30 days', highlight: true },
      { text: 'No refunds after 30 days', highlight: false },
    ],
  },
  {
    name: 'Lifetime',
    icon: Infinity,
    refundPeriod: '14 days',
    details: [
      { text: 'Full refund within 14 days', highlight: true },
      { text: 'No refunds after 14 days', highlight: false },
      { text: 'One-time purchase, permanent access', highlight: false },
    ],
  },
];

const steps = [
  { step: 1, text: 'Email us at support@snapbeautify.com' },
  { step: 2, text: 'Include your registered email address' },
  { step: 3, text: 'Provide your payment/transaction ID' },
  { step: 4, text: 'State the reason for your refund request' },
];

const cancellationMethods = [
  { icon: CreditCard, text: 'Through your account settings' },
  { icon: Mail, text: 'By emailing support@snapbeautify.com' },
  { icon: RefreshCcw, text: 'Through your UPI app (for UPI AutoPay)' },
];

const afterCancellation = [
  'Subscription active until billing period ends',
  'No further charges will be made',
  'Account reverts to free tier after period',
  'Your images and settings are preserved',
];

const exceptions = ['Terms violation', 'Fraudulent activity', 'Policy abuse', 'Outside refund window'];

const failedPayment = [
  { label: 'Notification', desc: "We'll notify you via email" },
  { label: 'Retries', desc: 'Payment retried up to 3 times' },
  { label: 'Pause', desc: 'Subscription paused if all fail' },
  { label: 'Resume', desc: 'Update payment method to continue' },
];

export default function RefundPage() {
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
            <RefreshCcw className="w-10 h-10 text-white dark:text-black" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Refund & Cancellation
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            We want you to be completely satisfied. Here&apos;s our fair and transparent refund policy.
          </p>
        </motion.div>

        {/* Free Trial Notice */}
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
              <CheckCircle2 className="w-6 h-6 text-white dark:text-black" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-black dark:text-white mb-1">Try Before You Buy</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                We offer a free tier with limited features so you can explore SnapBeautify before subscribing.
                We encourage you to try it thoroughly before purchasing a paid plan.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Refund Policy by Plan */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">Refund Policy by Plan</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <motion.div
                  className="w-14 h-14 rounded-xl bg-black dark:bg-white flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <plan.icon className="w-7 h-7 text-white dark:text-black" />
                </motion.div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium mb-4">
                  Refund window: {plan.refundPeriod}
                </p>
                <ul className="space-y-3">
                  {plan.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {detail.highlight ? (
                        <CheckCircle2 className="w-5 h-5 text-black dark:text-white flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-zinc-400 dark:text-zinc-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={detail.highlight ? 'text-black dark:text-white' : 'text-zinc-500 dark:text-zinc-500 text-sm'}>
                        {detail.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How to Request Refund */}
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
              <HelpCircle className="w-5 h-5 text-white dark:text-black" />
            </motion.div>
            How to Request a Refund
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">
                  {item.step}
                </div>
                <span className="text-zinc-600 dark:text-zinc-400">{item.text}</span>
              </motion.div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 text-black dark:text-white mb-1">
              <Clock className="w-4 h-4" />
              <span className="font-medium text-sm">Processing Time</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Eligible refunds are processed within 5-7 business days. The refund will be credited to the original payment method.
            </p>
          </div>
        </motion.div>

        {/* Cancellation Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">How to Cancel</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {cancellationMethods.map((method, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <method.icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{method.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            whileHover={{ y: -2 }}
          >
            <h3 className="font-semibold text-black dark:text-white mb-3">What Happens After Cancellation?</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {afterCancellation.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CheckCircle2 className="w-4 h-4 text-black dark:text-white" />
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Exceptions */}
        <motion.div
          className="mb-12 p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
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
              <AlertTriangle className="w-6 h-6 text-white dark:text-black" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-black dark:text-white mb-2">Refund Exceptions</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">Refunds may not be provided in cases of:</p>
              <div className="flex flex-wrap gap-2">
                {exceptions.map((item, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Failed Payments */}
        <motion.div
          className="mb-12 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-zinc-500" />
            What If a Payment Fails?
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {failedPayment.map((item, i) => (
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
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Need Help with Refunds?</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Our support team responds within 24-48 hours</p>
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
