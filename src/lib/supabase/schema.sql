-- Divine Tarot Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  phone TEXT,
  email TEXT,
  anonymous_id TEXT UNIQUE,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_users_anonymous ON public.users(anonymous_id);
CREATE INDEX idx_users_created ON public.users(created_at DESC);

-- ============================================
-- READINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  spread_type TEXT DEFAULT '3-card',
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_readings_user ON public.readings(user_id);
CREATE INDEX idx_readings_created ON public.readings(created_at DESC);

-- ============================================
-- CARDS_DRAWN TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.cards_drawn (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID REFERENCES public.readings(id) ON DELETE CASCADE,
  card_name TEXT NOT NULL,
  card_id TEXT,
  position TEXT,
  is_reversed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cards_reading ON public.cards_drawn(reading_id);

-- ============================================
-- AI_RESPONSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID REFERENCES public.readings(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  model_used TEXT DEFAULT 'gpt-4o-mini',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_responses_reading ON public.ai_responses(reading_id);

-- ============================================
-- EVENTS TABLE (Full Funnel Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_user ON public.events(user_id);
CREATE INDEX idx_events_name ON public.events(event_name);
CREATE INDEX idx_events_created ON public.events(created_at DESC);

-- ============================================
-- USER_MEMORY TABLE (Personalization)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, key)
);

CREATE INDEX idx_user_memory_user ON public.user_memory(user_id);

-- ============================================
-- FUNNEL ANALYTICS VIEW
-- ============================================
CREATE OR REPLACE VIEW public.funnel_summary AS
SELECT 
  DATE_TRUNC('day', e.created_at) as date,
  COUNT(DISTINCT CASE WHEN e.event_name = 'landing_page_view' THEN e.user_id END) as visitors,
  COUNT(DISTINCT CASE WHEN e.event_name = 'start_reading_click' THEN e.user_id END) as started_reading,
  COUNT(DISTINCT CASE WHEN e.event_name = 'reading_completed' THEN e.user_id END) as completed_reading,
  COUNT(DISTINCT CASE WHEN e.event_name = 'ginni_opened' THEN e.user_id END) as ginni_users,
  COUNT(DISTINCT CASE WHEN e.event_name = 'booking_page_visit' THEN e.user_id END) as booking_visits,
  COUNT(DISTINCT CASE WHEN e.event_name = 'booking_submitted' THEN e.user_id END) as bookings
FROM public.events e
WHERE e.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', e.created_at)
ORDER BY date DESC;

-- ============================================
-- USER RETENTION VIEW
-- ============================================
CREATE OR REPLACE VIEW public.user_retention AS
SELECT 
  DATE_TRUNC('day', u.created_at) as signup_date,
  COUNT(*) as total_users,
  COUNT(DISTINCT CASE WHEN a.readings > 0 THEN u.id END) as returning_users,
  ROUND(COUNT(CASE WHEN a.readings > 0 THEN 1 END)::numeric / COUNT(*)::numeric * 100, 1) as return_rate_percent
FROM public.users u
LEFT JOIN (
  SELECT user_id, COUNT(*) as readings 
  FROM public.readings 
  GROUP BY user_id
) a ON u.id = a.user_id
WHERE u.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', u.created_at)
ORDER BY signup_date DESC;

-- ============================================
-- USER STATS FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_readings', COUNT(r.id),
    'last_reading', MAX(r.created_at),
    'memory_entries', COUNT(m.key)
  ) INTO stats
  FROM public.readings r
  LEFT JOIN public.user_memory m ON m.user_id = user_uuid
  WHERE r.user_id = user_uuid;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ENABLE ROW LEVEL SECURITY (Optional - for public reads)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to analytics
CREATE POLICY "Enable read access for all users" ON public.funnel_summary FOR SELECT USING (true);
CREATE POLICY "Enable read access for user retention" ON public.user_retention FOR SELECT USING (true);

-- ============================================
-- SUBSCRIPTION & PAYMENT SCHEMA (v2 Additions)
-- ============================================

-- Add subscription columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS readings_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reading_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS total_readings INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS razorpay_subscription_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- Subscription events tracking table
CREATE TABLE IF NOT EXISTS public.subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscription_events_user ON public.subscription_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_type ON public.subscription_events(event_type);

-- Track subscription event
CREATE OR REPLACE FUNCTION track_subscription_event(
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

-- Increment reading count with daily reset
CREATE OR REPLACE FUNCTION increment_reading_count(
  p_user_id UUID,
  p_reading_date VARCHAR DEFAULT to_char(NOW(), 'YYYY-MM-DD')
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
        total_readings = total_readings + 1,
        updated_at = NOW()
    WHERE id = p_user_id;
  ELSE
    UPDATE users 
    SET readings_today = v_current_count + 1,
        total_readings = total_readings + 1,
        last_reading_date = NOW(),
        updated_at = NOW()
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Get remaining free messages for today
CREATE OR REPLACE FUNCTION get_remaining_messages(
  p_user_id UUID,
  p_plan VARCHAR DEFAULT 'free'
)
RETURNS INTEGER AS $$
DECLARE
  v_readings_today INTEGER;
  v_last_reading_date TIMESTAMPTZ;
  v_today DATE;
BEGIN
  IF p_plan = 'premium' THEN
    RETURN -1;
  END IF;

  v_today := CURRENT_DATE;
  
  SELECT readings_today, last_reading_date 
  INTO v_readings_today, v_last_reading_date
  FROM users 
  WHERE id = p_user_id;

  IF v_last_reading_date IS NULL OR DATE(v_last_reading_date) != v_today THEN
    RETURN 1;
  END IF;

  RETURN GREATEST(0, 1 - COALESCE(v_readings_today, 0));
END;
$$ LANGUAGE plpgsql;

-- Log payment transaction
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
-- ============================================
-- NEWSLETTER_SUBSCRIBERS TABLE
-- Added for the newsletter signup pipeline (Footer form -> /api/subscribe).
-- ============================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'subscribed',      -- subscribed | unsubscribed
  source TEXT DEFAULT 'website',                   -- where the signup came from
  locale TEXT,                                     -- en | hi | hinglish (if known)
  ip_hash TEXT,                                    -- optional, privacy-preserving
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(lower(email));
CREATE INDEX IF NOT EXISTS idx_newsletter_created ON public.newsletter_subscribers(created_at DESC);

-- Row Level Security: only the service role (server) may read/write.
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
