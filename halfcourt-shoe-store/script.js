/* ===== Live catalog ===== */
const PRODUCT_DESCRIPTIONS = new Map([
  ['aj1-high-red', 'The original that started it all. Premium leather, classic Chicago colorway, and timeless silhouette.'],
  ['aj1-low-panda', 'Clean black and white contrast. Everyday versatility with authentic Jordan DNA.'],
  ['aj3-black-cement', 'Elephant print, visible Air, and the Jumpman that defined a generation.'],
  ['aj4-bred', 'Mesh panels, support wings, and the legendary black/red colorway.'],
  ['aj4-white-oreo', 'Fresh white upper with speckled midsole. Clean and modern.'],
  ['aj5-fire-red', 'Reflective tongue, shark-tooth midsole, and bold red accents.'],
  ['aj6-infrared', 'The championship silhouette. Infrared hits and translucent sole.'],
  ['aj9-chile-red', 'Speed lacing, molded panels, and striking all-red energy.'],
  ['aj11-concord', 'Patent leather, ballistic mesh, and the most iconic Concord colorway.'],
  ['aj12-flugame', 'Black and red legend. The pair that defined resilience and performance.']
]);
const PRODUCT_IMAGE_FILES = {
  'aj1-high-red': 'air jordan high red.png',
  'aj1-low-panda': 'air-jordan-1-low-panda-transparent.png',
  'aj3-black-cement': 'Nike Air Jordan 3 Retro OG Black Cement.png',
  'aj4-bred': 'air jordan 4 bred.png',
  'aj4-white-oreo': 'air jordan 4 white oreo.png',
  'aj5-fire-red': 'air jordan 5 fire red.png',
  'aj6-infrared': 'air jordan 6 ifrared.png',
  'aj9-chile-red': 'air jordan 9 chile red.png',
  'aj11-concord': 'air jordan 11 concord.png',
  'aj12-flugame': 'air jordan 12 flugame.png'
};
const ALL_SIZES = ['6','6.5','7','7.5','8','8.5','9','9.5','10','11','12'];

function localProductImage(productId) {
  const file = PRODUCT_IMAGE_FILES[productId];
  return file ? `/images/${file.split('/').map(encodeURIComponent).join('/')}` : '';
}

let PRODUCTS = [];
let SHIP_OPTIONS = [];
let catalogUnavailable = false;

/* ===== State (persisted) ===== */
let activeFilter = 'all';
let searchQuery = '';
let cart = JSON.parse(localStorage.getItem('nike_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('nike_wish') || '[]');
let selectedShip = 'metro';
let selectedSize = null;
let currentUser = null;
let csrfToken = null;

const $ = id => document.getElementById(id);
const money = n => '₱' + Number(n).toLocaleString('en-PH');
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));
const saveCart = () => localStorage.setItem('nike_cart', JSON.stringify(cart));
const saveWish = () => localStorage.setItem('nike_wish', JSON.stringify(wishlist));

document.addEventListener('error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.dataset.fallback) return;
  image.src = image.dataset.fallback;
  delete image.dataset.fallback;
}, true);

async function apiRequest(action, method = 'GET', body) {
  const endpoint = action ? `api.php?action=${encodeURIComponent(action)}` : 'api.php';
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (method !== 'GET' && csrfToken) headers['X-CSRF-Token'] = csrfToken;
  const response = await fetch(endpoint, {
    method,
    headers,
    credentials: 'same-origin',
    body: body ? JSON.stringify(body) : undefined
  });
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(`The PHP store API is unavailable (HTTP ${response.status}). Check the Vercel Container deployment, then test /api.php?action=health.`);
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('The store API returned an invalid response. Please try again later.');
  }
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function loadCatalog() {
  try {
    const catalog = await apiRequest('');
    if (!Array.isArray(catalog.products) || !Array.isArray(catalog.shipping)) {
      throw new Error('The live catalog response is incomplete');
    }
    PRODUCTS = catalog.products.map(product => ({
      ...product,
      sizes: Array.isArray(product.sizes) ? product.sizes : [],
      image: product.image_url || localProductImage(product.id),
      imageFallback: product.image_url ? localProductImage(product.id) : '',
      desc: PRODUCT_DESCRIPTIONS.get(product.id) || '',
      category: 'jordan',
      type: 'basketball'
    }));
    SHIP_OPTIONS = catalog.shipping;
    catalogUnavailable = false;
  } catch (error) {
    PRODUCTS = [];
    SHIP_OPTIONS = [];
    catalogUnavailable = true;
    console.error('Live catalog could not be loaded:', error.message);
  }
}

function toast(msg) {
  const root = $('toastRoot');
  root.innerHTML = `<div class="toast">${escapeHTML(msg)}</div>`;
  clearTimeout(window._toastT);
  window._toastT = setTimeout(() => root.innerHTML = '', 2800);
}

async function loadCurrentUser() {
  try {
    const data = await apiRequest('me');
    currentUser = data.user;
    csrfToken = data.csrfToken;
  } catch (error) {
    currentUser = null;
    csrfToken = null;
  }
  updateAccountButton();
}

function updateAccountButton() {
  const button = $('accountBtn');
  if (!button) return;
  button.title = currentUser ? `Signed in as ${currentUser.name}` : 'Sign in';
  button.setAttribute('aria-label', button.title);
}

function openAccount() {
  const root = $('modalRoot');
  const render = (mode = 'login', error = '') => {
    const register = mode === 'register';
    root.innerHTML = `
      <div class="backdrop" id="accountBack">
        <div class="modal" style="grid-template-columns:1fr;max-width:440px">
          <button class="close-btn" id="closeAccount">×</button>
          <form class="checkout-form" id="accountForm">
            <div class="eyebrow">HalfCourt members</div>
            <h2>${currentUser ? `Hi, ${escapeHTML(currentUser.name)}` : register ? 'Create your account' : 'Welcome back'}</h2>
            ${currentUser ? `<p class="modal-desc">${escapeHTML(currentUser.email)}<br>Contact: ${escapeHTML(currentUser.contact_number || 'Not provided')}<br>Address: ${escapeHTML(currentUser.address || 'Not provided')}</p><button type="button" class="btn btn-primary" id="signOut" style="width:100%;margin-bottom:10px">Sign out</button><button type="button" class="btn btn-secondary" id="closeAccountAction" style="width:100%">Continue shopping</button>` : `
              ${register ? '<div class="field"><label>Full name *</label><input id="accountName" required autocomplete="name"></div><div class="field"><label>Contact number *</label><input type="tel" id="accountContact" required autocomplete="tel" inputmode="tel" placeholder="09XX XXX XXXX"></div><div class="field"><label>Address *</label><input id="accountAddress" required autocomplete="street-address" placeholder="Street, barangay, city"></div>' : ''}
              <div class="field"><label>Email *</label><input type="email" id="accountEmail" required autocomplete="email"></div>
              <div class="field"><label>Password *</label><input type="password" id="accountPassword" minlength="${register ? '12' : '1'}" maxlength="128" required autocomplete="${register ? 'new-password' : 'current-password'}"></div>
              <div id="accountError" class="error-msg" style="display:${error ? 'block' : 'none'}">${escapeHTML(error)}</div>
              <button type="submit" class="btn btn-primary" style="width:100%">${register ? 'Create account' : 'Sign in'}</button>
              <button type="button" class="btn btn-secondary" id="switchAccount" style="width:100%;margin-top:10px">${register ? 'Already have an account? Sign in' : 'New member? Create an account'}</button>
            `}
          </form>
        </div>
      </div>`;
    $('closeAccount').onclick = () => root.innerHTML = '';
    $('accountBack').onclick = event => { if (event.target.id === 'accountBack') root.innerHTML = ''; };
    $('closeAccountAction')?.addEventListener('click', () => root.innerHTML = '');
    $('signOut')?.addEventListener('click', async () => {
      try {
        await apiRequest('logout', 'POST');
        currentUser = null;
        csrfToken = null;
        updateAccountButton();
        root.innerHTML = '';
        toast('Signed out');
      } catch (requestError) {
        toast(requestError.message);
      }
    });
    $('switchAccount')?.addEventListener('click', () => render(register ? 'login' : 'register'));
    $('accountForm').addEventListener('submit', async event => {
      event.preventDefault();
      const action = register ? 'register' : 'login';
      const body = { email: $('accountEmail').value.trim(), password: $('accountPassword').value };
      if (register) {
        body.name = $('accountName').value.trim();
        body.contact_number = $('accountContact').value.trim();
        body.address = $('accountAddress').value.trim();
      }
      try {
        const data = await apiRequest(action, 'POST', body);
        currentUser = data.user;
        csrfToken = data.csrfToken;
        updateAccountButton();
        root.innerHTML = '';
        toast(register ? 'Account created' : 'Signed in');
      } catch (requestError) {
        render(mode, requestError.message);
      }
    });
  };
  render(currentUser ? 'login' : 'login');
}

$('accountBtn').addEventListener('click', openAccount);

/* ===== Render Products ===== */
function renderGrid() {
  const q = searchQuery.trim().toLowerCase();
  const list = PRODUCTS.filter(p => {
    const isModelFilter = activeFilter.startsWith('aj');
    const matchFilter =
      activeFilter === 'all' ||
      (isModelFilter ? p.id.startsWith(activeFilter + '-') : p.category === activeFilter || p.type === activeFilter);
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.colorway.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const grid = $('productGrid');
  if (!list.length) {
    const emptyMessage = catalogUnavailable
      ? 'Live catalog is unavailable. Please try again later.'
      : activeFilter === 'aj2'
      ? '<strong style="display:block;color:var(--text);font-size:18px;margin-bottom:8px">Air Jordan 2</strong>Out of stock'
      : 'No sneakers match your filters.';
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">${emptyMessage}</div>`;
    return;
  }

  grid.innerHTML = list.map((p, i) => `
    <article class="product-card" data-id="${escapeHTML(p.id)}" style="animation-delay:${i * 0.05}s">
      <div class="product-visual ${p.id === 'aj1-low-panda' ? 'panda-visual' : ''}">
        ${p.badge ? `<span class="product-badge">${escapeHTML(p.badge)}</span>` : ''}
        <button class="product-wish ${wishlist.includes(p.id) ? 'saved' : ''}" data-wish="${escapeHTML(p.id)}" aria-label="Wishlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${wishlist.includes(p.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <img class="${p.id === 'aj1-low-panda' ? 'panda-photo' : ''}" src="${escapeHTML(p.image)}" data-fallback="${escapeHTML(p.imageFallback)}" alt="${escapeHTML(p.name)} ${escapeHTML(p.colorway)}" loading="lazy">
        <button class="product-quick" data-quick="${escapeHTML(p.id)}">Quick view / Add</button>
      </div>
      <div class="product-info">
        <div class="product-name">${escapeHTML(p.name)}</div>
        <div class="product-meta">
          <span class="product-cat">${escapeHTML(p.colorway)}</span>
          <span class="product-price">${money(p.price)}</span>
        </div>
        <div class="product-meta" style="margin-top:4px">
          <span class="${p.stock === 0 ? 'stock-out' : p.stock <= 3 ? 'stock-low' : ''}">
            ${p.stock === 0 ? 'Sold out' : p.stock <= 3 ? `Only ${p.stock} left` : `${p.stock} in stock`}
          </span>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('[data-wish]')) return;
      openDetail(PRODUCTS.find(p => p.id === card.dataset.id));
    });
  });
  grid.querySelectorAll('[data-wish]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleWish(btn.dataset.wish);
    });
  });
  grid.querySelectorAll('[data-quick]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openDetail(PRODUCTS.find(p => p.id === btn.dataset.quick));
    });
  });
  setupProductMotion(grid);
  processPandaImages(grid);
}

function setupProductMotion(scope) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .16 });

  scope.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.setProperty('--reveal-delay', `${index * 55}ms`);
    revealObserver.observe(card);
    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.setProperty('--tilt-x', `${y * -5}deg`);
      card.style.setProperty('--tilt-y', `${x * 5}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

function animateCartFlight(product, source) {
  const cartButton = $('cartBtn');
  if (!source || !cartButton) return;
  const from = source.getBoundingClientRect();
  const to = cartButton.getBoundingClientRect();
  const clone = source.cloneNode(true);
  const startX = from.left + from.width / 2 - 32;
  const startY = from.top + from.height / 2 - 32;
  const endX = to.left + to.width / 2 - 12;
  const endY = to.top + to.height / 2 - 12;
  Object.assign(clone.style, {
    position: 'fixed', left: `${startX}px`, top: `${startY}px`, width: '64px', height: '64px',
    objectFit: 'contain', zIndex: '120', pointerEvents: 'none', margin: '0',
    filter: 'drop-shadow(0 12px 18px rgba(0,0,0,.55))'
  });
  document.body.appendChild(clone);
  clone.animate([
    { transform: 'translate3d(0, 0, 0) scale(1) rotate(-8deg)', opacity: 1 },
    { transform: `translate3d(${(endX - startX) * .45}px, -90px, 0) scale(.65) rotate(12deg)`, opacity: 1, offset: .55 },
    { transform: `translate3d(${endX - startX}px, ${endY - startY}px, 0) scale(.18) rotate(0deg)`, opacity: 0 }
  ], { duration: 760, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = () => {
    clone.remove();
    cartButton.classList.remove('cart-arrived');
    void cartButton.offsetWidth;
    cartButton.classList.add('cart-arrived');
  };
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.addEventListener('mousemove', event => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    hero.style.setProperty('--hero-x', `${x * 16}px`);
    hero.style.setProperty('--hero-y', `${y * 12}px`);
  });
  hero.addEventListener('mouseleave', () => {
    hero.style.setProperty('--hero-x', '0px');
    hero.style.setProperty('--hero-y', '0px');
  });
}

function processPandaImages(scope = document) {
  scope.querySelectorAll('img.panda-photo').forEach(image => {
    if (image.dataset.cutoutReady === 'true' || image.dataset.cutoutReady === 'done') return;
    const process = () => {
      if (image.dataset.cutoutReady === 'done') return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0);

        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        const { data, width, height } = pixels;
        const visited = new Uint8Array(width * height);
        const queue = [];
        const cornerIndex = 0;
        const darkBackground = Math.max(data[cornerIndex], data[cornerIndex + 1], data[cornerIndex + 2]) < 60;
        const matchesBackground = index => {
          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];
          const spread = Math.max(red, green, blue) - Math.min(red, green, blue);
          if (data[index + 3] === 0) return true;
          if (darkBackground) return Math.max(red, green, blue) < 60 && spread < 48;
          return Math.min(red, green, blue) > 188 && spread < 48;
        };

        for (let y = 0; y < height; y++) {
          for (const x of [0, width - 1]) queue.push(y * width + x);
        }
        for (let x = 1; x < width - 1; x++) {
          queue.push(x);
          queue.push((height - 1) * width + x);
        }

        while (queue.length) {
          const pixel = queue.pop();
          if (visited[pixel]) continue;
          visited[pixel] = 1;
          const index = pixel * 4;
          if (!matchesBackground(index)) continue;
          data[index + 3] = 0;
          const x = pixel % width;
          const y = Math.floor(pixel / width);
          if (x > 0) queue.push(pixel - 1);
          if (x < width - 1) queue.push(pixel + 1);
          if (y > 0) queue.push(pixel - width);
          if (y < height - 1) queue.push(pixel + width);
        }

        context.putImageData(pixels, 0, 0);
        image.src = canvas.toDataURL('image/png');
        image.dataset.cutoutReady = 'done';
      } catch (error) {
        image.classList.add('panda-blend-fallback');
        image.dataset.cutoutReady = 'done';
      }
    };
    if (image.complete && image.naturalWidth) process();
    else image.addEventListener('load', process, { once: true });
    image.dataset.cutoutReady = 'true';
  });
}

function renderCarousel() {
  const items = PRODUCTS.slice(0, 6);
  $('carousel').innerHTML = items.map(p => `
    <div class="carousel-card" data-id="${escapeHTML(p.id)}">
      <img class="${p.id === 'aj1-low-panda' ? 'panda-photo' : ''}" src="${escapeHTML(p.image)}" data-fallback="${escapeHTML(p.imageFallback)}" alt="${escapeHTML(p.name)}">
      <div class="carousel-info">
        <h4>${escapeHTML(p.name)}</h4>
        <span>${escapeHTML(p.colorway)} · ${money(p.price)}</span>
      </div>
    </div>
  `).join('');
  $('carousel').querySelectorAll('.carousel-card').forEach(c => {
    c.addEventListener('click', () => openDetail(PRODUCTS.find(p => p.id === c.dataset.id)));
  });
  processPandaImages($('carousel'));
}

/* ===== Filters & Search ===== */
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    renderGrid();
  });
});

$('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value;
  renderGrid();
});

$('searchBtn').addEventListener('click', () => {
  document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  $('searchInput').focus();
});

/* ===== Wishlist ===== */
function toggleWish(id) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) wishlist.splice(idx, 1);
  else wishlist.push(id);
  saveWish();
  updateWishCount();
  renderGrid();
  toast(idx > -1 ? 'Removed from wishlist' : 'Added to wishlist');
}

function updateWishCount() {
  const el = $('wishCount');
  if (wishlist.length) {
    el.hidden = false;
    el.textContent = wishlist.length;
  } else {
    el.hidden = true;
  }
}

$('wishlistBtn').addEventListener('click', openWishlist);

$('orderBtn').addEventListener('click', openOrderHistory);

function getOrders() {
  return JSON.parse(localStorage.getItem('nike_orders') || '[]');
}

function saveOrders(orders) {
  localStorage.setItem('nike_orders', JSON.stringify(orders.slice(0, 20)));
}

function orderStatus(order) {
  return ['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(order.status) ? order.status : 'Processing';
}

async function openOrderHistory() {
  const root = $('orderRoot');
  let orders = getOrders();
  if (currentUser) {
    try {
      const data = await apiRequest('orders');
      orders = data.orders.map(order => ({
        ...order,
        orderNo: order.order_no,
        date: order.placed_at,
        total: Number(order.total)
      }));
    } catch (error) {
      toast(error.message);
    }
  }
  root.innerHTML = `
    <div class="drawer-backdrop" id="orderBack">
      <aside class="drawer order-drawer">
        <div class="drawer-head">
          <h2>Order history</h2>
          <button class="close-btn" id="closeOrders">×</button>
        </div>
        <div class="drawer-items order-history-list">
          ${orders.length ? orders.map((order, index) => `
            <button class="order-history-item" data-order-index="${index}">
              <span><strong>${escapeHTML(order.orderNo)}</strong><small>${new Date(order.date).toLocaleDateString('en-PH')}</small></span>
              <span><strong>${money(order.total)}</strong><small class="status-${orderStatus(order).toLowerCase()}">${escapeHTML(orderStatus(order))}</small></span>
            </button>
          `).join('') : '<div class="empty-state">No orders yet.<br>Your completed orders will appear here.</div>'}
        </div>
      </aside>
    </div>
  `;
  $('closeOrders').onclick = () => root.innerHTML = '';
  $('orderBack').onclick = e => { if (e.target.id === 'orderBack') root.innerHTML = ''; };
  root.querySelectorAll('[data-order-index]').forEach(item => {
    item.onclick = () => openOrderDetails(Number(item.dataset.orderIndex));
  });
}

function openOrderDetails(index) {
  const root = $('orderRoot');
  const orders = getOrders();
  const order = orders[index];
  if (!order) return openOrderHistory();
  const status = orderStatus(order);
  const canCancel = status === 'Processing';
  root.innerHTML = `
    <div class="drawer-backdrop" id="orderDetailBack">
      <aside class="drawer order-drawer">
        <div class="drawer-head">
          <button class="order-back" id="backOrders">←</button>
          <h2>${escapeHTML(order.orderNo)}</h2>
          <button class="close-btn" id="closeOrderDetail">×</button>
        </div>
        <div class="drawer-items order-detail-view">
          <div class="order-state status-${status.toLowerCase()}">${escapeHTML(status)}</div>
          <p class="order-date">Placed ${new Date(order.date).toLocaleString('en-PH')}</p>
          <div class="order-summary">
            <h3>Items</h3>
            ${(order.items || []).map(item => `
              <div class="order-history-line"><span>${escapeHTML(item.name)} · Size ${escapeHTML(item.size)} × ${Number(item.qty)}</span><strong>${money(item.price * item.qty)}</strong></div>
            `).join('')}
            <div class="summary-line"><span>Subtotal</span><span>${money(order.subtotal || order.total)}</span></div>
            <div class="summary-line total"><span>Total</span><span>${money(order.total)}</span></div>
          </div>
          <div class="order-details">
            <h3>Delivery details</h3>
            <p><strong>${escapeHTML(order.address.name)}</strong><br>${escapeHTML(order.address.phone)}${order.address.email ? ` · ${escapeHTML(order.address.email)}` : ''}</p>
            <p>${escapeHTML(order.address.street)}, ${escapeHTML(order.address.brgy)}<br>${escapeHTML(order.address.city)}, ${escapeHTML(order.address.province)} ${escapeHTML(order.address.zip)}</p>
          </div>
          ${canCancel ? '<button class="btn btn-secondary cancel-order" id="cancelOrder">Cancel order</button>' : '<p class="order-lock-note">This order can no longer be cancelled. Contact support to request a return or refund.</p>'}
        </div>
      </aside>
    </div>
  `;
  $('closeOrderDetail').onclick = () => root.innerHTML = '';
  $('orderDetailBack').onclick = e => { if (e.target.id === 'orderDetailBack') root.innerHTML = ''; };
  $('backOrders').onclick = openOrderHistory;
  if (canCancel) $('cancelOrder').onclick = () => {
    const updatedOrders = getOrders();
    updatedOrders[index].status = 'Cancelled';
    saveOrders(updatedOrders);
    toast('Order cancelled');
    openOrderDetails(index);
  };
}

function openWishlist() {
  const root = $('wishRoot');
  const items = wishlist.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  root.innerHTML = `
    <div class="drawer-backdrop" id="wishBack">
      <aside class="drawer">
        <div class="drawer-head">
          <h2>Wishlist · ${items.length}</h2>
          <button class="close-btn" id="closeWish">×</button>
        </div>
        ${items.length ? `
          <div class="drawer-items">
            ${items.map(p => `
              <div class="cart-item">
                <img class="${p.id === 'aj1-low-panda' ? 'panda-photo' : ''}" src="${escapeHTML(p.image)}" data-fallback="${escapeHTML(p.imageFallback)}" alt="${escapeHTML(p.name)}">
                <div>
                  <h3>${escapeHTML(p.name)}</h3>
                  <div class="cart-meta">${escapeHTML(p.colorway)}</div>
                  <div class="cart-price">${money(p.price)}</div>
                </div>
                <button class="remove-item" data-unwish="${escapeHTML(p.id)}">×</button>
              </div>
            `).join('')}
          </div>
        ` : `<div class="empty-state">Your wishlist is empty.<br>Save pairs you love.</div>`}
      </aside>
    </div>
  `;
  $('closeWish').onclick = () => root.innerHTML = '';
  $('wishBack').onclick = e => { if (e.target.id === 'wishBack') root.innerHTML = ''; };
  root.querySelectorAll('[data-unwish]').forEach(b => {
    b.onclick = () => { toggleWish(b.dataset.unwish); openWishlist(); };
  });
  processPandaImages(root);
}

/* ===== Cart ===== */
function updateCartCount() {
  const count = cart.reduce((s, l) => s + l.qty, 0);
  $('cartCount').textContent = count;
  const detailCount = $('detailCartCount');
  if (detailCount) detailCount.textContent = count;
}

function cartSubtotal() {
  return cart.reduce((s, l) => {
    const p = PRODUCTS.find(x => x.id === l.id);
    return s + (p ? p.price * l.qty : 0);
  }, 0);
}

function addToCart(product, size, { openBag = true } = {}) {
  const existing = cart.find(l => l.id === product.id && l.size === size);
  const currentQty = existing ? existing.qty : 0;
  if (currentQty >= product.stock) {
    toast('No more stock available for that size');
    return false;
  }
  if (existing) existing.qty++;
  else cart.push({ id: product.id, size, qty: 1 });
  saveCart();
  updateCartCount();
  toast(`${product.name} · Size ${size} added`);
  if (openBag) {
    $('modalRoot').innerHTML = '';
    openCart();
  }
  return true;
}

function openCart() {
  const root = $('drawerRoot');
  const sub = cartSubtotal();
  root.innerHTML = `
    <div class="drawer-backdrop" id="cartBack">
      <aside class="drawer">
        <div class="drawer-head">
          <h2>Bag · ${cart.length}</h2>
          <button class="close-btn" id="closeCart">×</button>
        </div>
        ${cart.length ? `
          <div class="drawer-items">
            ${cart.map(l => {
              const p = PRODUCTS.find(x => x.id === l.id);
              if (!p) return '';
              return `
                <div class="cart-item">
                  <img class="${p.id === 'aj1-low-panda' ? 'panda-photo' : ''}" src="${escapeHTML(p.image)}" data-fallback="${escapeHTML(p.imageFallback)}" alt="${escapeHTML(p.name)}">
                  <div>
                    <h3>${escapeHTML(p.name)}</h3>
                    <div class="cart-meta">Size ${escapeHTML(l.size)} · ${escapeHTML(p.colorway)}</div>
                    <div class="cart-price">${money(p.price * l.qty)}</div>
                    <div class="qty-ctrl">
                      <button data-dec="${escapeHTML(p.id)}" data-size="${escapeHTML(l.size)}">−</button>
                      <span>${Number(l.qty)}</span>
                      <button data-inc="${escapeHTML(p.id)}" data-size="${escapeHTML(l.size)}">+</button>
                    </div>
                  </div>
                  <button class="remove-item" data-remove="${escapeHTML(p.id)}" data-size="${escapeHTML(l.size)}">×</button>
                </div>
              `;
            }).join('')}
          </div>
          <div class="drawer-foot">
            <div class="subtotal-row"><span>Subtotal</span><span>${money(sub)}</span></div>
            <p class="ship-note">Shipping calculated at checkout. Metro Davao ₱120 · Nationwide ₱180 · Pickup free.</p>
            <button class="btn btn-primary" style="width:100%" id="goCheckout">Checkout →</button>
          </div>
        ` : `
          <div class="empty-state">
            Your bag is empty.<br>
            <button class="btn btn-secondary" style="margin-top:16px" id="contShop">Continue shopping</button>
          </div>
        `}
      </aside>
    </div>
  `;
  $('closeCart').onclick = () => root.innerHTML = '';
  $('cartBack').onclick = e => { if (e.target.id === 'cartBack') root.innerHTML = ''; };
  if ($('contShop')) $('contShop').onclick = () => root.innerHTML = '';
  if ($('goCheckout')) $('goCheckout').onclick = openCheckout;

  const changeQty = (id, size, delta) => {
    const line = cart.find(x => x.id === id && x.size === size);
    const p = PRODUCTS.find(x => x.id === id);
    if (!line || !p) return;
    line.qty = Math.min(Math.max(line.qty + delta, 0), p.stock);
    cart = cart.filter(x => x.qty > 0);
    saveCart();
    updateCartCount();
    openCart();
  };
  root.querySelectorAll('[data-inc]').forEach(b => b.onclick = () => changeQty(b.dataset.inc, b.dataset.size, 1));
  root.querySelectorAll('[data-dec]').forEach(b => b.onclick = () => changeQty(b.dataset.dec, b.dataset.size, -1));
  root.querySelectorAll('[data-remove]').forEach(b => {
    b.onclick = () => {
      cart = cart.filter(x => !(x.id === b.dataset.remove && x.size === b.dataset.size));
      saveCart();
      updateCartCount();
      openCart();
    };
  });
  processPandaImages(root);
}

$('cartBtn').addEventListener('click', openCart);

/* ===== Product Detail Modal ===== */
function openDetail(p) {
  selectedSize = null;
  const root = $('modalRoot');
  const closeDetail = () => {
    root.innerHTML = '';
    document.documentElement.classList.remove('product-detail-open');
    const url = new URL(window.location.href);
    if (url.searchParams.has('product')) {
      url.searchParams.delete('product');
      window.history.replaceState(null, '', url);
    }
  };
  document.documentElement.classList.add('product-detail-open');
  root.innerHTML = `
    <div class="product-detail-page" id="detailBack">
      <header class="product-detail-toolbar">
        <button class="detail-icon-button" id="closeDetail" type="button" aria-label="Back to products">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/><path d="M9 12h12"/></svg>
        </button>
        <div class="detail-toolbar-actions">
          <button class="detail-icon-button" id="detailShare" type="button" aria-label="Share product">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.4"/></svg>
          </button>
          <button class="detail-icon-button" id="detailSearch" type="button" aria-label="Search products">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          </button>
          <button class="detail-icon-button detail-cart-button" id="detailCart" type="button" aria-label="Open cart">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 9H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
            <span class="detail-cart-count" id="detailCartCount">${cart.reduce((sum, line) => sum + line.qty, 0)}</span>
          </button>
        </div>
      </header>
      <main class="product-detail-content">
        <div class="product-detail-image ${p.id === 'aj1-low-panda' ? 'panda-visual' : ''}">
          <img class="${p.id === 'aj1-low-panda' ? 'panda-photo' : ''}" src="${escapeHTML(p.image)}" data-fallback="${escapeHTML(p.imageFallback)}" alt="${escapeHTML(p.name)} ${escapeHTML(p.colorway)}">
        </div>
        <section class="product-detail-info" aria-labelledby="detailTitle">
          <p class="product-detail-eyebrow">HALFCOURT · AVAILABLE NOW</p>
          <div class="product-detail-title-row">
            <div>
              <h1 id="detailTitle">${escapeHTML(p.name)}</h1>
              <p class="product-detail-colorway">AJ · ${escapeHTML(p.colorway)}</p>
            </div>
            <button class="detail-heart-button ${wishlist.includes(p.id) ? 'saved' : ''}" id="detailWish" type="button" aria-label="${wishlist.includes(p.id) ? 'Remove from wishlist' : 'Add to wishlist'}" aria-pressed="${wishlist.includes(p.id)}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8Z"/></svg>
            </button>
          </div>
          <p class="product-detail-price">${money(p.price)}</p>
          <p class="product-detail-description">${escapeHTML(p.desc)}</p>
          <div class="product-detail-size-heading"><span>Select size</span><span>US Men</span></div>
          <div class="sizes">
            ${ALL_SIZES.map(s => `
              <button class="size-btn" data-size="${s}" ${p.sizes.includes(s) ? '' : 'disabled'}>${s}</button>
            `).join('')}
          </div>
          <p class="product-detail-stock">${p.stock > 0 ? `● ${p.stock} pairs available` : '● Currently sold out'}</p>
          <a class="product-detail-contact" href="tel:09917257903">Questions? Call 09917257903</a>
        </section>
      </main>
      <footer class="product-detail-actions">
        <button class="detail-buy-button detail-add-button" id="addToBag" type="button" disabled>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l1 14H5L6 7Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>
          <span>Add to Cart</span>
        </button>
        <button class="detail-buy-button detail-buy-now" id="buyNow" type="button" disabled>Buy Now</button>
      </footer>
    </div>
  `;
  $('closeDetail').onclick = closeDetail;
  $('detailCart').onclick = () => {
    closeDetail();
    openCart();
  };
  $('detailSearch').onclick = () => {
    closeDetail();
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    $('searchInput').focus({ preventScroll: true });
  };
  $('detailShare').onclick = async () => {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set('product', p.id);
    const shareData = {
      title: `${p.name} · ${p.colorway} | HalfCourt`,
      text: `${p.name} in ${p.colorway} — ${money(p.price)}`,
      url: shareUrl.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        toast('Product link copied');
      } else {
        toast('Sharing is not available in this browser');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Product sharing failed:', error);
      toast('Could not share this product');
    }
  };
  $('detailWish').onclick = () => {
    toggleWish(p.id);
    const saved = wishlist.includes(p.id);
    const button = $('detailWish');
    button.classList.toggle('saved', saved);
    button.setAttribute('aria-pressed', String(saved));
    button.setAttribute('aria-label', saved ? 'Remove from wishlist' : 'Add to wishlist');
  };

  root.querySelectorAll('.size-btn:not(:disabled)').forEach(btn => {
    btn.onclick = () => {
      root.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.dataset.size;
      const addBtn = $('addToBag');
      const buyButton = $('buyNow');
      addBtn.disabled = buyButton.disabled = false;
      addBtn.querySelector('span').textContent = `Add Size ${selectedSize} to Cart`;
      addBtn.onclick = () => {
        animateCartFlight(p, root.querySelector('.product-detail-image img'));
        if (addToCart(p, selectedSize, { openBag: false })) {
          addBtn.querySelector('span').textContent = `Added Size ${selectedSize}`;
        }
      };
      buyButton.onclick = () => {
        if (addToCart(p, selectedSize, { openBag: false })) {
          closeDetail();
          openCheckout();
        }
      };
    };
  });
  processPandaImages(root);
}

/* ===== Checkout with validation ===== */
function openCheckout() {
  if (!cart.length) {
    toast('Your bag is empty');
    return;
  }
  if (!SHIP_OPTIONS.length) {
    toast('Live shipping options are unavailable. Please try again later.');
    return;
  }
  const saved = JSON.parse(localStorage.getItem('nike_address') || 'null') || {};
  selectedShip = saved.shipping || 'metro';
  $('drawerRoot').innerHTML = '';
  const root = $('checkoutRoot');
  root.innerHTML = `
    <div class="backdrop" id="ckBack">
      <div class="modal" style="grid-template-columns:1fr; max-width:480px">
        <button class="close-btn" id="closeCk">×</button>
        <form class="checkout-form" id="ckForm" novalidate>
          <div class="eyebrow">Checkout · Davao / PH</div>
          <h2>Delivery details</h2>
          <div class="field">
            <label>Full name *</label>
            <input type="text" id="ckName" value="${escapeHTML(saved.name || '')}" placeholder="Juan Dela Cruz" required autocomplete="name">
          </div>
          <div class="field">
            <label>Contact number *</label>
            <input type="tel" id="ckPhone" value="${escapeHTML(saved.phone || '')}" placeholder="09XX XXX XXXX" required inputmode="tel" autocomplete="tel">
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" id="ckEmail" value="${escapeHTML(saved.email || '')}" placeholder="you@email.com" autocomplete="email">
          </div>
          <div class="field">
            <label>Street / building, unit no. *</label>
            <input type="text" id="ckStreet" value="${escapeHTML(saved.street || '')}" placeholder="123 Mahogany St., Sunview Subd." required>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Barangay *</label>
              <input type="text" id="ckBrgy" value="${escapeHTML(saved.brgy || '')}" placeholder="Barangay" required>
            </div>
            <div class="field">
              <label>City *</label>
              <input type="text" id="ckCity" value="${escapeHTML(saved.city || 'Davao City')}" placeholder="City" required>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Province *</label>
              <input type="text" id="ckProvince" value="${escapeHTML(saved.province || 'Davao del Sur')}" placeholder="Province" required>
            </div>
            <div class="field">
              <label>ZIP code *</label>
              <input type="text" id="ckZip" value="${escapeHTML(saved.zip || '8000')}" placeholder="8000" required>
            </div>
          </div>
          <div id="ckError" class="error-msg"></div>
          <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">Shipping method</label>
          <div class="ship-options" id="shipOpts">
            ${SHIP_OPTIONS.map(s => `
              <div class="ship-option ${s.id === selectedShip ? 'selected' : ''}" data-ship="${escapeHTML(s.id)}">
                <span>${escapeHTML(s.label)} <span style="color:var(--text-muted)">· ${escapeHTML(s.eta)}</span></span>
                <span>${s.fee ? money(s.fee) : 'Free'}</span>
              </div>
            `).join('')}
          </div>
          <div class="order-summary">
            <h3>Summary</h3>
            <div class="summary-line"><span>Subtotal</span><span id="ckSub">${money(cartSubtotal())}</span></div>
            <div class="summary-line"><span>Estimated Delivery &amp; Handling</span><span id="ckShip">—</span></div>
            <div class="summary-line total"><span>Total</span><span id="ckTotal">—</span></div>
          </div>
          <label class="checkbox-row">
            <input type="checkbox" id="ckSave" checked>
            Save my details for next time
          </label>
          <div class="checkout-actions">
            <button type="submit" class="btn btn-primary btn-guest" id="placeOrder">Guest Checkout</button>
            <button type="button" class="btn btn-member" id="memberCk">Member Checkout</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const refreshTotals = () => {
    const sub = cartSubtotal();
    const fee = SHIP_OPTIONS.find(s => s.id === selectedShip).fee;
    const actualFee = selectedShip === 'pickup' ? 0 : fee;
    $('ckShip').textContent = actualFee ? money(actualFee) : 'Free';
    $('ckTotal').textContent = money(sub + actualFee);
  };
  refreshTotals();

  root.querySelectorAll('[data-ship]').forEach(el => {
    el.onclick = () => {
      selectedShip = el.dataset.ship;
      root.querySelectorAll('[data-ship]').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
      refreshTotals();
    };
  });

  if ($('memberCk')) $('memberCk').onclick = () => currentUser ? toast('You are signed in and can use Guest Checkout') : openAccount();
    $('closeCk').onclick = () => root.innerHTML = '';
  $('ckBack').onclick = e => { if (e.target.id === 'ckBack') root.innerHTML = ''; };

  $('ckForm').onsubmit = async e => {
    e.preventDefault();
    const name = $('ckName').value.trim();
    const phone = $('ckPhone').value.trim();
    const email = $('ckEmail').value.trim();
    const street = $('ckStreet').value.trim();
    const brgy = $('ckBrgy').value.trim();
    const city = $('ckCity').value.trim();
    const province = $('ckProvince').value.trim();
    const zip = $('ckZip').value.trim();
    const err = $('ckError');

    if (!name || !phone || !street || !brgy || !city || !province || !zip) {
      err.style.display = 'block';
      err.textContent = 'Please fill in all required fields marked with *.';
      return;
    }
    if (!/^[0-9+ ]{7,15}$/.test(phone)) {
      err.style.display = 'block';
      err.textContent = 'Please enter a valid contact number (e.g. 09XX XXX XXXX).';
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.style.display = 'block';
      err.textContent = 'Please enter a valid email address.';
      return;
    }

    err.style.display = 'none';
    const data = { name, phone, email, street, brgy, city, province, zip, shipping: selectedShip };
    if ($('ckSave').checked) localStorage.setItem('nike_address', JSON.stringify(data));

    const sub = cartSubtotal();
    const feeOpt = SHIP_OPTIONS.find(s => s.id === selectedShip);
    const fee = selectedShip === 'pickup' ? 0 : feeOpt.fee;
    const total = sub + fee;
    let orderNo = 'DV-' + Math.floor(100000 + Math.random() * 899999);
    const shipLabel = selectedShip === 'pickup' ? 'Ready for pickup' : selectedShip === 'metro' ? 'Out for Metro Davao delivery' : 'In transit (nationwide)';
    const shipMeta = selectedShip === 'pickup' ? 'Lanang store · ready in 24 hrs' : selectedShip === 'metro' ? '1–2 days within Metro Davao' : '3–7 days nationwide';
    const etaText = selectedShip === 'pickup' ? 'Ready in 24 hours (Lanang)' : selectedShip === 'metro' ? '1–2 days' : '3–7 days';


    const history = JSON.parse(localStorage.getItem('nike_orders') || '[]');
    const orderItems = cart.map(line => {
      const product = PRODUCTS.find(item => item.id === line.id);
      return {
        ...line,
        name: product ? product.name : line.id,
        colorway: product ? product.colorway : '',
        price: product ? product.price : 0,
        image: product ? product.image : '',
        imageFallback: product ? product.imageFallback : ''
      };
    });
    const shippingDetails = feeOpt ? {
      id: feeOpt.id,
      label: feeOpt.label,
      eta: feeOpt.eta,
      fee
    } : null;

    try {
      const savedOrder = await apiRequest('order', 'POST', {
        subtotal: sub,
        shippingId: feeOpt.id,
        shippingFee: fee,
        total,
        address: data,
        items: orderItems
      });
      orderNo = savedOrder.orderNo;
    } catch (requestError) {
      err.style.display = 'block';
      err.textContent = requestError.message;
      return;
    }

    history.unshift({
      orderNo,
      date: new Date().toISOString(),
      status: 'Processing',
      total,
      subtotal: sub,
      items: orderItems,
      address: data,
      shippingDetails
    });
    localStorage.setItem('nike_orders', JSON.stringify(history.slice(0, 20)));

    cart = [];
    saveCart();
    updateCartCount();

    root.innerHTML = `
      <div class="backdrop" id="doneBack">
        <div class="modal" style="grid-template-columns:1fr; max-width:460px">
          <button class="close-btn" id="closeDone">×</button>
          <div class="checkout-form order-done">
            <div class="eyebrow" style="justify-content:center">Order placed</div>
            <div class="order-num">${orderNo}</div>
            <p style="color:var(--text-muted);font-size:14px;line-height:1.55;margin-bottom:6px">
              Thanks, ${escapeHTML(name)}! We’ll text <strong style="color:var(--text)">${escapeHTML(phone)}</strong> to confirm.
            </p>

            <div class="order-summary" style="text-align:left;margin-top:16px">
              <h3>Order summary</h3>
              <div class="order-items-mini">
                ${orderItems.map(item => `
                  <div class="order-item-detail">
                    <img src="${escapeHTML(item.image)}" data-fallback="${escapeHTML(item.imageFallback)}" alt="${escapeHTML(item.name)} ${escapeHTML(item.colorway)}">
                    <div>
                      <strong>${escapeHTML(item.name)}</strong>
                      <span>${escapeHTML(item.colorway)} · Size ${escapeHTML(item.size)} · Qty ${Number(item.qty)}</span>
                    </div>
                    <b>${money(item.price * item.qty)}</b>
                  </div>
                `).join('')}
              </div>
              <div class="summary-line"><span>Subtotal</span><span>${money(sub)}</span></div>
              <div class="summary-line"><span>Delivery &amp; handling</span><span>${fee ? money(fee) : 'Free'}</span></div>
              <div class="summary-line total"><span>Total</span><span>${money(total)}</span></div>
            </div>

            <div class="order-details">
              <h3>Delivery details</h3>
              <p><strong>${escapeHTML(name)}</strong><br>${escapeHTML(phone)}${email ? ` · ${escapeHTML(email)}` : ''}</p>
              <p>${escapeHTML(street)}, ${escapeHTML(brgy)}<br>${escapeHTML(city)}, ${escapeHTML(province)} ${escapeHTML(zip)}</p>
              <p><strong>${feeOpt.label}</strong><br>${fee ? money(fee) : 'Free'} · ${feeOpt.eta}</p>
            </div>

            <div class="order-status">
              <div class="eta-banner">
                Est. arrival: <span id="etaText">${etaText}</span>
              </div>
              <h4>Where is my order?</h4>
              <div class="status-steps">
                <div class="status-step done current">
                  <div class="status-dot">✓</div>
                  <div>
                    <div class="label">Order placed</div>
                    <div class="meta">Just now · HalfCourt Davao</div>
                  </div>
                </div>
                <div class="status-step">
                  <div class="status-dot"></div>
                  <div>
                    <div class="label">Confirmed &amp; packed</div>
                    <div class="meta">We’ll text you when ready</div>
                  </div>
                </div>
                <div class="status-step">
                  <div class="status-dot"></div>
                  <div>
                    <div class="label">${escapeHTML(shipLabel)}</div>
                    <div class="meta">${escapeHTML(shipMeta)}</div>
                  </div>
                </div>
                <div class="status-step">
                  <div class="status-dot"></div>
                  <div>
                    <div class="label">Delivered</div>
                    <div class="meta">${escapeHTML(city)}, ${escapeHTML(province)}</div>
                  </div>
                </div>
              </div>
            </div>

            <button class="btn btn-primary" style="width:100%;margin-top:8px" id="doneClose">Back to shopping</button>
          </div>
        </div>
      </div>
    `
    const close = () => root.innerHTML = '';
    $('closeDone').onclick = close;
    $('doneClose').onclick = close;
    $('doneBack').onclick = e => { if (e.target.id === 'doneBack') close(); };
  };
}

/* ===== Mobile menu ===== */
$('menuBtn').addEventListener('click', () => $('mobileNav').classList.add('open'));
$('closeMobile').addEventListener('click', () => $('mobileNav').classList.remove('open'));
$('mobileNav').addEventListener('click', e => {
  if (e.target.id === 'mobileNav') $('mobileNav').classList.remove('open');
});
document.querySelectorAll('.mobile-nav-inner a').forEach(a => {
  a.addEventListener('click', () => $('mobileNav').classList.remove('open'));
});

/* ===== Join CTA ===== */
$('joinBtn')?.addEventListener('click', () => toast('Davao member perks — coming soon'));


/* ===== Hero shoe spin / switch ===== */
function initHeroSpinner() {
  const shoes = Array.from(document.querySelectorAll('#heroStage .hero-shoe'));
  const badge = $('heroBadge');
  const dotsWrap = $('heroDots');
  if (!shoes.length) return;

  let idx = 0;
  let timer;

  dotsWrap.innerHTML = shoes.map((_, i) =>
    `<button class="hero-dot ${i === 0 ? 'active' : ''}" data-idx="${i}" aria-label="Show shoe ${i + 1}"></button>`
  ).join('');

  const dots = Array.from(dotsWrap.querySelectorAll('.hero-dot'));

  function show(i) {
    const prev = shoes[idx];
    prev.classList.remove('active');
    prev.classList.add('exit');
    setTimeout(() => prev.classList.remove('exit'), 400);

    idx = i;
    const next = shoes[idx];
    next.classList.add('active');
    badge.textContent = next.dataset.label || '';
    dots.forEach((d, di) => d.classList.toggle('active', di === idx));
  }

  function next() {
    show((idx + 1) % shoes.length);
  }

  function start() {
    clearInterval(timer);
    timer = setInterval(next, 2800);
  }

  dots.forEach(d => {
    d.addEventListener('click', () => {
      show(+d.dataset.idx);
      start();
    });
  });

  // pause on hover
  const stage = $('heroStage');
  stage.addEventListener('mouseenter', () => clearInterval(timer));
  stage.addEventListener('mouseleave', start);

  start();
}

/* ===== Boot ===== */
async function boot() {
  await loadCurrentUser();
  await loadCatalog();
  renderGrid();
  renderCarousel();
  const sharedProductId = new URLSearchParams(window.location.search).get('product');
  if (sharedProductId) {
    const sharedProduct = PRODUCTS.find(product => product.id === sharedProductId);
    if (sharedProduct) openDetail(sharedProduct);
    else toast('That product is no longer available');
  }
  updateCartCount();
  updateWishCount();
  initHeroSpinner();
  initHeroMotion();
}

boot();
