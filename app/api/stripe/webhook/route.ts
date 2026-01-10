import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { upsertSubscription, updateSubscriptionStatus, logPayment } from '@/lib/subscription/supabase';
import type { SubscriptionPlan, SubscriptionStatus } from '@/lib/subscription/types';

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
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const stripe = getStripeInstance();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Stripe webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planType = session.metadata?.planType as SubscriptionPlan;

        if (!userId || !planType) {
          console.error('Missing metadata in checkout session');
          break;
        }

        // Handle one-time payment (lifetime)
        if (session.mode === 'payment') {
          await upsertSubscription({
            userId,
            provider: 'stripe',
            stripeCustomerId: session.customer as string,
            status: 'lifetime',
            plan: 'lifetime',
            currency: 'USD',
            amount: session.amount_total ? session.amount_total / 100 : 149,
            currentPeriodStart: new Date(),
            // Lifetime doesn't expire
          });
        }
        // Subscription will be handled by customer.subscription.created
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const planType = subscription.metadata?.planType as SubscriptionPlan;

        if (!userId) {
          console.error('Missing userId in subscription metadata');
          break;
        }

        const status: SubscriptionStatus =
          subscription.status === 'active' ? 'active' :
          subscription.status === 'past_due' ? 'past_due' :
          subscription.status === 'canceled' ? 'cancelled' :
          'expired';

        // Access period dates - handle both old and new Stripe API property names
        const subData = subscription as unknown as Record<string, unknown>;
        const periodStart = (subData.current_period_start || subData.currentPeriodStart) as number;
        const periodEnd = (subData.current_period_end || subData.currentPeriodEnd) as number;

        await upsertSubscription({
          userId,
          provider: 'stripe',
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          status,
          plan: planType || (subscription.items.data[0]?.price?.recurring?.interval === 'year' ? 'annual' : 'monthly'),
          currency: 'USD',
          amount: subscription.items.data[0]?.price?.unit_amount
            ? subscription.items.data[0].price.unit_amount / 100
            : 0,
          currentPeriodStart: periodStart ? new Date(periodStart * 1000) : new Date(),
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await updateSubscriptionStatus(subscription.id, 'cancelled');
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        // Access via record for type safety with newer Stripe API
        const invoiceData = invoice as unknown as Record<string, unknown>;
        const subDetails = invoiceData.subscription_details as Record<string, unknown> | undefined;
        const userId = (subDetails?.metadata as Record<string, string> | undefined)?.userId;
        const subscription = invoiceData.subscription as string | undefined;
        const paymentIntent = invoiceData.payment_intent as string | undefined;
        const amountPaid = (invoiceData.amount_paid as number) || 0;

        if (userId && subscription) {
          await logPayment({
            user_id: userId,
            subscription_id: null,
            provider: 'stripe',
            payment_id: paymentIntent || (invoiceData.id as string),
            amount: amountPaid / 100,
            currency: 'USD',
            status: 'captured',
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const invoiceData = invoice as unknown as Record<string, unknown>;
        const subscriptionId = invoiceData.subscription as string | undefined;

        if (subscriptionId) {
          await updateSubscriptionStatus(subscriptionId, 'past_due');
        }

        const subDetails = invoiceData.subscription_details as Record<string, unknown> | undefined;
        const userId = (subDetails?.metadata as Record<string, string> | undefined)?.userId;
        const amountDue = (invoiceData.amount_due as number) || 0;
        const paymentIntent = invoiceData.payment_intent as string | undefined;

        if (userId) {
          await logPayment({
            user_id: userId,
            subscription_id: null,
            provider: 'stripe',
            payment_id: paymentIntent || (invoiceData.id as string),
            amount: amountDue / 100,
            currency: 'USD',
            status: 'failed',
          });
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const piData = paymentIntent as unknown as Record<string, unknown>;
        const metadata = piData.metadata as Record<string, string> | undefined;
        const userId = metadata?.userId;
        const invoice = piData.invoice as string | undefined;
        const amount = (piData.amount as number) || 0;
        const id = piData.id as string;

        // Log one-time payment (lifetime deal)
        if (userId && !invoice) {
          await logPayment({
            user_id: userId,
            subscription_id: null,
            provider: 'stripe',
            payment_id: id,
            amount: amount / 100,
            currency: 'USD',
            status: 'captured',
          });
        }
        break;
      }

      default:
        console.log('Unhandled Stripe webhook event:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
