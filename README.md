# Hiddenseer Steinverkauf — Website Guide

## Ordner-Struktur / Folder Structure

```
hiddenseer/
├── index.html          ← Hauptseite (Shop, Warenkorb, Mitgliedschaft)
├── about.html          ← Über uns Seite
├── css/
│   └── style.css       ← Alle Styles
├── js/
│   ├── i18n.js         ← Übersetzungen (DE, EN, ES, SV, DA)
│   ├── products.js     ← Produkte & Warenkorb-Logik
│   ├── fireworks.js    ← Feuerwerk-Animation
│   └── app.js          ← Bestellungen, Mitgliedschaft, E-Mail
└── images/
    ├── stones/         ← Bilder für Steine hier ablegen
    ├── keyrings/       ← Bilder für Schlüsselanhänger
    ├── magnets/        ← Bilder für Magneten
    └── pictures/       ← Bilder für Kunstdrucke/Bilder
```

---

## Bilder hinzufügen / Adding Images

1. Lege dein Bild in den passenden Unterordner (z.B. `images/stones/mein-stein.jpg`)
2. Öffne `js/products.js`
3. Suche das Produkt und ändere `image: null` zu `image: "images/stones/mein-stein.jpg"`

---

## Neue Produkte hinzufügen / Adding New Products

Öffne `js/products.js` und füge ein neues Objekt zum `PRODUCTS`-Array hinzu:

```javascript
{
  id: 11,                          // Eindeutige ID (weiterführend)
  category: "stones",             // stones / keyrings / magnets / pictures
  name_de: "Mein Produkt",        // Produktname auf Deutsch
  name_en: "My Product",          // Englisch
  name_es: "Mi producto",         // Spanisch
  name_sv: "Min produkt",         // Schwedisch
  name_da: "Mit produkt",         // Dänisch
  desc_de: "Beschreibung...",     // Beschreibung auf Deutsch
  desc_en: "Description...",      // Beschreibung Englisch
  desc_es: "Descripción...",      // Spanisch
  desc_sv: "Beskrivning...",      // Schwedisch
  desc_da: "Beskrivelse...",      // Dänisch
  price: 5.00,                    // Preis in Euro
  stock: 10,                      // Anzahl verfügbar
  emoji: "🪨",                    // Emoji als Platzhalter (wenn kein Bild)
  image: null                     // oder "images/stones/foto.jpg"
}
```

---

## E-Mail-Benachrichtigungen einrichten / Setting Up Email Notifications

### Option 1: Formspree (empfohlen / recommended)
1. Gehe zu [formspree.io](https://formspree.io) und erstelle ein kostenloses Konto
2. Erstelle ein neues Formular mit deiner E-Mail-Adresse
3. Kopiere deine Form-ID (z.B. `xpznqkwy`)
4. Öffne `js/app.js` und ersetze `'YOUR_FORMSPREE_ID'` mit deiner Form-ID (erscheint 2x)
5. Ersetze `DEINE_EMAIL@beispiel.de` mit deiner echten E-Mail-Adresse

### Option 2: Mailto (Fallback)
Wenn kein Formspree eingerichtet ist, öffnet die Website automatisch das Standard-E-Mail-Programm des Geräts. Ersetze `DEINE_EMAIL@beispiel.de` in `js/app.js` mit deiner echten E-Mail.

---

## Öffnungszeiten ändern / Changing Opening Hours

Suche in `index.html` und `about.html` die Texte wie `10:00 – 18:00` und ändere sie nach Bedarf.

---

## Website online stellen / Hosting the Website

Die Website ist eine statische HTML-Seite. Du kannst sie kostenlos hosten bei:
- **Netlify**: netlify.com — Einfach den Ordner hochladen
- **GitHub Pages**: github.com
- **Tiiny.host**: tiiny.host — Super einfach für Anfänger

---

## Features Übersicht / Feature Summary

✅ 5 Sprachen: Deutsch, Englisch, Spanisch, Schwedisch, Dänisch
✅ Feuerwerk-Animation zum 10-jährigen Jubiläum
✅ Produktkatalog mit 4 Kategorien
✅ Lagerbestand-Anzeige
✅ Warenkorb-Funktion
✅ Reservierungsformular (Name + E-Mail + Kommentar)
✅ 24-Stunden-Reservierungslimit (mit Kommentar-Option für andere Zeiten)
✅ E-Mail-Benachrichtigung (Formspree oder Mailto)
✅ €2 Mitgliedschaft mit QR-Code
✅ Öffnungszeiten prominent angezeigt
✅ Preise bei jedem Artikel
✅ Google Maps eingebettet
✅ Über uns Seite
✅ Responsive (Mobil + Desktop)
✅ Farben: #005B94 (Blau) + #FDB913 (Gold)
