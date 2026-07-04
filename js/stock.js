// ===== HIDDENSEER STEINVERKAUF — LIVE STOCK (Google Sheet backend) =====
//
// SETUP: paste your Apps Script Web App URL below after deploying it.
// See GOOGLE_SHEET_SETUP.md for the full step-by-step guide.
const STOCK_API_URL = 'https://script.google.com/macros/s/AKfycbwXNTq-fk4bfw99qgR-oUlQnCAEmuf7DHPxKwU-Fpfo7UxBJJWAKFqoHxgOu4PG031aDw/exec';

// How often to re-check the sheet while someone has the page open (ms)
const STOCK_POLL_INTERVAL = 20000;

let stockLoaded = false;

// Fetch current stock for every product from the Google Sheet and merge
// it into the local PRODUCTS array (names/prices/descriptions stay local —
// only the `stock` number is shared across all visitors via the sheet).
async function fetchStock() {
  if (STOCK_API_URL === 'YOUR_APPS_SCRIPT_URL') return; // not configured yet

  try {
    const resp = await fetch(STOCK_API_URL, { method: 'GET' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const rows = await resp.json();

    rows.forEach(row => {
      const product = PRODUCTS.find(p => p.id === Number(row.id));
      if (product) product.stock = Number(row.stock);
    });

    stockLoaded = true;
    renderProducts();
  } catch (e) {
    console.error('Could not load live stock, showing local defaults:', e);
  }
}

// Tell the sheet that these items were just reserved, so it can decrement
// stock for every future visitor and email the owner if anything hits 0.
// Uses text/plain as the content-type on purpose — Apps Script Web Apps
// don't handle CORS preflight (OPTIONS) requests, and sending as text/plain
// avoids the browser triggering one, while the script still parses it as JSON.
async function reportReservationToSheet(items) {
  if (STOCK_API_URL === 'YOUR_APPS_SCRIPT_URL') return { ok: false };

  try {
    const resp = await fetch(STOCK_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ items })
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (e) {
    console.error('Could not update live stock sheet:', e);
    return { ok: false };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Give products.js a moment to render its local defaults first, then
  // overlay real stock from the sheet as soon as it arrives.
  setTimeout(fetchStock, 100);
  setInterval(fetchStock, STOCK_POLL_INTERVAL);
});
