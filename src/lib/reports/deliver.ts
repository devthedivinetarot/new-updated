/**
 * Report delivery: build the PDF and email it (Resend), plus order emails.
 * Env: RESEND_API_KEY, RESEND_FROM_EMAIL, REPORT_ADMIN_EMAIL.
 */
import { generateReport, TOPICS, PLANS } from './generate';
import { renderReportPdf } from './pdf';
import type { ReportOrder } from './orders';
import type { Lang } from './i18n';

const ADMIN = () => process.env.REPORT_ADMIN_EMAIL || 'dev.thedivinetarot111@gmail.com';
const FROM = () => process.env.RESEND_FROM_EMAIL || 'The Divine Tarot <hello@thedivinetarotonline.com>';

const esc = (s: string) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

async function sendEmail(msg: {
  to: string | string[]; subject: string; html: string; bcc?: string[];
  attachments?: { filename: string; content: string }[];
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch(`${process.env.RESEND_API_BASE || 'https://api.resend.com'}/emails`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM(), ...msg }),
    signal: AbortSignal.timeout(25_000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

const shell = (body: string) => `<!doctype html><html><body style="margin:0;background:#f6f1fb;font-family:Arial,'Noto Sans Devanagari',sans-serif;color:#2a2140">
<div style="max-width:560px;margin:0 auto;padding:28px 20px">
<div style="text-align:center;color:#b8892d;letter-spacing:.3em;font-size:12px;font-weight:bold">THE DIVINE TAROT</div>
<div style="background:#fff;border-radius:12px;padding:24px;margin-top:14px;line-height:1.6;font-size:15px">${body}</div>
<p style="text-align:center;font-size:12px;color:#8a809c;margin-top:16px">thedivinetarotonline.com</p>
</div></body></html>`;

const T: Record<Lang, {
  readySubject: string; ready: (name: string, topic: string) => string;
  confirmSubject: string; confirm: (name: string, topic: string, due: string) => string;
}> = {
  en: {
    readySubject: 'Your Divine Tarot Report is here ✨',
    ready: (n, t) => `<p>Dear ${n},</p><p>Your <b>${t}</b> report is attached as a PDF. Read each month before it begins, and use the guidance at the end of the report.</p><p>With blessings,<br/>The Divine Tarot</p>`,
    confirmSubject: 'Order confirmed — The Divine Tarot report',
    confirm: (n, t, d) => `<p>Dear ${n},</p><p>Thank you! Your payment is confirmed. Your <b>${t}</b> report is being prepared and will be emailed to you as a PDF on <b>${d}</b>.</p><p>Please check your spam/promotions folder on that day if you don't see it.</p><p>With blessings,<br/>The Divine Tarot</p>`,
  },
  hi: {
    readySubject: 'आपकी डिवाइन टैरो रिपोर्ट आ गई है ✨',
    ready: (n, t) => `<p>प्रिय ${n},</p><p>आपकी <b>${t}</b> रिपोर्ट PDF के रूप में संलग्न है। हर महीने को उसके शुरू होने से पहले पढ़ें और रिपोर्ट के अंत में दिए दिशानिर्देशों का पालन करें।</p><p>शुभकामनाओं सहित,<br/>द डिवाइन टैरो</p>`,
    confirmSubject: 'ऑर्डर कन्फ़र्म — द डिवाइन टैरो रिपोर्ट',
    confirm: (n, t, d) => `<p>प्रिय ${n},</p><p>धन्यवाद! आपका भुगतान कन्फ़र्म हो गया है। आपकी <b>${t}</b> रिपोर्ट तैयार की जा रही है और <b>${d}</b> को PDF के रूप में ईमेल की जाएगी।</p><p>उस दिन ईमेल न दिखे तो कृपया स्पैम/प्रमोशन फ़ोल्डर देखें।</p><p>शुभकामनाओं सहित,<br/>द डिवाइन टैरो</p>`,
  },
  hinglish: {
    readySubject: 'Aapki Divine Tarot Report aa gayi hai ✨',
    ready: (n, t) => `<p>Dear ${n},</p><p>Aapki <b>${t}</b> report PDF mein attached hai. Har month ko shuru hone se pehle padhein aur report ke end mein di gayi guidelines follow karein.</p><p>Blessings ke saath,<br/>The Divine Tarot</p>`,
    confirmSubject: 'Order confirmed — The Divine Tarot report',
    confirm: (n, t, d) => `<p>Dear ${n},</p><p>Thank you! Aapka payment confirm ho gaya hai. Aapki <b>${t}</b> report taiyaar ho rahi hai aur <b>${d}</b> ko PDF ke roop mein email ki jayegi.</p><p>Us din email na dikhe toh spam/promotions folder check karein.</p><p>Blessings ke saath,<br/>The Divine Tarot</p>`,
  },
};

export const formatDue = (iso: string) =>
  new Date(`${iso}T12:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

const topicLabel = (o: ReportOrder) => TOPICS.find((t) => t.id === o.topic)!.label[o.lang];

/** Generate the PDF and email it to the customer (admin in BCC). Throws on failure. */
export async function deliverReport(o: ReportOrder): Promise<void> {
  const report = generateReport({ topic: o.topic, lang: o.lang, name: o.name, partner: o.partner, year: o.year, cardIds: o.cardIds });
  const pdf = await renderReportPdf(report);
  const t = T[o.lang];
  const file = `Divine-Tarot-${o.year}-${o.name}`.replace(/[^\w\-]+/g, '-').replace(/-+/g, '-') + '.pdf';
  await sendEmail({
    to: o.email,
    bcc: [ADMIN()],
    subject: t.readySubject,
    html: shell(t.ready(esc(o.name), esc(topicLabel(o)))),
    attachments: [{ filename: file, content: pdf.toString('base64') }],
  });
}

/** Customer confirmation + admin "new order" notice after payment. Non-throwing. */
export async function sendOrderEmails(o: ReportOrder): Promise<void> {
  const t = T[o.lang];
  const due = o.dueDate ? formatDue(o.dueDate) : '';
  const plan = PLANS[o.plan];
  const rows: [string, string][] = [
    ['Order ID', o.orderId], ['Payment ID', o.paymentId || (o.coupon ? 'Coupon (free)' : '')],
    ['Plan', `₹${plan.rupees} — ${plan.days} days`], ['Topic', TOPICS.find((x) => x.id === o.topic)!.label.en],
    ['Language', o.lang], ['Year', String(o.year)], ['Name', o.name], ['Partner', o.partner || '—'],
    ['Email', o.email], ['WhatsApp', o.whatsapp], ['DOB', o.dob], ['Delivery date', due],
  ];
  const adminHtml = shell(`<p><b>New tarot report order</b></p><table style="border-collapse:collapse;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6b6280">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`).join('')}</table>`);
  const jobs: Promise<void>[] = [
    sendEmail({ to: ADMIN(), subject: `New report order — ₹${plan.rupees} — ${o.name}`, html: adminHtml }),
  ];
  if (!o.coupon && due) {
    jobs.push(sendEmail({ to: o.email, subject: t.confirmSubject, html: shell(t.confirm(esc(o.name), esc(topicLabel(o)), due)) }));
  }
  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === 'rejected' && console.error('[tarot-report] order email failed', r.reason));
}
