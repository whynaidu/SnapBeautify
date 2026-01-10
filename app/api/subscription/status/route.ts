import { NextRequest, NextResponse } from 'next/server';
import { getUserSubscription, hasProAccess, getExportCount } from '@/lib/subscription/supabase';
import { FREE_TIER_LIMITS } from '@/lib/subscription/feature-gates';
import type { SubscriptionStatusResponse } from '@/lib/subscription/types';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const [subscription, isPro, exportCount] = await Promise.all([
      getUserSubscription(userId),
      hasProAccess(userId),
      getExportCount(userId),
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
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}
