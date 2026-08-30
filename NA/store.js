(() => {
  function resolveRepoPrefix() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const naIndex = parts.findIndex((part) => part.toLowerCase() === 'na');
    if (naIndex <= 0) {
      return '';
    }
    return `/${parts.slice(0, naIndex).join('/')}`;
  }

  const REPO_PREFIX = resolveRepoPrefix();
  const STORE_BASE = `${REPO_PREFIX}/NA`;
  const STATIC_CATALOG_URL = `${REPO_PREFIX}/data/athleta-storefront.json`;
  const API_URL = `${REPO_PREFIX}/api/products`;
  const FALLBACK_URL = `${REPO_PREFIX}/data/fallback-products.json`;
  const CATALOG_CACHE_KEY = 'na-catalog-cache-v3';
  const CART_KEY = 'na-cart-v1';
  const DEFAULT_CHECKOUT_URL = 'https://athleta.gapcanada.ca/';
  const DEFAULT_CHECKOUT_NAME = 'Athleta Canada';

  const palettePool = [
    ['#8c6a5d', '#d7c0b5'],
    ['#8796a3', '#dfe6ec'],
    ['#5f6b57', '#d3d8c6'],
    ['#7f5d53', '#d5b7aa'],
    ['#b57a79', '#efd3d1'],
    ['#9b7a52', '#ead7b9'],
    ['#7a7d83', '#d9dde2'],
    ['#5f7058', '#d5ddc9'],
    ['#75655b', '#e1d5cf'],
    ['#4f5565', '#cfd5e3']
  ];

  function hashString(value) {
    return Array.from(String(value)).reduce((hash, character) => (hash << 5) - hash + character.charCodeAt(0), 0);
  }

  function getPalette(seedValue) {
    const palette = palettePool[Math.abs(hashString(seedValue)) % palettePool.length];
    return { toneStart: palette[0], toneEnd: palette[1] };
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function safeUrl(url) {
    if (!url) {
      return '';
    }

    try {
      const parsed = new URL(url, window.location.href);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.href;
      }
    } catch (error) {
      return '';
    }

    return '';
  }

  function coercePrice(value) {
    if (value == null || value === '') {
      return null;
    }

    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  function formatPrice(value, currency = 'CAD') {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return 'Price unavailable';
    }

    try {
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency,
        maximumFractionDigits: value % 1 === 0 ? 0 : 2
      }).format(value);
    } catch (error) {
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: value % 1 === 0 ? 0 : 2
      }).format(value);
    }
  }

  function uniqueStrings(values) {
    return Array.from(new Set((Array.isArray(values) ? values : []).map((value) => String(value).trim()).filter(Boolean)));
  }

  function shopPath() {
    return `${STORE_BASE}/`;
  }

  function cartPath() {
    return `${STORE_BASE}/cart.html`;
  }

  function legacyProductPath(id) {
    return `${STORE_BASE}/product.html?id=${encodeURIComponent(id)}`;
  }

  function productPath(productOrSlug) {
    const slug = typeof productOrSlug === 'string' ? productOrSlug : productOrSlug?.slug;
    return `${STORE_BASE}/products/${encodeURIComponent(slug || '')}/`;
  }

  function normalizeSource(source = {}) {
    const checkoutUrl = safeUrl(source.checkoutUrl || DEFAULT_CHECKOUT_URL) || DEFAULT_CHECKOUT_URL;
    const displayName = String(source.displayName || source.checkoutName || 'Catalog source').trim();

    return {
      mode: String(source.mode || 'fallback').trim(),
      message: String(source.message || 'Catalog loaded.').trim(),
      sourceUrl: safeUrl(source.sourceUrl || ''),
      displayName,
      parser: String(source.parser || '').trim(),
      fetchedAt: Number.isFinite(Number(source.fetchedAt)) ? Number(source.fetchedAt) : null,
      checkoutUrl,
      checkoutName: String(source.checkoutName || DEFAULT_CHECKOUT_NAME).trim(),
      currency: String(source.currency || 'CAD').trim() || 'CAD'
    };
  }

  function normalizeReviews(reviews) {
    if (!reviews || typeof reviews !== 'object') {
      return { score: null, count: null };
    }

    const score = Number(reviews.score);
    const count = Number(reviews.count);

    return {
      score: Number.isFinite(score) ? score : null,
      count: Number.isFinite(count) ? count : null
    };
  }

  function normalizeVariants(variants, productUrl, fallbackImage) {
    if (!Array.isArray(variants)) {
      return [];
    }

    return variants.slice(0, 20).map((variant, index) => ({
      id: String(variant?.id || `${productUrl || 'variant'}-${index}`),
      name: String(variant?.name || '').trim(),
      description: String(variant?.description || variant?.short_description || '').trim(),
      price: coercePrice(variant?.price),
      regularPrice: coercePrice(variant?.regularPrice ?? variant?.regular_price),
      percentageOff: String(variant?.percentageOff || variant?.percentage_off || '').trim(),
      inventoryStatus: String(variant?.inventoryStatus || variant?.inventory_status || '').trim(),
      inventoryCount: Number.isFinite(Number(variant?.inventoryCount ?? variant?.inventory_count)) ? Number(variant?.inventoryCount ?? variant?.inventory_count) : null,
      images: uniqueStrings(variant?.images).map(safeUrl).filter(Boolean).slice(0, 6),
      checkoutUrl: safeUrl(variant?.checkoutUrl || productUrl || DEFAULT_CHECKOUT_URL) || DEFAULT_CHECKOUT_URL,
      fallbackImage
    }));
  }

  function normalizeProduct(product, index, source) {
    const name = String(product?.name || `Product ${index + 1}`).trim();
    const category = String(product?.category || 'Featured').trim();
    const description = String(product?.description || 'Catalog item loaded through the storefront proxy.').trim();
    const fit = String(product?.fit || product?.brand || 'Everyday fit').trim();
    const colors = uniqueStrings(product?.colors);
    const badge = String(product?.badge || product?.brand || 'Catalog').trim();
    const price = coercePrice(product?.price);
    const regularPrice = coercePrice(product?.regularPrice ?? product?.regular_price);
    const currency = String(product?.currency || source.currency || 'CAD').toUpperCase();
    const productUrl = safeUrl(product?.url || product?.sourceUrl || source.sourceUrl || '');
    const checkoutUrl = safeUrl(product?.checkoutUrl || productUrl || source.checkoutUrl || DEFAULT_CHECKOUT_URL) || DEFAULT_CHECKOUT_URL;
    const sourceName = String(product?.sourceName || source.displayName || 'Catalog source').trim();
    const sourceUrl = safeUrl(product?.sourceUrl || source.sourceUrl || productUrl || checkoutUrl || '');
    const sourceLabel = String(product?.sourceLabel || product?.source_label || sourceName).trim();
    const image = safeUrl(product?.image || '');
    const gallery = uniqueStrings(product?.gallery || product?.images || []).map(safeUrl).filter(Boolean);
    const id = String(product?.id || productUrl || `${category}-${name}-${index}`);
    const slug = String(product?.slug || slugify(`${name}-${id}`)).trim();
    const palette = getPalette(`${name}-${category}-${id}`);
    const reviews = normalizeReviews(product?.reviews);
    const details = product?.details && typeof product.details === 'object' ? product.details : {};
    const variants = normalizeVariants(product?.variants, productUrl, image);
    const inventoryStatus = String(product?.inventoryStatus || product?.inventory_status || variants[0]?.inventoryStatus || '').trim();
    const inventoryCount = Number.isFinite(Number(product?.inventoryCount ?? product?.inventory_count))
      ? Number(product?.inventoryCount ?? product?.inventory_count)
      : variants.reduce((sum, variant) => sum + (variant.inventoryCount || 0), 0) || null;

    const allImages = uniqueStrings([image, ...gallery, ...variants.flatMap((variant) => variant.images)]).filter(Boolean);

    let sourceBadge = 'Hosted catalog';
    if (source.mode === 'remote' || source.mode === 'remote-cache') {
      sourceBadge = 'Live source';
    } else if (source.mode === 'fallback') {
      sourceBadge = 'Demo catalog';
    }

    return {
      id,
      slug,
      name,
      category,
      description,
      fit,
      colors,
      badge,
      price,
      regularPrice,
      currency,
      image: image || allImages[0] || '',
      gallery: allImages.slice(0, 10),
      url: productUrl,
      sourceName,
      sourceUrl,
      sourceLabel,
      checkoutUrl,
      toneStart: palette.toneStart,
      toneEnd: palette.toneEnd,
      sourceBadge,
      reviews,
      details,
      variants,
      inventoryStatus,
      inventoryCount
    };
  }

  function writeCatalogCache(payload) {
    try {
      localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(payload));
    } catch (error) {
      // ignore storage failures
    }
  }

  function readCatalogCache() {
    try {
      const raw = localStorage.getItem(CATALOG_CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`${url} returned ${response.status}`);
    }
    return response.json();
  }

  function normalizeCatalogPayload(payload) {
    const source = normalizeSource(payload?.source || {});
    const items = Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [];
    const products = items.map((item, index) => normalizeProduct(item, index, source));

    return {
      source,
      products,
      byId: new Map(products.map((product) => [product.id, product])),
      bySlug: new Map(products.map((product) => [product.slug, product]))
    };
  }

  async function loadCatalog() {
    const cached = readCatalogCache();

    try {
      const staticPayload = await fetchJson(STATIC_CATALOG_URL);
      writeCatalogCache(staticPayload);
      return normalizeCatalogPayload(staticPayload);
    } catch (staticError) {
      try {
        const apiPayload = await fetchJson(API_URL);
        writeCatalogCache(apiPayload);
        return normalizeCatalogPayload(apiPayload);
      } catch (apiError) {
        if (cached) {
          const normalized = normalizeCatalogPayload(cached);
          normalized.source.mode = 'remote-cache';
          normalized.source.message = 'Live request failed, so a cached catalog snapshot is being shown.';
          return normalized;
        }

        const fallbackPayload = await fetchJson(FALLBACK_URL);
        fallbackPayload.source = {
          ...(fallbackPayload.source || {}),
          mode: 'fallback',
          message: 'Using bundled demo products because no hosted catalog was available.',
          sourceUrl: '',
          displayName: 'North Active Demo Catalog',
          parser: 'bundled-json',
          fetchedAt: Math.floor(Date.now() / 1000),
          checkoutUrl: DEFAULT_CHECKOUT_URL,
          checkoutName: DEFAULT_CHECKOUT_NAME,
          currency: 'CAD'
        };
        writeCatalogCache(fallbackPayload);
        return normalizeCatalogPayload(fallbackPayload);
      }
    }
  }

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed
        .filter((item) => item && item.id)
        .map((item) => ({ id: String(item.id), quantity: Math.max(1, Number(item.quantity) || 1) }));
    } catch (error) {
      return [];
    }
  }

  function writeCart(items) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (error) {
      // ignore storage failures
    }
    updateBagCount();
  }

  function addToCart(product, quantity = 1) {
    const cart = readCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += Math.max(1, Number(quantity) || 1);
    } else {
      cart.push({ id: product.id, quantity: Math.max(1, Number(quantity) || 1) });
    }
    writeCart(cart);
  }

  function updateCartQuantity(productId, quantity) {
    const nextQuantity = Math.max(0, Number(quantity) || 0);
    const cart = readCart();
    const index = cart.findIndex((item) => item.id === productId);
    if (index === -1) {
      return;
    }
    if (nextQuantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = nextQuantity;
    }
    writeCart(cart);
  }

  function removeFromCart(productId) {
    writeCart(readCart().filter((item) => item.id !== productId));
  }

  function clearCart() {
    writeCart([]);
  }

  function cartCount() {
    return readCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  function findCatalogProduct(catalogProducts, requestedId) {
    const id = String(requestedId || '');
    const byId = catalogProducts.find((product) => product.id === id || product.slug === id);
    if (byId) {
      return byId;
    }

    const numericIndex = Number(id);
    if (Number.isInteger(numericIndex) && numericIndex >= 1 && numericIndex <= catalogProducts.length) {
      return catalogProducts[numericIndex - 1];
    }

    return null;
  }

  function cartDetails(catalogProducts) {
    return readCart()
      .map((item) => {
        const product = findCatalogProduct(catalogProducts, item.id);
        if (!product) {
          return null;
        }
        return {
          product,
          quantity: item.quantity,
          lineTotal: typeof product.price === 'number' ? product.price * item.quantity : null
        };
      })
      .filter(Boolean);
  }

  function cartSubtotal(lines) {
    return lines.reduce((sum, line) => sum + (typeof line.lineTotal === 'number' ? line.lineTotal : 0), 0);
  }

  function getCheckoutTarget(source, lines) {
    if (!lines.length) {
      return {
        url: safeUrl(source.checkoutUrl || DEFAULT_CHECKOUT_URL) || DEFAULT_CHECKOUT_URL,
        name: String(source.checkoutName || DEFAULT_CHECKOUT_NAME).trim() || DEFAULT_CHECKOUT_NAME,
        mode: 'default',
        sourceCount: 0
      };
    }

    const grouped = new Map();
    lines.forEach((line) => {
      const url = safeUrl(line.product.checkoutUrl || line.product.url || source.checkoutUrl || DEFAULT_CHECKOUT_URL) || DEFAULT_CHECKOUT_URL;
      const current = grouped.get(url) || 0;
      grouped.set(url, current + line.quantity);
    });

    const [bestUrl] = [...grouped.entries()].sort((a, b) => b[1] - a[1])[0] || [DEFAULT_CHECKOUT_URL, 0];

    return {
      url: bestUrl,
      name: String(source.checkoutName || DEFAULT_CHECKOUT_NAME).trim() || DEFAULT_CHECKOUT_NAME,
      mode: grouped.size === 1 ? 'single-source' : 'multi-source',
      sourceCount: grouped.size
    };
  }

  function sourceLinks(lines, source) {
    const unique = new Map();

    lines.forEach((line) => {
      const url = line.product.url || line.product.sourceUrl || line.product.checkoutUrl;
      if (url && !unique.has(url)) {
        unique.set(url, {
          label: `${line.product.name} source`,
          url
        });
      }
    });

    if (!unique.size && source.sourceUrl) {
      unique.set(source.sourceUrl, {
        label: `${source.displayName} source`,
        url: source.sourceUrl
      });
    }

    if (!unique.size && source.checkoutUrl) {
      unique.set(source.checkoutUrl, {
        label: `${source.checkoutName} checkout`,
        url: source.checkoutUrl
      });
    }

    return Array.from(unique.values());
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
      return;
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => {
      toast.classList.remove('show');
    }, 1800);
  }

  function updateBagCount() {
    const element = document.getElementById('bagCount');
    if (element) {
      element.textContent = String(cartCount());
    }
  }

  function setSourceStatus(element, source) {
    if (!element) {
      return;
    }
    element.textContent = source.message || 'Catalog loaded.';
    element.classList.toggle('ready', ['remote', 'remote-cache', 'static-json'].includes(source.mode));
  }

  function loadingMarkup(title = 'Loading catalog…', message = 'Please wait while the storefront loads products.') {
    return `
      <div class="loading-card">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(message)}</p>
      </div>
    `;
  }

  function emptyMarkup(title = 'Nothing to show yet.', message = 'Try again in a moment.') {
    return `
      <div class="empty-state">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(message)}</p>
      </div>
    `;
  }

  updateBagCount();

  window.NAStore = {
    loadCatalog,
    formatPrice,
    escapeHtml,
    slugify,
    safeUrl,
    shopPath,
    cartPath,
    legacyProductPath,
    productPath,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    readCart,
    cartCount,
    cartDetails,
    cartSubtotal,
    getCheckoutTarget,
    sourceLinks,
    showToast,
    updateBagCount,
    setSourceStatus,
    loadingMarkup,
    emptyMarkup,
    DEFAULT_CHECKOUT_NAME,
    findCatalogProduct
  };
})();
