/**
 * Newsletter welcome email — sent via the Resend REST API (no SDK dependency).
 * All failures are non-fatal to the signup flow; the caller logs and continues.
 */

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://thedivinetarotonline.com';
const SUPPORT_EMAIL = 'thedivinetarot11@gmail.com';

export function welcomeEmailHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050508;font-family:Georgia,'Times New Roman',serif;color:#e9e6f2;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050508;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:linear-gradient(180deg,#0b0b16,#0a0a12);border:1px solid rgba(234,179,8,0.18);border-radius:16px;overflow:hidden;">
        <tr><td style="padding:40px 40px 8px;text-align:center;">
          <div style="font-size:40px;line-height:1;">🌙</div>
          <h1 style="margin:16px 0 4px;font-size:26px;color:#f5eeff;">The Divine Tarot</h1>
          <p style="margin:0;color:#eab308;font-size:14px;letter-spacing:2px;text-transform:uppercase;">Welcome, seeker</p>
        </td></tr>
        <tr><td style="padding:16px 40px 8px;color:#c9c4da;font-size:16px;line-height:1.7;">
          <p style="margin:0 0 14px;">Thank you for joining our circle. ✨</p>
          <p style="margin:0 0 14px;">You'll now receive intuitive tarot guidance, new readings, and mystical insights for love, career, and life — in English, Hindi, and Hinglish.</p>
          <p style="margin:0 0 14px;">Whenever you need clarity, the cards are waiting.</p>
        </td></tr>
        <tr><td style="padding:16px 40px 32px;text-align:center;">
          <a href="${SITE_URL}/reading" style="display:inline-block;background:linear-gradient(90deg,#6d28d9,#9333ea);color:#fff;text-decoration:none;padding:14px 30px;border-radius:999px;font-size:16px;">Start a free reading</a>
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

/**
 * Send the welcome email. Returns true on success, false otherwise.
 * Never throws — email delivery must not block a subscription.
 */
export async function sendWelcomeEmail(to: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'The Divine Tarot <hello@thedivinetarotonline.com>';

  if (!apiKey) {
    console.warn('[newsletter] RESEND_API_KEY not set — skipping welcome email');
    return false;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Welcome to The Divine Tarot 🌙',
        html: welcomeEmailHtml(),
        reply_to: SUPPORT_EMAIL,
      }),
    });
    if (!res.ok) {
      console.error('[newsletter] Resend responded', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('[newsletter] welcome email failed', err);
    return false;
  }
}
