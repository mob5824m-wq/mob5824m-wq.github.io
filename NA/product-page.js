(() => {
  const {
    loadCatalog,
    formatPrice,
    escapeHtml,
    addToCart,
    showToast,
    updateBagCount,
    loadingMarkup,
    emptyMarkup
  } = window.NAStore;

  const productDetail = document.getElementById('productDetail');
  const relatedGrid = document.getElementById('relatedGrid');

  function getRequestedId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || '';
  }

  function findProduct(catalog, requestedId) {
    if (!requestedId) {
      return null;
    }
    return catalog.byId.get(requestedId) || catalog.bySlug.get(requestedId) || null;
  }

  function detailMedia(product) {
    if (!product.image) {
      return `
        <div class="detail-visual" style="--tone-start:${product.toneStart}; --tone-end:${product.toneEnd};">
          <span class="detail-badge">${escapeHtml(product.badge)}</span>
          <div class="detail-photo-wrap detail-placeholder" aria-hidden="true"></div>
          <div class="detail-category">${escapeHtml(product.category)}</div>
        </div>
      `;
    }

    return `
      <div class="detail-visual" style="--tone-start:${product.toneStart}; --tone-end:${product.toneEnd};">
        <span class="detail-badge">${escapeHtml(product.badge)}</span>
        <div class="detail-photo-wrap">
          <img class="detail-photo" src="${product.image}" alt="${escapeHtml(product.name)}" />
        </div>
        <div class="detail-photo-scrim" aria-hidden="true"></div>
        <div class="detail-category">${escapeHtml(product.category)}</div>
      </div>
    `;
  }

  function renderProduct(product, catalog) {
    document.title = `${product.name} | North Active`;

    const bullets = [
      `${product.fit} silhouette for everyday wear`,
      `${product.colors.length || 1} curated color option${product.colors.length === 1 ? '' : 's'}`,
      `Checkout handoff available through ${catalog.source.checkoutName}`
    ];

    const sourcePage = product.url || product.sourceUrl || catalog.source.sourceUrl || catalog.source.checkoutUrl;

    productDetail.innerHTML = `
      <div>${detailMedia(product)}</div>
      <div class="detail-panel detail-copy">
        <div class="detail-crumbs">
          <a href="./">Shop</a>
          <span>•</span>
          <p>${escapeHtml(product.category)}</p>
        </div>
        <p class="eyebrow">Product detail</p>
        <h1>${escapeHtml(product.name)}</h1>
        <p>${escapeHtml(product.description)}</p>
        <div class="detail-price-row">
          <div>
            <div class="detail-price${product.price == null ? ' muted' : ''}">${escapeHtml(formatPrice(product.price, product.currency))}</div>
            <p class="section-note">Displayed on your page, with source checkout handled externally.</p>
          </div>
        </div>
        <div class="detail-meta">
          <span class="meta-chip">${escapeHtml(product.fit)}</span>
          <span class="meta-chip">${escapeHtml(product.sourceName)}</span>
          <span class="meta-chip">${product.colors.length || 1} color${product.colors.length === 1 ? '' : 's'}</span>
          ${product.colors.slice(0, 3).map((color) => `<span class="meta-chip">${escapeHtml(color)}</span>`).join('')}
        </div>
        <ul class="detail-bullets">
          ${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
        </ul>
        <div class="detail-actions">
          <div class="quantity-stepper" aria-label="Quantity selector">
            <button class="quantity-button" id="qtyDown" type="button" aria-label="Decrease quantity">−</button>
            <input class="quantity-input" id="qtyInput" type="number" min="1" value="1" />
            <button class="quantity-button" id="qtyUp" type="button" aria-label="Increase quantity">+</button>
          </div>
          <button class="product-button" id="addToBagButton" type="button">Add to bag</button>
          <a class="product-link" href="./cart.html">Go to cart</a>
        </div>
        <div class="detail-source-card">
          <h3>Source information</h3>
          <div class="summary-rows">
            <div class="summary-row"><p>Source name</p><strong>${escapeHtml(product.sourceName)}</strong></div>
            <div class="summary-row"><p>Checkout redirect</p><strong>${escapeHtml(catalog.source.checkoutName)}</strong></div>
            ${sourcePage ? `<div class="summary-row"><p>Source page</p><a href="${sourcePage}" target="_blank" rel="noreferrer">Open original item</a></div>` : ''}
            <div class="summary-row"><p>Checkout URL</p><a href="${catalog.source.checkoutUrl}" target="_blank" rel="noreferrer">${escapeHtml(catalog.source.checkoutName)}</a></div>
          </div>
        </div>
      </div>
    `;

    const qtyInput = document.getElementById('qtyInput');
    const clampQuantity = () => Math.max(1, Number(qtyInput.value) || 1);

    document.getElementById('qtyDown').addEventListener('click', () => {
      qtyInput.value = String(Math.max(1, clampQuantity() - 1));
    });

    document.getElementById('qtyUp').addEventListener('click', () => {
      qtyInput.value = String(clampQuantity() + 1);
    });

    qtyInput.addEventListener('change', () => {
      qtyInput.value = String(clampQuantity());
    });

    document.getElementById('addToBagButton').addEventListener('click', () => {
      const quantity = clampQuantity();
      addToCart(product, quantity);
      updateBagCount();
      showToast(`${quantity} × ${product.name} added to bag`);
    });
  }

  function renderRelated(product, catalog) {
    const related = catalog.products
      .filter((item) => item.id !== product.id)
      .filter((item) => item.category === product.category || item.sourceName === product.sourceName)
      .slice(0, 3);

    if (!related.length) {
      relatedGrid.innerHTML = emptyMarkup('No related products yet.', 'Try browsing the full shop instead.');
      return;
    }

    relatedGrid.innerHTML = related
      .map((item) => `
        <article class="product-card">
          <a class="product-media-link" href="./product.html?id=${encodeURIComponent(item.id)}">
            <div class="product-art" style="--tone-start:${item.toneStart}; --tone-end:${item.toneEnd};">
              <span class="product-badge">${escapeHtml(item.badge)}</span>
              ${item.image ? `<div class="product-photo-wrap"><img class="product-photo" src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy" /></div><div class="product-photo-scrim" aria-hidden="true"></div>` : '<div class="product-silhouette" aria-hidden="true"></div>'}
              <div class="product-name-overlay">${escapeHtml(item.category)}</div>
            </div>
          </a>
          <div class="product-body">
            <div class="product-topline">
              <h3 class="product-title"><a href="./product.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.name)}</a></h3>
              <span class="product-price${item.price == null ? ' muted' : ''}">${escapeHtml(formatPrice(item.price, item.currency))}</span>
            </div>
            <p class="product-subline">${escapeHtml(item.description)}</p>
          </div>
        </article>
      `)
      .join('');
  }

  async function init() {
    const requestedId = getRequestedId();
    productDetail.innerHTML = loadingMarkup('Loading product…', 'Fetching product details from the storefront catalog.');
    relatedGrid.innerHTML = '';

    try {
      const catalog = await loadCatalog();
      const product = findProduct(catalog, requestedId);

      if (!product) {
        productDetail.innerHTML = emptyMarkup('Product not found', 'This product is not currently available in the /NA catalog.');
        relatedGrid.innerHTML = '';
        return;
      }

      renderProduct(product, catalog);
      renderRelated(product, catalog);
    } catch (error) {
      productDetail.innerHTML = emptyMarkup('Product unavailable', 'The backend catalog could not be loaded right now.');
      relatedGrid.innerHTML = '';
    }
  }

  init();
})();
