import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import type { Subscription, SubscriptionPlan, SubscriptionStatus, PaymentProvider } from './types';

// Subscription row type from database
export interface SubscriptionRow {
  id: string;
  user_id: string;
  provider: PaymentProvider;
  razorpay_subscription_id: string | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  currency: 'INR' | 'USD';
  amount: number;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

// Payment row type from database
export interface PaymentRow {
  id: string;
  user_id: string;
  subscription_id: string | null;
  provider: PaymentProvider;
  payment_id: string;
  amount: number;
  currency: 'INR' | 'USD';
  status: 'pending' | 'captured' | 'failed' | 'refunded';
  created_at: string;
}

// Insert types
export type SubscriptionInsert = Omit<SubscriptionRow, 'id' | 'created_at' | 'updated_at'>;
export type PaymentInsert = Omit<PaymentRow, 'id' | 'created_at'>;

// Server-side Supabase client (for API routes)
let serverClient: SupabaseClient | null = null;

export function createServerClient(): SupabaseClient {
  if (serverClient) return serverClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  serverClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return serverClient;
}

// Browser-side Supabase client
export function createClientSide(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Transform database row to Subscription type
export function transformSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    provider: row.provider,
    razorpaySubscriptionId: row.razorpay_subscription_id || undefined,
    stripeSubscriptionId: row.stripe_subscription_id || undefined,
    stripeCustomerId: row.stripe_customer_id || undefined,
    status: row.status,
    plan: row.plan,
    currency: row.currency,
    amount: row.amount,
    currentPeriodStart: row.current_period_start ? new Date(row.current_period_start) : undefined,
    currentPeriodEnd: row.current_period_end ? new Date(row.current_period_end) : undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Get user's active subscription
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['active', 'lifetime'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return transformSubscription(data as SubscriptionRow);
}

// Check if user has pro access
export async function hasProAccess(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return false;
  }

  // Lifetime users always have access
  if (subscription.status === 'lifetime') {
    return true;
  }

  // Check if subscription is active and not expired
  if (subscription.status === 'active') {
    if (subscription.currentPeriodEnd) {
      return new Date() < subscription.currentPeriodEnd;
    }
    return true;
  }

  return false;
}

// Upsert subscription (create or update)
export async function upsertSubscription(
  subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Subscription | null> {
  const supabase = createServerClient();

  const insertData: SubscriptionInsert = {
    user_id: subscription.userId,
    provider: subscription.provider,
    razorpay_subscription_id: subscription.razorpaySubscriptionId || null,
    stripe_subscription_id: subscription.stripeSubscriptionId || null,
    stripe_customer_id: subscription.stripeCustomerId || null,
    status: subscription.status,
    plan: subscription.plan,
    currency: subscription.currency,
    amount: subscription.amount,
    current_period_start: subscription.currentPeriodStart?.toISOString() || null,
    current_period_end: subscription.currentPeriodEnd?.toISOString() || null,
  };

  const { data, error } = await supabase
    .from('subscriptions')
    .upsert(insertData, {
      onConflict: 'user_id',
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error upserting subscription:', error);
    return null;
  }

  return transformSubscription(data as SubscriptionRow);
}

// Update subscription status
export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: SubscriptionStatus,
  periodEnd?: Date
): Promise<boolean> {
  const supabase = createServerClient();

  const updateData: Partial<SubscriptionInsert> = {
    status,
  };

  if (periodEnd) {
    updateData.current_period_end = periodEnd.toISOString();
  }

  const { error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .or(`razorpay_subscription_id.eq.${subscriptionId},stripe_subscription_id.eq.${subscriptionId}`);

  return !error;
}

// Log payment
export async function logPayment(payment: PaymentInsert): Promise<boolean> {
  const supabase = createServerClient();

  const { error } = await supabase
    .from('payments')
    .insert(payment);

  return !error;
}

// Get user's export count for today
export async function getExportCount(userId: string): Promise<number> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .rpc('get_export_count', { check_user_id: userId });

  if (error) {
    console.error('Error getting export count:', error);
    return 0;
  }

  return data || 0;
}

// Increment user's export count
export async function incrementExportCount(userId: string): Promise<number> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .rpc('increment_export_count', { check_user_id: userId });

  if (error) {
    console.error('Error incrementing export count:', error);
    return 0;
  }

  return data || 0;
}
