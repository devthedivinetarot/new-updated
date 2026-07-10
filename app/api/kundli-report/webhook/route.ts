import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay/server';
import { deliverForOrder } from '@/lib/astrology/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Razorpay webhook — the reliability safety net for report delivery.
 *
 * Configure in Razorpay Dashboard → Settings → Webhooks:
 *   URL:    https://<your-domain>/api/kundli-report/webhook
 *   Secret: RAZORPAY_WEBHOOK_SECRET (same value in your env)
 *   Event:  payment.captured
 *
 * On payment.captured we look up the persisted order and deliver the report
 * server-side. deliverForOrder() atomically claims the row, so even if the
 * browser already delivered (or another retry did), the report is sent once.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.error('[Kundli Webhook] Invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = ((): any => {
    try {
      return JSON.parse(rawBody);
    } catch {
      return null;
    }
  })();
  if (!event) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (event?.event === 'payment.captured') {
    const payment = event?.payload?.payment?.entity;
    const orderId: string | undefined = payment?.order_id;
    const paymentId: string | undefined = payment?.id;

    if (orderId) {
      const d = await deliverForOrder(orderId, paymentId);
      console.log('[Kundli Webhook] delivery', orderId, d.reason);
      // Ask Razorpay to retry only on a transient failure we can recover from.
      if (d.reason === 'email-failed' || d.reason === 'error') {
        return NextResponse.json({ ok: false, reason: d.reason }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
