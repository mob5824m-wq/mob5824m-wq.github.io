#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from collections import OrderedDict
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = ROOT / "athleta-combined-catalog.json"
DATA_PATH = ROOT / "data" / "athleta-storefront.json"
NA_PRODUCTS_DIR = ROOT / "NA" / "products"
na_PRODUCTS_DIR = ROOT / "na" / "products"
NA_DIRECT_DIR = ROOT / "NA"
na_DIRECT_DIR = ROOT / "na"
ASSET_VERSION = "20260830c"


def slugify(value: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")).strip("-")


def titleize(text: str) -> str:
    return " ".join(word.capitalize() for word in str(text).replace("&", " & ").split())


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def unique_strings(values):
    seen = set()
    out = []
    for value in values:
        if isinstance(value, str) and value.startswith("http") and value not in seen:
            seen.add(value)
            out.append(value)
    return out


def build_storefront_items(source_items: list[dict]) -> list[OrderedDict]:
    out_items: list[OrderedDict] = []

    for item in source_items:
        details = item.get("details") or {}
        variants = details.get("color_variants") or []
        colors = (item.get("colors_and_images") or {}).get("colors") or []
        all_images = (item.get("colors_and_images") or {}).get("all_images") or []

        primary_variant = min(
            variants,
            key=lambda variant: float(variant.get("price", 999999)) if isinstance(variant.get("price"), (int, float)) else 999999,
            default={},
        )
        variant_prices = [float(variant["price"]) for variant in variants if isinstance(variant.get("price"), (int, float))]
        variant_regulars = [float(variant["regular_price"]) for variant in variants if isinstance(variant.get("regular_price"), (int, float))]
        price = min(variant_prices) if variant_prices else None
        regular_price = max(variant_regulars) if variant_regulars else price
        inventory_count = sum(int(variant.get("inventory_count") or 0) for variant in variants if str(variant.get("inventory_count", "")).isdigit())
        inventory_status = primary_variant.get("inventory_status") or ("In Stock" if inventory_count else "Availability varies")

        image_candidates = []
        for group in [item.get("images") or [], all_images]:
            image_candidates.extend(group)
        if isinstance(primary_variant.get("images"), list):
            image_candidates.extend(img.get("url") for img in primary_variant["images"] if isinstance(img, dict))
        image_candidates = unique_strings(image_candidates)

        color_names = []
        for color in colors:
            if not isinstance(color, dict):
                continue
            label = color.get("description") or color.get("name")
            if label and label not in color_names:
                color_names.append(str(label))

        slim_variants = []
        for variant in variants[:12]:
            variant_images = unique_strings([img.get("url") for img in (variant.get("images") or []) if isinstance(img, dict)])
            slim_variants.append(
                OrderedDict(
                    [
                        ("id", str(variant.get("id", ""))),
                        ("name", variant.get("name") or ""),
                        ("description", variant.get("short_description") or ""),
                        ("price", variant.get("price")),
                        ("regularPrice", variant.get("regular_price")),
                        ("percentageOff", variant.get("percentage_off") or ""),
                        ("inventoryStatus", variant.get("inventory_status") or ""),
                        ("inventoryCount", variant.get("inventory_count")),
                        ("images", variant_images[:4]),
                    ]
                )
            )

        review = item.get("reviews") or {}
        total_colors = (item.get("colors_and_images") or {}).get("total_colors") or len(color_names)
        brand = item.get("brand") or "Athleta"
        category = item.get("category") or details.get("type") or "featured"
        description_bits = [titleize(category)]
        if total_colors:
            description_bits.append(f"{total_colors} color option" + ("s" if total_colors != 1 else ""))
        if review.get("count"):
            description_bits.append(f"{review.get('count')} review" + ("s" if review.get("count") != 1 else ""))
        description = " • ".join(description_bits)
        item_id = str(item.get("id", ""))
        slug = slugify(f"{item.get('name') or 'athleta-item'}-{item_id}")
        source_url = item.get("source_url") or "https://athleta.gapcanada.ca/"

        out_items.append(
            OrderedDict(
                [
                    ("id", item_id),
                    ("slug", slug),
                    ("name", item.get("name") or "Athleta item"),
                    ("category", titleize(category)),
                    ("brand", brand),
                    ("badge", brand),
                    ("description", description),
                    ("price", price),
                    ("regularPrice", regular_price),
                    ("currency", "CAD"),
                    ("fit", titleize(details.get("clothing_type") or details.get("type") or category)),
                    ("inventoryStatus", inventory_status),
                    ("inventoryCount", inventory_count),
                    ("colors", color_names[:12]),
                    ("image", image_candidates[0] if image_candidates else ""),
                    ("gallery", image_candidates[:10]),
                    ("reviews", {"score": review.get("score"), "count": review.get("count")}),
                    ("sourceName", "Athleta Canada"),
                    ("sourceLabel", item.get("source_label") or "Athleta source page"),
                    ("sourceUrl", source_url),
                    ("url", source_url),
                    ("checkoutUrl", source_url),
                    (
                        "details",
                        {
                            "styleId": details.get("style_id"),
                            "type": details.get("type"),
                            "clothingType": details.get("clothing_type"),
                            "freeShipping": details.get("free_shipping"),
                            "excludedFromPromotion": details.get("excluded_from_promotion"),
                        },
                    ),
                    ("variants", slim_variants),
                ]
            )
        )

    return out_items


def product_page_html(product_name: str, product_id: str, styles_href: str, store_js_href: str, product_js_href: str, shop_href: str, cart_href: str) -> str:
    product_name = escape(product_name)
    product_id = escape(product_id)
    return f'''<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{product_name} | North Active</title>
    <meta name="description" content="{product_name} product page on North Active." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="{styles_href}" />
  </head>
  <body data-page="product" data-product-id="{product_id}">
    <div class="site-shell">
      <header class="topbar">
        <a class="brand" href="{shop_href}" aria-label="North Active home">
          <span class="brand-mark">NA</span>
          <span class="brand-copy">
            <strong>North Active</strong>
            <small>Product page</small>
          </span>
        </a>
        <nav class="nav-links" aria-label="Primary navigation">
          <a href="{shop_href}">Shop</a>
          <a href="{cart_href}">Cart</a>
        </nav>
        <a class="bag-button" id="bagButton" href="{cart_href}" aria-label="Shopping cart">
          <span>Bag</span>
          <span class="bag-count" id="bagCount">0</span>
        </a>
      </header>
      <main class="detail-page">
        <section class="detail-layout" id="productDetail"></section>
        <section class="related-section">
          <div class="section-heading simple-heading">
            <div>
              <p class="eyebrow">More to explore</p>
              <h2>Related styles</h2>
            </div>
          </div>
          <div class="product-grid" id="relatedGrid"></div>
        </section>
      </main>
    </div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    <script src="{store_js_href}?v={ASSET_VERSION}"></script>
    <script src="{product_js_href}?v={ASSET_VERSION}"></script>
  </body>
</html>
'''


def write_text(path: Path, content: str) -> None:
    ensure_dir(path.parent)
    path.write_text(content, encoding="utf-8")


def write_legacy_upper_product_page(product: dict) -> None:
    path = NA_PRODUCTS_DIR / product["slug"] / "index.html"
    write_text(
        path,
        product_page_html(
            product["name"],
            product["id"],
            "../../styles.css",
            "../../store.js",
            "../../product-page.js",
            "../../",
            "../../cart.html",
        ),
    )


def write_legacy_lower_product_alias(product: dict) -> None:
    path = na_PRODUCTS_DIR / product["slug"] / "index.html"
    write_text(
        path,
        f'''<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=../../{product['slug']}/" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redirecting to /na/{product['slug']}/</title>
    <script>
      window.location.replace('../../{product['slug']}/' + window.location.search + window.location.hash);
    </script>
  </head>
  <body>
    <p>Redirecting to <a href="../../{product['slug']}/">product page</a>…</p>
  </body>
</html>
''',
    )


def write_direct_lower_product_page(product: dict) -> None:
    path = na_DIRECT_DIR / product["slug"] / "index.html"
    write_text(
        path,
        product_page_html(
            product["name"],
            product["id"],
            "../../NA/styles.css",
            "../../NA/store.js",
            "../../NA/product-page.js",
            "../",
            "../cart.html",
        ),
    )


def write_direct_upper_product_alias(product: dict) -> None:
    path = NA_DIRECT_DIR / product["slug"] / "index.html"
    write_text(
        path,
        f'''<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=../../na/{product['slug']}/" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redirecting to /na/{product['slug']}/</title>
    <script>
      window.location.replace('../../na/{product['slug']}/' + window.location.search + window.location.hash);
    </script>
  </head>
  <body>
    <p>Redirecting to <a href="../../na/{product['slug']}/">product page</a>…</p>
  </body>
</html>
''',
    )


def main() -> None:
    source_items = json.loads(SOURCE_PATH.read_text(encoding="utf-8"))
    storefront_items = build_storefront_items(source_items)

    ensure_dir(DATA_PATH.parent)
    DATA_PATH.write_text(
        json.dumps(
            {
                "source": {
                    "mode": "static-json",
                    "message": "Using the bundled Athleta catalog JSON from this branch.",
                    "sourceUrl": "https://athleta.gapcanada.ca/",
                    "displayName": "Athleta Canada Catalog",
                    "parser": "prebuilt-json",
                    "fetchedAt": None,
                    "checkoutUrl": "https://athleta.gapcanada.ca/",
                    "checkoutName": "Athleta Canada",
                    "currency": "CAD",
                },
                "items": storefront_items,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    ensure_dir(NA_PRODUCTS_DIR)
    ensure_dir(na_PRODUCTS_DIR)
    ensure_dir(NA_DIRECT_DIR)
    ensure_dir(na_DIRECT_DIR)

    for product in storefront_items:
        write_legacy_upper_product_page(product)
        write_legacy_lower_product_alias(product)
        write_direct_lower_product_page(product)
        write_direct_upper_product_alias(product)

    print(f"Built {len(storefront_items)} storefront items and product pages.")


if __name__ == "__main__":
    main()
