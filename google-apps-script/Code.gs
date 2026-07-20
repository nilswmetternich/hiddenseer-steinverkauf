// ===== HIDDENSEER STEINVERKAUF — STOCK SHEET BACKEND =====
// Paste this entire file into the Apps Script editor attached to your
// Google Sheet (Extensions → Apps Script). See GOOGLE_SHEET_SETUP.md
// for the full setup walkthrough.

// Email that gets notified when an item's stock reaches 0
const OWNER_EMAIL = 'nilsmetternich@gmail.com';

// Name of the sheet tab that holds your stock table
const SHEET_NAME = 'Stock';

// ── Handles GET requests: returns current stock for every product ──
// Supports JSONP via a ?callback= parameter, since Apps Script Web Apps
// don't send CORS headers and a plain cross-origin fetch() would be
// blocked by the browser even though the request succeeds.
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();

  const idIdx = headers.indexOf('id');
  const nameIdx = headers.indexOf('name');
  const stockIdx = headers.indexOf('stock');

  const result = data
    .filter(row => row[idIdx] !== '')
    .map(row => ({
      id: row[idIdx],
      name: row[nameIdx],
      stock: row[stockIdx]
    }));

  const callback = e.parameter && e.parameter.callback;
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Handles POST requests: decrements stock for reserved items ──
// Expected body: { "items": [ { "id": 1, "qty": 2 }, ... ] }
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // avoid two simultaneous reservations corrupting stock

  try {
    const payload = JSON.parse(e.postData.contents);
    const items = payload.items || [];

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIdx = headers.indexOf('id');
    const nameIdx = headers.indexOf('name');
    const stockIdx = headers.indexOf('stock');

    const soldOutNames = [];

    items.forEach(item => {
      for (let i = 1; i < data.length; i++) {
        if (Number(data[i][idIdx]) === Number(item.id)) {
          const rowNum = i + 1; // sheet rows are 1-indexed
          const currentStock = Number(data[i][stockIdx]) || 0;
          const newStock = Math.max(0, currentStock - (Number(item.qty) || 1));

          sheet.getRange(rowNum, stockIdx + 1).setValue(newStock);

          if (newStock === 0 && currentStock > 0) {
            soldOutNames.push(data[i][nameIdx]);
          }
          break;
        }
      }
    });

    if (soldOutNames.length > 0) {
      MailApp.sendEmail({
        to: OWNER_EMAIL,
        subject: '⚠️ Artikel ausverkauft / Item sold out — Hiddenseer Steinverkauf',
        body: 'Die folgenden Artikel sind gerade ausverkauft:\n\n' +
              soldOutNames.map(n => '- ' + n).join('\n') +
              '\n\nBitte im Laden nachlegen oder den Bestand in der Tabelle anpassen.'
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, soldOut: soldOutNames }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
