import type { FeatureId, SubscriptionPlan, FeatureAccess } from './types';
import { SOLID_COLORS, PRESET_GRADIENTS, MESH_GRADIENTS } from '@/lib/constants/gradients';

// Feature configuration: which features require which plan
const FEATURE_CONFIG: Record<FeatureId, {
  requiredPlan: SubscriptionPlan;
  upgradeMessage: string;
}> = {
  // Background Features
  premium_backgrounds: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to access Wave Split and Logo Pattern backgrounds',
  },
  all_gradients: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to access all 78 gradient presets',
  },
  all_solid_colors: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to access all 72 solid colors',
  },
  all_mesh_gradients: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to access all mesh gradient presets',
  },
  custom_gradient_colors: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to create custom gradient colors',
  },
  wave_split: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to use Wave Split backgrounds',
  },
  logo_pattern: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to use Logo Pattern backgrounds',
  },
  text_pattern_positions: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to use all text positions (Top, Bottom)',
  },
  text_pattern_repeat: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to use text repeat mode (wallpaper style)',
  },

  // Frame Features
  all_frames: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to access all device frames (macOS, Windows, iPhone, Android, Social Media)',
  },

  // Text Overlay Features
  unlimited_text_overlays: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to add unlimited text overlays',
  },
  all_fonts: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to access all 60+ fonts',
  },
  font_search: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to search fonts',
  },
  all_font_sizes: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for full font size range (12-200px)',
  },
  all_font_weights: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for all font weights (Thin, Light, Black)',
  },
  gradient_text: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for gradient text colors',
  },
  all_text_colors: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for full text color picker',
  },
  duplicate_overlay: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to duplicate text overlays',
  },

  // Image Settings
  all_padding_values: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for full padding range (0-200px)',
  },
  shadow_customization: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to customize shadow blur and opacity',
  },
  shadow_color: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for custom shadow colors',
  },
  all_border_radius: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for full border radius range',
  },
  extended_image_scale: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for extended image scale (10-200%)',
  },

  // Export Features
  webp_export: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to export in WebP format',
  },
  '4k_export': {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for 3x and 4x export quality',
  },
  unlimited_exports: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for unlimited exports (Free: 10/day)',
  },

  // Aspect Ratios
  all_aspect_ratios: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to access all aspect ratios',
  },
  social_media_ratios: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro for social media aspect ratio presets',
  },

  // Templates
  all_templates: {
    requiredPlan: 'monthly',
    upgradeMessage: 'Upgrade to Pro to access all 47 premium templates',
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

// =============================================
// FREE TIER LIMITS (Based on Feature Analysis Report)
// =============================================
export const FREE_TIER_LIMITS = {
  // Export limits
  exportsPerDay: 10,  // 10 exports per day for free users

  // Background limits
  solidColorCount: 24,        // First 24 colors (out of 72)
  gradientPresetCount: 20,    // First 20 gradients (out of 78)
  meshGradientCount: 5,       // First 5 mesh gradients (out of 15+)
  freeBackgroundTypes: ['solid', 'gradient', 'mesh', 'textPattern', 'transparent'] as const,
  blockedBackgroundTypes: ['waveSplit', 'logoPattern'] as const,
  textPatternFreePosition: 'center' as const,  // Only center position free

  // Frame limits
  freeFrames: ['none', 'browser'] as const,  // Only None and Browser

  // Text overlay limits
  maxTextOverlays: 1,         // Only 1 text overlay
  freeFontCount: 10,          // First 10 fonts (Popular category)
  freeFontSizes: [24, 36, 48] as const,  // 3 preset sizes
  freeFontWeights: [400, 700] as const,  // Normal and Bold only
  freeTextColors: 12,         // 12 preset colors

  // Image settings limits
  freePaddingPresets: [32, 64, 96] as const,  // 3 presets
  fixedShadowBlur: 20,        // Fixed blur
  fixedShadowOpacity: 0.5,    // Fixed 50% opacity
  freeBorderRadiusPresets: [0, 12, 24] as const,  // 3 presets
  imageScaleMin: 50,          // 50-150% range
  imageScaleMax: 150,

  // Export limits
  freeExportFormats: ['png', 'jpeg'] as const,  // No WebP
  freeExportScales: [1, 2] as const,  // 1x and 2x only

  // Aspect ratio limits
  freeAspectRatios: ['free', '16:9', '1:1'] as const,

  // Template limits
  freeTemplateCount: 6,       // 6 free templates
  freeTemplates: [
    'Pure White', 'Dark Slate',       // 2 from Minimal (actual names from templates.ts)
    'Sunset Glow', 'Ocean Waves',     // 2 from Vibrant (actual names from templates.ts)
    'Welcome Text', 'Creative Text'   // 2 from Text Pattern (actual names from templates.ts)
  ] as const,
};

// =============================================
// PRO TIER FEATURES
// =============================================
export const PRO_TIER_FEATURES = {
  // Export
  exportsPerDay: Infinity,
  allExportFormats: ['png', 'jpeg', 'webp'] as const,
  allExportScales: [1, 2, 3, 4] as const,

  // All access
  allSolidColors: 72,
  allGradients: 78,
  allMeshGradients: 15,
  allBackgroundTypes: true,
  allFrames: true,
  unlimitedTextOverlays: true,
  allFonts: true,
  fontSearch: true,
  allFontSizes: true,   // 12-200px
  allFontWeights: true, // All 5 weights
  gradientText: true,
  fullColorPicker: true,
  duplicateOverlay: true,
  allPaddingValues: true,  // 0-200px
  shadowCustomization: true,
  shadowColor: true,
  allBorderRadius: true,
  extendedImageScale: true,  // 10-200%
  allAspectRatios: true,
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
export function getMaxExportScale(userPlan: SubscriptionPlan): number {
  if (userPlan === 'free') {
    return 2; // Max 2x for free
  }
  return 4; // Max 4x for Pro
}

/**
 * Check if a frame is available for free users
 */
export function isFrameAvailable(frameType: string, userPlan: SubscriptionPlan): boolean {
  if (userPlan !== 'free') return true;
  return (FREE_TIER_LIMITS.freeFrames as readonly string[]).includes(frameType);
}

/**
 * Check if an export format is available
 */
export function isExportFormatAvailable(format: string, userPlan: SubscriptionPlan): boolean {
  if (userPlan !== 'free') return true;
  return (FREE_TIER_LIMITS.freeExportFormats as readonly string[]).includes(format);
}

/**
 * Check if an export scale is available
 */
export function isExportScaleAvailable(scale: number, userPlan: SubscriptionPlan): boolean {
  if (userPlan !== 'free') return true;
  return (FREE_TIER_LIMITS.freeExportScales as readonly number[]).includes(scale);
}

/**
 * Check if an aspect ratio is available
 */
export function isAspectRatioAvailable(ratio: string, userPlan: SubscriptionPlan): boolean {
  if (userPlan !== 'free') return true;
  return (FREE_TIER_LIMITS.freeAspectRatios as readonly string[]).includes(ratio);
}

// =============================================
// PREMIUM FEATURE DETECTION (for watermark system)
// =============================================

export interface EditorStateForCheck {
  backgroundType: string;
  backgroundColor: string;
  gradientColors: [string, string];
  meshGradientCSS: string;
  frameType: string;
  textPatternPositions: string[];
  textPatternRows: number;
  textPatternFontFamily: string;
  textPatternFontWeight: number;
  textOverlays: Array<{
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    useGradient?: boolean;
  }>;
  padding: number;
  shadowBlur: number;
  shadowOpacity: number;
  shadowColor: string;
  borderRadius: number;
  imageScale: number;
  exportFormat: string;
  exportScale: number;
}

// Default shadow color (free tier) - HEX format
export const DEFAULT_SHADOW_COLOR = '#000000';

// Free fonts list (first 10 from popular category)
export const FREE_FONTS: string[] = [
  'system-ui, -apple-system, sans-serif',
  'Roboto, sans-serif',
  '"Open Sans", sans-serif',
  'Montserrat, sans-serif',
  'Lato, sans-serif',
  'Poppins, sans-serif',
  'Inter, sans-serif',
  '"Playfair Display", serif',
];

export interface PremiumUsageResult {
  isPremiumUsed: boolean;
  premiumFeatures: string[];
}

/**
 * Check if current editor state uses any premium features
 * Used for watermark system - let users try features but watermark output
 */
export function checkPremiumFeaturesUsed(state: EditorStateForCheck): PremiumUsageResult {
  const premiumFeatures: string[] = [];

  // 1. Premium background types
  if (state.backgroundType === 'waveSplit') {
    premiumFeatures.push('Wave Split background');
  }
  if (state.backgroundType === 'logoPattern') {
    premiumFeatures.push('Logo Pattern background');
  }

  // 1b. Premium solid colors (beyond first 24)
  if (state.backgroundType === 'solid' && state.backgroundColor) {
    const colorIndex = SOLID_COLORS.indexOf(state.backgroundColor);
    if (colorIndex >= FREE_TIER_LIMITS.solidColorCount) {
      premiumFeatures.push('Premium solid color');
    }
  }

  // 1c. Premium gradient presets (beyond first 20)
  if (state.backgroundType === 'gradient' && state.gradientColors) {
    const gradientIndex = PRESET_GRADIENTS.findIndex(
      g => g.colors[0] === state.gradientColors[0] && g.colors[1] === state.gradientColors[1]
    );
    if (gradientIndex >= FREE_TIER_LIMITS.gradientPresetCount) {
      premiumFeatures.push('Premium gradient');
    }
  }

  // 1d. Premium mesh gradients (beyond first 5)
  if (state.backgroundType === 'mesh' && state.meshGradientCSS) {
    const meshIndex = MESH_GRADIENTS.findIndex(m => m.css === state.meshGradientCSS);
    if (meshIndex >= FREE_TIER_LIMITS.meshGradientCount) {
      premiumFeatures.push('Premium mesh gradient');
    }
  }

  // 2. Text pattern premium features
  if (state.backgroundType === 'textPattern') {
    // Non-center positions are premium
    const hasNonCenterPosition = state.textPatternPositions.some(p => p !== 'center');
    if (hasNonCenterPosition) {
      premiumFeatures.push('Text pattern positions (Top/Bottom)');
    }
    // Repeat mode (rows > 1) is premium
    if (state.textPatternRows > 1) {
      premiumFeatures.push('Text pattern repeat mode');
    }
    // Premium font family for text pattern (not in free fonts list)
    if (state.textPatternFontFamily && !FREE_FONTS.includes(state.textPatternFontFamily)) {
      premiumFeatures.push('Premium text pattern font');
    }
    // Premium font weight for text pattern (not 400 or 700)
    if (state.textPatternFontWeight && !(FREE_TIER_LIMITS.freeFontWeights as readonly number[]).includes(state.textPatternFontWeight)) {
      premiumFeatures.push('Premium text pattern font weight');
    }
  }

  // 3. Premium frames (anything other than 'none' or 'browser')
  if (state.frameType !== 'none' && state.frameType !== 'browser') {
    premiumFeatures.push(`${state.frameType} frame`);
  }

  // 4. More than 1 text overlay
  if (state.textOverlays.length > FREE_TIER_LIMITS.maxTextOverlays) {
    premiumFeatures.push('Multiple text overlays');
  }

  // 5. Check text overlay premium settings
  for (const overlay of state.textOverlays) {
    // Premium font sizes (not in free presets: 24, 36, 48)
    if (overlay.fontSize && !(FREE_TIER_LIMITS.freeFontSizes as readonly number[]).includes(overlay.fontSize)) {
      if (!premiumFeatures.includes('Custom font sizes')) {
        premiumFeatures.push('Custom font sizes');
      }
    }
    // Premium font weights (not 400 or 700)
    if (overlay.fontWeight && !(FREE_TIER_LIMITS.freeFontWeights as readonly number[]).includes(overlay.fontWeight)) {
      if (!premiumFeatures.includes('Premium font weights')) {
        premiumFeatures.push('Premium font weights');
      }
    }
    // Gradient text (premium feature)
    if (overlay.useGradient) {
      if (!premiumFeatures.includes('Gradient text')) {
        premiumFeatures.push('Gradient text');
      }
    }
    // Premium font family (not in free fonts list)
    if (overlay.fontFamily && !FREE_FONTS.includes(overlay.fontFamily)) {
      if (!premiumFeatures.includes('Premium fonts')) {
        premiumFeatures.push('Premium fonts');
      }
    }
  }

  // 6. Premium padding (not in free presets)
  if (!(FREE_TIER_LIMITS.freePaddingPresets as readonly number[]).includes(state.padding)) {
    premiumFeatures.push('Custom padding');
  }

  // 7. Custom shadow settings - ONLY check if shadow is enabled (blur > 0)
  if (state.shadowBlur > 0) {
    if (state.shadowBlur !== FREE_TIER_LIMITS.fixedShadowBlur) {
      premiumFeatures.push('Custom shadow blur');
    }
    if (state.shadowOpacity !== FREE_TIER_LIMITS.fixedShadowOpacity * 100) {
      premiumFeatures.push('Custom shadow opacity');
    }
    // Custom shadow color (not default black)
    if (state.shadowColor && state.shadowColor !== DEFAULT_SHADOW_COLOR) {
      premiumFeatures.push('Custom shadow color');
    }
  }

  // 8. Premium border radius (not in free presets)
  if (!(FREE_TIER_LIMITS.freeBorderRadiusPresets as readonly number[]).includes(state.borderRadius)) {
    premiumFeatures.push('Custom border radius');
  }

  // 9. Image scale outside free range (50-150%)
  const scalePercent = state.imageScale * 100;
  if (scalePercent < FREE_TIER_LIMITS.imageScaleMin || scalePercent > FREE_TIER_LIMITS.imageScaleMax) {
    premiumFeatures.push('Extended image scale');
  }

  // 10. Premium export format
  if (state.exportFormat === 'webp') {
    premiumFeatures.push('WebP export format');
  }

  // 11. Premium export scale (3x or 4x)
  if (state.exportScale > 2) {
    premiumFeatures.push(`${state.exportScale}x export quality`);
  }

  return {
    isPremiumUsed: premiumFeatures.length > 0,
    premiumFeatures,
  };
}
