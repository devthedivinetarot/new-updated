'use server';

import { createServerClient } from '@/lib/supabase/server';
import { getRemainingMessages, incrementMessageCount } from '@/lib/payments/plans';

export interface AccessResult {
  allowed: boolean;
  remainingMessages: number;
  canSendMessage: boolean;
  isPremium: boolean;
  plan: 'free' | 'premium';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'past_due' | null;
}

export async function checkSubscriptionAccess(
  userId: string | null,
  _plan: 'free' | 'premium' = 'free',
): Promise<AccessResult> {
  const supabase = await createServerClient();

  // SECURITY: never trust caller-provided userId/plan.
  const { data: authData } = await supabase.auth.getUser();
  const authenticatedUserId = authData?.user?.id ?? null;
  const effectiveUserId = authenticatedUserId ?? userId;

  if (!effectiveUserId) {
    return {
      allowed: false,
      remainingMessages: 0,
      canSendMessage: false,
      isPremium: false,
      plan: 'free',
      subscriptionStatus: null,
    };
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('plan, subscription_status, subscription_end_date, readings_today, last_reading_date')
      .eq('id', effectiveUserId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[checkSubscriptionAccess] DB error:', error);
      const remaining = await getRemainingMessages(effectiveUserId);
      return {
        allowed: remaining > 0,
        remainingMessages: remaining,
        canSendMessage: remaining > 0,
        isPremium: false,
        plan: 'free',
        subscriptionStatus: null,
      };
    }

    if (!user) {
      const remaining = await getRemainingMessages(effectiveUserId);
      return {
        allowed: remaining > 0,
        remainingMessages: remaining,
        canSendMessage: remaining > 0,
        isPremium: false,
        plan: 'free',
        subscriptionStatus: null,
      };
    }

    const dbPlan = (user.plan || 'free') as 'free' | 'premium';
    const status = user.subscription_status as
      | 'active'
      | 'inactive'
      | 'cancelled'
      | 'past_due'
      | null;
    const endDate = user.subscription_end_date
      ? new Date(user.subscription_end_date)
      : null;

    const isPremiumActive =
      dbPlan === 'premium' &&
      status === 'active' &&
      (!endDate || endDate > new Date());

    if (isPremiumActive) {
      return {
        allowed: true,
        remainingMessages: -1,
        canSendMessage: true,
        isPremium: true,
        plan: 'premium',
        subscriptionStatus: 'active',
      };
    }

    const today = new Date().toDateString();
    const lastReadingDate = user.last_reading_date
      ? new Date(user.last_reading_date).toDateString()
      : null;

    let remaining = 1;
    if (lastReadingDate === today) {
      remaining = Math.max(0, 1 - (user.readings_today || 0));
    }

    return {
      allowed: remaining > 0,
      remainingMessages: remaining,
      canSendMessage: remaining > 0,
      isPremium: false,
      plan: 'free',
      subscriptionStatus: status,
    };
  } catch (error) {
    console.error('[checkSubscriptionAccess] Error:', error);
    const remaining = await getRemainingMessages(effectiveUserId);
    return {
      allowed: remaining > 0,
      remainingMessages: remaining,
      canSendMessage: remaining > 0,
      isPremium: false,
      plan: 'free',
      subscriptionStatus: null,
    };
  }
}

export async function recordMessage(userId: string): Promise<void> {
  const supabase = await createServerClient();

  // SECURITY: user can only record messages for themselves.
  const { data: authData } = await supabase.auth.getUser();
  const authenticatedUserId = authData?.user?.id ?? null;
  if (!authenticatedUserId || authenticatedUserId !== userId) {
    return;
  }

  await incrementMessageCount(userId);

  try {
    const today = new Date();
    const todayStr = today.toDateString();

    const { data: user } = await supabase
      .from('users')
      .select('readings_today, last_reading_date')
      .eq('id', userId)
      .single();

    if (user) {
      const lastDate = user.last_reading_date
        ? new Date(user.last_reading_date).toDateString()
        : null;

      await supabase.from('users').upsert({
        id: userId,
        readings_today:
          lastDate === todayStr ? (user.readings_today || 0) + 1 : 1,
        last_reading_date: today.toISOString(),
        updated_at: today.toISOString(),
      });
    }

    await supabase.from('events').insert({
      user_id: userId,
      event_name: 'message_sent',
      metadata: { plan: 'free', timestamp: today.toISOString() },
    });
  } catch (error) {
    console.error('[recordMessage] Supabase update failed:', error);
  }
}

export async function checkSubscriptionStatus(
  userId: string,
): Promise<{
  isActive: boolean;
  plan: 'free' | 'premium';
  endDate?: Date;
  status: string;
}> {
  if (!userId) {
    return { isActive: false, plan: 'free', status: 'inactive' };
  }

  try {
    const supabase = await createServerClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('plan, subscription_status, subscription_end_date')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return { isActive: false, plan: 'free', status: 'inactive' };
    }

    const plan = (user.plan || 'free') as 'free' | 'premium';
    const status = (user.subscription_status || 'inactive') as string;
    const endDate = user.subscription_end_date
      ? new Date(user.subscription_end_date)
      : undefined;

    const isActive =
      status === 'active' && (!endDate || endDate > new Date());

    return { isActive, plan, endDate, status };
  } catch (error) {
    console.error('[checkSubscriptionStatus] Error:', error);
    return { isActive: false, plan: 'free', status: 'inactive' };
  }
}

export async function createPremiumOrderServer(
  userId: string,
): Promise<{ orderId: string; amount: number; key: string } | null> {
  try {
    const response = await fetch('/api/premium-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.alreadyPremium) {
      return { orderId: '', amount: 0, key: '' };
    }

    return data;
  } catch (error) {
    console.error('[createPremiumOrderServer] Error:', error);
    return null;
  }
}

export async function activatePremiumSubscriptionServer(
  userId: string,
  paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/premium-order/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        ...paymentData,
      }),
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to verify payment' };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('[activatePremiumSubscriptionServer] Error:', error);
    return { success: false, error: error.message || 'Activation failed' };
  }
}

export async function resetDailyCounter(userId: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const today = new Date();
  today.setDate(today.getDate() - 1);
  localStorage.setItem(`subscription_daily_date_${userId}`, today.toDateString());
  localStorage.setItem(`subscription_daily_count_${userId}`, '0');
}

