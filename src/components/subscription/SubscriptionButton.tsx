'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { isLoading: userLoading } = useUser();
  const { isPremium } = useSubscription();

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

  const handleClick = useCallback(() => {
    if (isPremium) return;
    // All premium buttons route to the reading page, which auto-opens the
    // subscription modal (PremiumUpgradeModal) via the ?upgrade=1 param.
    router.push('/reading?upgrade=1');
  }, [isPremium, router]);

  return (
    <button
      onClick={handleClick}
      disabled={isPremium || userLoading}
      className={`${getButtonStyles()} ${getSizeStyles()} ${className} w-full`}
    >
      {isPremium ? (
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