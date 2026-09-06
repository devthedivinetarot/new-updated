-- Divine Tarot Database Schema
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extended profile)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE,
  email TEXT,
  name TEXT,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  readings_count INTEGER DEFAULT 0,
  booking_intent BOOLEAN DEFAULT FALSE,
  session_count INTEGER DEFAULT 0,
  last_question TEXT,
  last_reading_topic TEXT,
  last_reading_emotion TEXT,
  segment VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp message logs
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  twilio_message_id TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_segment ON public.users(segment);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON public.users(last_active_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_user ON public.whatsapp_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_sent ON public.whatsapp_logs(sent_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to get users needing daily message
CREATE OR REPLACE FUNCTION get_users_for_daily_message()
RETURNS TABLE (
  id UUID,
  phone TEXT,
  segment VARCHAR(50),
  last_active_at TIMESTAMPTZ,
  readings_count INTEGER,
  last_question TEXT,
  last_reading_topic TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.phone,
    u.segment,
    u.last_active_at,
    u.readings_count,
    u.last_question,
    u.last_reading_topic
  FROM public.users u
  WHERE u.phone IS NOT NULL
    AND u.phone != ''
    AND (
      u.last_active_at IS NULL 
      OR u.last_active_at > NOW() - INTERVAL '20 hours'
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.whatsapp_logs wl
      WHERE wl.user_id = u.id
        AND wl.sent_at > NOW() - INTERVAL '20 hours'
    )
  ORDER BY 
    CASE u.segment
      WHEN 'high-intent' THEN 1
      WHEN 'cold' THEN 4
      WHEN 'inactive' THEN 2
      WHEN 'active' THEN 3
      ELSE 5
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to get users needing reactivation
CREATE OR REPLACE FUNCTION get_users_needing_reactivation()
RETURNS TABLE (
  id UUID,
  phone TEXT,
  segment VARCHAR(50),
  last_active_at TIMESTAMPTZ,
  readings_count INTEGER,
  last_question TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.phone,
    u.segment,
    u.last_active_at,
    u.readings_count,
    u.last_question
  FROM public.users u
  WHERE u.phone IS NOT NULL
    AND u.phone != ''
    AND u.last_active_at <= NOW() - INTERVAL '3 days'
    AND u.last_active_at > NOW() - INTERVAL '30 days'
    AND NOT EXISTS (
      SELECT 1 FROM public.whatsapp_logs wl
      WHERE wl.user_id = u.id
        AND wl.type IN ('reactivation', 'cold-reactivation')
        AND wl.sent_at > NOW() - INTERVAL '7 days'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get high intent users
CREATE OR REPLACE FUNCTION get_high_intent_users()
RETURNS TABLE (
  id UUID,
  phone TEXT,
  segment VARCHAR(50),
  readings_count INTEGER,
  last_question TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.phone,
    u.segment,
    u.readings_count,
    u.last_question
  FROM public.users u
  WHERE u.phone IS NOT NULL
    AND u.phone != ''
    AND (u.booking_intent = TRUE OR u.readings_count >= 2)
    AND NOT EXISTS (
      SELECT 1 FROM public.whatsapp_logs wl
      WHERE wl.user_id = u.id
        AND wl.type = 'conversion'
        AND wl.sent_at > NOW() - INTERVAL '3 days'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to segment a user
CREATE OR REPLACE FUNCTION segment_user(p_user_id UUID)
RETURNS VARCHAR(50) AS $$
DECLARE
  v_last_active TIMESTAMPTZ;
  v_days_since INTEGER;
  v_readings INTEGER;
  v_booking_intent BOOLEAN;
  v_segment VARCHAR(50);
BEGIN
  SELECT 
    u.last_active_at,
    u.readings_count,
    u.booking_intent
  INTO v_last_active, v_readings, v_booking_intent
  FROM public.users u
  WHERE u.id = p_user_id;

  IF v_booking_intent OR v_readings >= 2 THEN
    v_segment := 'high-intent';
  ELSIF v_last_active IS NULL OR v_last_active > NOW() - INTERVAL '1 day' THEN
    v_segment := CASE WHEN v_readings <= 1 THEN 'new' ELSE 'active' END;
  ELSIF v_last_active > NOW() - INTERVAL '7 days' THEN
    v_segment := 'inactive';
  ELSE
    v_segment := 'cold';
  END IF;

  UPDATE public.users 
  SET segment = v_segment, updated_at = NOW()
  WHERE id = p_user_id;

  RETURN v_segment;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing (optional)
-- INSERT INTO public.users (phone, email, name, segment) VALUES ('+1234567890', 'test@example.com', 'Test User', 'new');
