(() => {
  const API_URL = '../api/products';
  const CATALOG_CACHE_KEY = 'na-catalog-cache-v1';
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

  function normalizeProduct(product, index, source) {
    const name = String(product?.name || `Product ${index + 1}`).trim();
    const category = String(product?.category || 'Featured').trim();
    const description = String(product?.description || 'Catalog item loaded through the storefront proxy.').trim();
    const fit = String(product?.fit || product?.brand || 'Everyday fit').trim();
    const colors = uniqueStrings(product?.colors);
    const badge = String(product?.badge || product?.brand || 'Catalog').trim();
    const price = coercePrice(product?.price);
    const currency = String(product?.currency || source.currency || 'CAD').toUpperCase();
    const productUrl = safeUrl(product?.url || product?.sourceUrl || source.sourceUrl || '');
    const checkoutUrl = safeUrl(product?.checkoutUrl || source.checkoutUrl || DEFAULT_CHECKOUT_URL);
    const sourceName = String(product?.sourceName || source.displayName || 'Catalog source').trim();
    const sourceUrl = safeUrl(product?.sourceUrl || source.sourceUrl || productUrl || '');
    const image = safeUrl(product?.image || '');
    const id = String(product?.id || productUrl || `${category}-${name}-${index}`);
    const slug = slugify(product?.slug || `${name}-${category}`);
    const palette = getPalette(`${name}-${category}-${id}`);

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
      currency,
      image,
      url: productUrl,
      sourceName,
      sourceUrl,
      checkoutUrl,
      toneStart: palette.toneStart,
      toneEnd: palette.toneEnd,
      sourceBadge: source.mode === 'remote' || source.mode === 'remote-cache' ? 'Live source' : 'Demo catalog'
    };
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

  async function loadCatalog() {
    const cached = readCatalogCache();

    try {
      const response = await fetch(API_URL, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Catalog API returned ${response.status}`);
      }

      const payload = await response.json();
      writeCatalogCache(payload);
      return normalizeCatalogPayload(payload);
    } catch (error) {
      if (cached) {
        const normalized = normalizeCatalogPayload(cached);
        normalized.source.mode = 'remote-cache';
        normalized.source.message = 'Live request failed, so a cached catalog snapshot is being shown.';
        return normalized;
      }

      try {
        const fallbackResponse = await fetch(FALLBACK_URL, { cache: 'no-store' });
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback catalog returned ${fallbackResponse.status}`);
        }
        const fallbackPayload = await fallbackResponse.json();
        fallbackPayload.source = {
          ...(fallbackPayload.source || {}),
          mode: 'fallback',
          message: 'Using bundled demo products because the live backend is unavailable.',
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
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  }

  function normalizeCatalogPayload(payload) {
    const source = normalizeSource(payload?.source || {});
    const items = Array.isArray(payload?.items) ? payload.items : [];
    const products = items.map((item, index) => normalizeProduct(item, index, source));

    return {
      source,
      products,
      byId: new Map(products.map((product) => [product.id, product])),
      bySlug: new Map(products.map((product) => [product.slug, product]))
    };
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

  function cartDetails(catalogProducts) {
    const catalogById = new Map(catalogProducts.map((product) => [product.id, product]));
    return readCart()
      .map((item) => {
        const product = catalogById.get(item.id);
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
    const firstLine = lines[0];
    return {
      url: safeUrl(firstLine?.product.checkoutUrl || source.checkoutUrl || DEFAULT_CHECKOUT_URL) || DEFAULT_CHECKOUT_URL,
      name: String(source.checkoutName || DEFAULT_CHECKOUT_NAME).trim() || DEFAULT_CHECKOUT_NAME
    };
  }

  function sourceLinks(lines, source) {
    const unique = new Map();

    lines.forEach((line) => {
      const url = line.product.url || line.product.sourceUrl;
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
    element.classList.toggle('ready', source.mode === 'remote' || source.mode === 'remote-cache');
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
    DEFAULT_CHECKOUT_NAME
  };
})();
