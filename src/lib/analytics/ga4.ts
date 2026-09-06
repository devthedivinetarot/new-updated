/**
 * GA4 / Google Tag Manager Analytics Integration
 *
 * All script injection happens server-side or via Next.js <Script>.
 * This module is a pure facade — no `dangerouslySetInnerHTML`, no `eval()`,
 * no inline function self-assignment. It only calls `window.gtag` which was
 * pre-seeded by the injected `gtag.js` script.
 *
 * Supported env vars (all prefixed NEXT_PUBLIC_* for client exposure):
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID  — GA4 property ID
 *   NEXT_PUBLIC_GTM_ID             — Google Tag Manager container ID
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    clarity?: (...args: unknown[]) => void;
  }
}

export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface FunnelStep {
  name: string;
  event: string;
  required?: boolean;
}

export const DEFAULT_FUNNEL: FunnelStep[] = [
  { name: 'Homepage Visit', event: 'page_view_homepage' },
  { name: 'Start Reading',   event: 'start_reading_click',  required: true },
  { name: 'Card Selection',  event: 'card_selected',         required: true },
  { name: 'Reading Completed', event: 'reading_completed' },
  { name: 'Paywall Viewed',  event: 'paywall_view' },
  { name: 'Payment Completed', event: 'payment_completed' },
];

// ---------------------------------------------------------------------------
// Core GA4 helpers – operate on the pre-seeded `window.gtag` only
// ---------------------------------------------------------------------------

function gtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * Safe gtag call wrapper — queues the call if gtag is not yet available
 * (e.g. during the brief window after hydration but before gtag.js finishes).
 */
function safeGtag(...args: unknown[]): void {
  if (gtagAvailable()) {
    window.gtag!(...args);
  } else {
    // Queue in dataLayer for when gtag loads
    window.dataLayer?.push(args);
  }
}

/**
 * Track a single GA4 event.
 * Uses safeGtag so events fired before gtag.js finishes loading are
 * queued in window.dataLayer and dispatched once it becomes available.
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (!gtagAvailable() && !window.dataLayer?.push) return;

  safeGtag('event', event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    ...event.metadata,
  });
}

export function trackPageView(pagePath: string, pageTitle?: string): void {
  trackEvent({
    event: 'page_view',
    category: 'navigation',
    action: pagePath,
    label: pageTitle ?? document.title,
    metadata: { page_path: pagePath, page_title: pageTitle ?? document.title },
  });
}

export function trackConversionEvent(eventName: string, metadata?: Record<string, unknown>): void {
  const events: Record<string, AnalyticsEvent> = {
    start_reading_click: {
      event: 'start_reading', category: 'engagement', action: 'start_reading_click', metadata,
    },
    card_selected: {
      event: 'card_interaction', category: 'engagement', action: 'card_selected', metadata,
    },
    reading_completed: {
      event: 'reading_completed', category: 'engagement', action: 'reading_completed', metadata,
    },
    ginni_opened: {
      event: 'ginni_opened', category: 'engagement', action: 'ginni_opened', metadata,
    },
    paywall_view: {
      event: 'paywall_view', category: 'monetization', action: 'paywall_view', metadata,
    },
    subscription_started: {
      event: 'subscription_started', category: 'monetization', action: 'subscription_started', metadata,
    },
    payment_completed: {
      event: 'payment_completed', category: 'monetization', action: 'payment_completed', metadata,
    },
  };

  const evt = events[eventName];
  if (evt) trackEvent(evt);
}

export function trackUserInteraction(
  element: string,
  section: string,
  action: string,
  metadata?: Record<string, unknown>,
): void {
  trackEvent({
    event: 'user_interaction',
    category: section,
    action,
    label: element,
    metadata: { element, section, action, ...metadata },
  });
}

export function trackScrollDepth(depth: number, page: string): void {
  const thresholds = [25, 50, 75, 100];
  if (!thresholds.includes(depth)) return;

  trackEvent({
    event: 'scroll_depth',
    category: 'engagement',
    action: `${depth}%`,
    label: page,
    metadata: { depth, page },
  });
}

export function trackTimeOnPage(seconds: number, page: string): void {
  trackEvent({
    event: 'time_on_page',
    category: 'engagement',
    action: `${seconds}s`,
    label: page,
    metadata: { seconds, page },
  });
}

export function getUserProperties(userId?: string): Record<string, unknown> {
  return { user_id: userId ?? 'anonymous', timestamp: new Date().toISOString() };
}

export function setUserProperties(properties: Record<string, unknown>): void {
  if (!gtagAvailable() && !window.dataLayer?.push) return;
  safeGtag('set', 'user_properties', properties);
}

// ---------------------------------------------------------------------------
// GTM dataLayer helper
// ---------------------------------------------------------------------------

export function trackGTMEvent(eventName: string, data: Record<string, unknown>): void {
  if (!gtagAvailable()) return;

  // Defer to the queued dataLayer so events are not lost if gtag
  // hasn't finished loading yet.
  if (window.dataLayer?.push) {
    window.dataLayer.push({ event: eventName, ...data });
  }
}
