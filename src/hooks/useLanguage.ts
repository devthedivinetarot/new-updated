'use client';

import { useCallback } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from './useTranslation';
import type { Language } from '@/store/languageStore';

export function useLanguage() {
  const { language } = useLanguageStore();
  const { t } = useTranslation();

  const setLanguage = useCallback((lang: Language) => {
    useLanguageStore.getState().setLanguage(lang);
  }, []);

  // Legacy getters (kept for backward compatibility)
  const getHeroHeadline = useCallback((type: string) => t(`hero.headline.${type}`), [t]);
  const getHeroSubheadline = useCallback((type: string) => t(`hero.subheadline.${type}`), [t]);
  const getCTAText = useCallback((key: string) => t(`cta.${key}`), [t]);
  const getPaywallTitle = useCallback((tone: string) => t(`paywall.title.${tone}`), [t]);
  const getPaywallDescription = useCallback((tone: string) => t(`paywall.description.${tone}`), [t]);
  const getPaywallCTA = useCallback((tone: string) => t(`paywall.cta.${tone}`), [t]);
  const getChatButtonText = useCallback(() => t('chat.button'), [t]);
  const getChatTooltip = useCallback(() => t('chat.tooltip'), [t]);
  const getReadingTopic = useCallback((topic: string) => t(`reading.${topic}`), [t]);
  const getUrgencyBadge = useCallback(() => {
    const badges = ['urgency.timeSensitive', 'urgency.limitedSpots', 'urgency.endsTonight', 'urgency.lastChance'];
    const randomBadge = badges[Math.floor(Math.random() * badges.length)];
    return t(randomBadge);
  }, [t]);

  const isRTL = false; // Only en/hi/hinglish supported; none are RTL

  return {
    language,
    setLanguage,
    t,
    isHydrated: true,
    getHeroHeadline,
    getHeroSubheadline,
    getCTAText,
    getPaywallTitle,
    getPaywallDescription,
    getPaywallCTA,
    getChatButtonText,
    getChatTooltip,
    getReadingTopic,
    getUrgencyBadge,
    isRTL,
  };
}

