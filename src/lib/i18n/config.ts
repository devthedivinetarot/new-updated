export type Language = 'en' | 'hi' | 'hinglish' | 'ar' | 'he';

export const langMap: Record<Language, string> = {
  en: 'english',
  hi: 'hindi',
  hinglish: 'hinglish',
  ar: 'ar',
  he: 'he',
};

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    direction: 'ltr',
    flag: '🇮🇳',
  },
  hinglish: {
    code: 'hinglish',
    name: 'Hinglish',
    nativeName: 'Hinglish',
    direction: 'ltr',
    flag: '💬',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦',
  },
  he: {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    direction: 'rtl',
    flag: '🇮🇱',
  },
};

export const DEFAULT_LANGUAGE: Language = 'hinglish';

export const LANGUAGE_STORAGE_KEY = 'divine_tarot_language';

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && LANGUAGES[stored as Language]) {
    return stored as Language;
  }
  return DEFAULT_LANGUAGE;
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
}