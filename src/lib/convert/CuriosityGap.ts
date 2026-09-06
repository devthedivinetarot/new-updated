// ====== CONVERSION PSYCHOLOGY: CURIOSITY GAP PAYWALL ======
// Triggers paywall at peak emotional engagement (70-80% through reading)

export interface ReadingPreview {
  fullReading: string;
  previewLength: number;
  preview: string;
  isLocked: boolean;
  hook: string;
  cta: string;
  urgency: string;
}

const CURIOUS_HOOKS = [
  "There's something important your cards are trying to reveal next...",
  "The final insight holds the key — but it's just out of reach...",
  "The cards have more to show you — the deepest truth is still hidden...",
  "Your reading is almost complete, but the most powerful part remains locked...",
  "What the cards reveal next could change everything...",
  "The universe is whispering something crucial — if only you could hear it all...",
  "This pattern has appeared before. The resolution is in what comes next...",
  "The cards are protecting their final message — for those ready to receive it...",
];

const URGENCY_PHRASES = [
  "Your energy is strongest right now — don't let this clarity fade",
  "This reading is most accurate in this moment",
  "The window to act on this insight is narrowing...",
  "Your cards won't stay this clear forever...",
  "This alignment is rare — seize it now",
];

const UPGRADE_CTAS = [
  "Unlock Full Reading for ₹199/month",
  "See What's Hidden Next",
  "Continue Your Destiny Path",
  "Reveal the Final Insight",
  "Complete Your Reading Now",
  "Claim Your Full Guidance",
];

/**
 * Creates curiosity gap for free users
 * Shows 70-80% of insight, locks the rest
 * Triggers at peak emotional engagement
 */
export const createCuriosityGap = (
  fullText: string,
  isPremium: boolean,
  questionTone?: string
): ReadingPreview => {
  if (isPremium) {
    return {
      fullReading: fullText,
      previewLength: fullText.length,
      preview: fullText,
      isLocked: false,
      hook: '',
      cta: '',
      urgency: ''
    };
  }

  // For free users: show 75%, lock the rest
  const showPercent = 0.72 + Math.random() * 0.08; // 72-80%
  const previewLength = Math.floor(fullText.length * showPercent);
  const preview = fullText.substring(0, previewLength);

  const hook = CURIOUS_HOOKS[Math.floor(Math.random() * CURIOUS_HOOKS.length)];
  const cta = UPGRADE_CTAS[Math.floor(Math.random() * UPGRADE_CTAS.length)];
  const urgency = URGENCY_PHRASES[Math.floor(Math.random() * URGENCY_PHRASES.length)];

  return {
    fullReading: fullText,
    previewLength,
    preview,
    isLocked: true,
    hook,
    cta,
    urgency
  };
};

/**
 * Personalizes hook based on user context
 */
export const personalizeHook = (
  hook: string,
  userName?: string,
  previousReadings?: number
): string => {
  let personalized = hook;
  
  if (userName) {
    personalized = personalized
      .replace("your cards", `${userName}'s cards`)
      .replace("You're", `${userName}, you're`)
      .replace("Your", `${userName}'s`);
  }

  if (previousReadings && previousReadings > 1) {
    personalized = `This pattern has appeared again for ${userName || 'you'}... ${personalized}`;
  }

  return personalized;
};

/**
 * Determines if user should see curiosity gap
 * Based on emotional engagement and reading depth
 */
export const shouldTriggerCuriosityGap = (
  questionLength: number,
  engagementScore: number,
  isPremium: boolean
): boolean => {
  if (isPremium) return false;
  
  // Deep questions + high engagement = trigger
  const deepQuestion = questionLength > 80;
  const highEngagement = engagementScore > 0.6;
  
  return deepQuestion && highEngagement;
};