'use client';

import { TRANSLATIONS } from './i18n/translations';

export type DebugStatus = 'ok' | 'missing' | 'fallback';

export function getTranslationStatus(key: string, lang: string): DebugStatus {
  const keys = key.split('.');
  let node: any = TRANSLATIONS;
  
  for (const k of keys) {
    node = node?.[k];
    if (!node) return 'missing';
  }

  if (!node) return 'missing';
  if (!node[lang] && node.en) return 'fallback';
  if (!node[lang]) return 'missing';
  
  return 'ok';
}

export function checkTranslation(key: string, lang: string): {
  text: string;
  status: DebugStatus;
  key: string;
} {
  const keys = key.split('.');
  let node: any = TRANSLATIONS;
  
  for (const k of keys) {
    node = node?.[k];
    if (!node) break;
  }

  const status = getTranslationStatus(key, lang);
  const text = node?.[lang] || node?.en || key;
  
  return { text, status, key };
}

export const DEBUG_MODES = {
  MISSING: 'missing',
  FALLBACK: 'fallback', 
  OK: 'ok',
} as const;

export function isDevMode(): boolean {
  if (typeof window === 'undefined') return false;
  return process.env.NODE_ENV === 'development' || window.location.search.includes('debug=true');
}

export function shouldShowDebug(): boolean {
  return process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && window.location.search.includes('debug=true'));
}