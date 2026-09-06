-- ============================================
-- DIVINE TAROT DATABASE SCHEMA
-- ============================================

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20),
  email VARCHAR(255) UNIQUE,
  segment VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_count INT DEFAULT 0,
  reading_count INT DEFAULT 0,
  booking_intent BOOLEAN DEFAULT FALSE,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  source VARCHAR(100),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  whatsapp_opt_in BOOLEAN DEFAULT TRUE,
  timezone VARCHAR(50) DEFAULT 'UTC'
);

-- Index for segment queries
CREATE INDEX idx_users_segment ON users(segment);
CREATE INDEX idx_users_last_active ON users(last_active_at);

-- ============================================
-- SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  duration_seconds INT,
  device_type VARCHAR(50),
  browser VARCHAR(100),
  os VARCHAR(100),
  ip_address VARCHAR(45),
  country VARCHAR(100),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  referrer VARCHAR(500)
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_started ON sessions(started_at);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES sessions(id),
  event_name VARCHAR(100) NOT NULL,
  event_stage VARCHAR(50),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(100),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  referrer VARCHAR(500),
  metadata JSONB,
  url VARCHAR(500)
);

CREATE INDEX idx_events_user ON events(user_id);
CREATE INDEX idx_events_session ON events(session_id);
CREATE INDEX idx_events_name ON events(event_name);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_events_stage ON events(event_stage);

-- ============================================
-- READINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES sessions(id),
  question TEXT,
  cards JSONB NOT NULL,
  interpretation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completion_time_seconds INT,
  question_length INT,
  theme VARCHAR(50),
  emotion VARCHAR(50),
  daily_pull BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_readings_user ON readings(user_id);
CREATE INDEX idx_readings_created ON readings(created_at);
CREATE INDEX idx_readings_theme ON readings(theme);

-- ============================================
-- CONVERSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES sessions(id),
  conversion_type VARCHAR(50) NOT NULL,
  -- types: booking_submitted, payment_completed, consultation_booked
  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  -- status: pending, completed, failed, refunded
  booking_date TIMESTAMP,
  reading_id UUID REFERENCES readings(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  metadata JSONB
);

CREATE INDEX idx_conversions_user ON conversions(user_id);
CREATE INDEX idx_conversions_status ON conversions(status);
CREATE INDEX idx_conversions_created ON conversions(created_at);

-- ============================================
-- WHATSAPP MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  message_type VARCHAR(50) NOT NULL,
  -- types: daily_pull, reactivation, cold_reactivation, post_reading, conversion
  message_text TEXT NOT NULL,
  cta VARCHAR(255),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP,
  clicked_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'sent',
  -- status: sent, delivered, clicked, failed
  whatsapp_message_id VARCHAR(100),
  day_number INT
);

CREATE INDEX idx_whatsapp_user ON whatsapp_messages(user_id);
CREATE INDEX idx_whatsapp_sent ON whatsapp_messages(sent_at);
CREATE INDEX idx_whatsapp_status ON whatsapp_messages(status);

-- ============================================
-- DAILY PULLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS daily_pulls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  card_id VARCHAR(50) NOT NULL,
  card_name VARCHAR(100) NOT NULL,
  is_reversed BOOLEAN DEFAULT FALSE,
  pulled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  message_context TEXT
);

CREATE INDEX idx_daily_pulls_user ON daily_pulls(user_id);
CREATE INDEX idx_daily_pulls_pulled ON daily_pulls(pulled_at);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  booking_type VARCHAR(50) NOT NULL,
  -- types: video_call, voice_call, chat_session
  scheduled_at TIMESTAMP,
  duration_minutes INT DEFAULT 60,
  price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'scheduled',
  -- status: scheduled, completed, cancelled, no_show
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  notes TEXT,
  tarot_expert_id UUID
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_at);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ============================================
-- ANALYTICS VIEWS
-- ============================================

-- Funnel summary view
CREATE OR REPLACE VIEW funnel_summary AS
SELECT 
  COUNT(DISTINCT CASE WHEN e.event_name = 'landing_page_view' THEN e.user_id END) AS visitors,
  COUNT(DISTINCT CASE WHEN e.event_name = 'reading_completed' THEN e.user_id END) AS readers,
  COUNT(DISTINCT CASE WHEN e.event_name IN ('daily_pull_view', 'followup_click', 'return_visit') THEN e.user_id END) AS engaged,
  COUNT(DISTINCT CASE WHEN e.event_name = 'booking_page_visit' THEN e.user_id END) AS intent_users,
  COUNT(DISTINCT CASE WHEN e.event_name = 'booking_submitted' THEN e.user_id END) AS conversions,
  COUNT(DISTINCT CASE WHEN e.event_name = 'payment_completed' THEN e.user_id END) AS paid_users
FROM events e;

-- Daily active users view
CREATE OR REPLACE VIEW daily_active_users AS
SELECT 
  DATE(timestamp) AS date,
  COUNT(DISTINCT user_id) AS active_users,
  COUNT(*) AS total_events
FROM events
WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Revenue by source view
CREATE OR REPLACE VIEW revenue_by_source AS
SELECT 
  u.utm_source,
  COUNT(DISTINCT u.id) AS total_users,
  COUNT(DISTINCT c.id) AS conversions,
  SUM(c.amount) AS total_revenue,
  AVG(c.amount) AS avg_order_value
FROM users u
LEFT JOIN conversions c ON u.id = c.user_id AND c.status = 'completed'
WHERE u.created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY u.utm_source;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Calculate user segment
CREATE OR REPLACE FUNCTION update_user_segment(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  last_active TIMESTAMP;
  days_inactive INT;
  booking BOOLEAN;
  session_cnt INT;
BEGIN
  SELECT last_active_at, booking_intent, session_count 
  INTO last_active, booking, session_cnt
  FROM users WHERE id = user_uuid;
  
  days_inactive := EXTRACT(DAY FROM CURRENT_TIMESTAMP - last_active);
  
  IF booking THEN
    UPDATE users SET segment = 'high-intent' WHERE id = user_uuid;
  ELSIF days_inactive <= 1 THEN
    UPDATE users SET segment = CASE WHEN session_cnt <= 1 THEN 'new' ELSE 'active' END WHERE id = user_uuid;
  ELSIF days_inactive <= 7 THEN
    UPDATE users SET segment = 'inactive' WHERE id = user_uuid;
  ELSE
    UPDATE users SET segment = 'cold' WHERE id = user_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Get user funnel stage
CREATE OR REPLACE FUNCTION get_user_stage(user_uuid UUID)
RETURNS VARCHAR(50) AS $$
DECLARE
  latest_stage VARCHAR(50);
BEGIN
  SELECT event_stage INTO latest_stage
  FROM events 
  WHERE user_id = user_uuid
  ORDER BY timestamp DESC
  LIMIT 1;
  
  RETURN COALESCE(latest_stage, 'visitor');
END;
$$ LANGUAGE plpgsql;