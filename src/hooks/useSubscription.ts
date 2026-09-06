import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/lib/auth/useUser';

export interface SubscriptionData {
  isPremium: boolean;
  plan: 'free' | 'premium';
  status: string | null;
  subscriptionEndDate: string | null;
}

const PREMIUM_OVERRIDE_KEY = 'premium_override';
const OVERRIDE_EXPIRY_HOURS = 48;

interface PremiumOverride {
  timestamp: number;
  isPremium: boolean;
}

export function useSubscription() {
  const { user, isLoading: userLoading } = useUser();
  const [state, setState] = useState<SubscriptionData>({
    isPremium: false,
    plan: 'free',
    status: null,
    subscriptionEndDate: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const userId = user?.id || null;

  const getPremiumOverride = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      const stored = localStorage.getItem(PREMIUM_OVERRIDE_KEY);
      if (!stored) return false;
      
      const parsed: PremiumOverride = JSON.parse(stored);
      const ageHours = (Date.now() - parsed.timestamp) / (1000 * 60 * 60);
      
      if (ageHours > OVERRIDE_EXPIRY_HOURS) {
        localStorage.removeItem(PREMIUM_OVERRIDE_KEY);
        return false;
      }
      
      return parsed.isPremium;
    } catch {
      return false;
    }
  }, []);

  const setPremiumOverride = useCallback((isPremium: boolean) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(PREMIUM_OVERRIDE_KEY, JSON.stringify({
        timestamp: Date.now(),
        isPremium,
      }));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const refetch = useCallback(async () => {
    if (!userId) {
      setState({
        isPremium: false,
        plan: 'free',
        status: null,
        subscriptionEndDate: null,
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscription/status');
      const data = await response.json();
      
      const isPremium = data.plan === 'premium' && data.subscription_status === 'active';
      
      if (isPremium) {
        setPremiumOverride(true);
      } else {
        localStorage.removeItem(PREMIUM_OVERRIDE_KEY);
      }
      
      setState({
        isPremium,
        plan: data.plan || 'free',
        status: data.subscription_status,
        subscriptionEndDate: data.subscription_end_date,
      });
    } catch (error) {
      console.error('[useSubscription] Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, setPremiumOverride]);

  useEffect(() => {
    let cancelled = false;

    const fetchStatus = async () => {
      if (!userId) {
        if (!cancelled) {
          setState({
            isPremium: false,
            plan: 'free',
            status: null,
            subscriptionEndDate: null,
          });
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      
      const override = getPremiumOverride();
      
      try {
        const response = await fetch('/api/subscription/status');
        const data = await response.json();
        
        const isPremium = data.plan === 'premium' && data.subscription_status === 'active';
        
        if (isPremium) {
          setPremiumOverride(true);
        } else {
          localStorage.removeItem(PREMIUM_OVERRIDE_KEY);
        }
        
        if (!cancelled) {
          setState({
            isPremium,
            plan: data.plan || 'free',
            status: data.subscription_status,
            subscriptionEndDate: data.subscription_end_date,
          });
        }
      } catch (error) {
        console.error('[useSubscription] Fetch error:', error);
        if (!cancelled && override) {
          setState(prev => ({ ...prev, isPremium: override }));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, [userId, getPremiumOverride, setPremiumOverride]);

  return {
    isPremium: state.isPremium,
    plan: state.plan,
    status: state.status,
    subscriptionEndDate: state.subscriptionEndDate,
    isLoading,
    refetch,
  };
}