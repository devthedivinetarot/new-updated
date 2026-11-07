import { getAllCards, type CardMetadata } from '@/lib/cardEngine';
import { getInsight, luckyNumber, type Tone } from './cardInsights';

export type ReportType =
  | 'yearly'
  | 'no-contact'
  | 'love'
  | 'marriage'
  | 'career'
  | 'health'
  | 'education';

export interface ReportInput {
  name: string;
  partner?: string;
  year: number;
}

export interface MonthSection {
  heading: string;
  text: string;
  emphasis?: boolean; // render as guidance / quote style
}

export interface MonthReading {
  month: string;
  card: CardMetadata;
  theme: string;
  tone: Tone;
  sections: MonthSection[];
  luckyColor: string;
  luckyNumber: number;
}

export interface Report {
  type: ReportType;
  title: string;
  name: string;
  partner?: string;
  year: number;
  intro: string;
  tagline: string;
  disclaimer?: string;
  months: MonthReading[];
  overall: string;
}

export interface ReportConfig {
  type: ReportType;
  label: string;
  short: string;
  title: string;
  partner: 'none' | 'optional' | 'required';
  partnerLabel?: string;
}

export const REPORTS: ReportConfig[] = [
  { type: 'yearly', label: 'Yearly Report', short: '12-month overall guidance', title: 'Yearly Tarot Guidance Report', partner: 'none' },
  { type: 'no-contact', label: 'No Contact Report', short: 'What they may be thinking', title: 'Love & No-Contact Tarot Report', partner: 'required', partnerLabel: "Partner's name" },
  { type: 'love', label: 'Love Life Report', short: 'Romance & relationships', title: 'Love Life Tarot Report', partner: 'optional', partnerLabel: "Partner's name (optional)" },
  { type: 'marriage', label: 'Marriage Report', short: 'Commitment & family', title: 'Marriage Tarot Report', partner: 'optional', partnerLabel: "Partner's name (optional)" },
  { type: 'career', label: 'Career & Business Report', short: 'Work, money & growth', title: 'Career & Business Tarot Report', partner: 'none' },
  { type: 'health', label: 'Health Report', short: 'Energy & wellbeing', title: 'Health & Wellbeing Tarot Report', partner: 'none' },
  { type: 'education', label: 'Education Report', short: 'Studies & exams', title: 'Education Tarot Report', partner: 'none' },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Fisher–Yates shuffle of the full 78-card deck; first 12 are the year's cards. */
export function drawCards(count = 12): CardMetadata[] {
  const deck = getAllCards();
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, count);
}

const pick = <T,>(arr: T[], seed: number) => arr[seed % arr.length];

const TONE_LINE: Record<ReportType, Record<Tone, string[]>> = {
  yearly: {
    p: ['Yeh month overall supportive aur encouraging rahega.', 'Is energy ka faayda uthane ke liye active rehna faydemand hoga.', 'Positive results ki sambhavna strong hai.'],
    m: ['Month mixed rahega — patience aur awareness se achha outcome nikal sakta hai.', 'Jaldbaazi ke bajay soch-samajhkar chalna better rahega.'],
    c: ['Month thoda challenging feel ho sakta hai, lekin yeh important lessons lekar aayega.', 'Mushkil moments temporary honge; calm rehna sabse bada support hoga.'],
  },
  'no-contact': {
    p: ['Is month connection ki kami unhe zyada feel ho sakti hai.', 'Unke mann mein softness aur positive yaadein zyada rahengi.'],
    m: ['Feelings aur hesitation ke beech woh thode confused reh sakte hain.', 'Thoughts aate rahenge, lekin unhe express karne mein jhijhak rahegi.'],
    c: ['Woh abhi khud ko protect karne aur distance banaye rakhne ke mode mein ho sakte hain.', 'Unki energy abhi guarded rahegi; ego ya hurt beech mein aa sakta hai.'],
  },
  love: {
    p: ['Love life mein warmth aur closeness badhne ke achhe sanket hain.'],
    m: ['Love life mein kuch baatein clear karni pad sakti hain; patience kaam aayega.'],
    c: ['Love life mein misunderstandings se bachne ke liye honest communication zaroori hogi.'],
  },
  marriage: {
    p: ['Rishta pakka hone, family talks ya commitment ki baat aage badhne ke achhe sanket hain.'],
    m: ['Baat aage badh sakti hai, lekin family ya timing ki wajah se thoda delay ya discussion ho sakta hai.'],
    c: ['Is month bade commitment ka decision jaldbaazi mein lene se bacho; pehle clarity aur stability zaroori hai.'],
  },
  career: {
    p: ['Business mein growth, naye clients ya income badhne ke sanket hain.', 'Money flow supportive rahega; smart reinvestment faydemand hoga.'],
    m: ['Money matters mein careful planning chahiye; bade investments soch-samajhkar karo.', 'Income stable reh sakti hai, lekin kharchon par nazar rakhna zaroori hai.'],
    c: ['Kharche aur risk control mein rakho; abhi aggressive expansion ka sahi waqt nahi.', 'Financial decisions mein extra caution rakho aur contracts dhyan se padho.'],
  },
  health: {
    p: ['Energy levels achhe reh sakte hain aur recovery ko support milega.'],
    m: ['Routine mein balance zaroori hoga; stress aur neend ko ignore mat karo.'],
    c: ['Body aur mind dono ko extra care chahiye; kisi bhi pareshani mein doctor se salah zaroor lo.'],
  },
  education: {
    p: ['Concentration aur results dono ke liye supportive time hai.'],
    m: ['Focus bana rehne ke liye structured timetable zaroori hoga.'],
    c: ['Distraction ya pressure feel ho sakta hai; chhote goals banakar aage badho.'],
  },
};

const NC_ACTION: Record<Tone, string[]> = {
  p: ['Soft contact, message ya reaching out ka chance strong hai.', 'Koi positive signal ya conversation start hone ki sambhavna hai.'],
  m: ['Subtle checking (profile, status) possible; direct contact uncertain.', 'Contact ka thought aa sakta hai, lekin action mein hesitation rahegi.'],
  c: ['Immediate outreach unlikely; distance zyada rahega.', 'Is month contact ke bajay silence ya distance ki sambhavna zyada hai.'],
};

const NC_GUIDE: Record<Tone, string> = {
  p: 'Agar contact aaye toh calm aur genuine response do — pressure mat banao.',
  m: 'Patience rakho; pressure, repeated messages ya indirect chasing avoid karo.',
  c: 'Apni healing aur self-respect par focus karo. Silence ko respect karna sabse strong approach rahega.',
};

function buildSections(
  type: ReportType, card: CardMetadata, month: string, seed: number, input: ReportInput,
): MonthSection[] {
  const ins = getInsight(card.id);
  const tone = ins.tone;
  const line = pick(TONE_LINE[type][tone], seed);
  const name = input.name;
  const P = input.partner?.trim();

  switch (type) {
    case 'yearly':
      return [
        { heading: 'Overall Reading', text: `${month} mein ${name} ke liye ${card.name} ki energy rahegi. ${ins.core} Career mein ${ins.career} ka indication hai, aur personal life mein ${ins.love} ki energy feel ho sakti hai. ${line}` },
        { heading: 'Monthly Guidance', text: ins.advice, emphasis: true },
      ];
    case 'no-contact':
      return [
        { heading: `${P} kya soch sakte hain?`, text: `${month} mein ${P} ki energy ${card.name} ke through ${ins.love} ki taraf ishara karti hai. ${line} ${ins.core}` },
        { heading: 'Possible Action', text: pick(NC_ACTION[tone], seed), emphasis: true },
        { heading: `${name} ke liye Guidance`, text: `${NC_GUIDE[tone]} ${ins.advice}`, emphasis: true },
      ];
    case 'love': {
      const extra = P
        ? { p: `${name} aur ${P} ke beech bonding strong ho sakti hai.`, m: `${name} aur ${P} ko ek-dusre ki expectations samajhne ki zarurat hogi.`, c: `${name} aur ${P} ko ego ki jagah understanding choose karni hogi.` }[tone]
        : { p: 'Single ho toh naya connection ya interesting mulaqat possible hai.', m: 'Single ho toh jaldbaazi ke bajay kisi ko achhe se samajhkar aage badho.', c: 'Single ho toh abhi khud ko heal karne aur self-love par focus karna better rahega.' }[tone];
      return [
        { heading: 'Love Energy', text: `${month} mein love life ke liye ${card.name} ${ins.love} ki energy dikhata hai. ${ins.core} ${line} ${extra}` },
        { heading: 'Relationship Guidance', text: ins.advice, emphasis: true },
      ];
    }
    case 'marriage': {
      const who = P ? `${name} aur ${P} ke` : `${name} ke`;
      return [
        { heading: 'Marriage Prospects', text: `${month} mein ${who} marriage aur commitment ke liye ${card.name} ${ins.love} ki taraf ishara karta hai. ${line} ${ins.core}` },
        { heading: 'Family & Commitment Guidance', text: `${ins.advice} Family ke saath open aur respectful baatcheet rakho.`, emphasis: true },
      ];
    }
    case 'career':
      return [
        { heading: 'Career Outlook', text: `${month} mein ${name} ke career ke liye ${card.name} ${ins.career} ka sanket deta hai. ${ins.core}` },
        { heading: 'Business & Money', text: line },
        { heading: 'Action Step', text: ins.advice, emphasis: true },
      ];
    case 'health':
      return [
        { heading: 'Wellbeing Energy', text: `${month} mein health aur wellbeing ke liye ${card.name} ${ins.health} ki taraf ishara karta hai. ${line}` },
        { heading: 'Self-care Guidance', text: `${ins.advice} Pani, neend aur daily movement par dhyan rakho.`, emphasis: true },
      ];
    case 'education':
      return [
        { heading: 'Study Energy', text: `${month} mein padhai ke liye ${card.name} ${ins.study} ki energy dikhata hai. ${ins.core} ${line}` },
        { heading: 'Exams & Focus Guidance', text: ins.advice, emphasis: true },
      ];
  }
}

const INTRO: Record<ReportType, (i: ReportInput) => string> = {
  yearly: (i) => `Yeh report ${i.year} ke har month ki overall tarot energy, possible themes, guidance aur lucky color & number ko highlight karti hai. Tarot reading guidance aur self-reflection ke liye hai; ise fixed prediction ke bajay intuitive direction ke roop mein dekhein.`,
  'no-contact': (i) => `Yeh reading current no-contact situation ko dhyan mein rakhkar banayi gayi hai. Har month card ki symbolic energy ke basis par ${i.partner} ki possible emotional/mental state aur possible action ko interpret kiya gaya hai. Tarot kisi person ke exact thoughts ko factually confirm nahi karta, isliye is report ko intuitive guidance samjhein, certainty nahi.`,
  love: (i) => `Yeh report ${i.year} mein ${i.name} ki love life ki monthly energy dikhati hai — attraction, emotional flow aur relationship guidance. Ise apne dil ko samajhne ke ek tool ki tarah use karein.`,
  marriage: (i) => `Yeh report ${i.year} mein marriage, commitment aur family matters se judi monthly energy ko highlight karti hai. Tarot timing ka ishara deta hai; final decisions hamesha soch-samajhkar aur family ke saath milkar lein.`,
  career: (i) => `Yeh report ${i.year} mein ${i.name} ke career, business aur money matters ki monthly energy dikhati hai. Isse planning aur self-reflection ke liye use karein; financial decisions ke liye expert advice bhi zaroor lein.`,
  health: (i) => `Yeh report ${i.year} mein ${i.name} ki energy aur wellbeing ki monthly tarot guidance deti hai — rest, routine aur self-care par focus ke saath.`,
  education: (i) => `Yeh report ${i.year} mein ${i.name} ki padhai, focus aur exams se judi monthly energy ko highlight karti hai, taaki preparation ko sahi direction mil sake.`,
};

const TAGLINE: Record<ReportType, string> = {
  yearly: 'A year of movement, growth, choices and completion.',
  'no-contact': 'A year of reflection, realisation, movement and clarity.',
  love: 'A year of opening the heart and choosing what feels true.',
  marriage: 'A year of commitment, family and building together.',
  career: 'A year of effort, opportunity and visible growth.',
  health: 'A year of balance, rest and renewed energy.',
  education: 'A year of learning, discipline and results.',
};

const DISCLAIMER: Partial<Record<ReportType, string>> = {
  health: 'Yeh tarot guidance hai, medical advice nahi. Kisi bhi health concern ke liye qualified doctor se salah lein.',
  career: 'Yeh tarot guidance hai, financial advice nahi.',
};

const CLOSING: Record<ReportType, (i: ReportInput) => string> = {
  yearly: (i) => `${i.name} ke liye key message hai: apni direction clear rakho, opportunities ke saath flexible raho aur jo cycle complete ho chuki hai use confidently close karke next chapter ke liye space banao.`,
  'no-contact': (i) => `${i.name} ke liye key message hai: kisi doosre ke action par apni peace depend mat karo. Silence ko respect karo, apni healing par focus rakho, aur agar connection genuine hai toh woh natural tarike se raasta dhoondh lega.`,
  love: () => 'Key message: pyaar mein honesty aur self-respect dono ko barabar jagah do. Jo connection tumhe sukoon de, wahi sahi hai.',
  marriage: () => 'Key message: commitment ka decision dil aur practical reality dono ko dekhkar lo, aur family ke saath transparent raho.',
  career: () => 'Key message: consistent mehnat, smart planning aur sahi timing par liye gaye risks hi is saal ki growth ka base banenge.',
  health: () => 'Key message: chhoti daily habits — neend, pani, movement aur stress management — saal bhar ki energy ka asli base hain.',
  education: () => 'Key message: daily consistency, doubts ko turant clear karna aur khud par bharosa rakhna hi achhe results ki chaabi hai.',
};

const TONE_SCORE: Record<Tone, number> = { p: 1, m: 0, c: -1 };

function phaseText(score: number) {
  if (score >= 3) return 'strong momentum aur opportunities';
  if (score >= 1) return 'positive lekin steady energy';
  if (score >= -1) return 'mixed aur learning-rich energy';
  return 'challenges aur inner work';
}

function buildOverall(type: ReportType, input: ReportInput, months: MonthReading[]): string {
  const first = months.slice(0, 6).reduce((s, m) => s + TONE_SCORE[m.tone], 0);
  const second = months.slice(6).reduce((s, m) => s + TONE_SCORE[m.tone], 0);
  const best = months.filter((m) => m.tone === 'p').map((m) => m.month);
  const careful = months.filter((m) => m.tone === 'c').map((m) => m.month);
  const majors = months.filter((m) => m.card.suit === 'major').length;

  const parts = [
    phaseText(first) === phaseText(second)
      ? `Poore ${input.year} mein ${phaseText(first)} bani rahegi.`
      : `${input.year} ka overall flow ${phaseText(first)} se start hokar ${phaseText(second)} ki taraf move karta hai.`,
  ];
  if (best.length) parts.push(`${best.slice(0, 4).join(', ')} sabse supportive months dikh rahe hain.`);
  if (careful.length) parts.push(`${careful.join(', ')} mein extra patience aur awareness rakhna better rahega.`);
  if (majors >= 5) parts.push(`Is spread mein ${majors} Major Arcana cards hain, jo dikhata hai ki yeh saal life ke bade lessons aur turning points wala hai.`);
  parts.push(CLOSING[type](input));
  return parts.join(' ');
}

export function generateReport(type: ReportType, input: ReportInput, cards: CardMetadata[]): Report {
  const cfg = REPORTS.find((r) => r.type === type)!;
  const months: MonthReading[] = MONTHS.map((month, i) => {
    const card = cards[i];
    const ins = getInsight(card.id);
    return {
      month,
      card,
      theme: ins.theme,
      tone: ins.tone,
      sections: buildSections(type, card, month, card.id + i, input),
      luckyColor: ins.color,
      luckyNumber: luckyNumber(card.id),
    };
  });

  return {
    type,
    title: `${input.year} ${cfg.title}`,
    name: input.name,
    partner: input.partner?.trim() || undefined,
    year: input.year,
    intro: INTRO[type](input),
    tagline: TAGLINE[type],
    disclaimer: DISCLAIMER[type],
    months,
    overall: buildOverall(type, input, months),
  };
}
