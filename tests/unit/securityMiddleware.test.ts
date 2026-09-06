import { describe, it, expect } from '@jest/globals';
import { rateLimit } from '@/lib/security/middleware';

/**
 * NOTE:
 * This test file is intentionally minimal and focuses on the exported pure
 * function behavior we can reliably validate in a node/jest environment.
 */

describe('src/lib/security/middleware - rateLimit', () => {
  it('allows first request and returns a non-negative remaining count', () => {
    const res = rateLimit('test-ip-1', 60, 10);
    expect(res.allowed).toBe(true);
    expect(res.remaining).toBeGreaterThanOrEqual(0);
  });

  it('tracks requests per key independently', () => {
    // Reset is not exposed; but keys are isolated.
    const res1a = rateLimit('ip-a', 60, 10);
    const res2a = rateLimit('ip-b', 60, 10);

    const res1b = rateLimit('ip-a', 60, 10);
    const res2b = rateLimit('ip-b', 60, 10);

    expect(res1a.allowed).toBe(true);
    expect(res2a.allowed).toBe(true);

    // After a second call, ip-a should have lower remaining than its first call.
    expect(res1b.remaining).toBeLessThan(res1a.remaining);
    expect(res2b.remaining).toBeLessThan(res2a.remaining);

    // Both keys should not interfere.
    expect(res1b.remaining).toEqual(res2b.remaining);
  });
});

