// ====== SMART PAYWALL TRIGGERS ======
// Triggers upgrade at peak conversion moments

export interface TriggerContext {
  userId?: string;
  plan: 'free' | 'premium';
  readingsToday: number;
  readingLimit: number;
  engagementScore: number;
  questionLength: number;
  previousReadings?: number;
  timeOnSite: number;
  hasPremiumExpired?: boolean;
  lastReadingEmotion?: string;
}

export type TriggerType = 
  | 'daily_limit'
  | 'curiosity_gap'
  | 'emotional_peak'
  | 'returning_user'
  | 'high_engagement';

export interface PaywallTrigger {
  type: TriggerType;
  shouldTrigger: boolean;
  message: string;
  priority: number;
}

/**
 * Trigger 1: Daily limit reached (3/3 readings)
 * Most direct and effective trigger
 */
export const triggerDailyLimit = (ctx: TriggerContext): PaywallTrigger => {
  const atLimit = ctx.readingsToday >= ctx.readingLimit;
  const hasSpare = ctx.readingsToday === ctx.readingLimit - 1;

  if (atLimit) {
    return {
      type: 'daily_limit',
      shouldTrigger: true,
      message: `You've used all ${ctx.readingLimit} free readings today. Unlock unlimited access to keep exploring.`,
      priority: 100
    };
  }

  if (hasSpare) {
    return {
      type: 'daily_limit',
      shouldTrigger: false,
      message: `One reading left today. Upgrade to unlimited. »`,
      priority: 50
    };
  }

  return {
    type: 'daily_limit',
    shouldTrigger: false,
    message: '',
    priority: 0
  };
};

/**
 * Trigger 2: Curiosity gap (mid-reading reveal)
 * Shows after 70-80% of reading is revealed
 */
export const triggerCuriosityGap = (ctx: TriggerContext): PaywallTrigger => {
  const deepQuestion = ctx.questionLength > 80;
  const highEngagement = ctx.engagementScore > 0.7;

  if (deepQuestion && highEngagement) {
    return {
      type: 'curiosity_gap',
      shouldTrigger: true,
      message: ctx.lastReadingEmotion
        ? `The ${ctx.lastReadingEmotion} in your cards runs deeper...`
        : "There's more here than meets the eye...",
      priority: 90
    };
  }

  return {
    type: 'curiosity_gap',
    shouldTrigger: false,
    message: '',
    priority: 30
  };
};

/**
 * Trigger 3: Emotional peak (after powerful insight)
 * Triggers when user receives strong emotional reading
 */
export const triggerEmotionalPeak = (ctx: TriggerContext): PaywallTrigger => {
  const powerfulEmotions = ['love', 'transformation', 'destiny', 'reunion', 'breakthrough', 'awakening'];
  const isPowerful = ctx.lastReadingEmotion && powerfulEmotions.includes(ctx.lastReadingEmotion);

  if (isPowerful && ctx.engagementScore > 0.5) {
    const userName = ctx.userId ? ctx.userId.substring(0, 6) : 'Seeker';
    return {
      type: 'emotional_peak',
      shouldTrigger: true,
      message: `This ${ctx.lastReadingEmotion} runs deep, ${userName}. What else awaits?»`,
      priority: 95
    };
  }

  return {
    type: 'emotional_peak',
    shouldTrigger: false,
    message: '',
    priority: 20
  };
};

/**
 * Trigger 4: Returning user with history
 * Uses pattern recognition for stickiness
 */
export const triggerReturningUser = (ctx: TriggerContext): PaywallTrigger => {
  if (ctx.previousReadings && ctx.previousReadings >= 3) {
    return {
      type: 'returning_user',
      shouldTrigger: true,
      message: `This pattern has appeared ${ctx.previousReadings} times. The answer deepens each time...»`,
      priority: 85
    };
  }

  if (ctx.previousReadings && ctx.previousReadings >= 2) {
    return {
      type: 'returning_user',
      shouldTrigger: false,
      message: `You've returned ${ctx.previousReadings} times. The cards remember...»`,
      priority: 40
    };
  }

  return {
    type: 'returning_user',
    shouldTrigger: false,
    message: '',
    priority: 0
  };
};

/**
 * Trigger 5: High engagement (time + depth)
 * User is invested psychologically
 */
export const triggerHighEngagement = (ctx: TriggerContext): PaywallTrigger => {
  const timeInvested = ctx.timeOnSite > 300; // 5 minutes
  const deepQuestion = ctx.questionLength > 100;

  if (timeInvested && deepQuestion) {
    return {
      type: 'high_engagement',
      shouldTrigger: true,
      message: `You've journeyed deep into this question. The full path awaits...»`,
      priority: 80
    };
  }

  return {
    type: 'high_engagement',
    shouldTrigger: false,
    message: '',
    priority: 0
  };
};

/**
 * Check expired premium - renewal opportunity
 */
export const triggerPremiumExpired = (ctx: TriggerContext): PaywallTrigger => {
  if (ctx.hasPremiumExpired) {
    return {
      type: 'daily_limit',
      shouldTrigger: true,
      message: `Your Premium access has ended. Renew to continue your journey.`,
      priority: 100
    };
  }

  return {
    type: 'daily_limit',
    shouldTrigger: false,
    message: '',
    priority: 0
  };
};

/**
 * Evaluate all triggers and return highest priority active trigger
 */
export const evaluateTriggers = (ctx: TriggerContext): PaywallTrigger => {
  const triggers = [
    triggerPremiumExpired(ctx),
    triggerDailyLimit(ctx),
    triggerEmotionalPeak(ctx),
    triggerCuriosityGap(ctx),
    triggerReturningUser(ctx),
    triggerHighEngagement(ctx)
  ];

  const activeTriggers = triggers.filter(t => t.shouldTrigger);
  
  if (activeTriggers.length === 0) {
    return {
      type: 'daily_limit',
      shouldTrigger: false,
      message: '',
      priority: 0
    };
  }

  // Return highest priority trigger
  return activeTriggers.reduce((max, trigger) => 
    trigger.priority > max.priority ? trigger : max
  );
};

/**
 * Generate personalized CTA based on trigger type
 */
export const getPersonalizedCTA = (
  triggerType: TriggerType,
  userName?: string
): string => {
  const ctas: Record<TriggerType, string[]> = {
    daily_limit: [
      "Unlock Unlimited Access",
      "Continue Your Journey",
      "Break Free From Limits"
    ],
    curiosity_gap: [
      "See What's Hidden Next",
      "Reveal The Final Insight",
      "Complete Your Destiny"
    ],
    emotional_peak: [
      "Explore This Deeper",
      "Unlock Full Understanding",
      "Embrace The Truth"
    ],
    returning_user: [
      "Return With Premium Access",
      "Continue Your Pattern",
      "Deepen Your Journey"
    ],
    high_engagement: [
      "Unlock Everything Now",
      "Go Unlimited Today",
      "Claim Full Access"
    ]
  };

  const ctaPool = ctas[triggerType];
  let cta = ctaPool[Math.floor(Math.random() * ctaPool.length)];
  
  if (userName) {
    cta = cta.replace('Unlock', `${userName}, Unlock`);
  }

  return cta;
};