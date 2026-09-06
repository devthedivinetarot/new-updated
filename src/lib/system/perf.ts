import { PerfMetric } from './types';

// Session ID for correlating performance metrics
const SESSION_ID = typeof window !== 'undefined' 
  ? (window as any).__SESSION_ID || `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  : `server_${Date.now()}`;

if (typeof window !== 'undefined') {
  (window as any).__SESSION_ID = SESSION_ID;
}

/**
 * Log performance metrics with session tracking
 * Non-blocking, fire-and-forget to avoid impacting UX
 */
export function logPerf(metric: string, value: number, context?: string) {
  const data: PerfMetric = {
    type: 'performance' as const,
    metric,
    value,
    ts: Date.now(),
    sessionId: SESSION_ID,
    context
  };

  // Use sendBeacon if available for better page navigation handling
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    navigator.sendBeacon('/api/log', blob);
  } else {
    // Fallback to fetch with keepalive
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify(data),
    }).catch(() => {});
  }
}

/**
 * Performance monitor with automatic measurement
 */
export function measurePerf<T>(
  name: string,
  fn: () => T,
  context?: string
): T {
  const start = performance.now();
  try {
    const result = fn();
    const duration = performance.now() - start;
    logPerf(name, duration, context);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logPerf(`${name}_error`, duration, context);
    throw error;
  }
}

/**
 * Async performance monitor
 */
export async function measurePerfAsync<T>(
  name: string,
  fn: () => Promise<T>,
  context?: string
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logPerf(name, duration, context);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logPerf(`${name}_error`, duration, context);
    throw error;
  }
}

// Auto-track key metrics
if (typeof window !== 'undefined') {
  // Track page load performance
  if (document.readyState === 'complete') {
    measurePerf('page_load', () => performance.now(), 'auto');
  } else {
    window.addEventListener('load', () => {
      measurePerf('page_load', () => performance.now(), 'auto');
    });
  }

  // Track long tasks
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 100) {
            logPerf('long_task', entry.duration, 'performance_observer');
          }
        }
      });
      observer.observe({ entryTypes: ['longtask', 'measure'] });
    } catch (e) {
      // Ignore in older browsers
    }
  }
}

const perfApi = {
  logPerf,
  measurePerf,
  measurePerfAsync,
  SESSION_ID
};

export default perfApi;
