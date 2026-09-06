/**
 * Microsoft Clarity Analytics Integration
 *
 * Loads Clarity via a standard async <script> insertion.
 * All tracking calls are wrapped in a no-op guard so the code works
 * silently even if Clarity is not configured.
 *
 * CSP: Clarity CDN (cdn.clarity.ms) is in the script-src allow-list.
 * Inline <script src="https://cdn.clarity.ms"> blocks are fetched and
 * executed without a nonce. Clarity's own injected inline code uses
 * their documented `data-clarity` mechanism under CSP environments.
 */

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

export interface ClarityConfig {
  projectId: string;
  trackClips?: boolean;
  trackHeatmaps?: boolean;
  sampleRate?: number;
}

let clarityLoaded = false;
let clarityLoadPromise: Promise<void> | null = null;

/**
 * Load the Clarity tracking script.
 * Safe to call multiple times; subsequent calls return the same promise.
 */
export function initClarity(config?: ClarityConfig): void {
  if (typeof window === 'undefined') return;

  if (clarityLoaded) {
    configureClarity(config);
    return;
  }

  if (clarityLoadPromise) {
    clarityLoadPromise.then(() => configureClarity(config));
    return;
  }

  const CLARITY_PROJECT_ID = config?.projectId || process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  if (!CLARITY_PROJECT_ID) {
    console.log('[Clarity] Not configured, skipping init');
    return;
  }

  clarityLoadPromise = new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.clarity.ms/s/${CLARITY_PROJECT_ID}`;

    script.onload = () => {
      clarityLoaded = true;
      clarityLoadPromise = null;
      configureClarity(config);
      resolve();
    };

    script.onerror = () => {
      clarityLoadPromise = null;
      console.error('[Clarity] Failed to load');
      resolve(); // resolve() anyway so callers don't hang
    };

    document.head.appendChild(script);
  });
}

function configureClarity(config?: ClarityConfig): void {
  if (!window.clarity) return;

  const CLARITY_PROJECT_ID = config?.projectId || process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  if (CLARITY_PROJECT_ID) {
    window.clarity('set', 'project', CLARITY_PROJECT_ID);
  }

  if (config?.trackClips !== false) {
    window.clarity('set', 'track', true);
  }

  if (config?.trackHeatmaps !== false) {
    window.clarity('heatmap', 'enable');
  }

  if (config?.sampleRate) {
    window.clarity('set', 'sample-rate', config.sampleRate);
  }
}

function trackClarityEvent(eventName: string, metadata?: Record<string, unknown>): void {
  if (!window.clarity) {
    console.log('[Clarity] Event (mock):', eventName, metadata);
    return;
  }

  window.clarity('event', eventName, metadata);
}

function setClarityUserTag(tag: string, value: string): void {
  if (!window.clarity) return;
  window.clarity('set', `tag:${tag}`, value);
}

function identifyClarityUser(userId: string): void {
  if (!window.clarity) return;
  window.clarity('identify', userId);
}

function consentClarity(consent: boolean): void {
  if (!window.clarity) return;
  if (consent) { window.clarity('consent'); } else { window.clarity('optout'); }
}

export function initClarityForPage(pageName: string): void {
  trackClarityEvent('page_view', {
    page: pageName,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  });
}

export async function getClarityHeatmapData(_pageUrl: string): Promise<null> {
  console.log('[Clarity] Would fetch heatmap data for:', _pageUrl);
  return null;
}

export async function getClaritySessionRecording(_sessionId: string): Promise<null> {
  console.log('[Clarity] Would fetch session:', _sessionId);
  return null;
}

export const CLARITY_TRACKED_PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/reading', name: 'Reading Page' },
  { path: '/booking', name: 'Booking Page' },
  { path: '/upgrade', name: 'Paywall' },
  { path: '/contact', name: 'Contact' },
];
