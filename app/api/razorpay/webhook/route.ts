import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateSubscriptionStatus, logPayment, upsertSubscription } from '@/lib/subscription/supabase';
import type { SubscriptionPlan, SubscriptionStatus } from '@/lib/subscription/types';

// Razorpay webhook event types
interface RazorpayWebhookEvent {
  event: string;
  payload: {
    subscription?: {
      entity: {
        id: string;
        plan_id: string;
        status: string;
        current_start: number;
        current_end: number;
        notes?: Record<string, string>;
      };
    };
    payment?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        subscription_id?: string;
        notes?: Record<string, string>;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Razorpay webhook secret not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        );
      }
    }

    const event: RazorpayWebhookEvent = JSON.parse(body);
    console.log('Razorpay webhook event:', event.event);

    switch (event.event) {
      case 'subscription.activated': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        const userId = subscription.notes?.userId;
        if (!userId) {
          console.error('No userId in subscription notes');
          break;
        }

        // Determine plan type from plan_id
        const planType: SubscriptionPlan = subscription.plan_id.includes('annual')
          ? 'annual'
          : 'monthly';

        await upsertSubscription({
          userId,
          provider: 'razorpay',
          razorpaySubscriptionId: subscription.id,
          status: 'active',
          plan: planType,
          currency: 'INR',
          amount: planType === 'monthly' ? 199 : 999,
          currentPeriodStart: new Date(subscription.current_start * 1000),
          currentPeriodEnd: new Date(subscription.current_end * 1000),
        });
        break;
      }

      case 'subscription.charged': {
        const subscription = event.payload.subscription?.entity;
        const payment = event.payload.payment?.entity;
        if (!subscription || !payment) break;

        // Update subscription period
        await updateSubscriptionStatus(
          subscription.id,
          'active',
          new Date(subscription.current_end * 1000)
        );

        // Log payment
        const userId = subscription.notes?.userId;
        if (userId) {
          await logPayment({
            user_id: userId,
            subscription_id: null, // We don't have the DB subscription ID here
            provider: 'razorpay',
            payment_id: payment.id,
            amount: payment.amount / 100, // Razorpay uses paise
            currency: 'INR',
            status: 'captured',
          });
        }
        break;
      }

      case 'subscription.pending': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        await updateSubscriptionStatus(subscription.id, 'past_due');
        break;
      }

      case 'subscription.halted':
      case 'subscription.cancelled': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        const status: SubscriptionStatus = event.event === 'subscription.cancelled'
          ? 'cancelled'
          : 'expired';
        await updateSubscriptionStatus(subscription.id, status);
        break;
      }

      case 'subscription.completed': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        // For annual plans, mark as expired when completed
        await updateSubscriptionStatus(subscription.id, 'expired');
        break;
      }

      case 'payment.captured': {
        const payment = event.payload.payment?.entity;
        if (!payment) break;

        const userId = payment.notes?.userId;
        if (userId) {
          await logPayment({
            user_id: userId,
            subscription_id: null,
            provider: 'razorpay',
            payment_id: payment.id,
            amount: payment.amount / 100,
            currency: 'INR',
            status: 'captured',
          });
        }
        break;
      }

      case 'payment.failed': {
        const payment = event.payload.payment?.entity;
        if (!payment) break;

        const userId = payment.notes?.userId;
        if (userId) {
          await logPayment({
            user_id: userId,
            subscription_id: null,
            provider: 'razorpay',
            payment_id: payment.id,
            amount: payment.amount / 100,
            currency: 'INR',
            status: 'failed',
          });
        }
        break;
      }

      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Razorpay webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
