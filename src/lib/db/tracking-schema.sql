-- Tracking System Database Schema
-- Run this in your Supabase SQL Editor

-- Create tracking events table
CREATE TABLE IF NOT EXISTS public.tracking_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  session_id VARCHAR(100),
  event_name VARCHAR(100) NOT NULL,
  event_category VARCHAR(50),
  page_url VARCHAR(500),
  referrer VARCHAR(500),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tracking_user ON public.tracking_events(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_session ON public.tracking_events(session_id);
CREATE INDEX IF NOT EXISTS idx_tracking_event ON public.tracking_events(event_name);
CREATE INDEX IF NOT EXISTS idx_tracking_page ON public.tracking_events(page_url);
CREATE INDEX IF NOT EXISTS idx_tracking_created ON public.tracking_events(created_at);

-- Create experiments table for A/B testing
CREATE TABLE IF NOT EXISTS public.experiment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id VARCHAR(50) NOT NULL,
  variant VARCHAR(10) NOT NULL,
  user_id UUID,
  session_id VARCHAR(100),
  conversion_event VARCHAR(100),
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experiment_id ON public.experiment_results(experiment_id);
CREATE INDEX IF NOT EXISTS idx_experiment_conversion ON public.experiment_results(experiment_id, converted);

-- Create function to track page view
CREATE OR REPLACE FUNCTION track_page_view(
  p_user_id UUID,
  p_session_id VARCHAR,
  p_page_url VARCHAR,
  p_referrer VARCHAR DEFAULT '',
  p_utm_source VARCHAR DEFAULT '',
  p_utm_medium VARCHAR DEFAULT '',
  p_utm_campaign VARCHAR DEFAULT ''
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.tracking_events (
    user_id, session_id, event_name, event_category, 
    page_url, referrer, utm_source, utm_medium, utm_campaign
  )
  VALUES (
    p_user_id, p_session_id, 'page_view', 'navigation',
    p_page_url, p_referrer, p_utm_source, p_utm_medium, p_utm_campaign
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to track conversion funnel step
CREATE OR REPLACE FUNCTION track_funnel_step(
  p_user_id UUID,
  p_session_id VARCHAR,
  p_step_name VARCHAR,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.tracking_events (
    user_id, session_id, event_name, event_category, metadata
  )
  VALUES (
    p_user_id, p_session_id, p_step_name, 'funnel', p_metadata
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to log A/B test result
CREATE OR REPLACE FUNCTION log_ab_test(
  p_experiment_id VARCHAR,
  p_variant VARCHAR,
  p_user_id UUID,
  p_session_id VARCHAR,
  p_converted BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.experiment_results (
    experiment_id, variant, user_id, session_id, converted
  )
  VALUES (
    p_experiment_id, p_variant, p_user_id, p_session_id, p_converted
  );
END;
$$ LANGUAGE plpgsql;

-- Create view for funnel analysis
CREATE OR REPLACE VIEW funnel_analysis AS
SELECT 
  event_name,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_events,
  ROUND(COUNT(DISTINCT user_id)::numeric / 
    (SELECT COUNT(DISTINCT user_id) FROM tracking_events WHERE event_name = 'page_view_homepage')::numeric * 100, 2) as conversion_rate
FROM public.tracking_events
WHERE event_name IN (
  'page_view_homepage', 
  'start_reading_click',
  'card_selection_started',
  'reading_completed',
  'paywall_viewed',
  'payment_completed'
)
GROUP BY event_name
ORDER BY 
  CASE event_name
    WHEN 'page_view_homepage' THEN 1
    WHEN 'start_reading_click' THEN 2
    WHEN 'card_selection_started' THEN 3
    WHEN 'reading_completed' THEN 4
    WHEN 'paywall_viewed' THEN 5
    WHEN 'payment_completed' THEN 6
    ELSE 7
  END;

-- Create view for experiment performance
CREATE OR REPLACE VIEW experiment_performance AS
SELECT 
  experiment_id,
  variant,
  COUNT(*) as total_views,
  SUM(CASE WHEN converted THEN 1 ELSE 0 END) as conversions,
  ROUND(
    SUM(CASE WHEN converted THEN 1 ELSE 0 END)::numeric / 
    COUNT(*)::numeric * 100, 
  2
  ) as conversion_rate
FROM public.experiment_results
GROUP BY experiment_id, variant
ORDER BY experiment_id, conversion_rate DESC;