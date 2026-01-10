'use client';

import { useSubscription } from '@/lib/subscription/context';
import type { FeatureId } from '@/lib/subscription/types';

interface UseFeatureGateResult {
  hasAccess: boolean;
  isPro: boolean;
  plan: string;
  upgradeMessage?: string;
  showUpgradePrompt: () => void;
}

/**
 * Hook for checking feature access and showing upgrade prompts
 */
export function useFeatureGate(featureId: FeatureId): UseFeatureGateResult {
  const { isPro, plan, checkFeature } = useSubscription();
  const { hasAccess, upgradeMessage } = checkFeature(featureId);

  const showUpgradePrompt = () => {
    // This could trigger a modal, toast, or redirect
    // For now, we'll just log - in production, connect to your UI system
    if (!hasAccess) {
      console.log('Upgrade required:', upgradeMessage);
      // Could dispatch an event or set state to show upgrade modal
      window.dispatchEvent(
        new CustomEvent('show-upgrade-modal', {
          detail: { featureId, message: upgradeMessage },
        })
      );
    }
  };

  return {
    hasAccess,
    isPro,
    plan,
    upgradeMessage,
    showUpgradePrompt,
  };
}

/**
 * Hook for checking multiple features at once
 */
export function useMultipleFeatureGates(featureIds: FeatureId[]) {
  const { checkFeature, isPro, plan } = useSubscription();

  const features = featureIds.reduce(
    (acc, id) => {
      const { hasAccess, upgradeMessage } = checkFeature(id);
      acc[id] = { hasAccess, upgradeMessage };
      return acc;
    },
    {} as Record<FeatureId, { hasAccess: boolean; upgradeMessage?: string }>
  );

  const hasAllAccess = featureIds.every((id) => features[id].hasAccess);
  const hasAnyAccess = featureIds.some((id) => features[id].hasAccess);

  return {
    features,
    hasAllAccess,
    hasAnyAccess,
    isPro,
    plan,
  };
}

/**
 * Hook for export limit checking
 */
export function useExportLimit() {
  const { isPro, exportCount, exportsRemaining } = useSubscription();

  const canExport = isPro || exportsRemaining > 0;
  const isLimited = !isPro;

  return {
    canExport,
    isLimited,
    exportCount,
    exportsRemaining,
    isPro,
  };
}
