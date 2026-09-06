// PART 3 & 4 — SELF-HEALING TRANSLATION ENGINE + AUTO LANGUAGE DETECTION
// This is the unified translation system that guarantees:
// 1. No missing keys ever break UI
// 2. Automatic fallback to English
// 3. Fixed language detection (hi vs hinglish)
// 4. Dev-time warnings for missing keys

import { en } from './en';
import { hi } from './hi';
import { hinglish } from './hinglish';
import type { TranslationSchema } from './schema';

// ============================================
// PART 4 — FIXED LANGUAGE DETECTION
// ============================================
// Fixes the swapped hi ↔ hinglish bug

export type SupportedLanguage = 'en' | 'hi' | 'hinglish';

const HINDI_DEVANAGARI_PATTERN = /[\u0900-\u097F]/;

// Common Hindi words in Roman (used for Hinglish detection)
const HINDI_ROMAN_WORDS = [
  'kya', 'kaise', 'kab', 'kyu', 'kyun', 'kyon',
  'mujhe', 'tumhe', 'humhe', 'tumhare', 'mera', 'tera',
  'hai', 'hain', 'tha', 'thi', 'ho', 'nahi', 'nahi',
  'kuch', 'sab', 'koi', 'apna', 'jao', 'aao', 'dekh',
  'suno', 'bolo', 'kaho', 'raha', 'rahi', 'rahe',
  'gaya', 'gayi', 'kar', 'karo', 'kare', 'lena', 'dena',
  'jana', 'ana', 'aur', 'ya', 'lekin', 'par', 'to',
  'yeh', 'woh', 'ye', 'wo', 'hua', 'sakta', 'sakti',
  'sakte', 'paana', 'milna', 'chahiye', 'chahie',
  'zarurat', 'jo', 'abhi', 'phir', 'tab', 'kabhi',
  'hamesha', 'kal', 'aaj', 'raat', 'din',
  'pyaar', 'ishq', 'dard', 'khushi', 'dhadkan',
  'dil', 'jaan', 'raah', 'raaste', 'soch', 'vishwas',
  'kaam', 'paisa', 'buddhi', 'aqal', 'imaan', 'bhakti',
  'tumhare', 'hamare', 'unka', 'inka', 'uska',
];

export function detectLanguage(text: string): SupportedLanguage {
  if (!text || text.trim().length < 2) {
    return 'en';
  }

  // Check for Devanagari script → definitely Hindi
  if (HINDI_DEVANAGARI_PATTERN.test(text)) {
    return 'hi';
  }

  const lowerText = text.toLowerCase().trim();
  const words = lowerText.split(/\s+/).filter(w => w.length > 0);

  if (words.length === 0) return 'en';

  // Count Hindi Roman words
  const hindiWordCount = words.filter(word =>
    HINDI_ROMAN_WORDS.includes(word.toLowerCase())
  ).length;

  const hindiRatio = hindiWordCount / words.length;

  // Thresholds tuned to avoid hi/hinglish swap bug
  // If >30% Hindi words OR at least 2 clear Hindi words → Hinglish
  if (hindiRatio > 0.3 || hindiWordCount >= 2) {
    return 'hinglish';
  }

  // If no Hindi words detected → English
  if (hindiWordCount === 0) {
    return 'en';
  }

  // Edge case: some Hindi words but not enough → assume English with Hindi influence
  return 'en';
}

// ============================================
// PART 3 — SELF-HEALING TRANSLATION FUNCTION
// ============================================

const languages: Record<SupportedLanguage, TranslationSchema> = {
  en,
  hi,
  hinglish,
};

let devWarnings: string[] = [];

/**
 * Core translation function with automatic fallback
 * NEVER breaks UI - always returns a string
 */
export function t(
  path: string,
  lang: SupportedLanguage = 'en',
  params?: Record<string, string | number>
): string {
   const keys = path.split('.');

   let value: any = languages[lang];
   let fallback: any = languages.en;

   // Navigate the nested structure
   for (const key of keys) {
     value = value?.[key];
     fallback = fallback?.[key];
   }

  // SELF-HEALING LOGIC
  if (value === undefined || value === null || value === '') {
    // Dev-time warning
    const warning = `Missing key: ${path} in ${lang}`;
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn('[i18n]', warning);
    }
    devWarnings.push(warning);

    // Fallback to English
    if (fallback !== undefined && fallback !== null && typeof fallback === 'string') {
      return params ? interpolate(fallback, params) : fallback;
    }

    // Ultimate fallback: return the key path itself (never breaks UI)
    return path;
  }

  // Apply parameter interpolation if needed
  if (params && typeof value === 'string') {
    return interpolate(value, params);
  }

  return value as string;
}

/**
 * Interpolate parameters like {count} → actual value
 */
function interpolate(text: string, params: Record<string, string | number>): string {
  let result = text;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
  });
  return result;
}

/**
 * Get all dev warnings (for debugging)
 */
export function getTranslationWarnings(): string[] {
  return [...devWarnings];
}

/**
 * Clear dev warnings
 */
export function clearTranslationWarnings(): void {
  devWarnings = [];
}

/**
 * Check if a translation key exists in a language
 */
export function hasTranslation(path: string, lang: SupportedLanguage): boolean {
  const keys = path.split('.');
  let value: any = languages[lang];

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined || value === null) return false;
  }

  return true;
}

/**
 * Get all keys from schema
 */
export function getAllKeys(): string[] {
  const keys: string[] = [];

  function collect(obj: any, prefix = ''): void {
    if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([k, v]) => {
        const newPrefix = prefix ? `${prefix}.${k}` : k;
        if (typeof v === 'string') {
          keys.push(newPrefix);
        } else if (Array.isArray(v)) {
          // Arrays are also valid translation values
          keys.push(newPrefix);
        } else {
          collect(v, newPrefix);
        }
      });
    }
  }

  collect(en);
  return keys;
}

// Export languages for validation
export { en, hi, hinglish };
export type { TranslationSchema };
