-- Divine Tarot Payment & Subscription Schema
-- Run this in your Supabase SQL Editor

-- Add subscription fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS readings_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reading_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS total_readings INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS razorpay_subscription_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'pending',
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_subscription_id VARCHAR(100),
  plan_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Create subscription_events table for tracking
CREATE TABLE IF NOT EXISTS public.subscription_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_subscription_events_user ON public.subscription_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_type ON public.subscription_events(event_type);

-- Create function to track events
CREATE OR REPLACE FUNCTION track_event(
  p_user_id UUID,
  p_event_type VARCHAR(50),
  p_event_data JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.subscription_events (user_id, event_type, event_data)
  VALUES (p_user_id, p_event_type, p_event_data);
END;
$$ LANGUAGE plpgsql;

-- Function to increment reading count
CREATE OR REPLACE FUNCTION increment_reading_count(
  p_user_id UUID,
  p_reading_date VARCHAR
)
RETURNS VOID AS $$
DECLARE
  v_current_count INTEGER;
  v_last_date TIMESTAMPTZ;
BEGIN
  SELECT readings_today, last_reading_date 
  INTO v_current_count, v_last_date
  FROM users 
  WHERE id = p_user_id;

  IF v_last_date IS NULL OR to_char(v_last_date, 'YYYY-MM-DD') != p_reading_date THEN
    UPDATE users 
    SET readings_today = 1, 
        last_reading_date = NOW(),
        total_readings = total_readings + 1
    WHERE id = p_user_id;
  ELSE
    UPDATE users 
    SET readings_today = v_current_count + 1,
        total_readings = total_readings + 1,
        last_reading_date = NOW()
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to log payment
CREATE OR REPLACE FUNCTION log_payment(
  p_user_id UUID,
  p_amount INTEGER,
  p_plan_type VARCHAR,
  p_status VARCHAR,
  p_order_id VARCHAR,
  p_payment_id VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_payment_id UUID;
BEGIN
  INSERT INTO public.payments (
    user_id, amount, plan_type, status, 
    razorpay_order_id, razorpay_payment_id, paid_at
  )
  VALUES (
    p_user_id, p_amount, p_plan_type, p_status,
    p_order_id, p_payment_id, 
    CASE WHEN p_status = 'completed' THEN NOW() ELSE NULL END
  )
  RETURNING id INTO v_payment_id;

  RETURN v_payment_id;
END;
$$ LANGUAGE plpgsql;

-- Seed data for testing (optional)
-- INSERT INTO public.users (phone, email, name, plan, subscription_status) 
-- VALUES ('+1234567890', 'test@example.com', 'Test User', 'free', 'inactive');