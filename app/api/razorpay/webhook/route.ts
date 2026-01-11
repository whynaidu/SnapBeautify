import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateSubscriptionStatus, logPayment, upsertSubscription } from '@/lib/subscription/supabase';
import type { SubscriptionPlan } from '@/lib/subscription/types';

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
        charge_at?: number;
        auth_attempts?: number;
        paid_count?: number;
        customer_id?: string;
        notes?: Record<string, string>;
      };
    };
    payment?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        method?: string; // 'upi', 'card', 'netbanking', etc.
        subscription_id?: string;
        order_id?: string;
        vpa?: string; // UPI VPA for UPI payments
        bank?: string;
        wallet?: string;
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
      // UPI AutoPay: Mandate created, customer authenticated (first step)
      case 'subscription.authenticated': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        const userId = subscription.notes?.userId;
        console.log('Subscription authenticated (mandate created):', {
          subscriptionId: subscription.id,
          userId,
          status: subscription.status,
        });

        // Mandate is created but subscription is not yet active
        // Wait for subscription.activated or subscription.charged
        break;
      }

      // Subscription is now active and ready for charges
      case 'subscription.activated': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        const userId = subscription.notes?.userId;
        const planTypeFromNotes = subscription.notes?.planType;

        if (!userId) {
          console.error('No userId in subscription notes');
          break;
        }

        // Determine plan type from notes or plan_id
        let planType: SubscriptionPlan = 'monthly';
        if (planTypeFromNotes === 'annual' || subscription.plan_id.toLowerCase().includes('annual')) {
          planType = 'annual';
        }

        console.log('Subscription activated:', {
          subscriptionId: subscription.id,
          userId,
          planType,
          currentStart: new Date(subscription.current_start * 1000),
          currentEnd: new Date(subscription.current_end * 1000),
          paidCount: subscription.paid_count,
        });

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

      // Recurring payment successful (auto-debit)
      case 'subscription.charged': {
        const subscription = event.payload.subscription?.entity;
        const payment = event.payload.payment?.entity;
        if (!subscription || !payment) break;

        const userId = subscription.notes?.userId;

        console.log('Subscription charged (recurring payment):', {
          subscriptionId: subscription.id,
          paymentId: payment.id,
          userId,
          amount: payment.amount / 100,
          method: payment.method, // 'upi', 'card', etc.
          vpa: payment.vpa, // UPI VPA if UPI payment
          paidCount: subscription.paid_count,
          nextChargeAt: subscription.charge_at
            ? new Date(subscription.charge_at * 1000)
            : null,
        });

        // Update subscription period
        await updateSubscriptionStatus(
          subscription.id,
          'active',
          new Date(subscription.current_end * 1000)
        );

        // Log payment
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

      // Payment pending (awaiting authentication or bank processing)
      case 'subscription.pending': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        console.log('Subscription pending (payment awaiting):', {
          subscriptionId: subscription.id,
          userId: subscription.notes?.userId,
          authAttempts: subscription.auth_attempts,
        });

        await updateSubscriptionStatus(subscription.id, 'past_due');
        break;
      }

      // Subscription halted after multiple failed payment attempts
      case 'subscription.halted': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        console.log('Subscription halted (payment failed after retries):', {
          subscriptionId: subscription.id,
          userId: subscription.notes?.userId,
        });

        await updateSubscriptionStatus(subscription.id, 'expired');
        break;
      }

      // User or admin cancelled the subscription
      case 'subscription.cancelled': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        console.log('Subscription cancelled:', {
          subscriptionId: subscription.id,
          userId: subscription.notes?.userId,
        });

        await updateSubscriptionStatus(subscription.id, 'cancelled');
        break;
      }

      // Subscription paused (user requested pause)
      case 'subscription.paused': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        console.log('Subscription paused:', {
          subscriptionId: subscription.id,
          userId: subscription.notes?.userId,
        });

        // Keep as active but note it's paused (or create a new status)
        await updateSubscriptionStatus(subscription.id, 'cancelled');
        break;
      }

      // Subscription resumed after pause
      case 'subscription.resumed': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        console.log('Subscription resumed:', {
          subscriptionId: subscription.id,
          userId: subscription.notes?.userId,
        });

        await updateSubscriptionStatus(
          subscription.id,
          'active',
          new Date(subscription.current_end * 1000)
        );
        break;
      }

      // All billing cycles completed
      case 'subscription.completed': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        console.log('Subscription completed (all cycles done):', {
          subscriptionId: subscription.id,
          userId: subscription.notes?.userId,
          paidCount: subscription.paid_count,
        });

        // Mark as expired when all cycles complete
        await updateSubscriptionStatus(subscription.id, 'expired');
        break;
      }

      // One-time payment captured (lifetime purchase or direct payment)
      case 'payment.captured': {
        const payment = event.payload.payment?.entity;
        if (!payment) break;

        const userId = payment.notes?.userId;

        console.log('Payment captured:', {
          paymentId: payment.id,
          orderId: payment.order_id,
          userId,
          amount: payment.amount / 100,
          method: payment.method,
          vpa: payment.vpa,
          subscriptionId: payment.subscription_id,
        });

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

      // Payment failed
      case 'payment.failed': {
        const payment = event.payload.payment?.entity;
        if (!payment) break;

        const userId = payment.notes?.userId;

        console.log('Payment failed:', {
          paymentId: payment.id,
          userId,
          amount: payment.amount / 100,
          method: payment.method,
          subscriptionId: payment.subscription_id,
        });

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

      // Order paid (for one-time payments like lifetime)
      case 'order.paid': {
        const payment = event.payload.payment?.entity;
        if (!payment) break;

        console.log('Order paid:', {
          paymentId: payment.id,
          orderId: payment.order_id,
          userId: payment.notes?.userId,
          amount: payment.amount / 100,
          method: payment.method,
        });
        // Actual subscription creation happens in verify-order endpoint
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
