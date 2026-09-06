/**
 * GoogleAnalytics
 *
 * Injects GA4 gtag.js (with GTM optional) at the document body level.
 * Used as a Server Component inside `app/layout.tsx`.
 *
 * CSP:
 *  - all scripts here are external <script src=…> — covered by host allowlist
 *  - GTM dataLayer bootstrap is loaded from /gtm-bootstrap.js (same-origin,
 *    'self' — no inline content, no nonce required)
 *  - Clarity / Razorpay: loaded by AnalyticsProvider / lib/razorpay/client.ts
 *    using next/script or dynamic DOM insertion (also external, no inline content)
 *
 * Supported env vars:
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID  — GA4 property ID
 *   NEXT_PUBLIC_GTM_ID             — Google Tag Manager container ID
 */

import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId?: string;
  gtmId?: string;
  nonce?: string;
}

export default function GoogleAnalytics({ gaId, gtmId, nonce }: GoogleAnalyticsProps) {
  // ── GTM: dataLayer bootstrap (external, same-origin) + gtm.js ────────────
  if (gtmId) {
    return (
      <>
        {/* Bootstrap window.dataLayer BEFORE gtm.js loads */}
        <Script
          id="gtm-datalayer-bootstrap"
          src="/gtm-bootstrap.js"
          strategy="afterInteractive"
          nonce={nonce}
        />
        {/* GTM container script */}
        <Script
          id="gtm-main"
          src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
          strategy="afterInteractive"
          nonce={nonce}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager noscript"
          />
        </noscript>
      </>
    );
  }

  // ── GA4 gtag.js ──────────────────────────────────────────────────────────
  if (gaId) {
    return (
      <Script
        id="ga4-gtag-js"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
    );
  }

  return null;
}
