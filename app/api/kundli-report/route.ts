import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/razorpay/server';

// Downloadable Kundli Milan report — one-time purchase, no login required.
const KUNDLI_AMOUNT = 9900; // ₹99.00 in paise

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email: string = (body?.email || '').trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const configured = Boolean(keyId && process.env.RAZORPAY_KEY_SECRET);

    if (!configured) {
      // In production we NEVER hand out a free report — require real payment.
      if (process.env.NODE_ENV === 'production') {
        console.error(
          '[Kundli Order] Razorpay not configured in production — set NEXT_PUBLIC_RAZORPAY_KEY_ID, RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
        );
        return NextResponse.json(
          { error: 'Payments are not set up yet. Please try again shortly.' },
          { status: 503 }
        );
      }
      // Local/dev only: graceful mock so the flow can be tested without keys.
      console.warn('[Kundli Order] Razorpay not configured — mock order (dev only)');
      return NextResponse.json({
        success: true,
        mock: true,
        orderId: `mock_order_${Date.now()}`,
        amount: KUNDLI_AMOUNT,
        currency: 'INR',
        keyId: keyId || 'rzp_test_mock',
      });
    }

    const receiptId = `kundli_${Date.now()}`;
    const order = await createOrder(KUNDLI_AMOUNT, 'INR', receiptId);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: Number(order.amount),
      currency: 'INR',
      keyId,
    });
  } catch (error) {
    console.error('[Kundli Order] Error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
