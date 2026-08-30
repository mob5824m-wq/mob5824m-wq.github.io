(() => {
  const {
    loadCatalog,
    formatPrice,
    escapeHtml,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartDetails,
    cartSubtotal,
    getCheckoutTarget,
    sourceLinks,
    showToast,
    updateBagCount,
    loadingMarkup,
    emptyMarkup,
    cartCount
  } = window.NAStore;

  const cartItems = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');
  let catalog = null;

  function cartThumbMarkup(product) {
    if (!product.image) {
      return `
        <div class="cart-thumb" style="--tone-start:${product.toneStart}; --tone-end:${product.toneEnd};">
          <div class="detail-placeholder" aria-hidden="true"></div>
          <div class="product-photo-scrim" aria-hidden="true"></div>
        </div>
      `;
    }

    return `
      <div class="cart-thumb" style="--tone-start:${product.toneStart}; --tone-end:${product.toneEnd};">
        <img class="product-photo" src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" />
        <div class="product-photo-scrim" aria-hidden="true"></div>
      </div>
    `;
  }

  function renderCartItems(lines) {
    if (!lines.length) {
      cartItems.innerHTML = `
        <div class="empty-state">
          <h3>Your bag is empty.</h3>
          <p>Add something from the /NA shop to start building a checkout handoff.</p>
          <a class="product-link" href="./">Return to shop</a>
        </div>
      `;
      return;
    }

    cartItems.innerHTML = lines
      .map((line) => `
        <article class="cart-item" data-id="${escapeHtml(line.product.id)}">
          ${cartThumbMarkup(line.product)}
          <div class="cart-item-copy">
            <div class="cart-item-top">
              <div>
                <h3><a href="./product.html?id=${encodeURIComponent(line.product.id)}">${escapeHtml(line.product.name)}</a></h3>
                <p>${escapeHtml(line.product.description)}</p>
              </div>
              <div class="cart-line-total">${escapeHtml(formatPrice(line.lineTotal, line.product.currency))}</div>
            </div>
            <div class="meta-row">
              <span class="meta-chip">${escapeHtml(line.product.category)}</span>
              <span class="meta-chip">${escapeHtml(line.product.fit)}</span>
              <span class="meta-chip">${escapeHtml(line.product.sourceName)}</span>
            </div>
            <div class="cart-line-actions">
              <div class="quantity-stepper" aria-label="Update quantity">
                <button class="quantity-button" type="button" data-action="decrement" data-id="${escapeHtml(line.product.id)}">−</button>
                <input class="quantity-input" type="number" min="1" value="${line.quantity}" data-action="input" data-id="${escapeHtml(line.product.id)}" />
                <button class="quantity-button" type="button" data-action="increment" data-id="${escapeHtml(line.product.id)}">+</button>
              </div>
              ${(line.product.url || line.product.sourceUrl || line.product.checkoutUrl) ? `<a class="product-link" href="${line.product.url || line.product.sourceUrl || line.product.checkoutUrl}" target="_blank" rel="noreferrer">View source</a>` : ''}
              <button class="remove-button" type="button" data-action="remove" data-id="${escapeHtml(line.product.id)}">Remove</button>
            </div>
          </div>
        </article>
      `)
      .join('');

    cartItems.querySelectorAll('[data-action]').forEach((element) => {
      const { action, id } = element.dataset;
      if (action === 'increment') {
        element.addEventListener('click', () => updateItem(id, currentQuantity(id) + 1));
      }
      if (action === 'decrement') {
        element.addEventListener('click', () => updateItem(id, Math.max(1, currentQuantity(id) - 1)));
      }
      if (action === 'remove') {
        element.addEventListener('click', () => {
          removeFromCart(id);
          updateBagCount();
          showToast('Item removed');
          rerender();
        });
      }
      if (action === 'input') {
        element.addEventListener('change', () => updateItem(id, Math.max(1, Number(element.value) || 1)));
      }
    });
  }

  function currentQuantity(productId) {
    const line = cartDetails(catalog.products).find((entry) => entry.product.id === productId);
    return line ? line.quantity : 1;
  }

  function updateItem(productId, quantity) {
    updateCartQuantity(productId, quantity);
    updateBagCount();
    rerender();
  }

  function renderSummary(lines) {
    const subtotal = cartSubtotal(lines);
    const checkout = getCheckoutTarget(catalog.source, lines);
    const links = sourceLinks(lines, catalog.source);

    if (!lines.length) {
      cartSummary.innerHTML = `
        <div class="section-heading simple-heading">
          <div>
            <p class="eyebrow">Summary</p>
            <h2 class="summary-title">Bag summary</h2>
          </div>
        </div>
        ${emptyMarkup('No items selected', 'Once products are added, checkout will redirect to Athleta.')}
      `;
      return;
    }

    cartSummary.innerHTML = `
      <div class="section-heading simple-heading">
        <div>
          <p class="eyebrow">Summary</p>
          <h2 class="summary-title">Ready for handoff</h2>
        </div>
      </div>
      <div class="summary-rows">
        <div class="summary-row"><p>Items</p><strong>${cartCount()}</strong></div>
        <div class="summary-row"><p>Subtotal</p><strong>${escapeHtml(formatPrice(subtotal, catalog.source.currency || 'CAD'))}</strong></div>
        <div class="summary-row summary-total-row"><p>Total shown on this page</p><div class="summary-total">${escapeHtml(formatPrice(subtotal, catalog.source.currency || 'CAD'))}</div></div>
      </div>
      <button class="checkout-button" id="checkoutButton" type="button">Checkout on ${escapeHtml(checkout.name)}</button>
      <button class="secondary-button" id="clearCartButton" type="button">Clear bag</button>
      <p class="summary-note">
        This storefront keeps the cart on your site, then sends shoppers to ${escapeHtml(checkout.name)} to finish checkout.
        If the external site does not support prefilled carts, shoppers may need to re-add items there.
      </p>
      <div class="summary-sources">
        ${links.map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join('')}
      </div>
      <div class="notice-card">
        <h3>Checkout destination</h3>
        <div class="summary-row"><p>Partner</p><strong>${escapeHtml(checkout.name)}</strong></div>
        <div class="summary-row"><p>Redirect URL</p><a href="${checkout.url}" target="_blank" rel="noreferrer">${checkout.url}</a></div>
      </div>
    `;

    document.getElementById('checkoutButton').addEventListener('click', () => {
      showToast(`Redirecting to ${checkout.name}`);
      setTimeout(() => {
        window.location.href = checkout.url;
      }, 180);
    });

    document.getElementById('clearCartButton').addEventListener('click', () => {
      clearCart();
      updateBagCount();
      showToast('Bag cleared');
      rerender();
    });
  }

  function rerender() {
    const lines = cartDetails(catalog.products);
    renderCartItems(lines);
    renderSummary(lines);
  }

  async function init() {
    cartItems.innerHTML = loadingMarkup('Loading your bag…', 'Matching saved cart items against the current product catalog.');
    cartSummary.innerHTML = loadingMarkup('Preparing summary…', 'Checkout details will appear once the cart is ready.');

    try {
      catalog = await loadCatalog();
      rerender();
    } catch (error) {
      cartItems.innerHTML = emptyMarkup('Cart unavailable', 'The storefront could not load product data right now.');
      cartSummary.innerHTML = emptyMarkup('Summary unavailable', 'Please try again when the backend source is available.');
    }
  }

  init();
})();
