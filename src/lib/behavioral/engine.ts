/**
 * Behavioral Psychology Engine for Tarot Addiction Loop
 * Creates curiosity gaps, emotional hooks, and incomplete loops
 * to drive daily return without forced reminders
 */

import type { Language } from '@/lib/i18n/config';

export interface LoopHook {
  type: 'daily_return' | 'premium_trigger' | 'emotional_continuation';
  message: string;
  triggerAt: 'immediate' | 'tomorrow' | 'when_ready';
  urgencyLevel: 'low' | 'medium' | 'high';
}

const BASE = <T>(en: T, hi: T, hinglish: T, ar: T, he: T) => ({ en, hi, hinglish, ar, he });

/**
 * Generate a curiosity gap that makes user want to return tomorrow
 */
export function createDailyHook(
  language: Language,
  userName: string,
  firstName: string,
  topic?: string
): string {
  const hooks = BASE(
    [
      `There's something shifting in your energy that I need to track overnight. Check back tomorrow — I'll have a deeper insight ready for you, ${firstName}.`,
      `The cards are showing a development that hasn't fully landed yet. Come back tomorrow and I'll show you what's emerging.`,
      `I'm sensing something important is about to surface in your ${topic || 'situation'}. Let's reconvene tomorrow when the energy is clearer.`,
      `One card is still whispering its full meaning — I need to listen again tomorrow. You should too.`,
      `This isn't the complete picture yet. Something's in motion. Return tomorrow and I'll guide you through the next phase.`,
    ],
    [
      `Tumhari energy mein kuch aisa shift ho raha hai jo main kal ke liye track kar rahi hoon. ${firstName}, kal wapas aana — deeper insight ke liye.`,
      `Kuch important mode mein aa raha hai jo abhi pure nahi hua. Kal aana, tumhe dikhati hoon kya nikal raha hai.`,
      `Tumhare ${topic || 'situation'} mein ek card abhi apna poora matlab bata nahi raha. Kal milenge, iski baat karte hue.`,
      `Yeh complete picture nahi hai. Kuch chal raha hai. Kal aana, aage ka safar dikhati hoon.`,
    ],
    [
      `${firstName}, tumhari energy mein ek shift ho raha hai jo main overnight track kar rahi hoon. Kal check karo — deeper insight ready lungi.`,
      `Cards dikh rahe hain kuch important jo abhi clear nahi hua. Kal aana, main dikhati hoon kya emerge ho raha hai.`,
      `Tumhare ${topic || 'matter'} mein ek card abhi full meaning nahi bata raha. Kal milenge, isko decode karte hue.`,
      `Yeh picture incomplete hai. Kuch aane wala hai. Kal wapas aana, next phase guide karti hoon.`,
    ],
    [
      `There's something shifting in your energy that I need to track overnight. Check back tomorrow — I'll have a deeper insight ready for you, ${firstName}.`,
      `The cards are showing a development that hasn't fully landed yet. Come back tomorrow and I'll show you what's emerging.`,
      `I'm sensing something important is about to surface in your ${topic || 'situation'}. Let's reconvene tomorrow when the energy is clearer.`,
      `One card is still whispering its full meaning — I need to listen again tomorrow. You should too.`,
    ],
    [
      `There's something shifting in your energy that I need to track overnight. Check back tomorrow — I'll have a deeper insight ready for you, ${firstName}.`,
      `The cards are showing a development that hasn't fully landed yet. Come back tomorrow and I'll show you what's emerging.`,
      `I'm sensing something important is about to surface in your ${topic || 'situation'}. Let's reconvene tomorrow when the energy is clearer.`,
      `One card is still whispering its full meaning — I need to listen again tomorrow. You should too.`,
    ]
  );

  const pool = hooks[language] || hooks.en;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate an emotional hook that creates connection
 */
export function generateEmotionalHook(
  language: Language,
  userName: string,
  firstName: string,
  emotion: string
): string {
  const hooks = BASE(
    {
      anxious: [
        `I can feel you're carrying this close to your heart, ${firstName}. The answers will come — but not all at once. Let's take it one day at a time.`,
        `You're holding your breath waiting for clarity. Breathe. We'll get there tomorrow.`,
      ],
      hopeful: [
        `${firstName}, your hope is radiating. Something beautiful is forming — let's watch it unfold together, day by day.`,
        `The universe is aligning for you. Tomorrow, we see the next piece of the puzzle.`,
      ],
      confused: [
        `Confusion is just clarity in disguise, ${firstName}. By tomorrow, the fog will lift a little more.`,
        `You don't need all the answers today. Just check back tomorrow — we'll make sense of this together.`,
      ],
      default: [
        `${firstName}, this feels personal — like it's been on your mind. Let's keep this conversation going. Tomorrow, I'll tell you what else I see.`,
        `There's more to your story than today's reading revealed. Come back tomorrow — I'm already picking up on what's next.`,
      ],
    },
    {
      default: [
        `${firstName}, yeh personal lag raha hai — jaise tum soch rahe ho. Is baat ko aage badhate hain. Kal milenge, next part ke liye.`,
        `Tumhari kahaani mein aur bhi hai. Kal aana, main batati hoon aage kya aayega.`,
      ],
      anxious: [],
      hopeful: [],
      confused: [],
    },
    {
      default: [
        `${firstName}, yeh personal feel ho raha hai — jaise tum dimag mein lekar jaa rahe ho. Kal wapas aana, next chapter dekhtain.`,
        `Tumhari story ka aage aur chapter hai. Kal milenge, usko lekar.`,
      ],
      anxious: [],
      hopeful: [],
      confused: [],
    },
    {
      default: [`${firstName}, this feels personal — like it's been on your mind. Let's keep this conversation going. Tomorrow, I'll tell you what else I see.`],
      anxious: [],
      hopeful: [],
      confused: [],
    },
    {
      default: [`${firstName}, this feels personal — like it's been on your mind. Let's keep this conversation going. Tomorrow, I'll tell you what else I see.`],
      anxious: [],
      hopeful: [],
      confused: [],
    }
  );

  const emotionHooks = hooks[language]?.[emotion as keyof typeof hooks.en] || hooks[language]?.default || hooks.en.default;
  return emotionHooks[Math.floor(Math.random() * emotionHooks.length)];
}

/**
 * Create an open loop — something intentionally left unresolved
 */
export function createOpenLoop(
  language: Language,
  userName: string,
  firstName: string,
  cardCount: number
): string {
  const loops = BASE(
    [
      `There's one card here that's speaking louder tomorrow than today. Mark my words — you'll feel it when you wake up.`,
      `I'm getting a conflicting signal that needs 24 hours to resolve. Check back and I'll tell you what won.`,
      `Something in your reading has a "Part 2" coming. I'll reveal it tomorrow — it's the part you've been waiting for.`,
      `The cards are showing a decision point approaching fast. By tomorrow, you'll see which way the wind is blowing.`,
    ],
    [
      `Ek aisa card hai jo kal aur zyada bolega kal se. Marks the words — tum uth kar feel karoge.`,
      `Ek conflicting signal aa raha hai jo 24 hours resolve hone ka time le raha hai. Check karo, main bataungi kon jeet raha hai.`,
      `Tumhari reading ka "Part 2" aane wala hai. Kal reveal karti hoon — woh part jiska tum intezaar kar rahe ho.`,
    ],
    [
      `Ek card hai jo kal se zyada bol raha hai. Mark my words — tum uth kar feel karoge.`,
      `Conflicting signal aa raha hai — 24 hours mein resolve hoga. Kal aana, main bata don.`,
      `Reading ka Part 2 aane wala hai. Kal reveal karti hoon — woh part tum waited kar rahe ho.`,
    ],
    [
      `There's one card here that's speaking louder tomorrow than today. Mark my words — you'll feel it when you wake up.`,
      `I'm getting a conflicting signal that needs 24 hours to resolve. Check back and I'll tell you what won.`,
    ],
    [
      `There's one card here that's speaking louder tomorrow than today. Mark my words — you'll feel it when you wake up.`,
      `I'm getting a conflicting signal that needs 24 hours to resolve. Check back and I'll tell you what won.`,
    ]
  );

  const selected = loops[language] || loops.en;
  return selected[Math.floor(Math.random() * selected.length)];
}

/**
 * Generate premium trigger based on engagement signals
 */
export interface EngagementSignal {
  readingCount: number;
  questionDepth: 'surface' | 'medium' | 'deep';
  hesitationScore: number;
  emotionIntensity: 'low' | 'medium' | 'high';
}

export function shouldTriggerPremium(signal: EngagementSignal): boolean {
  if (signal.readingCount >= 2) return true;
  if (signal.questionDepth === 'deep') return true;
  if (signal.hesitationScore > 0.6) return true;
  if (signal.emotionIntensity === 'high') return true;
  return false;
}

/**
 * Generate soft premium conversion message
 */
export function generatePremiumTrigger(
  language: Language,
  userName: string,
  firstName: string,
  reason: string
): string {
  const triggers = BASE(
    {
      deep_engagement: [
        `${firstName}, I can see there's so much depth here. I can personally guide you through this — would you like me to unlock the full reading?`,
        `I feel like I'm only scratching the surface with you, ${firstName}. There's a deeper layer that needs more space. Would you like to go deeper?`,
      ],
      hesitation: [
        `I notice you're really thinking about this… let me give you the whole picture. Unlock full insights to see everything clearly.`,
        `You're searching for real answers, aren't you? I can give you complete clarity — not just today, but the whole story.`,
      ],
      recurring_theme: [
        `This pattern keeps showing up for you, doesn't it? I can help you break it — for good. Unlock the complete guidance.`,
        `${firstName}, this isn't the first time this energy has appeared. Let me give you the full reading so you can finally resolve this.`,
      ],
    },
    {
      deep_engagement: [
        `${firstName}, main dekh rahi hoon kitna depth hai tumhare question mein. Main tumhe personally guide kar sakti hoon — full reading unlock karna chahte ho?`,
        `Lagta hai main scratch kar rahi hoon surface ka. Andar ki baat bhi important hai. Poora clarity milega?`,
      ],
      hesitation: [],
      recurring_theme: [],
    },
    {
      deep_engagement: [
        `${firstName}, I can see there's real depth here. Main tumhe personally guide kar sakti hoon — full reading unlock karna chahte ho?`,
        `Lag raha hai main scratch kar rahi hoon surface ka. Andar ki baat bhi important hai — complete clarity milega full unlock karne par.`,
      ],
      hesitation: [],
      recurring_theme: [],
    },
    {
      deep_engagement: [
        `${firstName}, I can see there's so much depth here. I can personally guide you through this — would you like me to unlock the full reading?`,
      ],
      hesitation: [],
      recurring_theme: [],
    },
    {
      deep_engagement: [
        `${firstName}, I can see there's so much depth here. I can personally guide you through this — would you like me to unlock the full reading?`,
      ],
      hesitation: [],
      recurring_theme: [],
    }
  );

  const category = reason || 'deep_engagement';
    const pool = triggers[language]?.[category as keyof typeof triggers.en] || triggers.en.deep_engagement;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Premium CTA variations — soft, non-salesy
 */
export function getPremiumCTA(language: Language): string {
  const ctas = BASE(
    [
      '✨ Unlock Full Clarity — see everything',
      '🔓 Unlock deeper insights',
      '📖 Get complete reading',
      '💎 Access full guidance',
    ],
    [
      '✨ Poore Insights Unlock karo — sab dekho',
      '🔓 Gehre insights unlock karo',
      '📖 Poora reading pao',
      '💎 Full guidance tak pahuncho',
    ],
    [
      '✨ Full Clarity Unlock karo — sab dekho',
      '🔓 Deeper insights unlock karo',
      '📖 Complete reading pao',
      '💎 Full guidance lo',
    ],
    [
      '✨ Unlock full insights',
      '🔓 Get complete guidance',
      '💎 Unlock everything',
    ],
    [
      '✨ Unlock full insights',
      '🔓 Get complete guidance',
      '💎 Unlock everything',
    ]
  );

  const pool = ctas[language] || ctas.en;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Complete behavioral layer to wrap reading output
 */
export interface BehavioralWrap {
  preReadingHook?: string;
  postReadingHook: string;
  tomorrowHook: string;
  premiumSuggestion?: string;
  showPremium: boolean;
}

export function wrapReadingWithBehavior(
  language: Language,
  firstName: string,
  topic: string,
  signal: EngagementSignal
): BehavioralWrap {
  const hasEngagement = signal.readingCount >= 2 || signal.questionDepth === 'deep';
  const showPremium = shouldTriggerPremium(signal);

  return {
    preReadingHook: undefined,
    postReadingHook: createDailyHook(language, '', firstName, topic),
    tomorrowHook: `Kal milenge, ${firstName} — next phase ke liye.`,
    premiumSuggestion: showPremium ? generatePremiumTrigger(language, '', firstName, 'deep_engagement') : undefined,
    showPremium,
  };
}
