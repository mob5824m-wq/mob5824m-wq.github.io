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

  const viewState = {
    catalog: null,
    product: null,
    variants: [],
    variantIndex: 0,
    imageIndex: 0
  };

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

  function priceMarkup(price, regularPrice, currency) {
    const current = formatPrice(price, currency);
    if (typeof price === 'number' && typeof regularPrice === 'number' && regularPrice > price) {
      return `
        <div class="price-stack detail-price-stack">
          <span class="detail-price">${escapeHtml(current)}</span>
          <span class="price-was">${escapeHtml(formatPrice(regularPrice, currency))}</span>
        </div>
      `;
    }
    return `<div class="detail-price${price == null ? ' muted' : ''}">${escapeHtml(current)}</div>`;
  }

  function checkoutLabel(checkoutUrl, sourceName) {
    try {
      const hostname = new URL(checkoutUrl).hostname.replace(/^www\./, '');
      return `Checkout on ${sourceName || hostname}`;
    } catch (error) {
      return `Checkout on ${sourceName || 'source site'}`;
    }
  }

  function buildDisplayVariants(product) {
    const baseImages = Array.isArray(product.gallery) && product.gallery.length
      ? product.gallery
      : [product.image].filter(Boolean);

    const variants = (product.variants || []).map((variant, index) => {
      const label = (variant.description || variant.name || product.colors[index] || `Option ${index + 1}`).trim();
      const sublabel = variant.name && variant.description && variant.name !== variant.description ? variant.name : '';
      const variantImages = Array.isArray(variant.images) && variant.images.length ? variant.images : [];

      return {
        id: variant.id || `${product.id}-variant-${index}`,
        label,
        sublabel,
        images: variantImages.length ? variantImages : baseImages,
        price: typeof variant.price === 'number' ? variant.price : product.price,
        regularPrice: typeof variant.regularPrice === 'number' ? variant.regularPrice : product.regularPrice,
        inventoryStatus: variant.inventoryStatus || product.inventoryStatus || 'Availability varies',
        inventoryCount: variant.inventoryCount ?? product.inventoryCount ?? null
      };
    });

    if (variants.length) {
      return variants;
    }

    return [
      {
        id: `${product.id}-default`,
        label: product.colors[0] || 'Default',
        sublabel: '',
        images: baseImages,
        price: product.price,
        regularPrice: product.regularPrice,
        inventoryStatus: product.inventoryStatus || 'Availability varies',
        inventoryCount: product.inventoryCount ?? null
      }
    ];
  }

  function currentVariant() {
    return viewState.variants[viewState.variantIndex] || viewState.variants[0] || null;
  }

  function currentImages() {
    const variant = currentVariant();
    if (variant?.images?.length) {
      return variant.images;
    }

    const product = viewState.product;
    if (product?.gallery?.length) {
      return product.gallery;
    }

    return product?.image ? [product.image] : [];
  }

  function renderColorSelector() {
    const selector = document.getElementById('colorSelector');
    if (!selector) {
      return;
    }

    selector.innerHTML = viewState.variants
      .map(
        (variant, index) => `
          <button
            class="color-option${index === viewState.variantIndex ? ' is-active' : ''}"
            type="button"
            data-variant-index="${index}"
            aria-pressed="${index === viewState.variantIndex}"
          >
            <span class="color-option-name">${escapeHtml(variant.label || `Option ${index + 1}`)}</span>
            ${variant.sublabel ? `<small>${escapeHtml(variant.sublabel)}</small>` : ''}
          </button>
        `
      )
      .join('');

    selector.querySelectorAll('[data-variant-index]').forEach((button) => {
      button.addEventListener('click', () => {
        viewState.variantIndex = Number(button.dataset.variantIndex) || 0;
        viewState.imageIndex = 0;
        renderColorSelector();
        updateDisplay();
      });
    });
  }

  function updateDisplay() {
    const product = viewState.product;
    const catalog = viewState.catalog;
    const variant = currentVariant();
    const images = currentImages();

    if (!product || !catalog || !variant) {
      return;
    }

    if (viewState.imageIndex < 0) {
      viewState.imageIndex = Math.max(images.length - 1, 0);
    }
    if (viewState.imageIndex >= images.length) {
      viewState.imageIndex = 0;
    }

    const currentImage = images[viewState.imageIndex] || product.image || '';
    const mainImage = document.getElementById('mainProductImage');
    const placeholder = document.getElementById('mainImagePlaceholder');
    const indicator = document.getElementById('carouselIndicator');
    const prevButton = document.getElementById('prevImage');
    const nextButton = document.getElementById('nextImage');
    const selectedColorLabel = document.getElementById('selectedColorLabel');
    const selectedColorNote = document.getElementById('selectedColorNote');
    const priceBlock = document.getElementById('priceBlock');
    const detailMetaPrimary = document.getElementById('detailMetaPrimary');
    const detailMetaColors = document.getElementById('detailMetaColors');
    const detailBullets = document.getElementById('detailBullets');

    if (mainImage) {
      if (currentImage) {
        mainImage.hidden = false;
        mainImage.src = currentImage;
        mainImage.alt = `${product.name}${variant.label ? ` - ${variant.label}` : ''}`;
      } else {
        mainImage.hidden = true;
      }
    }

    if (placeholder) {
      placeholder.hidden = Boolean(currentImage);
    }

    if (indicator) {
      indicator.textContent = images.length ? `${viewState.imageIndex + 1} / ${images.length}` : 'No images';
    }

    if (prevButton) {
      prevButton.disabled = images.length <= 1;
    }

    if (nextButton) {
      nextButton.disabled = images.length <= 1;
    }

    if (selectedColorLabel) {
      selectedColorLabel.textContent = variant.label || 'Default';
    }

    if (selectedColorNote) {
      const extra = variant.sublabel ? ` (${variant.sublabel})` : '';
      selectedColorNote.textContent = images.length
        ? `Showing ${variant.label || 'default'}${extra}. Use the arrows to rotate through ${images.length} image${images.length === 1 ? '' : 's'} for this colour.`
        : `Showing ${variant.label || 'default'}${extra}.`;
    }

    if (priceBlock) {
      priceBlock.innerHTML = `
        ${priceMarkup(variant.price, variant.regularPrice, product.currency)}
        <p class="section-note">${escapeHtml(
          product.reviews?.count
            ? `${product.reviews.score || 'Rated'}${product.reviews.score ? '★' : ''} from ${product.reviews.count} reviews`
            : 'Hosted product record with images and source links'
        )}</p>
      `;
    }

    if (detailMetaPrimary) {
      detailMetaPrimary.innerHTML = `
        <span class="meta-chip">${escapeHtml(product.fit)}</span>
        <span class="meta-chip">${escapeHtml(product.sourceName)}</span>
        <span class="meta-chip">${escapeHtml(variant.inventoryStatus || 'Availability varies')}</span>
        ${product.reviews?.count ? `<span class="meta-chip">${escapeHtml(`${product.reviews.score || 'Rated'}★ · ${product.reviews.count}`)}</span>` : ''}
      `;
    }

    if (detailMetaColors) {
      detailMetaColors.innerHTML = product.colors
        .slice(0, 8)
        .map((color) => `<span class="meta-chip${color === variant.label ? ' meta-chip-active' : ''}">${escapeHtml(color)}</span>`)
        .join('');
    }

    if (detailBullets) {
      const bullets = [
        variant.inventoryStatus || 'Availability varies by source',
        `${viewState.variants.length} colour option${viewState.variants.length === 1 ? '' : 's'}`,
        product.details?.styleId ? `Style ID ${product.details.styleId}` : '',
        `Checkout handoff available through ${catalog.source.checkoutName}`
      ].filter(Boolean);

      detailBullets.innerHTML = bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('');
    }
  }

  function changeImage(direction) {
    const images = currentImages();
    if (images.length <= 1) {
      return;
    }
    viewState.imageIndex = (viewState.imageIndex + direction + images.length) % images.length;
    updateDisplay();
  }

  function wireProductInteractions(product, catalog) {
    document.getElementById('prevImage')?.addEventListener('click', () => changeImage(-1));
    document.getElementById('nextImage')?.addEventListener('click', () => changeImage(1));

    document.getElementById('addToBagButton')?.addEventListener('click', () => {
      const quantityInput = document.getElementById('qtyInput');
      const quantity = Math.max(1, Number(quantityInput?.value) || 1);
      const variant = currentVariant();
      addToCart(product, quantity);
      updateBagCount();
      showToast(`${quantity} × ${product.name}${variant?.label ? ` (${variant.label})` : ''} added to bag`);
    });

    const qtyInput = document.getElementById('qtyInput');
    const clampQuantity = () => Math.max(1, Number(qtyInput?.value) || 1);

    document.getElementById('qtyDown')?.addEventListener('click', () => {
      if (!qtyInput) {
        return;
      }
      qtyInput.value = String(Math.max(1, clampQuantity() - 1));
    });

    document.getElementById('qtyUp')?.addEventListener('click', () => {
      if (!qtyInput) {
        return;
      }
      qtyInput.value = String(clampQuantity() + 1);
    });

    qtyInput?.addEventListener('change', () => {
      qtyInput.value = String(clampQuantity());
    });

    renderColorSelector();
    updateDisplay();
  }

  function renderProduct(product, catalog) {
    document.title = `${product.name} | North Active`;

    viewState.catalog = catalog;
    viewState.product = product;
    viewState.variants = buildDisplayVariants(product);
    viewState.variantIndex = 0;
    viewState.imageIndex = 0;

    const sourcePage = product.url || product.sourceUrl || catalog.source.sourceUrl || catalog.source.checkoutUrl;
    const initialImage = currentImages()[0] || product.image || '';

    productDetail.innerHTML = `
      <div>
        <div class="detail-visual detail-visual-carousel" style="--tone-start:${product.toneStart}; --tone-end:${product.toneEnd};">
          <span class="detail-badge">${escapeHtml(product.badge)}</span>
          <button class="carousel-arrow carousel-arrow-prev" id="prevImage" type="button" aria-label="Previous image">‹</button>
          <div class="detail-photo-wrap">
            <img class="detail-photo" id="mainProductImage" src="${initialImage}" alt="${escapeHtml(product.name)}" ${initialImage ? '' : 'hidden'} />
            <div class="detail-placeholder" id="mainImagePlaceholder" ${initialImage ? 'hidden' : ''} aria-hidden="true"></div>
          </div>
          <button class="carousel-arrow carousel-arrow-next" id="nextImage" type="button" aria-label="Next image">›</button>
          <div class="detail-photo-scrim" aria-hidden="true"></div>
          <div class="detail-category">${escapeHtml(product.category)}</div>
          <div class="carousel-indicator" id="carouselIndicator"></div>
        </div>

        ${viewState.variants.length > 1 ? `
          <div class="detail-source-card detail-colour-panel">
            <h3>Choose colour</h3>
            <div class="color-selector" id="colorSelector"></div>
            <p class="section-note"><strong id="selectedColorLabel"></strong></p>
            <p class="section-note" id="selectedColorNote"></p>
          </div>
        ` : ''}
      </div>

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
          <div id="priceBlock"></div>
          <div class="detail-meta" id="detailMetaPrimary"></div>
        </div>
        <div class="detail-meta" id="detailMetaColors"></div>
        <ul class="detail-bullets" id="detailBullets"></ul>
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
      </div>
    `;

    wireProductInteractions(product, catalog);
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

      renderProduct(product, catalog);
      renderRelated(product, catalog);
    } catch (error) {
      productDetail.innerHTML = emptyMarkup('Product unavailable', 'The hosted catalog could not be loaded right now.');
      relatedGrid.innerHTML = '';
    }
  }

  init();
})();
