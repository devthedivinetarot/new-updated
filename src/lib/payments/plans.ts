// src/lib/payments/plans.ts

export type PlanType = 'free' | 'premium';
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due';

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  priceId?: string;
  features: string[];
  readingsPerDay: number;
  aiResponsesPriority: boolean;
  personalConsultation: boolean;
  whatsappExclusive: boolean;
}

const MESSAGE_COUNT_KEY = 'daily_message_count';
const MESSAGE_DATE_KEY = 'daily_message_date';

export const SUBSCRIPTION_PLANS: Record<PlanType, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    type: 'free',
    price: 0,
    priceId: '',
    features: [
      // Keep in sync with the free limit enforced by the reading chat app
      // (chat.thedivinetarotonline.com), which users actually see.
      '3 free readings per day',
      'Basic tarot guidance',
    ],
    readingsPerDay: 3,
    aiResponsesPriority: false,
    personalConsultation: false,
    whatsappExclusive: false,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    type: 'premium',
    price: 199,
    priceId: 'premium_monthly_inr',
    features: [
      'Unlimited tarot readings',
      'Unlimited messages with Ginni',
      'Deep spiritual insights',
      'Priority response experience',
    ],
    readingsPerDay: -1,
    aiResponsesPriority: true,
    personalConsultation: false,
    whatsappExclusive: false,
  },
};

export interface UserSubscription {
  userId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
  autoRenew: boolean;
  paymentId?: string;
  razorpaySubscriptionId?: string;
}

export function canAccessFeature(userPlan: PlanType, feature: string): boolean {
  const allowedPlans: Record<string, PlanType[]> = {
    unlimited_readings: ['premium'],
    deep_insights: ['premium'],
    priority_ai: ['premium'],
    personal_consultation: ['premium'],
  };
  
  return (allowedPlans[feature] || []).includes(userPlan);
}

export function getPlanLimit(plan: PlanType): number {
  return SUBSCRIPTION_PLANS[plan].readingsPerDay;
}

export function hasUnlimitedReadings(plan: PlanType): boolean {
  return SUBSCRIPTION_PLANS[plan].readingsPerDay === -1;
}

export function getNextPlan(currentPlan: PlanType): PlanType | null {
  const upgrades: Record<PlanType, PlanType | null> = {
    free: 'premium',
    premium: null,
  };
  return upgrades[currentPlan];
}

export function getPlanDisplayPrice(plan: PlanType, region: 'india' = 'india'): string {
  const planConfig = SUBSCRIPTION_PLANS[plan];
  if (planConfig.price === 0) return 'Free';
  return `₹${planConfig.price}/month`;
}

export async function getRemainingMessages(userId: string): Promise<number> {
  if (typeof window === 'undefined') return 1;

  const today = new Date().toDateString();
  const storedDate = localStorage.getItem(`${MESSAGE_DATE_KEY}_${userId}`);
  
  if (storedDate !== today) {
    localStorage.setItem(`${MESSAGE_DATE_KEY}_${userId}`, today);
    localStorage.setItem(`${MESSAGE_COUNT_KEY}_${userId}`, '0');
    return 1;
  }

  const count = parseInt(localStorage.getItem(`${MESSAGE_COUNT_KEY}_${userId}`) || '0', 10);
  return Math.max(0, 1 - count);
}

export async function incrementMessageCount(userId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  const count = parseInt(localStorage.getItem(`${MESSAGE_COUNT_KEY}_${userId}`) || '0', 10);
  localStorage.setItem(`${MESSAGE_COUNT_KEY}_${userId}`, String(count + 1));
}

export async function canSendMessage(
  userId: string,
  plan: PlanType
): Promise<{ allowed: boolean; remainingMessages: number }> {
  if (plan === 'premium') {
    return { allowed: true, remainingMessages: -1 };
  }

  const remaining = await getRemainingMessages(userId);
  return {
    allowed: remaining > 0,
    remainingMessages: remaining,
  };
}