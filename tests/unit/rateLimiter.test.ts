import { rateLimit } from '@/lib/system/middleware';

describe('rateLimiter', () => {
  const originalStore: Record<string, { count: number; resetTime: number }> = {};

  beforeEach(() => {
    // Access the internal store for testing
    const middleware = require('@/lib/system/middleware');
  });

  it('should allow requests under the limit', () => {
    const result = rateLimit('test-ip-1', 60, 60000);
    expect(result.limited).toBe(false);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });

  it('should track different IPs independently', () => {
    rateLimit('ip-1', 60, 60000);
    rateLimit('ip-2', 60, 60000);
    
    const resultIp1 = rateLimit('ip-1', 60, 60000);
    const resultIp2 = rateLimit('ip-2', 60, 60000);
    
    expect(resultIp1.remaining).toBeLessThanOrEqual(60);
    expect(resultIp2.remaining).toBe(60);
  });
});