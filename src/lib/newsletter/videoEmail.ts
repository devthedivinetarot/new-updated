/**
 * "New video" newsletter email — sent via the Resend REST API (no SDK dependency).
 * Mirrors the styling of welcomeEmail.ts. All failures are non-fatal to the caller.
 */

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://thedivinetarotonline.com';
const SUPPORT_EMAIL = 'thedivinetarot111@gmail.com';

export interface VideoInfo {
  videoId: string;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export function videoEmailHtml(video: VideoInfo): string {
  const safeTitle = escapeHtml(video.title);
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
          <p style="margin:0;color:#eab308;font-size:13px;letter-spacing:2px;text-transform:uppercase;">New video is live</p>
        </td></tr>
        <tr><td style="padding:20px 40px 8px;">
          <a href="${video.url}" style="text-decoration:none;display:block;">
            <img src="${video.thumbnailUrl}" alt="${safeTitle}" width="480" style="width:100%;max-width:480px;border-radius:12px;display:block;border:1px solid rgba(255,255,255,0.08);" />
          </a>
        </td></tr>
        <tr><td style="padding:8px 40px 4px;color:#f2eefc;font-size:19px;line-height:1.5;text-align:center;">
          <p style="margin:0;">${safeTitle}</p>
        </td></tr>
        <tr><td style="padding:8px 40px 4px;color:#c9c4da;font-size:15px;line-height:1.6;text-align:center;">
          <p style="margin:0;">A fresh reading just dropped on our channel. ✨ Tap below to watch it now.</p>
        </td></tr>
        <tr><td style="padding:20px 40px 32px;text-align:center;">
          <a href="${video.url}" style="display:inline-block;background:linear-gradient(90deg,#6d28d9,#9333ea);color:#fff;text-decoration:none;padding:14px 30px;border-radius:999px;font-size:16px;">▶ Watch now</a>
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
 * Send the "new video" email to a list of recipients via Resend's batch endpoint
 * (one individual email per recipient, chunked to 100 per request).
 * Returns the number of emails Resend accepted. Never throws.
 */
export async function sendVideoEmailBatch(
  recipients: string[],
  video: VideoInfo
): Promise<{ sent: number; failed: number }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'The Divine Tarot <hello@thedivinetarotonline.com>';

  if (!apiKey) {
    console.warn('[youtube-newsletter] RESEND_API_KEY not set — skipping send');
    return { sent: 0, failed: recipients.length };
  }

  const html = videoEmailHtml(video);
  const subject = `🔮 New reading is live: ${video.title}`.slice(0, 180);

  let sent = 0;
  let failed = 0;

  // Resend batch endpoint accepts up to 100 messages per request.
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
        console.error('[youtube-newsletter] Resend batch failed', res.status, await res.text());
      }
    } catch (err) {
      failed += chunk.length;
      console.error('[youtube-newsletter] Resend batch error', err);
    }
  }

  return { sent, failed };
}
