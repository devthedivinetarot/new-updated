'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDailyMessageLimit } from '@/hooks/useDailyMessageLimit';
import { useSubscription } from '@/hooks/useSubscription';
import { useUser } from '@/lib/auth/useUser';
import { CheckCircle2, Lock, Clock, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UsageLimiterProps {
  children: React.ReactNode;
  className?: string;
}

export function UsageLimiter({ children, className }: UsageLimiterProps) {
  const { remaining, isUnlimited, canSendMessage, getTimeUntilReset, isLoading } = useDailyMessageLimit();
  const { plan } = useSubscription();
  const { user } = useUser();
  const [showOverlay, setShowOverlay] = useState(false);
  const [countdown, setCountdown] = useState('');
  const overlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we should show the locked overlay
  useEffect(() => {
    if (!canSendMessage && !isUnlimited && !isLoading) {
      // Delay showing overlay to let the first message flow complete
      overlayTimerRef.current = setTimeout(() => {
        setShowOverlay(true);
      }, 800);
    } else {
      setShowOverlay(false);
    }

    return () => {
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    };
  }, [canSendMessage, isUnlimited, isLoading]);

  // Countdown timer
  useEffect(() => {
    if (!showOverlay || isUnlimited) return;

    const updateCountdown = () => {
      setCountdown(getTimeUntilReset());
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [showOverlay, isUnlimited, getTimeUntilReset]);

  // If user is not logged in, don't block
  if (!user && !isLoading) return <>{children}</>;

  // If loading, show children (will handle state when loaded)
  if (isLoading) return <>{children}</>;

  return (
    <div className={cn('relative', className)}>
      {children}

      <AnimatePresence>
        {showOverlay && !isUnlimited && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl"
            style={{
              background: 'rgba(11, 11, 15, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {/* Lock Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 
                         border border-purple-500/30 flex items-center justify-center mb-4"
            >
              <Lock className="w-7 h-7 text-purple-300" />
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white font-heading text-lg md:text-xl mb-2 text-center px-4"
            >
              Your Daily Guidance Is Complete ✨
            </motion.h3>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-purple-300/70 text-sm text-center px-6 mb-6 max-w-xs leading-relaxed"
            >
              Ginni has revealed today&apos;s message for you.
              <br />
              Return tomorrow for your next free reading.
            </motion.p>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3 mb-6 border border-white/10"
            >
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-purple-200 text-sm font-medium">
                Next reading available in:
              </span>
              <span className="text-[#FFD700] font-bold text-sm tabular-nums">
                {countdown || 'Loading...'}
              </span>
            </motion.div>

            {/* Benefits Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="px-4 w-full max-w-xs"
            >
              <p className="text-[10px] uppercase tracking-widest text-purple-400/60 text-center mb-3 font-medium">
                With Premium
              </p>
              <div className="space-y-2">
                {[
                  'Unlimited tarot readings',
                  'Unlimited messages with Ginni',
                  'Deeper emotional guidance',
                  'Priority spiritual experience',
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-[11px] text-purple-200/70"
                  >
                    <Sparkles className="w-3 h-3 text-[#FFD700] flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 w-full px-4 max-w-xs"
            >
              <button
                onClick={() => {
                  const el = document.getElementById('premium-cta-button');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  // Also trigger the premium modal if available
                  window.dispatchEvent(new CustomEvent('openPremiumModal'));
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#FFC400] to-[#FFD700] 
                           text-black font-bold text-sm hover:shadow-lg hover:shadow-[#FFD700]/30 
                           transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                           relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Unlock Premium — ₹199/month
                </span>
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
                />
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => setShowOverlay(false)}
                className="w-full mt-2.5 text-xs text-purple-400/60 hover:text-purple-300 
                           transition-colors py-2"
              >
                Continue with free daily reading
              </button>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-20 h-20 bg-purple-500/[0.03] rounded-full blur-xl" />
            <div className="absolute bottom-4 right-4 w-20 h-20 bg-indigo-500/[0.03] rounded-full blur-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Standalone overlay trigger for external use.
 * Call `window.dispatchEvent(new CustomEvent('showUsageOverlay'))` to trigger.
 */
export function UsageLimiterTrigger() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handler = () => setActive(true);
    window.addEventListener('showUsageOverlay', handler);
    return () => window.removeEventListener('showUsageOverlay', handler);
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0B0B0F] rounded-2xl p-6 max-w-sm w-full 
                      border border-purple-500/30 shadow-2xl shadow-purple-900/20 text-center">
        <Lock className="w-10 h-10 text-purple-400 mx-auto mb-4" />
        <h3 className="text-white font-heading text-xl mb-2">Daily Limit Reached</h3>
        <p className="text-purple-300/70 text-sm mb-4">
          Your free daily reading has been used. Upgrade to Premium for unlimited access.
        </p>
        <button
          onClick={() => {
            setActive(false);
            window.dispatchEvent(new CustomEvent('openPremiumModal'));
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FF4D4D] 
                     text-black font-bold hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all"
        >
          Upgrade to Premium — ₹199/month
        </button>
      </div>
    </div>
  );
}
