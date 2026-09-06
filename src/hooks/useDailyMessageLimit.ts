'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@/lib/auth/useUser';
import { getRemainingMessages as getRemaining, incrementMessageCount as incrementCount } from '@/lib/payments/plans';
import { useSubscription } from '@/hooks/useSubscription';

const MESSAGE_COUNT_KEY = 'daily_message_limit_count';
const MESSAGE_DATE_KEY = 'daily_message_limit_date';
const RESET_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface DailyLimitState {
  remaining: number;
  totalAllowed: number;
  used: number;
  resetTime: number; // unix timestamp when limit resets
  isUnlimited: boolean;
  canSendMessage: boolean;
}

export function useDailyMessageLimit() {
  const { user, isLoading: userLoading } = useUser();
  const { plan, isPremium: premiumActive } = useSubscription();
  const [state, setState] = useState<DailyLimitState>({
    remaining: 1,
    totalAllowed: 1,
    used: 0,
    resetTime: Date.now() + RESET_INTERVAL_MS,
    isUnlimited: false,
    canSendMessage: true,
  });

  const userId = user?.id || null;
  const previousUserIdRef = useRef<string | null>(null);

  // Determine limits based on plan
  const totalAllowed = premiumActive ? -1 : 1;
  const isUnlimited = premiumActive;

  useEffect(() => {
    if (!userId) return;
    if (previousUserIdRef.current !== userId) {
      previousUserIdRef.current = userId;
    }
  }, [userId]);

  // Check limit on mount and on plan change
  useEffect(() => {
    const checkLimit = async () => {
      if (!userId) {
        setState({
          remaining: 1,
          totalAllowed: 1,
          used: 0,
          resetTime: Date.now() + RESET_INTERVAL_MS,
          isUnlimited: false,
          canSendMessage: true,
        });
        return;
      }

      // Premium users have unlimited access
      if (isUnlimited) {
        setState({
          remaining: -1,
          totalAllowed: -1,
          used: 0,
          resetTime: Date.now() + RESET_INTERVAL_MS,
          isUnlimited: true,
          canSendMessage: true,
        });
        return;
      }

      const remaining = await getRemaining(userId);
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem(`${MESSAGE_DATE_KEY}_${userId}`);
      let used = parseInt(localStorage.getItem(`${MESSAGE_COUNT_KEY}_${userId}`) || '0', 10);

      // Reset if new day
      if (storedDate !== today) {
        used = 0;
        localStorage.setItem(`${MESSAGE_DATE_KEY}_${userId}`, today);
        localStorage.setItem(`${MESSAGE_COUNT_KEY}_${userId}`, '0');
      }

      const newRemaining = Math.max(0, 1 - used);
      const now = Date.now();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const resetTime = tomorrow.getTime();

      setState({
        remaining: newRemaining,
        totalAllowed: 1,
        used,
        resetTime,
        isUnlimited: false,
        canSendMessage: newRemaining > 0,
      });
    };

    checkLimit();
  }, [userId, plan, premiumActive, isUnlimited]);

  // Auto-reset check periodically
  useEffect(() => {
    if (isUnlimited) return;

    const timer = setInterval(() => {
      const now = new Date();
      const today = now.toDateString();

      if (!userId) return;

      const storedDate = localStorage.getItem(`${MESSAGE_DATE_KEY}_${userId}`);
      if (storedDate && storedDate !== today) {
        // New day - reset
        localStorage.setItem(`${MESSAGE_DATE_KEY}_${userId}`, today);
        localStorage.setItem(`${MESSAGE_COUNT_KEY}_${userId}`, '0');

        setState(prev => ({
          ...prev,
          remaining: 1,
          used: 0,
          canSendMessage: true,
          resetTime: new Date(now.getTime() + RESET_INTERVAL_MS).getTime(),
        }));
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(timer);
  }, [userId, isUnlimited]);

  // Consume a message
  const consumeMessage = useCallback(async (): Promise<boolean> => {
    if (!userId) return true;
    if (isUnlimited) return true;

    const canSend = await canSendMessage();
    if (!canSend) return false;

    await incrementCount(userId);

    const today = new Date().toDateString();
    const storedDate = localStorage.getItem(`${MESSAGE_DATE_KEY}_${userId}`);
    const count = parseInt(localStorage.getItem(`${MESSAGE_COUNT_KEY}_${userId}`) || '0', 10);

    if (storedDate === today) {
      localStorage.setItem(`${MESSAGE_COUNT_KEY}_${userId}`, String(count + 1));
    } else {
      localStorage.setItem(`${MESSAGE_DATE_KEY}_${userId}`, today);
      localStorage.setItem(`${MESSAGE_COUNT_KEY}_${userId}`, '1');
    }

    const newRemaining = Math.max(0, 1 - (count + 1));
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    setState(prev => ({
      ...prev,
      used: count + 1,
      remaining: newRemaining,
      canSendMessage: newRemaining > 0,
      resetTime: tomorrow.getTime(),
    }));

    return true;
  }, [userId, isUnlimited]);

  // Check if can send message
  const canSendMessage = useCallback(async (): Promise<boolean> => {
    if (!userId) return true;
    if (isUnlimited) return true;

    const remaining = await getRemaining(userId);
    return remaining > 0;
  }, [userId, isUnlimited]);

  // Force refresh
  const refresh = useCallback(async () => {
    if (!userId || isUnlimited) return;

    const remaining = await getRemaining(userId);
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem(`${MESSAGE_DATE_KEY}_${userId}`);
    let used = parseInt(localStorage.getItem(`${MESSAGE_COUNT_KEY}_${userId}`) || '0', 10);

    if (storedDate !== today) {
      used = 0;
    }

    setState(prev => ({
      ...prev,
      remaining,
      used,
      canSendMessage: remaining > 0,
    }));
  }, [userId, isUnlimited]);

  // Get formatted time until reset
  const getTimeUntilReset = useCallback((): string => {
    if (isUnlimited) return '';

    const now = Date.now();
    const diff = state.resetTime - now;

    if (diff <= 0) return 'Resets now';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  }, [state.resetTime, isUnlimited]);

  return {
    ...state,
    consumeMessage,
    canSendMessage,
    refresh,
    getTimeUntilReset,
    isLoading: userLoading,
  };
}
