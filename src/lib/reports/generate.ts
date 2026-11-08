import tarotData from '@/data/tarot-data.json';
import { getInsight, luckyNumber, type Tone } from './cardInsights';
import { EN } from './cards.en';
import { HI } from './cards.hi';
import {
  TOPICS, TOPIC_COPY, MONTHS, L, PHASE, SUMMARY, HOW_TO_READ, GUIDELINES, colorName, fill,
  type Lang, type Topic,
} from './i18n';

export type { Lang, Topic } from './i18n';
export { TOPICS, LANGS } from './i18n';

export const PLANS = {
  standard: { id: 'standard', amount: 99900, rupees: 999, days: 7 },
  express: { id: 'express', amount: 129900, rupees: 1299, days: 3 },
} as const;
export type PlanId = keyof typeof PLANS;

export interface ReportInput {
  topic: Topic;
  lang: Lang;
  name: string;
  partner?: string;
  year: number;
  cardIds: number[]; // 12 card ids, Jan..Dec
}

export interface MonthSection { heading: string; text: string; emphasis?: boolean }

export interface MonthReading {
  month: string;
  cardId: number;
  cardName: string;
  image: string;
  theme: string;
  tone: Tone;
  sections: MonthSection[];
  luckyColor: string;
  luckyNumber: number;
}

export interface Report {
  topic: Topic;
  lang: Lang;
  topicLabel: string;
  name: string;
  partner?: string;
  year: number;
  intro: string;
  tagline: string;
  months: MonthReading[];
  overall: string;
  labels: Record<string, string>;
  howToRead: string[];
  guidelines: string[];
}

const CARDS = (tarotData as { cards: { id: number; name: string; image: string }[] }).cards;

export const isTopic = (v: unknown): v is Topic => TOPICS.some((t) => t.id === v);
export const isLang = (v: unknown): v is Lang => v === 'en' || v === 'hi' || v === 'hinglish';
export const topicNeedsPartner = (t: Topic) => TOPICS.find((x) => x.id === t)!.partner;

/** 12 unique random card ids from the full 78-card deck (Fisher–Yates). */
export function drawCardIds(count = 12): number[] {
  const ids = CARDS.map((c) => c.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, count);
}

export function isValidCardIds(ids: unknown): ids is number[] {
  return Array.isArray(ids) && ids.length === 12 && new Set(ids).size === 12 &&
    ids.every((n) => Number.isInteger(n) && n >= 0 && n < CARDS.length);
}

function cardText(lang: Lang, id: number) {
  const ins = getInsight(id);
  if (lang === 'en') { const r = EN[id]; return { ...ins, theme: r[0], core: r[1], advice: r[2], love: r[3], career: r[4] }; }
  if (lang === 'hi') { const r = HI[id]; return { ...ins, theme: r[0], core: r[1], advice: r[2], love: r[3], career: r[4] }; }
  return ins;
}

const pick = <T,>(arr: T[], seed: number) => arr[seed % arr.length];
const SCORE: Record<Tone, number> = { p: 1, m: 0, c: -1 };

export function generateReport(input: ReportInput): Report {
  const { topic, lang, year } = input;
  const name = input.name.trim();
  const partner = topicNeedsPartner(topic) ? (input.partner || '').trim() : undefined;
  const copy = TOPIC_COPY[lang][topic];
  const labels = L[lang];
  const vars = { name, partner: partner || '', year };

  const months: MonthReading[] = input.cardIds.map((id, i) => {
    const card = CARDS[id];
    const t = cardText(lang, id);
    const month = MONTHS[lang][i];
    const seed = id + i;
    const v = { ...vars, month, card: card.name, core: t.core, love: t.love, career: t.career };
    let sections: MonthSection[];
    if (topic === 'yearly') {
      sections = [
        { heading: labels.overallReading, text: `${fill(copy.yearLead!, v)} ${pick(copy.year![t.tone], seed)}` },
        { heading: labels.monthlyGuidance, text: t.advice, emphasis: true },
      ];
    } else {
      sections = [
        { heading: fill(labels.hisFeelings, vars), text: `${fill(copy.feelLead!, v)} ${pick(copy.feelings![t.tone], seed)} ${t.core}` },
        { heading: labels.hisActions, text: pick(copy.actions![t.tone], seed), emphasis: true },
        { heading: fill(labels.guidanceFor, vars), text: `${pick(copy.guide![t.tone], seed)} ${t.advice}`, emphasis: true },
      ];
    }
    return {
      month, cardId: id, cardName: card.name, image: card.image, theme: t.theme, tone: t.tone, sections,
      luckyColor: colorName(t.color, lang), luckyNumber: luckyNumber(id),
    };
  });

  const s = SUMMARY[lang];
  const first = months.slice(0, 6).reduce((a, m) => a + SCORE[m.tone], 0);
  const second = months.slice(6).reduce((a, m) => a + SCORE[m.tone], 0);
  const pa = PHASE[lang](first), pb = PHASE[lang](second);
  const best = months.filter((m) => m.tone === 'p').map((m) => m.month).slice(0, 4);
  const careful = months.filter((m) => m.tone === 'c').map((m) => m.month);
  const majors = input.cardIds.filter((id) => id <= 21).length;
  const parts = [pa === pb ? s.same(year, pa) : s.flow(year, pa, pb)];
  if (best.length) parts.push(s.best(best.join(s.join)));
  if (careful.length) parts.push(s.careful(careful.join(s.join)));
  if (majors >= 5) parts.push(s.majors(majors));
  parts.push(fill(copy.closing, vars));

  return {
    topic, lang, year, name, partner,
    topicLabel: TOPICS.find((x) => x.id === topic)!.label[lang],
    intro: fill(copy.intro, vars),
    tagline: copy.tagline,
    months,
    overall: parts.join(' '),
    labels,
    howToRead: HOW_TO_READ[lang],
    guidelines: GUIDELINES[lang],
  };
}
