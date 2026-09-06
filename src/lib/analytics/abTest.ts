'use client';

import { useEffect, useState } from 'react';

export type ExperimentVariant = 'A' | 'B' | 'C' | 'control';

export interface Experiment {
  id: string;
  name: string;
  variants: {
    A?: any;
    B?: any;
    C?: any;
    control?: any;
  };
  defaultVariant?: ExperimentVariant;
  trafficAllocation: number;
}

export interface ExperimentAssignment {
  experimentId: string;
  variant: ExperimentVariant;
  timestamp: Date;
}

const EXPERIMENTS: Record<string, Experiment> = {
  hero_headline: {
    id: 'hero_headline',
    name: 'Hero Headline Test',
    variants: {
      A: {
        headline: "Confused about what's happening in your life?",
        headline2: 'Get real answers from the universe in seconds...',
      },
      B: {
        headline: "Your future is waiting to be revealed...",
        headline2: 'The cards know what you need to hear.',
      },
      control: {
        headline: "Confused about what's happening in your life?",
        headline2: 'Get real answers from the universe in seconds...',
      },
    },
    defaultVariant: 'control',
    trafficAllocation: 100,
  },
  cta_text: {
    id: 'cta_text',
    name: 'CTA Button Text Test',
    variants: {
      A: {
        primary: 'Start Your Reading',
        secondary: 'Talk to Ginni',
      },
      B: {
        primary: 'Reveal My Cards',
        secondary: 'Chat with Ginni',
      },
      control: {
        primary: 'Start Your Reading',
        secondary: 'Talk to Ginni',
      },
    },
    defaultVariant: 'control',
    trafficAllocation: 100,
  },
  paywall_message: {
    id: 'paywall_message',
    name: 'Paywall Message Test',
    variants: {
      A: {
        title: "There's more clarity waiting...",
        message: "Unlock your full reading to see everything.",
        cta: 'Unlock Full Reading',
      },
      B: {
        title: "This is only part of what's coming through...",
        message: "Your specific situation needs deeper insight.",
        cta: 'See Full Interpretation',
      },
      control: {
        title: "There's more clarity waiting...",
        message: "Unlock your full reading to see everything.",
        cta: 'Unlock Full Reading',
      },
    },
    defaultVariant: 'control',
    trafficAllocation: 50,
  },
  preview_style: {
    id: 'preview_style',
    name: 'Preview Card Style Test',
    variants: {
      A: { style: 'glass' },
      B: { style: 'solid' },
      control: { style: 'glass' },
    },
    defaultVariant: 'control',
    trafficAllocation: 30,
  },
};

const STORAGE_KEY = 'divine_tarot_experiments';

function getRandomSeed(): number {
  return Math.random() * 100;
}

function getVariantFromSeed(seed: number, variants: ExperimentVariant[]): ExperimentVariant {
  const index = Math.floor(seed) % variants.length;
  return variants[index];
}

function generateUserHash(userId?: string): number {
  if (userId) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % 100;
  }
  return getRandomSeed();
}

export function useExperiment(experimentId: string, userId?: string): ExperimentVariant {
  const [variant, setVariant] = useState<ExperimentVariant>('control');

  useEffect(() => {
    const experiment = EXPERIMENTS[experimentId as keyof typeof EXPERIMENTS];
    if (!experiment) {
      setVariant('control');
      return;
    }

    if (Math.random() * 100 > experiment.trafficAllocation) {
      setVariant(experiment.defaultVariant || 'control');
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const assignments: Record<string, ExperimentAssignment> = stored ? JSON.parse(stored) : {};

      if (assignments[experimentId]) {
        setVariant(assignments[experimentId].variant);
        return;
      }

      const userHash = generateUserHash(userId);
      const variants: ExperimentVariant[] = Object.keys(experiment.variants).filter(k => k !== 'defaultVariant') as ExperimentVariant[];
      const assignedVariant = getVariantFromSeed(userHash, variants.length > 0 ? variants : ['control']);

      assignments[experimentId] = {
        experimentId,
        variant: assignedVariant,
        timestamp: new Date(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
      setVariant(assignedVariant);
      
      console.log('[A/B] Assigned:', experimentId, '->', assignedVariant);
    } catch (err) {
      console.error('[A/B] Error:', err);
      setVariant(experiment.defaultVariant || 'control');
    }
  }, [experimentId, userId]);

  return variant;
}

export function getExperimentVariant<T>(experimentId: string, variant: ExperimentVariant): T {
  const experiment = EXPERIMENTS[experimentId as keyof typeof EXPERIMENTS];
  if (!experiment || !experiment.variants) {
    return {} as T;
  }
  return (experiment.variants[variant] || experiment.variants.control) as T;
}

export function getAllExperiments(): Experiment[] {
  return Object.values(EXPERIMENTS) as Experiment[];
}

export function resetExperiment(experimentId: string): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const assignments: Record<string, ExperimentAssignment> = stored ? JSON.parse(stored) : {};
    delete assignments[experimentId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    console.log('[A/B] Reset:', experimentId);
  } catch (err) {
    console.error('[A/B] Reset error:', err);
  }
}

export function resetAllExperiments(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log('[A/B] All experiments reset');
}

export function trackExperimentExposure(experimentId: string, variant: ExperimentVariant): void {
  console.log('[A/B] Exposure:', experimentId, variant);
}

export async function logExperimentConversion(
  experimentId: string,
  variant: ExperimentVariant,
  conversionEvent: string
): Promise<void> {
  console.log('[A/B] Conversion:', experimentId, variant, conversionEvent);
}

export function useABTest(experimentId: string): {
  variant: ExperimentVariant;
  isControl: boolean;
  trackConversion: (event: string) => void;
} {
  const variant = useExperiment(experimentId);
  const isControl = variant === 'control' || variant === 'A';

  const trackConversion = (event: string) => {
    logExperimentConversion(experimentId, variant, event);
  };

  return { variant, isControl, trackConversion };
}