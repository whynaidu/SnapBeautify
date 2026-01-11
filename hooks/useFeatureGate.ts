'use client';

import { useSubscription } from '@/lib/subscription/context';
import { showUpgradeModal } from '@/lib/events';
import { logger } from '@/lib/utils/logger';
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
    if (!hasAccess) {
      logger.debug('feature-gate:upgrade-required', { featureId, upgradeMessage });
      showUpgradeModal({ feature: featureId });
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
