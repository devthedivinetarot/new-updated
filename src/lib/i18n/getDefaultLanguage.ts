export function getDefaultLanguage(): 'en' | 'hi' | 'hinglish' {
  if (typeof window === 'undefined') return 'en';

  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'hi' || saved === 'hinglish') return saved;
  } catch {
    /* ignore storage failures */
  }

  const browserLang = (navigator.language || '').toLowerCase();
  if (browserLang.includes('hi')) return 'hi';

  return 'en';
}
