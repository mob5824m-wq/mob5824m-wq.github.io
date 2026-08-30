(() => {
  const {
    loadCatalog,
    formatPrice,
    escapeHtml,
    addToCart,
    showToast,
    updateBagCount,
    loadingMarkup,
    emptyMarkup,
    cartPath,
    shopPath,
    productPath,
    findCatalogProduct
  } = window.NAStore;

  const productDetail = document.getElementById('productDetail');
  const relatedGrid = document.getElementById('relatedGrid');

  function getRequestedId() {
    const fromBody = document.body.dataset.productId;
    if (fromBody) {
      return fromBody;
    }

    const params = new URLSearchParams(window.location.search);
    return params.get('id') || params.get('slug') || '';
  }

  function findProduct(catalog, requestedId) {
    return findCatalogProduct(catalog.products, requestedId);
  }

  function detailMedia(product) {
    const gallery = product.gallery.slice(0, 8);
    const mainImage = gallery[0] || product.image;

    const visual = mainImage
      ? `
        <div class="detail-visual" style="--tone-start:${product.toneStart}; --tone-end:${product.toneEnd};">
          <span class="detail-badge">${escapeHtml(product.badge)}</span>
          <div class="detail-photo-wrap">
            <img class="detail-photo" id="mainProductImage" src="${mainImage}" alt="${escapeHtml(product.name)}" />
          </div>
          <div class="detail-photo-scrim" aria-hidden="true"></div>
          <div class="detail-category">${escapeHtml(product.category)}</div>
        </div>
      `
      : `
        <div class="detail-visual" style="--tone-start:${product.toneStart}; --tone-end:${product.toneEnd};">
          <span class="detail-badge">${escapeHtml(product.badge)}</span>
          <div class="detail-photo-wrap detail-placeholder" aria-hidden="true"></div>
          <div class="detail-category">${escapeHtml(product.category)}</div>
        </div>
      `;

    const thumbs = gallery.length
      ? `
        <div class="detail-gallery">
          ${gallery
            .map(
              (imageUrl, index) => `
                <button class="gallery-thumb${index === 0 ? ' is-active' : ''}" type="button" data-image="${imageUrl}" aria-label="Show product image ${index + 1}">
                  <img src="${imageUrl}" alt="${escapeHtml(product.name)} image ${index + 1}" loading="lazy" />
                </button>
              `
            )
            .join('')}
        </div>
      `
      : '';

    return `${visual}${thumbs}`;
  }

  function priceMarkup(product) {
    const current = formatPrice(product.price, product.currency);
    if (typeof product.price === 'number' && typeof product.regularPrice === 'number' && product.regularPrice > product.price) {
      return `
        <div class="price-stack detail-price-stack">
          <span class="detail-price">${escapeHtml(current)}</span>
          <span class="price-was">${escapeHtml(formatPrice(product.regularPrice, product.currency))}</span>
        </div>
      `;
    }
    return `<div class="detail-price${product.price == null ? ' muted' : ''}">${escapeHtml(current)}</div>`;
  }

  function checkoutLabel(checkoutUrl, sourceName) {
    try {
      const hostname = new URL(checkoutUrl).hostname.replace(/^www\./, '');
      return `Checkout on ${sourceName || hostname}`;
    } catch (error) {
      return `Checkout on ${sourceName || 'source site'}`;
    }
  }

  function wireGallery() {
    const mainImage = document.getElementById('mainProductImage');
    if (!mainImage) {
      return;
    }

    document.querySelectorAll('.gallery-thumb').forEach((button) => {
      button.addEventListener('click', () => {
        const nextImage = button.dataset.image;
        if (!nextImage) {
          return;
        }
        mainImage.src = nextImage;
        document.querySelectorAll('.gallery-thumb').forEach((thumb) => thumb.classList.remove('is-active'));
        button.classList.add('is-active');
      });
    });
  }

  function renderProduct(product, catalog) {
    document.title = `${product.name} | North Active`;

    const sourcePage = product.url || product.sourceUrl || catalog.source.sourceUrl || catalog.source.checkoutUrl;
    const reviewLine = product.reviews?.count
      ? `${product.reviews.score || 'Rated'}${product.reviews.score ? '★' : ''} from ${product.reviews.count} reviews`
      : 'Hosted product record with images and source links';
    const bulletPool = [
      product.inventoryStatus || 'Availability varies by source',
      `${product.colors.length || 1} color option${product.colors.length === 1 ? '' : 's'}`,
      product.details?.styleId ? `Style ID ${product.details.styleId}` : '',
      `Checkout handoff available through ${catalog.source.checkoutName}`
    ].filter(Boolean);

    productDetail.innerHTML = `
      <div>${detailMedia(product)}</div>
      <div class="detail-panel detail-copy">
        <div class="detail-crumbs">
          <a href="${shopPath()}">Shop</a>
          <span>•</span>
          <p>${escapeHtml(product.category)}</p>
        </div>
        <p class="eyebrow">Product detail</p>
        <h1>${escapeHtml(product.name)}</h1>
        <p>${escapeHtml(product.description)}</p>
        <div class="detail-price-row">
          <div>
            ${priceMarkup(product)}
            <p class="section-note">${escapeHtml(reviewLine)}</p>
          </div>
          <div class="detail-meta">
            <span class="meta-chip">${escapeHtml(product.fit)}</span>
            <span class="meta-chip">${escapeHtml(product.sourceName)}</span>
            <span class="meta-chip">${escapeHtml(product.inventoryStatus || 'Availability varies')}</span>
            ${product.reviews?.count ? `<span class="meta-chip">${escapeHtml(`${product.reviews.score || 'Rated'}★ · ${product.reviews.count}`)}</span>` : ''}
          </div>
        </div>
        <div class="detail-meta">
          ${product.colors.slice(0, 8).map((color) => `<span class="meta-chip">${escapeHtml(color)}</span>`).join('')}
        </div>
        <ul class="detail-bullets">
          ${bulletPool.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
        </ul>
        <div class="detail-actions">
          <div class="quantity-stepper" aria-label="Quantity selector">
            <button class="quantity-button" id="qtyDown" type="button" aria-label="Decrease quantity">−</button>
            <input class="quantity-input" id="qtyInput" type="number" min="1" value="1" />
            <button class="quantity-button" id="qtyUp" type="button" aria-label="Increase quantity">+</button>
          </div>
          <button class="product-button" id="addToBagButton" type="button">Add to bag</button>
          <a class="product-link" href="${product.checkoutUrl}" target="_blank" rel="noreferrer">${escapeHtml(checkoutLabel(product.checkoutUrl, catalog.source.checkoutName))}</a>
          <a class="secondary-button" href="${cartPath()}">Go to cart</a>
        </div>
        <div class="detail-source-card">
          <h3>Source information</h3>
          <div class="summary-rows">
            <div class="summary-row"><p>Source name</p><strong>${escapeHtml(product.sourceName)}</strong></div>
            <div class="summary-row"><p>Source label</p><strong>${escapeHtml(product.sourceLabel || product.sourceName)}</strong></div>
            <div class="summary-row"><p>Checkout redirect</p><strong>${escapeHtml(catalog.source.checkoutName)}</strong></div>
            ${sourcePage ? `<div class="summary-row"><p>Source page</p><a href="${sourcePage}" target="_blank" rel="noreferrer">Open hosted source page</a></div>` : ''}
            <div class="summary-row"><p>Product webpage</p><a href="${productPath(product)}">${productPath(product)}</a></div>
          </div>
        </div>
        ${product.variants.length ? `
          <div class="detail-source-card">
            <h3>Available color variants</h3>
            <div class="variant-list">
              ${product.variants
                .slice(0, 8)
                .map(
                  (variant) => `
                    <div class="variant-card">
                      <strong>${escapeHtml(variant.description || variant.name || 'Variant')}</strong>
                      <span>${escapeHtml(formatPrice(variant.price, product.currency))}</span>
                      <small>${escapeHtml(variant.inventoryStatus || 'Availability varies')}</small>
                    </div>
                  `
                )
                .join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    wireGallery();

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
          <a class="product-media-link" href="${productPath(item)}">
            <div class="product-art" style="--tone-start:${item.toneStart}; --tone-end:${item.toneEnd};">
              <span class="product-badge">${escapeHtml(item.badge)}</span>
              ${item.image ? `<div class="product-photo-wrap"><img class="product-photo" src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy" /></div><div class="product-photo-scrim" aria-hidden="true"></div>` : '<div class="product-silhouette" aria-hidden="true"></div>'}
              <div class="product-name-overlay">${escapeHtml(item.category)}</div>
            </div>
          </a>
          <div class="product-body">
            <div class="product-topline">
              <h3 class="product-title"><a href="${productPath(item)}">${escapeHtml(item.name)}</a></h3>
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
    productDetail.innerHTML = loadingMarkup('Loading product…', 'Fetching product details from your hosted Athleta catalog JSON.');
    relatedGrid.innerHTML = '';

    try {
      const catalog = await loadCatalog();
      const product = findProduct(catalog, requestedId);

      if (!product) {
        productDetail.innerHTML = emptyMarkup('Product unavailable', 'This product could not be found in the current hosted catalog.');
        relatedGrid.innerHTML = '';
        return;
      }

      if (!document.body.dataset.productId && window.location.pathname.endsWith('/product.html')) {
        const canonical = productPath(product);
        if (canonical) {
          window.history.replaceState({}, '', canonical);
        }
      }

      renderProduct(product, catalog);
      renderRelated(product, catalog);
    } catch (error) {
      productDetail.innerHTML = emptyMarkup('Product unavailable', 'The hosted catalog could not be loaded right now.');
      relatedGrid.innerHTML = '';
    }
  }

  init();
})();
