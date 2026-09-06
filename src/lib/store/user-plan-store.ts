import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { checkUserAccess } from '@/lib/access-control';

export interface UserPlanState {
  plan: 'free' | 'premium';
  remainingReads: number;
  isPremium: boolean;
  lastUpdated: number | null;
  
  // Actions
  refreshAccess: (userId: string | null | undefined) => Promise<void>;
  setPlan: (plan: 'free' | 'premium') => void;
  decrementRemaining: () => void;
  reset: () => void;
}

export const useUserPlanStore = create<UserPlanState>()(
  persist(
    (set, get) => ({
      plan: 'free',
      remainingReads: 0,
      isPremium: false,
      lastUpdated: null,

      refreshAccess: async (userId) => {
        try {
          const access = await checkUserAccess(userId);
          set({
            plan: access.plan,
            remainingReads: access.remainingReads,
            isPremium: access.plan === 'premium',
            lastUpdated: Date.now(),
          });
        } catch (error) {
          console.error('[UserPlanStore] Refresh error:', error);
        }
      },

      setPlan: (plan) => {
        set({
          plan,
          isPremium: plan === 'premium',
          remainingReads: plan === 'premium' ? -1 : 3,
          lastUpdated: Date.now(),
        });
      },

      decrementRemaining: () => {
        set((state) => {
          if (state.isPremium) return state;
          return {
            ...state,
            remainingReads: Math.max(0, state.remainingReads - 1),
          };
        });
      },

      reset: () => {
        set({
          plan: 'free',
          remainingReads: 0,
          isPremium: false,
          lastUpdated: null,
        });
      },
    }),
    {
      name: 'tdt-user-plan',
      version: 1,
    }
  )
);

/**
 * Convenience hook for components
 */
export const useUserPlan = () => {
  const plan = useUserPlanStore((s) => s.plan);
  const remainingReads = useUserPlanStore((s) => s.remainingReads);
  const isPremium = useUserPlanStore((s) => s.isPremium);
  const refreshAccess = useUserPlanStore((s) => s.refreshAccess);
  const setPlan = useUserPlanStore((s) => s.setPlan);
  const decrementRemaining = useUserPlanStore((s) => s.decrementRemaining);
  
  return {
    plan,
    remainingReads,
    isPremium,
    refreshAccess,
    setPlan,
    decrementRemaining,
  };
};