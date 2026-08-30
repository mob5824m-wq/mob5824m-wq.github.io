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

- The frontend loads products from `/api/products`
- The backend tries JSON-LD first, then a generic HTML parser
- If no allowed remote source is configured, bundled demo products are used
- Product pages show source information when available
- The cart stores items locally in the browser
- The cart checkout button redirects shoppers to Athleta Canada

## Note

GitHub Pages can host the static `/NA/` files, but it cannot run `server.py`. For that reason:

- on plain GitHub Pages, the `/NA/` storefront falls back to `data/fallback-products.json`
- for live remote catalog proxying, deploy the Python backend on a host that supports server-side code
