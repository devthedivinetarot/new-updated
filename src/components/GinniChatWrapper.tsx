'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GinniChat, { GinniContext } from '@/components/GinniChat';
import { useGinniStore } from '@/store/ginni-store';
import { useFunnelStore } from '@/store/funnel-store';
import { 
  getTriggerForStage, 
  getHesitationTrigger,
  saveGinniMemory, 
  buildGinniContext,
  FunnelStage,
} from '@/lib/ginniTriggers';
import { MessageCircle } from 'lucide-react';
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal';

export default function GinniChatWrapper() {
  const { context, triggerOpen, isOpen, setIsOpen, setTriggerOpen, setContext, clearContext } = useGinniStore();
  const { currentStage, readingCount } = useFunnelStore();
  
  const hesitationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousStageRef = useRef<FunnelStage | null>(null);
  
  const [showGinniBubble, setShowGinniBubble] = useState(false);
  const [currentTrigger, setCurrentTrigger] = useState(getTriggerForStage('homepage'));
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [hasTriggeredForStage, setHasTriggeredForStage] = useState<Record<string, boolean>>({});
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const triggerGinni = useCallback((stage: FunnelStage) => {
    const trigger = getTriggerForStage(stage);
    setCurrentTrigger(trigger);
    setShowGinniBubble(true);
    setContext(buildGinniContext(stage));
    
    if (trigger.action === 'open') {
      setTriggerOpen(true);
    }
    
    if (trigger.autoCloseDelay) {
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }
      autoHideTimerRef.current = setTimeout(() => {
        setShowGinniBubble(false);
        clearContext();
      }, trigger.autoCloseDelay);
    }
  }, [setContext, setTriggerOpen, clearContext]);

  const triggerHesitation = useCallback((stage: FunnelStage) => {
    const hesitation = getHesitationTrigger(stage);
    setCurrentTrigger(hesitation);
    setShowGinniBubble(true);
    setTriggerOpen(true);
  }, [setTriggerOpen]);

  useEffect(() => {
    if (!currentStage || currentStage === previousStageRef.current) return;
    
    const stageKey = `${currentStage}-${readingCount}`;
    
    if (!hasTriggeredForStage[stageKey]) {
      previousStageRef.current = currentStage;
      
      const delay = currentStage === 'homepage' ? 3500 : 1500;
      
      const timer = setTimeout(() => {
        if (currentStage === 'reading' && readingCount >= 1) {
          triggerGinni('upsell');
        } else {
          triggerGinni(currentStage);
        }
        setHasTriggeredForStage(prev => ({ ...prev, [stageKey]: true }));
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [currentStage, readingCount, hasTriggeredForStage, triggerGinni]);

  useEffect(() => {
    if (currentStage !== 'input') return;

    const handleActivity = () => {
      setLastActivityTime(Date.now());
      
      if (hesitationTimerRef.current) {
        clearTimeout(hesitationTimerRef.current);
      }
      
      hesitationTimerRef.current = setTimeout(() => {
        const timeSinceLastActivity = Date.now() - lastActivityTime;
        if (timeSinceLastActivity > 6000) {
          triggerHesitation('input');
        }
      }, 7000);
    };

    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      if (hesitationTimerRef.current) {
        clearTimeout(hesitationTimerRef.current);
      }
    };
  }, [currentStage, lastActivityTime, triggerHesitation]);

  useEffect(() => {
    const handleOpenPremiumModal = () => {
      setShowUpgradeModal(true);
    };

    window.addEventListener('openPremiumModal', handleOpenPremiumModal);
    return () => {
      window.removeEventListener('openPremiumModal', handleOpenPremiumModal);
      if (hesitationTimerRef.current) clearTimeout(hesitationTimerRef.current);
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    };
  }, []);

  const handleOpenChat = () => {
    setShowGinniBubble(false);
    setIsOpen(true);
    setTriggerOpen(true);
    saveGinniMemory({ stage: currentStage });
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setShowGinniBubble(false);
    clearContext();
  };

  const handleDismissBubble = () => {
    setShowGinniBubble(false);
    clearContext();
  };

  return (
    <>
      <AnimatePresence>
        {showGinniBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-40 max-w-xs"
          >
            <div className="relative">
              <div className="absolute -top-3 -left-1 text-2xl">✨</div>
              <div className="bg-gradient-to-br from-[#1A1A2E] to-[#252540] backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30 shadow-xl shadow-purple-900/20">
                <p className="text-sm text-purple-100 leading-relaxed">
                  {currentTrigger.message}
                </p>
                
                {currentTrigger.ctaLabel && currentTrigger.ctaAction && (
                  <a
                    href={currentTrigger.ctaAction}
                    className="mt-3 block w-full text-center py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium hover:from-purple-500 hover:to-indigo-500 transition-all"
                  >
                    {currentTrigger.ctaLabel}
                  </a>
                )}
                
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={handleOpenChat}
                    className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    Baat karni hai
                  </button>
                  <button
                    onClick={handleDismissBubble}
                    className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Nahi, dhanyavad
                  </button>
                </div>
              </div>
              
              <motion.button
                onClick={handleOpenChat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GinniChat 
        context={context}
        triggerOpen={triggerOpen}
        onOpen={() => {
          setTriggerOpen(false);
        }}
        onClose={handleCloseChat}
      />
      
      <PremiumUpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </>
  );
}