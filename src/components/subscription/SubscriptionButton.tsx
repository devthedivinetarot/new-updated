'use client';

import { useState, useCallback } from 'react';
import { Crown } from 'lucide-react';
import { useUser } from '@/lib/auth/useUser';
import { useSubscription } from '@/hooks/useSubscription';

interface SubscriptionButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function SubscriptionButton({
  variant = 'primary',
  size = 'md',
  className = '',
}: SubscriptionButtonProps) {
  const { isLoading: userLoading } = useUser();
  const { isPremium, refetch } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getButtonStyles = useCallback(() => {
    const baseStyles = 'rounded-xl font-semibold transition-all duration-300 ';
    
    if (variant === 'primary') {
      return baseStyles + 'bg-gradient-to-r from-[#FFD700] to-[#FFC400] text-black hover:shadow-lg hover:shadow-[#FFD700]/25';
    } else {
      return baseStyles + 'bg-white/10 text-[#EAEAF0] hover:bg-white/20 border border-white/20';
    }
  }, [variant]);

  const getSizeStyles = useCallback(() => {
    switch (size) {
      case 'sm': return 'py-2.5 px-4 text-sm';
      case 'lg': return 'py-4 px-6 text-lg';
      default: return 'py-3.5 px-5 text-base';
    }
  }, [size]);

  const handleClick = useCallback(async () => {
    if (isProcessing || isPremium) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { handlePremiumCheckout } = await import('@/lib/payments/handlePremiumCheckout');
      
      const result = await handlePremiumCheckout('subscription-button');

      if (result.success) {
        await refetch();
      } else if (result.error !== 'Payment cancelled') {
        setError(result.error || 'Payment failed');
        setIsProcessing(false);
      } else {
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('[SubscriptionButton] Payment error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  }, [isProcessing, isPremium, refetch]);

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing || isPremium || userLoading}
      className={`${getButtonStyles()} ${getSizeStyles()} ${className} w-full`}
    >
      {isProcessing ? (
        <>
          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
          Processing...
        </>
      ) : isPremium ? (
        <>
          <span className="mr-2">✓</span> Active Premium
        </>
      ) : (
        <>
           <Crown className="w-4 h-4 mr-2" /> Unlock Premium — ₹199/month
        </>
      )}
    </button>
  );
}