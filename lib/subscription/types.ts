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
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  subscription_id: string;
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
  | 'premium_backgrounds'
  | 'pattern_backgrounds'
  | 'text_pattern_repeat'
  | 'custom_frames'
  | 'all_frames'
  | 'advanced_text_styling'
  | 'custom_fonts'
  | '4k_export'
  | 'no_watermark'
  | 'unlimited_exports'
  | 'batch_export'
  | 'templates_all';

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
