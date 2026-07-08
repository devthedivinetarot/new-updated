/**
 * Kundli Milan report — server helpers.
 * Builds a print-ready HTML report, emails it (Resend) as an attachment, and
 * logs the buyer's email to the Google Sheet. All network helpers are
 * non-throwing so a failure in one channel never blocks the others.
 */

import { NAKSHATRAS, RASHIS, type MatchResult } from './ashtakoota';

export interface ReportPerson {
  name: string;
  rashi: number;
  nakshatra: number;
}

export interface ReportInput {
  email: string;
  person1: ReportPerson;
  person2: ReportPerson;
  match: MatchResult;
}

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://thedivinetarotonline.com';

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

/** Full standalone, print-optimized HTML report. */
export function buildReportHtml(input: ReportInput): string {
  const { person1: p1, person2: p2, match } = input;
  const rows = match.kootas
    .map(
      (k) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:600;">${esc(k.label)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;white-space:nowrap;">${k.score} / ${k.max}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#555;font-size:13px;">${esc(k.note)}</td>
      </tr>`
    )
    .join('');

  const doshaBlock = match.doshas.length
    ? `<div style="margin:16px 0;padding:14px 16px;background:#fff4f4;border:1px solid #f0c9c9;border-radius:10px;color:#8a1f1f;font-size:14px;">
         <strong>Doshas detected:</strong> ${match.doshas.map(esc).join(', ')}. These can often be mitigated with traditional remedies (mantra, puja, or an astrologer's guidance).
       </div>`
    : `<div style="margin:16px 0;padding:14px 16px;background:#f2fbf4;border:1px solid #c6e8cf;border-radius:10px;color:#1f6b34;font-size:14px;"><strong>No major doshas</strong> (Nadi / Bhakoot) detected.</div>`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Kundli Milan Report — ${esc(p1.name)} & ${esc(p2.name)}</title></head>
<body style="margin:0;background:#f6f5fb;font-family:Georgia,'Times New Roman',serif;color:#1c1830;">
  <div style="max-width:720px;margin:0 auto;background:#fff;">
    <div style="background:linear-gradient(135deg,#3b1d6e,#6d28d9);color:#fff;padding:32px 36px;">
      <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#ffd700;">The Divine Tarot · Vedic Match Engine</div>
      <h1 style="margin:8px 0 4px;font-size:28px;">Kundli Milan Report</h1>
      <div style="font-size:15px;opacity:.9;">${esc(p1.name)} &nbsp;✦&nbsp; ${esc(p2.name)}</div>
    </div>

    <div style="padding:28px 36px;">
      <div style="text-align:center;margin:8px 0 20px;">
        <div style="font-size:52px;font-weight:700;color:#6d28d9;line-height:1;">${match.total} <span style="font-size:24px;color:#999;">/ 36</span></div>
        <div style="font-size:15px;color:#444;margin-top:6px;">${esc(match.verdict)}</div>
      </div>

      <table style="width:100%;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;margin-top:8px;">
        <thead><tr style="background:#f3f0fb;">
          <th style="padding:10px 12px;text-align:left;">Koota</th>
          <th style="padding:10px 12px;text-align:center;">Score</th>
          <th style="padding:10px 12px;text-align:left;">Meaning</th>
        </tr></thead>
        <tbody>${rows}
          <tr style="background:#faf9ff;font-weight:700;">
            <td style="padding:12px;">Total</td>
            <td style="padding:12px;text-align:center;">${match.total} / 36</td>
            <td style="padding:12px;">${match.percent}% compatibility</td>
          </tr>
        </tbody>
      </table>

      ${doshaBlock}

      <h3 style="margin:22px 0 8px;font-size:16px;">Birth-chart summary</h3>
      <table style="width:100%;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;">
        <tr><td style="padding:8px 12px;border:1px solid #eee;">${esc(p1.name)}</td>
            <td style="padding:8px 12px;border:1px solid #eee;">Rashi: ${esc(RASHIS[p1.rashi])}</td>
            <td style="padding:8px 12px;border:1px solid #eee;">Nakshatra: ${esc(NAKSHATRAS[p1.nakshatra])}</td></tr>
        <tr><td style="padding:8px 12px;border:1px solid #eee;">${esc(p2.name)}</td>
            <td style="padding:8px 12px;border:1px solid #eee;">Rashi: ${esc(RASHIS[p2.rashi])}</td>
            <td style="padding:8px 12px;border:1px solid #eee;">Nakshatra: ${esc(NAKSHATRAS[p2.nakshatra])}</td></tr>
      </table>

      <p style="margin:22px 0 0;font-size:12px;color:#888;line-height:1.6;">
        Ashtakoota Guna Milan computed from approximate Moon positions (Lahiri ayanamsa).
        A guide to reflect clearly — not a substitute for a professional jyotishi or your own judgement.
        Generated by ${esc(SITE_URL)}.
      </p>
    </div>
  </div>
</body></html>`;
}

/** Email the report as an HTML attachment (Resend). Non-throwing. */
export async function sendReportEmail(to: string, p1Name: string, p2Name: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'The Divine Tarot <hello@thedivinetarotonline.com>';
  if (!apiKey) {
    console.warn('[kundli] RESEND_API_KEY not set — skipping report email');
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject: `Your Kundli Milan Report — ${p1Name} & ${p2Name}`,
        html,
        attachments: [
          {
            filename: `kundli-milan-${p1Name}-${p2Name}.html`.replace(/\s+/g, '-').toLowerCase(),
            content: Buffer.from(html, 'utf-8').toString('base64'),
          },
        ],
      }),
    });
    if (!res.ok) {
      console.error('[kundli] Resend responded', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('[kundli] report email failed', err);
    return false;
  }
}

/**
 * Log the buyer to the Google Sheet. Posts to the same Apps Script webhook the
 * newsletter uses, tagged for Sheet 2 so the script can route the row.
 * Never throws.
 */
export async function logReportToSheet(input: ReportInput): Promise<boolean> {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const token = process.env.GOOGLE_SHEET_WEBHOOK_TOKEN;
  if (!url) {
    console.warn('[kundli] GOOGLE_SHEET_WEBHOOK_URL not set — skipping sheet log');
    return false;
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      body: JSON.stringify({
        token: token || '',
        sheet: 'Sheet2',
        target: 'kundli_reports',
        email: input.email,
        person1: input.person1.name,
        person2: input.person2.name,
        score: `${input.match.total}/36`,
        percent: input.match.percent,
        doshas: input.match.doshas.join(', '),
        source: 'kundli-milan',
        timestamp: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      console.error('[kundli] sheet webhook responded', res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[kundli] sheet log failed', err);
    return false;
  }
}
