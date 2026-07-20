// ===== HIDDENSEER STEINVERKAUF — PRODUCTS =====
// To add real images: place them in images/stones/, images/keyrings/, images/magnets/, images/pictures/
// Then update the `image` field below to e.g. "images/stones/my-stone.jpg"

const PRODUCTS = [
  // STONES
  {
    id: 1, category: "stones",
    name_de: "Hiddensee Feuerstein", name_en: "Hiddensee Flint", name_es: "Sílex de Hiddensee", name_sv: "Hiddensee Flintsten", name_da: "Hiddensee Flintsten",
    desc_de: "Natürlicher Feuerstein aus der Ostsee, glatt poliert.", desc_en: "Natural Baltic flint, smoothly polished.", desc_es: "Sílex natural del Báltico, suavemente pulido.", desc_sv: "Naturlig Östersjöflint, slätpolerad.", desc_da: "Naturlig Østersøflint, glatpoleret.",
    price: 4.50, stock: 12, emoji: "🪨", image: null
  },
  {
    id: 2, category: "stones",
    name_de: "Bernstein (roh)", name_en: "Raw Amber", name_es: "Ámbar crudo", name_sv: "Rå Bärnsten", name_da: "Rå Rav",
    desc_de: "Echter Ostsee-Bernstein, naturbelassen und einzigartig.", desc_en: "Genuine Baltic amber, natural and unique.", desc_es: "Ámbar báltico auténtico, natural y único.", desc_sv: "Äkta Östersjöbärnsten, naturlig och unik.", desc_da: "Ægte Østersørav, naturligt og unikt.",
    price: 8.00, stock: 5, emoji: "🟡", image: null
  },
  {
    id: 3, category: "stones",
    name_de: "Kieselstein-Set", name_en: "Pebble Set", name_es: "Set de cantos rodados", name_sv: "Kiselpåse", name_da: "Stensamling",
    desc_de: "5 ausgewählte Kieselsteine aus Hiddensee.", desc_en: "5 selected pebbles from Hiddensee.", desc_es: "5 cantos rodados seleccionados de Hiddensee.", desc_sv: "5 utvalda kiselstenar från Hiddensee.", desc_da: "5 udvalgte sten fra Hiddensee.",
    price: 6.00, stock: 0, emoji: "⚪", image: null
  },
  // KEYRINGS
  {
    id: 11, category: "keyrings",
    name_de: "Schlüsselanhänger – Muschel", name_en: "Seashell Keyring", name_es: "Llavero Concha", name_sv: "Snäckskalsnyckelring", name_da: "Muslingenøglering",
    desc_de: "Handgemachter Schlüsselanhänger mit echter Muschel von Hiddensee.", desc_en: "Handmade keyring featuring a genuine Hiddensee seashell.", desc_es: "Llavero artesanal con una concha auténtica de Hiddensee.", desc_sv: "Handgjord nyckelring med ett äkta snäckskal från Hiddensee.", desc_da: "Håndlavet nøglering med en ægte Hiddensee-musling.",
    price: 3.00, stock: 20, emoji: "🐚", image: "images/keyrings/seashell.png"
  },
  // MAGNETS
  {
    id: 6, category: "magnets",
    name_de: "Magnet – Hiddensee Karte", name_en: "Hiddensee Map Magnet", name_es: "Imán Mapa Hiddensee", name_sv: "Hiddensee Kartmagnet", name_da: "Hiddensee Kortmagnet",
    desc_de: "Holzmagnet mit der Form der Insel Hiddensee.", desc_en: "Wooden magnet shaped like Hiddensee island.", desc_es: "Imán de madera con la forma de la isla Hiddensee.", desc_sv: "Trämagnet formad som ön Hiddensee.", desc_da: "Træmagnet formet som øen Hiddensee.",
    price: 2.50, stock: 30, emoji: "🧲", image: null
  },
  {
    id: 7, category: "magnets",
    name_de: "Magnet – Sonnenuntergang", name_en: "Sunset Magnet", name_es: "Imán Atardecer", name_sv: "Solnedgångsmagnet", name_da: "Solnedgangsmagnet",
    desc_de: "Foto-Magnet mit einem atemberaubenden Hiddensee-Sonnenuntergang.", desc_en: "Photo magnet featuring a stunning Hiddensee sunset.", desc_es: "Imán fotográfico con una impresionante puesta de sol en Hiddensee.", desc_sv: "Fotomagnet med en fantastisk solnedgång på Hiddensee.", desc_da: "Fotomagnet med en fantastisk solnedgang på Hiddensee.",
    price: 2.00, stock: 15, emoji: "🌅", image: null
  },
  {
    id: 8, category: "magnets",
    name_de: "Magnet – Seepferdchen", name_en: "Seahorse Magnet", name_es: "Imán Caballito de mar", name_sv: "Sjöhästmagnet", name_da: "Søhestmagnet",
    desc_de: "Metallmagnet mit goldenem Seepferdchen-Motiv.", desc_en: "Metal magnet with golden seahorse motif.", desc_es: "Imán metálico con motivo de caballito de mar dorado.", desc_sv: "Metallmagnet med gyllene sjöhästmotiv.", desc_da: "Metalmagnet med gyldent søhestmotiv.",
    price: 3.00, stock: 22, emoji: "🐠", image: null
  },
  // PICTURES
  {
    id: 9, category: "pictures",
    name_de: "Kunstdruck – Hiddenseer Küste", name_en: "Art Print – Hiddensee Coast", name_es: "Impresión – Costa Hiddensee", name_sv: "Konstprint – Hiddensee Kust", name_da: "Kunsttryk – Hiddensee Kyst",
    desc_de: "Hochweriger A4-Kunstdruck der Hiddenseer Küste.", desc_en: "High-quality A4 art print of the Hiddensee coastline.", desc_es: "Impresión artística A4 de alta calidad de la costa de Hiddensee.", desc_sv: "Högkvalitativt A4-konstprint av Hiddensees kustlinje.", desc_da: "Højkvalitets A4-kunsttryk af Hiddensees kystlinje.",
    price: 12.00, stock: 6, emoji: "🖼️", image: null
  },
  {
    id: 10, category: "pictures",
    name_de: "Postkarte-Set (6 Stück)", name_en: "Postcard Set (6 pieces)", name_es: "Set de postales (6 piezas)", name_sv: "Vykortset (6 st)", name_da: "Postkortset (6 stk.)",
    desc_de: "6 Postkarten mit den schönsten Motiven von Hiddensee.", desc_en: "6 postcards featuring the most beautiful Hiddensee scenes.", desc_es: "6 postales con las escenas más bonitas de Hiddensee.", desc_sv: "6 vykort med de vackraste Hiddensee-scenerna.", desc_da: "6 postkort med de smukkeste Hiddensee-scener.",
    price: 5.00, stock: 18, emoji: "📬", image: null
  }
];

let currentFilter = 'all';

function getProductName(p) {
  const lang = currentLang || 'de';
  return p[`name_${lang}`] || p.name_de;
}

function getProductDesc(p) {
  const lang = currentLang || 'de';
  return p[`desc_${lang}`] || p.desc_de;
}

function getStockLabel(stock) {
  if (stock === 0) return `<span class="product-stock stock-out">${t('sold_out')}</span>`;
  if (stock <= 5) return `<span class="product-stock stock-low">⚠️ ${stock} ${t('in_stock')}</span>`;
  return `<span class="product-stock stock-ok">✓ ${stock} ${t('in_stock')}</span>`;
}

function filterCat(cat, event) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const filtered = currentFilter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === currentFilter);

  grid.innerHTML = filtered.map(p => {
    return `
    <div class="product-card" data-category="${p.category}">
      <div class="product-img">
        ${p.image ? `<img src="${p.image}" alt="${getProductName(p)}" loading="lazy">` : p.emoji}
        <span class="product-cat-badge">${p.category}</span>
      </div>
      <div class="product-body">
        <div class="product-name">${getProductName(p)}</div>
        <div class="product-desc">${getProductDesc(p)}</div>
        <div class="product-footer">
          <div class="product-price">€${p.price.toFixed(2)}</div>
          ${getStockLabel(p.stock)}
        </div>
        <button class="add-to-basket-btn"
          onclick="addToBasket(${p.id})"
          ${p.stock === 0 ? 'disabled' : ''}>
          ${p.stock === 0 ? t('sold_out') : t('add_basket')}
        </button>
      </div>
    </div>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(renderProducts, 50); // after i18n init
});
