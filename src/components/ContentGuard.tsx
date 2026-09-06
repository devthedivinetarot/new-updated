'use client';

import { ReactNode, useEffect } from 'react';

interface ContentGuardProps {
  children: ReactNode;
  enabled?: boolean;
}

/**
 * ContentGuard - Development-time translation key validator
 * 
 * Scans DOM for untranslated keys in production builds.
 * Does NOT block text selection or interfere with accessibility.
 * 
 * WARNING: TreeWalker can be expensive - only enabled in development.
 */
export default function ContentGuard({ children, enabled = process.env.NODE_ENV !== 'production' }: ContentGuardProps) {
  useEffect(() => {
    if (!enabled) return;

    // Only run in development mode
    if (process.env.NODE_ENV === 'production') return;

    const checkForRawKeys = () => {
      try {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              const text = node.textContent?.trim() || '';
              // Check for likely translation keys (e.g., "home.", "nav.")
              if (/\b([a-z]+\.[a-z]+\.[a-z]+)\b/.test(text)) {
                return NodeFilter.FILTER_ACCEPT;
              }
              return NodeFilter.FILTER_SKIP;
            }
          }
        );

        const violations: string[] = [];
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const text = node.textContent?.trim() || '';
          const matches = text.match(/\b([a-z]+\.[a-z]+\.[a-z]+)\b/g);
          if (matches) {
            violations.push(...matches);
          }
        }

        if (violations.length > 0) {
          console.error('[ContentGuard] Raw translation keys detected:', violations);
          console.warn('These keys are rendering raw instead of translated. Fix the translation or use the correct key.');
        }
      } catch (e) {
        // TreeWalker might fail in some environments (SSR)
      }
    };

    // Run check after render (with delay for hydration)
    const timer = setTimeout(checkForRawKeys, 1500);
    return () => clearTimeout(timer);
  }, [enabled]);

  return <>{children}</>;
}

export function validateTranslationKey(key: string): boolean {
  const validPrefixes = [
    'common.',
    'nav.',
    'hero.',
    'reading.',
    'chat.',
    'testimonials.',
    'whySection.',
    'footer.',
    'premium.',
    'urgency.',
    'paywall.',
  ];

  return validPrefixes.some(prefix => key.startsWith(prefix));
}

export function useSafeKey(key: string, fallback?: string): string {
  if (process.env.NODE_ENV !== 'production') {
    if (!validateTranslationKey(key)) {
      console.error(`❌ [ContentGuard] Invalid key format: "${key}". Keys must start with a valid prefix.`);
    }
  }
  return key || fallback || key;
}