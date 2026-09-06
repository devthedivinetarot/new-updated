'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscriptionStatus: 'inactive' | 'active' | 'pending';
  checkSubscriptionStatus: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'inactive' | 'active' | 'pending'>('inactive');

  const checkSubscriptionStatus = async () => {
    try {
      // Dynamically import to avoid SSR issues
      const { isRazorpayConfigured } = await import('@/lib/payments/razorpay');
      // If Razorpay is not configured, treat as not subscribed
      if (!isRazorpayConfigured()) {
        setIsSubscribed(false);
        setSubscriptionStatus('inactive');
        return;
      }
      setIsSubscribed(false);
      setSubscriptionStatus('inactive');
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      setIsSubscribed(false);
      setSubscriptionStatus('inactive');
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  return (
    <SubscriptionContext.Provider value={{ isSubscribed, subscriptionStatus, checkSubscriptionStatus }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
