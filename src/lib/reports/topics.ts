// Small, client-safe list of report topics and languages.
export type Lang = 'en' | 'hi' | 'hinglish';
export type Topic = 'yearly' | 'no-contact' | 'affair' | 'crush' | 'separation';

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी (Hindi)' },
  { id: 'hinglish', label: 'Hinglish' },
];

export const TOPICS: { id: Topic; partner: boolean; label: Record<Lang, string>; short: string }[] = [
  { id: 'yearly', partner: false, short: '12-month overall guidance',
    label: { en: 'Your Overall Year with Guidance', hi: 'आपका पूरा वर्ष — मार्गदर्शन सहित', hinglish: 'Aapka Overall Year — Guidance ke saath' } },
  { id: 'no-contact', partner: true, short: 'His feelings & actions during no contact',
    label: { en: 'His Feelings & Actions — No Contact', hi: 'उनकी भावनाएँ और कदम — नो कॉन्टैक्ट', hinglish: 'Unki Feelings & Actions — No Contact' } },
  { id: 'affair', partner: true, short: 'His feelings & actions in an affair',
    label: { en: 'His Feelings & Actions — Affair', hi: 'उनकी भावनाएँ और कदम — अफ़ेयर', hinglish: 'Unki Feelings & Actions — Affair' } },
  { id: 'crush', partner: true, short: 'His feelings & actions — crush / one-sided',
    label: { en: 'His Feelings & Actions — Crush / One-sided', hi: 'उनकी भावनाएँ और कदम — क्रश / एकतरफ़ा', hinglish: 'Unki Feelings & Actions — Crush / One-sided' } },
  { id: 'separation', partner: true, short: 'His feelings & actions — marriage separation',
    label: { en: 'His Feelings & Actions — Marriage Separation', hi: 'उनकी भावनाएँ और कदम — वैवाहिक अलगाव', hinglish: 'Unki Feelings & Actions — Marriage Separation' } },
];
