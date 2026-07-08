const WHATSAPP_NUMBER = "5547996268282"; // (47) 99626-8282, formato internacional

const app = document.getElementById("app");
const cartOverlayRoot = document.getElementById("cartOverlayRoot");

function money(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function productKey(p) {
  return `${p.cat}__${p.sku}__${p.name}`;
}

// ---------- Cart state (persisted in localStorage) ----------
let cart = {}; // key -> { product, qty }
try {
  const saved = JSON.parse(localStorage.getItem("allcompany_cart") || "{}");
  cart = saved;
} catch (e) { cart = {}; }

function saveCart() {
  localStorage.setItem("allcompany_cart", JSON.stringify(cart));
}

function cartCount() {
  return Object.values(cart).reduce((sum, entry) => sum + entry.qty, 0);
}

function addToCart(product) {
  const key = productKey(product);
  if (cart[key]) cart[key].qty += 1;
  else cart[key] = { product, qty: 1 };
  saveCart();
  updateCartBadge();
}

function setQty(key, qty) {
  if (qty <= 0) { delete cart[key]; }
  else if (cart[key]) { cart[key].qty = qty; }
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  const count = cartCount();
  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);
}

function cartTotal() {
  return Object.values(cart).reduce((sum, e) => sum + e.qty * e.product.price, 0);
}

function isInCart(product) {
  return !!cart[productKey(product)];
}

// ---------- Rendering ----------
function countByCat(catId) {
  return PRODUCTS.filter(p => p.cat === catId).length;
}

const CATEGORY_COVER = {
  bombas: "assets/products/p6_02.jpg",
  pneus: "assets/products/p64_02.jpg",
  rodas: "assets/products/p85_05.jpg",
  selins: "assets/products/p88_01.jpg",
  capacetes: "assets/products/p99_06.jpg",
  acessorios: "assets/products/p117_00.jpg",
};

function renderHome() {
  closeCart();
  const catCards = CATEGORIES.map(c => `
    <div class="cat-card" data-cat="${c.id}" style="background-image:url('${CATEGORY_COVER[c.id]}')">
      <div class="cat-card-label">
        ${c.name}
        <span class="count">${countByCat(c.id)} produtos</span>
      </div>
    </div>
  `).join("");

  const soonChips = COMING_SOON_CATEGORIES.map(name => `<span class="soon-chip">${name}</span>`).join("");

  app.innerHTML = `
    <div class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <span class="eyebrow">CATÁLOGO 2026</span>
          <h1>MOVENDO VOCÊ PARA O FUTURO</h1>
          <p>Catálogo digital ALL COMPANY B2B. Escolha uma categoria, monte seu pedido e feche pelo WhatsApp.</p>
        </div>
        <div class="hero-photo"><img src="assets/pages/hero-bg.jpg" alt=""></div>
      </div>
    </div>

    <div id="categorias" class="category-grid">
      <div style="grid-column: 1/-1;">
        <div class="section-title">Categorias</div>
        <div class="section-sub">Escolha uma categoria, adicione ao carrinho e feche o pedido pelo WhatsApp.</div>
      </div>
      ${catCards}
    </div>

    <details class="soon-block">
      <summary>Ver demais categorias do catálogo (em breve)</summary>
      <div class="soon-chips">${soonChips}</div>
    </details>
  `;

  app.querySelectorAll(".cat-card[data-cat]").forEach(el => {
    el.addEventListener("click", () => renderCategory(el.dataset.cat));
  });
}

function productCardHtml(p) {
  const inCart = isInCart(p);
  return `
    <div class="product-card">
      <div class="thumb"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
      <div class="info">
        <div class="sku">${p.sku}</div>
        <div class="name">${p.name}</div>
        <div class="price">${money(p.price)}</div>
        <button class="add-btn ${inCart ? "in-cart" : ""}" data-key="${productKey(p)}">
          ${inCart ? "✓ No carrinho — adicionar mais" : "Adicionar ao carrinho"}
        </button>
      </div>
    </div>
  `;
}

function bindAddButtons(container, products) {
  container.querySelectorAll(".add-btn").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      addToCart(products[i]);
      btn.textContent = "✓ No carrinho — adicionar mais";
      btn.classList.add("in-cart");
    });
  });
}

function renderCategory(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  const products = PRODUCTS.filter(p => p.cat === catId);

  const cards = products.map(productCardHtml).join("");

  app.innerHTML = `
    <div class="category-page">
      <div class="breadcrumb"><button id="backBtn">← Menu</button> / ${cat.name}</div>
      <div class="section-title">${cat.name}</div>
      <div class="section-sub">${products.length} produtos</div>
      <div class="product-grid">${cards}</div>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", renderHome);
  bindAddButtons(app.querySelector(".product-grid"), products);
  window.scrollTo(0, 0);
}

function renderSearch(query) {
  const q = query.trim().toLowerCase();
  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  );

  const cards = results.map(productCardHtml).join("");

  app.innerHTML = `
    <div class="search-results">
      <div class="breadcrumb"><button id="backBtn">← Menu</button> / Busca: "${query}"</div>
      <div class="section-title">${results.length} resultado(s)</div>
      <div class="product-grid" style="margin-top:16px;">${cards || "<p>Nenhum produto encontrado nesta amostra do catálogo.</p>"}</div>
    </div>
  `;
  document.getElementById("backBtn").addEventListener("click", renderHome);
  bindAddButtons(app.querySelector(".product-grid"), results);
  window.scrollTo(0, 0);
}

// ---------- Cart drawer ----------
function waCheckoutLink() {
  const entries = Object.values(cart);
  const lines = entries.map(e => `• ${e.qty}x ${e.product.sku} - ${e.product.name} (${money(e.product.price)} cada)`);
  const msg = `Olá! Vi no catálogo digital e quero fazer um pedido:\n\n${lines.join("\n")}\n\nTotal: ${money(cartTotal())}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function renderCartDrawer() {
  const entries = Object.values(cart);
  const rows = entries.map(e => `
    <div class="cart-row">
      <div class="thumb"><img src="${e.product.img}" alt="${e.product.name}"></div>
      <div class="details">
        <div class="name">${e.product.name}</div>
        <div class="price">${money(e.product.price)}</div>
        <div class="qty-control">
          <button data-action="dec" data-key="${productKey(e.product)}">−</button>
          <span class="qty">${e.qty}</span>
          <button data-action="inc" data-key="${productKey(e.product)}">+</button>
        </div>
      </div>
      <div class="cart-row-right">
        <div class="price">${money(e.qty * e.product.price)}</div>
        <button class="remove-link" data-action="remove" data-key="${productKey(e.product)}">remover</button>
      </div>
    </div>
  `).join("");

  cartOverlayRoot.innerHTML = `
    <div class="cart-overlay" id="cartOverlay">
      <div class="cart-drawer" id="cartDrawer">
        <div class="cart-header">
          <h2>Seu carrinho</h2>
          <button id="closeCartBtn" aria-label="Fechar">&times;</button>
        </div>
        <div class="cart-items">
          ${entries.length ? rows : '<div class="cart-empty">Seu carrinho está vazio.<br>Adicione produtos nas categorias.</div>'}
        </div>
        <div class="cart-footer">
          <div class="cart-total"><span>Total</span><span>${money(cartTotal())}</span></div>
          <a class="checkout-btn ${entries.length ? "" : "hidden"}" href="${waCheckoutLink()}" target="_blank" rel="noopener">
            Finalizar pedido no WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;

  document.getElementById("cartOverlay").addEventListener("click", (e) => {
    if (e.target.id === "cartOverlay") closeCart();
  });
  document.getElementById("closeCartBtn").addEventListener("click", closeCart);
  cartOverlayRoot.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      const action = btn.dataset.action;
      if (action === "inc") setQty(key, cart[key].qty + 1);
      else if (action === "dec") setQty(key, cart[key].qty - 1);
      else if (action === "remove") setQty(key, 0);
    });
  });
}

function openCart() {
  renderCartDrawer();
}
function closeCart() {
  cartOverlayRoot.innerHTML = "";
}

document.getElementById("menuBtn").addEventListener("click", renderHome);
document.getElementById("menuBtnTop").addEventListener("click", renderHome);
document.getElementById("cartBtn").addEventListener("click", openCart);

const searchInput = document.getElementById("searchInput");
let searchTimer;
searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  const val = e.target.value;
  searchTimer = setTimeout(() => {
    if (val.trim().length >= 2) renderSearch(val);
    else if (val.trim().length === 0) renderHome();
  }, 200);
});
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.value.trim().length > 0) renderSearch(e.target.value);
});

updateCartBadge();
renderHome();
