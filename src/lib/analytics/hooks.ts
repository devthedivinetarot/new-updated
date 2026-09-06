'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  trackPageView,
  trackConversionEvent,
  trackUserInteraction,
  trackScrollDepth,
  trackTimeOnPage,
} from '@/lib/analytics/ga4';
import { initClarity, initClarityForPage } from '@/lib/analytics/clarity';

let analyticsInitialised = false;

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollTracked = useRef<Set<number>>(new Set());
  const timeTracker = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(Date.now());

  // ── Initialise once ───────────────────────────────────────────────────
  useEffect(() => {
    if (!analyticsInitialised) {
      initClarity();
      analyticsInitialised = true;
    }
  }, []);

  // ── Page view tracking ─────────────────────────────────────────────────
  useEffect(() => {
    const pagePath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(pagePath);
    initClarityForPage(pathname);
    startTime.current = Date.now();
    scrollTracked.current.clear();
  }, [pathname, searchParams]);

  // ── Scroll depth tracking ──────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      const thresholds = [25, 50, 75, 100];

      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !scrollTracked.current.has(threshold)) {
          scrollTracked.current.add(threshold);
          trackScrollDepth(threshold, pathname ?? '/');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // ── Time-on-page tracking ──────────────────────────────────────────────
  useEffect(() => {
    timeTracker.current = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime.current) / 1000);
      if (seconds > 0 && seconds % 30 === 0) {
        trackTimeOnPage(seconds, pathname ?? '/');
      }
    }, 1000);

    return () => {
      if (timeTracker.current) {
        clearInterval(timeTracker.current);
        timeTracker.current = null;
      }
    };
  }, [pathname]);

  // ── Click tracking ─────────────────────────────────────────────────────
  const trackClick = useCallback(
    (element: string, section: string, metadata?: Record<string, unknown>) => {
      trackUserInteraction(element, section, 'click', metadata);
    },
    [],
  );

  const trackConversion = useCallback(
    (eventName: string, metadata?: Record<string, unknown>) => {
      trackConversionEvent(eventName, metadata);
    },
    [],
  );

  const trackCustom = useCallback(
    (category: string, action: string, label?: string, metadata?: Record<string, unknown>) => {
      trackUserInteraction(action, category, 'custom', { label, ...metadata });
    },
    [],
  );

  return { trackClick, trackConversion, trackCustom };
}

export function useTrackButton() {
  const { trackClick, trackConversion } = useAnalytics();

  return useCallback(
    (buttonName: string, section: string, conversionEvent?: string, metadata?: Record<string, unknown>) => {
      trackClick(buttonName, section, metadata);
      if (conversionEvent) {
        trackConversion(conversionEvent, metadata);
      }
    },
    [trackClick, trackConversion],
  );
}

export function useScrollTracker() {
  const { trackClick } = useAnalytics();

  return useCallback((depth: number, section: string) => {
    trackClick(`${depth}% scroll`, section);
  }, [trackClick]);
}
