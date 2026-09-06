import { createServerClient } from '@/lib/supabase/server';

export interface TrackingEvent {
  id?: string;
  userId?: string;
  sessionId?: string;
  eventName: string;
  eventCategory: string;
  pageUrl?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

export interface FunnelData {
  step: string;
  users: number;
  conversionRate: number;
  dropOffRate: number;
}

const CONVERSION_FUNNEL = [
  'page_view_homepage',
  'start_reading_click',
  'card_selection_started',
  'card_1_selected',
  'card_2_selected',
  'card_3_selected',
  'reading_in_progress',
  'reading_completed',
  'paywall_viewed',
  'upgrade_cta_clicked',
  'payment_initiated',
  'payment_completed',
];

export async function trackToSupabase(event: TrackingEvent): Promise<void> {
  const supabase = await createServerClient();
  
  if (!supabase) {
    console.log('[Tracking] Mock:', event.eventName, event.metadata);
    return;
  }

  try {
    const { error } = await supabase
      .from('tracking_events')
      .insert({
        user_id: event.userId,
        session_id: event.sessionId,
        event_name: event.eventName,
        event_category: event.eventCategory,
        page_url: event.pageUrl || '',
        referrer: event.referrer || '',
        utm_source: event.utmSource || null,
        utm_medium: event.utmMedium || null,
        utm_campaign: event.utmCampaign || null,
        metadata: event.metadata || {},
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('[Tracking] Error:', error);
    }
  } catch (err) {
    console.error('[Tracking] Exception:', err);
  }
}

export async function getFunnelAnalytics(
  startDate: Date,
  endDate: Date
): Promise<FunnelData[]> {
  const supabase = await createServerClient();
  
  if (!supabase) {
    return getMockFunnelData();
  }

   try {
     const { data: rawEvents, error } = await supabase
       .from('tracking_events')
       .select('event_name, user_id, event_category')
       .gte('created_at', startDate.toISOString())
       .lte('created_at', endDate.toISOString())
       .order('created_at', { ascending: true });

     if (error || !rawEvents) {
       console.error('[Funnel] Error:', error);
       return getMockFunnelData();
     }

     const events: TrackingEvent[] = rawEvents.map(event => ({
       eventName: event.event_name,
       userId: event.user_id,
       eventCategory: event.event_category,
     }));

     const stepCounts: Record<string, number> = {};
     const uniqueUsers = new Set<string>();

     CONVERSION_FUNNEL.forEach(step => {
       stepCounts[step] = 0;
     });

     events.forEach((event: TrackingEvent) => {
       if (CONVERSION_FUNNEL.includes(event.eventName)) {
         stepCounts[event.eventName]++;
         if (event.userId) {
           uniqueUsers.add(event.userId);
         }
       }
     });

    const totalUsers = uniqueUsers.size || 1;
    const funnel: FunnelData[] = [];
    let previousUsers = totalUsers;

    CONVERSION_FUNNEL.forEach((step, index) => {
      const users = stepCounts[step] || 0;
      const conversionRate = totalUsers > 0 ? (users / totalUsers) * 100 : 0;
      const dropOffRate = previousUsers > 0 ? ((previousUsers - users) / previousUsers) * 100 : 0;

      funnel.push({
        step: formatStepName(step),
        users,
        conversionRate: Math.round(conversionRate * 10) / 10,
        dropOffRate: Math.round(dropOffRate * 10) / 10,
      });

      previousUsers = users;
    });

    return funnel;
  } catch (err) {
    console.error('[Funnel] Exception:', err);
    return getMockFunnelData();
  }
}

function formatStepName(eventName: string): string {
  return eventName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function getMockFunnelData(): FunnelData[] {
  return [
    { step: 'Homepage Visit', users: 1000, conversionRate: 100, dropOffRate: 0 },
    { step: 'Start Reading Click', users: 450, conversionRate: 45, dropOffRate: 55 },
    { step: 'Card Selection Started', users: 380, conversionRate: 38, dropOffRate: 15.6 },
    { step: 'Reading Completed', users: 280, conversionRate: 28, dropOffRate: 26.3 },
    { step: 'Paywall Viewed', users: 180, conversionRate: 18, dropOffRate: 35.7 },
    { step: 'Payment Completed', users: 45, conversionRate: 4.5, dropOffRate: 75 },
  ];
}

export async function getDropOffAnalysis(
  page: string
): Promise<{
  bounceRate: number;
  exitRate: number;
  avgTimeOnPage: number;
  clickHeatmap: Record<string, number>;
}> {
  const supabase = await createServerClient();
  
  if (!supabase) {
    return {
      bounceRate: 42,
      exitRate: 28,
      avgTimeOnPage: 45,
      clickHeatmap: {
        'hero-cta': 156,
        'nav-reading': 89,
        'footer-contact': 23,
        'hero-title': 45,
      },
    };
  }

   try {
     const { data: rawEvents } = await supabase
       .from('tracking_events')
       .select('event_name, metadata')
       .eq('page_url', page)
       .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

     if (!rawEvents) {
       return {
         bounceRate: 42,
         exitRate: 28,
         avgTimeOnPage: 45,
         clickHeatmap: {},
       };
     }

     const events = rawEvents as Array<{ event_name: string; metadata: any }>;

      const clickCounts: Record<string, number> = {};
      const exitEvents = events?.filter((e) => e.event_name === 'page_exit') || [];
      const bounceEvents = events?.filter((e) => e.event_name === 'page_bounce') || [];

      events?.forEach((event) => {
        if (event.event_name === 'element_click' && event.metadata?.element) {
          clickCounts[event.metadata.element] = (clickCounts[event.metadata.element] || 0) + 1;
        }
      });

    const total = events?.length || 1;
    return {
      bounceRate: Math.round((bounceEvents.length / total) * 100),
      exitRate: Math.round((exitEvents.length / total) * 100),
      avgTimeOnPage: 45,
      clickHeatmap: clickCounts,
    };
  } catch (err) {
    console.error('[DropOff] Error:', err);
    return {
      bounceRate: 42,
      exitRate: 28,
      avgTimeOnPage: 45,
      clickHeatmap: {},
    };
  }
}

export async function getConversionMetrics(): Promise<{
  ctr: number;
  completionRate: number;
  conversionRate: number;
  revenue: number;
  arpu: number;
}> {
  const supabase = await createServerClient();
  
  if (!supabase) {
    return {
      ctr: 12.5,
      completionRate: 62,
      conversionRate: 4.5,
      revenue: 12500,
      arpu: 277,
    };
  }

  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

     const { count: totalVisitors } = await supabase
       .from('tracking_events')
       .select('*', { count: 'exact', head: true })
       .eq('eventName', 'page_view_homepage')
       .gte('created_at', thirtyDaysAgo.toISOString());

     const { count: startReading } = await supabase
       .from('tracking_events')
       .select('*', { count: 'exact', head: true })
       .eq('eventName', 'start_reading_click')
       .gte('created_at', thirtyDaysAgo.toISOString());

     const { count: completed } = await supabase
       .from('tracking_events')
       .select('*', { count: 'exact', head: true })
       .eq('eventName', 'reading_completed')
       .gte('created_at', thirtyDaysAgo.toISOString());

    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .eq('status', 'completed');

     const totalRevenue = payments?.reduce((sum: number, p: { amount?: number | null }) => sum + (p.amount || 0), 0) || 0;
    const paidUsers = payments?.length || 0;

    const visitors = totalVisitors || 1;
    const ctr = Math.round((startReading || 0) / visitors * 1000) / 10;
    const completionRate = startReading ? Math.round((completed || 0) / startReading * 1000) / 10 : 0;
    const conversionRate = visitors ? Math.round(paidUsers / visitors * 1000) / 10 : 0;

    return {
      ctr,
      completionRate,
      conversionRate,
      revenue: totalRevenue,
      arpu: paidUsers ? Math.round(totalRevenue / paidUsers) : 0,
    };
  } catch (err) {
    console.error('[Metrics] Error:', err);
    return {
      ctr: 12.5,
      completionRate: 62,
      conversionRate: 4.5,
      revenue: 12500,
      arpu: 277,
    };
  }
}

export async function getTopPerformingPages(): Promise<Array<{
  page: string;
  visitors: number;
  conversions: number;
  rate: number;
}>> {
  const supabase = await createServerClient();
  
  if (!supabase) {
    return [
      { page: '/', visitors: 5000, conversions: 225, rate: 4.5 },
      { page: '/reading', visitors: 2250, conversions: 180, rate: 8 },
      { page: '/blog', visitors: 1500, conversions: 45, rate: 3 },
      { page: '/booking', visitors: 400, conversions: 35, rate: 8.75 },
    ];
  }

  try {
    const { data: events } = await supabase
      .from('tracking_events')
      .select('page_url, event_name')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (!events) return [];

    const pageStats: Record<string, { visitors: number; conversions: number }> = {};

     events.forEach((event: { page_url?: string; event_name: string }) => {
      const page = event.page_url || 'unknown';
      if (!pageStats[page]) {
        pageStats[page] = { visitors: 0, conversions: 0 };
      }
      pageStats[page].visitors++;
      if (event.event_name === 'payment_completed') {
        pageStats[page].conversions++;
      }
    });

    return Object.entries(pageStats)
      .map(([page, stats]) => ({
        page,
        visitors: stats.visitors,
        conversions: stats.conversions,
        rate: Math.round(stats.conversions / stats.visitors * 1000) / 10,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);
  } catch (err) {
    console.error('[TopPages] Error:', err);
    return [];
  }
}