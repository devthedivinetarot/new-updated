import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'The Divine Tarot <hello@news.thedivinetarotonline.com>';

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'newsletter subscribe' });
}

export async function POST(req: Request) {
  const { email, whatsapp } = await req.json().catch(() => ({}));
  const clean = String(email || '').toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return NextResponse.json({ error: 'Sahi email daalo' }, { status: 400 });
  }

  const { error } = await resend.contacts.create({
    email: clean,
    unsubscribed: false,
    segments: [{ id: process.env.RESEND_SEGMENT_NEWSLETTER! }],
    topics: [
      { id: process.env.RESEND_TOPIC_DAILY!, subscription: 'opt_in' },
      { id: process.env.RESEND_TOPIC_COURSES!, subscription: 'opt_in' },
      { id: process.env.RESEND_TOPIC_OFFERS!, subscription: 'opt_in' },
    ],
    ...(whatsapp ? { properties: { whatsapp: String(whatsapp) } } : {}),
  });

  // An already-subscribed email counts as success; any other error is a real failure
  if (error && !/exist/i.test(error.message)) {
    console.error('Resend contact error', error);
    return NextResponse.json({ error: 'Kuch gadbad hui, dobara try karo' }, { status: 500 });
  }

  if (!error) {
    await resend.emails.send({
      from: FROM,
      to: clean,
      replyTo: 'dev.thedivinetarot111@gmail.com',
      subject: 'Welcome to The Divine Tarot ✨',
      html: `<p>Namaste 🙏</p><p>Ab aapko roz ka Divine Insight milega...</p>
             <p><a href="https://reading.thedivinetarotonline.com/">Aaj ki free reading lo →</a></p>`,
    });
  }

  return NextResponse.json({ ok: true });
}
