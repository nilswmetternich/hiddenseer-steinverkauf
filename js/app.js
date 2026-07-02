// ===== HIDDENSEER STEINVERKAUF — APP LOGIC =====

// ── EMAIL SETUP ──
// 1) Go to https://formspree.io, make a free account + form pointed at your email.
// 2) Paste your form ID below (e.g. 'xpznqkwy') instead of 'YOUR_FORMSPREE_ID'.
// Until you do this, reservations fall back to opening the CUSTOMER's own email
// app with a pre-filled message — they still have to press "send" themselves,
// so some reservations may not reach you. Formspree sends it automatically.
const FORMSPREE_ENDPOINT = 'xzdlkrkq';
const OWNER_EMAIL = 'jaspermetternich@gmail.com'; // used only for the mailto fallback

// ── BASKET STATE ──
let basket = [];

function addToBasket(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product || product.stock === 0) return;

  // Check if already in basket
  const existing = basket.find(b => b.id === productId);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    basket.push({ ...product, qty: 1 });
  }

  updateBasketUI();
  showBasketPulse();
}

function removeFromBasket(productId) {
  basket = basket.filter(b => b.id !== productId);
  updateBasketUI();
}

function updateBasketUI() {
  const count = basket.reduce((sum, b) => sum + (b.qty || 1), 0);
  const countEl = document.getElementById('basket-count');
  if (countEl) countEl.textContent = count;

  // Items list
  const itemsEl = document.getElementById('basket-items');
  const emptyEl = document.getElementById('basket-empty');
  const footerEl = document.getElementById('basket-footer');
  if (!itemsEl) return;

  if (basket.length === 0) {
    itemsEl.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    if (footerEl) footerEl.classList.add('hidden');
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');
  if (footerEl) footerEl.classList.remove('hidden');

  itemsEl.innerHTML = basket.map(b => `
    <div class="basket-item">
      <div class="basket-item-emoji">${b.emoji}</div>
      <div class="basket-item-info">
        <div class="basket-item-name">${getProductName(b)} ${b.qty > 1 ? `×${b.qty}` : ''}</div>
        <div class="basket-item-price">€${(b.price * (b.qty || 1)).toFixed(2)}</div>
      </div>
      <button class="basket-item-remove" onclick="removeFromBasket(${b.id})" title="Entfernen">✕</button>
    </div>
  `).join('');

  // Total
  const total = basket.reduce((sum, b) => sum + b.price * (b.qty || 1), 0);
  const totalEl = document.getElementById('basket-total-price');
  if (totalEl) totalEl.textContent = `€${total.toFixed(2)}`;
}

function showBasketPulse() {
  const icon = document.getElementById('basket-icon');
  if (!icon) return;
  icon.style.transform = 'scale(1.2)';
  setTimeout(() => { icon.style.transform = 'scale(1)'; }, 200);
}

// ── BASKET DRAWER ──
function toggleBasket() {
  const drawer = document.getElementById('basket-drawer');
  if (!drawer) return;
  drawer.classList.toggle('hidden');
}

// ── CHECKOUT ──
function showCheckout() {
  const drawer = document.getElementById('basket-drawer');
  if (drawer) drawer.classList.add('hidden');

  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  // Populate summary
  const summary = document.getElementById('checkout-summary');
  if (summary) {
    const total = basket.reduce((sum, b) => sum + b.price * (b.qty || 1), 0);
    summary.innerHTML = `
      <strong>${t('basket_title')}</strong>
      <ul style="margin:8px 0 4px;padding-left:16px;">
        ${basket.map(b => `<li>${getProductName(b)} ${b.qty > 1 ? `×${b.qty}` : ''} — €${(b.price * (b.qty || 1)).toFixed(2)}</li>`).join('')}
      </ul>
      <strong>${t('total')} €${total.toFixed(2)}</strong>
    `;
  }
  modal.classList.remove('hidden');
}

function closeCheckout() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('hidden');
}

async function submitReservation() {
  const name = document.getElementById('checkout-name')?.value.trim();
  const comment = document.getElementById('checkout-comment')?.value.trim();

  if (!name) { alert('Bitte gib deinen Namen ein. / Please enter your name.'); return; }
  if (basket.length === 0) { alert('Dein Warenkorb ist leer. / Your basket is empty.'); return; }

  const total = basket.reduce((sum, b) => sum + b.price * (b.qty || 1), 0);
  const itemsList = basket.map(b => `${getProductName(b)} x${b.qty || 1} (€${(b.price * (b.qty || 1)).toFixed(2)})`).join('\n');
  const hasComment = comment && comment.length > 0;

  const payload = {
    type: '🛒 RESERVIERUNG / RESERVATION',
    customer_name: name,
    items: itemsList,
    total: `€${total.toFixed(2)}`,
    comment: comment || '—',
    pickup_deadline: hasComment
      ? `Sonderabsprache gewünscht / Special arrangement requested`
      : `Innerhalb 24 Stunden / Within 24 hours`,
    timestamp: new Date().toLocaleString('de-DE')
  };

  // ── SEND EMAIL NOTIFICATION ──
  // Your site is static HTML/CSS/JS with no build step, and the reservation
  // isn't a single native <form> (it's assembled from basket state), so we
  // talk to Formspree directly via fetch — this is the same underlying
  // mechanism their @formspree/ajax library wraps, just without the extra
  // dependency, since a bundler/build step isn't part of your setup.
  // Everything here is wrapped in try/catch so that even if email sending
  // fails for any reason, the customer still sees a confirmation and the
  // basket/stock still update correctly — a broken notification should
  // never break the reservation itself.
  let sent = false;
  try {
    if (FORMSPREE_ENDPOINT !== 'YOUR_FORMSPREE_ID') {
      const resp = await fetch(`https://formspree.io/f/${FORMSPREE_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        sent = true;
      } else {
        // Formspree returns { errors: [{ field, message }, ...] } on failure
        const data = await resp.json().catch(() => null);
        const msg = data?.errors?.map(e => e.message).join(', ') || `HTTP ${resp.status}`;
        console.error('Formspree rejected the submission:', msg);
      }
    }
  } catch (e) { console.error('Formspree network error:', e); }

  // Fallback mailto if Formspree isn't set up or the request failed
  if (!sent) {
    try {
      const subject = encodeURIComponent(`Neue Reservierung: ${name}`);
      const body = encodeURIComponent(
        `NEUE RESERVIERUNG\n\nName: ${name}\n\nArtikel:\n${itemsList}\n\nGesamt: €${total.toFixed(2)}\n\nAbholung: ${payload.pickup_deadline}\nKommentar: ${comment || '—'}\n\nZeitpunkt: ${payload.timestamp}`
      );
      window.open(`mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`);
    } catch (e) { console.error('Mailto fallback error:', e); }
  }

  // Update stock visually
  basket.forEach(b => {
    const prod = PRODUCTS.find(p => p.id === b.id);
    if (prod) prod.stock = Math.max(0, prod.stock - (b.qty || 1));
  });

  // Clear basket
  basket = [];
  updateBasketUI();
  closeCheckout();
  renderProducts();

  // Show success
  const successTitle = document.getElementById('success-title');
  const successMsg = document.getElementById('success-msg');
  if (successTitle) successTitle.textContent = '✅ Reservierung bestätigt!';
  if (successMsg) successMsg.textContent = `Danke ${name}! Wir haben deine Reservierung erhalten. ${hasComment ? 'Wir melden uns wegen deines Kommentars.' : 'Bitte hole die Artikel innerhalb von 24 Stunden ab.'}`;

  document.getElementById('qr-area')?.classList.add('hidden');
  document.getElementById('success-modal')?.classList.remove('hidden');
}



// ── SUCCESS MODAL ──
function closeSuccess() {
  document.getElementById('success-modal')?.classList.add('hidden');
}

// ── CLOSE MODALS ON ESCAPE ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCheckout();
    closeSuccess();
    const drawer = document.getElementById('basket-drawer');
    if (drawer && !drawer.classList.contains('hidden')) drawer.classList.add('hidden');
  }
});

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  updateBasketUI();
});
