import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserSubscription } from '@/lib/subscription/supabase';

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
    const body = await request.json();
    const { userId, returnUrl } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Get user's subscription to find Stripe customer ID
    const subscription = await getUserSubscription(userId);

    if (!subscription || !subscription.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe subscription found for this user' },
        { status: 404 }
      );
    }

    const stripe = getStripeInstance();

    // Create billing portal session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: returnUrl || `${baseUrl}/settings`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating Stripe portal:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create portal session: ${errorMessage}` },
      { status: 500 }
    );
  }
}
