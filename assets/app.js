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
  cabos: "assets/products/p8_00.jpg",
  correntes: "assets/products/p19_00.jpg",
  canotes: "assets/products/p16_00.jpg",
  cubos: "assets/products/p21_00.jpg",
  ferramentas: "assets/products/p34_00.jpg",
  gancheiras: "assets/products/p38_00.jpg",
  manoplas: "assets/products/p46_00.jpg",
  "mov-central": "assets/products/p51_00.jpg",
  "mov-direcao": "assets/products/p54_00.jpg",
  pedais: "assets/products/p56_00.jpg",
  pedivelas: "assets/products/p60_00.jpg",
  raios: "assets/products/p77_00.jpg",
  "roda-livre": "assets/products/p80_00.jpg",
  suspensao: "assets/products/p101_00.jpg",
  suplementos: "assets/products/p103_00.jpg",
  squeeze: "assets/products/p124_00.jpg",
};

function renderHome() {
  closeCart();
  const soonChips = COMING_SOON_CATEGORIES.map(name => `<span class="soon-chip">${name}</span>`).join("");

  const bikeCards = BIKES.flatMap(b => b.colors.map((c, ci) => `
    <div class="product-card">
      <div class="thumb" data-open-bike="${b.id}" data-color-idx="${ci}">
        <button class="fav-btn" aria-label="Favoritar" type="button">♡</button>
        <img src="${c.img}" alt="${b.name} ${c.name}" loading="lazy">
      </div>
      <div class="info">
        <div class="name" data-open-bike="${b.id}" data-color-idx="${ci}">${b.name} — ${c.name}</div>
        <ul class="bike-card-specs">${b.specs.slice(0, 2).map(s => `<li>${s}</li>`).join("")}</ul>
        <div class="price price-inquiry">Sob consulta</div>
        <a class="add-btn" target="_blank" rel="noopener" href="${bikeInquiryLink(b, c)}">Consultar no WhatsApp</a>
      </div>
    </div>
  `)).join("");

  app.innerHTML = `
    <button class="hero-banner" id="heroBuilderBtn" aria-label="Monte sua bicicleta">
      <img src="assets/brand/hero-banner.jpg" alt="Jacaré Bike Store — Liberdade sobre duas rodas">
    </button>

    <div class="benefits-bar">
      <div class="benefit">
        <span class="benefit-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="14" height="11"></rect><path d="M15 10h4l3 3v4h-7z"></path><circle cx="6" cy="19" r="2"></circle><circle cx="18" cy="19" r="2"></circle></svg></span>
        <div><strong>Entrega</strong><span>Consulte a região</span></div>
      </div>
      <span class="benefit-sep"></span>
      <div class="benefit">
        <span class="benefit-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M8.2 13.5L7 22l5-3 5 3-1.2-8.5"></path></svg></span>
        <div><strong>Revenda Autorizada</strong><span>Oggi e Absolute</span></div>
      </div>
      <span class="benefit-sep"></span>
      <div class="benefit">
        <span class="benefit-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.8 2.8-2-2z"></path></svg></span>
        <div><strong>Assistência Técnica</strong><span>Mecânica especializada</span></div>
      </div>
      <span class="benefit-sep"></span>
      <div class="benefit">
        <span class="benefit-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path></svg></span>
        <div><strong>Atendimento</strong><span>WhatsApp e loja física</span></div>
      </div>
    </div>

    <div class="cats-section">
      <div class="section-title center">Compre por Categoria</div>
      <div class="section-sub center">Acesso rápido às peças mais procuradas</div>
      <div class="cat-icons-row">
        ${["quadros","rodas","pneus","capacetes","selins","freios","acessorios","bombas"].map(id => {
          const cat = CATEGORIES.find(c => c.id === id);
          return cat ? `
            <div class="cat-icon" data-cat="${cat.id}">
              <div class="cat-icon-photo"><img src="${CATEGORY_COVER[cat.id]}" alt="${cat.name}"></div>
              <span>${cat.name}</span>
            </div>` : "";
        }).join("")}
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

    ${carouselSectionHtml("Bicicletas Prontas", bikeCards, null)}
    ${carouselSectionHtml("Capacetes", PRODUCTS.filter(p => p.cat === "capacetes").map(productCardHtml).join(""), "capacetes")}
    ${carouselSectionHtml("Selins", PRODUCTS.filter(p => p.cat === "selins").map(productCardHtml).join(""), "selins")}

    <details class="soon-block">
      <summary>Ver demais categorias do catálogo (em breve)</summary>
      <div class="soon-chips">${soonChips}</div>
    </details>
  `;

  app.querySelectorAll(".cat-icon[data-cat]").forEach(el => {
    el.addEventListener("click", () => renderCategory(el.dataset.cat));
  });
  document.getElementById("startBuilderBtn").addEventListener("click", () => startBuilder());
  document.getElementById("heroBuilderBtn").addEventListener("click", () => startBuilder());

  bindAddButtons(document.getElementById("carousel-capacetes"), PRODUCTS.filter(p => p.cat === "capacetes"));
  bindAddButtons(document.getElementById("carousel-selins"), PRODUCTS.filter(p => p.cat === "selins"));
  document.getElementById("carousel-bicicletas-prontas")?.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const active = btn.classList.toggle("active");
      btn.textContent = active ? "♥" : "♡";
    });
  });
  document.getElementById("carousel-bicicletas-prontas")?.querySelectorAll("[data-open-bike]").forEach(el => {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => renderBikeDetail(el.dataset.openBike, Number(el.dataset.colorIdx)));
  });
  app.querySelectorAll(".carousel-arrow").forEach(btn => {
    btn.addEventListener("click", () => {
      const track = document.getElementById(btn.dataset.target);
      track.scrollBy({ left: (btn.classList.contains("prev") ? -1 : 1) * 320, behavior: "smooth" });
    });
  });
  app.querySelectorAll(".view-all-link[data-cat]").forEach(btn => {
    btn.addEventListener("click", () => renderCategory(btn.dataset.cat));
  });
}

function carouselSectionHtml(title, cardsHtml, viewAllCatId) {
  const id = "carousel-" + title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
  return `
    <div class="carousel-section">
      <div class="carousel-header">
        <div class="section-title">${title}</div>
        ${viewAllCatId ? `<button class="view-all-link" data-cat="${viewAllCatId}">ver mais ›</button>` : ""}
      </div>
      <div class="carousel-wrap">
        <button class="carousel-arrow prev" data-target="${id}" aria-label="Anterior">‹</button>
        <div class="carousel-track" id="${id}">${cardsHtml}</div>
        <button class="carousel-arrow next" data-target="${id}" aria-label="Próximo">›</button>
      </div>
    </div>
  `;
}

function bikeInquiryLink(bike, color) {
  const colorTxt = color ? ` na cor ${color.name}` : ` (${bike.colors.map(c => c.name).join(", ")})`;
  const msg = `Olá! Vi no catálogo digital e tenho interesse na bicicleta ${bike.name}${colorTxt}. Podem me passar o preço?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function productCardHtml(p) {
  const inCart = isInCart(p);
  return `
    <div class="product-card">
      <div class="thumb" data-open="${productKey(p)}">
        <button class="fav-btn" aria-label="Favoritar" type="button">♡</button>
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <div class="info">
        <div class="name" data-open="${productKey(p)}">${p.name}</div>
        <div class="sku">Cód. ${p.sku}</div>
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
  container.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const active = btn.classList.toggle("active");
      btn.textContent = active ? "♥" : "♡";
    });
  });
  container.querySelectorAll("[data-open]").forEach(el => {
    el.style.cursor = "pointer";
    const key = el.dataset.open;
    const product = products.find(p => productKey(p) === key);
    if (product) el.addEventListener("click", () => renderProductDetail(product));
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

function renderProductDetail(product) {
  const cat = CATEGORIES.find(c => c.id === product.cat);
  const related = PRODUCTS.filter(p => p.cat === product.cat && p !== product).slice(0, 10);
  const inCart = isInCart(product);

  app.innerHTML = `
    <div class="pdp">
      <div class="breadcrumb">
        <button id="backHomeBtn">Menu</button> /
        <button id="backCatBtn">${cat.name}</button> /
        ${product.name}
      </div>
      <div class="pdp-grid">
        <div class="pdp-gallery"><img src="${product.img}" alt="${product.name}"></div>
        <div class="pdp-buy">
          <h1>${product.name}</h1>
          <div class="pdp-code">Cód. do Produto: ${product.sku}</div>
          <div class="pdp-price">${money(product.price)}</div>
          <button class="add-btn pdp-add-btn ${inCart ? "in-cart" : ""}" id="pdpAddBtn">
            ${inCart ? "✓ No carrinho — adicionar mais" : "Adicionar ao carrinho"}
          </button>
          <div class="pdp-note">Fechamos o pedido direto pelo WhatsApp — sem pagamento online neste modelo de demonstração.</div>
        </div>
      </div>

      <div class="pdp-description">
        <h2>Descrição do Produto</h2>
        <p>${product.name}</p>
        <div class="pdp-meta">Categoria: <strong>${cat.name}</strong> · Código: <strong>${product.sku}</strong></div>
      </div>

      ${related.length ? `
      <div class="carousel-section" style="padding-left:0;padding-right:0;">
        <div class="carousel-header"><div class="section-title">Você também pode gostar de</div></div>
        <div class="carousel-wrap">
          <button class="carousel-arrow prev" data-target="pdp-related" aria-label="Anterior">‹</button>
          <div class="carousel-track" id="pdp-related">${related.map(productCardHtml).join("")}</div>
          <button class="carousel-arrow next" data-target="pdp-related" aria-label="Próximo">›</button>
        </div>
      </div>` : ""}
    </div>
  `;

  document.getElementById("backHomeBtn").addEventListener("click", renderHome);
  document.getElementById("backCatBtn").addEventListener("click", () => renderCategory(product.cat));
  document.getElementById("pdpAddBtn").addEventListener("click", (e) => {
    addToCart(product);
    e.target.textContent = "✓ No carrinho — adicionar mais";
    e.target.classList.add("in-cart");
  });
  if (related.length) bindAddButtons(document.getElementById("pdp-related"), related);
  app.querySelectorAll(".carousel-arrow").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.target).scrollBy({ left: (btn.classList.contains("prev") ? -1 : 1) * 320, behavior: "smooth" });
    });
  });
  window.scrollTo(0, 0);
}

function renderBikeDetail(bikeId, colorIdx) {
  const bike = BIKES.find(b => b.id === bikeId);
  const ci = colorIdx || 0;
  const color = bike.colors[ci];
  const others = BIKES.filter(b => b.id !== bikeId);

  app.innerHTML = `
    <div class="pdp">
      <div class="breadcrumb">
        <button id="backHomeBtn">Menu</button> / ${bike.name}
      </div>
      <div class="pdp-grid">
        <div class="pdp-gallery"><img src="${color.img}" alt="${bike.name} ${color.name}"></div>
        <div class="pdp-buy">
          <h1>${bike.name}</h1>
          <div class="pdp-price price-inquiry">Sob consulta</div>
          <div class="pdp-color-select">
            <strong>Selecione a Cor:</strong>
            <div class="pdp-swatches">
              ${bike.colors.map((c, i) => `
                <button class="pdp-swatch ${i === ci ? "active" : ""}" data-idx="${i}" title="${c.name}">
                  <img src="${c.img}" alt="${c.name}">
                </button>
              `).join("")}
            </div>
            <span class="pdp-color-name">${color.name}</span>
          </div>
          <a class="add-btn pdp-add-btn" target="_blank" rel="noopener" href="${bikeInquiryLink(bike, color)}">Consultar no WhatsApp</a>
          <div class="pdp-note">Modelo completo — preço sob consulta, sem pagamento online neste modelo de demonstração.</div>
        </div>
      </div>

      <div class="pdp-description">
        <h2>Especificações</h2>
        <ul class="pdp-specs">${bike.specs.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>

      ${others.length ? `
      <div class="carousel-section" style="padding-left:0;padding-right:0;">
        <div class="carousel-header"><div class="section-title">Outros modelos</div></div>
        <div class="carousel-wrap">
          <button class="carousel-arrow prev" data-target="pdp-related-bikes" aria-label="Anterior">‹</button>
          <div class="carousel-track" id="pdp-related-bikes">
            ${others.flatMap(b => b.colors.slice(0, 1).map(c => `
              <div class="product-card" data-bike="${b.id}" data-color="0" style="cursor:pointer;">
                <div class="thumb"><img src="${c.img}" alt="${b.name}"></div>
                <div class="info">
                  <div class="name">${b.name}</div>
                  <div class="price price-inquiry">Sob consulta</div>
                </div>
              </div>
            `)).join("")}
          </div>
          <button class="carousel-arrow next" data-target="pdp-related-bikes" aria-label="Próximo">›</button>
        </div>
      </div>` : ""}
    </div>
  `;

  document.getElementById("backHomeBtn").addEventListener("click", renderHome);
  app.querySelectorAll(".pdp-swatch").forEach(btn => {
    btn.addEventListener("click", () => renderBikeDetail(bikeId, Number(btn.dataset.idx)));
  });
  app.querySelectorAll("#pdp-related-bikes .product-card").forEach(card => {
    card.addEventListener("click", () => renderBikeDetail(card.dataset.bike, Number(card.dataset.color)));
  });
  app.querySelectorAll(".carousel-arrow").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.target).scrollBy({ left: (btn.classList.contains("prev") ? -1 : 1) * 320, behavior: "smooth" });
    });
  });
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

function spokeLines(cx, cy, rInner, rOuter, count) {
  let out = "";
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count;
    const x1 = cx + Math.cos(a) * rInner, y1 = cy + Math.sin(a) * rInner;
    const x2 = cx + Math.cos(a) * rOuter, y2 = cy + Math.sin(a) * rOuter;
    out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"></line>`;
  }
  return out;
}

function bikeSvgMarkup(activeParts) {
  const cls = (name) => `bp-part ${name}${activeParts.includes(name) ? " active" : ""}`;
  const rearHub = [42, 95], frontHub = [218, 95];
  const bb = [113, 95], seatTop = [92, 38], headTop = [166, 50], headBot = [171, 60];

  return `
  <svg viewBox="0 0 260 130" class="bike-svg" xmlns="http://www.w3.org/2000/svg">
    <ellipse class="bike-shadow" cx="130" cy="122" rx="100" ry="6"></ellipse>

    <g class="${cls("bp-tire-r")}"><circle cx="${rearHub[0]}" cy="${rearHub[1]}" r="32"></circle></g>
    <g class="${cls("bp-tire-f")}"><circle cx="${frontHub[0]}" cy="${frontHub[1]}" r="32"></circle></g>
    <g class="${cls("bp-rim-r")}">
      <circle cx="${rearHub[0]}" cy="${rearHub[1]}" r="20"></circle>
      ${spokeLines(rearHub[0], rearHub[1], 4, 19, 10)}
      <circle cx="${rearHub[0]}" cy="${rearHub[1]}" r="4" class="hub-dot"></circle>
    </g>
    <g class="${cls("bp-rim-f")}">
      <circle cx="${frontHub[0]}" cy="${frontHub[1]}" r="20"></circle>
      ${spokeLines(frontHub[0], frontHub[1], 4, 19, 10)}
      <circle cx="${frontHub[0]}" cy="${frontHub[1]}" r="4" class="hub-dot"></circle>
    </g>

    <g class="${cls("bp-frame")}">
      <line x1="${rearHub[0]}" y1="${rearHub[1]}" x2="${bb[0]}" y2="${bb[1]}"></line>
      <line x1="${bb[0]}" y1="${bb[1]}" x2="${seatTop[0]}" y2="${seatTop[1]}"></line>
      <line x1="${rearHub[0]}" y1="${rearHub[1]}" x2="${seatTop[0]}" y2="${seatTop[1]}"></line>
      <line x1="${seatTop[0]}" y1="${seatTop[1]}" x2="${headTop[0]}" y2="${headTop[1]}"></line>
      <line x1="${bb[0]}" y1="${bb[1]}" x2="${headBot[0]}" y2="${headBot[1]}"></line>
      <line class="fork" x1="${headBot[0]}" y1="${headBot[1]}" x2="${frontHub[0]}" y2="${frontHub[1]}"></line>
    </g>

    <g class="${cls("bp-drivetrain")}">
      <circle cx="${bb[0]}" cy="${bb[1]}" r="10"></circle>
    </g>

    <g class="${cls("bp-handlebar")}">
      <line x1="${headTop[0]}" y1="${headTop[1]}" x2="${headTop[0]+3}" y2="${headTop[1]-22}"></line>
      <line x1="${headTop[0]-10}" y1="${headTop[1]-20}" x2="${headTop[0]+16}" y2="${headTop[1]-20}"></line>
    </g>

    <g class="${cls("bp-saddle")}">
      <line x1="${seatTop[0]}" y1="${seatTop[1]}" x2="${seatTop[0]}" y2="${seatTop[1]-10}"></line>
      <rect x="${seatTop[0]-15}" y="${seatTop[1]-15}" width="28" height="7" rx="3.5"></rect>
    </g>

    <g class="${cls("bp-brake-r")}"><rect x="${rearHub[0]-5}" y="${rearHub[1]-30}" width="11" height="9" rx="2.5"></rect></g>
    <g class="${cls("bp-brake-f")}"><rect x="${frontHub[0]-6}" y="${frontHub[1]-30}" width="11" height="9" rx="2.5"></rect></g>
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

// ---------- Nav dropdowns ----------
const NAV_PECAS = [
  "quadros", "rodas", "pneus", "freios", "cambios", "guidoes", "pedais", "pedivelas",
  "cubos", "raios", "roda-livre", "mov-central", "mov-direcao", "correntes",
  "cabos", "canotes", "manoplas", "suspensao",
];
const NAV_ACESSORIOS = [
  "acessorios", "capacetes", "selins", "bombas", "squeeze", "suplementos", "gancheiras", "ferramentas",
];

function fillNavDropdown(elId, catIds) {
  const el = document.getElementById(elId);
  el.innerHTML = catIds.map(id => {
    const cat = CATEGORIES.find(c => c.id === id);
    return cat ? `<a href="#" data-cat="${cat.id}">${cat.name}</a>` : "";
  }).join("");
  el.querySelectorAll("a[data-cat]").forEach(a => {
    a.addEventListener("click", (e) => { e.preventDefault(); renderCategory(a.dataset.cat); });
  });
}
fillNavDropdown("navPecas", NAV_PECAS);
fillNavDropdown("navAcessorios", NAV_ACESSORIOS);

document.getElementById("navBicicletas").addEventListener("click", () => {
  renderHome();
  setTimeout(() => document.querySelector(".bikes-section")?.scrollIntoView({ behavior: "smooth" }), 50);
});
document.getElementById("navBuilder").addEventListener("click", () => startBuilder());

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
