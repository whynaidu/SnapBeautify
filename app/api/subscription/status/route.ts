import { NextRequest, NextResponse } from 'next/server';
import { getUserSubscription, hasProAccess, getExportCount } from '@/lib/subscription/supabase';
import { FREE_TIER_LIMITS } from '@/lib/subscription/feature-gates';
import type { SubscriptionStatusResponse } from '@/lib/subscription/types';

// Default response for when database is not available
const DEFAULT_RESPONSE: SubscriptionStatusResponse & {
  exportCount: number;
  exportsRemaining: number;
} = {
  isPro: false,
  subscription: null,
  plan: 'free',
  expiresAt: null,
  exportCount: 0,
  exportsRemaining: FREE_TIER_LIMITS.exportsPerDay,
};

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      // Return default free tier for invalid user IDs (development mode)
      return NextResponse.json(DEFAULT_RESPONSE);
    }

    const [subscription, isPro, exportCount] = await Promise.all([
      getUserSubscription(userId).catch(() => null),
      hasProAccess(userId).catch(() => false),
      getExportCount(userId).catch(() => 0),
    ]);

    const response: SubscriptionStatusResponse & {
      exportCount: number;
      exportsRemaining: number;
    } = {
      isPro,
      subscription,
      plan: subscription?.plan || 'free',
      expiresAt: subscription?.currentPeriodEnd?.toISOString() || null,
      exportCount,
      exportsRemaining: isPro
        ? Infinity
        : Math.max(0, FREE_TIER_LIMITS.exportsPerDay - exportCount),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting subscription status:', error);
    // Return default free tier on error instead of 500
    return NextResponse.json(DEFAULT_RESPONSE);
  }
}
