import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export type EventName =
  | 'landing_page_view'
  | 'start_reading_click'
  | 'reading_started'
  | 'question_submitted'
  | 'ginni_message_sent'
  | 'reading_completed'
  | 'ginni_opened'
  | 'reading_viewed'
  | 'booking_page_visit'
  | 'booking_click'
  | 'booking_submitted'
  | 'payment_started'
  | 'payment_completed'
  | 'session_start'
  | 'session_end'
  | 'error_occurred'
  | 'premium_payment_initiated'
  | 'premium_payment_success'
  | 'premium_payment_failed'
  | 'premium_payment_dismissed'
  | 'premium_conversion'
  | 'premium_subscribed'
  | 'premium_activated_reading_page'
  | 'paywall_triggered'
  | 'upgrade_requested'
  | 'upgrade_cta_clicked'
  | 'premium_modal_closed'
  | 'message_sent'
  | 'premium_order_created'
  | 'payment_verification_failed'
  | 'reading_iframe_loaded'
  | 'mock_subscription_success';

export interface TrackingEvent {
  userId?: string;
  eventName: EventName;
  metadata?: Record<string, unknown>;
  source?: string;
}

export async function trackEvent(event: TrackingEvent): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.log('[Track Event]', event.eventName, event.metadata || '');
    return true;
  }

  try {
    const { error } = await (supabase as any)
      .from('events')
      .insert({
        user_id: event.userId || null,
        event_name: event.eventName,
        metadata: event.metadata || {},
      });

    if (error) {
      console.error('[Track Error]', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Track Exception]', err);
    return false;
  }
}

export async function logEvent(
  eventName: EventName,
  metadata?: Record<string, unknown>,
  userId?: string
): Promise<boolean> {
  return trackEvent({ eventName, metadata, userId });
}

export function getFunnelStage(eventName: EventName): string {
  const stages: Record<EventName, string> = {
    landing_page_view: 'visitor',
    start_reading_click: 'visitor',
    reading_started: 'reader',
    question_submitted: 'reader',
    ginni_message_sent: 'engaged',
    reading_completed: 'engaged',
    ginni_opened: 'engaged',
    reading_viewed: 'engaged',
    booking_page_visit: 'intent',
    booking_click: 'intent',
    booking_submitted: 'conversion',
    payment_started: 'conversion',
    payment_completed: 'revenue',
    session_start: 'visitor',
    session_end: 'visitor',
    error_occurred: 'error',
    premium_payment_initiated: 'conversion',
    premium_payment_success: 'revenue',
    premium_payment_failed: 'error',
    premium_payment_dismissed: 'error',
    premium_conversion: 'revenue',
    premium_subscribed: 'revenue',
    premium_activated_reading_page: 'revenue',
    paywall_triggered: 'conversion',
    upgrade_requested: 'conversion',
    upgrade_cta_clicked: 'conversion',
    premium_modal_closed: 'error',
    message_sent: 'engaged',
    premium_order_created: 'conversion',
    payment_verification_failed: 'error',
    reading_iframe_loaded: 'engaged',
    mock_subscription_success: 'revenue',
  };
  return stages[eventName] || 'unknown';
}

export function buildTrackingMetadata(data: {
  question?: string;
  ginniSessionId?: string;
  page?: string;
  error?: string;
}): Record<string, unknown> {
  return {
    ...data,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
  };
}