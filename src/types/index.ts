// src/types/index.ts
export type SubscriptionPlan = 'free' | 'premium';

export interface User {
  id: string;
  plan?: SubscriptionPlan;
  subscriptionStatus?: 'active' | 'inactive';
}