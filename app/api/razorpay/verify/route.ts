import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { upsertSubscription, logPayment } from '@/lib/subscription/supabase';
import type { SubscriptionPlan } from '@/lib/subscription/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      userId,
      planType,
      amount,
    } = body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment fields' },
        { status: 400 }
      );
    }

    if (!userId || !planType) {
      return NextResponse.json(
        { error: 'Missing userId or planType' },
        { status: 400 }
      );
    }

    // Verify signature
    const webhookSecret = process.env.RAZORPAY_KEY_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Calculate period end based on plan type
    const now = new Date();
    const periodEnd = new Date(now);
    if (planType === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else if (planType === 'annual') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    // Create/update subscription in database
    const subscription = await upsertSubscription({
      userId,
      provider: 'razorpay',
      razorpaySubscriptionId: razorpay_subscription_id,
      status: 'active',
      plan: planType as SubscriptionPlan,
      currency: 'INR',
      amount: amount || (planType === 'monthly' ? 199 : 999),
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      );
    }

    // Log payment
    await logPayment({
      user_id: userId,
      subscription_id: subscription.id,
      provider: 'razorpay',
      payment_id: razorpay_payment_id,
      amount: amount || (planType === 'monthly' ? 199 : 999),
      currency: 'INR',
      status: 'captured',
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        expiresAt: subscription.currentPeriodEnd?.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
