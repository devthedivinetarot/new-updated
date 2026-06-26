import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Security & Rate Limiting Middleware
 *
 * - Rate limits API routes per IP using Upstash Redis
 * - Injects per-request CSP nonce into response headers
 * - Applies hardened security headers to HTML responses
 */

let redis: Redis | null = null;
let defaultRateLimiter: Ratelimit | null = null;
let strictRateLimiter: Ratelimit | null = null;

function initRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (url && token) {
    redis = new Redis({ url, token });
    defaultRateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, '60 s'),
      prefix: 'ratelimit:default',
    });
    strictRateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      prefix: 'ratelimit:strict',
    });
  }
}

function generateNonce(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...Array.from(bytes)));
}

export async function middleware(request: NextRequest) {
  if (!redis && process.env.NODE_ENV !== 'development') {
    initRedis();
  }

  const ip =
    (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()) ||
    request.ip ||
    'anonymous';

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (pathname.startsWith('/api/')) {
    const isStrictRoute = pathname.startsWith('/api/subscription') || pathname.startsWith('/api/premium-order');
    
    if (defaultRateLimiter && strictRateLimiter) {
      const limiter = isStrictRoute ? strictRateLimiter : defaultRateLimiter;
      const result = await limiter.limit(ip);
      
      if (!result.success) {
        const retryAfter = Math.ceil((result.reset - Date.now()) / 1000) || 60;
        const res = NextResponse.json(
          { error: 'Too many requests. Please slow down.', retryAfter },
          { status: 429, headers: { 'Retry-After': retryAfter.toString() } },
        );
        res.headers.set('X-RateLimit-Remaining', '0');
        res.headers.set('X-RateLimit-Limit', (isStrictRoute ? 5 : 60).toString());
        return res;
      }
    }

    const res = NextResponse.next();
    const maxRequests = isStrictRoute ? 5 : 60;
    res.headers.set('X-RateLimit-Remaining', maxRequests.toString());
    res.headers.set('X-RateLimit-Limit', maxRequests.toString());
    return res;
  }

  const nonce = generateNonce();

  const response = NextResponse.next();
  response.cookies.set('__next_csp_nonce', nonce, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60,
  });
  response.headers.set('X-Next-Nonce', nonce);

  const acceptHeader = request.headers.get('accept') ?? '';
  const isHtmlRequest =
    pathname === '/' ||
    acceptHeader.includes('text/html') ||
    !pathname.startsWith('/_next/');

  if (isHtmlRequest) {
    const isDev = process.env.NODE_ENV === 'development';

    const scriptSrcElemParts = [
      "'self'",
      "'unsafe-inline'",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://cdn.clarity.ms",
      "https://checkout.razorpay.com",
      "https://vercel.live",
    ];

    if (isDev) {
      scriptSrcElemParts.splice(1, 0, "'unsafe-eval'");
    }

    const scriptSrcElem = scriptSrcElemParts.join(' ');

    const styleSrc = [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com",
    ].join(' ');

    const scriptSrc = isDev
      ? "'self' 'unsafe-inline'"
      : `'nonce-${nonce}' 'unsafe-inline'`;

    const csp = [
      `default-src 'self'`,
      `script-src ${scriptSrc}`,
      `script-src-elem ${scriptSrcElem} 'nonce-${nonce}'`,
      `style-src ${styleSrc}`,
      `font-src 'self' https://fonts.gstatic.com`,
      `img-src 'self' data: https:`,
      `connect-src 'self' https://*.supabase.co https://api.openai.com https://api.razorpay.com https://*.ingest.us.sentry.io https://*.ingest.sentry.io`,
      `frame-src https://ginni-ki-baatein-buddy.lovable.app https://ginnitdt.lovable.app https://tdt-ginni-1.vercel.app https://chat.thedivinetarotonline.com https://checkout.razorpay.com https://securecdn.razorpay.com https://vercel.live`,
      `worker-src 'self' blob:`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `frame-ancestors ${process.env.NEXT_PUBLIC_FRAME_ANCESTORS || "'self' *"}`,
      "upgrade-insecure-requests",
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);

    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
  }


  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()',
  );
  response.headers.set('X-DNS-Prefetch-Control', 'off');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/.*|favicon\\.ico|.*\\..*$).*)',
  ],
};