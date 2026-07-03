/**
 * The Divine Tarot — Newsletter → Google Sheet webhook
 *
 * Setup:
 *  1. Create a Google Sheet. In the first tab, this script will auto-add a
 *     header row: Email | Source | Locale | Timestamp (UTC).
 *  2. Extensions → Apps Script. Delete any code, paste this file.
 *  3. Set SHARED_TOKEN below to a long random string (letters+numbers).
 *     Put the SAME value in your app env as GOOGLE_SHEET_WEBHOOK_TOKEN.
 *  4. Deploy → New deployment → type "Web app".
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Copy the Web app URL → put it in your app env as GOOGLE_SHEET_WEBHOOK_URL.
 *  5. Re-deploy after any edit (Deploy → Manage deployments → edit → Deploy).
 */

// Must match GOOGLE_SHEET_WEBHOOK_TOKEN in the app. Leave '' to disable the check.
var SHARED_TOKEN = 'CHANGE_ME_to_a_long_random_string';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || '{}');

    if (SHARED_TOKEN && data.token !== SHARED_TOKEN) {
      return json({ ok: false, error: 'unauthorized' });
    }

    var email = String(data.email || '').trim().toLowerCase();
    if (!email || email.indexOf('@') === -1) {
      return json({ ok: false, error: 'invalid email' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Header row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Email', 'Source', 'Locale', 'Timestamp (UTC)']);
    }

    // De-duplicate on the Email column
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var existing = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < existing.length; i++) {
        if (String(existing[i][0]).trim().toLowerCase() === email) {
          return json({ ok: true, duplicate: true });
        }
      }
    }

    sheet.appendRow([
      email,
      data.source || 'website',
      data.locale || '',
      data.timestamp || new Date().toISOString(),
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, service: 'divine-tarot-newsletter' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
