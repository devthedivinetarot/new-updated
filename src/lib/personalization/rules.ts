import type { 
  UserProfile, 
  IntentType, 
  EngagementLevel, 
  ConversionStage 
} from './profile';

export interface UIVariant {
  heroHeadline: string;
  heroSubheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  showTestimonials: boolean;
  showUrgency: boolean;
  showPremiumBadge: boolean;
  paywallStrength: 'soft' | 'medium' | 'strong';
  emotionalTone: 'curious' | 'urgent' | 'reassuring' | 'empowering';
  showSocialProof: boolean;
  showTrustBadges: boolean;
}

export interface PersonalizationRules {
  variant: UIVariant;
  readingFlow: ReadingFlowConfig;
  paywall: PaywallConfig;
  chat: ChatConfig;
}

export interface ReadingFlowConfig {
  prefillQuestions: string[];
  showGuidedQuestions: boolean;
  tone: 'curious' | 'supportive' | 'direct';
  showMemory: boolean;
  showHistory: boolean;
}

export interface PaywallConfig {
  triggerAfterCards: number;
  messageTone: 'curious' | 'urgent' | 'soft';
  showSavings: boolean;
  showTimeLimit: boolean;
  upsellType: 'single' | 'bundle' | 'subscription';
}

export interface ChatConfig {
  useMemory: boolean;
  contextMessage: string;
  triggerOnIdle: boolean;
  idleTimeoutMinutes: number;
}

const INTENT_MESSAGES: Record<IntentType, { headline: string; subheadline: string }> = {
  love: {
    headline: "Something about your relationship needs clarity...",
    subheadline: "The cards see what your heart has been wondering about.",
  },
  career: {
    headline: "You've been thinking about your next move...",
    subheadline: "Let the universe guide your path forward.",
  },
  confusion: {
    headline: "You're feeling lost, but answers are closer than you think...",
    subheadline: "The tarot sees the way forward.",
  },
  general: {
    headline: "Get answers from the universe in seconds",
    subheadline: "Experience mystical readings that feel made just for you.",
  },
};

const CTA_MESSAGES: Record<ConversionStage, { primary: string; secondary: string }> = {
  new: {
    primary: "startReading",
    secondary: "talkToGinni",
  },
  exploring: {
    primary: "continueJourney",
    secondary: "talkToGinni",
  },
  high_intent: {
    primary: "unlockClarity",
    secondary: "getDeeperInsights",
  },
  paid: {
    primary: "continueReading",
    secondary: "exploreMore",
  },
};

export function applyPersonalizationRules(profile: UserProfile | null): PersonalizationRules {
  if (!profile) {
    return getDefaultRules();
  }

  const variant = getUIVariant(profile);
  const readingFlow = getReadingFlowConfig(profile);
  const paywall = getPaywallConfig(profile);
  const chat = getChatConfig(profile);

  return { variant, readingFlow, paywall, chat };
}

function getUIVariant(profile: UserProfile): UIVariant {
  const { conversionStage, dominantIntent, engagementLevel, isHighIntent } = profile;

  const intentContent = INTENT_MESSAGES[dominantIntent];
  const ctaContent = CTA_MESSAGES[conversionStage];

  return {
    heroHeadline: intentContent.headline,
    heroSubheadline: intentContent.subheadline,
    ctaPrimary: ctaContent.primary,
    ctaSecondary: ctaContent.secondary,
    showTestimonials: conversionStage !== 'new' || engagementLevel === 'high',
    showUrgency: isHighIntent && conversionStage === 'high_intent',
    showPremiumBadge: conversionStage === 'paid',
    paywallStrength: getPaywallStrength(profile),
    emotionalTone: getEmotionalTone(profile),
    showSocialProof: engagementLevel !== 'low',
    showTrustBadges: conversionStage === 'new',
  };
}

function getPaywallStrength(profile: UserProfile): 'soft' | 'medium' | 'strong' {
  if (profile.conversionStage === 'paid') return 'soft';
  if (profile.isHighIntent) return 'strong';
  if (profile.conversionStage === 'high_intent') return 'medium';
  return 'soft';
}

function getEmotionalTone(profile: UserProfile): 'curious' | 'urgent' | 'reassuring' | 'empowering' {
  if (profile.dominantIntent === 'confusion') return 'reassuring';
  if (profile.isHighIntent) return 'urgent';
  if (profile.engagementLevel === 'high') return 'empowering';
  return 'curious';
}

function getReadingFlowConfig(profile: UserProfile): ReadingFlowConfig {
  const prefillQuestions = getPrefillQuestions(profile);
  const tone = getReadingTone(profile);

  return {
    prefillQuestions,
    showGuidedQuestions: profile.conversionStage !== 'new',
    tone,
    showMemory: profile.engagementLevel !== 'low',
    showHistory: profile.readingsCount > 0,
  };
}

function getPrefillQuestions(profile: UserProfile): string[] {
  const { dominantIntent } = profile;

  const intentQuestions: Record<IntentType, string[]> = {
    love: [
      "What does my partner truly feel about me?",
      "Is this relationship meant to last?",
      "What's holding us back from being together?",
    ],
    career: [
      "What career path aligns with my purpose?",
      "Should I make this career change now?",
      "What's blocking my professional success?",
    ],
    confusion: [
      "What should I do next?",
      "What direction should I take?",
      "What's the best choice for me right now?",
    ],
    general: [
      "What message does the universe have for me?",
      "What energy is surrounding me right now?",
      "What should I focus on moving forward?",
    ],
  };

  return intentQuestions[dominantIntent];
}

function getReadingTone(profile: UserProfile): 'curious' | 'supportive' | 'direct' {
  if (profile.conversionStage === 'new') return 'curious';
  if (profile.engagementLevel === 'high') return 'direct';
  return 'supportive';
}

function getPaywallConfig(profile: UserProfile): PaywallConfig {
  const triggerAfterCards = profile.isHighIntent ? 3 : 5;

  return {
    triggerAfterCards,
    messageTone: getPaywallMessageTone(profile),
    showSavings: profile.conversionStage === 'exploring',
    showTimeLimit: profile.isHighIntent,
    upsellType: getUpsellType(profile),
  };
}

function getPaywallMessageTone(profile: UserProfile): 'curious' | 'urgent' | 'soft' {
  if (profile.isHighIntent) return 'urgent';
  if (profile.conversionStage === 'new') return 'soft';
  return 'curious';
}

function getUpsellType(profile: UserProfile): 'single' | 'bundle' | 'subscription' {
  if (profile.conversionStage === 'paid') return 'bundle';
  if (profile.sessionsCount >= 3) return 'subscription';
  return 'single';
}

function getChatConfig(profile: UserProfile): ChatConfig {
  const contextMessage = getContextMessage(profile);
  
  return {
    useMemory: !!profile.memoryContext,
    contextMessage,
    triggerOnIdle: profile.engagementLevel !== 'low',
    idleTimeoutMinutes: profile.isHighIntent ? 5 : 15,
  };
}

function getContextMessage(profile: UserProfile): string {
  if (profile.lastQuestion) {
    return `Your last question was about "${profile.lastQuestion.slice(0, 50)}..."`;
  }
  
  if (profile.dominantIntent === 'love') {
    return "Your energy around relationships feels significant right now...";
  }
  if (profile.dominantIntent === 'career') {
    return "Your career path seems to be at a crossroads...";
  }
  if (profile.dominantIntent === 'confusion') {
    return "There's unresolved energy from your recent questions...";
  }

  return "I'm here to help guide you...";
}

export function getDefaultRules(): PersonalizationRules {
  return {
    variant: {
      heroHeadline: "Get answers from the universe in seconds",
      heroSubheadline: "Experience mystical readings that feel made just for you.",
      ctaPrimary: "startReading",
      ctaSecondary: "talkToGinni",
      showTestimonials: false,
      showUrgency: false,
      showPremiumBadge: false,
      paywallStrength: 'soft',
      emotionalTone: 'curious',
      showSocialProof: true,
      showTrustBadges: true,
    },
    readingFlow: {
      prefillQuestions: [
        "What message does the universe have for me?",
        "What should I focus on right now?",
      ],
      showGuidedQuestions: true,
      tone: 'curious',
      showMemory: false,
      showHistory: false,
    },
    paywall: {
      triggerAfterCards: 5,
      messageTone: 'soft',
      showSavings: false,
      showTimeLimit: false,
      upsellType: 'single',
    },
    chat: {
      useMemory: false,
      contextMessage: "I'm here to help guide you...",
      triggerOnIdle: false,
      idleTimeoutMinutes: 15,
    },
  };
}

export function mergeRules(
  base: PersonalizationRules,
  overrides: Partial<PersonalizationRules>
): PersonalizationRules {
  return {
    variant: { ...base.variant, ...overrides.variant },
    readingFlow: { ...base.readingFlow, ...overrides.readingFlow },
    paywall: { ...base.paywall, ...overrides.paywall },
    chat: { ...base.chat, ...overrides.chat },
  };
}