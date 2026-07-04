// ===== HIDDENSEER STEINVERKAUF — LIVE STOCK (Google Sheet backend) =====
//
// SETUP: paste your Apps Script Web App URL below after deploying it.
// See GOOGLE_SHEET_SETUP.md for the full step-by-step guide.
const STOCK_API_URL = 'https://script.google.com/macros/s/AKfycbwXNTq-fk4bfw99qgR-oUlQnCAEmuf7DHPxKwU-Fpfo7UxBJJWAKFqoHxgOu4PG031aDw/exec';

// How often to re-check the sheet while someone has the page open (ms)
const STOCK_POLL_INTERVAL = 20000;

let stockLoaded = false;

// Apps Script Web Apps don't send CORS headers, so a normal cross-origin
// fetch() gets blocked by the browser even though the request succeeds
// server-side. JSONP (loading the response via a <script> tag) sidesteps
// this, since browsers don't apply CORS rules to script tags.
function jsonpRequest(url, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const callbackName = 'stockCb_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    const script = document.createElement('script');

    const cleanup = () => {
      delete window[callbackName];
      script.remove();
    };

    window[callbackName] = (data) => { cleanup(); resolve(data); };
    script.onerror = () => { cleanup(); reject(new Error('JSONP request failed to load')); };

    const separator = url.includes('?') ? '&' : '?';
    script.src = `${url}${separator}callback=${callbackName}`;
    document.body.appendChild(script);

    setTimeout(() => {
      if (window[callbackName]) { cleanup(); reject(new Error('JSONP request timed out')); }
    }, timeoutMs);
  });
}

// Fetch current stock for every product from the Google Sheet and merge
// it into the local PRODUCTS array (names/prices/descriptions stay local —
// only the `stock` number is shared across all visitors via the sheet).
async function fetchStock() {
  if (STOCK_API_URL === 'YOUR_APPS_SCRIPT_URL') return; // not configured yet

  try {
    const rows = await jsonpRequest(STOCK_API_URL);

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
//
// Uses navigator.sendBeacon instead of fetch() — Apps Script Web Apps
// respond via an internal redirect that trips up fetch()'s CORS handling
// in some browsers (notably Safari), even in fire-and-forget modes.
// sendBeacon is built exactly for "send this, don't need the response"
// requests like this one, and isn't subject to that CORS blocking.
async function reportReservationToSheet(items) {
  if (STOCK_API_URL === 'YOUR_APPS_SCRIPT_URL') return;

  try {
    const blob = new Blob([JSON.stringify({ items })], { type: 'text/plain;charset=utf-8' });
    const queued = navigator.sendBeacon(STOCK_API_URL, blob);
    if (!queued) console.error('Browser could not queue the stock update (sendBeacon returned false)');
  } catch (e) {
    console.error('Could not reach stock sheet (reservation still went through):', e);
  }

  // Give the sheet a moment to save, then refresh so stock is accurate
  // everywhere — including the sold-out email logic on the sheet's side.
  setTimeout(fetchStock, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
  // Give products.js a moment to render its local defaults first, then
  // overlay real stock from the sheet as soon as it arrives.
  setTimeout(fetchStock, 100);
  setInterval(fetchStock, STOCK_POLL_INTERVAL);
});

