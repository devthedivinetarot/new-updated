"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@/lib/auth/useUser';
import { useSubscription } from '@/hooks/useSubscription';

export interface DailyLimitState {
  messagesUsedToday: number;
  limitReached: boolean;
  canSendMessage: boolean;
  remaining: number;
}

const PREMIUM_OVERRIDE_KEY = 'premium_override';

export function useDailyLimit() {
  const { user, isLoading: userLoading } = useUser();
  const { isPremium, refetch: refetchSubscription } = useSubscription();
  const [state, setState] = useState<DailyLimitState>({
    messagesUsedToday: 0,
    limitReached: false,
    canSendMessage: true,
    remaining: -1,
  });

  const userId = user?.id || null;
  const previousUserIdRef = useRef<string | null>(null);

  const fetchLimit = useCallback(async () => {
    if (!userId) {
      setState({
        messagesUsedToday: 0,
        limitReached: false,
        canSendMessage: true,
        remaining: -1,
      });
      return;
    }

    try {
      const response = await fetch('/api/daily-limit');
      if (response.ok) {
        const data = await response.json();
        setState({
          messagesUsedToday: data.messagesUsedToday || 0,
          limitReached: data.limitReached || false,
          canSendMessage: data.canSendMessage ?? true,
          remaining: data.remaining ?? -1,
        });
      }
    } catch (error) {
      console.error('[useDailyLimit] Fetch error:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && previousUserIdRef.current !== userId) {
      previousUserIdRef.current = userId;
      fetchLimit();
    }
  }, [userId, fetchLimit]);

  useEffect(() => {
    if (isPremium) {
      setState(prev => ({
        ...prev,
        messagesUsedToday: 0,
        limitReached: false,
        canSendMessage: true,
        remaining: -1,
      }));
    }
  }, [isPremium]);

  const refetch = useCallback(() => {
    fetchLimit();
    refetchSubscription();
  }, [fetchLimit, refetchSubscription]);

  return {
    ...state,
    isPremium,
    isLoading: userLoading,
    refetch,
  };
}