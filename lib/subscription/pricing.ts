import { headers } from 'next/headers';
import type { PricingConfig, Currency, PaymentProvider } from './types';

// Pricing configuration for different regions
// NOTE: Stripe is disabled - using Razorpay for all regions temporarily
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
  // Default pricing - Using Razorpay until Stripe is configured
  // TODO: Re-enable Stripe once account is set up
  DEFAULT: {
    currency: 'INR',
    symbol: '₹',
    monthly: 199,
    annual: 999,
    lifetime: 2499,
    gateway: 'razorpay',
    countryCode: 'IN',
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
 * NOTE: Currently returning Razorpay/INR for ALL countries until Stripe is configured
 */
export function getPricingForCountry(countryCode: string): PricingConfig {
  // TODO: Re-enable country-based pricing when Stripe is configured
  // For now, use Razorpay (INR) for everyone
  return {
    ...PRICING_CONFIG.IN,
    countryCode: countryCode.toUpperCase(),
  };
}

/**
 * Detect user's country from request headers or IP geolocation
 */
export async function detectCountry(): Promise<string> {
  try {
    const headersList = await headers();

    // 1. Check for environment variable override (for development/testing)
    if (process.env.FORCE_COUNTRY) {
      return process.env.FORCE_COUNTRY.toUpperCase();
    }

    // 2. Vercel provides country in headers (production)
    const vercelCountry = headersList.get('x-vercel-ip-country');
    if (vercelCountry) {
      return vercelCountry;
    }

    // 3. Check Cloudflare header
    const cfCountry = headersList.get('cf-ipcountry');
    if (cfCountry) {
      return cfCountry;
    }

    // 4. For local development, try to detect via IP geolocation API
    // This runs server-side so it's secure
    if (process.env.NODE_ENV === 'development') {
      try {
        // Use a free IP geolocation service
        const response = await fetch('https://ipapi.co/json/', {
          cache: 'force-cache' // Cache the result
        });
        if (response.ok) {
          const data = await response.json();
          if (data.country_code) {
            return data.country_code;
          }
        }
      } catch (geoError) {
        console.log('IP geolocation failed, using default:', geoError);
      }
    }

    // 5. Default to US
    return 'US';
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
