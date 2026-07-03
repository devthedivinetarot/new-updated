import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/newsletter/welcomeEmail';
import { appendToSheet } from '@/lib/newsletter/googleSheet';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter subscription pipeline.
 * Footer form -> POST /api/subscribe { email }
 *   1) store in Supabase (deduped)
 *   2) append to Google Sheet (Apps Script webhook)
 *   3) send a Resend welcome email to brand-new subscribers
 * Storage steps are independent; the request succeeds if the email is saved
 * to at least one destination. Email delivery is non-fatal.
 */
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 });
  }

  const email = String(body?.email ?? '').trim().toLowerCase();
  const source = typeof body?.source === 'string' ? body.source.slice(0, 60) : 'website';
  const locale = typeof body?.locale === 'string' ? body.locale.slice(0, 20) : undefined;

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { success: false, message: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  let supabaseStored = false;
  let alreadySubscribed = false;

  // 1) Supabase (deduped)
  try {
    const { createServerClient, isSupabaseConfigured } = await import('@/lib/supabase/server');
    if (isSupabaseConfigured()) {
      const supabase = await createServerClient();
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existing) {
        alreadySubscribed = true;
        supabaseStored = true;
      } else {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert({ email, source, locale, status: 'subscribed' });
        if (!error) {
          supabaseStored = true;
        } else if ((error as any).code === '23505') {
          alreadySubscribed = true;
          supabaseStored = true;
        } else {
          const code = (error as any)?.code;
          if (code === '42P01') {
            console.error(
              '[newsletter] Table public.newsletter_subscribers is missing. Run src/lib/supabase/schema.sql in the Supabase SQL editor.'
            );
          } else if (code === '42501') {
            console.error(
              '[newsletter] Insert blocked by RLS. Set SUPABASE_SERVICE_ROLE_KEY in the deployment env (service role bypasses RLS).'
            );
          } else {
            console.error('[newsletter] supabase insert error', error);
          }
        }
      }
    } else {
      console.warn(
        '[newsletter] Supabase not configured (need NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).'
      );
    }
  } catch (err) {
    console.error('[newsletter] supabase step failed', err);
  }

  // 2) Google Sheet (best-effort)
  const sheetStored = await appendToSheet(email, { source, locale });

  // Fail only if the email could not be saved anywhere.
  if (!supabaseStored && !sheetStored) {
    console.error(
      '[newsletter] No storage available — configure Supabase (run schema.sql + service role key) and/or GOOGLE_SHEET_WEBHOOK_URL.'
    );
    return NextResponse.json(
      { success: false, message: 'We could not save your email right now. Please try again.' },
      { status: 500 }
    );
  }

  // 3) Welcome email for new subscribers only (non-fatal)
  if (!alreadySubscribed) {
    await sendWelcomeEmail(email);
  }

  return NextResponse.json({
    success: true,
    alreadySubscribed,
    message: alreadySubscribed ? "You're already subscribed 🌙" : 'Subscribed! Check your inbox ✨',
  });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'newsletter subscribe' });
}
