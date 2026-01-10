import type { FeatureId, SubscriptionPlan, FeatureAccess } from './types';

// Feature configuration: which features require which plan
const FEATURE_CONFIG: Record<FeatureId, {
  requiredPlan: SubscriptionPlan;
  upgradeMessage: string;
}> = {
  // Background Features
  premium_backgrounds: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to access premium gradient and mesh backgrounds',
  },
  pattern_backgrounds: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to use pattern backgrounds',
  },
  text_pattern_repeat: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to use text repeat mode (wallpaper style)',
  },

  // Frame Features
  custom_frames: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to create custom frames',
  },
  all_frames: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to access all social media frame templates',
  },

  // Text Features
  advanced_text_styling: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for advanced text styling options',
  },
  custom_fonts: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to use custom fonts',
  },

  // Export Features
  '4k_export': {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for 4K export quality',
  },
  no_watermark: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to remove watermark from exports',
  },
  unlimited_exports: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for unlimited exports (Free: 5/day)',
  },
  batch_export: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for batch export functionality',
  },

  // Templates
  templates_all: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to access all premium templates',
  },
};

// Plan hierarchy (higher index = more access)
const PLAN_HIERARCHY: SubscriptionPlan[] = ['free', 'monthly', 'annual', 'lifetime'];

/**
 * Check if a plan has access to a feature
 */
function planHasAccess(userPlan: SubscriptionPlan, requiredPlan: SubscriptionPlan): boolean {
  const userPlanIndex = PLAN_HIERARCHY.indexOf(userPlan);
  const requiredPlanIndex = PLAN_HIERARCHY.indexOf(requiredPlan);
  return userPlanIndex >= requiredPlanIndex;
}

/**
 * Check if user has access to a specific feature
 */
export function checkFeatureAccess(
  featureId: FeatureId,
  userPlan: SubscriptionPlan
): FeatureAccess {
  const config = FEATURE_CONFIG[featureId];

  if (!config) {
    // Unknown feature - deny access by default
    return {
      featureId,
      hasAccess: false,
      requiredPlan: 'monthly',
      upgradeMessage: 'This feature requires a Pro subscription',
    };
  }

  const hasAccess = planHasAccess(userPlan, config.requiredPlan);

  return {
    featureId,
    hasAccess,
    requiredPlan: config.requiredPlan,
    upgradeMessage: hasAccess ? undefined : config.upgradeMessage,
  };
}

/**
 * Check multiple features at once
 */
export function checkMultipleFeatures(
  featureIds: FeatureId[],
  userPlan: SubscriptionPlan
): Record<FeatureId, FeatureAccess> {
  const result: Record<string, FeatureAccess> = {};

  for (const featureId of featureIds) {
    result[featureId] = checkFeatureAccess(featureId, userPlan);
  }

  return result as Record<FeatureId, FeatureAccess>;
}

/**
 * Get all features available for a plan
 */
export function getFeaturesForPlan(plan: SubscriptionPlan): FeatureId[] {
  const features: FeatureId[] = [];

  for (const [featureId, config] of Object.entries(FEATURE_CONFIG)) {
    if (planHasAccess(plan, config.requiredPlan)) {
      features.push(featureId as FeatureId);
    }
  }

  return features;
}

/**
 * Get all locked features for a plan (features user doesn't have)
 */
export function getLockedFeatures(plan: SubscriptionPlan): FeatureId[] {
  const features: FeatureId[] = [];

  for (const [featureId, config] of Object.entries(FEATURE_CONFIG)) {
    if (!planHasAccess(plan, config.requiredPlan)) {
      features.push(featureId as FeatureId);
    }
  }

  return features;
}

// Free tier limits
export const FREE_TIER_LIMITS = {
  exportsPerDay: 5,
  maxExportResolution: 720, // 720p
  watermarkEnabled: true,
  freeBackgroundTypes: ['solid', 'gradient'] as const,
  freeFrameCount: 3, // Only first 3 frames
  freeTemplateCount: 5, // Only first 5 templates
};

// Pro tier features
export const PRO_TIER_FEATURES = {
  exportsPerDay: Infinity,
  maxExportResolution: 4096, // 4K
  watermarkEnabled: false,
  allBackgroundTypes: true,
  allFrames: true,
  allTemplates: true,
  prioritySupport: true,
};

/**
 * Check if user has exceeded daily export limit
 */
export function hasExceededExportLimit(
  exportCount: number,
  userPlan: SubscriptionPlan
): boolean {
  if (userPlan !== 'free') {
    return false; // Pro users have unlimited exports
  }
  return exportCount >= FREE_TIER_LIMITS.exportsPerDay;
}

/**
 * Get max export resolution for plan
 */
export function getMaxExportResolution(userPlan: SubscriptionPlan): number {
  if (userPlan === 'free') {
    return FREE_TIER_LIMITS.maxExportResolution;
  }
  return PRO_TIER_FEATURES.maxExportResolution;
}

/**
 * Check if watermark should be applied
 */
export function shouldApplyWatermark(userPlan: SubscriptionPlan): boolean {
  return userPlan === 'free';
}
