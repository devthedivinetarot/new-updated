/**
 * Appends a subscriber to a Google Sheet via a Google Apps Script Web App.
 * Set GOOGLE_SHEET_WEBHOOK_URL (and optionally GOOGLE_SHEET_WEBHOOK_TOKEN).
 * Never throws — a failed sheet write must not block a subscription.
 */
const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;
const WEBHOOK_TOKEN = process.env.GOOGLE_SHEET_WEBHOOK_TOKEN;

export async function appendToSheet(
  email: string,
  extra?: { source?: string; locale?: string }
): Promise<boolean> {
  if (!WEBHOOK_URL) {
    console.warn('[newsletter] GOOGLE_SHEET_WEBHOOK_URL not set — skipping sheet write');
    return false;
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Apps Script follows a 302 to googleusercontent.com; fetch follows it.
      redirect: 'follow',
      body: JSON.stringify({
        email,
        token: WEBHOOK_TOKEN || '',
        source: extra?.source || 'website',
        locale: extra?.locale || '',
        timestamp: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      console.error('[newsletter] sheet webhook responded', res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[newsletter] sheet webhook failed', err);
    return false;
  }
}
