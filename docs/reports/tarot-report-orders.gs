/**
 * The Divine Tarot — Tarot Report Orders (Google Sheet backend)
 *
 * Stores every report order in a "Report Orders" tab of your EXISTING
 * spreadsheet and works as the delivery queue for the 7-day / 3-day PDFs.
 * It is a separate script, so your current newsletter / Kundli script is
 * not touched.
 *
 * Setup (5 minutes, logged in as dev.thedivinetarot111@gmail.com):
 *  1. Open the existing newsletter Google Sheet and copy its ID from the URL:
 *     https://docs.google.com/spreadsheets/d/<THIS_PART_IS_THE_ID>/edit
 *  2. Go to https://script.google.com → New project. Delete the sample code,
 *     paste this whole file.
 *  3. Fill SPREADSHEET_ID and SHARED_TOKEN below. SHARED_TOKEN = any long
 *     random string; put the same value in Vercel as REPORT_SHEET_TOKEN.
 *  4. Deploy → New deployment → Select type: Web app
 *       Execute as: Me      Who has access: Anyone
 *     Authorize when asked. Copy the Web app URL → Vercel env
 *     REPORT_SHEET_URL.
 *  5. After any edit: Deploy → Manage deployments → ✏️ → Version: New → Deploy
 *     (keeps the same URL).
 */

var SPREADSHEET_ID = 'PASTE_SPREADSHEET_ID_HERE';
var SHARED_TOKEN = 'CHANGE_ME_to_a_long_random_string';
var TAB = 'Report Orders';

var HEADERS = [
  'Created (IST)', 'Order ID', 'Status', 'Plan', 'Amount (₹)', 'Topic', 'Language', 'Year',
  'Name', 'Partner Name', 'Email', 'WhatsApp', 'Date of Birth', 'Cards',
  'Payment ID', 'Paid (IST)', 'Due Date', 'Sent (IST)', 'Coupon', 'Attempts', 'Last Error', 'Claimed At',
];
var COL = {}; HEADERS.forEach(function (h, i) { COL[h] = i + 1; });

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (SHARED_TOKEN && data.token !== SHARED_TOKEN) return json({ ok: false, error: 'unauthorized' });
    lock.waitLock(20000);
    var sheet = getSheet();
    switch (data.action) {
      case 'create': return json(create(sheet, data.order));
      case 'paid': return json(paid(sheet, data));
      case 'claimDue': return json(claimDue(sheet, data));
      case 'claim': return json(claimOne(sheet, data));
      case 'sent': return json(update(sheet, data.orderId, { 'Status': 'sent', 'Sent (IST)': ist(), 'Last Error': '' }));
      case 'failed': return json(failed(sheet, data));
      case 'get': { var r = find(sheet, data.orderId); return json(r ? { ok: true, order: toOrder(sheet, r) } : { ok: false, error: 'not-found' }); }
      default: return json({ ok: false, error: 'unknown action' });
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() { return json({ ok: true, service: 'divine-tarot-report-orders' }); }

function getSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheetByName(TAB) || ss.insertSheet(TAB);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#3a2058').setFontColor('#ffffff');
  }
  return sh;
}

function create(sh, o) {
  if (!o || !o.orderId) return { ok: false, error: 'missing order' };
  if (find(sh, o.orderId)) return { ok: true, duplicate: true };
  var row = HEADERS.map(function () { return ''; });
  row[COL['Created (IST)'] - 1] = ist();
  row[COL['Order ID'] - 1] = o.orderId;
  row[COL['Status'] - 1] = o.status || 'pending_payment';
  row[COL['Plan'] - 1] = o.plan;
  row[COL['Amount (₹)'] - 1] = o.amount;
  row[COL['Topic'] - 1] = o.topic;
  row[COL['Language'] - 1] = o.lang;
  row[COL['Year'] - 1] = o.year;
  row[COL['Name'] - 1] = o.name;
  row[COL['Partner Name'] - 1] = o.partner || '';
  row[COL['Email'] - 1] = o.email;
  row[COL['WhatsApp'] - 1] = "'" + (o.whatsapp || '');
  row[COL['Date of Birth'] - 1] = "'" + (o.dob || '');
  row[COL['Cards'] - 1] = (o.cardIds || []).join(',');
  row[COL['Coupon'] - 1] = o.coupon ? 'yes' : '';
  if (o.dueDate) row[COL['Due Date'] - 1] = "'" + o.dueDate;
  if (o.status === 'sending' || o.status === 'paid') row[COL['Paid (IST)'] - 1] = ist();
  row[COL['Attempts'] - 1] = 0;
  if (o.status === 'sending') row[COL['Claimed At'] - 1] = new Date().toISOString();
  sh.appendRow(row);
  return { ok: true };
}

// Payment confirmed (client verify or Razorpay webhook). Idempotent.
function paid(sh, d) {
  var r = find(sh, d.orderId);
  if (!r) return { ok: false, error: 'not-found' };
  var status = cell(sh, r, 'Status');
  if (status !== 'pending_payment') return { ok: true, already: true, order: toOrder(sh, r) };
  set(sh, r, 'Status', 'paid');
  set(sh, r, 'Payment ID', d.paymentId || '');
  set(sh, r, 'Paid (IST)', ist());
  set(sh, r, 'Due Date', "'" + d.dueDate);
  return { ok: true, transitioned: true, order: toOrder(sh, r) };
}

// Return and lock every paid order whose due date has arrived.
// Rows stuck in 'sending' for > 30 min (crashed run) become eligible again.
function claimDue(sh, d) {
  var today = String(d.today), limit = Number(d.limit || 10), out = [];
  var last = sh.getLastRow();
  if (last < 2) return { ok: true, orders: [] };
  var now = Date.now();
  for (var r = 2; r <= last && out.length < limit; r++) {
    var st = cell(sh, r, 'Status');
    var due = String(cell(sh, r, 'Due Date')).replace(/^'/, '');
    var stale = st === 'sending' && (now - new Date(cell(sh, r, 'Claimed At')).getTime() > 30 * 60 * 1000);
    if ((st === 'paid' && due && due <= today) || stale) {
      set(sh, r, 'Status', 'sending');
      set(sh, r, 'Claimed At', new Date().toISOString());
      out.push(toOrder(sh, r));
    }
  }
  return { ok: true, orders: out };
}

// Lock a single order for immediate sending (coupon orders).
function claimOne(sh, d) {
  var r = find(sh, d.orderId);
  if (!r) return { ok: false, error: 'not-found' };
  if (cell(sh, r, 'Status') === 'sent') return { ok: false, error: 'already-sent' };
  set(sh, r, 'Status', 'sending');
  set(sh, r, 'Claimed At', new Date().toISOString());
  return { ok: true, order: toOrder(sh, r) };
}

function failed(sh, d) {
  var r = find(sh, d.orderId);
  if (!r) return { ok: false, error: 'not-found' };
  set(sh, r, 'Status', 'paid'); // back in the queue; next run retries
  set(sh, r, 'Attempts', Number(cell(sh, r, 'Attempts') || 0) + 1);
  set(sh, r, 'Last Error', String(d.error || '').slice(0, 300));
  return { ok: true };
}

function update(sh, orderId, fields) {
  var r = find(sh, orderId);
  if (!r) return { ok: false, error: 'not-found' };
  Object.keys(fields).forEach(function (k) { set(sh, r, k, fields[k]); });
  return { ok: true };
}

function find(sh, orderId) {
  var last = sh.getLastRow();
  if (!orderId || last < 2) return 0;
  var ids = sh.getRange(2, COL['Order ID'], last - 1, 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) if (String(ids[i][0]) === String(orderId)) return i + 2;
  return 0;
}

function toOrder(sh, r) {
  var v = sh.getRange(r, 1, 1, HEADERS.length).getValues()[0];
  var g = function (h) { return v[COL[h] - 1]; };
  var s = function (h) { return String(g(h) == null ? '' : g(h)).replace(/^'/, ''); };
  return {
    orderId: s('Order ID'), status: s('Status'), plan: s('Plan'), amount: Number(g('Amount (₹)')) || 0,
    topic: s('Topic'), lang: s('Language'), year: Number(g('Year')), name: s('Name'), partner: s('Partner Name'),
    email: s('Email'), whatsapp: s('WhatsApp'), dob: s('Date of Birth'),
    cardIds: s('Cards').split(',').filter(String).map(Number),
    paymentId: s('Payment ID'), dueDate: s('Due Date'), coupon: s('Coupon') === 'yes',
  };
}

function cell(sh, r, h) { return sh.getRange(r, COL[h]).getValue(); }
function set(sh, r, h, v) { sh.getRange(r, COL[h]).setValue(v); }
function ist() { return Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm'); }
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
