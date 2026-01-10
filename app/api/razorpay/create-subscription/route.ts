import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { RAZORPAY_PLAN_IDS } from '@/lib/subscription/pricing';

// Initialize Razorpay instance
function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    console.error('Razorpay credentials missing:', {
      hasKeyId: !!keyId,
      hasKeySecret: !!keySecret,
      keyIdPrefix: keyId?.substring(0, 10)
    });
    throw new Error('Razorpay credentials not configured');
  }

  // Log key format for debugging (only prefix)
  console.log('Razorpay init:', {
    keyIdPrefix: keyId.substring(0, 12) + '...',
    keyIdLength: keyId.length,
    isTestMode: keyId.startsWith('rzp_test_')
  });

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

    // Create subscription with UPI AutoPay support
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: planType === 'monthly' ? 120 : 10, // Allow up to 10 years of renewals
      notes: {
        userId,
        email: email || '',
        name: name || '',
        planType,
      },
      // Expire the subscription link after 30 minutes if not completed
      expire_by: Math.floor(Date.now() / 1000) + 1800,
    }) as { id: string; plan_id?: string; short_url?: string };

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
