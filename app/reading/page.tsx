'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/lib/auth/useUser';
import { useSubscription } from '@/hooks/useSubscription';
import { useDailyMessageLimit } from '@/hooks/useDailyMessageLimit';
import PremiumModal from '@/components/subscription/PremiumModal';
import { logEvent } from '@/lib/utils/tracking';
import GinniChat from '@/components/GinniChat';

export default function ReadingPage() {
  const { user, isLoading: userLoading } = useUser();
  const {
    plan,
    isPremium,
    refetch: refetchSubscription,
  } = useSubscription();
  const {
    remaining,
    canSendMessage: canSendMsg,
    consumeMessage,
    refresh: refreshLimit,
    getTimeUntilReset,
  } = useDailyMessageLimit();

  const userId = user?.id || null;

  const [loaded, setLoaded] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [initTimedOut, setInitTimedOut] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeSrc, setIframeSrc] = useState<string>('');

  const isLoading = userLoading;



  // ── postMessage helpers ───────────────────────────────────────────────

  const sendSubscriptionState = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage(
        { type: 'SUBSCRIPTION_STATUS', plan: isPremium ? 'premium' : 'free', isPremium, canSendMessage: canSendMsg },
        '*',
      );
    } catch { /* cross-origin expected */ }
  }, [isPremium, canSendMsg]);

  const sendUnlockToIframe = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage({ type: 'SUBSCRIPTION_SUCCESS', plan: 'premium' }, '*');
    } catch { /* expected */ }
    window.dispatchEvent(new CustomEvent('subscription_activated', { detail: { plan: 'premium' } }));
  }, []);

  // ── Message usage / daily limit ───────────────────────────────────────

  const handleMessageSent = async () => {
    if (!userId || isPremium) return;
    const mod = await import('@/app/actions/subscription');
    await mod.recordMessage(userId);
    consumeMessage();
    const { canSendMessage } = await mod.checkSubscriptionAccess(userId, 'free');
    if (!canSendMessage) {
      setIframeBlocked(true);
      setTimeout(() => {
        setShowUpgradeModal(true);
        logEvent('paywall_triggered', { userId, trigger: 'message_limit_reached' });
      }, 1500);
    }
  };

  // ── useEffect: initial access check ───────────────────────────────────

  useEffect(() => {
    if (userLoading) return;
    const doCheck = async () => {
      if (!userId) return;
      const mod = await import('@/app/actions/subscription');
      const { canSendMessage } = await mod.checkSubscriptionAccess(userId, 'free');
      if (!canSendMessage && !isPremium) setIframeBlocked(true);
    };
    doCheck();
  }, [userId, userLoading, isPremium]);

  // ── useEffect: cross-origin message handler ────────────────────────────

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'GINNI_MESSAGE_SENT' && !isPremium) {
        await handleMessageSent();
      }
      if (event.data?.type === 'INITIATE_UPGRADE') {
        setShowUpgradeModal(true);
        logEvent('upgrade_requested', { source: 'iframe', userId });
      }
      if (event.data?.type === 'GINNI_READY') {
        sendSubscriptionState();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isPremium, userId, sendSubscriptionState]);

  // ── useEffect: send subscription state when ready ──────────────────────

  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => {
        sendSubscriptionState();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loaded, sendSubscriptionState]);

  // ── Payment success handler ────────────────────────────────────────────

  const handlePaymentSuccess = useCallback(() => {
    setIframeBlocked(false);
    setShowUpgradeModal(false);
    refetchSubscription();
    refreshLimit();
    sendUnlockToIframe();
    logEvent('premium_activated_reading_page', { userId, previousPlan: 'free', newPlan: 'premium' });
  }, [refetchSubscription, refreshLimit, sendUnlockToIframe, userId]);

  // ── useEffect: unblock iframe when premium upgrades ────────────────────

  useEffect(() => {
    if (iframeBlocked && isPremium) {
      setIframeBlocked(false);
      sendUnlockToIframe();
    }
  }, [isPremium, iframeBlocked, sendUnlockToIframe]);

  // ── useEffect: handle openPremiumModal event ─────────────────────────────

  useEffect(() => {
    const handleOpenPremiumModal = () => {
      setShowUpgradeModal(true);
      logEvent('upgrade_requested', { userId });
    };

    window.addEventListener('openPremiumModal', handleOpenPremiumModal);
    return () => {
      window.removeEventListener('openPremiumModal', handleOpenPremiumModal);
    };
  }, [userId]);

  // ── useEffect: handle URL params after payment redirect ─────────────────

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('payment') === 'success' || url.searchParams.get('plan') === 'premium') {
      url.searchParams.delete('plan');
      url.searchParams.delete('payment');
      window.history.replaceState({}, '', url.toString());
      setIframeBlocked(false);
    }
  }, []);

  // ── init timeout for graceful fallback ─────────────────────────────

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (loaded) return;

    const timer = window.setTimeout(() => {
      setInitTimedOut(true);
      setInitError('Connection temporary unavailable. Please refresh or try again later.');
    }, 12000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loaded]);

  useEffect(() => {
    if (loaded) setInitError(null);
  }, [loaded]);

  // ── Defer iframe loading until the main page is interactive ──────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (iframeSrc) return;


    const buildIframeQuery = () => (isPremium ? '?plan=premium' : '');

const defer = () => {
      // Keep it browser-friendly; avoid blocking render.
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          setIframeSrc(buildIframeQuery());
        });
        return;
      }

      // In some Next.js builds TypeScript can narrow setTimeout oddly (e.g. `never`).
      // Use globalThis to keep it type-safe.
      (globalThis as typeof globalThis & { setTimeout: typeof setTimeout }).setTimeout(
        () => setIframeSrc(buildIframeQuery()),
        0,
      );
    };

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      defer();
    } else {
      const onReady = () => defer();
      document.addEventListener('DOMContentLoaded', onReady, { once: true });
    }
  }, [isPremium, iframeSrc]);




  // ── Render ────────────────────────────────────────────────────────────


  // Single unified return (avoid early returns that block layout rendering)
  return (
    <>
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0B0B0F] relative">


        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700] rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#FF4D4D] rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-[#7C3AED] rounded-full blur-3xl" />
          </div>
        </div>

        {/* Loading skeleton / error fallback */}
        {!loaded && (
          <div className="flex-1 flex items-center justify-center relative z-10 p-4">
            <div className="text-center max-w-md">
              {!initError ? (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-4 border-[#C9A962]/30 border-t-[#C9A962] mb-4 animate-spin" />
                  <p className="text-[#C9A962] text-sm font-medium">Connecting to your reader...</p>
                  {!isLoading && !isPremium && (
                    <p className="text-[#A1A1AA] text-xs mt-2">
                      You have {remaining} free reading{remaining !== 1 ? 's' : ''} today
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 flex items-center justify-center">
                    <svg className="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-white text-sm font-semibold">{initError}</p>
                  <p className="text-[#A1A1AA] text-xs mt-2">
                    If this keeps happening, check your internet connection and try again.
                  </p>
                  <button
                    onClick={() => {
                      setInitError(null);
                      setInitTimedOut(false);
                      setLoaded(false);
                      window.location.reload();
                    }}
                    className="mt-5 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC400] text-black font-bold text-sm hover:shadow-lg hover:shadow-[#FFD700]/30 transition-all"
                  >
                    Refresh
                  </button>
                </>
              )}
            </div>
          </div>
        )}


        {/* iframe + paywall overlay */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`flex-1 relative transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${iframeBlocked ? 'blur-sm' : ''}`}
          >
            {/* If initError, show only an interior alert (do not block iframe mounting) */}
            {initError && (
              <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-center px-4 pt-6">
                <div className="w-full max-w-lg rounded-xl border border-purple-500/30 bg-[#120B1D]/70 backdrop-blur-md p-4 shadow-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">Connection Interrupted</h3>
                      <p className="text-[#A1A1AA] text-xs mt-1">{initError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Paywall overlay */}
            {iframeBlocked && !isPremium && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center animate-fade-in-up"
                style={{ background: 'rgba(11,11,15,0.7)', backdropFilter: 'blur(8px)' }}
              >
                <div className="text-center max-w-sm mx-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 flex items-center justify-center">
                    <svg className="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl text-white mb-2">Daily Reading Complete</h3>
                  <p className="text-[#A1A1AA] text-sm mb-4">
                    Your daily free reading is complete. Upgrade to Premium for unlimited guidance.
                  </p>
                  <div className="bg-white/[0.03] rounded-xl p-3 mb-4 border border-white/[0.05]">
                    <div className="flex items-center gap-2 text-[11px] text-purple-300/60 mb-2">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Next reading in: {getTimeUntilReset()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowUpgradeModal(true); logEvent('upgrade_cta_clicked', { userId }); }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC400] text-black font-bold text-sm hover:shadow-lg hover:shadow-[#FFD700]/30 transition-all flex items-center justify-center gap-2"
                  >
                    <CrownIcon className="w-4 h-4" /> Unlock Premium - ₹199/month
                  </button>
                  <button
                    onClick={() => setIframeBlocked(false)}
                    className="w-full mt-2.5 text-xs text-purple-400/50 hover:text-purple-300 transition-colors py-1.5"
                  >
                    Continue with free experience
                  </button>
                </div>
              </motion.div>
            )}

            {/* Reading iframe */}
            <div className="flex-1 flex items-center justify-center">
              <div
                className="relative mx-auto w-[80vw] max-w-[80vw] sm:w-[95vw] sm:max-w-[95vw]"
                style={{
                  aspectRatio: '16 / 9',
                  maxHeight: '80vh',
                }}
              >
                {/* Loading spinner / skeleton */}
                {!loaded && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/0"
                    style={{
                      borderRadius: 'inherit',
                    }}
                  >
                    <div className="w-14 h-14 rounded-full border-4 border-[#C9A962]/30 border-t-[#C9A962] animate-spin" />
                  </div>
                )}

                <iframe
                  ref={iframeRef}
                  src={
                    iframeSrc
                      ? `https://ginni-ki-baatein-buddy.lovable.app${iframeSrc}`
                      : undefined
                  }
                  width="100%"
                  height="100%"
                  className={`border-none transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${iframeBlocked ? 'pointer-events-none opacity-40' : ''}`}
                  onLoad={() => {
                    setLoaded(true);
                    logEvent('reading_iframe_loaded', { userId, plan, isPremium });
                  }}
                  allow="clipboard-write; microphone; camera"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  title="Ginni AI Spiritual Reading"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Usage indicator */}
        {!isPremium && loaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
          >
            <div
              className={`px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md border ${
                remaining > 0
                  ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-900/30 border-red-500/30 text-red-300'
              }`}
            >
              {remaining > 0
                ? `${remaining} free reading${remaining !== 1 ? 's' : ''} remaining today`
                : 'Daily limit reached'}
            </div>
          </motion.div>
        )}
      </main>

      {/* Premium upgrade modal */}
      <PremiumModal
        isOpen={showUpgradeModal}
        onClose={() => { setShowUpgradeModal(false); logEvent('premium_modal_closed', { userId }); }}
        triggerSource="paywall"
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Floating chatbot widget */}
      <GinniChat />
    </>
  );
}

function CrownIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v5.25c0 .564.18 1.083.507 1.5L12 20l8.493-5.247c.327-.417.507-.936.507-1.5V6.253C19.168 5.477 17.582 5 16 5s-3.168.477-4.5 1.253z" />
    </svg>
  );
}