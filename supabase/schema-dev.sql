-- SnapBeautify Development Schema (No Auth Required)
-- Run this in your Supabase SQL editor for development/testing

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a simple users table for development (without auth dependency)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert demo user for development
INSERT INTO users (id, email)
VALUES ('00000000-0000-0000-0000-000000000000', 'demo@snapbeautify.dev')
ON CONFLICT (id) DO NOTHING;

-- Drop existing tables if they exist (for clean reset)
DROP TABLE IF EXISTS daily_exports CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Subscriptions table (references local users table)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

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

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- Daily export tracking
CREATE TABLE daily_exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  export_date DATE NOT NULL DEFAULT CURRENT_DATE,
  export_count INTEGER NOT NULL DEFAULT 1,

  CONSTRAINT unique_user_date UNIQUE (user_id, export_date)
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_daily_exports_user_date ON daily_exports(user_id, export_date);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS for development (enable in production!)
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_exports DISABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION has_pro_access(check_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  sub_status TEXT;
  period_end TIMESTAMPTZ;
BEGIN
  SELECT status, current_period_end
  INTO sub_status, period_end
  FROM subscriptions
  WHERE user_id = check_user_id
  LIMIT 1;

  IF sub_status IS NULL THEN
    RETURN FALSE;
  END IF;

  IF sub_status = 'lifetime' THEN
    RETURN TRUE;
  END IF;

  IF sub_status = 'active' THEN
    IF period_end IS NULL OR period_end > NOW() THEN
      RETURN TRUE;
    END IF;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Confirm setup
SELECT 'Schema created successfully! Demo user: 00000000-0000-0000-0000-000000000000' as message;
