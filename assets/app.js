const WHATSAPP_NUMBER = "555194285149"; // Jacaré Bike Store — número real do link wa.me na bio do Instagram
const PIX_DISCOUNT = 0.05;

const app = document.getElementById("app");
const cartOverlayRoot = document.getElementById("cartOverlayRoot");
const IMG = (typeof IMAGES !== "undefined") ? IMAGES : {};

function money(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
}

function slug(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function waLink(msg) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ---------- Produtos e variantes ----------
function variantsOf(p) {
  return p.variants || [{ label: p.color || "", sku: p.sku || "" }];
}
function hasChoice(p) {
  return !!p.variants && p.variants.length > 1;
}
function variantPrice(p, v) {
  return (v && v.price) || p.price;
}
function minPrice(p) {
  return Math.min(...variantsOf(p).map(v => variantPrice(p, v)));
}
function colorOfLabel(label) {
  return label.split(" — ")[0];
}

// Foto: primeiro a da cor escolhida, depois a do produto, senão o placeholder da marca
function productImg(p, v) {
  if (v && v.label) {
    // label pode ser "Preto — M" ou "26 — Preto": tenta cada parte como cor
    for (const part of v.label.split(" — ")) {
      const byColor = IMG[`${p.id}--${slug(part)}`];
      if (byColor) return byColor;
    }
  }
  return IMG[p.id] || null;
}
function bikeImg(b, color) {
  return (color && IMG[`${b.id}--${slug(color)}`]) || IMG[b.id] || null;
}
function imgHtml(src, alt) {
  if (src) return `<img src="${src}" alt="${esc(alt)}" loading="lazy">`;
  return `<div class="img-soon"><img src="assets/brand/jacare-logo-crop.jpg" alt=""><span>Foto em breve</span></div>`;
}

function cartItem(p, v) {
  const label = v && v.label ? ` — ${v.label}` : "";
  return {
    key: `${p.id}__${v ? v.label : ""}`,
    id: p.id,
    name: p.name + label,
    sku: (v && v.sku) || "",
    price: variantPrice(p, v),
    img: productImg(p, v),
  };
}

// ---------- Carrinho (localStorage) ----------
let cart = {}; // key -> { item, qty }
try { cart = JSON.parse(localStorage.getItem("jacare_cart") || "{}") || {}; } catch (e) { cart = {}; }

function saveCart() {
  try { localStorage.setItem("jacare_cart", JSON.stringify(cart)); } catch (e) {}
}
function cartCount() {
  return Object.values(cart).reduce((sum, e) => sum + e.qty, 0);
}
function addToCart(item) {
  if (cart[item.key]) cart[item.key].qty += 1;
  else cart[item.key] = { item, qty: 1 };
  saveCart();
  updateCartBadge();
}
function setQty(key, qty) {
  if (qty <= 0) delete cart[key];
  else if (cart[key]) cart[key].qty = qty;
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
  return Object.values(cart).reduce((sum, e) => sum + e.qty * e.item.price, 0);
}

// ---------- Cards ----------
function partsPriceHtml(price, fromPrefix) {
  return `
    <div class="price">${fromPrefix ? '<small>a partir de</small> ' : ""}${money(price)}</div>
    <div class="price-terms">3x sem juros · <strong>${money(price * (1 - PIX_DISCOUNT))}</strong> no PIX</div>
  `;
}

function productCardHtml(p) {
  const favKey = "p__" + p.id;
  const isFav = favorites.has(favKey);
  const vs = variantsOf(p);
  const varies = vs.some(v => variantPrice(p, v) !== p.price);
  const choice = hasChoice(p);
  return `
    <div class="product-card">
      <div class="thumb" data-open="${p.id}">
        <button class="fav-btn ${isFav ? "active" : ""}" data-fav="${favKey}" aria-label="Favoritar" type="button">${isFav ? "♥" : "♡"}</button>
        ${imgHtml(productImg(p, vs[0]), p.name)}
      </div>
      <div class="info">
        <div class="name" data-open="${p.id}">${esc(p.name)}</div>
        <div class="sku">${choice ? `${vs.length} opções de ${esc(p.variantLabel.toLowerCase())}` : (vs[0].sku ? `Cód. ${vs[0].sku}` : "&nbsp;")}</div>
        ${partsPriceHtml(varies ? minPrice(p) : p.price, varies)}
        ${choice
          ? `<button class="add-btn" data-open="${p.id}">Escolher ${esc(p.variantLabel.toLowerCase())}</button>`
          : `<button class="add-btn" data-add="${p.id}">Adicionar ao carrinho</button>`}
      </div>
    </div>
  `;
}

function bikeCardHtml(b) {
  const favKey = "b__" + b.id;
  const isFav = favorites.has(favKey);
  return `
    <div class="product-card bike-card">
      <div class="thumb" data-open-bike="${b.id}">
        <button class="fav-btn ${isFav ? "active" : ""}" data-fav="${favKey}" aria-label="Favoritar" type="button">${isFav ? "♥" : "♡"}</button>
        ${imgHtml(bikeImg(b, b.colors[0]), b.name)}
        <span class="aro-tag">Aro ${b.aro}</span>
      </div>
      <div class="info">
        <div class="name" data-open-bike="${b.id}">${esc(b.name)}</div>
        <div class="sku">${b.colors.length ? `${b.colors.length} ${b.colors.length > 1 ? "cores" : "cor"}` : "Cores sob consulta"}${b.aro === 29 ? " · tam. 15 a 21" : ""}</div>
        <div class="price">${money(b.price)} <small>à vista</small></div>
        <div class="price-terms">ou ${esc(b.installments)}</div>
        <button class="add-btn" data-open-bike="${b.id}">Ver cores e tamanhos</button>
      </div>
    </div>
  `;
}

// Liga cliques de um container com cards de produtos/bikes
function bindCards(container) {
  if (!container) return;
  container.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = PRODUCTS.find(x => x.id === btn.dataset.add);
      addToCart(cartItem(p, variantsOf(p)[0]));
      btn.textContent = "✓ No carrinho — adicionar mais";
      btn.classList.add("in-cart");
    });
  });
  container.querySelectorAll("[data-open]").forEach(el => {
    el.style.cursor = "pointer";
    el.addEventListener("click", (e) => {
      if (e.target.closest(".fav-btn")) return;
      renderProductDetail(el.dataset.open);
    });
  });
  container.querySelectorAll("[data-open-bike]").forEach(el => {
    el.style.cursor = "pointer";
    el.addEventListener("click", (e) => {
      if (e.target.closest(".fav-btn")) return;
      renderBikeDetail(el.dataset.openBike);
    });
  });
  container.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => { e.stopPropagation(); toggleFavorite(btn.dataset.fav, btn); });
  });
}

function bindCarouselArrows() {
  app.querySelectorAll(".carousel-arrow").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.target).scrollBy({ left: (btn.classList.contains("prev") ? -1 : 1) * 320, behavior: "smooth" });
    });
  });
}

function carouselSectionHtml(title, cardsHtml, viewAll) {
  const id = "carousel-" + slug(title);
  return `
    <div class="carousel-section">
      <div class="carousel-header">
        <div class="section-title">${title}</div>
        ${viewAll ? `<button class="view-all-link" ${viewAll}>ver mais ›</button>` : ""}
      </div>
      <div class="carousel-wrap">
        <button class="carousel-arrow prev" data-target="${id}" aria-label="Anterior">‹</button>
        <div class="carousel-track" id="${id}">${cardsHtml}</div>
        <button class="carousel-arrow next" data-target="${id}" aria-label="Próximo">›</button>
      </div>
    </div>
  `;
}

function categoryCover(catId) {
  const withPhoto = PRODUCTS.find(p => p.cat === catId && productImg(p, variantsOf(p)[0]));
  return withPhoto ? productImg(withPhoto, variantsOf(withPhoto)[0]) : null;
}

// ---------- Home ----------
function renderHome() {
  closeCart();
  const bikes29 = BIKES.filter(b => b.aro === 29);
  const bikesOther = BIKES.filter(b => b.aro !== 29);
  const bikeCover = BIKES.map(b => bikeImg(b, b.colors[0])).find(Boolean);

  app.innerHTML = `
    <button class="hero-banner" id="heroBtn" aria-label="Ver bicicletas">
      <img src="assets/brand/hero-banner.jpg" alt="Jacaré Bike Store — Liberdade sobre duas rodas">
    </button>

    <div class="benefits-bar">
      <div class="benefit">
        <span class="benefit-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg></span>
        <div><strong>Parcele sem juros</strong><span>Peças em até 3x · 5% off no PIX</span></div>
      </div>
      <span class="benefit-sep"></span>
      <div class="benefit">
        <span class="benefit-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M8.2 13.5L7 22l5-3 5 3-1.2-8.5"></path></svg></span>
        <div><strong>Marcas de confiança</strong><span>Oggi, Absolute, Kenda e mais</span></div>
      </div>
      <span class="benefit-sep"></span>
      <div class="benefit">
        <span class="benefit-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.8 2.8-2-2z"></path></svg></span>
        <div><strong>Assistência Técnica</strong><span>Mecânica especializada</span></div>
      </div>
      <span class="benefit-sep"></span>
      <div class="benefit">
        <span class="benefit-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path></svg></span>
        <div><strong>Atendimento</strong><span>WhatsApp e loja em São Leopoldo</span></div>
      </div>
    </div>

    <div class="cats-section">
      <div class="section-title center">Compre por Categoria</div>
      <div class="section-sub center">Bicicletas, peças e acessórios</div>
      <div class="cat-icons-row">
        <div class="cat-icon" data-bikes="all">
          <div class="cat-icon-photo">${imgHtml(bikeCover, "Bicicletas")}</div>
          <span>Bicicletas</span>
        </div>
        ${CATEGORIES.map(cat => `
          <div class="cat-icon" data-cat="${cat.id}">
            <div class="cat-icon-photo">${imgHtml(categoryCover(cat.id), cat.name)}</div>
            <span>${cat.name}</span>
          </div>`).join("")}
      </div>
    </div>

    ${carouselSectionHtml("Bicicletas Aro 29", bikes29.map(bikeCardHtml).join(""), 'data-bikes="29"')}

    <div class="builder-cta">
      <div class="builder-cta-text">
        <div class="builder-cta-eyebrow">UPGRADE</div>
        <h2>Monte o upgrade da sua bike</h2>
        <p>Escolha suspensão, aros, pneus, freios, câmbio e mais — veja o total na hora e feche pelo WhatsApp.</p>
      </div>
      <button class="builder-cta-btn" id="startBuilderBtn">Começar →</button>
    </div>

    ${carouselSectionHtml("Aro 26, Juvenis e Infantis", bikesOther.map(bikeCardHtml).join(""), 'data-bikes="outras"')}
    ${carouselSectionHtml("Capacetes", PRODUCTS.filter(p => p.cat === "capacetes").map(productCardHtml).join(""), 'data-cat="capacetes"')}
    ${carouselSectionHtml("Pneus", PRODUCTS.filter(p => p.cat === "pneus").map(productCardHtml).join(""), 'data-cat="pneus"')}
    ${carouselSectionHtml("Selins", PRODUCTS.filter(p => p.cat === "selins").map(productCardHtml).join(""), 'data-cat="selins"')}
  `;

  app.querySelectorAll("[data-cat]").forEach(el => el.addEventListener("click", () => renderCategory(el.dataset.cat)));
  app.querySelectorAll("[data-bikes]").forEach(el => el.addEventListener("click", () => renderBikes(el.dataset.bikes)));
  document.getElementById("startBuilderBtn").addEventListener("click", () => startBuilder());
  document.getElementById("heroBtn").addEventListener("click", () => renderBikes("all"));
  app.querySelectorAll(".carousel-track").forEach(bindCards);
  bindCarouselArrows();
}

// ---------- Listagens ----------
function renderCategory(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  const products = PRODUCTS.filter(p => p.cat === catId);
  app.innerHTML = `
    <div class="category-page">
      <div class="breadcrumb"><button id="backBtn">← Início</button> / ${cat.name}</div>
      <div class="section-title">${cat.name}</div>
      <div class="section-sub">${products.length} ${products.length === 1 ? "produto" : "produtos"}</div>
      <div class="product-grid">${products.map(productCardHtml).join("")}</div>
    </div>
  `;
  document.getElementById("backBtn").addEventListener("click", renderHome);
  bindCards(app.querySelector(".product-grid"));
  window.scrollTo(0, 0);
}

function renderBikes(filter) {
  const groups = [
    { title: "Aro 29", list: BIKES.filter(b => b.aro === 29), key: "29" },
    { title: "Aro 26", list: BIKES.filter(b => b.aro === 26), key: "outras" },
    { title: "Juvenis e Infantis (aro 12 a 24)", list: BIKES.filter(b => b.aro < 26), key: "outras" },
  ].filter(g => filter === "all" || g.key === filter);

  app.innerHTML = `
    <div class="category-page">
      <div class="breadcrumb"><button id="backBtn">← Início</button> / Bicicletas</div>
      <div class="section-title">Bicicletas</div>
      <div class="bike-filter">
        <button class="${filter === "all" ? "active" : ""}" data-f="all">Todas</button>
        <button class="${filter === "29" ? "active" : ""}" data-f="29">Aro 29</button>
        <button class="${filter === "outras" ? "active" : ""}" data-f="outras">Aro 26 e infantis</button>
      </div>
      ${groups.map(g => `
        <h3 class="group-title">${g.title}</h3>
        <div class="product-grid">${g.list.map(bikeCardHtml).join("")}</div>
      `).join("")}
    </div>
  `;
  document.getElementById("backBtn").addEventListener("click", renderHome);
  app.querySelectorAll(".bike-filter button").forEach(b => b.addEventListener("click", () => renderBikes(b.dataset.f)));
  app.querySelectorAll(".product-grid").forEach(bindCards);
  window.scrollTo(0, 0);
}

// ---------- Página do produto ----------
function optionChipsHtml(title, options, selectedIdx, attr, withThumbs) {
  return `
    <div class="pdp-option">
      <strong>${title}: <span class="pdp-option-value">${selectedIdx >= 0 ? esc(options[selectedIdx].label) : "escolha abaixo"}</span></strong>
      <div class="pdp-chips">
        ${options.map((o, i) => `
          <button class="pdp-chip ${i === selectedIdx ? "active" : ""} ${withThumbs && o.img ? "has-thumb" : ""}" ${attr}="${i}" type="button">
            ${withThumbs && o.img ? `<img src="${o.img}" alt="">` : ""}<span>${esc(o.label)}</span>
          </button>`).join("")}
      </div>
    </div>
  `;
}

function renderProductDetail(productId, variantIdx) {
  const p = PRODUCTS.find(x => x.id === productId);
  const cat = CATEGORIES.find(c => c.id === p.cat);
  const vs = variantsOf(p);
  const vi = variantIdx || 0;
  const v = vs[vi];
  const price = variantPrice(p, v);
  const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 10);

  app.innerHTML = `
    <div class="pdp">
      <div class="breadcrumb">
        <button id="backHomeBtn">Início</button> /
        <button id="backCatBtn">${cat.name}</button> /
        ${esc(p.name)}
      </div>
      <div class="pdp-grid">
        <div class="pdp-gallery">${imgHtml(productImg(p, v), p.name)}</div>
        <div class="pdp-buy">
          <h1>${esc(p.name)}</h1>
          <div class="pdp-code">${v.sku ? `Cód. do Produto: ${v.sku}` : "&nbsp;"}</div>
          <div class="pdp-price">${money(price)}</div>
          <div class="pdp-terms">3x de ${money(price / 3)} sem juros<br>ou <strong>${money(price * (1 - PIX_DISCOUNT))}</strong> no PIX (5% off)</div>
          ${hasChoice(p) ? optionChipsHtml(p.variantLabel, vs.map(x => ({ label: x.label + (x.price && x.price !== p.price ? ` · ${money(x.price)}` : "") })), vi, "data-vi", false)
            : (v.label ? `<div class="pdp-option"><strong>Cor: <span class="pdp-option-value">${esc(v.label)}</span></strong></div>` : "")}
          <button class="add-btn pdp-add-btn" id="pdpAddBtn">Adicionar ao carrinho</button>
          <a class="pdp-wa-link" target="_blank" rel="noopener" href="${waLink(`Olá! Tenho interesse em: ${cartItem(p, v).name}${v.sku ? ` (cód. ${v.sku})` : ""} — ${money(price)}. Tem disponível?`)}">Tirar dúvida no WhatsApp</a>
          <div class="pdp-note">O pedido é finalizado direto com a loja pelo WhatsApp.</div>
        </div>
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
  document.getElementById("backCatBtn").addEventListener("click", () => renderCategory(p.cat));
  app.querySelectorAll("[data-vi]").forEach(btn => {
    btn.addEventListener("click", () => { renderProductDetail(p.id, Number(btn.dataset.vi)); });
  });
  document.getElementById("pdpAddBtn").addEventListener("click", (e) => {
    addToCart(cartItem(p, v));
    e.target.textContent = "✓ No carrinho — adicionar mais";
    e.target.classList.add("in-cart");
  });
  bindCards(document.getElementById("pdp-related"));
  bindCarouselArrows();
  if (variantIdx === undefined) window.scrollTo(0, 0);
}

// ---------- Página da bike ----------
// Referência de altura por tamanho de quadro (aro 29)
const SIZE_HINT = { "15": "1,55 a 1,65 m", "17": "1,65 a 1,75 m", "19": "1,75 a 1,85 m", "21": "acima de 1,85 m" };

function bikeWaMessage(b, color, size) {
  const parts = [`Olá! Quero a bicicleta ${b.name} (aro ${b.aro})`];
  parts.push(color ? `cor ${color}` : "gostaria de saber as cores disponíveis");
  if (b.aro === 29) parts.push(size ? `tamanho ${size}` : "preciso de ajuda para escolher o tamanho");
  return `${parts.join(", ")}. Valor no site: ${money(b.price)} à vista ou ${b.installments}. Tem disponível?`;
}

function renderBikeDetail(bikeId, colorIdx, size) {
  const b = BIKES.find(x => x.id === bikeId);
  const ci = colorIdx || 0;
  const color = b.colors[ci] || null;
  const sizes = b.aro === 29 ? FRAME_SIZES_29 : [];
  const others = BIKES.filter(x => x.id !== b.id && x.aro === b.aro).concat(BIKES.filter(x => x.aro !== b.aro)).slice(0, 10);
  const colorOpts = b.colors.map(c => ({ label: c, img: IMG[`${b.id}--${slug(c)}`] || null }));

  app.innerHTML = `
    <div class="pdp">
      <div class="breadcrumb">
        <button id="backHomeBtn">Início</button> / <button id="backBikesBtn">Bicicletas</button> / ${esc(b.name)}
      </div>
      <div class="pdp-grid">
        <div class="pdp-gallery">${imgHtml(bikeImg(b, color), b.name)}</div>
        <div class="pdp-buy">
          <div class="pdp-brand">${esc(b.brand)} · Aro ${b.aro}</div>
          <h1>${esc(b.name)}</h1>
          <div class="pdp-price">${money(b.price)} <small>à vista</small></div>
          <div class="pdp-terms">ou ${esc(b.installments)}</div>
          ${b.colors.length
            ? optionChipsHtml("Cor", colorOpts, ci, "data-ci", true)
            : `<div class="pdp-option"><strong>Cor: <span class="pdp-option-value">consulte as cores disponíveis</span></strong></div>`}
          ${sizes.length ? `
            <div class="pdp-option">
              <strong>Tamanho do quadro: <span class="pdp-option-value">${size ? `${size} (para ${SIZE_HINT[size]})` : "escolha abaixo"}</span></strong>
              <div class="pdp-chips">
                ${sizes.map(s => `<button class="pdp-chip size ${s === size ? "active" : ""}" data-size="${s}" type="button"><span>${s}</span></button>`).join("")}
              </div>
              <div class="pdp-size-hint">Não sabe o tamanho? Pergunte no WhatsApp — a gente te ajuda pela sua altura.</div>
            </div>` : ""}
          <a class="add-btn pdp-add-btn wa-btn" target="_blank" rel="noopener" href="${waLink(bikeWaMessage(b, color, size))}">Comprar pelo WhatsApp</a>
          <div class="pdp-note">Confirmamos disponibilidade, cor e tamanho e fechamos o pedido pelo WhatsApp.</div>
        </div>
      </div>

      <div class="pdp-description">
        <h2>Destaques</h2>
        <ul class="pdp-specs">${b.specs.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
      </div>

      <div class="carousel-section" style="padding-left:0;padding-right:0;">
        <div class="carousel-header"><div class="section-title">Outros modelos</div></div>
        <div class="carousel-wrap">
          <button class="carousel-arrow prev" data-target="pdp-related-bikes" aria-label="Anterior">‹</button>
          <div class="carousel-track" id="pdp-related-bikes">${others.map(bikeCardHtml).join("")}</div>
          <button class="carousel-arrow next" data-target="pdp-related-bikes" aria-label="Próximo">›</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("backHomeBtn").addEventListener("click", renderHome);
  document.getElementById("backBikesBtn").addEventListener("click", () => renderBikes("all"));
  app.querySelectorAll("[data-ci]").forEach(btn => btn.addEventListener("click", () => renderBikeDetail(b.id, Number(btn.dataset.ci), size)));
  app.querySelectorAll("[data-size]").forEach(btn => btn.addEventListener("click", () => renderBikeDetail(b.id, ci, btn.dataset.size)));
  bindCards(document.getElementById("pdp-related-bikes"));
  bindCarouselArrows();
  if (colorIdx === undefined) window.scrollTo(0, 0);
}

// ---------- Busca ----------
function renderSearch(query) {
  const q = slug(query);
  const match = (txt) => slug(txt).includes(q);
  const products = PRODUCTS.filter(p => match(p.name) || variantsOf(p).some(v => (v.sku && v.sku.includes(query.trim())) || match(v.label)));
  const bikes = BIKES.filter(b => match(b.name) || match(b.brand) || match(`aro ${b.aro}`) || b.colors.some(match));
  const total = products.length + bikes.length;

  app.innerHTML = `
    <div class="search-results">
      <div class="breadcrumb"><button id="backBtn">← Início</button> / Busca: "${esc(query)}"</div>
      <div class="section-title">${total} resultado(s)</div>
      <div class="product-grid" style="margin-top:16px;">
        ${bikes.map(bikeCardHtml).join("")}${products.map(productCardHtml).join("")}
        ${total ? "" : `<p>Nada encontrado. <a href="${waLink(`Olá! Vocês têm ${query}?`)}" target="_blank" rel="noopener">Pergunte no WhatsApp</a> — temos mais itens na loja.</p>`}
      </div>
    </div>
  `;
  document.getElementById("backBtn").addEventListener("click", renderHome);
  bindCards(app.querySelector(".product-grid"));
  window.scrollTo(0, 0);
}

// ---------- Monte o upgrade da sua bike ----------
const BUILDER_STEPS = [
  { key: "garfos", label: "Suspensão" },
  { key: "aros", label: "Aros" },
  { key: "pneus", label: "Pneus" },
  { key: "freios", label: "Freios" },
  { key: "cambios", label: "Câmbio" },
  { key: "pedivelas", label: "Pedivela" },
  { key: "guidoes", label: "Guidão" },
  { key: "selins", label: "Selim" },
];

let builderChoices = {}; // stepKey -> cartItem
let builderStep = 0;

function startBuilder() {
  builderChoices = {};
  builderStep = 0;
  renderBuilderStep();
}

function builderTotal() {
  return Object.values(builderChoices).filter(Boolean).reduce((sum, it) => sum + it.price, 0);
}

function builderProgressHtml() {
  const total = BUILDER_STEPS.length;
  const done = BUILDER_STEPS.filter(s => builderChoices[s.key]).length;
  const pct = Math.round((done / total) * 100);
  const r = 54, c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return `
    <div class="builder-progress">
      <div class="progress-ring">
        <svg viewBox="0 0 130 130">
          <circle class="ring-bg" cx="65" cy="65" r="${r}"></circle>
          <circle class="ring-fill" cx="65" cy="65" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"></circle>
        </svg>
        <div class="progress-ring-label">
          <strong>${done}<span>/${total}</span></strong>
          <span class="progress-ring-sub">peças</span>
        </div>
      </div>
      <div class="progress-info">
        <div class="progress-title">${done === total ? "Upgrade completo!" : "Montando seu upgrade..."}</div>
        <div class="progress-bar"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        <div class="progress-total-row"><span>Subtotal</span><strong>${money(builderTotal())}</strong></div>
      </div>
    </div>
  `;
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

  const cards = products.map((p, pi) => {
    const vs = variantsOf(p);
    const isChosen = chosen && chosen.id === p.id;
    return `
      <div class="product-card ${isChosen ? "chosen" : ""}">
        <div class="thumb">${imgHtml(productImg(p, vs[0]), p.name)}</div>
        <div class="info">
          <div class="name">${esc(p.name)}</div>
          ${hasChoice(p) ? `
            <select class="variant-select" data-pi="${pi}" aria-label="${esc(p.variantLabel)}">
              ${vs.map((v, i) => `<option value="${i}" ${isChosen && chosen.key === cartItem(p, v).key ? "selected" : ""}>${esc(v.label)}${v.price && v.price !== p.price ? ` — ${money(v.price)}` : ""}</option>`).join("")}
            </select>` : ""}
          <div class="price">${money(isChosen ? chosen.price : minPrice(p))}</div>
          <button class="add-btn choose-btn" data-pi="${pi}">${isChosen ? "✓ Escolhido" : "Escolher"}</button>
        </div>
      </div>
    `;
  }).join("");

  app.innerHTML = `
    <div class="builder-page">
      <div class="breadcrumb"><button id="exitBuilderBtn">← Início</button> / Monte o upgrade da sua bike</div>
      ${builderProgressHtml()}
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
  app.querySelectorAll(".tracker-dot").forEach(el => {
    el.addEventListener("click", () => { builderStep = Number(el.dataset.step); renderBuilderStep(); });
  });
  app.querySelectorAll(".choose-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = products[Number(btn.dataset.pi)];
      const sel = app.querySelector(`.variant-select[data-pi="${btn.dataset.pi}"]`);
      builderChoices[step.key] = cartItem(p, variantsOf(p)[sel ? Number(sel.value) : 0]);
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
  document.getElementById("builderNextBtn").addEventListener("click", advanceBuilder);
  window.scrollTo(0, 0);
}

function advanceBuilder() {
  if (builderStep < BUILDER_STEPS.length - 1) { builderStep++; renderBuilderStep(); }
  else renderBuilderSummary();
}

function builderWaLink() {
  const lines = BUILDER_STEPS.map(step => {
    const it = builderChoices[step.key];
    return it ? `• ${step.label}: ${it.name}${it.sku ? ` (cód. ${it.sku})` : ""} — ${money(it.price)}` : `• ${step.label}: não escolhido`;
  });
  return waLink(`Olá! Montei um upgrade para a minha bike no site:\n\n${lines.join("\n")}\n\nTotal: ${money(builderTotal())}`);
}

function renderBuilderSummary() {
  const rows = BUILDER_STEPS.map(step => {
    const it = builderChoices[step.key];
    return `
      <div class="summary-row">
        <div class="summary-label">${step.label}</div>
        ${it
          ? `<div class="summary-item">${it.img ? `<img src="${it.img}" alt="">` : ""}<span>${esc(it.name)}</span><strong>${money(it.price)}</strong></div>`
          : `<div class="summary-item empty">Não escolhido</div>`}
      </div>
    `;
  }).join("");

  app.innerHTML = `
    <div class="builder-page">
      <div class="breadcrumb"><button id="exitBuilderBtn">← Início</button> / Monte o upgrade / Resumo</div>
      ${builderProgressHtml()}
      <div class="section-title">Seu upgrade</div>
      <div class="summary-list">${rows}</div>
      <div class="cart-total" style="max-width:500px;margin:16px auto;"><span>Total</span><span>${money(builderTotal())}</span></div>
      <div class="builder-nav" style="max-width:500px;margin:0 auto;">
        <button class="builder-nav-btn ghost" id="restartBuilderBtn">Montar de novo</button>
        <a class="checkout-btn" href="${builderWaLink()}" target="_blank" rel="noopener">Fechar pedido no WhatsApp</a>
      </div>
    </div>
  `;
  document.getElementById("exitBuilderBtn").addEventListener("click", renderHome);
  document.getElementById("restartBuilderBtn").addEventListener("click", startBuilder);
  window.scrollTo(0, 0);
}

// ---------- Carrinho (gaveta) ----------
function waCheckoutLink() {
  const lines = Object.values(cart).map(e => `• ${e.qty}x ${e.item.name}${e.item.sku ? ` (cód. ${e.item.sku})` : ""} — ${money(e.item.price)} cada`);
  const total = cartTotal();
  return waLink(`Olá! Quero fazer um pedido pelo site:\n\n${lines.join("\n")}\n\nTotal: ${money(total)} (ou ${money(total * (1 - PIX_DISCOUNT))} no PIX)`);
}

function renderCartDrawer() {
  const entries = Object.entries(cart);
  const total = cartTotal();
  const rows = entries.map(([key, e]) => `
    <div class="cart-row">
      <div class="thumb">${e.item.img ? `<img src="${e.item.img}" alt="">` : `<img src="assets/brand/jacare-logo-crop.jpg" alt="">`}</div>
      <div class="details">
        <div class="name">${esc(e.item.name)}</div>
        <div class="price">${money(e.item.price)}</div>
        <div class="qty-control">
          <button data-action="dec" data-key="${esc(key)}">−</button>
          <span class="qty">${e.qty}</span>
          <button data-action="inc" data-key="${esc(key)}">+</button>
        </div>
      </div>
      <div class="cart-row-right">
        <div class="price">${money(e.qty * e.item.price)}</div>
        <button class="remove-link" data-action="remove" data-key="${esc(key)}">remover</button>
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
          <div class="cart-total"><span>Total</span><span>${money(total)}</span></div>
          ${entries.length ? `<div class="cart-pix">ou <strong>${money(total * (1 - PIX_DISCOUNT))}</strong> no PIX · 3x sem juros no cartão</div>` : ""}
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

function openCart() { renderCartDrawer(); }
function closeCart() { cartOverlayRoot.innerHTML = ""; }

document.getElementById("menuBtn").addEventListener("click", (e) => { e.preventDefault(); renderHome(); });
document.getElementById("menuBtnTop").addEventListener("click", renderHome);
document.getElementById("cartBtn").addEventListener("click", openCart);

// ---------- Menus ----------
const NAV_PECAS = ["garfos", "aros", "pneus", "freios", "cambios", "pedivelas", "pedais", "guidoes", "suportes", "manoplas"];
const NAV_ACESSORIOS = ["capacetes", "selins", "acessorios"];

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
fillNavDropdown("navAllCats", [...NAV_PECAS, ...NAV_ACESSORIOS]);
document.getElementById("navAllCats").insertAdjacentHTML("afterbegin", `<a href="#" data-bikes-nav="all">Bicicletas</a>`);

const navBikesPanel = document.getElementById("navBikesPanel");
navBikesPanel.innerHTML = `
  <a href="#" data-bikes-nav="29">Aro 29</a>
  <a href="#" data-bikes-nav="outras">Aro 26, juvenis e infantis</a>
  <a href="#" data-bikes-nav="all">Ver todas</a>
`;
document.querySelectorAll("[data-bikes-nav]").forEach(a => {
  a.addEventListener("click", (e) => { e.preventDefault(); renderBikes(a.dataset.bikesNav); });
});
document.getElementById("navBicicletas").addEventListener("click", () => renderBikes("all"));
document.getElementById("navBuilder").addEventListener("click", startBuilder);

// ---------- Favoritos (localStorage) ----------
let favorites = new Set();
try { favorites = new Set(JSON.parse(localStorage.getItem("jacare_favs") || "[]")); } catch (e) {}
function updateFavBadge() {
  const badge = document.getElementById("favBadge");
  badge.textContent = favorites.size;
  badge.classList.toggle("hidden", favorites.size === 0);
}
function toggleFavorite(key, btn) {
  if (favorites.has(key)) { favorites.delete(key); btn.classList.remove("active"); btn.textContent = "♡"; }
  else { favorites.add(key); btn.classList.add("active"); btn.textContent = "♥"; }
  try { localStorage.setItem("jacare_favs", JSON.stringify([...favorites])); } catch (e) {}
  updateFavBadge();
}
function renderFavorites() {
  const products = PRODUCTS.filter(p => favorites.has("p__" + p.id));
  const bikes = BIKES.filter(b => favorites.has("b__" + b.id));
  app.innerHTML = `
    <div class="category-page">
      <div class="breadcrumb"><button id="backBtn">← Início</button> / Favoritos</div>
      <div class="section-title">Seus favoritos</div>
      <div class="product-grid" style="margin-top:16px;">
        ${bikes.map(bikeCardHtml).join("")}${products.map(productCardHtml).join("")}
        ${bikes.length + products.length ? "" : "<p>Toque no ♡ de um produto para guardar aqui.</p>"}
      </div>
    </div>
  `;
  document.getElementById("backBtn").addEventListener("click", renderHome);
  bindCards(app.querySelector(".product-grid"));
  window.scrollTo(0, 0);
}
document.getElementById("favBtn").addEventListener("click", renderFavorites);
updateFavBadge();

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
