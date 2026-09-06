'use client';

import { useEffect } from 'react';
import { initClarity } from '@/lib/analytics/clarity';

/**
 * AnalyticsProvider
 *
 * Mounts in the client tree via ClientProviders.
 * Responsibilities:
 *  - Initialise Microsoft Clarity analytics (client-side dynamic script load).
 *
 * GA4 / GTM: loaded server-side by GoogleAnalytics in app/layout.tsx,
 * so this provider only handles Clarity to avoid duplicate script injection.
 */
export default function AnalyticsProvider() {
  useEffect(() => {
    initClarity();
  }, []);

  return null;
}
