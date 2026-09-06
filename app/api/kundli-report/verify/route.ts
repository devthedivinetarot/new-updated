import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay/server';
import { sanitizePerson, generateAndSend } from '@/lib/astrology/deliver';
import { deliverForOrder } from '@/lib/astrology/orders';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orderId, paymentId, signature, email } = body || {};

    const clean = String(email || '').trim();
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    const p1 = sanitizePerson(body?.person1);
    const p2 = sanitizePerson(body?.person2);
    if (!p1 || !p2) {
      return NextResponse.json({ error: 'Invalid birth data' }, { status: 400 });
    }

    // Production ALWAYS requires a verified Razorpay signature — no free reports
    // and no accepting a `mock_` order. Mock delivery is dev-only.
    const isProd = process.env.NODE_ENV === 'production';
    const isMock = !isProd && typeof orderId === 'string' && orderId.startsWith('mock_');
    const mustVerify = isProd || !!process.env.RAZORPAY_KEY_SECRET;
    if (mustVerify && !isMock) {
      if (!orderId || !paymentId || !signature) {
        return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
      }
      if (!verifyPaymentSignature(orderId, paymentId, signature)) {
        console.error('[Kundli Verify] Invalid signature');
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Deliver idempotently via the persisted order (shared with the webhook, so
    // the report is sent exactly once). If there's no persisted row (Supabase
    // not configured, or a mock/dev order), fall back to a direct send using
    // the data the client just posted.
    let emailed = false;
    if (typeof orderId === 'string' && !isMock) {
      const d = await deliverForOrder(orderId, typeof paymentId === 'string' ? paymentId : undefined);
      if (d.ok) {
        emailed = d.emailed !== false;
      } else if (d.reason === 'no-row' || d.reason === 'supabase-not-configured') {
        const res = await generateAndSend(clean, p1, p2);
        emailed = res.emailed;
      } else {
        emailed = false; // email-failed / error — surfaced to the user
      }
    } else {
      const res = await generateAndSend(clean, p1, p2);
      emailed = res.emailed;
    }

    return NextResponse.json({ success: true, emailed });
  } catch (error) {
    console.error('[Kundli Verify] Error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
