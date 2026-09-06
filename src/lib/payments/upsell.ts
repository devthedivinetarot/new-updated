import { PlanType } from './plans';

export type UpsellTrigger = 'post-reading' | 'partial-result' | 'multi-session' | 'high-engagement' | 'time-based' | 'daily-limit';

export interface UpsellConfig {
  trigger: UpsellTrigger;
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  delay?: number;
  showOncePerSession?: boolean;
}

export const UPSELL_CONFIGS: Record<UpsellTrigger, UpsellConfig> = {
  'daily-limit': {
    trigger: 'daily-limit',
    title: "Your Daily Guidance Is Complete ✨",
    message: "Unlock unlimited conversations with Ginni and receive deeper spiritual guidance anytime you want.",
    ctaText: "Upgrade to Premium — ₹199/month",
    ctaLink: "/payment",
  },
  'post-reading': {
    trigger: 'post-reading',
    title: "Your answers are waiting beyond the veil...",
    message: "Continue your spiritual journey without limits. Your next clarity is just one upgrade away.",
    ctaText: "Unlock Premium",
    ctaLink: "/payment",
    showOncePerSession: true,
  },
  'partial-result': {
    trigger: 'partial-result',
    title: "This is only the beginning...",
    message: "The universe has more to show you. Deep insights await beyond today's limit.",
    ctaText: "See Full Interpretation",
    ctaLink: "/payment",
  },
  'multi-session': {
    trigger: 'multi-session',
    title: "You've been seeking answers...",
    message: "Your curiosity has brought you here multiple times. Get unlimited access to go as deep as you need.",
    ctaText: "Go Unlimited",
    ctaLink: "/payment",
  },
  'high-engagement': {
    trigger: 'high-engagement',
    title: "Your situation calls for deeper guidance...",
    message: "Based on your journey here, a premium reading would give you the clarity you deserve.",
    ctaText: "Get Premium Insights",
    ctaLink: "/payment",
  },
  'time-based': {
    trigger: 'time-based',
    title: "Special Offer - Limited Time",
    message: "For the next 24 hours, get Premium at a special rate. Your deeper answers await.",
    ctaText: "Claim Offer",
    ctaLink: "/payment",
    delay: 5000,
  },
};

export interface UpsellContext {
  userId: string;
  plan: PlanType;
  messagesToday: number;
  sessionCount: number;
  timeOnSite: number;
  lastInteraction?: Date;
  showPaywall: boolean;
}

export function determineUpsellTrigger(context: UpsellContext): UpsellTrigger | null {
  const { plan, messagesToday, sessionCount, timeOnSite, showPaywall } = context;

  if (plan !== 'free') return null;

  if (messagesToday >= 1) {
    return 'daily-limit';
  }

  if (showPaywall) {
    return 'partial-result';
  }

  if (sessionCount >= 3) {
    return 'multi-session';
  }

  if (timeOnSite > 300 && messagesToday >= 1) {
    return 'high-engagement';
  }

  return null;
}

export function shouldShowUpsell(context: UpsellContext): boolean {
  if (context.plan !== 'free') return false;
  
  const trigger = determineUpsellTrigger(context);
  return trigger !== null;
}

export function getUpsellForPlan(plan: PlanType): UpsellConfig | undefined {
  const configs: Record<PlanType, UpsellConfig | undefined> = {
    free: UPSELL_CONFIGS['daily-limit'],
    premium: undefined,
  };

  return configs[plan];
}

export function getPsychologicalTriggers(): string[] {
  return [
    "There's something more the cards want to show you...",
    "Your situation is more specific than a general reading can cover...",
    "You've been coming back for answers - here's the key...",
    "The universe brought you here for clarity...",
    "This message came through for a reason...",
    "Others with your situation have found their answer here...",
    "This is only the beginning of what the cards can reveal...",
  ];
}

export function getCuriosityGapMessage(readingsCount: number): string {
  const messages = [
    "There's more depth to this than what you've seen...",
    "Your cards are showing multiple layers - you've only seen one...",
    "The answer to your real question is in the next level of reading...",
    "This reading opened a door - step through for the full picture...",
    "You've touched on something significant - now go deeper...",
  ];

  return messages[Math.min(readingsCount, messages.length - 1)];
}

export function getTimingUrgencyMessage(): string {
  const messages = [
    "This insight is particularly relevant right now...",
    "The timing of your reading isn't random - the universe knows...",
    "What you're seeking has urgency - don't wait...",
    "Today brings a special energy to this question...",
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

export interface UpsellMetrics {
  trigger: UpsellTrigger;
  displayed: boolean;
  clicked: boolean;
  converted: boolean;
}

export function trackUpsellEvent(
  event: 'upsell_displayed' | 'upsell_clicked' | 'upsell_converted',
  context: UpsellContext,
  trigger: UpsellTrigger
): void {
  console.log('[Upsell Tracking]', {
    event,
    userId: context.userId,
    trigger,
    timestamp: new Date().toISOString(),
  });
}