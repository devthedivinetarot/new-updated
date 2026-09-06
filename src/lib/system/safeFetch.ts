import { HealingResponse, FallbackStrategy } from './types';

export async function safeFetch(
  url: string, 
  options?: RequestInit, 
  retries = 2,
  fallbackData?: any
): Promise<HealingResponse<Response>> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      return {
        data: res,
        fallback: false,
        strategy: (attempt > 0 ? 'retry' : 'primary') as FallbackStrategy,
        attempts: attempt + 1,
        source: 'primary'
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      
      // Don't log intermediate retries
      if (attempt === retries) {
        // Log failure to API
        fetch('/api/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'fetch_error' as const,
            url,
            error: lastError.message,
            ts: Date.now(),
            metadata: {
              status: lastError.name,
              timestamp: Date.now(),
              retries: retries
            }
          }),
        }).catch(() => {});
      }

      // If we have more retries, wait a bit before trying again
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
  }

  // All retries exhausted - return fallback
  return {
    data: new Response(JSON.stringify(fallbackData || { fallback: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }),
    fallback: true,
    strategy: (fallbackData ? 'cache' : 'default') as FallbackStrategy,
    attempts: retries + 1,
    source: 'fallback'
  };
}
