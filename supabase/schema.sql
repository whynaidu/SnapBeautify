-- SnapBeautify Subscription Schema (Production)
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean reset)
DROP TABLE IF EXISTS daily_exports CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Subscriptions table (references auth.users)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Payment provider info
  provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'stripe')),
  razorpay_subscription_id TEXT,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,

  -- Subscription details
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'expired', 'lifetime')),
  plan TEXT NOT NULL CHECK (plan IN ('free', 'monthly', 'annual', 'lifetime')),
  currency TEXT NOT NULL DEFAULT 'INR' CHECK (currency IN ('INR', 'USD')),
  amount INTEGER NOT NULL DEFAULT 0,

  -- Period tracking
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- Payments table (for transaction history)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

  -- Payment info
  provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'stripe')),
  payment_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('INR', 'USD')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'captured', 'failed', 'refunded')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily export tracking for free users
CREATE TABLE daily_exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  export_date DATE NOT NULL DEFAULT CURRENT_DATE,
  export_count INTEGER NOT NULL DEFAULT 1,

  -- Unique constraint per user per day
  CONSTRAINT unique_user_date UNIQUE (user_id, export_date)
);

-- Indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_provider ON subscriptions(provider);
CREATE INDEX idx_subscriptions_razorpay ON subscriptions(razorpay_subscription_id) WHERE razorpay_subscription_id IS NOT NULL;
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_daily_exports_user_date ON daily_exports(user_id, export_date);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to subscriptions table
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_exports ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions" ON subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all payments" ON payments
  FOR ALL
  USING (auth.role() = 'service_role');

-- Daily exports policies
CREATE POLICY "Users can view own exports" ON daily_exports
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exports" ON daily_exports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exports" ON daily_exports
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all exports" ON daily_exports
  FOR ALL
  USING (auth.role() = 'service_role');

-- Function to check if user has pro access
CREATE OR REPLACE FUNCTION has_pro_access(check_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  sub_status TEXT;
  sub_plan TEXT;
  period_end TIMESTAMPTZ;
BEGIN
  SELECT status, plan, current_period_end
  INTO sub_status, sub_plan, period_end
  FROM subscriptions
  WHERE user_id = check_user_id
  LIMIT 1;

  -- No subscription found
  IF sub_status IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Lifetime users always have access
  IF sub_status = 'lifetime' THEN
    RETURN TRUE;
  END IF;

  -- Active subscription
  IF sub_status = 'active' THEN
    -- Check if not expired
    IF period_end IS NULL OR period_end > NOW() THEN
      RETURN TRUE;
    END IF;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment daily export count
CREATE OR REPLACE FUNCTION increment_export_count(check_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Try to insert or update
  INSERT INTO daily_exports (user_id, export_date, export_count)
  VALUES (check_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, export_date)
  DO UPDATE SET export_count = daily_exports.export_count + 1
  RETURNING export_count INTO current_count;

  RETURN current_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get today's export count
CREATE OR REPLACE FUNCTION get_export_count(check_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_count INTEGER;
BEGIN
  SELECT export_count INTO current_count
  FROM daily_exports
  WHERE user_id = check_user_id AND export_date = CURRENT_DATE;

  RETURN COALESCE(current_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION has_pro_access(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_export_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_export_count(UUID) TO authenticated;

-- Confirm setup
SELECT 'Production schema created successfully!' as message;
