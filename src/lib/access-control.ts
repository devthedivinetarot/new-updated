import { createServerClient } from '@/lib/supabase/server';
import { SUBSCRIPTION_PLANS, PlanType, hasUnlimitedReadings, getPlanLimit } from '@/lib/payments/plans';
import { getUpgradePrompt } from '@/lib/payments/access-control';

export interface UserAccess {
  plan: 'free' | 'premium';
  remainingReads: number;
  allowed: boolean;
  upgrade?: boolean;
}

/**
 * Centralized access control - universal across the application
 * Returns plan info, remaining reads, and whether user can generate a reading
 */
export async function checkUserAccess(userId: string | null | undefined): Promise<UserAccess> {
  // If no user or no Supabase, default to free with daily reset check
  if (!userId) {
    return {
      plan: 'free',
      remainingReads: 0,
      allowed: false,
      upgrade: true,
    };
  }

  const supabase = await createServerClient();
  
  if (!supabase) {
    // Development mode - allow access
    return {
      plan: 'premium',
      remainingReads: -1,
      allowed: true,
    };
  }

  // Fetch user from database
  const { data: user, error } = await supabase
    .from('users')
    .select('plan, subscription_status, subscription_end_date, readings_today, last_reading_date')
    .eq('id', userId)
    .single();

  if (error || !user) {
    // User not found or error - default to free
    return {
      plan: 'free',
      remainingReads: 0,
      allowed: false,
      upgrade: true,
    };
  }

  // Determine user's effective plan
  let effectivePlan: PlanType = 'free';
  const userPlan = (user.plan as PlanType) || 'free';
  const subStatus = user.subscription_status || 'inactive';
  const subEndDate = user.subscription_end_date ? new Date(user.subscription_end_date) : null;
  const now = new Date();

  // Check if premium subscription is active
  if (userPlan === 'premium' && subStatus === 'active' && subEndDate && subEndDate > now) {
    effectivePlan = 'premium';
  } else if (userPlan === 'premium' && subStatus === 'active' && !subEndDate) {
    // No expiry date means active
    effectivePlan = 'premium';
  } else {
    // Default to free
    effectivePlan = 'free';
    // Auto-downgrade if subscription expired
    if (userPlan === 'premium' && subEndDate && subEndDate <= now) {
      try {
        await supabase
          .from('users')
          .update({ plan: 'free', subscription_status: 'inactive' })
          .eq('id', userId);
      } catch (e) {
        console.error('[AccessControl] Auto-downgrade error:', e);
      }
    }
  }

  // Unlimited reads for premium
  if (hasUnlimitedReadings(effectivePlan)) {
    return {
      plan: effectivePlan,
      remainingReads: -1,
      allowed: true,
    };
  }

  // For free plan, check daily limit with automatic 24h reset
  const limit = getPlanLimit(effectivePlan);
  const lastReadingDate = user.last_reading_date ? new Date(user.last_reading_date) : null;
  const today = now.toDateString();
  const lastDateStr = lastReadingDate ? lastReadingDate.toDateString() : null;

  // Check if we need to reset (24h period or new day)
  let remaining = limit;
  if (lastDateStr === today) {
    const currentCount = user.readings_today || 0;
    remaining = Math.max(0, limit - currentCount);
  } else {
    // Auto-reset: different day, reset counter but don't update DB here (only on actual reading)
    remaining = limit;
  }

  const allowed = remaining > 0;

  return {
    plan: effectivePlan,
    remainingReads: remaining,
    allowed,
    upgrade: !allowed,
  };
}

/**
 * Increment reading count for free users after successful reading
 * Should be called AFTER generating a reading
 */
export async function incrementReadingCount(userId: string): Promise<void> {
  const supabase = await createServerClient();
  
  if (!supabase) return;

  try {
    const today = new Date().toDateString();
    
    const { data: user } = await supabase
      .from('users')
      .select('readings_today, last_reading_date')
      .eq('id', userId)
      .single();
    
    if (!user) return;

    const lastDate = user.last_reading_date 
      ? new Date(user.last_reading_date).toDateString() 
      : null;

    await supabase
      .from('users')
      .update({
        readings_today: lastDate === today ? (user.readings_today || 0) + 1 : 1,
        last_reading_date: new Date().toISOString(),
      })
      .eq('id', userId);
  } catch (error) {
    console.error('[AccessControl] Increment reading error:', error);
  }
}

/**
 * Get user's current plan info
 */
export async function getUserPlanInfo(userId: string): Promise<{
  plan: 'free' | 'premium';
  remainingReads: number;
  isPremium: boolean;
}> {
  const access = await checkUserAccess(userId);
  return {
    plan: access.plan,
    remainingReads: access.remainingReads,
    isPremium: access.plan === 'premium',
  };
}