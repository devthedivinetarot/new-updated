// Memory cache for translated strings
const memoryCache: Record<string, string> = {};

let localStorageInitialized = false;
const missingKeysLog: string[] = [];

function logMissingKey(key: string, lang: string) {
  const entry = new Date().toISOString() + ' - Missing: ' + key + ' (' + lang + ')';
  missingKeysLog.push(entry);
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn('[i18n AutoTranslate] Missing key:', key, 'for', lang);
  }
  if (typeof window !== 'undefined') {
    try {
      const existing = localStorage.getItem('i18n-missing-keys');
      const all = existing ? JSON.parse(existing) : [];
      const entry = key + ':' + lang;
      if (all.indexOf(entry) === -1) {
        all.push(entry);
        localStorage.setItem('i18n-missing-keys', JSON.stringify(all));
      }
    } catch (e) {}
  }
}

function initializeFromLocalStorage() {
  if (localStorageInitialized || typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem('i18n-translation-cache');
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.assign(memoryCache, parsed);
    }
  } catch (e) {
    console.warn('[i18n] Failed to load cache from localStorage:', e);
  }
  localStorageInitialized = true;
}

function saveToLocalStorage() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('i18n-translation-cache', JSON.stringify(memoryCache));
  } catch (e) {
    console.warn('[i18n] Failed to save cache to localStorage:', e);
  }
}

function keyToText(key: string): string {
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1] || key;
  const words = lastPart.replace(/([A-Z])/g, ' ').replace(/[_-]/g, ' ').trim().toLowerCase().split(/\s+/).filter(Boolean);
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export async function autoTranslate(key: string, targetLang: 'en' | 'hi' | 'hinglish'): Promise<string> {
  const cacheKey = 'tl:' + key + ':' + targetLang;
  initializeFromLocalStorage();
  if (memoryCache[cacheKey]) return memoryCache[cacheKey];

  logMissingKey(key, targetLang);

  const baseText = keyToText(key);
  const targetLangNames = { en: 'English', hi: 'Hindi', hinglish: 'Hinglish' };
  const prompt = 'Translate the following UI text into ' + (targetLangNames[targetLang] || targetLang) + '. Keep it short, natural, and culturally appropriate for Indian users. Maintain a warm, spiritual, yet professional tone for a tarot reading app. Return only the translation, no explanations.\n\nText:   + baseText +  ';

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt, text: baseText, targetLang: targetLang }),
    });
    if (!res.ok) {
      console.warn('[i18n] Translation API returned', res.status);
      memoryCache[cacheKey] = baseText;
      saveToLocalStorage();
      return baseText;
    }
    const data = await res.json();
    const translated = (data.text || data.translation || baseText).trim();
    memoryCache[cacheKey] = (!translated || translated === baseText) ? baseText : translated;
    saveToLocalStorage();
    return memoryCache[cacheKey];
  } catch (error) {
    console.warn('[i18n] Translation failed for', key, error);
    memoryCache[cacheKey] = baseText;
    saveToLocalStorage();
    return baseText;
  }
}

export function clearTranslationCache(): void {
  Object.keys(memoryCache).forEach(k => { if (k.startsWith('tl:')) delete memoryCache[k]; });
  if (typeof window !== 'undefined') { try { localStorage.removeItem('i18n-translation-cache'); } catch (e) {} }
}

export function getTranslationCacheSize(): number {
  return Object.keys(memoryCache).filter(k => k.startsWith('tl:')).length;
}

export function getMissingKeysLog(): string[] {
  return missingKeysLog.slice();
}
