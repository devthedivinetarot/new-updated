// Wires the full translation files (src/i18n/en.ts, hi.ts, hinglish.ts) into
// the loader. Previously this was a stub containing only common.greeting/cta,
// which made most nested keys (whySection.rating, common.under60seconds,
// contact.*, …) fall through to the humanized-key fallback and render raw
// labels like "Rating" on the live site.

import { en } from '@/i18n/en';
import { hi } from '@/i18n/hi';
import { hinglish } from '@/i18n/hinglish';

export const translations = {
  en: {
    ...en,
    common: {
      ...en.common,
      greeting: 'Hey {name}, something important is coming through...',
      cta: 'Know Your Fortune',
    },
  },
  hi: {
    ...hi,
    common: {
      ...hi.common,
      greeting: 'सुनो {name}, कुछ महत्वपूर्ण सामने आ रहा है...',
      cta: 'अपना भविष्य जानें',
    },
  },
  hinglish: {
    ...hinglish,
    common: {
      ...hinglish.common,
      greeting: 'Hey {name}, kuch important aa raha hai...',
      cta: 'Know Your Fortune',
    },
  },
  ar: {
    common: {
      greeting: '',
      cta: '',
    },
  },
  he: {
    common: {
      greeting: '',
      cta: '',
    },
  },
}

export const TRANSLATIONS = translations
