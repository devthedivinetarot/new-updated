/**
 * Daily teaser email — sent via the Resend REST API (no SDK dependency).
 * Mirrors the styling of welcomeEmail.ts / videoEmail.ts.
 * All failures are non-fatal to the caller.
 */

import type { DailyMessage } from './dailyMessages';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://thedivinetarotonline.com';
const SUPPORT_EMAIL = 'thedivinetarot111@gmail.com';

export function dailyEmailHtml(msg: DailyMessage): string {
  const readingUrl = `${SITE_URL}/reading?utm_source=newsletter&utm_medium=email&utm_campaign=daily&utm_content=${encodeURIComponent(
    msg.id
  )}`;
  const paragraphs = msg.body
    .map(
      (p) =>
        `<p style="margin:0 0 14px;color:#c9c4da;font-size:16px;line-height:1.7;text-align:center;">${escapeHtml(
          p
        )}</p>`
    )
    .join('\n          ');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050508;font-family:Georgia,'Times New Roman',serif;color:#e9e6f2;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050508;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:linear-gradient(180deg,#0b0b16,#0a0a12);border:1px solid rgba(234,179,8,0.18);border-radius:16px;overflow:hidden;">
        <tr><td style="padding:36px 40px 4px;text-align:center;">
          <div style="font-size:38px;line-height:1;">🔮</div>
          <h1 style="margin:14px 0 4px;font-size:24px;color:#f5eeff;">The Divine Tarot</h1>
          <p style="margin:0;color:#eab308;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Aaj ka message</p>
        </td></tr>
        <tr><td style="padding:24px 40px 4px;text-align:center;">
          <p style="margin:0 0 18px;color:#f2eefc;font-size:20px;line-height:1.5;">${escapeHtml(
            msg.headline
          )}</p>
          ${paragraphs}
        </td></tr>
        <tr><td style="padding:16px 40px 8px;text-align:center;">
          <div style="font-size:30px;letter-spacing:8px;">🃏 🃏 🃏</div>
        </td></tr>
        <tr><td style="padding:16px 40px 32px;text-align:center;">
          <a href="${readingUrl}" style="display:inline-block;background:linear-gradient(90deg,#6d28d9,#9333ea);color:#fff;text-decoration:none;padding:14px 30px;border-radius:999px;font-size:16px;">${escapeHtml(
            msg.cta
          )}</a>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.08);color:#7c7690;font-size:12px;line-height:1.6;text-align:center;">
          <p style="margin:0 0 6px;">The Divine Tarot · Online tarot readings, worldwide</p>
          <p style="margin:0;">You received this because you subscribed at ${SITE_URL}.<br>
          To unsubscribe, reply to this email or write to
          <a href="mailto:${SUPPORT_EMAIL}?subject=Unsubscribe" style="color:#9b8cff;">${SUPPORT_EMAIL}</a>.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Send the daily teaser email to a list of recipients via Resend's batch
 * endpoint (one individual email per recipient, chunked to 100 per request).
 * Returns counts. Never throws.
 */
export async function sendDailyEmailBatch(
  recipients: string[],
  msg: DailyMessage
): Promise<{ sent: number; failed: number }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'The Divine Tarot <hello@thedivinetarotonline.com>';

  if (!apiKey) {
    console.warn('[daily-newsletter] RESEND_API_KEY not set — skipping send');
    return { sent: 0, failed: recipients.length };
  }

  const html = dailyEmailHtml(msg);
  const subject = msg.emailSubject.slice(0, 180);

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += 100) {
    const chunk = recipients.slice(i, i + 100);
    const payload = chunk.map((to) => ({
      from,
      to: [to],
      subject,
      html,
      reply_to: SUPPORT_EMAIL,
    }));

    try {
      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        sent += chunk.length;
      } else {
        failed += chunk.length;
        console.error('[daily-newsletter] Resend batch failed', res.status, await res.text());
      }
    } catch (err) {
      failed += chunk.length;
      console.error('[daily-newsletter] Resend batch error', err);
    }
  }

  return { sent, failed };
}
