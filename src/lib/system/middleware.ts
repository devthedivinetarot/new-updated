import { NextRequest, NextResponse } from 'next/server';
import type { LogEntry } from '@/lib/system/types';
import { rateLimitConfig, getCSPHeader, shouldShowWatermark } from '@/lib/securityConfig';

// Enhanced in-memory rate limiter with sliding window (use Redis in production)
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};
const CLEANUP_INTERVAL = 60000;

/**
 * Enhanced rate limit helper with IP-based and endpoint-specific limits
 */
export function rateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60000
): {
  limited: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const record = rateLimitStore[key];

  // Clean up expired records
  if (record && record.resetTime < now) {
    delete rateLimitStore[key];
  }

  if (!rateLimitStore[key]) {
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + windowMs
    };
  }

  const recordToUpdate = rateLimitStore[key];
  
  if (recordToUpdate.count >= limit) {
    return {
      limited: true,
      remaining: 0,
      resetTime: recordToUpdate.resetTime
    };
  }

  recordToUpdate.count += 1;
  
  return {
    limited: false,
    remaining: limit - recordToUpdate.count,
    resetTime: recordToUpdate.resetTime
  };
}

/**
 * CORS configuration
 */
const corsConfig = {
  origins: [
    process.env.NEXT_PUBLIC_APP_URL || 'https://thedivinetarotonline.com',
    process.env.NEXT_PUBLIC_VERCEL_URL || '',
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter(Boolean) as string[],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  headers: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-CSP-Nonce',
  ],
  credentials: true,
};

/**
 * Security headers middleware
 */
function addSecurityHeaders(response: NextResponse, cspNonce?: string) {
  // Content Security Policy with nonce
  const cspHeader = getCSPHeader(cspNonce);
  response.headers.set('Content-Security-Policy', cspHeader);
  
  // Frame options
  response.headers.set('X-Frame-Options', 'DENY');
  
  // MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), usb=()');
  
  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
}

/**
 * CORS headers middleware
 */
function addCorsHeaders(response: NextResponse, origin?: string) {
  const originValue = origin ?? '';
  if (originValue && corsConfig.origins.includes(originValue)) {
    response.headers.set('Access-Control-Allow-Origin', originValue);
    response.headers.set('Access-Control-Allow-Methods', corsConfig.methods.join(', '));
    response.headers.set('Access-Control-Allow-Headers', corsConfig.headers.join(', '));
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');
  } else if (originValue) {
    response.headers.set('Access-Control-Allow-Origin', originValue);
    response.headers.set('Vary', 'Origin');
  }
}

/**
 * API middleware for security, rate limiting, and logging
 */
export async function withApiMiddleware(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const start = Date.now();
  const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  const path = req.nextUrl.pathname;
  const method = req.method;
  const origin = req.headers.get('origin') ?? '';
  
  // Generate CSP nonce for this request
  const cspNonce = Buffer.from(crypto.randomUUID()).toString('base64');

  try {
    // Handle preflight requests
    if (method === 'OPTIONS') {
      const preflightResponse = new NextResponse(null, { status: 204 });
      addSecurityHeaders(preflightResponse, cspNonce);
      addCorsHeaders(preflightResponse, origin || undefined);
      return preflightResponse;
    }

    // Determine rate limit based on endpoint
    const rateLimitKey = `${ip}:${path}`;
    const isAuthenticated = !!req.headers.get('authorization');
    let limit = 100;
    let windowMs = 60000;

    // Stricter limits for sensitive endpoints
    if (path.includes('/api/auth') || path.includes('/api/payments')) {
      limit = 30;
      windowMs = 60000;
    } else if (path.includes('/api/reading')) {
      limit = rateLimitConfig.readingEndpoints.maxPerDay;
      windowMs = rateLimitConfig.readingEndpoints.windowMs;
    } else if (path.includes('/api/log')) {
      limit = 1000;
    } else if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      limit = rateLimitConfig.apiMaxRequests.authenticated;
    }

    // Apply rate limiting
    const rateLimitResult = rateLimit(rateLimitKey, limit, windowMs);

    if (rateLimitResult.limited) {
      const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
      
      const errorResponse = NextResponse.json(
        {
          error: 'rate_limit_exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter,
        },
        { status: 429 }
      );
      
      addSecurityHeaders(errorResponse, cspNonce);
      addCorsHeaders(errorResponse, origin || undefined);
      errorResponse.headers.set('X-RateLimit-Limit', limit.toString());
      errorResponse.headers.set('X-RateLimit-Remaining', '0');
      errorResponse.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
      errorResponse.headers.set('Retry-After', retryAfter.toString());
      
      return errorResponse;
    }

    // Process request
    const response = await handler(req);

    // Add security headers
    addSecurityHeaders(response, cspNonce);
    addCorsHeaders(response, origin || undefined);

    // Add rate limit headers
    const currentRateLimit = rateLimit(rateLimitKey, limit, windowMs);
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', currentRateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', currentRateLimit.resetTime.toString());
    
    // Add CSP nonce header
    response.headers.set('X-CSP-Nonce', cspNonce);
    
    // Add watermark indicator
    if (shouldShowWatermark()) {
      response.headers.set('X-Watermark-Enabled', 'true');
    }

    // Log successful request (non-blocking)
    const duration = Date.now() - start;

    return response;
  } catch (error: unknown) {
    const errorResponse = NextResponse.json(
      {
        error: 'internal_server_error',
        message: 'An unexpected error occurred. Please try again later.'
      },
      { status: 500 }
    );
    
    addSecurityHeaders(errorResponse, cspNonce);
    addCorsHeaders(errorResponse, origin || undefined);
    
    return errorResponse;
  }
}

// Periodic cleanup of expired rate limit records
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}, CLEANUP_INTERVAL);