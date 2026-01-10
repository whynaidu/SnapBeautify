'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/context';
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

interface SubscriptionContextType extends UserSubscriptionState {
  pricing: PricingConfig | null;
  exportCount: number;
  exportsRemaining: number;
  refresh: () => Promise<void>;
  checkFeature: (featureId: FeatureId) => { hasAccess: boolean; upgradeMessage?: string };
  initiateCheckout: (planType: 'monthly' | 'annual' | 'lifetime') => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  requireAuth: () => boolean; // Returns true if already authenticated
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [exportCount, setExportCount] = useState(0);
  const [exportsRemaining, setExportsRemaining] = useState(FREE_TIER_LIMITS.exportsPerDay);

  // Get current user ID
  const userId = user?.id;

  // Fetch pricing configuration
  const fetchPricing = useCallback(async () => {
    try {
      const response = await fetch('/api/subscription/pricing');
      if (response.ok) {
        const data = await response.json();
        setPricing(data);
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
    }
  }, []);

  // Fetch subscription status
  const fetchStatus = useCallback(async () => {
    if (!userId) {
      // Not logged in - reset to free tier
      setIsPro(false);
      setSubscription(null);
      setPlan('free');
      setExpiresAt(null);
      setExportCount(0);
      setExportsRemaining(FREE_TIER_LIMITS.exportsPerDay);
      return;
    }

    try {
      const response = await fetch(`/api/subscription/status?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setIsPro(data.isPro);
        setSubscription(data.subscription);
        setPlan(data.plan);
        setExpiresAt(data.expiresAt ? new Date(data.expiresAt) : null);
        setExportCount(data.exportCount || 0);
        setExportsRemaining(data.exportsRemaining ?? FREE_TIER_LIMITS.exportsPerDay);
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  }, [userId]);

  // Refresh all subscription data
  const refresh = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchPricing(), fetchStatus()]);
    setIsLoading(false);
  }, [fetchPricing, fetchStatus]);

  // Initial load and when auth changes
  useEffect(() => {
    if (!authLoading) {
      refresh();
    }
  }, [refresh, authLoading, userId]);

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
    // Dispatch event to open auth modal
    window.dispatchEvent(new CustomEvent('show-auth-modal', {
      detail: { defaultTab: 'signup' }
    }));
    return false;
  }, [isAuthenticated]);

  // Load Razorpay script
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
      // Require authentication first
      if (!requireAuth()) {
        return;
      }

      if (!pricing || !userId) {
        console.error('Pricing not loaded or user not authenticated');
        return;
      }

      if (pricing.gateway === 'razorpay') {
        // Razorpay checkout for India
        if (planType === 'lifetime') {
          // For lifetime, we need a different approach (one-time payment)
          console.log('Lifetime deals for India - contact support');
          return;
        }

        const loaded = await loadRazorpayScript();
        if (!loaded) {
          console.error('Failed to load Razorpay');
          return;
        }

        try {
          const response = await fetch('/api/razorpay/create-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              planType,
              userId,
              email: user?.email,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create subscription');
          }

          const data = await response.json();

          const options: RazorpayOptions = {
            key: data.razorpayKeyId,
            subscription_id: data.subscriptionId,
            name: 'SnapBeautify Pro',
            description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Subscription`,
            prefill: {
              email: user?.email || '',
            },
            handler: async (response: RazorpayPaymentResponse) => {
              // Verify payment
              const verifyResponse = await fetch('/api/razorpay/verify', {
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
                await refresh();
                // Show success message
                window.dispatchEvent(new CustomEvent('subscription-success', {
                  detail: { plan: planType }
                }));
              } else {
                console.error('Payment verification failed');
              }
            },
            theme: {
              color: '#FF6B35',
            },
            modal: {
              ondismiss: () => {
                console.log('Razorpay modal closed');
              },
            },
          };

          const rzp = new window.Razorpay!(options);
          rzp.open();
        } catch (error) {
          console.error('Error initiating Razorpay checkout:', error);
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
          console.error('Error initiating Stripe checkout:', error);
        }
      }
    },
    [pricing, loadRazorpayScript, refresh, requireAuth, userId, user?.email]
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
      console.error('Error opening customer portal:', error);
    }
  }, [userId]);

  const value: SubscriptionContextType = {
    isLoading: isLoading || authLoading,
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
