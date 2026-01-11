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
  ChevronRight,
  Star,
  Infinity,
  Gift,
  BadgeCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpgradeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  featureMessage?: string;
}

const proFeatures = [
  { icon: Sparkles, text: 'Premium backgrounds & gradients' },
  { icon: BadgeCheck, text: 'No watermark on exports' },
  { icon: Infinity, text: 'Unlimited exports' },
  { icon: Crown, text: '4K export quality' },
  { icon: Gift, text: 'All templates & fonts' },
  { icon: Star, text: 'Priority support' },
];

export function UpgradeModal({ isOpen: controlledOpen, onClose, featureMessage }: UpgradeModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalMessage, setInternalMessage] = useState<string | undefined>(undefined);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const { pricing, initiateCheckout, isLoading } = useSubscription();

  // Determine actual open state: controlled prop takes precedence over internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  // Determine message: prop takes precedence, then internal, then undefined
  const message = featureMessage || internalMessage;

  useEffect(() => {
    const handleShowModal = (event: CustomEvent<{ feature?: string }>) => {
      if (event.detail?.feature) {
        setInternalMessage(`Upgrade to Pro to access ${event.detail.feature} and more!`);
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
    onClose?.();
  };

  const handleSelectPlan = async (planType: 'monthly' | 'annual' | 'lifetime') => {
    await initiateCheckout(planType);
    handleClose();
  };

  if (!isOpen) return null;

  const plans = pricing ? [
    {
      id: 'monthly' as const,
      name: 'Monthly',
      icon: Zap,
      price: pricing.monthly,
      period: 'mo',
      tagline: 'Flexible',
      gradient: 'from-sky-400 to-blue-500',
      shadow: 'shadow-blue-500/20',
      features: ['All Pro features', 'Cancel anytime'],
      badge: null,
    },
    {
      id: 'annual' as const,
      name: 'Annual',
      icon: Crown,
      price: pricing.annual,
      period: 'year',
      tagline: `Save ${Math.round(((pricing.monthly * 12 - pricing.annual) / (pricing.monthly * 12)) * 100)}%`,
      gradient: 'from-violet-500 to-purple-600',
      shadow: 'shadow-violet-500/20',
      features: ['4 months FREE', 'Priority support'],
      badge: 'BEST VALUE',
      monthlyEquivalent: Math.round(pricing.annual / 12),
    },
    {
      id: 'lifetime' as const,
      name: 'Lifetime',
      icon: Gem,
      price: pricing.lifetime,
      period: 'once',
      tagline: 'Forever yours',
      gradient: 'from-amber-400 to-orange-500',
      shadow: 'shadow-orange-500/20',
      features: ['Lifetime updates', 'No recurring fees'],
      badge: 'BEST DEAL',
    },
  ] : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-3xl"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative px-6 pt-8 pb-6 text-center bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-800/50 dark:to-zinc-900">
                {/* Close button */}
                <motion.button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30 mb-4"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-2xl font-bold text-zinc-900 dark:text-white"
                >
                  Unlock Pro Features
                </motion.h2>

                {message && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto"
                  >
                    {message}
                  </motion.p>
                )}
              </div>

              {/* Pricing Cards */}
              {pricing && (
                <div className="px-4 sm:px-6 pb-6">
                  <div className="grid gap-3">
                    {plans.map((plan, index) => {
                      const Icon = plan.icon;
                      const isHovered = hoveredPlan === plan.id;

                      return (
                        <motion.button
                          key={plan.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          onClick={() => handleSelectPlan(plan.id)}
                          onMouseEnter={() => setHoveredPlan(plan.id)}
                          onMouseLeave={() => setHoveredPlan(null)}
                          disabled={isLoading}
                          className={cn(
                            'relative w-full text-left rounded-2xl p-4 transition-all duration-300 group',
                            'border-2 hover:border-transparent',
                            plan.id === 'annual'
                              ? 'border-violet-200 dark:border-violet-500/30 bg-violet-50/50 dark:bg-violet-500/5'
                              : 'border-zinc-200 dark:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                          )}
                        >
                          {/* Badge */}
                          {plan.badge && (
                            <span className={cn(
                              'absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide text-white',
                              plan.id === 'annual'
                                ? 'bg-gradient-to-r from-violet-500 to-purple-600'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500'
                            )}>
                              {plan.badge}
                            </span>
                          )}

                          <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className={cn(
                              'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br transition-transform duration-300 group-hover:scale-110',
                              plan.gradient,
                              plan.shadow,
                              'shadow-lg'
                            )}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Plan info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-zinc-900 dark:text-white">
                                  {plan.name}
                                </span>
                                <span className={cn(
                                  'text-xs font-medium px-2 py-0.5 rounded-full',
                                  plan.id === 'annual'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                                )}>
                                  {plan.tagline}
                                </span>
                              </div>
                              <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                                  {pricing.symbol}{plan.price.toLocaleString()}
                                </span>
                                <span className="text-sm text-zinc-400">
                                  /{plan.period}
                                </span>
                                {plan.monthlyEquivalent && (
                                  <span className="text-xs text-zinc-400 ml-2">
                                    ({pricing.symbol}{plan.monthlyEquivalent}/mo)
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Arrow */}
                            <div className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                              isHovered || plan.id === 'annual'
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                            )}>
                              <ChevronRight className={cn(
                                'w-5 h-5 transition-transform duration-300',
                                isHovered && 'translate-x-0.5'
                              )} />
                            </div>
                          </div>

                          {/* Features */}
                          <div className="flex gap-4 mt-3 ml-16">
                            {plan.features.map((feature, i) => (
                              <span key={i} className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                <Check className="w-3.5 h-3.5 text-green-500" />
                                {feature}
                              </span>
                            ))}
                          </div>

                          {/* Hover glow effect */}
                          <div className={cn(
                            'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none',
                            isHovered && 'opacity-100'
                          )}>
                            <div className={cn(
                              'absolute inset-0 rounded-2xl bg-gradient-to-r opacity-10',
                              plan.gradient
                            )} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Security note */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-400"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>
                      {pricing.gateway === 'razorpay'
                        ? 'Secure payment via UPI, Cards, or NetBanking'
                        : 'Secure payment powered by Stripe'}
                    </span>
                  </motion.div>
                </div>
              )}

              {/* Features Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="px-4 sm:px-6 pb-6"
              >
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-500" />
                    What&apos;s included
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {proFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={feature.text}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="flex items-center gap-2.5"
                        >
                          <div className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-700 shadow-sm flex items-center justify-center flex-shrink-0">
                            <Icon className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
                          </div>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {feature.text}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Guarantee badges */}
                <div className="flex items-center justify-center gap-6 mt-5">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    7-day refund
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    Cancel anytime
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    Instant access
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
