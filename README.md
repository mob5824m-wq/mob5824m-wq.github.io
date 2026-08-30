# North Active Shop

This repo now includes a storefront mounted at `/na/` with uppercase `/NA/` aliases.

## Pages

- `/na/` – catalog page
- `/na/<product-slug>/` – individual product webpages
- `/na/product.html?id=...` – legacy product detail route
- `/na/cart.html` – persistent shopping bag and checkout handoff page
- `/NA/...` – uppercase aliases for compatibility

The root `/` redirects to `/na/`.

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
- Each product now has its own static page under `/NA/products/<product-slug>/`
- Product cards and product pages use the hosted image links from your JSON
- Product pages show swappable gallery images, source information, reviews, variants, and checkout links
- The cart stores items locally in the browser
- The cart checkout button redirects shoppers to Athleta Canada using the closest matching product/category source page
- The backend `/api/products` still exists as an optional server-side source path

## Rebuild hosted pages/data

If you update `athleta-combined-catalog.json`, regenerate the hosted storefront data and per-product pages with:

```bash
python3 scripts/build_na_catalog.py
```

## Note

GitHub Pages can host the static `/NA/` files and JSON files, but it cannot run `server.py`. For that reason:

- on plain GitHub Pages, the `/NA/` storefront works directly from the hosted JSON files in the repo
- for live remote catalog proxying beyond the committed JSON, deploy the Python backend on a host that supports server-side code
