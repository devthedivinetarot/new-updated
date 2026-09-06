'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type FunnelStage = 
  | 'idle'
  | 'topic-selection'
  | 'card-selection'
  | 'question-input'
  | 'suspense'
  | 'reveal'
  | 'post-reading';

export interface GinniMessage {
  id: string;
  text: string;
  cta?: {
    label: string;
    action: string;
    primary?: boolean;
  };
  type: 'suggestion' | 'guidance' | 'conversion' | 'reminder';
}

interface ContextualGinniProps {
  stage: FunnelStage;
  topic?: string;
  question?: string;
  selectedCardsCount?: number;
  onAction?: (action: string, data?: any) => void;
}

const MESSAGES: Record<FunnelStage, GinniMessage[]> = {
  idle: [
    {
      id: 'idle-1',
      text: "Not sure what to ask? I can help you with that…",
      cta: { label: 'Get help', action: 'suggest-topic', primary: true },
      type: 'suggestion'
    },
    {
      id: 'idle-2', 
      text: "Sometimes the simplest question holds the deepest answer…",
      type: 'guidance'
    }
  ],
  'topic-selection': [
    {
      id: 'topic-1',
      text: "Choose what feels right… your heart already knows the answer.",
      type: 'guidance'
    },
    {
      id: 'topic-2',
      text: "Don't think too much. Just go with what draws your attention…",
      type: 'guidance'
    }
  ],
  'card-selection': [
    {
      id: 'cards-1',
      text: "Don't overthink… just pick the cards you feel drawn to.",
      cta: { label: 'Need guidance?', action: 'card-hint' },
      type: 'guidance'
    },
    {
      id: 'cards-2',
      text: "Trust your intuition. The first cards that catch your eye are often the right ones.",
      type: 'guidance'
    }
  ],
  'question-input': [
    {
      id: 'question-1',
      text: "Speak your question silently in your mind. The cards will hear you.",
      type: 'guidance'
    },
    {
      id: 'question-2',
      text: "Your question doesn't need to be perfect. The universe understands intention.",
      type: 'guidance'
    }
  ],
  suspense: [],
  reveal: [],
  'post-reading': [
    {
      id: 'post-1',
      text: "This is just the surface… there's more clarity waiting for you.",
      cta: { label: 'Unlock full reading', action: 'upgrade', primary: true },
      type: 'conversion'
    },
    {
      id: 'post-2',
      text: "There's something beneath the surface you should know…",
      cta: { label: 'Talk to Ginni', action: 'chat', primary: false },
      type: 'conversion'
    },
    {
      id: 'post-3',
      text: "Your situation is still unfolding. Would you like a deeper insight?",
      cta: { label: 'Book a reading', action: 'booking', primary: false },
      type: 'conversion'
    }
  ]
};

const STAGE_TRIGGERS: Record<FunnelStage, number> = {
  idle: 8000,
  'topic-selection': 0,
  'card-selection': 15000,
  'question-input': 0,
  suspense: 0,
  reveal: 0,
  'post-reading': 3000
};

const AUTO_CLOSE_DELAY = 8000;

export default function ContextualGinni({
  stage,
  topic,
  question,
  selectedCardsCount = 0,
  onAction
}: ContextualGinniProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<GinniMessage | null>(null);
  const [hasShownForStage, setHasShownForStage] = useState<Record<string, boolean>>({});
  const [isExiting, setIsExiting] = useState(false);
  
  const visibilityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getMessageForStage = useCallback((): GinniMessage | null => {
    const messages = MESSAGES[stage];
    if (!messages || messages.length === 0) return null;
    
    // Filter out messages already shown for this stage
    const available = messages.filter(m => !hasShownForStage[`${stage}-${m.id}`]);
    if (available.length === 0) {
      // Reset if all shown
      setHasShownForStage(prev => {
        const reset = { ...prev };
        Object.keys(reset).forEach(key => {
          if (key.startsWith(stage)) delete reset[key];
        });
        return reset;
      });
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    return available[Math.floor(Math.random() * available.length)];
  }, [stage, hasShownForStage]);

  const showGinni = useCallback(() => {
    const message = getMessageForStage();
    if (!message) return;
    
    setCurrentMessage(message);
    setIsVisible(true);
    setIsExiting(false);
    
    // Mark message as shown
    setHasShownForStage(prev => ({
      ...prev,
      [`${stage}-${message.id}`]: true
    }));
    
    // Auto close after delay
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    autoCloseTimerRef.current = setTimeout(() => {
      hideGinni();
    }, AUTO_CLOSE_DELAY);
  }, [getMessageForStage, stage]);

  const hideGinni = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setCurrentMessage(null);
      setIsExiting(false);
    }, 300);
  }, []);

  const handleCtaClick = (action: string) => {
    hideGinni();
    onAction?.(action, { topic, question, stage });
  };

  // Show Ginni when entering a new stage
  useEffect(() => {
    const triggerDelay = STAGE_TRIGGERS[stage];
    
    if (visibilityTimerRef.current) {
      clearTimeout(visibilityTimerRef.current);
    }
    
    if (triggerDelay > 0) {
      visibilityTimerRef.current = setTimeout(() => {
        showGinni();
      }, triggerDelay);
    } else if (triggerDelay === 0 && MESSAGES[stage]?.length > 0) {
      // Immediate show for some stages
      showGinni();
    }
    
    return () => {
      if (visibilityTimerRef.current) {
        clearTimeout(visibilityTimerRef.current);
      }
    };
  }, [stage, showGinni]);

  // Reset shown state when question changes
  useEffect(() => {
    if (question && stage === 'post-reading') {
      showGinni();
    }
  }, [question, stage, showGinni]);

  // Additional retention hook after 15 seconds in post-reading
  useEffect(() => {
    if (stage === 'post-reading' && question) {
      const retentionTimer = setTimeout(() => {
        // Show retention message
        setCurrentMessage({
          id: 'retention-1',
          text: "This reading may change soon... Your energy is shifting.",
          cta: { label: 'Save this reading', action: 'save', primary: false },
          type: 'reminder'
        });
        setIsVisible(true);
        setIsExiting(false);
      }, 15000);

      return () => clearTimeout(retentionTimer);
    }
  }, [stage, question]);

  // Don't show during suspense or reveal
  if (stage === 'suspense' || stage === 'reveal') {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && currentMessage && !isExiting && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-24 left-6 z-40 max-w-xs"
        >
          <div className="relative">
            {/* Speech bubble */}
            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0d0d14] border border-purple-800/40 rounded-2xl p-4 shadow-xl shadow-purple-900/20">
              {/* Ginni indicator */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-xs">✨</span>
                </div>
                <span className="text-xs text-purple-400/70 font-medium">Ginni</span>
              </div>
              
              {/* Message text */}
              <p className="text-sm text-purple-200/90 leading-relaxed">
                {currentMessage.text}
              </p>
              
              {/* CTA Button */}
              {currentMessage.cta && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => handleCtaClick(currentMessage.cta!.action)}
                  className={`mt-3 w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                    currentMessage.cta.primary
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                      : 'border border-purple-500/40 text-purple-300 hover:bg-purple-500/20'
                  }`}
                >
                  {currentMessage.cta.label}
                </motion.button>
              )}
            </div>
            
            {/* Bubble pointer */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-[#1A1A2E] to-[#0d0d14] border-r border-b border-purple-800/40 rotate-45" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
