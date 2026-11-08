import { NextRequest, NextResponse } from 'next/server';
import { claimDue, markSent, markFailed, istDate, isSheetConfigured } from '@/lib/reports/orders';
import { deliverReport } from '@/lib/reports/deliver';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Daily delivery run (vercel.json cron, 09:00 IST). Sends every paid report
 * whose due date (day 7 for ₹999, day 3 for ₹1299) has arrived.
 * Protected by CRON_SECRET (Vercel sends `Authorization: Bearer <secret>`).
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isSheetConfigured()) return NextResponse.json({ error: 'REPORT_SHEET_URL not set' }, { status: 500 });

  const started = Date.now();
  const orders = await claimDue(istDate(), 15);
  const sent: string[] = [];
  const failed: string[] = [];

  for (const o of orders) {
    if (Date.now() - started > 48_000) {
      await markFailed(o.orderId, 'deferred: time budget').catch(() => undefined);
      failed.push(o.orderId);
      continue;
    }
    try {
      await deliverReport(o);
      await markSent(o.orderId);
      sent.push(o.orderId);
    } catch (e) {
      console.error('[tarot-report cron] delivery failed', o.orderId, e);
      await markFailed(o.orderId, String(e)).catch(() => undefined);
      failed.push(o.orderId);
    }
  }

  return NextResponse.json({ ok: true, due: orders.length, sent, failed });
}
