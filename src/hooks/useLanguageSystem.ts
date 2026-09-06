import { useCallback, useState } from 'react';
import type { Language } from '@/store/languageStore';
import { useLanguage } from '@/hooks/useLanguage';

export interface UseLanguageOptions {
  autoDetect?: boolean;
  persistKey?: string;
}

export function useLanguageSystem(options: UseLanguageOptions = {}) {
  const { persistKey = 'divine_tarot_language' } = options;
  
  const { 
    language: lang, 
    setLanguage: storeSetLanguage,
    isHydrated 
  } = useLanguage();
  
  const [manualOverride, setManualOverride] = useState(false);
  
  // Set language with persistence
  const setLanguage = useCallback((newLang: Language) => {
    storeSetLanguage(newLang);
    setManualOverride(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(persistKey, newLang);
    }
  }, [storeSetLanguage, persistKey]);
  
  // Reset manual override - allows auto-detection again
  const allowAutoDetect = useCallback(() => {
    setManualOverride(false);
  }, []);
  
  // Get current language code
  const currentLang = lang;
  
  // Get display name for current language
  const languageName: Record<string, string> = {
    en: 'English',
    hi: 'हिंदी',
    hinglish: 'Hinglish',
    ar: 'العربية',
    he: 'עברית',
  };
  
  const displayName = languageName[lang] || 'English';
  
  return {
    lang,
    setLanguage,
    isHydrated,
    manualOverride,
    setManualOverride,
    allowAutoDetect,
    currentLang,
    languageName: displayName,
    languageOptions: [
      { code: 'en', name: 'English', label: 'English' },
      { code: 'hi', name: 'हिंदी', label: 'हिंदी' },
      { code: 'hinglish', name: 'Hinglish', label: 'Hinglish' },
    ],
  };
}

export default useLanguageSystem;