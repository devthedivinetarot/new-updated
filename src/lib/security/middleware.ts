import { NextRequest, NextResponse } from 'next/server';
import type { NextMiddleware } from 'next/server';

/**
 * Security & Rate Limiting Middleware Collection
 * 
 * Provides:
 * - Rate limiting (in-memory, production should use Redis)
 * - CSRF token generation/validation
 * - Security headers (CSP, HSTS, etc.)
 * - Auth middleware with optional anonymous support
 * - Input validation (Zod-based)
 */

// ========== RATE LIMITING ==========

const rateLimitStores = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  key: string,
  windowMs: number = 60 * 1000,
  maxRequests: number = 30
): { allowed: boolean; remaining: number; resetAfter: number } {
  const now = Date.now();
  const entry = rateLimitStores.get(key);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    rateLimitStores.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetAfter: windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAfter: entry.resetTime - now };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count, resetAfter: entry.resetTime - now };
}

// ========== CSRF PROTECTION ==========

export const CSRF_TOKEN_KEY = 'csrf_token';

export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function setCSRFCookie(response: Response, token: string): void {
  const cookie = `${CSRF_TOKEN_KEY}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`;
  response.headers.append('Set-Cookie', cookie);
}

/**
 * Verify CSRF token using double-submit cookie pattern
 * Token must exist in cookie AND match either header or form field
 */
export async function verifyCSRFToken(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(CSRF_TOKEN_KEY);
  const cookieToken = cookie?.value;
  
  if (!cookieToken) {
    return false;
  }

  // Check header first (for AJAX requests)
  const headerToken = request.headers.get('x-csrf-token');
  if (headerToken === cookieToken) {
    return true;
  }

  // Check form data (for form POST submissions)
  try {
    const formData = await request.formData();
    const formToken = formData.get(CSRF_TOKEN_KEY) as string | null;
    if (formToken === cookieToken) {
      return true;
    }
  } catch {
    // Not a form request or formData unavailable
  }

  return false;
}

// ========== SECURITY HEADERS ==========

export const securityHeadersMiddleware: NextMiddleware = async (req: NextRequest) => {
  const response = NextResponse.next();

  // Generate CSP nonce
  const nonce = generateNonce();

  // In development, allow unsafe-inline for hydration scripts
  // Production uses nonce-based CSP
  const isDev = process.env.NODE_ENV === 'development';
  const scriptSrc = isDev 
    ? "'self' 'unsafe-inline'" 
    : `'nonce-${nonce}'`;

  const scriptSrcElemParts = [
    "'self'",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://cdn.clarity.ms",
    "https://checkout.razorpay.com",
  ];

  if (isDev) {
    scriptSrcElemParts.splice(1, 0, "'unsafe-eval'");
  }

  const scriptSrcElem = scriptSrcElemParts.join(' ');

  const cspDirectives = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `script-src-elem ${scriptSrcElem}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'"
      + ` ${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}`
      + " https://*.supabase.co"
      + " https://api.openai.com"
      + " https://api.razorpay.com",
    "frame-src https://ginni-ki-baatein-buddy.lovable.app"
      + " https://ginnitdt.lovable.app"
      + " https://checkout.razorpay.com"
      + " https://securecdn.razorpay.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];

  const csp = cspDirectives.join('; ');

  // HSTS: only in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  } else {
    response.headers.delete('Strict-Transport-Security');
  }

  // Content-Security-Policy is enforced by the root-level Next.js middleware.ts.
  // Keeping CSP here can cause conflicts / mismatched nonces and block inline scripts.
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()'
  );
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('Cache-Control', 'no-store');


  return response;
};

function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// ========== AUTHENTICATION MIDDLEWARE ==========

export function withAuth(
  handler: (req: NextRequest, user: { id: string; email?: string }) => Promise<Response>,
  options?: {
    requireVerifiedEmail?: boolean;
    allowAnonymous?: boolean;
  }
) {
  return async (req: NextRequest): Promise<Response> => {
    const { createServerClient } = await import('@/lib/supabase/server');

    // Allow anonymous if option set
    if (options?.allowAnonymous) {
      try {
        const supabase = await createServerClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (user && !error) {
          return handler(req, { id: user.id, email: user.email || undefined });
        }
        return handler(req, { id: `anon-${req.ip || 'unknown'}` });
      } catch {
        return handler(req, { id: `anon-${req.ip || 'unknown'}` });
      }
    }

    // Require authentication
    try {
      const supabase = await createServerClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (options?.requireVerifiedEmail && !user.email_confirmed_at) {
        return NextResponse.json(
          { error: 'Email verification required' },
          { status: 403 }
        );
      }

      return handler(req, { id: user.id, email: user.email || undefined });
    } catch (err) {
      console.error('[Auth Middleware] Error:', err);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

// ========== INPUT VALIDATION ==========

export function withValidation<T extends Record<string, unknown>>(
  schema: any,
  handler: (req: NextRequest, validated: T) => Promise<Response>
) {
  return async (req: NextRequest): Promise<Response> => {
    try {
      const body = await req.json();
      const validated = schema.parse(body);
      return handler(req, validated);
    } catch (err: any) {
      if (err?.issues) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            issues: err.issues.map((issue: any) => ({
              field: issue.path.join('.'),
              message: issue.message,
              code: issue.code,
            })),
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
  };
}

// ========== COMBINE MIDDLEWARES ==========

export function createRouteHandler(...middlewares: Array<(req: NextRequest) => Promise<Response | void>>) {
  return async (req: NextRequest): Promise<Response> => {
    for (const middleware of middlewares) {
      const result = await middleware(req);
      if (result instanceof Response) {
        return result;
      }
    }
    throw new Error('Route handler not defined');
  };
}
