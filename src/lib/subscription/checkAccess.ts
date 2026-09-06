import { createServerClient } from '@/lib/supabase/server';

export interface DailyLimitResult {
  allowed: boolean;
  count: number;
}

export interface PremiumStatusResult {
  isPremium: boolean;
  plan: 'free' | 'premium';
}

export async function checkDailyLimit(userId: string): Promise<DailyLimitResult> {
  if (!userId) {
    return { allowed: true, count: 0 };
  }

  const supabase = await createServerClient();
  
  const today = new Date().toISOString().split('T')[0];
  
  const { data: message, error } = await supabase
    .from('messages')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00.000Z`)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[checkDailyLimit] DB error:', error);
    return { allowed: true, count: 0 };
  }

  const { data: countData } = await supabase
    .from('messages')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00.000Z`);

  const count = countData?.length || 0;
  return {
    allowed: count < 1,
    count,
  };
}

export async function checkPremiumStatus(userId: string): Promise<PremiumStatusResult> {
  if (!userId) {
    return { isPremium: false, plan: 'free' };
  }

  const supabase = await createServerClient();

  const { data: user, error } = await supabase
    .from('users')
    .select('plan, subscription_status, subscription_end_date')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return { isPremium: false, plan: 'free' };
  }

  const plan = (user.plan || 'free') as 'free' | 'premium';
  const status = user.subscription_status;
  const endDate = user.subscription_end_date ? new Date(user.subscription_end_date) : null;

  const isPremium = plan === 'premium' && status === 'active' && (!endDate || endDate > new Date());

  return {
    isPremium,
    plan,
  };
}