// Security configuration for Divine Tarot
// Comprehensive security settings with granular control

export const isProduction = process.env.NODE_ENV === 'production';

export const securityConfig = {
  // Watermark visibility - enabled in all environments for traceability
  showWatermark: true,
  
  // Content protection features - disabled by default to avoid accessibility issues
  // Can be enabled selectively for production if needed
  blockContextMenu: false,
  blockDevTools: false,
  blockScreenshots: false,
  blockTextSelection: false,
  
  // Security headers
  enableCSP: isProduction,
  enableHSTS: isProduction,
  enableXFrameOptions: true,
  enableXContentTypeOptions: true,
  
  // Rate limiting
  enableRateLimiting: true,
  
  // Input validation
  strictInputValidation: true,
  
  // Session security
  secureCookies: isProduction,
  sameSiteCookies: isProduction ? 'strict' : 'lax' as const,
  
  // CSP nonce (generated per request in middleware)
  cspNonce: '',
};

export type SecurityConfig = typeof securityConfig;

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: {
    anonymous: 100, // requests per window
    authenticated: 500,
  },
  apiWindowMs: 60 * 1000, // 1 minute for API endpoints
  apiMaxRequests: {
    anonymous: 30,
    authenticated: 300,
  },
  readingEndpoints: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxPerDay: 100, // Max reading attempts per day per IP
  },
};

// CSP policies — uses script-src for inline scripts with per-request nonce,
// script-src-elem for external scripts.
// 'self' in script-src-elem allows Next.js chunks from the same origin.
export const cspPolicies = {
  defaultSrc: ["'self'"],
  // script-src: handles inline scripts with per-request nonce
  scriptSrc: [], // nonce injected dynamically
  // script-src-elem: handles external scripts
  // 'self' allows Next.js static chunks from same origin
  scriptSrcElem: [
    "'self'",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://cdn.clarity.ms",
    "https://checkout.razorpay.com",
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind JIT CLI-generated inline style blobs
    "https://fonts.googleapis.com",
  ],
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com",
  ],
  imgSrc: [
    "'self'",
    "data:",
    "https:",
  ],
  connectSrc: [
    "'self'",
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    "https://*.supabase.co",
    "https://api.openai.com",
    "https://api.razorpay.com",
    "https://*.ingest.us.sentry.io",
    "https://*.ingest.sentry.io",
  ],
  // Allow external reading iframes and the Razorpay checkout popup
  frameSrc: [
    "https://ginni-ki-baatein-buddy.lovable.app",
    "https://ginnitdt.lovable.app",
    "https://tdt-ginni-1.vercel.app",
    "https://chat.thedivinetarotonline.com",
    "https://checkout.razorpay.com",
    "https://securecdn.razorpay.com",
  ],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
};

export function shouldBlockContextMenu(): boolean {
  return securityConfig.blockContextMenu;
}

export function shouldBlockDevTools(): boolean {
  return securityConfig.blockDevTools;
}

export function shouldBlockScreenshots(): boolean {
  return securityConfig.blockScreenshots;
}

export function shouldBlockTextSelection(): boolean {
  return securityConfig.blockTextSelection;
}

export function shouldShowWatermark(): boolean {
  return securityConfig.showWatermark;
}

export function getCSPHeader(nonce?: string): string {
  const isDev = process.env.NODE_ENV === 'development';

  // In development, allow unsafe-inline for hydration scripts
  // Production uses nonce-based CSP
  const scriptSrc = isDev 
    ? "'self' 'unsafe-inline'" 
    : nonce ? `'nonce-${nonce}'` : "'self'";

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

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `script-src-elem ${scriptSrcElem}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co https://api.openai.com https://api.razorpay.com https://*.ingest.us.sentry.io https://*.ingest.sentry.io",
    "frame-src https://ginni-ki-baatein-buddy.lovable.app https://ginnitdt.lovable.app https://tdt-ginni-1.vercel.app https://chat.thedivinetarotonline.com https://checkout.razorpay.com https://securecdn.razorpay.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
}
