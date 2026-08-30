#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
import time
from html import unescape
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
FALLBACK_PATH = ROOT / "data" / "fallback-products.json"
HOSTED_CATALOG_PATH = ROOT / "data" / "athleta-storefront.json"
CONFIG_PATH = ROOT / "source.config.json"
DEFAULT_PORT = int(os.environ.get("PORT", "8000"))
DEFAULT_HOST = os.environ.get("HOST", "0.0.0.0")

DEFAULT_CONFIG = {
    "sourceUrl": "",
    "sourceName": "North Active Catalog",
    "allowedHosts": [],
    "cacheTtlSeconds": 900,
    "mode": "auto",
    "userAgent": "NorthActiveCatalogProxy/1.0",
    "checkoutUrl": "https://athleta.gapcanada.ca/",
    "checkoutName": "Athleta Canada",
    "currency": "CAD",
}

CACHE: dict[str, Any] = {
    "source_url": None,
    "expires_at": 0,
    "payload": None,
}

SCRIPT_JSONLD_RE = re.compile(
    r"<script[^>]*type=[\"']application/ld\+json[\"'][^>]*>(.*?)</script>",
    re.IGNORECASE | re.DOTALL,
)
TAG_RE = re.compile(r"<[^>]+>")
PRICE_RE = re.compile(r"(?:CAD|USD|\$|€|£)\s*([0-9]{1,5}(?:[.,][0-9]{2})?)", re.IGNORECASE)
PRODUCT_LINK_RE = re.compile(
    r"<a[^>]+href=[\"'](?P<href>[^\"']*(?:product|products)[^\"']*)[\"'][^>]*>(?P<inner>.*?)</a>",
    re.IGNORECASE | re.DOTALL,
)


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    text = value if isinstance(value, str) else str(value)
    return re.sub(r"\s+", " ", unescape(text)).strip()



def strip_tags(value: str) -> str:
    return clean_text(TAG_RE.sub(" ", value or ""))



def load_json_file(path: Path, default: Any) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return default
    except json.JSONDecodeError:
        return default



def coerce_price(value: Any) -> float | None:
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)):
        return float(value)

    text = clean_text(value)
    if not text:
        return None

    normalized = re.sub(r"[^0-9,.-]", "", text)
    if normalized.count(",") == 1 and normalized.count(".") == 0:
        normalized = normalized.replace(",", ".")
    else:
        normalized = normalized.replace(",", "")

    try:
        return float(normalized)
    except ValueError:
        return None



def normalize_colors(value: Any) -> list[str]:
    if isinstance(value, list):
        return [clean_text(item) for item in value if clean_text(item)]
    if isinstance(value, str):
        separators = ["/", ",", "|"]
        colors = [value]
        for separator in separators:
            if separator in value:
                colors = [part.strip() for part in value.split(separator)]
                break
        return [clean_text(item) for item in colors if clean_text(item)]
    return []



def first_string(value: Any) -> str:
    if isinstance(value, list):
        for item in value:
            cleaned = clean_text(item)
            if cleaned:
                return cleaned
        return ""
    return clean_text(value)



def extract_brand(value: Any) -> str:
    if isinstance(value, dict):
        return clean_text(value.get("name") or value.get("brand"))
    return clean_text(value)



def absolute_url(value: Any, base_url: str) -> str:
    text = clean_text(value)
    if not text:
        return ""
    return urljoin(base_url, text)



def load_config() -> dict[str, Any]:
    config = dict(DEFAULT_CONFIG)
    file_config = load_json_file(CONFIG_PATH, {})
    if isinstance(file_config, dict):
        config.update({key: value for key, value in file_config.items() if value is not None})

    env_map = {
        "SCRAPER_SOURCE_URL": "sourceUrl",
        "SCRAPER_SOURCE_NAME": "sourceName",
        "SCRAPER_ALLOWED_HOSTS": "allowedHosts",
        "SCRAPER_MODE": "mode",
        "SCRAPER_USER_AGENT": "userAgent",
        "SCRAPER_CHECKOUT_URL": "checkoutUrl",
        "SCRAPER_CHECKOUT_NAME": "checkoutName",
        "SCRAPER_CURRENCY": "currency",
    }

    for env_name, config_key in env_map.items():
        env_value = clean_text(os.environ.get(env_name))
        if env_value:
            if config_key == "allowedHosts":
                config[config_key] = [host.strip() for host in env_value.split(",") if host.strip()]
            else:
                config[config_key] = env_value

    env_ttl = clean_text(os.environ.get("SCRAPER_CACHE_TTL"))
    if env_ttl.isdigit():
        config["cacheTtlSeconds"] = int(env_ttl)

    config["allowedHosts"] = [clean_text(host).lower() for host in config.get("allowedHosts", []) if clean_text(host)]
    config["sourceUrl"] = clean_text(config.get("sourceUrl", ""))
    config["sourceName"] = clean_text(config.get("sourceName", DEFAULT_CONFIG["sourceName"]))
    config["mode"] = clean_text(config.get("mode", "auto")).lower() or "auto"
    config["userAgent"] = clean_text(config.get("userAgent", DEFAULT_CONFIG["userAgent"]))
    config["checkoutUrl"] = clean_text(config.get("checkoutUrl", DEFAULT_CONFIG["checkoutUrl"]))
    config["checkoutName"] = clean_text(config.get("checkoutName", DEFAULT_CONFIG["checkoutName"]))
    config["currency"] = clean_text(config.get("currency", DEFAULT_CONFIG["currency"])) or DEFAULT_CONFIG["currency"]

    try:
        config["cacheTtlSeconds"] = max(0, int(config.get("cacheTtlSeconds", 900)))
    except (TypeError, ValueError):
        config["cacheTtlSeconds"] = 900

    return config



def is_allowed_host(source_url: str, allowed_hosts: list[str]) -> bool:
    hostname = (urlparse(source_url).hostname or "").lower()
    if not hostname or not allowed_hosts:
        return False
    return any(hostname == allowed or hostname.endswith(f".{allowed}") for allowed in allowed_hosts)



def fetch_remote_html(url: str, user_agent: str) -> str:
    request = Request(
        url,
        headers={
            "User-Agent": user_agent,
            "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-CA,en;q=0.9",
            "Cache-Control": "no-cache",
        },
    )
    with urlopen(request, timeout=20) as response:
        charset = response.headers.get_content_charset() or "utf-8"
        return response.read().decode(charset, errors="replace")



def iter_nodes(node: Any):
    if isinstance(node, dict):
        yield node
        for value in node.values():
            yield from iter_nodes(value)
    elif isinstance(node, list):
        for item in node:
            yield from iter_nodes(item)



def type_names(node: dict[str, Any]) -> set[str]:
    node_type = node.get("@type")
    if isinstance(node_type, list):
        return {clean_text(item) for item in node_type if clean_text(item)}
    if isinstance(node_type, str):
        return {clean_text(node_type)}
    return set()



def product_from_jsonld(node: dict[str, Any], base_url: str, source_name: str, checkout_url: str, currency: str) -> dict[str, Any] | None:
    name = clean_text(node.get("name"))
    if not name:
        return None

    offers = node.get("offers")
    if isinstance(offers, list):
        offers = next((offer for offer in offers if isinstance(offer, dict)), {})
    if not isinstance(offers, dict):
        offers = {}

    brand = extract_brand(node.get("brand"))
    category = clean_text(node.get("category")) or "Featured"
    price = coerce_price(offers.get("price") or offers.get("lowPrice") or node.get("price"))
    product_currency = clean_text(offers.get("priceCurrency") or node.get("priceCurrency") or currency).upper() or currency
    image = absolute_url(first_string(node.get("image")), base_url)
    url = absolute_url(node.get("url"), base_url)
    description = clean_text(node.get("description")) or "Catalog item loaded from the approved source."
    colors = normalize_colors(node.get("color"))

    return {
        "id": clean_text(node.get("sku") or node.get("productID") or url or name),
        "name": name,
        "category": category,
        "price": price,
        "badge": brand or "Live source",
        "description": description,
        "colors": colors,
        "fit": brand or "Store catalog",
        "image": image,
        "url": url,
        "sourceName": source_name,
        "sourceUrl": url or base_url,
        "checkoutUrl": checkout_url,
        "currency": product_currency,
        "brand": brand,
    }



def extract_products_from_jsonld(html: str, base_url: str, source_name: str, checkout_url: str, currency: str) -> list[dict[str, Any]]:
    products: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()

    for script_match in SCRIPT_JSONLD_RE.findall(html):
        script_content = clean_text(script_match)
        if not script_content:
            continue

        try:
            data = json.loads(script_content)
        except json.JSONDecodeError:
            continue

        for node in iter_nodes(data):
            if not isinstance(node, dict):
                continue
            if "Product" not in type_names(node):
                continue

            product = product_from_jsonld(node, base_url, source_name, checkout_url, currency)
            if not product:
                continue

            key = (product.get("url", ""), product.get("name", ""))
            if key in seen:
                continue
            seen.add(key)
            products.append(product)

    return products



def looks_like_product_name(text: str) -> bool:
    if len(text) < 4 or len(text) > 120:
        return False
    if not re.search(r"[A-Za-z]", text):
        return False
    blocked_phrases = {"view all", "learn more", "shop now", "add to bag", "quick add"}
    return text.lower() not in blocked_phrases



def extract_products_from_generic_html(html: str, base_url: str, source_name: str, checkout_url: str, currency: str) -> list[dict[str, Any]]:
    products: list[dict[str, Any]] = []
    seen_urls: set[str] = set()

    for match in PRODUCT_LINK_RE.finditer(html):
        href = absolute_url(match.group("href"), base_url)
        if not href or href in seen_urls:
            continue

        name = strip_tags(match.group("inner"))
        if not looks_like_product_name(name):
            continue

        start = max(0, match.start() - 400)
        end = min(len(html), match.end() + 500)
        surrounding = html[start:end]
        price_match = PRICE_RE.search(surrounding)
        price = coerce_price(price_match.group(0)) if price_match else None

        products.append(
            {
                "id": href,
                "name": name,
                "category": "Featured",
                "price": price,
                "badge": "Live source",
                "description": "Product imported by the generic HTML parser. Add a structured source for richer details.",
                "colors": [],
                "fit": "Store catalog",
                "image": "",
                "url": href,
                "sourceName": source_name,
                "sourceUrl": href,
                "checkoutUrl": checkout_url,
                "currency": currency,
            }
        )
        seen_urls.add(href)

        if len(products) >= 60:
            break

    return products



def base_source_payload(config: dict[str, Any], mode: str, message: str, parser: str = "bundled-json") -> dict[str, Any]:
    return {
        "mode": mode,
        "message": message,
        "sourceUrl": config.get("sourceUrl", ""),
        "displayName": config.get("sourceName") or config.get("checkoutName") or DEFAULT_CONFIG["sourceName"],
        "parser": parser,
        "fetchedAt": int(time.time()),
        "checkoutUrl": config.get("checkoutUrl", DEFAULT_CONFIG["checkoutUrl"]),
        "checkoutName": config.get("checkoutName", DEFAULT_CONFIG["checkoutName"]),
        "currency": config.get("currency", DEFAULT_CONFIG["currency"]),
    }



def load_hosted_catalog_payload(config: dict[str, Any], message: str) -> dict[str, Any] | None:
    hosted_data = load_json_file(HOSTED_CATALOG_PATH, None)
    if not isinstance(hosted_data, dict):
        return None

    items = hosted_data.get("items", []) if isinstance(hosted_data.get("items"), list) else []
    source = hosted_data.get("source", {}) if isinstance(hosted_data.get("source"), dict) else {}
    payload = {
        "items": items,
        "source": {
            **base_source_payload(config, "static-json", message, parser="prebuilt-json"),
            **source,
            "mode": "static-json",
            "message": message,
        },
    }
    return payload



def load_fallback_payload(config: dict[str, Any], message: str) -> dict[str, Any]:
    fallback_data = load_json_file(FALLBACK_PATH, {"items": []})
    items = fallback_data.get("items", []) if isinstance(fallback_data, dict) else []
    return {
        "items": items,
        "source": base_source_payload(config, "fallback", message, parser="bundled-json"),
    }



def build_catalog_payload(force_refresh: bool = False) -> dict[str, Any]:
    config = load_config()
    source_url = config.get("sourceUrl", "")
    allowed_hosts = config.get("allowedHosts", [])
    ttl_seconds = config.get("cacheTtlSeconds", 900)
    checkout_url = config.get("checkoutUrl", DEFAULT_CONFIG["checkoutUrl"])
    source_name = config.get("sourceName") or (urlparse(source_url).hostname if source_url else DEFAULT_CONFIG["sourceName"])
    currency = config.get("currency", DEFAULT_CONFIG["currency"])

    if not source_url:
        hosted_payload = load_hosted_catalog_payload(
            config,
            "Using the hosted Athleta catalog JSON from this branch."
        )
        if hosted_payload:
            return hosted_payload

        return load_fallback_payload(
            config,
            "Using bundled sample catalog. Add a permitted source URL in source.config.json to load remote products."
        )

    if not is_allowed_host(source_url, allowed_hosts):
        return load_fallback_payload(
            config,
            "Remote source blocked: add the source hostname to allowedHosts in source.config.json."
        )

    now = time.time()
    cached_payload = CACHE.get("payload")
    if (
        not force_refresh
        and cached_payload
        and CACHE.get("source_url") == source_url
        and CACHE.get("expires_at", 0) > now
    ):
        return cached_payload

    parser_used = "json-ld"

    try:
        html = fetch_remote_html(source_url, config.get("userAgent", DEFAULT_CONFIG["userAgent"]))
        products = extract_products_from_jsonld(html, source_url, source_name, checkout_url, currency)

        if not products and config.get("mode") in {"auto", "html", "generic-html"}:
            products = extract_products_from_generic_html(html, source_url, source_name, checkout_url, currency)
            parser_used = "generic-html"

        if not products:
            return load_fallback_payload(
                config,
                "Remote source loaded but no products could be parsed. Try a page with JSON-LD product data or add a custom parser."
            )

        payload = {
            "items": products,
            "source": base_source_payload(
                {
                    **config,
                    "sourceName": source_name,
                },
                "remote",
                f"Live catalog loaded from {urlparse(source_url).hostname} via the backend proxy.",
                parser=parser_used,
            ),
        }
        CACHE["source_url"] = source_url
        CACHE["expires_at"] = now + ttl_seconds
        CACHE["payload"] = payload
        return payload
    except (HTTPError, URLError, TimeoutError, ValueError) as error:
        if cached_payload and CACHE.get("source_url") == source_url:
            stale_payload = {
                **cached_payload,
                "source": {
                    **cached_payload.get("source", {}),
                    "mode": "remote-cache",
                    "message": f"Remote fetch failed, so a cached catalog is being shown instead ({error}).",
                },
            }
            return stale_payload

        return load_fallback_payload(
            config,
            f"Remote source could not be fetched, so the bundled sample catalog is shown instead ({error})."
        )


class CatalogRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/health":
            self.send_json({"ok": True, "timestamp": int(time.time())})
            return

        if parsed.path == "/api/products":
            query = parse_qs(parsed.query)
            force_refresh = query.get("refresh") == ["1"]
            payload = build_catalog_payload(force_refresh=force_refresh)
            self.send_json(payload)
            return

        super().do_GET()

    def send_json(self, payload: dict[str, Any], status_code: int = 200):
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    server = ThreadingHTTPServer((DEFAULT_HOST, DEFAULT_PORT), CatalogRequestHandler)
    print(f"North Active Shop running at http://{DEFAULT_HOST}:{DEFAULT_PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
