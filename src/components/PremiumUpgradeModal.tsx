'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { logEvent } from '@/lib/utils/tracking';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUBSCRIPTION_ID = 'sub_Spfpl7cYrf7xr5';

export default function PremiumUpgradeModal({ isOpen, onClose }: PremiumUpgradeModalProps) {
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPremium, refetch } = useSubscription();

  useEffect(() => {
    if (!isOpen) return;

    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilReset(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleUpgradeClick = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { handlePremiumCheckout } = await import('@/lib/payments/handlePremiumCheckout');

      const result = await handlePremiumCheckout('premium-modal');

      if (result.success) {
        await refetch();
        onClose();
      } else if (result.error !== 'Payment cancelled') {
        setError(result.error || 'Payment failed');
        setIsProcessing(false);
      } else {
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('[PremiumUpgradeModal] Payment error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  }, [isProcessing, refetch, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-gradient-to-br from-[#1A1A2E] to-[#0B0B0F] rounded-2xl p-6 md:p-8 border border-[#FFD700]/30 shadow-2xl shadow-[#FFD700]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF4D4D] flex items-center justify-center">
                <Crown className="w-8 h-8 text-black" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                Your Daily Guidance Is Complete ✨
              </h3>
              <p className="text-[#A1A1AA]">
                 Ginni has revealed today&apos;s message for you.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
              <p className="text-white text-center leading-relaxed">
                Unlock unlimited spiritual conversations and deeper tarot guidance anytime.
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                <span className="text-[#FFD700]">✓</span>
                <span>Unlimited tarot readings</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                <span className="text-[#FFD700]">✓</span>
                <span>Unlimited Ginni conversations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                <span className="text-[#FFD700]">✓</span>
                <span>Deep emotional guidance</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                <span className="text-[#FFD700]">✓</span>
                <span>Spiritual clarity anytime</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                <span className="text-[#FFD700]">✓</span>
                <span>Premium reading experience</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-center">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleUpgradeClick}
              disabled={isProcessing || isPremium}
              className={`
                w-full py-4 rounded-xl 
                bg-gradient-to-r from-[#FFD700] to-[#FF4D4D] 
                text-black font-bold text-lg 
                hover:shadow-lg hover:shadow-[#FFD700]/25 
                transition-all transform hover:scale-[1.02]
                ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    Unlock Premium — ₹199/month
                  </>
                )}
              </span>
            </button>

            <button
              onClick={onClose}
              className="w-full mt-3 text-sm text-[#A1A1AA] hover:text-white transition-colors"
            >
              Maybe Later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}