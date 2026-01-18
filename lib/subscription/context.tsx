'use client';

import React, { createContext, useContext, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { useAuth } from '@/lib/auth/context';
import { showAuthModal } from '@/lib/events';
import { logger } from '@/lib/utils/logger';
import type {
  Subscription,
  SubscriptionPlan,
  PricingConfig,
  FeatureId,
  UserSubscriptionState,
  RazorpayOptions,
  RazorpayPaymentResponse,
} from './types';
import { checkFeatureAccess, FREE_TIER_LIMITS } from './feature-gates';

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      close: () => void;
    };
  }
}

// SWR fetcher with error handling
const fetcher = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return response.json();
};

// SWR configuration for pricing (static data, long cache)
const PRICING_SWR_CONFIG = {
  revalidateOnFocus: false,      // Pricing doesn't change often
  revalidateOnReconnect: false,
  dedupingInterval: 300000,      // 5 minutes deduplication
  errorRetryCount: 3,
};

// SWR configuration for subscription status (user-specific, shorter cache)
const STATUS_SWR_CONFIG = {
  revalidateOnFocus: true,       // Revalidate when user returns to tab
  revalidateOnReconnect: true,   // Revalidate on network reconnect
  dedupingInterval: 60000,       // 1 minute deduplication
  errorRetryCount: 3,
};

// Types for API responses
interface PricingResponse extends PricingConfig {
  annualSavings: number;
  monthlyEquivalent: number;
}

interface SubscriptionStatusResponse {
  isPro: boolean;
  subscription: Subscription | null;
  plan: SubscriptionPlan;
  expiresAt: string | null;
  exportCount: number;
  exportsRemaining: number;
}

interface SubscriptionContextType extends UserSubscriptionState {
  pricing: PricingConfig | null;
  exportCount: number;
  exportsRemaining: number;
  refresh: () => Promise<void>;
  checkFeature: (featureId: FeatureId) => { hasAccess: boolean; upgradeMessage?: string };
  initiateCheckout: (planType: 'monthly' | 'annual' | 'lifetime') => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  requireAuth: () => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const userId = user?.id;

  // SWR for pricing - fetches immediately on mount (doesn't need auth)
  // Benefits: automatic caching, deduplication across components, background revalidation
  const {
    data: pricingData,
    isLoading: pricingLoading,
  } = useSWR<PricingResponse>(
    '/api/subscription/pricing',
    fetcher,
    PRICING_SWR_CONFIG
  );

  // SWR for subscription status - only fetches when userId is available
  // Benefits: automatic revalidation on focus, deduplication, error retry
  const {
    data: statusData,
    isLoading: statusLoading,
  } = useSWR<SubscriptionStatusResponse>(
    userId ? `/api/subscription/status?userId=${userId}` : null, // null key = don't fetch
    fetcher,
    STATUS_SWR_CONFIG
  );

  // Derive values from SWR data with fallbacks
  const pricing = pricingData ?? null;
  const isPro = statusData?.isPro ?? false;
  const subscription = statusData?.subscription ?? null;
  const plan: SubscriptionPlan = statusData?.plan ?? 'free';
  const expiresAt = statusData?.expiresAt ? new Date(statusData.expiresAt) : null;
  const exportCount = statusData?.exportCount ?? 0;
  const exportsRemaining = statusData?.exportsRemaining ?? FREE_TIER_LIMITS.exportsPerDay;

  // Combined loading state
  const isLoading = authLoading || pricingLoading || (userId ? statusLoading : false);

  // Refresh function - uses SWR's mutate for revalidation
  const refresh = useCallback(async () => {
    try {
      await Promise.all([
        mutate('/api/subscription/pricing'),
        userId ? mutate(`/api/subscription/status?userId=${userId}`) : Promise.resolve(),
      ]);
    } catch (error) {
      logger.error('subscription:refresh', error instanceof Error ? error : new Error(String(error)));
    }
  }, [userId]);

  // Check if user has access to a feature
  const checkFeature = useCallback(
    (featureId: FeatureId) => {
      const access = checkFeatureAccess(featureId, plan);
      return {
        hasAccess: access.hasAccess,
        upgradeMessage: access.upgradeMessage,
      };
    },
    [plan]
  );

  // Trigger auth modal if not authenticated
  const requireAuth = useCallback((): boolean => {
    if (isAuthenticated) {
      return true;
    }
    showAuthModal({ defaultTab: 'signup' });
    return false;
  }, [isAuthenticated]);

  // Load Razorpay script (lazy loaded on checkout)
  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  // Initiate checkout based on gateway
  const initiateCheckout = useCallback(
    async (planType: 'monthly' | 'annual' | 'lifetime') => {
      if (!requireAuth()) {
        return;
      }

      if (!pricing || !userId) {
        logger.warn('subscription:checkout', 'Pricing not loaded or user not authenticated');
        return;
      }

      if (pricing.gateway === 'razorpay') {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          logger.warn('subscription:razorpay', 'Failed to load Razorpay script');
          return;
        }

        try {
          const isLifetime = planType === 'lifetime';
          const apiEndpoint = isLifetime
            ? '/api/razorpay/create-order'
            : '/api/razorpay/create-subscription';

          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              planType,
              userId,
              email: user?.email,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create payment');
          }

          const data = await response.json();

          const options: RazorpayOptions = {
            key: data.razorpayKeyId,
            ...(isLifetime
              ? { order_id: data.orderId, amount: data.amount }
              : { subscription_id: data.subscriptionId }
            ),
            name: 'SnapBeautify Pro',
            description: isLifetime
              ? 'Lifetime Access - One Time Payment'
              : `${planType.charAt(0).toUpperCase() + planType.slice(1)} Subscription - Auto-renews`,
            currency: 'INR',
            prefill: {
              email: user?.email || '',
            },
            ...(isLifetime ? {} : { recurring: '1' as const }),
            notes: {
              userId,
              planType,
            },
            handler: async (response: RazorpayPaymentResponse) => {
              const verifyEndpoint = isLifetime
                ? '/api/razorpay/verify-order'
                : '/api/razorpay/verify';

              const verifyResponse = await fetch(verifyEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...response,
                  userId,
                  planType,
                  amount: pricing[planType],
                }),
              });

              if (verifyResponse.ok) {
                // Revalidate subscription status after successful payment
                await mutate(`/api/subscription/status?userId=${userId}`);
                window.dispatchEvent(new CustomEvent('subscription-success', {
                  detail: { plan: planType }
                }));
              } else {
                logger.warn('subscription:payment', 'Payment verification failed');
                window.dispatchEvent(new CustomEvent('subscription-error', {
                  detail: { message: 'Payment verification failed. Please contact support.' }
                }));
              }
            },
            theme: {
              color: '#FF6B35',
            },
            modal: {
              ondismiss: () => {
                logger.debug('subscription:razorpay-modal-closed');
              },
              confirm_close: true,
            },
          };

          const rzp = new window.Razorpay!(options);
          rzp.open();
        } catch (error) {
          logger.error('subscription:razorpay-checkout', error instanceof Error ? error : new Error(String(error)));
          window.dispatchEvent(new CustomEvent('subscription-error', {
            detail: { message: 'Failed to initiate payment. Please try again.' }
          }));
        }
      } else {
        // Stripe checkout for international
        try {
          const response = await fetch('/api/stripe/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              planType,
              userId,
              email: user?.email,
              successUrl: `${window.location.origin}/?subscription=success`,
              cancelUrl: `${window.location.origin}/?subscription=cancelled`,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create checkout session');
          }

          const data = await response.json();

          if (data.url) {
            window.location.href = data.url;
          }
        } catch (error) {
          logger.error('subscription:stripe-checkout', error instanceof Error ? error : new Error(String(error)));
        }
      }
    },
    [pricing, loadRazorpayScript, requireAuth, userId, user?.email]
  );

  // Open customer portal (Stripe only)
  const openCustomerPortal = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          returnUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      logger.error('subscription:portal-open', error instanceof Error ? error : new Error(String(error)));
    }
  }, [userId]);

  const value: SubscriptionContextType = {
    isLoading,
    isPro,
    subscription,
    plan,
    expiresAt,
    pricing,
    exportCount,
    exportsRemaining,
    refresh,
    checkFeature,
    initiateCheckout,
    openCustomerPortal,
    requireAuth,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
