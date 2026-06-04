'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface GinniContext {
  question?: string;
  cards?: string[];
  interpretation?: string;
  theme?: string;
  emotion?: string;
}

interface GinniChatProps {
  autoOpenDelay?: number;
  showNotification?: boolean;
  context?: GinniContext;
  triggerOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const GINNI_BASE_URL = 'https://ginni-ki-baatein-buddy.lovable.app';

export default function GinniChat({ 
  autoOpenDelay = 0, 
  showNotification = true,
  context,
  triggerOpen = false,
  onOpen,
  onClose
}: GinniChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [showContextNotice, setShowContextNotice] = useState(false);
  const [iframeSrc, setIframeSrc] = useState(GINNI_BASE_URL);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const buildIframeSrc = useCallback((ctx?: GinniContext) => {
    if (!ctx?.question) return GINNI_BASE_URL;

    const params = new URLSearchParams();
    params.set('q', ctx.question.slice(0, 500));
    if (ctx.theme) params.set('theme', ctx.theme);
    if (ctx.emotion) params.set('emotion', ctx.emotion);
    if (ctx.cards && ctx.cards.length > 0) {
      params.set('cards', ctx.cards.slice(0, 3).join(', ').slice(0, 200));
    }
    if (ctx.interpretation) {
      const summary = ctx.interpretation.slice(0, 300).replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      params.set('context', summary);
    }

    return `${GINNI_BASE_URL}?${params.toString()}`;
  }, []);

  useEffect(() => {
    if (context && context.question) {
      setIframeSrc(buildIframeSrc(context));
    }
  }, [context, buildIframeSrc]);

  useEffect(() => {
    if (triggerOpen && !isOpen) {
      if (context?.question) {
        setShowContextNotice(true);
        setTimeout(() => {
          setShowContextNotice(false);
          setIsOpen(true);
          setIsLoading(true);
          setHasAutoOpened(true);
          onOpen?.();
        }, 1500);
      } else {
        setIsOpen(true);
        setIsLoading(true);
        setHasAutoOpened(true);
        onOpen?.();
      }
    }
  }, [triggerOpen, isOpen, context, onOpen]);

  useEffect(() => {
    if (autoOpenDelay > 0 && !hasAutoOpened && !triggerOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setIsLoading(true);
        setHasAutoOpened(true);
        onOpen?.();
      }, autoOpenDelay);
      return () => clearTimeout(timer);
    }
  }, [autoOpenDelay, hasAutoOpened, triggerOpen, onOpen]);

  useEffect(() => {
    if (isOpen && iframeRef.current && context?.question) {
      const sendContextViaPostMessage = () => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            { type: 'INIT_CONTEXT', payload: context },
            '*'
          );
        }
      };
      if (!isLoading) {
        setTimeout(sendContextViaPostMessage, 500);
      }
    }
  }, [isOpen, isLoading, context]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsLoading(true);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    if (context?.question && iframeRef.current?.contentWindow) {
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'INIT_CONTEXT', payload: context },
          '*'
        );
      }, 1000);
    }
  };

  const getContextMessage = () => {
    if (!context?.question) return null;
    const questionPreview = context.question.length > 40 
      ? context.question.slice(0, 40) + '...' 
      : context.question;
    const messages = [
      `Ginni already knows about "${questionPreview}"…`,
      `Let's go deeper into this…`,
      `There's more to explore about your question…`,
      `Ginni has been listening to your journey…`
    ];
    return messages[Math.floor(Date.now() / 10000) % messages.length];
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 md:bottom-6"
          >
            <div className="w-[360px] h-[500px] md:w-[400px] md:h-[580px] bg-[#1A1A2E]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-800/50 overflow-hidden flex flex-col">
              <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg drop-shadow-sm">Ginni ✨</h3>
                    <p className="text-white/80 text-xs drop-shadow-sm">Your personal tarot guide</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 relative bg-gradient-to-b from-[#0B0B0F] to-[#1A1A2E]">
                <AnimatePresence>
                  {showContextNotice && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute top-0 left-0 right-0 z-10 p-3.5 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-purple-800/30 backdrop-blur-sm"
                    >
                      <p className="text-center text-sm text-purple-200/70">
                        {getContextMessage()}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#1A1A2E]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 pt-16"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.15, 1],
                        opacity: [0.4, 0.8, 0.4]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 mb-5"
                    >
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 blur-md" />
                    </motion.div>
                    <p className="text-purple-200/70 text-center text-sm font-medium">
                      {context?.question ? "Ginni is connecting to your energy…" : "Ginni is connecting to your energy…"}
                    </p>
                    <div className="flex gap-2 mt-4">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-2.5 h-2.5 rounded-full bg-purple-400/60"
                          animate={{ 
                            y: [0, -10, 0],
                            opacity: [0.3, 0.8, 0.3]
                          }}
                          transition={{ 
                            duration: 0.8, 
                            repeat: Infinity,
                            delay: i * 0.12
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                
                <motion.iframe
                  ref={iframeRef}
                  src={iframeSrc}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLoading ? 0 : 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ 
                    borderRadius: '0 0 24px 24px',
                    visibility: isLoading ? 'hidden' : 'visible'
                  }}
                  title="Chat with Ginni"
                  allow="clipboard-read; clipboard-write"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}