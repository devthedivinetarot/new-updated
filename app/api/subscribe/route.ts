import { NextResponse } from 'next/server';

// Talks to Resend's REST API directly with fetch, so no 'resend' npm package is needed.
const RESEND_API = 'https://api.resend.com';
const FROM = 'The Divine Tarot <hello@news.thedivinetarotonline.com>';
const REPLY_TO = 'dev.thedivinetarot111@gmail.com';

async function resend(path: string, body: unknown) {
  const res = await fetch(`${RESEND_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'newsletter subscribe' });
}

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return NextResponse.json({ error: 'Newsletter abhi available nahi hai. Thodi der baad try karo.' }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const email = String(body.email || '').toLowerCase().trim();
  const whatsapp = body.whatsapp ? String(body.whatsapp).trim() : '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
  }

  const topics = [
    process.env.RESEND_TOPIC_DAILY,
    process.env.RESEND_TOPIC_COURSES,
    process.env.RESEND_TOPIC_OFFERS,
  ]
    .filter(Boolean)
    .map((id) => ({ id, subscription: 'opt_in' }));

  const contact = await resend('/contacts', {
    email,
    unsubscribed: false,
    ...(process.env.RESEND_SEGMENT_NEWSLETTER
      ? { segments: [{ id: process.env.RESEND_SEGMENT_NEWSLETTER }] }
      : {}),
    ...(topics.length ? { topics } : {}),
    ...(whatsapp ? { properties: { whatsapp } } : {}),
  });

  const message = String(contact.data?.message || '');
  const alreadyExists = contact.status === 409 || /exist/i.test(message);

  if (!contact.ok && !alreadyExists) {
    console.error('Resend contact error', contact.status, contact.data);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  // Welcome email only for new subscribers. A failure here shouldn't block the signup.
  if (contact.ok) {
    const welcome = await resend('/emails', {
      from: FROM,
      to: [email],
      reply_to: REPLY_TO,
      subject: 'Welcome to The Divine Tarot ✨',
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;color:#1f1f2e">
          <p>Namaste 🙏</p>
          <p>The Divine Tarot family mein aapka swagat hai. Ab aapko regular Divine Insights milenge — cards ka message, upcoming courses aur special offers.</p>
          <p style="margin:28px 0">
            <a href="https://reading.thedivinetarotonline.com/" style="background:#f59e0b;color:#000;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold">Aaj ki free reading lo →</a>
          </p>
          <p>With love,<br/>The Divine Tarot</p>
        </div>`,
    });
    if (!welcome.ok) console.error('Resend welcome email error', welcome.status, welcome.data);
  }

  return NextResponse.json({ ok: true });
}
