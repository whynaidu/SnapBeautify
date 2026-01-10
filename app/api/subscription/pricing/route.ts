import { NextResponse } from 'next/server';
import { getCurrentPricing, calculateAnnualSavings, getMonthlyEquivalent } from '@/lib/subscription/pricing';

export async function GET() {
  try {
    const pricing = await getCurrentPricing();
    const savings = calculateAnnualSavings(pricing);
    const monthlyEquivalent = getMonthlyEquivalent(pricing);

    return NextResponse.json({
      ...pricing,
      annualSavings: savings,
      monthlyEquivalent,
    });
  } catch (error) {
    console.error('Error getting pricing:', error);
    return NextResponse.json(
      { error: 'Failed to get pricing' },
      { status: 500 }
    );
  }
}
