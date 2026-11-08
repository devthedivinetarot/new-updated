/**
 * Tarot report orders — stored in the "Report Orders" Google Sheet tab via
 * the Apps Script web app in docs/reports/tarot-report-orders.gs.
 * Env: REPORT_SHEET_URL, REPORT_SHEET_TOKEN.
 */
import type { Lang, Topic, PlanId } from './generate';

export interface ReportOrder {
  orderId: string;
  status?: 'pending_payment' | 'paid' | 'sending' | 'sent';
  plan: PlanId;
  amount: number; // rupees
  topic: Topic;
  lang: Lang;
  year: number;
  name: string;
  partner?: string;
  email: string;
  whatsapp: string;
  dob: string;
  cardIds: number[];
  paymentId?: string;
  dueDate?: string; // YYYY-MM-DD (IST)
  coupon?: boolean;
}

export const isSheetConfigured = () => Boolean(process.env.REPORT_SHEET_URL);

async function call<T = Record<string, unknown>>(action: string, payload: Record<string, unknown>): Promise<T & { ok: boolean; error?: string }> {
  const url = process.env.REPORT_SHEET_URL;
  if (!url) throw new Error('REPORT_SHEET_URL is not set');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    redirect: 'follow', // Apps Script answers via a 302 to googleusercontent.com
    body: JSON.stringify({ action, token: process.env.REPORT_SHEET_TOKEN || '', ...payload }),
    cache: 'no-store',
    signal: AbortSignal.timeout(25_000),
  });
  const text = await res.text();
  let data: T & { ok: boolean; error?: string };
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Sheet returned non-JSON (${res.status}): ${text.slice(0, 120)}`);
  }
  if (!data.ok && data.error === 'unauthorized') throw new Error('Sheet token mismatch (REPORT_SHEET_TOKEN)');
  return data;
}

export async function saveOrder(order: ReportOrder): Promise<void> {
  const r = await call('create', { order });
  if (!r.ok) throw new Error(`Sheet create failed: ${r.error}`);
}

export async function getOrder(orderId: string): Promise<ReportOrder | null> {
  const r = await call<{ order?: ReportOrder }>('get', { orderId });
  return r.ok && r.order ? r.order : null;
}

export async function markPaid(orderId: string, paymentId: string, dueDate: string) {
  return call<{ transitioned?: boolean; already?: boolean; order?: ReportOrder }>('paid', { orderId, paymentId, dueDate });
}

export async function claimDue(today: string, limit = 10): Promise<ReportOrder[]> {
  const r = await call<{ orders?: ReportOrder[] }>('claimDue', { today, limit });
  if (!r.ok) throw new Error(`Sheet claimDue failed: ${r.error}`);
  return r.orders || [];
}

export async function claimOne(orderId: string) {
  return call<{ order?: ReportOrder }>('claim', { orderId });
}

export const markSent = (orderId: string) => call('sent', { orderId });
export const markFailed = (orderId: string, error: string) => call('failed', { orderId, error });

/** Today's date in India as YYYY-MM-DD. */
export function istDate(d = new Date()): string {
  return new Date(d.getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

/** IST date `days` after today. Day of payment = day 0. */
export function dueDateFor(days: number, from = new Date()): string {
  return istDate(new Date(from.getTime() + days * 86400 * 1000));
}
