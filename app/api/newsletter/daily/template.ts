import { CARDS, PROMO, type Card } from './content';

export type IssueDay = 'mon' | 'wed' | 'fri';

const SITE = 'https://thedivinetarotonline.com';
const READING_URL = 'https://reading.thedivinetarotonline.com/';
const PREMIUM_URL = 'https://thedivinetarotonline.com/premium';

// Current date in IST as YYYY-MM-DD and weekday (0 = Sunday)
export function istNow(date = new Date()) {
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return { ymd: ist.toISOString().slice(0, 10), weekday: ist.getUTCDay(), ms: ist.getTime() };
}

export function issueDayFor(weekday: number): IssueDay | null {
  if (weekday === 1) return 'mon';
  if (weekday === 3) return 'wed';
  if (weekday === 5) return 'fri';
  return null;
}

// Each slot cycles through all 22 cards, and the three cards in the same week are always different.
export function cardFor(day: IssueDay, date = new Date()): Card {
  const weekIndex = Math.floor(istNow(date).ms / (7 * 24 * 60 * 60 * 1000));
  const offset = day === 'mon' ? 0 : day === 'wed' ? 7 : 14;
  return CARDS[(weekIndex + offset) % CARDS.length];
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function button(label: string, url: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td style="background:#f59e0b;border-radius:8px">
    <a href="${url}" style="display:inline-block;padding:13px 24px;color:#000;font-weight:bold;text-decoration:none;font-family:Arial,sans-serif;font-size:15px">${esc(label)}</a>
  </td></tr></table>`;
}

function layout(opts: { preheader: string; badge: string; card: Card; body: string; unsubscribeUrl: string }) {
  const { preheader, badge, card, body, unsubscribeUrl } = opts;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f1fb">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1fb;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden">
  <tr><td style="background:#0B0B0F;padding:22px 28px" align="center">
    <img src="${SITE}/logo.png" width="44" height="44" alt="The Divine Tarot" style="display:block;margin:0 auto 8px">
    <div style="color:#f5d27a;font-family:Georgia,serif;font-size:18px;letter-spacing:1px">The Divine Tarot</div>
    <div style="color:#a1a1aa;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-top:4px">${esc(badge)}</div>
  </td></tr>
  <tr><td style="padding:28px;font-family:Georgia,serif;color:#1f1f2e;font-size:16px;line-height:1.65">
    <p style="margin:0 0 18px">Namaste 🙏</p>
    <div style="text-align:center;margin:8px 0 22px">
      <div style="font-size:44px;line-height:1">${card.emoji}</div>
      <div style="font-size:24px;font-weight:bold;color:#4c1d95;margin-top:8px">${esc(card.name)}</div>
      <div style="font-family:Arial,sans-serif;font-size:12px;color:#b45309;letter-spacing:2px;text-transform:uppercase;margin-top:4px">${esc(card.keyword)}</div>
    </div>
    ${body}
    <div style="background:#faf5ff;border-left:4px solid #7c3aed;padding:14px 16px;border-radius:6px;margin:24px 0;font-style:italic">
      ✨ Affirmation: “${esc(card.affirmation)}”
    </div>
    <p style="margin:24px 0 0">With love,<br>The Divine Tarot</p>
  </td></tr>
  <tr><td style="padding:18px 28px;background:#faf9fd;font-family:Arial,sans-serif;font-size:12px;color:#71717a;line-height:1.6" align="center">
    Ye email aapko isliye mila kyunki aapne <a href="${SITE}" style="color:#7c3aed">thedivinetarotonline.com</a> par subscribe kiya.<br>
    <a href="${unsubscribeUrl}" style="color:#71717a">Unsubscribe</a>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export function buildIssue(day: IssueDay, opts: { date?: Date; unsubscribeUrl?: string } = {}) {
  const date = opts.date ?? new Date();
  const unsubscribeUrl = opts.unsubscribeUrl ?? '{{{RESEND_UNSUBSCRIBE_URL}}}';
  const card = cardFor(day, date);
  const p = (t: string) => `<p style="margin:0 0 16px">${esc(t)}</p>`;

  if (day === 'mon') {
    return {
      subject: `${card.emoji} Is hafte ki energy: ${card.name}`,
      body: layout({
        preheader: `${card.keyword}: aapke hafte ke liye cards ka message`,
        badge: 'Hafte ki Energy',
        card,
        unsubscribeUrl,
        body: p(card.message) + p('Is hafte jab bhi confusion ho, is card ko yaad kijiye.') +
          button('Apna personal sawaal poochiye →', READING_URL),
      }),
    };
  }

  if (day === 'wed') {
    return {
      subject: `💞 Love & Rishte: ${card.name} kya keh raha hai?`,
      body: layout({
        preheader: `Pyaar aur rishton ke liye is hafte ka message`,
        badge: 'Love & Rishte',
        card,
        unsubscribeUrl,
        body: p(card.love) + p('Kisi khaas insaan ke baare mein sawaal hai? Cards se poochiye.') +
          button('Love reading lo →', READING_URL),
      }),
    };
  }

  // Friday: career + promo (if active) or Premium
  const today = istNow(date).ymd;
  const promo = PROMO && today <= PROMO.showUntil ? PROMO : null;
  const promoBlock = promo
    ? `<div style="border:1px solid #fde68a;background:#fffbeb;border-radius:10px;padding:18px;margin:24px 0">
         <div style="font-weight:bold;font-size:17px;margin-bottom:6px">${esc(promo.title)}</div>
         <div style="font-size:15px">${esc(promo.text)}</div>
         ${button(promo.ctaLabel, promo.ctaUrl)}
       </div>`
    : `<div style="border:1px solid #ddd6fe;background:#faf5ff;border-radius:10px;padding:18px;margin:24px 0">
         <div style="font-weight:bold;font-size:17px;margin-bottom:6px">🔮 Premium: ₹199/month</div>
         <div style="font-size:15px">Unlimited readings aur Ginni se unlimited baatein. Jab bhi dil kare, jawab paaiye.</div>
         ${button('Premium dekhiye →', PREMIUM_URL)}
       </div>`;

  return {
    subject: `💼 Career & Paisa: ${card.name} ka message`,
    body: layout({
      preheader: `Kaam, career aur paise ke liye cards ki guidance`,
      badge: 'Career & Paisa',
      card,
      unsubscribeUrl,
      body: p(card.career) + promoBlock,
    }),
  };
}
