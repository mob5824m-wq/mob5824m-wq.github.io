(() => {
  const {
    loadCatalog,
    formatPrice,
    escapeHtml,
    addToCart,
    showToast,
    setSourceStatus,
    loadingMarkup,
    updateBagCount
  } = window.NAStore;

  const state = {
    query: '',
    category: 'All',
    sort: 'featured',
    catalog: null
  };

  const productGrid = document.getElementById('productGrid');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const categoryFilters = document.getElementById('categoryFilters');
  const resultsText = document.getElementById('resultsText');
  const clearFilters = document.getElementById('clearFilters');
  const sourceStatus = document.getElementById('sourceStatus');
  const heroProductCount = document.getElementById('heroProductCount');
  const heroSourceName = document.getElementById('heroSourceName');

  function categoryOrder() {
    const categories = Array.from(new Set(state.catalog.products.map((product) => product.category))).sort((a, b) => a.localeCompare(b));
    return ['All', ...categories];
  }

  function renderCategoryFilters() {
    categoryFilters.innerHTML = '';

    categoryOrder().forEach((category) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `filter-pill${state.category === category ? ' active' : ''}`;
      button.textContent = category;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', String(state.category === category));
      button.addEventListener('click', () => {
        state.category = category;
        renderCategoryFilters();
        renderProducts();
      });
      categoryFilters.appendChild(button);
    });
  }

  function filteredProducts() {
    const query = state.query.trim().toLowerCase();
    let items = [...state.catalog.products];

    if (state.category !== 'All') {
      items = items.filter((product) => product.category === state.category);
    }

    if (query) {
      items = items.filter((product) => {
        const searchable = [product.name, product.category, product.description, product.fit, product.sourceName, ...product.colors]
          .join(' ')
          .toLowerCase();
        return searchable.includes(query);
      });
    }

    switch (state.sort) {
      case 'price-asc':
        items.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
        break;
      case 'price-desc':
        items.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
        break;
      case 'name-asc':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return items;
  }

  function imageMarkup(product) {
    if (!product.image) {
      return '<div class="product-silhouette" aria-hidden="true"></div>';
    }

    return `
      <div class="product-photo-wrap">
        <img class="product-photo" src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" />
      </div>
      <div class="product-photo-scrim" aria-hidden="true"></div>
    `;
  }

  function productCardMarkup(product) {
    const priceText = formatPrice(product.price, product.currency);
    const detailUrl = `./product.html?id=${encodeURIComponent(product.id)}`;
    const sourceLink = product.url || product.sourceUrl || state.catalog.source.sourceUrl || state.catalog.source.checkoutUrl;

    return `
      <article class="product-card">
        <a class="product-media-link" href="${detailUrl}">
          <div class="product-art" style="--tone-start:${product.toneStart}; --tone-end:${product.toneEnd};">
            <span class="product-badge">${escapeHtml(product.badge)}</span>
            ${imageMarkup(product)}
            <div class="product-name-overlay">${escapeHtml(product.category)}</div>
          </div>
        </a>
        <div class="product-body">
          <div class="product-topline">
            <h3 class="product-title"><a href="${detailUrl}">${escapeHtml(product.name)}</a></h3>
            <span class="product-price${product.price == null ? ' muted' : ''}">${escapeHtml(priceText)}</span>
          </div>
          <p class="product-subline">${escapeHtml(product.description)}</p>
          <div class="product-meta">
            <span class="meta-chip">${escapeHtml(product.fit)}</span>
            <span class="meta-chip">${product.colors.length || 1} color${product.colors.length === 1 ? '' : 's'}</span>
            <span class="meta-chip">${escapeHtml(product.sourceBadge)}</span>
          </div>
          <div class="product-source-row">
            <span>Source: ${escapeHtml(product.sourceName)}</span>
            ${sourceLink ? `<a href="${sourceLink}" target="_blank" rel="noreferrer">Source page</a>` : ''}
          </div>
          <div class="product-actions">
            <button class="product-button" type="button" data-action="add" data-id="${escapeHtml(product.id)}">Add to bag</button>
            <a class="product-link" href="${detailUrl}">View details</a>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const items = filteredProducts();
    heroProductCount.textContent = String(state.catalog.products.length || 0);
    heroSourceName.textContent = state.catalog.source.checkoutName || 'Athleta';
    resultsText.textContent = `${items.length} product${items.length === 1 ? '' : 's'} shown`;

    if (!items.length) {
      productGrid.innerHTML = `
        <div class="empty-state">
          <h3>No products match that search.</h3>
          <p>Try a different keyword or reset the filters to browse the full catalog.</p>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = items.map(productCardMarkup).join('');

    productGrid.querySelectorAll('[data-action="add"]').forEach((button) => {
      button.addEventListener('click', () => {
        const product = state.catalog.byId.get(button.dataset.id);
        if (!product) {
          return;
        }
        addToCart(product, 1);
        updateBagCount();
        showToast(`${product.name} added to bag`);
      });
    });
  }

  async function init() {
    productGrid.innerHTML = loadingMarkup('Loading catalog…', 'The /NA storefront is requesting products from the backend API.');

    try {
      state.catalog = await loadCatalog();
      if (!categoryOrder().includes(state.category)) {
        state.category = 'All';
      }
      renderCategoryFilters();
      setSourceStatus(sourceStatus, state.catalog.source);
      renderProducts();
    } catch (error) {
      setSourceStatus(sourceStatus, {
        mode: 'fallback',
        message: 'The catalog could not be loaded right now.'
      });
      heroProductCount.textContent = '0';
      productGrid.innerHTML = `
        <div class="empty-state">
          <h3>Catalog unavailable</h3>
          <p>Please try again once the backend source is available.</p>
        </div>
      `;
      resultsText.textContent = '0 products shown';
    }
  }

  searchInput.addEventListener('input', (event) => {
    state.query = event.target.value;
    if (state.catalog) {
      renderProducts();
    }
  });

  sortSelect.addEventListener('change', (event) => {
    state.sort = event.target.value;
    if (state.catalog) {
      renderProducts();
    }
  });

  clearFilters.addEventListener('click', () => {
    state.query = '';
    state.category = 'All';
    state.sort = 'featured';
    searchInput.value = '';
    sortSelect.value = 'featured';
    if (state.catalog) {
      renderCategoryFilters();
      renderProducts();
    }
    showToast('Filters cleared');
  });

  init();
})();
