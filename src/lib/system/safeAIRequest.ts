import { HealingResponse, FallbackStrategy } from './types';

export async function safeAIRequest<T>(
  fn: () => Promise<T>,
  timeoutMs = 25000
): Promise<HealingResponse<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const result = await fn();
    
    clearTimeout(timeout);
    
    return {
      data: result,
      fallback: false,
      strategy: 'primary' as FallbackStrategy,
      attempts: 1,
      source: 'primary'
    };
  } catch (e) {
    clearTimeout(timeout);
    
    const error = e instanceof Error ? e : new Error(String(e));
    const isTimeout = error.name === 'AbortError' || error.message?.includes('timeout');

    // Log to API (non-blocking)
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        type: 'ai_error' as const,
        error: error.message,
        ts: Date.now(),
        metadata: {
          isTimeout,
          timestamp: Date.now(),
          timeoutMs
        }
      }),
    }).catch(() => {});

    // Build appropriate fallback message
    let fallbackMessage = 'Something felt incomplete… try asking again.';
    if (isTimeout) {
      fallbackMessage = 'The request timed out. The system is under heavy load. Please try again in a moment.';
    } else if (error.message?.includes('API key')) {
      fallbackMessage = 'Service temporarily unavailable. Please try again later.';
    }

    return {
      data: {
        fallback: true,
        message: fallbackMessage,
        error: isTimeout ? 'timeout' : 'service_error'
      } as unknown as T,
      fallback: true,
      strategy: (isTimeout ? 'degrade' : 'default') as FallbackStrategy,
      attempts: 1,
      source: 'fallback'
    };
  }
}