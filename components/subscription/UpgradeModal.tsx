'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '@/lib/subscription/context';
import { EVENTS } from '@/lib/events';
import {
  X,
  Sparkles,
  Check,
  Zap,
  Crown,
  Gem,
  Shield,
  Infinity as InfinityIcon,
  Image,
  Download,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpgradeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  featureMessage?: string;
}

const proFeatures = [
  { icon: Palette, text: 'Premium backgrounds' },
  { icon: Image, text: 'No watermark' },
  { icon: InfinityIcon, text: 'Unlimited exports' },
  { icon: Download, text: '4K export quality' },
];

export function UpgradeModal({ isOpen: controlledOpen, onClose, featureMessage }: UpgradeModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalMessage, setInternalMessage] = useState<string | undefined>(undefined);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'lifetime'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);
  const { pricing, initiateCheckout } = useSubscription();

  // Determine actual open state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const message = featureMessage || internalMessage;

  useEffect(() => {
    const handleShowModal = (event: CustomEvent<{ feature?: string }>) => {
      if (event.detail?.feature) {
        setInternalMessage(`Upgrade to Pro to access ${event.detail.feature.replace(/_/g, ' ')} and more!`);
      }
      setInternalOpen(true);
    };

    window.addEventListener(EVENTS.SHOW_UPGRADE_MODAL, handleShowModal as EventListener);
    return () => window.removeEventListener(EVENTS.SHOW_UPGRADE_MODAL, handleShowModal as EventListener);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = () => {
    setInternalOpen(false);
    setInternalMessage(undefined);
    setIsProcessing(false);
    onClose?.();
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      await initiateCheckout(selectedPlan);
      // Don't close immediately - let the payment modal handle it
      // The modal will close on successful payment via the subscription context
    } catch {
      // Reset processing state on error
      setIsProcessing(false);
    }
    // Reset after a delay in case Razorpay modal was dismissed
    setTimeout(() => setIsProcessing(false), 3000);
  };

  if (!isOpen) return null;

  const plans = pricing ? [
    {
      id: 'monthly' as const,
      name: 'Monthly',
      icon: Zap,
      price: pricing.monthly,
      period: '/month',
      description: 'Flexible, cancel anytime',
      color: 'blue',
    },
    {
      id: 'annual' as const,
      name: 'Annual',
      icon: Crown,
      price: pricing.annual,
      period: '/year',
      description: `Save ${Math.round(((pricing.monthly * 12 - pricing.annual) / (pricing.monthly * 12)) * 100)}% - Best value`,
      monthlyPrice: Math.round(pricing.annual / 12),
      color: 'violet',
      popular: true,
    },
    {
      id: 'lifetime' as const,
      name: 'Lifetime',
      icon: Gem,
      price: pricing.lifetime,
      period: ' once',
      description: 'Pay once, own forever',
      color: 'amber',
    },
  ] : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25 mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Upgrade to Pro
              </h2>
              {message && (
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {message}
                </p>
              )}
            </div>

            {/* Plan Selection */}
            {pricing && (
              <div className="px-6 pb-4">
                <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                  {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={cn(
                          'flex-1 relative py-2 px-3 rounded-lg text-sm font-medium transition-all',
                          isSelected
                            ? 'text-zinc-900 dark:text-white'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                        )}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="selectedPlanBg"
                            className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-lg shadow-sm"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center justify-center gap-1.5">
                          {plan.name}
                          {plan.popular && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 font-semibold">
                              BEST
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Plan Details */}
            {pricing && (
              <div className="px-6 pb-4">
                {plans.map((plan) => {
                  if (plan.id !== selectedPlan) return null;
                  const Icon = plan.icon;

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-colors',
                        plan.color === 'violet' && 'border-violet-200 dark:border-violet-500/30 bg-violet-50/50 dark:bg-violet-500/5',
                        plan.color === 'blue' && 'border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-500/5',
                        plan.color === 'amber' && 'border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center shadow-lg',
                          plan.color === 'violet' && 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/25',
                          plan.color === 'blue' && 'bg-gradient-to-br from-sky-400 to-blue-500 shadow-blue-500/25',
                          plan.color === 'amber' && 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/25',
                        )}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                              {pricing.symbol}{plan.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-zinc-400">{plan.period}</span>
                          </div>
                          {plan.monthlyPrice && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Just {pricing.symbol}{plan.monthlyPrice}/month
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {plan.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Features Grid */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {proFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.text}
                      className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
                    >
                      <div className="w-6 h-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Button */}
            <div className="px-6 pb-4">
              <motion.button
                onClick={handlePurchase}
                disabled={isProcessing}
                className={cn(
                  'w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all relative overflow-hidden',
                  'bg-gradient-to-r from-violet-500 to-purple-600',
                  'shadow-lg shadow-violet-500/25',
                  'disabled:cursor-not-allowed',
                  !isProcessing && 'hover:from-violet-600 hover:to-purple-700 hover:shadow-xl hover:shadow-violet-500/30 active:scale-[0.98]'
                )}
                whileTap={!isProcessing ? { scale: 0.98 } : {}}
              >
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.span
                      key="processing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>Opening payment...</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="upgrade"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Upgrade Now
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Shimmer effect when processing */}
                {isProcessing && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </motion.button>
            </div>

            {/* Footer */}
            <div className="px-6 pb-5">
              <div className="flex items-center justify-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-500" />
                  7-day refund
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-500" />
                  Cancel anytime
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Secure
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
