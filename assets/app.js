const WHATSAPP_NUMBER = "555194285149"; // Jacaré Bike Store — número real do link wa.me na bio do Instagram

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
  cambios: "assets/products/p12_10.jpg",
  freios: "assets/products/p29_02.jpg",
  guidoes: "assets/products/p40_05.jpg",
  quadros: "assets/products/p74_00.jpg",
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

  const bikeCards = BIKES.map(b => `
    <div class="bike-card">
      <div class="bike-card-photo"><img src="${b.colors[0].img}" alt="${b.name}"></div>
      <div class="bike-card-info">
        <div class="bike-card-name">${b.name}</div>
        <ul class="bike-card-specs">${b.specs.slice(0, 3).map(s => `<li>${s}</li>`).join("")}</ul>
        <div class="bike-card-colors">
          ${b.colors.map(c => `<span class="color-dot" title="${c.name}"></span>`).join("")}
          <span class="color-label">${b.colors.map(c => c.name).join(" · ")}</span>
        </div>
        <a class="wa-inquire-btn" target="_blank" rel="noopener" href="${bikeInquiryLink(b)}">Consultar preço no WhatsApp</a>
      </div>
    </div>
  `).join("");

  app.innerHTML = `
    <div class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <span class="eyebrow">SÃO LEOPOLDO/RS</span>
          <h1>SUA BIKE, DO JEITO QUE VOCÊ QUISER</h1>
          <p>Loja online da Jacaré Bike Store. Escolha uma categoria ou monte sua bicicleta peça por peça, e feche o pedido direto pelo WhatsApp.</p>
        </div>
        <div class="hero-photo"><img src="assets/pages/hero-bg.jpg" alt=""></div>
      </div>
    </div>

    <div class="builder-cta">
      <div class="builder-cta-text">
        <div class="builder-cta-eyebrow">NOVO</div>
        <h2>Monte sua bicicleta</h2>
        <p>Escolha quadro, rodas, freios, câmbio e mais — acompanhe sua bike ganhando forma a cada peça escolhida.</p>
      </div>
      <button class="builder-cta-btn" id="startBuilderBtn">Começar a montar →</button>
    </div>

    <div id="categorias" class="category-grid">
      <div style="grid-column: 1/-1;">
        <div class="section-title">Categorias</div>
        <div class="section-sub">Escolha uma categoria, adicione ao carrinho e feche o pedido pelo WhatsApp.</div>
      </div>
      ${catCards}
    </div>

    <div class="bikes-section">
      <div class="section-title">Bicicletas prontas</div>
      <div class="section-sub">Modelos completos Sunpeed — preço sob consulta.</div>
      <div class="bike-grid">${bikeCards}</div>
    </div>

    <details class="soon-block">
      <summary>Ver demais categorias do catálogo (em breve)</summary>
      <div class="soon-chips">${soonChips}</div>
    </details>
  `;

  app.querySelectorAll(".cat-card[data-cat]").forEach(el => {
    el.addEventListener("click", () => renderCategory(el.dataset.cat));
  });
  document.getElementById("startBuilderBtn").addEventListener("click", () => startBuilder());
}

function bikeInquiryLink(bike) {
  const msg = `Olá! Vi no catálogo digital e tenho interesse na bicicleta ${bike.name} (${bike.colors.map(c => c.name).join(", ")}). Podem me passar o preço?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
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

// ---------- Bike Builder ("Monte sua Bicicleta") ----------
const BUILDER_STEPS = [
  { key: "quadros", label: "Quadro", parts: ["bp-frame"] },
  { key: "rodas", label: "Rodas & Aros", parts: ["bp-rim-f", "bp-rim-r"] },
  { key: "pneus", label: "Pneus", parts: ["bp-tire-f", "bp-tire-r"] },
  { key: "freios", label: "Freios", parts: ["bp-brake-f", "bp-brake-r"] },
  { key: "cambios", label: "Câmbio & Alavanca", parts: ["bp-drivetrain"] },
  { key: "guidoes", label: "Guidão", parts: ["bp-handlebar"] },
  { key: "selins", label: "Selim", parts: ["bp-saddle"] },
];

let builderChoices = {};
let builderStep = 0;

function startBuilder() {
  builderChoices = {};
  builderStep = 0;
  renderBuilderStep();
}

function bikeSvgMarkup(activeParts) {
  const cls = (name) => `bp-part ${name}${activeParts.includes(name) ? " active" : ""}`;
  return `
  <svg viewBox="0 0 200 100" class="bike-svg" xmlns="http://www.w3.org/2000/svg">
    <circle class="${cls("bp-tire-r")}" cx="35" cy="72" r="28"></circle>
    <circle class="${cls("bp-tire-f")}" cx="165" cy="72" r="28"></circle>
    <circle class="${cls("bp-rim-r")}" cx="35" cy="72" r="18"></circle>
    <circle class="${cls("bp-rim-f")}" cx="165" cy="72" r="18"></circle>
    <g class="${cls("bp-frame")}">
      <line x1="35" y1="72" x2="100" y2="72"></line>
      <line x1="100" y1="72" x2="90" y2="20"></line>
      <line x1="90" y1="20" x2="150" y2="32"></line>
      <line x1="100" y1="72" x2="150" y2="32"></line>
      <line x1="150" y1="34" x2="165" y2="72"></line>
    </g>
    <g class="${cls("bp-drivetrain")}">
      <circle cx="100" cy="72" r="7"></circle>
      <polygon points="38,84 49,90 39,97"></polygon>
    </g>
    <g class="${cls("bp-handlebar")}">
      <line x1="150" y1="32" x2="161" y2="17"></line>
      <line x1="152" y1="19" x2="172" y2="24"></line>
    </g>
    <ellipse class="${cls("bp-saddle")}" cx="88" cy="17" rx="11" ry="4"></ellipse>
    <g class="${cls("bp-brake-r")}"><rect x="29" y="46" width="11" height="9" rx="2"></rect></g>
    <g class="${cls("bp-brake-f")}"><rect x="160" y="46" width="11" height="9" rx="2"></rect></g>
  </svg>`;
}

function builderActiveParts() {
  let parts = [];
  BUILDER_STEPS.forEach(step => {
    if (builderChoices[step.key]) parts = parts.concat(step.parts);
  });
  return parts;
}

function builderTotal() {
  return Object.values(builderChoices).filter(Boolean).reduce((sum, p) => sum + p.price, 0);
}

function renderBuilderStep() {
  const step = BUILDER_STEPS[builderStep];
  const products = PRODUCTS.filter(p => p.cat === step.key);
  const chosen = builderChoices[step.key];

  const tracker = BUILDER_STEPS.map((s, i) => `
    <div class="tracker-dot ${i === builderStep ? "current" : ""} ${builderChoices[s.key] ? "done" : ""}" data-step="${i}">
      <span class="tracker-num">${builderChoices[s.key] ? "✓" : i + 1}</span>
      <span class="tracker-label">${s.label}</span>
    </div>
  `).join("");

  const cards = products.map(p => `
    <div class="product-card ${chosen && productKey(chosen) === productKey(p) ? "chosen" : ""}">
      <div class="thumb"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
      <div class="info">
        <div class="sku">${p.sku}</div>
        <div class="name">${p.name}</div>
        <div class="price">${money(p.price)}</div>
        <button class="add-btn choose-btn" data-key="${productKey(p)}">
          ${chosen && productKey(chosen) === productKey(p) ? "✓ Escolhido" : "Escolher"}
        </button>
      </div>
    </div>
  `).join("");

  app.innerHTML = `
    <div class="builder-page">
      <div class="breadcrumb"><button id="exitBuilderBtn">← Menu</button> / Monte sua Bicicleta</div>

      <div class="builder-visual">
        ${bikeSvgMarkup(builderActiveParts())}
        <div class="builder-subtotal">Subtotal: <strong>${money(builderTotal())}</strong></div>
      </div>

      <div class="builder-tracker">${tracker}</div>

      <div class="section-title">Passo ${builderStep + 1} de ${BUILDER_STEPS.length}: ${step.label}</div>
      <div class="section-sub">${products.length} opções disponíveis</div>
      <div class="product-grid">${cards}</div>

      <div class="builder-nav">
        <button class="builder-nav-btn ghost" id="builderBackBtn" ${builderStep === 0 ? "disabled" : ""}>← Voltar</button>
        <button class="builder-nav-btn ghost" id="builderSkipBtn">Pular esta etapa</button>
        <button class="builder-nav-btn primary" id="builderNextBtn">${builderStep === BUILDER_STEPS.length - 1 ? "Ver resumo" : "Continuar →"}</button>
      </div>
    </div>
  `;

  document.getElementById("exitBuilderBtn").addEventListener("click", renderHome);
  document.querySelectorAll(".tracker-dot").forEach(el => {
    el.addEventListener("click", () => { builderStep = Number(el.dataset.step); renderBuilderStep(); });
  });
  document.querySelectorAll(".choose-btn").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      builderChoices[step.key] = products[i];
      renderBuilderStep();
    });
  });
  document.getElementById("builderBackBtn").addEventListener("click", () => {
    if (builderStep > 0) { builderStep--; renderBuilderStep(); }
  });
  document.getElementById("builderSkipBtn").addEventListener("click", () => {
    builderChoices[step.key] = null;
    advanceBuilder();
  });
  document.getElementById("builderNextBtn").addEventListener("click", () => advanceBuilder());
  window.scrollTo(0, 0);
}

function advanceBuilder() {
  if (builderStep < BUILDER_STEPS.length - 1) { builderStep++; renderBuilderStep(); }
  else renderBuilderSummary();
}

function builderWaLink() {
  const lines = BUILDER_STEPS.map(step => {
    const p = builderChoices[step.key];
    return p ? `• ${step.label}: ${p.sku} - ${p.name} (${money(p.price)})` : `• ${step.label}: não escolhido`;
  });
  const msg = `Olá! Montei uma bicicleta no catálogo digital e quero fazer um pedido:\n\n${lines.join("\n")}\n\nTotal: ${money(builderTotal())}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function renderBuilderSummary() {
  const rows = BUILDER_STEPS.map(step => {
    const p = builderChoices[step.key];
    return `
      <div class="summary-row">
        <div class="summary-label">${step.label}</div>
        ${p
          ? `<div class="summary-item"><img src="${p.img}" alt=""><span>${p.name}</span><strong>${money(p.price)}</strong></div>`
          : `<div class="summary-item empty">Não escolhido</div>`}
      </div>
    `;
  }).join("");

  app.innerHTML = `
    <div class="builder-page">
      <div class="breadcrumb"><button id="exitBuilderBtn">← Menu</button> / Monte sua Bicicleta / Resumo</div>

      <div class="builder-visual">
        ${bikeSvgMarkup(builderActiveParts())}
      </div>

      <div class="section-title">Sua bicicleta montada</div>
      <div class="summary-list">${rows}</div>

      <div class="cart-total" style="max-width:500px;margin:16px auto;"><span>Total</span><span>${money(builderTotal())}</span></div>

      <div class="builder-nav" style="max-width:500px;margin:0 auto;">
        <button class="builder-nav-btn ghost" id="restartBuilderBtn">Montar de novo</button>
        <a class="checkout-btn" href="${builderWaLink()}" target="_blank" rel="noopener">Fechar pedido no WhatsApp</a>
      </div>
    </div>
  `;
  document.getElementById("exitBuilderBtn").addEventListener("click", renderHome);
  document.getElementById("restartBuilderBtn").addEventListener("click", () => startBuilder());
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
