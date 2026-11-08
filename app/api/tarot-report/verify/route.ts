import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay/server';
import { confirmTarotPayment } from '@/lib/reports/confirm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { orderId, paymentId, signature } = (await req.json().catch(() => ({}))) || {};
  if (typeof orderId !== 'string' || !orderId) {
    return NextResponse.json({ error: 'Missing order' }, { status: 400 });
  }

  const isMock = process.env.NODE_ENV !== 'production' && orderId.startsWith('mock_');
  if (!isMock) {
    if (typeof paymentId !== 'string' || typeof signature !== 'string' || !verifyPaymentSignature(orderId, paymentId, signature)) {
      return NextResponse.json({ error: 'Payment could not be verified' }, { status: 400 });
    }
  }

  try {
    const res = await confirmTarotPayment(orderId, isMock ? 'mock_payment' : paymentId);
    if (!res) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ success: true, dueDate: res.dueDate });
  } catch (e) {
    console.error('[tarot-report] verify failed', e);
    // Payment is genuine; the Razorpay webhook will retry recording it.
    return NextResponse.json({ success: true, pendingRecord: true });
  }
}
