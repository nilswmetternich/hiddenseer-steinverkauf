# Live Stock via Google Sheet — Setup Guide

This lets you manage stock by editing a spreadsheet (including from the
Google Sheets phone app) instead of editing code. Takes about 10 minutes.

## 1. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**
2. Rename the bottom tab to exactly: `Stock`
3. In row 1, add these headers exactly: `id`, `name`, `stock`
4. Fill in one row per product, matching your current catalog:

| id | name | stock |
|----|------|-------|
| 1  | Hiddensee Feuerstein | 12 |
| 2  | Bernstein (roh) | 5 |
| 3  | Kieselstein-Set | 0 |
| 4  | Schlüsselanhänger – Leuchtturm | 20 |
| 5  | Schlüsselanhänger – Seepferdchen | 8 |
| 6  | Magnet – Hiddensee Karte | 30 |
| 7  | Magnet – Sonnenuntergang | 15 |
| 8  | Magnet – Seepferdchen | 22 |
| 9  | Kunstdruck – Hiddenseer Küste | 6 |
| 10 | Postkarte-Set (6 Stück) | 18 |

(The `id` numbers must match the `id` values in `js/products.js` — don't
change those, they're how the site matches a sheet row to a product.)

## 2. Add the Apps Script

1. In your new Sheet, go to **Extensions → Apps Script**
2. Delete any placeholder code in the editor
3. Paste in the entire contents of `Code.gs` (in this same folder)
4. Click the **save icon** (or Ctrl/Cmd+S)

## 3. Deploy it as a Web App

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Select type" → choose **Web app**
3. Fill in:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. The first time, Google will ask you to **authorize** the script — click
   through (it'll warn "Google hasn't verified this app" since it's your
   own personal script; click **Advanced → Go to [project name] (unsafe)**,
   then **Allow**)
6. Copy the **Web app URL** it gives you — looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

## 4. Paste the URL into your website

Open `js/stock.js` and replace this line near the top:

```js
const STOCK_API_URL = 'YOUR_APPS_SCRIPT_URL';
```

with your real URL, e.g.:

```js
const STOCK_API_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
```

Save, and re-upload your site files.

## 5. Test it

1. Open your live site, reserve an item
2. Check the Google Sheet — that item's stock number should have dropped
3. Refresh the site on a different device/browser — it should show the
   new, lower number too
4. To test the sold-out email: set some item's stock to 1 in the sheet,
   then reserve it on the site — you should get an email within a few
   seconds

## Notes

- If you ever edit stock directly in the Sheet, it takes effect on the
  website within ~20 seconds (the site re-checks periodically) or
  immediately on next page load — no redeploy needed.
- If you ever need to change the notification email, edit the
  `OWNER_EMAIL` constant at the top of `Code.gs`, save, and create a
  **new deployment** (Deploy → Manage deployments → edit → New version)
  — code changes don't take effect on an existing deployment until you do
  this.
- Product names, prices, descriptions, and images still live in
  `js/products.js` as before — only the stock number is now shared via
  the Sheet.
