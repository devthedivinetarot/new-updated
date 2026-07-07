/**
 * Daily teaser message bank — Hinglish, Zomato/astro-app style nudges that
 * drive readers back to the website to pick their 3 tarot cards.
 *
 * One message is chosen per day (deterministic, rotates through the bank in
 * order based on the IST date) and used for both the daily email and the
 * WhatsApp broadcast.
 *
 * Editing tips for content updates:
 *  - `whatsapp` must be a SINGLE LINE (Meta template body params reject
 *    newlines/tabs). The sender sanitizes anyway, but write it single-line.
 *  - Keep `emailSubject` under ~60 chars so it doesn't truncate on mobile.
 */

export type MessageTheme =
  | 'universe'
  | 'love'
  | 'career'
  | 'energy'
  | 'moon'
  | 'money'
  | 'general';

export interface DailyMessage {
  id: string;
  theme: MessageTheme;
  /** Email subject line */
  emailSubject: string;
  /** Big line at the top of the email */
  headline: string;
  /** Body paragraphs (short — 1-2 lines each) */
  body: string[];
  /** CTA button label */
  cta: string;
  /** Single-line WhatsApp text (link/button is added by the template) */
  whatsapp: string;
}

export const DAILY_MESSAGES: DailyMessage[] = [
  {
    id: 'universe-answer',
    theme: 'universe',
    emailSubject: '✨ Aaj ki energy kuch khaas keh rahi hai...',
    headline: '✨ Aaj ki energy kuch khaas keh rahi hai...',
    body: [
      'Ho sakta hai Universe ke paas aaj tumhare liye woh jawab ho jiska tum kaafi time se intezaar kar rahe ho.',
      'Bas 3 cards choose karo aur apna message dekho.',
    ],
    cta: 'Apne 3 Cards Choose Karo',
    whatsapp:
      '✨ Aaj ki energy kuch khaas keh rahi hai... Ho sakta hai Universe ke paas aaj tumhare liye woh jawab ho jiska tum kaafi time se intezaar kar rahe ho. 🔮 3 cards choose karo website pe.',
  },
  {
    id: 'universe-message',
    theme: 'universe',
    emailSubject: '✨ Aaj Universe tumse kuch kehna chahta hai...',
    headline: '✨ Aaj Universe tumse kuch kehna chahta hai...',
    body: [
      'Bas 3 Tarot Cards choose karo aur dekho aaj tumhare liye kya message aaya hai.',
      '🔮 Your guidance is waiting on the website.',
    ],
    cta: 'Message Dekho',
    whatsapp:
      '✨ Aaj Universe tumse kuch kehna chahta hai... Bas 3 Tarot Cards choose karo aur dekho aaj tumhare liye kya message aaya hai. 🔮 Your guidance is waiting.',
  },
  {
    id: 'daily-energy',
    theme: 'energy',
    emailSubject: '🌙 Aaj ke Tarot Messages miss mat karo',
    headline: '🌙 Har din ki energy alag hoti hai.',
    body: [
      'Aaj ke Tarot Messages miss mat karo.',
      '🃏 3 Cards choose karo aur apna answer dekho.',
    ],
    cta: '3 Cards Choose Karo',
    whatsapp:
      '🌙 Har din ki energy alag hoti hai. Aaj ke Tarot Messages miss mat karo. 🃏 3 Cards choose karo aur apna answer dekho.',
  },
  {
    id: 'love-thinking',
    theme: 'love',
    emailSubject: '❤️ Kya woh tumhare baare mein soch raha/rahi hai?',
    headline: '❤️ Kya woh tumhare baare mein soch raha/rahi hai?',
    body: [
      'Aaj ke Tarot Cards shayad tumhe wahi answer de dein jo tum dhoond rahe ho.',
      '🃏 Visit the website & choose your cards.',
    ],
    cta: 'Cards Choose Karo',
    whatsapp:
      '❤️ Kya woh tumhare baare mein soch raha/rahi hai? Aaj ke Tarot Cards shayad tumhe wahi answer de dein jo tum dhoond rahe ho. 🃏 Choose your cards on the website.',
  },
  {
    id: 'sign-waiting',
    theme: 'universe',
    emailSubject: '🔮 Jis sign ka wait kar rahe the... shayad aaj mil jaye',
    headline: '🔮 Kabhi kabhi ek chhota sa sign sab kuch badal deta hai.',
    body: [
      'Jis sign ka tum wait kar rahe the, ho sakta hai woh aaj ke cards mein chhupa ho.',
      'Sirf 1 minute lagega. 3 cards, ek answer.',
    ],
    cta: 'Apna Sign Dekho',
    whatsapp:
      '🔮 Kabhi kabhi ek chhota sa sign sab kuch badal deta hai. Jis sign ka tum wait kar rahe the, ho sakta hai woh aaj ke cards mein ho. Sirf 1 minute — 3 cards, ek answer.',
  },
  {
    id: 'love-clarity',
    theme: 'love',
    emailSubject: '💌 Rishtey mein confusion? Cards se clarity lo',
    headline: '💌 Dil mein sawaal hai... par jawab nahi mil raha?',
    body: [
      'Pyaar ke maamle mein cards aksar woh keh dete hain jo koi aur nahi kehta.',
      'Aaj ke 3 cards tumhare liye kya kehte hain — dekho.',
    ],
    cta: 'Love Reading Lo',
    whatsapp:
      '💌 Dil mein sawaal hai... par jawab nahi mil raha? Pyaar ke maamle mein cards woh keh dete hain jo koi aur nahi kehta. Aaj ke 3 cards dekho website pe.',
  },
  {
    id: 'career-move',
    theme: 'career',
    emailSubject: '💼 Career ka agla step? Universe ka hint aaj hai',
    headline: '💼 Job, growth, ya naya start — soch rahe ho na?',
    body: [
      'Aaj ke cards mein tumhare career ke liye ek clear hint ho sakta hai.',
      '3 cards choose karo aur apni direction dekho.',
    ],
    cta: 'Career Guidance Dekho',
    whatsapp:
      '💼 Job, growth, ya naya start — soch rahe ho na? Aaj ke cards mein tumhare career ke liye ek clear hint ho sakta hai. 🃏 3 cards choose karo.',
  },
  {
    id: 'new-morning',
    theme: 'energy',
    emailSubject: '🌅 Nayi subah, nayi energy — aaj ka message ready hai',
    headline: '🌅 Har subah ek naya message lekar aati hai.',
    body: [
      'Aaj ki energy tumhare favour mein hai ya against — jaanna nahi chahoge?',
      'Tumhara daily tarot message website pe wait kar raha hai.',
    ],
    cta: 'Aaj Ka Message Dekho',
    whatsapp:
      '🌅 Har subah ek naya message lekar aati hai. Aaj ki energy tumhare favour mein hai ya against — jaanna nahi chahoge? Tumhara daily message wait kar raha hai. 🔮',
  },
  {
    id: 'moon-shift',
    theme: 'moon',
    emailSubject: '🌙 Aaj raat energy shift ho rahi hai...',
    headline: '🌙 Energy shift ho rahi hai — feel kar rahe ho?',
    body: [
      'Jab energy badalti hai, tab cards sabse zyada bolte hain.',
      'Aaj ka message especially strong hai. Miss mat karna.',
    ],
    cta: 'Cards Kholo',
    whatsapp:
      '🌙 Energy shift ho rahi hai — feel kar rahe ho? Jab energy badalti hai, tab cards sabse zyada bolte hain. Aaj ka message strong hai, miss mat karna. 🃏',
  },
  {
    id: 'money-flow',
    theme: 'money',
    emailSubject: '💰 Paisa aane ka rasta cards mein dikh raha hai?',
    headline: '💰 Money blocks ya money flow?',
    body: [
      'Aaj ke cards batayenge ki abundance tumhari taraf aa raha hai ya kuch rok raha hai.',
      '3 cards. 1 minute. Clear answer.',
    ],
    cta: 'Abundance Check Karo',
    whatsapp:
      '💰 Money blocks ya money flow? Aaj ke cards batayenge ki abundance tumhari taraf aa raha hai ya kuch rok raha hai. 3 cards, 1 minute, clear answer. 🔮',
  },
  {
    id: 'someone-energy',
    theme: 'love',
    emailSubject: '👀 Kisi ki energy aaj tumhare aas paas hai...',
    headline: '👀 Kisi ki energy aaj tumhare aas paas hai...',
    body: [
      'Ho sakta hai koi tumhe yaad kar raha ho. Cards se pucho kaun.',
      'Aaj ki reading kuch interesting reveal kar sakti hai.',
    ],
    cta: 'Reveal Karo',
    whatsapp:
      '👀 Kisi ki energy aaj tumhare aas paas hai... Ho sakta hai koi tumhe yaad kar raha ho. Cards se pucho kaun. 🃏 Aaj ki reading dekho website pe.',
  },
  {
    id: 'stuck-feeling',
    theme: 'general',
    emailSubject: '🃏 Stuck feel kar rahe ho? Ye message tumhare liye hai',
    headline: '🃏 Kabhi kabhi bas ek nudge chahiye hota hai.',
    body: [
      'Agar tum kisi decision pe atke ho, aaj ke cards tumhe woh nudge de sakte hain.',
      'Universe ka timing perfect hota hai. Shayad aaj tumhara din hai.',
    ],
    cta: 'Apna Nudge Lo',
    whatsapp:
      '🃏 Kabhi kabhi bas ek nudge chahiye hota hai. Agar tum kisi decision pe atke ho, aaj ke cards tumhe woh nudge de sakte hain. Universe ka timing perfect hai. ✨',
  },
  {
    id: 'unread-message',
    theme: 'universe',
    emailSubject: '📩 Tumhara aaj ka message abhi tak unread hai...',
    headline: '📩 Tumhara aaj ka message abhi tak unread hai.',
    body: [
      'Universe ne bheja hai, tumne dekha nahi. 😌',
      '3 cards choose karo aur apna message unlock karo.',
    ],
    cta: 'Message Unlock Karo',
    whatsapp:
      '📩 Tumhara aaj ka message abhi tak unread hai. Universe ne bheja hai, tumne dekha nahi. 😌 3 cards choose karo aur apna message unlock karo.',
  },
  {
    id: 'love-return',
    theme: 'love',
    emailSubject: '❤️ Kya woh wapas aayega/aayegi? Cards jawab denge',
    headline: '❤️ Kuch sawaal sirf cards hi answer kar sakte hain.',
    body: [
      '"Kya woh wapas aayega?" "Kya usse baat karni chahiye?"',
      'Aaj ki love reading mein tumhara jawab ho sakta hai.',
    ],
    cta: 'Love Reading Kholo',
    whatsapp:
      '❤️ Kuch sawaal sirf cards hi answer kar sakte hain. "Kya woh wapas aayega?" "Kya usse baat karni chahiye?" Aaj ki love reading mein tumhara jawab ho sakta hai. 🃏',
  },
  {
    id: 'three-cards-ritual',
    theme: 'general',
    emailSubject: '☕ Chai + 3 Tarot Cards = perfect morning ritual',
    headline: '☕ Aaj ka ritual: Chai, 2 minute, aur 3 cards.',
    body: [
      'Din shuru karne se pehle jaan lo aaj ki energy kya keh rahi hai.',
      'Thousands log roz apne cards choose karte hain. Tumhare cards ready hain.',
    ],
    cta: 'Ritual Shuru Karo',
    whatsapp:
      '☕ Aaj ka ritual: Chai, 2 minute, aur 3 cards. Din shuru karne se pehle jaan lo aaj ki energy kya keh rahi hai. Tumhare cards ready hain. 🔮',
  },
  {
    id: 'warning-or-blessing',
    theme: 'energy',
    emailSubject: '⚡ Aaj ka card: warning ya blessing?',
    headline: '⚡ Aaj ke cards mein warning bhi ho sakti hai, blessing bhi.',
    body: [
      'Dono cases mein — jaanna better hai, guess karna nahi.',
      'Apne 3 cards kholo aur clear ho jao.',
    ],
    cta: 'Abhi Check Karo',
    whatsapp:
      '⚡ Aaj ke cards mein warning bhi ho sakti hai, blessing bhi. Dono cases mein jaanna better hai, guess karna nahi. Apne 3 cards kholo. 🃏',
  },
  {
    id: 'manifestation-day',
    theme: 'universe',
    emailSubject: '🌟 Manifestation ke liye aaj ka din strong hai',
    headline: '🌟 Jo maang rahe ho, woh raste mein hai.',
    body: [
      'Aaj ki energy manifestation ke liye especially strong hai.',
      'Cards se pucho: tumhara wish kitna kareeb hai?',
    ],
    cta: 'Cards Se Pucho',
    whatsapp:
      '🌟 Jo maang rahe ho, woh raste mein hai. Aaj ki energy manifestation ke liye strong hai. Cards se pucho: tumhara wish kitna kareeb hai? ✨',
  },
  {
    id: 'ignore-signs',
    theme: 'general',
    emailSubject: '🚪 Universe ke signs ignore mat karo...',
    headline: '🚪 Signs har jagah hain. Tum dekh nahi rahe.',
    body: [
      'Repeated numbers? Ajeeb dreams? Kisi ka naam baar baar aana?',
      'Aaj ke cards in signs ka matlab decode kar sakte hain.',
    ],
    cta: 'Signs Decode Karo',
    whatsapp:
      '🚪 Signs har jagah hain. Tum dekh nahi rahe. Repeated numbers? Ajeeb dreams? Aaj ke cards in signs ka matlab decode kar sakte hain. 🔮',
  },
  {
    id: 'career-recognition',
    theme: 'career',
    emailSubject: '💼 Mehnat ka fal kab milega? Aaj ke cards mein jawab',
    headline: '💼 Itni mehnat kar rahe ho... recognition kab?',
    body: [
      'Aaj ke career cards batayenge ki tumhara time kab aa raha hai.',
      'Promotion, switch, ya patience — dekho cards kya kehte hain.',
    ],
    cta: 'Career Cards Dekho',
    whatsapp:
      '💼 Itni mehnat kar rahe ho... recognition kab? Aaj ke career cards batayenge ki tumhara time kab aa raha hai. 🃏 Dekho cards kya kehte hain.',
  },
  {
    id: 'tonight-different',
    theme: 'moon',
    emailSubject: '🌌 Aaj ki raat kuch alag hai...',
    headline: '🌌 Aaj ki raat kuch alag hai.',
    body: [
      'Aisi raatein saal mein kam hi aati hain jab intuition itna strong hota hai.',
      'Apne cards abhi kholo — jo feel ho raha hai, woh sach ho sakta hai.',
    ],
    cta: 'Cards Kholo',
    whatsapp:
      '🌌 Aaj ki raat kuch alag hai. Aisi raatein kam aati hain jab intuition itna strong hota hai. Apne cards abhi kholo — jo feel ho raha hai, woh sach ho sakta hai. 🌙',
  },
  {
    id: 'ex-energy',
    theme: 'love',
    emailSubject: '💔 Purani yaadein wapas aa rahi hain? Ye coincidence nahi',
    headline: '💔 Purani yaadein wapas aa rahi hain?',
    body: [
      'Jab koi purana connection energy mein wapas aata hai, cards usse sabse pehle pakadte hain.',
      'Aaj ki reading tumhe bata sakti hai: closure ya comeback?',
    ],
    cta: 'Sach Jaano',
    whatsapp:
      '💔 Purani yaadein wapas aa rahi hain? Ye coincidence nahi. Aaj ki reading bata sakti hai: closure ya comeback? 🃏 Cards choose karo website pe.',
  },
  {
    id: 'lucky-day',
    theme: 'energy',
    emailSubject: '🍀 Aaj tumhara lucky day ho sakta hai — confirm karo',
    headline: '🍀 Kuch log aaj bahut lucky rahenge. Tum unme se ho?',
    body: [
      'Aaj ki cosmic energy kuch logon ke liye doors khol rahi hai.',
      '3 cards choose karo aur dekho tumhare liye kya khul raha hai.',
    ],
    cta: 'Luck Check Karo',
    whatsapp:
      '🍀 Kuch log aaj bahut lucky rahenge. Tum unme se ho? Aaj ki energy kuch logon ke liye doors khol rahi hai. 3 cards choose karo aur dekho. ✨',
  },
  {
    id: 'overthinking',
    theme: 'general',
    emailSubject: '🧠 Overthinking band. Cards se seedha jawab lo.',
    headline: '🧠 Raat ko neend nahi aa rahi us sawaal ki wajah se?',
    body: [
      'Jo baat dimaag mein ghoom rahi hai, usse cards pe chhod do.',
      'Aaj ka spread tumhe woh clarity de sakta hai jo overthinking kabhi nahi degi.',
    ],
    cta: 'Clarity Lo',
    whatsapp:
      '🧠 Raat ko neend nahi aa rahi us sawaal ki wajah se? Jo baat dimaag mein ghoom rahi hai, usse cards pe chhod do. Aaj ka spread clarity de sakta hai. 🔮',
  },
  {
    id: 'new-week-energy',
    theme: 'energy',
    emailSubject: '📅 Is hafte ki energy ka preview ready hai',
    headline: '📅 Naya hafta, nayi possibilities.',
    body: [
      'Is week tumhare liye kya likha hai — pyaar, paisa, ya pareshani?',
      'Cards se week ka preview lo aur prepared raho.',
    ],
    cta: 'Week Preview Dekho',
    whatsapp:
      '📅 Naya hafta, nayi possibilities. Is week tumhare liye kya likha hai — pyaar, paisa, ya pareshani? Cards se preview lo aur prepared raho. 🃏',
  },
  {
    id: 'secret-admirer',
    theme: 'love',
    emailSubject: '🤫 Koi hai jo tumhe chupke se pasand karta hai?',
    headline: '🤫 Cards kabhi kabhi woh reveal karte hain jo log chhupate hain.',
    body: [
      'Aaj ki reading mein ek surprise ho sakta hai.',
      'Himmat hai toh 3 cards kholo. 😉',
    ],
    cta: 'Surprise Dekho',
    whatsapp:
      '🤫 Cards kabhi kabhi woh reveal karte hain jo log chhupate hain. Aaj ki reading mein ek surprise ho sakta hai. Himmat hai toh 3 cards kholo. 😉',
  },
  {
    id: 'blocked-energy',
    theme: 'energy',
    emailSubject: '🔒 Kuch tumhe rok raha hai — jaano kya',
    headline: '🔒 Mehsoos hota hai na, ki kuch aage badhne nahi de raha?',
    body: [
      'Blocked energy ka pata lagana pehla step hai usse hatane ka.',
      'Aaj ke cards batayenge tumhe kya rok raha hai.',
    ],
    cta: 'Block Hatao',
    whatsapp:
      '🔒 Mehsoos hota hai na, ki kuch aage badhne nahi de raha? Aaj ke cards batayenge tumhe kya rok raha hai. Block hatao, aage badho. 🃏',
  },
  {
    id: 'decision-time',
    theme: 'general',
    emailSubject: '⚖️ Haan ya na? Aaj ke cards decide karne mein help karenge',
    headline: '⚖️ Woh decision jo tum taal rahe ho...',
    body: [
      'Universe already jaanta hai tumhare liye kya sahi hai.',
      '3 cards kholo aur apna jawab pao — haan ya na.',
    ],
    cta: 'Decision Lo',
    whatsapp:
      '⚖️ Woh decision jo tum taal rahe ho... Universe already jaanta hai tumhare liye kya sahi hai. 3 cards kholo aur apna jawab pao. 🔮',
  },
  {
    id: 'energy-protection',
    theme: 'energy',
    emailSubject: '🧿 Aaj negative energy se bachke rehna — cards ne bataya',
    headline: '🧿 Har din sab ka nahi hota. Aaj sambhal ke.',
    body: [
      'Aaj ke cards mein protection ka message strong hai.',
      'Dekho kis cheez se door rehna hai aur kya avoid karna hai.',
    ],
    cta: 'Protection Message Dekho',
    whatsapp:
      '🧿 Har din sab ka nahi hota. Aaj sambhal ke. Cards mein protection ka message strong hai — dekho kis cheez se door rehna hai. 🃏',
  },
  {
    id: 'gratitude-shift',
    theme: 'universe',
    emailSubject: '🙏 Universe tumhe kuch dena chahta hai — ready ho?',
    headline: '🙏 Jo tumne maanga tha, uska jawab aa raha hai.',
    body: [
      'Kabhi kabhi blessings unexpected form mein aati hain.',
      'Aaj ke cards batayenge ki tumhare liye kya aa raha hai.',
    ],
    cta: 'Blessing Dekho',
    whatsapp:
      '🙏 Jo tumne maanga tha, uska jawab aa raha hai. Kabhi kabhi blessings unexpected form mein aati hain. Aaj ke cards dekho. ✨',
  },
  {
    id: 'last-chance-fomo',
    theme: 'general',
    emailSubject: '⏳ Aaj ka message sirf aaj ke liye hai',
    headline: '⏳ Kal ye message kuch aur hoga.',
    body: [
      'Har din ke cards sirf us din ki energy ke liye hote hain.',
      'Aaj ka message aaj hi dekho — kal late ho jayega.',
    ],
    cta: 'Abhi Dekho',
    whatsapp:
      '⏳ Kal ye message kuch aur hoga. Har din ke cards sirf us din ki energy ke liye hote hain. Aaj ka message aaj hi dekho. 🔮',
  },
];

/**
 * Days-since-epoch for the given instant in IST (UTC+5:30), so the "day"
 * rolls over at midnight India time regardless of server timezone.
 */
export function istDayNumber(date: Date = new Date()): number {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  return Math.floor((date.getTime() + IST_OFFSET_MS) / 86_400_000);
}

/** YYYY-MM-DD in IST — used as the dedupe key so we never double-send a day. */
export function istDateString(date: Date = new Date()): string {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  return new Date(date.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** Deterministically pick today's message (rotates through the whole bank). */
export function pickDailyMessage(date: Date = new Date()): DailyMessage {
  return DAILY_MESSAGES[istDayNumber(date) % DAILY_MESSAGES.length];
}
