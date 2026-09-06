'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getUserProfile, 
  getUserProfileCached, 
  getProfileSync,
  clearProfileCache,
  updateUserActivity,
  type UserProfile,
  type IntentType,
  type EngagementLevel,
  type ConversionStage
} from '@/lib/personalization/profile';
import { 
  applyPersonalizationRules, 
  getDefaultRules, 
  type PersonalizationRules 
} from '@/lib/personalization/rules';

export interface PersonalizationState {
  profile: UserProfile | null;
  rules: PersonalizationRules;
  isLoading: boolean;
  isPersonalized: boolean;
  error: string | null;
}

export interface UsePersonalizationReturn extends PersonalizationState {
  refreshProfile: () => Promise<void>;
  updateActivity: () => Promise<void>;
  invalidateCache: () => void;
}

export function usePersonalization(userId: string | null): UsePersonalizationReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rules, setRules] = useState<PersonalizationRules>(getDefaultRules());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPersonalized = profile !== null;

  const refreshProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setRules(getDefaultRules());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userProfile = await getUserProfileCached(userId);
      setProfile(userProfile);
      
      const personalizationRules = applyPersonalizationRules(userProfile);
      setRules(personalizationRules);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Failed to load personalization');
      setRules(getDefaultRules());
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const updateActivity = useCallback(async () => {
    if (!userId) return;
    
    try {
      await updateUserActivity(userId);
    } catch (err) {
      console.error('Failed to update user activity:', err);
    }
  }, [userId]);

  const invalidateCache = useCallback(() => {
    if (userId) {
      clearProfileCache();
      refreshProfile();
    }
  }, [userId, refreshProfile]);

  useEffect(() => {
    refreshProfile();
  }, [userId]);

  return {
    profile,
    rules,
    isLoading,
    isPersonalized,
    error,
    refreshProfile,
    updateActivity,
    invalidateCache,
  };
}

export function useVariant(): string {
  const [variant, setVariant] = useState('default');

  useEffect(() => {
    const stored = localStorage.getItem('ui_variant');
    if (stored) {
      setVariant(stored);
    } else {
      const random = Math.random() < 0.5 ? 'a' : 'b';
      localStorage.setItem('ui_variant', random);
      setVariant(random);
    }
  }, []);

  return variant;
}

export function usePersonalizedContent(contentType: 'hero' | 'cta' | 'paywall' | 'chat') {
  const [content, setContent] = useState<string>('');

  return content;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  showTestimonials: boolean;
  showUrgency: boolean;
  showPremiumBadge: boolean;
}

export function useHeroContent(rules: PersonalizationRules): HeroContent {
  return {
    headline: rules.variant.heroHeadline,
    subheadline: rules.variant.heroSubheadline,
    ctaPrimary: rules.variant.ctaPrimary,
    ctaSecondary: rules.variant.ctaSecondary,
    showTestimonials: rules.variant.showTestimonials,
    showUrgency: rules.variant.showUrgency,
    showPremiumBadge: rules.variant.showPremiumBadge,
  };
}

export interface CTAContent {
  primary: string;
  secondary: string;
}

export function useCTAContent(rules: PersonalizationRules): CTAContent {
  return {
    primary: rules.variant.ctaPrimary,
    secondary: rules.variant.ctaSecondary,
  };
}

export interface ReadingFlowContent {
  prefillQuestions: string[];
  showGuidedQuestions: boolean;
  tone: 'curious' | 'supportive' | 'direct';
  showMemory: boolean;
}

export function useReadingFlowContent(rules: PersonalizationRules): ReadingFlowContent {
  return {
    prefillQuestions: rules.readingFlow.prefillQuestions,
    showGuidedQuestions: rules.readingFlow.showGuidedQuestions,
    tone: rules.readingFlow.tone,
    showMemory: rules.readingFlow.showMemory,
  };
}

export interface PaywallContent {
  triggerAfterCards: number;
  messageTone: 'curious' | 'urgent' | 'soft';
  showSavings: boolean;
  showTimeLimit: boolean;
}

export function usePaywallContent(rules: PersonalizationRules): PaywallContent {
  return {
    triggerAfterCards: rules.paywall.triggerAfterCards,
    messageTone: rules.paywall.messageTone,
    showSavings: rules.paywall.showSavings,
    showTimeLimit: rules.paywall.showTimeLimit,
  };
}

export interface ChatContent {
  useMemory: boolean;
  contextMessage: string;
  triggerOnIdle: boolean;
  idleTimeoutMinutes: number;
}

export function useChatContent(rules: PersonalizationRules): ChatContent {
  return {
    useMemory: rules.chat.useMemory,
    contextMessage: rules.chat.contextMessage,
    triggerOnIdle: rules.chat.triggerOnIdle,
    idleTimeoutMinutes: rules.chat.idleTimeoutMinutes,
  };
}