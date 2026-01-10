import { headers } from 'next/headers';
import type { PricingConfig, Currency, PaymentProvider } from './types';

// Pricing configuration for different regions
const PRICING_CONFIG: Record<string, PricingConfig> = {
  // India - PPP adjusted pricing
  IN: {
    currency: 'INR',
    symbol: '₹',
    monthly: 199,
    annual: 999,
    lifetime: 2499,
    gateway: 'razorpay',
    countryCode: 'IN',
  },
  // Default international pricing (USD)
  DEFAULT: {
    currency: 'USD',
    symbol: '$',
    monthly: 9,
    annual: 79,
    lifetime: 149,
    gateway: 'stripe',
    countryCode: 'US',
  },
};

// Countries that should use Indian pricing (neighboring countries with similar PPP)
const INDIA_PRICING_COUNTRIES = ['IN'];

// Countries that should use USD pricing with Stripe
const STRIPE_COUNTRIES = [
  'US', 'CA', 'GB', 'AU', 'NZ', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE',
  'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'PL', 'CZ', 'HU',
  'SG', 'JP', 'KR', 'HK', 'TW', 'MY', 'TH', 'PH', 'ID', 'VN',
  'AE', 'SA', 'IL', 'ZA', 'BR', 'MX', 'AR', 'CL', 'CO', 'PE',
];

/**
 * Get pricing configuration based on country code
 */
export function getPricingForCountry(countryCode: string): PricingConfig {
  const normalizedCode = countryCode.toUpperCase();

  if (INDIA_PRICING_COUNTRIES.includes(normalizedCode)) {
    return PRICING_CONFIG.IN;
  }

  // For Stripe countries, use USD pricing
  if (STRIPE_COUNTRIES.includes(normalizedCode)) {
    return {
      ...PRICING_CONFIG.DEFAULT,
      countryCode: normalizedCode,
    };
  }

  // Default to USD pricing for unknown countries
  return {
    ...PRICING_CONFIG.DEFAULT,
    countryCode: normalizedCode,
  };
}

/**
 * Detect user's country from request headers (Vercel provides this)
 */
export async function detectCountry(): Promise<string> {
  try {
    const headersList = await headers();
    // Vercel provides country in headers
    const country = headersList.get('x-vercel-ip-country');
    return country || 'US';
  } catch {
    return 'US';
  }
}

/**
 * Get pricing for current request
 */
export async function getCurrentPricing(): Promise<PricingConfig> {
  const country = await detectCountry();
  return getPricingForCountry(country);
}

/**
 * Format price with currency symbol
 */
export function formatPrice(
  amount: number,
  currency: Currency,
  symbol: string
): string {
  if (currency === 'INR') {
    return `${symbol}${amount.toLocaleString('en-IN')}`;
  }
  return `${symbol}${amount.toLocaleString('en-US')}`;
}

/**
 * Calculate savings for annual plan
 */
export function calculateAnnualSavings(pricing: PricingConfig): {
  amount: number;
  percentage: number;
} {
  const monthlyTotal = pricing.monthly * 12;
  const savingsAmount = monthlyTotal - pricing.annual;
  const savingsPercentage = Math.round((savingsAmount / monthlyTotal) * 100);

  return {
    amount: savingsAmount,
    percentage: savingsPercentage,
  };
}

/**
 * Get monthly equivalent for annual plan
 */
export function getMonthlyEquivalent(pricing: PricingConfig): number {
  return Math.round((pricing.annual / 12) * 100) / 100;
}

/**
 * Razorpay plan IDs (must match plans created in Razorpay Dashboard)
 */
export const RAZORPAY_PLAN_IDS = {
  monthly: process.env.RAZORPAY_PLAN_MONTHLY || 'plan_monthly_199',
  annual: process.env.RAZORPAY_PLAN_ANNUAL || 'plan_annual_999',
} as const;

/**
 * Stripe price IDs (must match prices created in Stripe Dashboard)
 */
export const STRIPE_PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || 'price_monthly_9',
  annual: process.env.STRIPE_PRICE_ANNUAL || 'price_annual_79',
  lifetime: process.env.STRIPE_PRICE_LIFETIME || 'price_lifetime_149',
} as const;

/**
 * Validate that payment provider is appropriate for country
 */
export function validatePaymentProvider(
  countryCode: string,
  requestedProvider: PaymentProvider
): boolean {
  const pricing = getPricingForCountry(countryCode);
  return pricing.gateway === requestedProvider;
}
