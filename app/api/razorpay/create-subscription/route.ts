import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { RAZORPAY_PLAN_IDS } from '@/lib/subscription/pricing';

// Initialize Razorpay instance
function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planType, userId, email, name } = body;

    if (!planType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: planType, userId' },
        { status: 400 }
      );
    }

    // Validate plan type
    if (!['monthly', 'annual'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type. Must be "monthly" or "annual"' },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayInstance();

    // Get plan ID based on plan type
    const planId = RAZORPAY_PLAN_IDS[planType as keyof typeof RAZORPAY_PLAN_IDS];

    // Create subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: planType === 'monthly' ? 12 : 1, // 12 months for monthly, 1 for annual
      notes: {
        userId,
        email: email || '',
        name: name || '',
        planType,
      },
    }) as { id: string; plan_id?: string };

    // Get amount based on plan type
    const amount = planType === 'monthly' ? 19900 : 99900; // In paise

    return NextResponse.json({
      subscriptionId: subscription.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount,
      currency: 'INR',
    });
  } catch (error) {
    console.error('Error creating Razorpay subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
