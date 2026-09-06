import { NextResponse } from 'next/server';
import { TRANSLATIONS } from '@/lib/i18n/translations';

export async function GET() {
  try {
    const translations: Record<string, Record<string, string>> = {};

    for (const [lang, langTranslations] of Object.entries(TRANSLATIONS)) {
      const flattened: Record<string, string> = {};

      const flattenObj = (obj: unknown, prefix = ''): void => {
        if (obj && typeof obj === 'object') {
          Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === 'string') {
              flattened[fullKey] = value;
            } else {
              flattenObj(value, fullKey);
            }
          });
        }
      };

      flattenObj(langTranslations);
      translations[lang] = flattened;
    }

    return NextResponse.json(translations, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[API] Translations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}
