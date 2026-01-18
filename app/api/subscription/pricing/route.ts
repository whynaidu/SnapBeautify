import { NextResponse } from 'next/server';
import { getCurrentPricing, calculateAnnualSavings, getMonthlyEquivalent } from '@/lib/subscription/pricing';

// Cache headers for pricing data (relatively static)
const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
  // s-maxage=3600: CDN caches for 1 hour
  // stale-while-revalidate=86400: Serve stale for 24h while revalidating in background
};

export async function GET() {
  try {
    const pricing = await getCurrentPricing();
    const savings = calculateAnnualSavings(pricing);
    const monthlyEquivalent = getMonthlyEquivalent(pricing);

    return NextResponse.json(
      {
        ...pricing,
        annualSavings: savings,
        monthlyEquivalent,
      },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error getting pricing:', error);
    return NextResponse.json(
      { error: 'Failed to get pricing' },
      { status: 500 }
    );
  }
}
