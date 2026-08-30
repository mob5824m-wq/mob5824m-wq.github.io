# North Active Shop

This repo now includes a storefront mounted at `/NA/`.

## Pages

- `/NA/` – catalog page
- `/NA/product.html?id=...` – product detail page
- `/NA/cart.html` – persistent shopping bag and checkout handoff page

The root `/` redirects to `/NA/`.

## Backend

Run locally with:

```bash
python3 server.py
```

Endpoints:

- `/api/health`
- `/api/products`

## Source configuration

Edit `source.config.json` to connect an approved remote source:

```json
{
  "sourceUrl": "https://your-approved-source.example/collection",
  "sourceName": "Your Approved Source",
  "allowedHosts": ["your-approved-source.example"],
  "cacheTtlSeconds": 900,
  "mode": "auto",
  "userAgent": "NorthActiveCatalogProxy/1.0",
  "checkoutUrl": "https://athleta.gapcanada.ca/",
  "checkoutName": "Athleta Canada",
  "currency": "CAD"
}
```

## Current behavior

- The frontend first loads products from `data/athleta-storefront.json`
- That hosted storefront file is generated from `athleta-combined-catalog.json`
- Product cards and product pages use the hosted image links from your JSON
- Product pages show source information, reviews, variants, and gallery images when present
- The cart stores items locally in the browser
- The cart checkout button redirects shoppers to Athleta Canada
- The backend `/api/products` still exists as an optional server-side source path

## Note

GitHub Pages can host the static `/NA/` files and JSON files, but it cannot run `server.py`. For that reason:

- on plain GitHub Pages, the `/NA/` storefront can work directly from the hosted JSON files in the repo
- for live remote catalog proxying beyond the committed JSON, deploy the Python backend on a host that supports server-side code
