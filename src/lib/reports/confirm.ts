import { PLANS } from './generate';
import { getOrder, markPaid, dueDateFor, isSheetConfigured } from './orders';
import { sendOrderEmails } from './deliver';

/**
 * Mark a tarot-report order as paid (idempotent) and send the confirmation
 * + admin emails the first time. Shared by /verify and the Razorpay webhook.
 * Returns null when the order isn't a tarot-report order.
 */
export async function confirmTarotPayment(orderId: string, paymentId: string) {
  if (!isSheetConfigured()) return null;
  const existing = await getOrder(orderId);
  if (!existing) return null;
  const plan = PLANS[existing.plan as keyof typeof PLANS] || PLANS.standard;
  const res = await markPaid(orderId, paymentId, dueDateFor(plan.days));
  const order = res.order || existing;
  if (res.transitioned) await sendOrderEmails(order);
  return { order, dueDate: order.dueDate || dueDateFor(plan.days) };
}
