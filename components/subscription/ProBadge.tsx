'use client';

import { useSubscription } from '@/lib/subscription/context';
import { showUpgradeModal } from '@/lib/events';
import { Crown, Sparkles } from 'lucide-react';

interface ProBadgeProps {
  showUpgrade?: boolean;
  className?: string;
}

export function ProBadge({ showUpgrade = true, className = '' }: ProBadgeProps) {
  const { isPro, plan, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-zinc-700 rounded-full h-6 w-16 ${className}`} />
    );
  }

  if (isPro) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-xs font-semibold text-white ${className}`}
      >
        <Crown className="w-3 h-3" />
        PRO
        {plan === 'lifetime' && (
          <span className="ml-1 text-[10px] opacity-80">Lifetime</span>
        )}
      </div>
    );
  }

  if (showUpgrade) {
    return (
      <button
        onClick={() => showUpgradeModal({ feature: 'general' })}
        className={`inline-flex items-center gap-1 px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded-full text-xs font-medium text-zinc-300 transition-colors ${className}`}
      >
        <Sparkles className="w-3 h-3 text-orange-500" />
        Upgrade
      </button>
    );
  }

  return null;
}

/**
 * Small inline "Pro" label for feature indicators
 */
export function ProLabel({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500/20 rounded text-[10px] font-semibold text-orange-500 ${className}`}
    >
      <Crown className="w-2.5 h-2.5" />
      PRO
    </span>
  );
}

/**
 * Export count indicator for free users
 */
export function ExportCounter({ className = '' }: { className?: string }) {
  const { isPro, exportCount, exportsRemaining, isLoading } = useSubscription();

  if (isLoading || isPro) {
    return null;
  }

  const isLow = exportsRemaining <= 2;
  const isExhausted = exportsRemaining === 0;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
        isExhausted
          ? 'bg-red-500/20 text-red-400'
          : isLow
          ? 'bg-yellow-500/20 text-yellow-400'
          : 'bg-zinc-700/50 text-zinc-400'
      } ${className}`}
    >
      <span>
        {isExhausted
          ? 'Daily limit reached'
          : `${exportsRemaining} export${exportsRemaining !== 1 ? 's' : ''} left today`}
      </span>
      {isExhausted && (
        <button
          onClick={() => showUpgradeModal({ feature: 'unlimited_exports' })}
          className="text-orange-500 hover:text-orange-400 font-medium"
        >
          Upgrade
        </button>
      )}
    </div>
  );
}
