'use client';

import { useEffect, useState } from 'react';

export type UIVariantType = 'default' | 'emotional' | 'minimal' | 'premium';

export interface UIVariantConfig {
  variant: UIVariantType;
  layout: 'single' | 'split' | 'centered';
  heroStyle: 'default' | 'minimal' | 'immersive';
  ctaStyle: 'default' | 'floating' | 'inline';
  showFloatingCards: boolean;
  showTrustSection: boolean;
  backgroundStyle: 'gradient' | 'solid' | 'dark';
  animationLevel: 'none' | 'subtle' | 'full';
}

const VARIANTS: Record<UIVariantType, UIVariantConfig> = {
  default: {
    variant: 'default',
    layout: 'split',
    heroStyle: 'default',
    ctaStyle: 'default',
    showFloatingCards: true,
    showTrustSection: true,
    backgroundStyle: 'gradient',
    animationLevel: 'full',
  },
  emotional: {
    variant: 'emotional',
    layout: 'single',
    heroStyle: 'immersive',
    ctaStyle: 'floating',
    showFloatingCards: false,
    showTrustSection: true,
    backgroundStyle: 'gradient',
    animationLevel: 'full',
  },
  minimal: {
    variant: 'minimal',
    layout: 'centered',
    heroStyle: 'minimal',
    ctaStyle: 'inline',
    showFloatingCards: false,
    showTrustSection: false,
    backgroundStyle: 'solid',
    animationLevel: 'subtle',
  },
  premium: {
    variant: 'premium',
    layout: 'split',
    heroStyle: 'immersive',
    ctaStyle: 'floating',
    showFloatingCards: true,
    showTrustSection: true,
    backgroundStyle: 'dark',
    animationLevel: 'full',
  },
};

const AB_TEST_KEY = 'divine_tarot_ab_variant';
const VARIANT_PERSISTENCE_DAYS = 30;

function getOrCreateVariant(): UIVariantType {
  if (typeof window === 'undefined') return 'default';
  
  const stored = localStorage.getItem(AB_TEST_KEY);
  if (stored && Object.keys(VARIANTS).includes(stored)) {
    return stored as UIVariantType;
  }

  const userId = localStorage.getItem('divine_user_id');
  let variant: UIVariantType;

  if (userId) {
    const hash = userId.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    const variantKeys = Object.keys(VARIANTS) as UIVariantType[];
    variant = variantKeys[Math.abs(hash) % variantKeys.length];
  } else {
    const rand = Math.random();
    if (rand < 0.25) variant = 'emotional';
    else if (rand < 0.5) variant = 'minimal';
    else if (rand < 0.75) variant = 'premium';
    else variant = 'default';
  }

  localStorage.setItem(AB_TEST_KEY, variant);
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + VARIANT_PERSISTENCE_DAYS);
  localStorage.setItem(`${AB_TEST_KEY}_expiry`, expiryDate.toISOString());

  return variant;
}

export function useUIVariant(): UIVariantConfig {
  const [variant, setVariant] = useState<UIVariantConfig>(VARIANTS.default);

  useEffect(() => {
    const expiryStr = localStorage.getItem(`${AB_TEST_KEY}_expiry`);
    if (expiryStr) {
      const expiry = new Date(expiryStr);
      if (new Date() > expiry) {
        localStorage.removeItem(AB_TEST_KEY);
        localStorage.removeItem(`${AB_TEST_KEY}_expiry`);
      }
    }

    const selectedVariant = getOrCreateVariant();
    setVariant(VARIANTS[selectedVariant]);
  }, []);

  return variant;
}

export function getVariantForProfile(
  conversionStage: string,
  engagementLevel: string,
  isHighIntent: boolean
): UIVariantType {
  if (conversionStage === 'paid') return 'premium';
  if (isHighIntent) return 'emotional';
  if (engagementLevel === 'low') return 'minimal';
  return 'default';
}

export function getVariantConfig(
  conversionStage?: string,
  engagementLevel?: string,
  isHighIntent?: boolean
): UIVariantConfig {
  const variant = getVariantForProfile(
    conversionStage || 'new',
    engagementLevel || 'low',
    isHighIntent || false
  );
  return VARIANTS[variant];
}

export function trackVariantExposure(variant: UIVariantType, userId?: string): void {
  if (typeof window === 'undefined') return;
  
  const event = {
    type: 'ab_test_exposure',
    variant,
    timestamp: new Date().toISOString(),
    userId: userId || 'anonymous',
  };
  
  console.log('[AB Test] Variant exposed:', event);
  
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'ab_test_exposure', {
      variant,
      user_id: userId,
    });
  }
}

export function createVariantRouter(profile: {
  conversionStage?: string;
  engagementLevel?: string;
  isHighIntent?: boolean;
}): UIVariantConfig {
  const variant = getVariantForProfile(
    profile.conversionStage || 'new',
    profile.engagementLevel || 'low',
    profile.isHighIntent || false
  );
  
  const config = VARIANTS[variant];
  
  trackVariantExposure(variant, profile.conversionStage === 'paid' ? 'known_user' : undefined);
  
  return config;
}

export { VARIANTS };