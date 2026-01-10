import { NextRequest, NextResponse } from 'next/server';
import { incrementExportCount, hasProAccess } from '@/lib/subscription/supabase';
import { FREE_TIER_LIMITS } from '@/lib/subscription/feature-gates';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      // For invalid user IDs (development mode), just return success without tracking
      return NextResponse.json({
        success: true,
        newCount: 0,
        remaining: FREE_TIER_LIMITS.exportsPerDay,
      });
    }

    // Check if user is Pro - Pro users don't need to track exports
    const isPro = await hasProAccess(userId);
    if (isPro) {
      return NextResponse.json({
        success: true,
        isPro: true,
        remaining: Infinity,
      });
    }

    // Increment export count for free users
    const newCount = await incrementExportCount(userId);
    const remaining = Math.max(0, FREE_TIER_LIMITS.exportsPerDay - newCount);

    return NextResponse.json({
      success: true,
      newCount,
      remaining,
    });
  } catch (error) {
    console.error('Error incrementing export count:', error);
    // Return success on error to not block user exports
    return NextResponse.json({
      success: true,
      newCount: 0,
      remaining: FREE_TIER_LIMITS.exportsPerDay,
    });
  }
}
