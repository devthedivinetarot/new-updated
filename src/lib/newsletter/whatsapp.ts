/**
 * WhatsApp daily broadcast — Meta WhatsApp Cloud API (Graph API), no SDK.
 *
 * Business-initiated marketing messages MUST use a pre-approved template.
 * Expected template shape (create in Meta Business Manager / your BSP
 * dashboard — AiSensy, Interakt, Wati etc. all sit on this same API):
 *
 *   Name:     daily_tarot_message (or set WHATSAPP_TEMPLATE_NAME)
 *   Language: en (or set WHATSAPP_TEMPLATE_LANG)
 *   Body:     {{1}}
 *             (single variable holding the day's teaser text)
 *   Button:   URL button -> https://thedivinetarotonline.com/reading
 *
 * Env vars:
 *   WHATSAPP_ACCESS_TOKEN     — permanent System User token
 *   WHATSAPP_PHONE_NUMBER_ID  — the sender phone number ID (not the number)
 *   WHATSAPP_TEMPLATE_NAME    — optional, default 'daily_tarot_message'
 *   WHATSAPP_TEMPLATE_LANG    — optional, default 'en'
 *
 * All failures are non-fatal; the sender logs and returns counts.
 */

const GRAPH_VERSION = 'v21.0';

export interface WhatsAppSendResult {
  sent: number;
  failed: number;
  configured: boolean;
}

export function isWhatsAppConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

/**
 * Meta rejects body params containing newlines, tabs, or 4+ consecutive
 * spaces. Collapse anything suspicious into single spaces.
 */
function sanitizeParam(text: string): string {
  return text.replace(/\s+/g, ' ').trim().slice(0, 1024);
}

/** Keep digits only (E.164 without '+'), e.g. '919876543210'. */
function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

/**
 * Send the daily template message to a list of phone numbers, sequentially
 * with light pacing (Cloud API rate limits are pair-based; ~80 msg/sec is
 * the ceiling, we stay far below it). Never throws.
 */
export async function sendDailyWhatsAppBatch(
  phoneNumbers: string[],
  messageText: string
): Promise<WhatsAppSendResult> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || 'daily_tarot_message';
  const templateLang = process.env.WHATSAPP_TEMPLATE_LANG || 'en';

  if (!token || !phoneNumberId) {
    console.warn(
      '[daily-newsletter] WhatsApp not configured (need WHATSAPP_ACCESS_TOKEN + WHATSAPP_PHONE_NUMBER_ID) — skipping'
    );
    return { sent: 0, failed: 0, configured: false };
  }

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`;
  const bodyParam = sanitizeParam(messageText);

  let sent = 0;
  let failed = 0;

  for (const raw of phoneNumbers) {
    const to = normalizePhone(raw);
    if (!to || to.length < 10) {
      failed += 1;
      continue;
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: templateLang },
            components: [
              {
                type: 'body',
                parameters: [{ type: 'text', text: bodyParam }],
              },
            ],
          },
        }),
      });

      if (res.ok) {
        sent += 1;
      } else {
        failed += 1;
        const errText = await res.text();
        console.error('[daily-newsletter] WhatsApp send failed', res.status, errText.slice(0, 500));
      }
    } catch (err) {
      failed += 1;
      console.error('[daily-newsletter] WhatsApp send error', err);
    }

    // Light pacing between sends.
    await new Promise((r) => setTimeout(r, 60));
  }

  return { sent, failed, configured: true };
}
