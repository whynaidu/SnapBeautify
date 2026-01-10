// Subscription Types

export type SubscriptionPlan = 'free' | 'monthly' | 'annual' | 'lifetime';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'expired' | 'lifetime';
export type PaymentProvider = 'razorpay' | 'stripe';
export type Currency = 'INR' | 'USD';

export interface PricingConfig {
  currency: Currency;
  symbol: string;
  monthly: number;
  annual: number;
  lifetime: number;
  gateway: PaymentProvider;
  countryCode: string;
}

export interface Subscription {
  id: string;
  userId: string;
  provider: PaymentProvider;
  razorpaySubscriptionId?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  currency: Currency;
  amount: number;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscriptionState {
  isLoading: boolean;
  isPro: boolean;
  subscription: Subscription | null;
  plan: SubscriptionPlan;
  expiresAt: Date | null;
}

// Razorpay Types (since @types/razorpay doesn't exist)
export interface RazorpaySubscription {
  id: string;
  plan_id: string;
  status: string;
  current_start: number;
  current_end: number;
  customer_id?: string;
  notes?: Record<string, string>;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id?: string; // For subscriptions
  razorpay_order_id?: string;        // For one-time orders
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  subscription_id?: string;  // For recurring subscriptions
  order_id?: string;         // For one-time payments (lifetime)
  amount?: number;           // Required for orders (in paise)
  name: string;
  description: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

// Feature Gating
export type FeatureId =
  // Background Features
  | 'premium_backgrounds'      // Wave split, logo pattern
  | 'all_gradients'            // All 78 gradient presets (free: 20)
  | 'all_solid_colors'         // All 72 colors (free: 24)
  | 'all_mesh_gradients'       // All 15+ mesh (free: 5)
  | 'custom_gradient_colors'   // Custom gradient color picker
  | 'wave_split'               // Wave split background
  | 'logo_pattern'             // Logo pattern background
  | 'text_pattern_positions'   // All text positions (free: center only)
  | 'text_pattern_repeat'      // Text repeat mode (wallpaper)
  // Frame Features
  | 'all_frames'               // All frames (free: None, Browser)
  // Text Overlay Features
  | 'unlimited_text_overlays'  // Unlimited (free: 1)
  | 'all_fonts'                // All 60+ fonts (free: 10 popular)
  | 'font_search'              // Font search feature
  | 'all_font_sizes'           // Full size range (free: 3 presets)
  | 'all_font_weights'         // All weights (free: Normal, Bold)
  | 'gradient_text'            // Gradient text colors
  | 'all_text_colors'          // Full color picker (free: 12 colors)
  | 'duplicate_overlay'        // Duplicate text overlay
  // Image Settings
  | 'all_padding_values'       // Full range (free: 3 presets)
  | 'shadow_customization'     // Shadow blur/opacity sliders
  | 'shadow_color'             // Custom shadow color
  | 'all_border_radius'        // Full range (free: 3 presets)
  | 'extended_image_scale'     // 10-200% (free: 50-150%)
  // Export Features
  | 'webp_export'              // WebP format
  | '4k_export'                // 3x and 4x export
  | 'unlimited_exports'        // Unlimited (free: 10/day)
  // Aspect Ratios
  | 'all_aspect_ratios'        // All ratios (free: Free, 16:9, 1:1)
  | 'social_media_ratios'      // Twitter, LinkedIn, Instagram, Story
  // Templates
  | 'all_templates';           // All 47 templates (free: 6)

export interface FeatureAccess {
  featureId: FeatureId;
  hasAccess: boolean;
  requiredPlan: SubscriptionPlan;
  upgradeMessage?: string;
}

// API Response Types
export interface CreateCheckoutResponse {
  url?: string;
  subscriptionId?: string;
  razorpayKeyId?: string;
  error?: string;
}

export interface SubscriptionStatusResponse {
  isPro: boolean;
  subscription: Subscription | null;
  plan: SubscriptionPlan;
  expiresAt: string | null;
}
