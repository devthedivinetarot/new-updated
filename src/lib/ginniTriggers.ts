'use client';

import { GinniContext } from '@/components/GinniChat';

export type FunnelStage = 
  | 'homepage' 
  | 'input' 
  | 'selection' 
  | 'reading' 
  | 'upsell'
  | 'idle';

export interface GinniTrigger {
  stage: FunnelStage;
  message: string;
  action: 'open' | 'suggest' | 'upsell';
  autoCloseDelay?: number;
  ctaLabel?: string;
  ctaAction?: string;
}

export const TRIGGER_MESSAGES: Record<FunnelStage, GinniTrigger> = {
  homepage: {
    stage: 'homepage',
    message: "Aisa lag raha hai tumhare mind mein kuch chal raha hai… dekhna chahoge?",
    action: 'suggest',
    autoCloseDelay: 8000,
  },
  input: {
    stage: 'input',
    message: "Jo tum poochne wale ho… woh important hai, thoda clearly likhna",
    action: 'suggest',
    autoCloseDelay: 10000,
  },
  selection: {
    stage: 'selection',
    message: "Jo tumne choose kiya hai… woh random nahi hota",
    action: 'open',
    autoCloseDelay: 6000,
  },
  reading: {
    stage: 'reading',
    message: "Yeh sirf surface hai… aur depth bhi hai, dekhna chahoge?",
    action: 'upsell',
    ctaLabel: 'Continue dekhna hai?',
    ctaAction: '/payment',
  },
  upsell: {
    stage: 'upsell',
    message: "Tumne already kaafi dekh liya… ab jo next aayega woh aur clear hoga",
    action: 'upsell',
    ctaLabel: 'Continue dekhna hai?',
    ctaAction: '/payment',
  },
  idle: {
    stage: 'idle',
    message: "Confuse ho ya doubt hai? Main help kar sakti hoon",
    action: 'suggest',
    autoCloseDelay: 10000,
  },
};

export const getTriggerForStage = (stage: FunnelStage): GinniTrigger => {
  return TRIGGER_MESSAGES[stage] || TRIGGER_MESSAGES.idle;
};

export const getHesitationTrigger = (stage: FunnelStage): GinniTrigger => {
  const triggers: Record<FunnelStage, string> = {
    homepage: "Kuch toh feel ho raha hai… baat karo",
    input: "Jo tum feel kar rahe ho… wahi likho, perfect hone ki zarurat nahi hai",
    selection: "Dil se choose karo… wo hi sahi hai",
    reading: "Kuch doubt hai? main clear kar sakti hoon",
    upsell: "Aur jaanana hai? chalo next step pe",
    idle: "Confuse ho ya doubt hai? Main help kar sakti hoon",
  };
  return {
    stage: 'idle',
    message: triggers[stage] || triggers.idle,
    action: 'open',
    autoCloseDelay: 8000,
  };
};

export interface GinniMemory {
  question?: string;
  selectedCards?: string[];
  lastReading?: string;
  lastInteraction?: Date;
  stage?: FunnelStage;
}

const MEMORY_KEY = 'ginni_memory';

export const saveGinniMemory = (memory: GinniMemory): void => {
  if (typeof window === 'undefined') return;
  try {
    const existing = getGinniMemory();
    const updated = { ...existing, ...memory, lastInteraction: new Date() };
    localStorage.setItem(MEMORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save Ginni memory:', e);
  }
};

export const getGinniMemory = (): GinniMemory => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(MEMORY_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
};

export const getMemoryContextualMessage = (): string | null => {
  const memory = getGinniMemory();
  if (!memory.question || !memory.lastInteraction) return null;
  
  const hoursSince = (Date.now() - new Date(memory.lastInteraction).getTime()) / (1000 * 60 * 60);
  if (hoursSince > 24 && memory.lastReading) {
    return `Tumne pehle jo poocha tha "${memory.question.slice(0, 30)}…" usme bhi similar pattern tha`;
  }
  return null;
};

export const buildGinniContext = (
  stage: FunnelStage,
  userData?: Partial<GinniContext>
): GinniContext => {
  return {
    question: TRIGGER_MESSAGES[stage].message,
    theme: stage,
    emotion: 'intuitive',
    ...userData,
  };
};