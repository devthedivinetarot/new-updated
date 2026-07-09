import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay/server';
import { computeMatch, type Person } from '@/lib/astrology/ashtakoota';
import { buildReportHtml, sendReportEmail, logReportToSheet, type ReportInput } from '@/lib/astrology/report';

function sanitizePerson(p: unknown): Person | null {
  if (!p || typeof p !== 'object') return null;
  const o = p as Record<string, unknown>;
  const name = String(o.name ?? '').trim().slice(0, 60) || 'Person';
  const rashi = Number(o.rashi);
  const nakshatra = Number(o.nakshatra);
  if (!Number.isInteger(rashi) || rashi < 0 || rashi > 11) return null;
  if (!Number.isInteger(nakshatra) || nakshatra < 0 || nakshatra > 26) return null;
  return { name, rashi, nakshatra };
}

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

    // Recompute the match server-side so the emailed report is authoritative.
    const match = computeMatch(p1, p2);
    const input: ReportInput = { email: clean, person1: p1, person2: p2, match };
    const html = buildReportHtml(input);

    const [emailed, logged] = await Promise.all([
      sendReportEmail(clean, p1.name, p2.name, html),
      logReportToSheet(input),
    ]);

    return NextResponse.json({ success: true, emailed, logged });
  } catch (error) {
    console.error('[Kundli Verify] Error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
