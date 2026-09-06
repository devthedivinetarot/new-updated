export type FunnelStage = 
  | 'visitor'
  | 'reader'
  | 'engaged'
  | 'intent'
  | 'conversion'
  | 'revenue';

export type EventName =
  | 'landing_page_view'
  | 'start_reading_click'
  | 'reading_started'
  | 'reading_completed'
  | 'question_submitted'
  | 'followup_click'
  | 'daily_pull_view'
  | 'booking_page_visit'
  | 'booking_click'
  | 'booking_submitted'
  | 'payment_started'
  | 'payment_completed'
  | 'whatsapp_message_received'
  | 'whatsapp_cta_click'
  | 'return_visit'
  | 'session_timeout'
  | 'unsubscribe';

export interface TrackingEvent {
  id: string;
  userId?: string;
  sessionId?: string;
  eventName: EventName;
  timestamp: Date;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  metadata?: Record<string, any>;
  stage?: FunnelStage;
}

export interface UserFunnelData {
  currentStage: FunnelStage;
  stageReachedAt: Date;
  totalSessions: number;
  totalReadings: number;
  totalRevenue: number;
  conversionTime?: number;
  events: TrackingEvent[];
}

export const eventToStage: Record<EventName, FunnelStage> = {
  landing_page_view: 'visitor',
  start_reading_click: 'visitor',
  reading_started: 'reader',
  reading_completed: 'reader',
  question_submitted: 'reader',
  followup_click: 'engaged',
  daily_pull_view: 'engaged',
  booking_page_visit: 'intent',
  booking_click: 'intent',
  booking_submitted: 'conversion',
  payment_started: 'conversion',
  payment_completed: 'revenue',
  whatsapp_message_received: 'engaged',
  whatsapp_cta_click: 'engaged',
  return_visit: 'engaged',
  session_timeout: 'reader',
  unsubscribe: 'visitor',
};

export function calculateFunnelStage(events: TrackingEvent[]): FunnelStage {
  let highestStage = 'visitor' as FunnelStage;
  
  const stageOrder: FunnelStage[] = ['visitor', 'reader', 'engaged', 'intent', 'conversion', 'revenue'];
  
  for (const event of events) {
    const eventStage = eventToStage[event.eventName];
    if (eventStage) {
      const currentIndex = stageOrder.indexOf(highestStage);
      const eventIndex = stageOrder.indexOf(eventStage);
      if (eventIndex > currentIndex) {
        highestStage = eventStage;
      }
    }
  }
  
  return highestStage;
}

export function calculateConversionTime(events: TrackingEvent[]): number | null {
  const firstInteraction = events.find(e => e.eventName === 'start_reading_click' || e.eventName === 'landing_page_view');
  const conversion = events.find(e => e.eventName === 'payment_completed');
  
  if (!firstInteraction || !conversion) return null;
  
  return new Date(conversion.timestamp).getTime() - new Date(firstInteraction.timestamp).getTime();
}

export function isHighIntentUser(events: TrackingEvent[]): boolean {
  const readingCount = events.filter(e => e.eventName === 'reading_completed').length;
  const bookingVisit = events.some(e => e.eventName === 'booking_page_visit');
  const whatsappEngagement = events.filter(e => e.eventName === 'whatsapp_cta_click').length;
  
  return readingCount >= 3 || bookingVisit || whatsappEngagement >= 2;
}

export function shouldSendReactivation(events: TrackingEvent[]): boolean {
  const lastActive = events
    .filter(e => ['reading_completed', 'daily_pull_view', 'whatsapp_cta_click'].includes(e.eventName))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  
  if (!lastActive) return false;
  
  const daysSince = (Date.now() - new Date(lastActive.timestamp).getTime()) / (1000 * 60 * 60 * 24);
  return daysSince >= 3;
}

export function shouldSendConversionMessage(events: TrackingEvent[]): boolean {
  return isHighIntentUser(events);
}

export function getReturnRate(events: TrackingEvent[], days: number): number {
  const now = Date.now();
  const dayMs = days * 24 * 60 * 60 * 1000;
  const periodStart = now - dayMs;
  
  const uniqueUsers = new Set<string>();
  const returningUsers = new Set<string>();
  
  events.forEach(e => {
    if (e.userId && new Date(e.timestamp).getTime() > periodStart) {
      uniqueUsers.add(e.userId);
      if (events.filter(x => x.userId === e.userId).length > 1) {
        returningUsers.add(e.userId);
      }
    }
  });
  
  return uniqueUsers.size > 0 ? (returningUsers.size / uniqueUsers.size) * 100 : 0;
}

export interface FunnelMetrics {
  totalVisitors: number;
  totalReaders: number;
  totalEngaged: number;
  totalIntent: number;
  totalConversions: number;
  totalRevenue: number;
  conversionRate: number;
  dropoffByStage: Record<FunnelStage, number>;
  d1Retention: number;
  d7Retention: number;
  avgRevenuePerUser: number;
  avgConversionTime: number;
}

export function calculateFunnelMetrics(events: TrackingEvent[]): FunnelMetrics {
  const users = new Map<string, Set<EventName>>();
  
  events.forEach(e => {
    if (!e.userId) return;
    if (!users.has(e.userId)) users.set(e.userId, new Set());
    users.get(e.userId)!.add(e.eventName);
  });

  const usersArray = Array.from(users.values());
  const totalVisitors = users.size;
  const totalReaders = usersArray.filter(u => u.has('reading_completed')).length;
  const totalEngaged = usersArray.filter(u => u.has('daily_pull_view') || u.has('followup_click')).length;
  const totalIntent = usersArray.filter(u => u.has('booking_page_visit')).length;
  const totalConversions = usersArray.filter(u => u.has('payment_completed')).length;
  
  const revenueEvents = events.filter(e => e.eventName === 'payment_completed');
  const totalRevenue = revenueEvents.reduce((sum, e) => sum + (e.metadata?.amount || 0), 0);
  
  const conversionRate = totalReaders > 0 ? (totalConversions / totalReaders) * 100 : 0;
  
  const dropoffByStage = {
    visitor: totalVisitors > 0 ? ((totalVisitors - totalReaders) / totalVisitors) * 100 : 0,
    reader: totalReaders > 0 ? ((totalReaders - totalEngaged) / totalReaders) * 100 : 0,
    engaged: totalEngaged > 0 ? ((totalEngaged - totalIntent) / totalEngaged) * 100 : 0,
    intent: totalIntent > 0 ? ((totalIntent - totalConversions) / totalIntent) * 100 : 0,
    conversion: 0,
    revenue: 0
  };

  return {
    totalVisitors,
    totalReaders,
    totalEngaged,
    totalIntent,
    totalConversions,
    totalRevenue,
    conversionRate,
    dropoffByStage,
    d1Retention: getReturnRate(events, 1),
    d7Retention: getReturnRate(events, 7),
    avgRevenuePerUser: totalVisitors > 0 ? totalRevenue / totalVisitors : 0,
    avgConversionTime: 0
  };
}