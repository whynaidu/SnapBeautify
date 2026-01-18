import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { upsertSubscription, logPayment } from '@/lib/subscription/supabase';
import { verifyPaymentAuth, unauthorizedResponse } from '@/lib/auth/payment-auth';
import { checkRateLimit, getClientIdentifier, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`payment:verify:${clientId}`, RATE_LIMIT_PRESETS.payment);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount,
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment fields' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Verify authenticated user matches the userId
    const auth = await verifyPaymentAuth(userId);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error || 'Unauthorized', auth.error?.includes('Forbidden') ? 403 : 401);
    }

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // For orders, signature is: order_id|payment_id
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('Signature mismatch:', {
        expected: generatedSignature,
        received: razorpay_signature,
      });
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Create lifetime subscription in database
    const subscription = await upsertSubscription({
      userId,
      provider: 'razorpay',
      razorpaySubscriptionId: razorpay_order_id, // Store order_id for reference
      status: 'lifetime',
      plan: 'lifetime',
      currency: 'INR',
      amount: amount || 2499,
      currentPeriodStart: new Date(),
      // Lifetime doesn't expire - no currentPeriodEnd
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
      amount: amount || 2499,
      currency: 'INR',
      status: 'captured',
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        plan: 'lifetime',
        status: 'lifetime',
      },
    });
  } catch (error) {
    console.error('Error verifying Razorpay order payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
