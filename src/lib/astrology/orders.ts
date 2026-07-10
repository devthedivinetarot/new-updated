/**
 * Kundli order persistence + idempotent delivery.
 *
 * At order-creation time we store {order_id, email, person1, person2} so the
 * report can be delivered even if the browser never calls /verify (e.g. the
 * tab closes right after payment). Both the client-verify route and the
 * Razorpay webhook call deliverForOrder(), which atomically claims the row
 * (delivered false -> true) so the report is sent exactly once.
 */

import type { Person } from './ashtakoota';
import { generateAndSend } from './deliver';

async function getSupabase() {
  const { createServerClient, isSupabaseConfigured } = await import('@/lib/supabase/server');
  if (!isSupabaseConfigured()) return null;
  return createServerClient();
}

export interface SaveOrderInput {
  orderId: string;
  email: string;
  person1: Person;
  person2: Person;
  amount: number;
}

/** Persist a created order. Best-effort — never throws. */
export async function saveKundliOrder(o: SaveOrderInput): Promise<void> {
  try {
    const supabase = await getSupabase();
    if (!supabase) {
      console.warn('[kundli] Supabase not configured — order not persisted; webhook fallback disabled');
      return;
    }
    const { error } = await supabase.from('kundli_orders').insert({
      order_id: o.orderId,
      email: o.email,
      person1: o.person1,
      person2: o.person2,
      amount: o.amount,
      status: 'created',
      delivered: false,
    });
    if (error) {
      const code = (error as { code?: string }).code;
      if (code === '42P01') {
        console.warn('[kundli] kundli_orders table missing — run src/lib/db/kundli-schema.sql');
      } else if (code !== '23505') {
        console.error('[kundli] order persist error', error);
      }
    }
  } catch (e) {
    console.error('[kundli] saveKundliOrder failed', e);
  }
}

export type DeliverReason =
  | 'sent'
  | 'already-delivered'
  | 'no-row'
  | 'supabase-not-configured'
  | 'email-failed'
  | 'error';

export interface DeliverResult {
  ok: boolean;        // true when the report is (now or already) delivered
  emailed?: boolean;
  reason: DeliverReason;
}

/**
 * Atomically claim and deliver the report for an order. Safe to call from both
 * the client-verify path and the webhook — only the first caller sends.
 */
export async function deliverForOrder(orderId: string, paymentId?: string): Promise<DeliverResult> {
  try {
    const supabase = await getSupabase();
    if (!supabase) return { ok: false, reason: 'supabase-not-configured' };

    const now = new Date().toISOString();
    // Atomic claim: only the caller that flips delivered false->true proceeds.
    const { data: claimed } = await supabase
      .from('kundli_orders')
      .update({ delivered: true, status: 'paid', payment_id: paymentId ?? null, delivered_at: now, updated_at: now })
      .eq('order_id', orderId)
      .eq('delivered', false)
      .select()
      .maybeSingle();

    if (!claimed) {
      // Either already delivered, or the row doesn't exist.
      const { data: existing } = await supabase
        .from('kundli_orders')
        .select('delivered')
        .eq('order_id', orderId)
        .maybeSingle();
      if (existing?.delivered) return { ok: true, emailed: true, reason: 'already-delivered' };
      return { ok: false, reason: 'no-row' };
    }

    const row = claimed as { email: string; person1: Person; person2: Person };
    const res = await generateAndSend(row.email, row.person1, row.person2);

    if (!res.emailed) {
      // Roll the claim back so a retry (client re-call or webhook retry) tries again.
      await supabase
        .from('kundli_orders')
        .update({ delivered: false, delivered_at: null, updated_at: new Date().toISOString() })
        .eq('order_id', orderId);
      return { ok: false, emailed: false, reason: 'email-failed' };
    }

    return { ok: true, emailed: true, reason: 'sent' };
  } catch (e) {
    console.error('[kundli] deliverForOrder failed', e);
    return { ok: false, reason: 'error' };
  }
}
