// src/lib/system/accessControl.ts

import { getRemainingMessages, incrementMessageCount, canSendMessage as checkMessageLimit } from '@/lib/payments/plans';

export async function canAccessReading(
  userId: string | null,
  plan: 'free' | 'premium' = 'free'
): Promise<{ allowed: boolean; reason: string }> {
  if (plan === 'premium') {
    return { allowed: true, reason: 'premium' };
  }

  if (!userId) {
    return { allowed: true, reason: 'no_user' };
  }

  const remaining = await getRemainingMessages(userId);
  return {
    allowed: remaining > 0,
    reason: remaining > 0 ? 'free' : 'limit_reached'
  };
}

export async function recordMessageSent(userId: string): Promise<void> {
  await incrementMessageCount(userId);
}

export async function getReadingsRemaining(
  userId: string | null,
  plan: 'free' | 'premium' = 'free'
): Promise<number> {
  if (plan === 'premium') return -1;
  if (!userId) return 1;
  
  const remaining = await getRemainingMessages(userId);
  return remaining;
}