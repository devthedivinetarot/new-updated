// Bridge between new schema-based i18n and existing loader system
// Centralizes all translation logic

import { t as newT, detectLanguage, SupportedLanguage, getAllKeys } from '@/i18n/i18n';
import { translateDynamic } from '@/i18n/translateDynamic';
import { getTranslationSync, loadTranslations } from '@/lib/i18n/loader';
import { useLanguageStore } from '@/store/languageStore';
import { useEffect } from 'react';

// ============================================
// RE-EXPORT FOR COMPONENTS
// ============================================

/**
 * Main translation hook - now using self-healing system
 */
export function useSafeLanguage() {
  const { language, setLanguage } = useLanguageStore();

  // Pre-load translations on mount
  useEffect(() => {
    loadTranslations(language as any);
  }, [language]);

  /**
   * Translation function with guaranteed fallback
   * Uses new schema-based system as primary, falls back to loader
   */
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Try new system first (has better fallback)
    let text = newT(key, language as SupportedLanguage, params);

    // If new system returned the key itself (ultimate fallback), try loader
    if (text === key) {
      const loaderText = getTranslationSync(key, language as any);
      if (loaderText && loaderText !== key) {
        text = loaderText;
      }
    }

    return text;
  };

    /**
     * Translate dynamic content (readings, interpretations)
     */
  const translate = async (content: string): Promise<string> => {
    return translateDynamic(content, language as SupportedLanguage);
  };

   return {
     language,
     setLanguage: (lang: SupportedLanguage) => setLanguage(lang as any),
     t,
     translate,
     isRTL: false, // Only 3 languages supported; no RTL languages
   };
}

/**
 * Get current language with auto-detection from text
 */
export function getLanguageFromText(text: string): SupportedLanguage {
  return detectLanguage(text);
}

/**
 * Translation validator (runs at build time)
 */
export function validateTranslations(): void {
  const keys = getAllKeys();
  const errors: string[] = [];

  keys.forEach(key => {
    ['en', 'hi', 'hinglish'].forEach(lang => {
      if (!newT(key, lang as SupportedLanguage)) {
        errors.push(`Missing ${lang}: ${key}`);
      }
    });
  });

  if (errors.length > 0) {
    console.error('Translation validation failed:');
    errors.forEach(err => console.error(`  ${err}`));
    process.exit(1);
  }

  console.log(`✅ All ${keys.length} translation keys validated`);
}
