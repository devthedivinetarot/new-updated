import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from './i18n/config';

export interface UserState {
  lastReading?: string;
  lastCards?: string[];
  nextHook?: string;
  lastVisit?: number;
  streak?: number;
  totalVisits?: number;
  lastEmotion?: string;
  lastTopic?: string;
  openLoops?: string[];
}

interface UserStateManager extends UserState {
  markReturn: () => ReturnContext;
  incrementStreak: () => void;
  resetStreak: () => void;
  clearState: () => void;
  addOpenLoop: (loop: string) => void;
  clearOpenLoop: (loop: string) => void;
  updateEmotion: (emotion: string) => void;
  updateTopic: (topic: string) => void;
}

interface ReturnContext {
  isReturning: boolean;
  streak: number;
  lastVisitTime: number;
  daysSinceLastVisit: number;
}

const VISIT_HISTORY_KEY = 'tdt_visit_history';

function getLastVisit(): number {
  if (typeof window === 'undefined') return Date.now();
  try {
    const history = localStorage.getItem(VISIT_HISTORY_KEY);
    if (!history) return Date.now();
    const visits: number[] = JSON.parse(history);
    return visits[visits.length - 1] || Date.now();
  } catch {
    return Date.now();
  }
}

function getVisitHistory(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = localStorage.getItem(VISIT_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

function recordVisit(): void {
  if (typeof window === 'undefined') return;
  const history = getVisitHistory();
  history.push(Date.now());
  const trimmed = history.slice(-100);
  localStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(trimmed));
}

function detectIntent(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('love') || q.includes('pyaar')) return 'love';
  if (q.includes('career') || q.includes('job')) return 'career';
  if (q.includes('money') || q.includes('paise')) return 'finance';
  if (q.includes('confused') || q.includes('uljhan')) return 'confusion';
  if (q.includes('anxious') || q.includes('chinta')) return 'anxiety';
  if (q.includes('broken') || q.includes('hurt')) return 'heartbreak';
  if (q.includes('stuck') || q.includes('ruka')) return 'stuck';
  if (q.includes('hope') || q.includes('aasha')) return 'hopeful';
  return 'general';
}

export const useUserStateStore = create<UserStateManager>()(
  persist(
    (set, get) => ({
      lastReading: undefined,
      lastCards: undefined,
      nextHook: undefined,
      lastVisit: getLastVisit(),
      streak: 1,
      totalVisits: 1,
      lastEmotion: undefined,
      lastTopic: undefined,
      openLoops: [],

      markReturn: () => {
        const state = get();
        const now = Date.now();
        const lastVisit = state.lastVisit || now;
        const hoursSince = (now - lastVisit) / (1000 * 60 * 60);
        const daysSince = Math.floor(hoursSince / 24);
        const isReturning = hoursSince < 48 && (state.totalVisits || 0) > 1;

        return {
          isReturning,
          streak: state.streak || 0,
          lastVisitTime: lastVisit,
          daysSinceLastVisit: daysSince
        };
      },

      incrementStreak: () => {
        set(state => ({
          streak: (state.streak || 0) + 1
        }));
      },

      resetStreak: () => {
        set({ streak: 1 });
      },

      clearState: () => {
        set({
          lastReading: undefined,
          lastCards: undefined,
          nextHook: undefined,
          lastVisit: Date.now(),
          streak: 1,
          totalVisits: 1,
          lastEmotion: undefined,
          lastTopic: undefined,
          openLoops: []
        });
      },

      addOpenLoop: (loop: string) => {
        set(state => ({
          openLoops: [...(state.openLoops || []), loop]
        }));
      },

      clearOpenLoop: (loop: string) => {
        set(state => ({
          openLoops: (state.openLoops || []).filter(l => l !== loop)
        }));
      },

      updateEmotion: (emotion: string) => {
        set({ lastEmotion: emotion });
      },

      updateTopic: (topic: string) => {
        set({ lastTopic: topic });
      }
    }),
    {
      name: 'tdt-user-state',
      version: 1
    }
  )
);

// Hook for daily return triggers
export function useDailyTrigger() {
  const { markReturn } = useUserStateStore();

  const getReturnMessage = (name: string, language: Language = 'hinglish'): string | null => {
    const context = markReturn();
    if (!context.isReturning) return null;

    const messages: Record<Language, string[]> = {
      en: [
        `${name}, that signal I mentioned? It's still moving toward you. Did you notice?`,
        `${name}, remember what we discussed last time? Something's already shifted.`,
        `${name}, check back today - the energy has changed since your last reading.`
      ],
      hi: [
        `${name}, maine jis signal ka zikr kiya tha? Woh ab bhi tumhare aur aa raha hai. Kya tumne notice kiya?`,
        `${name}, yaad hai last time humne kya baat ki thi? Kuch shift ho chuka hai.`
      ],
      hinglish: [
        `${name}, woh signal jo maine mention kiya tha? Woh ab bhi tumhare aur aa raha hai. Kya tumne notice kiya?`,
        `${name}, yaad hai last time humne kya discuss kiya tha? Kuch shift ho chuka hai.`,
        `${name}, aaj check karo - energy tumhare last reading ke baad change ho gayi hai.`
      ],
      ar: [
        `${name}, تلك الإشارة التيذكرتها؟ لا تزال تقترب منك. هل لاحظتها؟`,
        `${name}, تذكر ما ناقشناه المرة الماضية؟ لقد تحول شيء ما بالفعل.`
      ],
      he: [
        `${name}, האותzyme שהזכרתי? עדיין מתקרב אליך. הרגשת?`,
        `${name}, זוכר מה דנו בפעם האחרונה? משהו שינה כבר.`
      ]
    };

    const langMessages = messages[language] || messages.hinglish;
    return langMessages[Math.floor(Math.random() * langMessages.length)];
  };

  const getStreakMessage = (name: string, language: Language = 'hinglish'): string | null => {
    const { streak } = useUserStateStore.getState();
    if (!streak || streak < 2) return null;

    const streakMessages: Record<Language, string[]> = {
      en: [
        `🔥 ${streak} days running strong. Don't break the chain.`,
        `Your ${streak}-day streak shows commitment. The universe notices.`
      ],
      hi: [
        `🔥 ${streak} दिन से तुम अपने answers के close aa रहे हो… break मत करना।`,
        `तुम्हारा ${streak}-दिन streak dedication dikhata है। Universe notices करता है।`
      ],
      hinglish: [
        `🔥 ${streak} din se tum apne answers ke close aa rahe ho… break mat karna.`,
        `Tumhara ${streak}-din streak dedication dikhata hai. Universe notices karta hai.`
      ],
      ar: [
        `🔥 ${streak} أيام من الاستمرارية القوية. لا تكسر السلسلة.`,
        `سلسلة ${streak} يوم تظهر الالتزام. الكون يلاحظ.`
      ],
      he: [
        `🔥 ${streak} ימים רצ continously. אל תשבור את השרשרת.`,
        `הקסם של ${streak} יום מראה התמקדות. היקום מודע.`
      ]
    };

    const langMsgs = streakMessages[language] || streakMessages.hinglish;
    return langMsgs[Math.floor(Math.random() * langMsgs.length)];
  };

  return { getReturnMessage, getStreakMessage };
}

// Hook for micro-curiosity notifications
export function useMicroCuriosity() {
  const { lastCards } = useUserStateStore();

  const getTodayVariant = (): string | null => {
    if (!lastCards || lastCards.length === 0) return null;
    const card = lastCards[0];
    const today = new Date().getDay();

    const variants = [
      `💡 Today's cards are reading differently than yesterday's. Check the subtle shifts.`,
      `Something about the ${card} energy feels stronger today. Can you sense it?`,
      `The stars have moved slightly since your last reading. Come see what's new.`,
      `A tiny change in card energy today means a lot. Tap to discover.`,
      `The ${card} is whispering something new today. Listen closely.`
    ];

    return variants[today % variants.length];
  };

  return { getTodayVariant };
}

// Hook for streak system
export function useStreakSystem() {
  const { streak, incrementStreak, resetStreak } = useUserStateStore();

  const checkAndIncrementStreak = (): void => {
    if (typeof window === 'undefined') return;
    const lastVisit = useUserStateStore.getState().lastVisit;
    const now = Date.now();
    const hoursSince = (now - (lastVisit || 0)) / (1000 * 60 * 60);

    if (hoursSince > 48) {
      resetStreak();
    } else {
      incrementStreak();
    }
  };

  return {
    currentStreak: streak || 0,
    checkAndIncrementStreak,
    incrementStreak,
    resetStreak
  };
}

export default useUserStateStore;

