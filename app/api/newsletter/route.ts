import { NextResponse } from 'next/server';
import { buildIssue, istNow, issueDayFor, type IssueDay } from './template';

export const dynamic = 'force-dynamic';

const FROM = 'The Divine Tarot <hello@news.thedivinetarotonline.com>';
const REPLY_TO = 'dev.thedivinetarot111@gmail.com';


async function resend(path: string, body: unknown) {
  const res = await fetch(`https://api.resend.com${path}`, {
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

/**
 * Automatic newsletter: Vercel Cron calls this on Mon, Wed and Fri mornings.
 *
 * Manual use (replace SECRET with your CRON_SECRET):
 *   Preview in browser:    /api/cron/newsletter?key=SECRET&day=mon&preview=1
 *   Send test to one email: /api/cron/newsletter?key=SECRET&day=wed&test=you@gmail.com
 *   Force a real send:     /api/cron/newsletter?key=SECRET&day=fri&confirm=send
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const url = new URL(req.url);
  const fromCron = !!secret && req.headers.get('authorization') === `Bearer ${secret}`;
  const fromKey = !!secret && url.searchParams.get('key') === secret;

  if (!fromCron && !fromKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const forcedDay = url.searchParams.get('day') as IssueDay | null;
  const day: IssueDay | null =
    forcedDay && ['mon', 'wed', 'fri'].includes(forcedDay) ? forcedDay : issueDayFor(istNow().weekday);

  if (!day) {
    return NextResponse.json({ ok: true, skipped: 'Not a newsletter day (Mon/Wed/Fri IST)' });
  }

  // 1) Preview: returns the email as a web page, sends nothing
  if (url.searchParams.get('preview') === '1') {
    const { subject, body } = buildIssue(day, { unsubscribeUrl: '#' });
    const bar = `<div style="font-family:Arial,sans-serif;background:#111;color:#fff;padding:10px 16px;font-size:14px">Subject: ${subject.replace(/</g, '&lt;')}</div>`;
    return new NextResponse(body.replace(/<body([^>]*)>/, `<body$1>${bar}`), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_SEGMENT_NEWSLETTER) {
    console.error('Newsletter: RESEND_API_KEY or RESEND_SEGMENT_NEWSLETTER missing');
    return NextResponse.json({ error: 'Missing Resend env vars' }, { status: 500 });
  }

  // 2) Test: sends one copy to the given address only
  const testTo = url.searchParams.get('test');
  if (testTo) {
    const { subject, body } = buildIssue(day, { unsubscribeUrl: 'https://thedivinetarotonline.com' });
    const r = await resend('/emails', { from: FROM, to: [testTo], reply_to: REPLY_TO, subject: `[TEST] ${subject}`, html: body });
    return NextResponse.json({ ok: r.ok, test: true, day, subject, resend: r.data }, { status: r.ok ? 200 : 500 });
  }

  // 3) Real send to all subscribers. Manual calls must add confirm=send so nobody blasts the list by accident.
  if (!fromCron && url.searchParams.get('confirm') !== 'send') {
    return NextResponse.json({ error: 'Add &confirm=send to send to everyone, or use &preview=1 / &test=email' }, { status: 400 });
  }

  const { subject, body } = buildIssue(day);
  const topicId = process.env.RESEND_TOPIC_DAILY;
  const r = await resend('/broadcasts', {
    name: `Auto ${day.toUpperCase()} ${istNow().ymd}`,
    segment_id: process.env.RESEND_SEGMENT_NEWSLETTER,
    ...(topicId ? { topic_id: topicId } : {}),
    from: FROM,
    reply_to: REPLY_TO,
    subject,
    html: body,
    send: true,
  });

  if (!r.ok) {
    console.error('Newsletter broadcast error', r.status, r.data);
    return NextResponse.json({ error: 'Broadcast failed', resend: r.data }, { status: 500 });
  }

  console.log('Newsletter sent', day, subject, r.data);
  return NextResponse.json({ ok: true, day, subject, broadcast: r.data });
}
