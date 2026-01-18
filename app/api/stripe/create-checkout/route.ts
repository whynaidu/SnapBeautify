import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { STRIPE_PRICE_IDS } from '@/lib/subscription/pricing';
import { verifyPaymentAuth, unauthorizedResponse } from '@/lib/auth/payment-auth';
import { checkRateLimit, getClientIdentifier, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

// Initialize Stripe
function getStripeInstance() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Stripe secret key not configured');
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover',
  });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`payment:stripe:${clientId}`, RATE_LIMIT_PRESETS.payment);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { planType, userId, email, successUrl, cancelUrl } = body;

    if (!planType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: planType, userId' },
        { status: 400 }
      );
    }

    // Verify authenticated user matches the userId
    const auth = await verifyPaymentAuth(userId);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error || 'Unauthorized', auth.error?.includes('Forbidden') ? 403 : 401);
    }

    // Validate plan type
    if (!['monthly', 'annual', 'lifetime'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type. Must be "monthly", "annual", or "lifetime"' },
        { status: 400 }
      );
    }

    const stripe = getStripeInstance();

    // Get price ID based on plan type
    const priceId = STRIPE_PRICE_IDS[planType as keyof typeof STRIPE_PRICE_IDS];

    // Determine if this is a subscription or one-time payment
    const isLifetime = planType === 'lifetime';

    // Get or create customer
    let customerId: string | undefined;
    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email,
          metadata: { userId },
        });
        customerId = customer.id;
      }
    }

    // Build success and cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const finalSuccessUrl = successUrl || `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || `${baseUrl}/pricing`;

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: isLifetime ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: {
        userId,
        planType,
      },
      ...(customerId && { customer: customerId }),
      ...(email && !customerId && { customer_email: email }),
    };

    // For subscriptions, add subscription metadata
    if (!isLifetime) {
      sessionParams.subscription_data = {
        metadata: {
          userId,
          planType,
        },
      };
    }

    // For one-time payments (lifetime), add payment intent metadata
    if (isLifetime) {
      sessionParams.payment_intent_data = {
        metadata: {
          userId,
          planType,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error creating Stripe checkout:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create checkout session: ${errorMessage}` },
      { status: 500 }
    );
  }
}
