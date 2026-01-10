'use client';

import { useState, useEffect } from 'react';
import { useSubscription } from '@/lib/subscription/context';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Check, Zap, Crown, Lock } from 'lucide-react';

interface UpgradeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  featureMessage?: string;
}

export function UpgradeModal({ isOpen: controlledOpen, onClose, featureMessage }: UpgradeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(featureMessage);
  const { pricing, initiateCheckout, isLoading } = useSubscription();

  // Listen for upgrade modal events
  useEffect(() => {
    const handleShowModal = (event: CustomEvent<{ featureId: string; message: string }>) => {
      setMessage(event.detail.message);
      setIsOpen(true);
    };

    window.addEventListener('show-upgrade-modal', handleShowModal as EventListener);

    return () => {
      window.removeEventListener('show-upgrade-modal', handleShowModal as EventListener);
    };
  }, []);

  // Handle controlled state
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen);
    }
    if (featureMessage) {
      setMessage(featureMessage);
    }
  }, [controlledOpen, featureMessage]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleSelectPlan = async (planType: 'monthly' | 'annual' | 'lifetime') => {
    await initiateCheckout(planType);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-700 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="p-6 pb-0 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
            <Lock className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Upgrade to Pro
          </h2>
          {message && (
            <p className="text-zinc-400 max-w-md mx-auto">
              {message}
            </p>
          )}
        </div>

        {/* Pricing options */}
        {pricing && (
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Monthly */}
              <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-white">Monthly</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {pricing.symbol}{pricing.monthly}
                  <span className="text-sm font-normal text-zinc-400">/mo</span>
                </div>
                <ul className="text-sm text-zinc-400 space-y-1 mb-4">
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    All Pro features
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    Cancel anytime
                  </li>
                </ul>
                <Button
                  onClick={() => handleSelectPlan('monthly')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full border-zinc-600 hover:bg-zinc-700"
                >
                  Choose Monthly
                </Button>
              </div>

              {/* Annual - Featured */}
              <div className="bg-gradient-to-b from-orange-500/20 to-zinc-800 rounded-xl p-4 border-2 border-orange-500 relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    BEST VALUE
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-white">Annual</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {pricing.symbol}{pricing.annual}
                  <span className="text-sm font-normal text-zinc-400">/yr</span>
                </div>
                <div className="text-xs text-green-500 mb-2">
                  Save {Math.round(((pricing.monthly * 12 - pricing.annual) / (pricing.monthly * 12)) * 100)}% vs monthly
                </div>
                <ul className="text-sm text-zinc-400 space-y-1 mb-4">
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    4 months FREE
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    Priority support
                  </li>
                </ul>
                <Button
                  onClick={() => handleSelectPlan('annual')}
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Choose Annual
                </Button>
              </div>

              {/* Lifetime */}
              <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-white">Lifetime</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {pricing.symbol}{pricing.lifetime}
                  <span className="text-sm font-normal text-zinc-400"> once</span>
                </div>
                <ul className="text-sm text-zinc-400 space-y-1 mb-4">
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    Pay once, own forever
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    All future updates
                  </li>
                </ul>
                <Button
                  onClick={() => handleSelectPlan('lifetime')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full border-zinc-600 hover:bg-zinc-700"
                >
                  Choose Lifetime
                </Button>
              </div>
            </div>

            {/* Payment note */}
            <p className="text-center text-xs text-zinc-500 mt-4">
              {pricing.gateway === 'razorpay' ? (
                <>Pay securely with UPI, Credit/Debit Cards, or NetBanking</>
              ) : (
                <>Secure payment powered by Stripe</>
              )}
            </p>
          </div>
        )}

        {/* Features list */}
        <div className="px-6 pb-6">
          <div className="bg-zinc-800/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">
              What you get with Pro:
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                'Premium backgrounds',
                'All frame templates',
                '4K export quality',
                'No watermark',
                'Unlimited exports',
                'Pattern backgrounds',
                'Text repeat mode',
                'All fonts & templates',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-zinc-400">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
