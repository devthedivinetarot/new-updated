/**
 * Shared Kundli report delivery — used by both the client-verify route and the
 * Razorpay webhook so the report is generated and emailed the same way
 * regardless of which path triggers it.
 */

import { computeMatch, type Person } from './ashtakoota';
import { buildReportHtml, sendReportEmail, logReportToSheet, type ReportInput } from './report';

/** Validate/normalise an untrusted person payload. */
export function sanitizePerson(p: unknown): Person | null {
  if (!p || typeof p !== 'object') return null;
  const o = p as Record<string, unknown>;
  const name = String(o.name ?? '').trim().slice(0, 60) || 'Person';
  const rashi = Number(o.rashi);
  const nakshatra = Number(o.nakshatra);
  if (!Number.isInteger(rashi) || rashi < 0 || rashi > 11) return null;
  if (!Number.isInteger(nakshatra) || nakshatra < 0 || nakshatra > 26) return null;
  return { name, rashi, nakshatra };
}

/** Compute the match, build the report and send it (email + sheet). */
export async function generateAndSend(
  email: string,
  p1: Person,
  p2: Person
): Promise<{ emailed: boolean; logged: boolean }> {
  const match = computeMatch(p1, p2);
  const input: ReportInput = { email, person1: p1, person2: p2, match };
  const html = buildReportHtml(input);
  const [emailed, logged] = await Promise.all([
    sendReportEmail(email, p1.name, p2.name, html),
    logReportToSheet(input),
  ]);
  return { emailed, logged };
}
