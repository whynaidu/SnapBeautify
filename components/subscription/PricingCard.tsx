'use client';

import { useSubscription } from '@/lib/subscription/context';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

interface PricingCardProps {
  planType: 'monthly' | 'annual' | 'lifetime';
  featured?: boolean;
}

const planDetails = {
  monthly: {
    name: 'Pro Monthly',
    icon: Zap,
    features: [
      'All premium backgrounds',
      'All frame templates',
      '4K export quality',
      'No watermark',
      'Unlimited exports',
      'Pattern backgrounds',
      'Advanced text styling',
    ],
  },
  annual: {
    name: 'Pro Annual',
    icon: Sparkles,
    features: [
      'Everything in Monthly',
      '4 months FREE',
      'Priority support',
      'Early access to features',
      'Best value!',
    ],
  },
  lifetime: {
    name: 'Lifetime',
    icon: Crown,
    features: [
      'Everything forever',
      'All future updates',
      'No recurring payments',
      'One-time purchase',
      'Perfect for professionals',
    ],
  },
};

export function PricingCard({ planType, featured = false }: PricingCardProps) {
  const { pricing, initiateCheckout, isPro, plan: currentPlan, isLoading } = useSubscription();

  if (!pricing) {
    return (
      <div className="animate-pulse bg-zinc-800 rounded-xl p-6 h-96" />
    );
  }

  const details = planDetails[planType];
  const Icon = details.icon;
  const price = pricing[planType];
  const isCurrentPlan = currentPlan === planType || (isPro && planType === currentPlan);

  // Calculate savings for annual
  const annualSavings = planType === 'annual'
    ? Math.round(((pricing.monthly * 12 - pricing.annual) / (pricing.monthly * 12)) * 100)
    : 0;

  const handleSubscribe = () => {
    if (!isCurrentPlan && !isLoading) {
      initiateCheckout(planType);
    }
  };

  return (
    <div
      className={`relative rounded-xl p-6 transition-all ${
        featured
          ? 'bg-gradient-to-b from-orange-500/20 to-zinc-900 border-2 border-orange-500 scale-105'
          : 'bg-zinc-900 border border-zinc-700'
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            BEST VALUE
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-6 h-6 ${featured ? 'text-orange-500' : 'text-zinc-400'}`} />
        <h3 className="text-xl font-bold text-white">{details.name}</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">
            {pricing.symbol}{price}
          </span>
          <span className="text-zinc-400">
            {planType === 'lifetime' ? ' one-time' : planType === 'annual' ? '/year' : '/month'}
          </span>
        </div>

        {planType === 'annual' && (
          <div className="mt-2">
            <span className="text-sm text-zinc-400 line-through">
              {pricing.symbol}{pricing.monthly * 12}/year
            </span>
            <span className="ml-2 text-sm text-green-500 font-medium">
              Save {annualSavings}%
            </span>
          </div>
        )}

        {planType === 'annual' && (
          <p className="text-sm text-zinc-400 mt-1">
            Just {pricing.symbol}{Math.round(pricing.annual / 12)}/month
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-6">
        {details.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        onClick={handleSubscribe}
        disabled={isCurrentPlan || isLoading}
        className={`w-full ${
          featured
            ? 'bg-orange-500 hover:bg-orange-600 text-white'
            : isCurrentPlan
            ? 'bg-green-600 text-white cursor-default'
            : 'bg-zinc-700 hover:bg-zinc-600 text-white'
        }`}
      >
        {isCurrentPlan ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Current Plan
          </>
        ) : (
          `Get ${details.name}`
        )}
      </Button>

      {pricing.gateway === 'razorpay' && (
        <p className="text-xs text-zinc-500 mt-3 text-center">
          Pay with UPI, Cards, or NetBanking
        </p>
      )}
    </div>
  );
}
