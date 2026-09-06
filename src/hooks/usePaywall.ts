'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/auth/useUser';
import { useSubscription } from '@/hooks/useSubscription';

interface PaywallState {
  canAccess: boolean;
  reason: 'free' | 'limit_reached' | 'premium' | 'loading' | 'no_user';
  remainingMessages: number;
  isPremium: boolean;
  shouldShowPaywall: boolean;
}

let checkSubscriptionAccessCached: typeof import('@/app/actions/subscription').checkSubscriptionAccess | null = null;
let checkAccessModulePromise: Promise<typeof import('@/app/actions/subscription')> | null = null;

async function getCheckAccessModule() {
  if (!checkAccessModulePromise) {
    checkAccessModulePromise = import('@/app/actions/subscription');
  }
  return checkAccessModulePromise;
}

async function callCheckAccess(userId: string, plan: 'free' | 'premium') {
  const mod = await getCheckAccessModule();
  if (!checkSubscriptionAccessCached) {
    checkSubscriptionAccessCached = mod.checkSubscriptionAccess;
  }
  return checkSubscriptionAccessCached(userId, plan);
}

export function usePaywallAccess(userId: string | null, plan: 'free' | 'premium' = 'free') {
  const { plan: userPlan, isPremium: premiumActive } = useSubscription();
  const [state, setState] = useState<PaywallState>({
    canAccess: true,
    reason: 'loading',
    remainingMessages: 1,
    isPremium: false,
    shouldShowPaywall: false,
  });

  const isPremium = premiumActive || plan === 'premium';

  useEffect(() => {
    if (!userId) {
      setState({
        canAccess: true,
        reason: 'no_user',
        remainingMessages: 1,
        isPremium: false,
        shouldShowPaywall: false,
      });
      return;
    }

    const checkAccess = async () => {
      if (isPremium) {
        setState({
          canAccess: true,
          reason: 'premium',
          remainingMessages: -1,
          isPremium: true,
          shouldShowPaywall: false,
        });
        return;
      }

      try {
        const result = await callCheckAccess(userId, 'free');

        setState({
          canAccess: result.canSendMessage,
          reason: result.canSendMessage ? 'free' : 'limit_reached',
          remainingMessages: result.remainingMessages,
          isPremium: result.isPremium,
          shouldShowPaywall: !result.canSendMessage,
        });
      } catch (error) {
        console.warn('[usePaywallAccess] Error checking access:', error);
        setState({
          canAccess: true,
          reason: 'loading',
          remainingMessages: 1,
          isPremium: false,
          shouldShowPaywall: false,
        });
      }
    };

    checkAccess();
  }, [userId, isPremium]);

  useEffect(() => {
    if (!state.canAccess && isPremium) {
      setState(prev => ({ ...prev, canAccess: true, shouldShowPaywall: false }));
    }
  }, [isPremium, state.canAccess]);

  const refreshAccess = async () => {
    if (!userId) return;

    if (isPremium) {
      setState(prev => ({ ...prev, canAccess: true, reason: 'premium', isPremium: true, shouldShowPaywall: false }));
      return;
    }

    try {
      const result = await callCheckAccess(userId, 'free');
      setState({
        canAccess: result.canSendMessage,
        reason: result.canSendMessage ? 'free' : 'limit_reached',
        remainingMessages: result.remainingMessages,
        isPremium: result.isPremium,
        shouldShowPaywall: !result.canSendMessage,
      });
    } catch (error) {
      console.warn('[usePaywallAccess] Refresh error:', error);
    }
  };

  return {
    ...state,
    refreshAccess,
  };
}

/**
 * Convenience hook to check if a specific feature requires upgrade.
 */
export function useFeatureAccess(feature: string) {
  const { plan, isPremium } = useSubscription();
  const premiumActive = plan === 'premium' && isPremium;

  const premiumFeatures = [
    'unlimited_readings',
    'unlimited_messages',
    'deep_insights',
    'priority_ai',
    'personal_consultation',
  ];

  return {
    canAccess: isPremium || !premiumFeatures.includes(feature),
    requiresUpgrade: !isPremium && premiumFeatures.includes(feature),
    isPremium,
  };
}
