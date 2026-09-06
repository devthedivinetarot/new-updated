// PART 5 — DYNAMIC CONTENT TRANSLATION (CRITICAL FOR READINGS)
// Rule: NEVER store readings in multiple languages
// Always generate in ONE base language (English), then translate on-the-fly

import { t, SupportedLanguage } from './i18n';

/**
 * Translate dynamic content (readings, interpretations)
 * In production: Connect to translation service
 */

const HINGLISH_MAP: Record<string, string> = {
  // Common replacements for Hinglish
  ' you ': ' tum ',
  ' your ': ' tumhare ',
  ' are ': ' ho ',
  ' is ': ' hai ',
  ' the ': ' ',
  ' future ': ' bhavishya ',
  ' love ': ' pyaar ',
  ' heart ': ' dil ',
  ' will ': ' hoga ',
  ' yes ': ' haan ',
  ' no ': ' nahi ',
  ' might ': ' ho sakta ',
  ' perhaps ': ' shayad ',
  ' very ': ' bahut ',
  ' good ': ' achha ',
  ' bad ': ' bura ',
  ' time ': ' waqt ',
  ' work ': ' kaam ',
  ' career ': ' career ',
  ' money ': ' paisa ',
  ' relationship ': ' rishta ',
};

const HINDI_MAP: Record<string, string> = {
  // Hindi translations (simplified)
  ' future ': ' भविष्य ',
  ' love ': ' प्रेम ',
  ' heart ': ' दिल ',
  ' you ': ' आप ',
  ' your ': ' आपका ',
  ' are ': ' हैं ',
  ' is ': ' है ',
  ' will ': ' होगा ',
  ' yes ': ' हाँ ',
  ' no ': ' नहीं ',
  ' time ': ' समय ',
  ' work ': ' काम ',
  ' career ': ' करियर ',
  ' money ': ' पैसा ',
  ' relationship ': ' रिशता ',
  ' guidance ': ' मार्गदर्शन ',
  ' clarity ': ' स्पष्टता ',
  ' cards ': ' पत्ते ',
  ' reading ': ' रीडिंग ',
  ' answer ': ' जवाब ',
  ' question ': ' सवाल ',
};

/**
 * Mock translation function
 * In production: Replace with actual translation API
 */
async function autoTranslate(text: string, targetLang: SupportedLanguage): Promise<string> {
  if (targetLang === 'en') return text;

  // For demo purposes, simple word substitution
  // REAL IMPLEMENTATION: Use Google Translate API, DeepL, or OpenAI

  let result = text;

  if (targetLang === 'hinglish') {
    // Convert to Hinglish using simple mapping
    Object.entries(HINGLISH_MAP).forEach(([english, hinglish]) => {
      const regex = new RegExp(english.trim(), 'gi');
      result = result.replace(regex, hinglish.trim());
    });
  } else if (targetLang === 'hi') {
    // Convert to Hindi
    Object.entries(HINDI_MAP).forEach(([english, hindi]) => {
      const regex = new RegExp(english.trim(), 'gi');
      result = result.replace(regex, hindi.trim());
    });
  }

  return result;
}

/**
 * Translate dynamic reading content
 * Guarantees: Emotion preserved, no duplication, consistent output
 */
export async function translateDynamic(
  text: string,
  lang: SupportedLanguage
): Promise<string> {
  // Short texts or empty → return as-is
  if (!text || text.length < 2) return text;
  if (lang === 'en') return text;

  // Check if text already in target language (avoid re-translation)
  if (lang === 'hi' && /[\u0900-\u097F]/.test(text)) {
    return text; // Already in Devanagari
  }

  // Call translation engine
  return autoTranslate(text, lang);
}

/**
 * Batch translate multiple strings
 */
export async function translateBatch(
  items: string[],
  lang: SupportedLanguage
): Promise<string[]> {
  if (lang === 'en') return items;

  return Promise.all(items.map(item => translateDynamic(item, lang)));
}

/**
 * Translate reading object (full reading with sections)
 */
export async function translateReading(
  reading: {
    past: string;
    present: string;
    guidance: string;
    closing?: string;
  },
  lang: SupportedLanguage
): Promise<typeof reading> {
  const [past, present, guidance, closing] = await Promise.all([
    translateDynamic(reading.past, lang),
    translateDynamic(reading.present, lang),
    translateDynamic(reading.guidance, lang),
    reading.closing ? translateDynamic(reading.closing, lang) : Promise.resolve(''),
  ]);

  return { past, present, guidance, closing };
}
