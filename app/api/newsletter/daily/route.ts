import { NextRequest, NextResponse } from 'next/server';
import { pickDailyMessage, istDateString } from '@/lib/newsletter/dailyMessages';
import { sendDailyEmailBatch } from '@/lib/newsletter/dailyEmail';
import { sendDailyWhatsAppBatch, isWhatsAppConfigured } from '@/lib/newsletter/whatsapp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Daily teaser broadcast cron.
 *
 * Runs once a day (see vercel.json). On each run it:
 *   1) Picks the message-of-the-day (deterministic rotation, IST calendar)
 *   2) Checks Supabase state so a retried/duplicate cron never double-sends
 *   3) Emails every `status = 'subscribed'` member via Resend
 *   4) Sends the WhatsApp template to every opted-in number (if configured)
 *   5) Records the send in `daily_newsletter_state`
 *
 * Protected by CRON_SECRET (same pattern as /api/youtube/cron).
 *
 * Query params (manual testing):
 *   ?dryRun=1  — pick the message and count recipients, send nothing
 *   ?force=1   — send even if today's broadcast was already recorded
 */
export async function GET(req: NextRequest) {
  // --- Auth ---
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
  }

  const dryRun = req.nextUrl.searchParams.get('dryRun') === '1';
  const force = req.nextUrl.searchParams.get('force') === '1';

  const today = istDateString();
  const message = pickDailyMessage();

  // --- Load Supabase ---
  const { createServerClient, isSupabaseConfigured } = await import('@/lib/supabase/server');
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Supabase not configured.' },
      { status: 500 }
    );
  }
  const supabase = await createServerClient();

  // --- Dedupe: has today's broadcast already gone out? ---
  const { data: state } = await supabase
    .from('daily_newsletter_state')
    .select('last_sent_date')
    .eq('id', 1)
    .maybeSingle();

  if (!force && state?.last_sent_date === today) {
    return NextResponse.json({
      success: true,
      skipped: true,
      message: `Already sent today (${today}).`,
      messageId: message.id,
    });
  }

  // --- Gather email recipients ---
  const { data: subs, error: subErr } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('status', 'subscribed');

  if (subErr) {
    console.error('[daily-newsletter] subscriber query failed', subErr);
    return NextResponse.json(
      { success: false, message: 'Subscriber query failed.' },
      { status: 500 }
    );
  }

  const emails = Array.from(
    new Set((subs ?? []).map((s: { email: string }) => s.email).filter(Boolean))
  );

  // --- Gather WhatsApp recipients (table may not exist yet — non-fatal) ---
  let phones: string[] = [];
  try {
    const { data: waSubs, error: waErr } = await supabase
      .from('whatsapp_subscribers')
      .select('phone')
      .eq('status', 'subscribed');
    if (waErr) {
      if ((waErr as { code?: string }).code === '42P01') {
        console.warn(
          '[daily-newsletter] whatsapp_subscribers table missing — run src/lib/db/daily-newsletter-schema.sql'
        );
      } else {
        console.error('[daily-newsletter] whatsapp subscriber query failed', waErr);
      }
    } else {
      phones = Array.from(
        new Set((waSubs ?? []).map((s: { phone: string }) => s.phone).filter(Boolean))
      );
    }
  } catch (err) {
    console.error('[daily-newsletter] whatsapp subscriber step failed', err);
  }

  if (dryRun) {
    return NextResponse.json({
      success: true,
      dryRun: true,
      date: today,
      message: { id: message.id, theme: message.theme, emailSubject: message.emailSubject },
      recipients: { email: emails.length, whatsapp: phones.length },
      whatsappConfigured: isWhatsAppConfigured(),
    });
  }

  // --- Send ---
  const emailResult = await sendDailyEmailBatch(emails, message);
  const whatsappResult = await sendDailyWhatsAppBatch(phones, message.whatsapp);

  // --- Record the send so we never double-send today ---
  const { error: stateErr } = await supabase.from('daily_newsletter_state').upsert({
    id: 1,
    last_sent_date: today,
    last_message_id: message.id,
    last_email_sent: emailResult.sent,
    last_whatsapp_sent: whatsappResult.sent,
    updated_at: new Date().toISOString(),
  });
  if (stateErr) {
    console.error('[daily-newsletter] state upsert failed', stateErr);
  }

  return NextResponse.json({
    success: true,
    date: today,
    messageId: message.id,
    email: emailResult,
    whatsapp: whatsappResult,
  });
}
