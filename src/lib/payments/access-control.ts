import { createServerClient } from '@/lib/supabase/server';
import { SUBSCRIPTION_PLANS, PlanType, hasUnlimitedReadings, getPlanLimit } from './plans';
import { createOrder, verifyPaymentSignature, createSubscription, generateReceiptId } from './razorpay';

export interface ReadingAccessResult {
  allowed: boolean;
  remainingReadings: number;
  upgradePrompt?: string;
}

export async function checkReadingAccess(userId: string): Promise<ReadingAccessResult> {
  const supabase = await createServerClient();
  
  if (!supabase) {
    return {
      allowed: true,
      remainingReadings: -1,
    };
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('plan, readings_today, last_reading_date')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return {
      allowed: true,
      remainingReadings: 1,
    };
  }

  const plan = user.plan as PlanType || 'free';
  
  if (hasUnlimitedReadings(plan)) {
    return {
      allowed: true,
      remainingReadings: -1,
    };
  }

  const limit = getPlanLimit(plan);
  const today = new Date().toDateString();
  const lastReadingDate = user.last_reading_date ? new Date(user.last_reading_date).toDateString() : null;
  
  let remaining = limit;
  
  if (lastReadingDate === today) {
    remaining = Math.max(0, limit - (user.readings_today || 0));
  }

  if (remaining <= 0) {
    return {
      allowed: false,
      remainingReadings: 0,
      upgradePrompt: getUpgradePrompt(plan),
    };
  }

  return {
    allowed: true,
    remainingReadings: remaining - 1,
  };
}

export function getUpgradePrompt(currentPlan: PlanType): string {
  const prompts: Record<PlanType, string> = {
    free: "You've used your free reading for today. Unlock unlimited readings for just ₹199/month!",
    premium: "Your premium subscription has expired. Renew to continue enjoying unlimited readings.",
  };
  return prompts[currentPlan];
}

export async function incrementReadingCount(userId: string): Promise<void> {
  const supabase = await createServerClient();
  
  if (!supabase) return;

  const today = new Date().toDateString();
  
  try {
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

export async function initiatePayment(
  userId: string,
  planType: "premium"
): Promise<{ orderId: string; amount: number; key?: string } | null> {
  const plan = SUBSCRIPTION_PLANS[planType];
  
  const order = await createOrder({
    amount: plan.price,
    currency: 'INR',
    receipt: generateReceiptId(userId, planType),
    userId,
    planType,
  });

  if (!order) return null;

  return {
    orderId: order.id,
    amount: order.amount,
    key: process.env.RAZORPAY_KEY_ID,
  };
}

export async function verifyAndActivateSubscription(
  userId: string,
  paymentData: {
    razorpay_order_id: string;
    planType: "premium";
    razorpay_signature: string;
    razorpay_payment_id?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const isValid = verifyPaymentSignature(paymentData as any);
  
  if (!isValid) {
    return { success: false, error: 'Invalid payment signature' };
  }

  const supabase = await createServerClient();
  
  if (!supabase) {
    return { success: true };
  }

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  const { error } = await supabase
    .from('users')
    .update({
      plan: paymentData.planType,
      subscription_status: 'active',
      subscription_end_date: endDate.toISOString(),
      auto_renew: true,
    })
    .eq('id', userId);

  if (error) {
    console.error('[Payment] Activation error:', error);
    return { success: false, error: 'Failed to activate subscription' };
  }

  return { success: true };
}

export async function checkSubscriptionStatus(userId: string): Promise<{
  isActive: boolean;
  plan: PlanType;
  endDate?: Date;
}> {
  const supabase = await createServerClient();
  
  if (!supabase) {
    return { isActive: false, plan: 'free' };
  }

  const { data: user } = await supabase
    .from('users')
    .select('plan, subscription_status, subscription_end_date')
    .eq('id', userId)
    .single();

  if (!user) {
    return { isActive: false, plan: 'free' };
  }

  const plan = (user.plan || 'free') as PlanType;
  const status = user.subscription_status;
  const endDate = user.subscription_end_date ? new Date(user.subscription_end_date) : undefined;
  
  const isActive = status === 'active' && (!endDate || endDate > new Date());

  return { isActive, plan, endDate };
}

export async function cancelUserSubscription(userId: string): Promise<boolean> {
  const supabase = await createServerClient();
  
  if (!supabase) return false;

  const { error } = await supabase
    .from('users')
    .update({
      plan: 'free',
      subscription_status: 'cancelled',
      auto_renew: false,
    })
    .eq('id', userId);

  return !error;
}

export function getUpgradeCTAMessage(userPlan: PlanType): string {
  const messages: Record<PlanType, string> = {
    free: "Unlock unlimited readings and deep insights with Premium!",
    premium: "Your Premium plan is active - enjoy unlimited readings!",
  };
  return messages[userPlan];
}
