const WHATSAPP_NUMBER = "555194285149"; // Jacaré Bike Store — número real do link wa.me na bio do Instagram
const PIX_DISCOUNT = 0.05;

const app = document.getElementById("app");
const cartOverlayRoot = document.getElementById("cartOverlayRoot");
const IMG = (typeof IMAGES !== "undefined") ? IMAGES : {};
const mobileMQ = window.matchMedia("(max-width: 860px)");

// ---------- Utilidades ----------
function money(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
// Parcela arredondada para baixo (nunca promete parcela maior que o total)
function installment(price, n) {
  return money(Math.floor(Math.round(price * 100) / n) / 100);
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
}
function slug(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function waLink(msg) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
function nb(s) { // evita quebra feia ("à vista" sozinho na linha)
  return esc(s).replace(/ /g, "&nbsp;");
}
function nameHtml(s) { // "Nero JR 7V — Aro 24": o travessão não começa linha
  return esc(s).replace(/ — /g, "&nbsp;— ");
}

// ---------- Produtos, variantes e fotos ----------
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
function pricesVary(p, vs) {
  const list = vs || variantsOf(p);
  return list.some(v => variantPrice(p, v) !== variantPrice(p, list[0]));
}
// "Preto — M" / "26 — Preto" / "Oil Slick" têm cor; "160mm", "26", "29 × 2.50" não
function isColorish(label) {
  return String(label || "").split(" — ").some(part => part && !/^\d|mm\b|^[PMG]$/.test(part.trim()));
}
function exactImg(id, label) {
  for (const part of String(label || "").split(" — ")) {
    const src = IMG[`${id}--${slug(part)}`];
    if (src) return src;
  }
  return null;
}
// Foto de uma variante: a da própria cor se existir; senão a foto geral marcada como ilustrativa
function productPhoto(p, v) {
  const own = v && v.label ? exactImg(p.id, v.label) : null;
  if (own) return { src: own, exact: true };
  const gen = IMG[p.id] || null;
  return { src: gen, exact: !(gen && hasChoice(p) && v && isColorish(v.label)) };
}
function productImg(p, v) {
  return productPhoto(p, v).src;
}
function defaultVariantIdx(p, list) {
  const vs = list || variantsOf(p);
  const low = Math.min(...vs.map(v => variantPrice(p, v)));
  const i = vs.findIndex(v => variantPrice(p, v) === low && exactImg(p.id, v.label));
  return i >= 0 ? i : Math.max(0, vs.findIndex(v => variantPrice(p, v) === low));
}
function bikePhoto(b, color) {
  const own = color ? IMG[`${b.id}--${slug(color)}`] : null;
  if (own) return { src: own, exact: true };
  const gen = IMG[b.id] || null;
  return { src: gen, exact: !(gen && b.colors.length > 1) };
}
function defaultColorIdx(b) {
  const i = b.colors.findIndex(c => IMG[`${b.id}--${slug(c)}`]);
  return i < 0 ? 0 : i;
}
function variantOf(src, dir) {
  return src ? src.replace("assets/products/jb/", `assets/products/jb/${dir}/`).replace(/\.jpg$/, ".webp") : src;
}
function thumbOf(src) { return variantOf(src, "thumb"); } // cards (480px)
function smallOf(src) { return variantOf(src, "sm"); }    // chips, carrinho, círculos (180px)
function fullOf(src) { return variantOf(src, "full"); }   // página do produto (1000px)
function imgHtml(src, alt, opts = {}) {
  if (!src) return `<div class="img-soon"><img src="assets/brand/logo-120.webp" alt="" width="120" height="110"><span aria-hidden="true">Foto em breve</span></div>`;
  const file = opts.full ? fullOf(src) : (opts.small ? smallOf(src) : thumbOf(src));
  return `<img src="${file}" alt="${esc(alt)}" loading="${opts.eager ? "eager" : "lazy"}" ${opts.eager ? 'fetchpriority="high"' : ""} decoding="async">`
    + (opts.note ? `<span class="photo-note">Foto ilustrativa${opts.full ? " · cor a confirmar" : ""}</span>` : "");
}

// Amostra de cor para opções sem foto própria (ex.: "Verde/Branco/Laranja")
const SWATCH = {
  preto: "#15171b", preta: "#15171b", branco: "#ffffff", branca: "#ffffff", vermelho: "#d12f2f", azul: "#1e63d6",
  verde: "#2e9d4f", amarelo: "#ffd000", laranja: "#f57c00", rosa: "#ec5ca8", roxo: "#7b3fb3", cinza: "#9ea3a8",
  grafite: "#4a4f55", prata: "#c3c7cb", "azul-metalico": "#35679e", "azul-claro": "#7cc3f0", "amarelo-neon": "#e2ff1f",
  "rosa-neon": "#ff4fb0", marrom: "#7a4a24",
};
const SPECIAL_SWATCH = {
  "oil-slick": "linear-gradient(135deg,#3b2b7a,#1b8f8a,#c9a227,#a83279)",
  camaleao: "linear-gradient(135deg,#6d2fbf,#1f8fc4,#2fbf6a,#d6b21f)",
};
function swatchCss(label) {
  const color = String(label || "").split(" — ").find(part => isColorish(part)) || "";
  const key = slug(color);
  if (SPECIAL_SWATCH[key]) return SPECIAL_SWATCH[key];
  const parts = color.split("/").map(c => SWATCH[slug(c)]).filter(Boolean);
  if (!parts.length) return null;
  if (parts.length === 1) return parts[0];
  const step = 100 / parts.length;
  return `linear-gradient(135deg,${parts.map((c, i) => `${c} ${i * step}% ${(i + 1) * step}%`).join(",")})`;
}

function cartItem(p, v) {
  const label = v && v.label ? v.label : "";
  const photo = productPhoto(p, v);
  return {
    key: `${p.id}__${label}`,
    id: p.id,
    label,
    name: p.name + (label ? ` — ${label}` : ""),
    sku: (v && v.sku) || "",
    price: variantPrice(p, v),
    img: photo.src,
    exact: photo.exact,
  };
}
function findVariant(p, label) {
  return variantsOf(p).find(v => (v.label || "") === (label || ""));
}

// ---------- Armazenamento local (sempre com try/catch) ----------
function load(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key) || "null"); return v == null ? fallback : v; } catch (e) { return fallback; }
}
function store(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

// ---------- Carrinho: guarda só id/opção/quantidade; preço, nome e foto vêm sempre do catálogo atual ----------
let cart = {}; // key -> { item, qty }
(function loadCart() {
  let saved = load("jacare_cart_v2", null);
  if (!saved) { // migra o formato antigo
    const old = load("jacare_cart", {});
    saved = {};
    Object.values(old || {}).forEach(e => { if (e && e.item) saved[e.item.key] = { id: e.item.id, label: (e.item.key || "").split("__")[1] || "", qty: e.qty }; });
  }
  Object.values(saved || {}).forEach(e => {
    const p = e && PRODUCTS.find(x => x.id === e.id);
    const v = p && findVariant(p, e.label);
    const qty = Math.floor(Number(e && e.qty));
    if (v && qty > 0) { const item = cartItem(p, v); cart[item.key] = { item, qty }; }
  });
})();
function saveCart() {
  const out = {};
  Object.entries(cart).forEach(([k, e]) => { out[k] = { id: e.item.id, label: e.item.label, qty: e.qty }; });
  store("jacare_cart_v2", out);
  try { localStorage.removeItem("jacare_cart"); } catch (e) {}
}
function cartCount() {
  return Object.values(cart).reduce((sum, e) => sum + e.qty, 0);
}
function cartTotal() {
  return Object.values(cart).reduce((sum, e) => sum + e.qty * e.item.price, 0);
}
function addToCart(item) {
  if (cart[item.key]) cart[item.key].qty += 1;
  else cart[item.key] = { item, qty: 1 };
  saveCart();
  updateCartBadge();
  const q = cart[item.key].qty;
  toast(`<span>${q > 1 ? `✓ Agora são ${q} no carrinho` : "✓ Adicionado ao carrinho"}</span>`, `Ver carrinho (${cartCount()})`, openCart);
}
function setQty(key, qty) {
  if (qty <= 0) delete cart[key];
  else if (cart[key]) cart[key].qty = qty;
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}
function removeFromCart(key) {
  const removed = cart[key];
  if (!removed) return;
  const pos = Object.keys(cart).indexOf(key);
  setQty(key, 0);
  syncPageToCart();
  toast(`<span>Item removido</span>`, "Desfazer", () => {
    const entries = Object.entries(cart);
    entries.splice(Math.min(pos, entries.length), 0, [key, removed]); // volta para a mesma posição
    cart = Object.fromEntries(entries);
    saveCart(); updateCartBadge(); renderCartDrawer(); syncPageToCart();
  });
}
// Deixa a página por baixo da gaveta coerente com o carrinho (página do produto e botões dos cards)
function syncCardAddBtn(btn) {
  const p = PRODUCTS.find(x => x.id === btn.dataset.add);
  const inCart = p && Object.values(cart).some(e => e.item.id === p.id);
  btn.textContent = inCart ? "✓ No carrinho" : "Adicionar";
  btn.classList.toggle("in-cart", !!inCart);
  btn.setAttribute("aria-label", inCart ? `${p.name}: já está no carrinho, abrir carrinho` : `Adicionar ${p ? p.name : ""} ao carrinho`);
}
function syncPageToCart() {
  const r = parseHash(location.hash);
  if (r.name === "produto" && document.getElementById("pdpAddBtn")) {
    const y = window.scrollY;
    renderProductDetail(r.arg, r.params.v !== undefined ? Number(r.params.v) : undefined);
    window.scrollTo(0, y);
  }
  app.querySelectorAll("[data-add]").forEach(syncCardAddBtn);
}
function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  const count = cartCount();
  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);
  document.getElementById("cartBtn").setAttribute("aria-label", count ? `Carrinho, ${count} ${count === 1 ? "item" : "itens"}` : "Carrinho vazio");
}

// ---------- Aviso rápido (toast) ----------
let toastTimer;
let pendingToast = null; // aviso que deve aparecer depois da troca de tela
function toastAfterRoute(...args) { pendingToast = args; }
function toast(html, actionLabel, onAction) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    t.setAttribute("role", "status");
    t.setAttribute("aria-live", "polite");
    document.body.appendChild(t);
  }
  t.innerHTML = html + (actionLabel ? `<button type="button">${esc(actionLabel)}</button>` : "");
  if (actionLabel) t.querySelector("button").addEventListener("click", () => { hideToast(); onAction(); });
  t.classList.add("show");
  const foot = document.querySelector("#cartOverlay .cart-footer");
  t.style.bottom = foot ? `calc(${foot.offsetHeight + 12}px + env(safe-area-inset-bottom))` : "";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 4500);
}
function hideToast() {
  const t = document.getElementById("toast");
  if (t) t.classList.remove("show");
}

// ---------- Favoritos ----------
let favorites = new Set(load("jacare_favs", []));
function updateFavBadge() {
  const badge = document.getElementById("favBadge");
  badge.textContent = favorites.size;
  badge.classList.toggle("hidden", favorites.size === 0);
}
function favBtnHtml(key, label) {
  const on = favorites.has(key);
  return `<button class="fav-btn ${on ? "active" : ""}" data-fav="${key}" data-label="${esc(label)}" type="button" aria-pressed="${on}" aria-label="${on ? "Remover dos favoritos" : "Adicionar aos favoritos"}: ${esc(label)}">${on ? "♥" : "♡"}</button>`;
}
function toggleFavorite(key, btn) {
  const on = !favorites.has(key);
  if (on) favorites.add(key); else favorites.delete(key);
  store("jacare_favs", [...favorites]);
  updateFavBadge();
  document.querySelectorAll(`.fav-btn[data-fav="${key}"]`).forEach(b => {
    b.classList.toggle("active", on);
    b.textContent = on ? "♥" : "♡";
    b.setAttribute("aria-pressed", on);
    b.setAttribute("aria-label", `${on ? "Remover dos favoritos" : "Adicionar aos favoritos"}: ${b.dataset.label || ""}`);
  });
  if (!on && currentRoute.name === "favoritos") { // na página de favoritos o card sai da lista
    const card = btn && btn.closest(".product-card");
    if (card) card.remove();
    if (!document.querySelector(".fav-page .product-card")) renderFavorites();
  }
}

// ---------- Roteador por hash (botão voltar do celular, recarregar e compartilhar funcionam) ----------
let currentRoute = { name: "home" };
try { history.scrollRestoration = "manual"; } catch (e) {}

function parseHash(hash) {
  const h = (hash || "").replace(/^#\/?/, "");
  const [path, query = ""] = h.split("?");
  const parts = path.split("/").filter(Boolean).map(s => { try { return decodeURIComponent(s); } catch (e) { return s; } });
  const params = {};
  query.split("&").filter(Boolean).forEach(kv => { const [k, v = ""] = kv.split("="); try { params[k] = decodeURIComponent(v); } catch (e) { params[k] = v; } });
  return { name: parts[0] || "home", arg: parts[1], params };
}
function carouselScrolls() {
  const m = {};
  app.querySelectorAll(".carousel-track[id], .cat-icons-row").forEach(el => {
    if (el.scrollLeft > 4) m[el.id || "cat-icons-row"] = Math.round(el.scrollLeft);
  });
  return m;
}
function restoreCarousels(xs) {
  if (!xs) return;
  Object.keys(xs).forEach(k => {
    const el = k === "cat-icons-row" ? app.querySelector(".cat-icons-row") : document.getElementById(k);
    if (!el) return;
    el.style.scrollBehavior = "auto";
    el.scrollLeft = xs[k];
    el.style.scrollBehavior = "";
  });
}
function saveScroll() {
  try { history.replaceState(Object.assign({}, history.state, { y: window.scrollY, cx: carouselScrolls() }), ""); } catch (e) {}
}
function go(hash) {
  saveScroll();
  if (location.hash === hash || (hash === "#/" && !location.hash)) route(false);
  else location.hash = hash;
}
// Troca de cor/variação na mesma tela: atualiza o endereço sem criar entrada no histórico
function setHashQuiet(hash) {
  try { history.replaceState(history.state, "", hash); } catch (e) {}
}
const DEFAULT_TITLE = document.title;
let lastHash = null;
function route(restore) {
  const r = parseHash(location.hash);
  currentRoute = r;
  // entrada nova no histórico: lembra de onde o cliente veio (breadcrumb e "Voltar" usam isso)
  if (!history.state && lastHash !== null) { try { history.replaceState({ from: lastHash }, ""); } catch (e) {} }
  closeCartDom();
  hideToast();
  clearStickyCta();
  document.body.classList.remove("has-bottom-bar");
  if (r.name !== "busca") {
    clearTimeout(searchTimer);
    if (searchInput.value) { searchInput.value = ""; updateSearchClear(); }
  }
  switch (r.name) {
    case "bikes": renderBikes(["29", "outras"].includes(r.arg) ? r.arg : "all"); break;
    case "bike": {
      const b = BIKES.find(x => x.id === r.arg);
      if (!b) { renderNotFound("bike"); break; }
      renderBikeDetail(b.id, r.params.c !== undefined ? Number(r.params.c) : undefined, r.params.s, r.params.o !== undefined ? Number(r.params.o) : undefined);
      break;
    }
    case "pecas": renderAllCategories(); break;
    case "categoria": CATEGORIES.some(c => c.id === r.arg) ? renderCategory(r.arg) : renderAllCategories(); break;
    case "produto": {
      const p = PRODUCTS.find(x => x.id === r.arg);
      if (!p) { renderNotFound("produto"); break; }
      renderProductDetail(p.id, r.params.v !== undefined ? Number(r.params.v) : undefined);
      break;
    }
    case "busca": {
      const q = r.arg || "";
      // não mexe no campo enquanto o cliente digita (senão o espaço do fim some e "pneu 29" vira "pneu29")
      if (document.activeElement !== searchInput && searchInput.value.trim() !== q.trim()) searchInput.value = q;
      updateSearchClear();
      renderSearch(q);
      break;
    }
    case "favoritos": renderFavorites(); break;
    case "personalize": renderBuilderRoute(r.arg); break;
    default: renderHome();
  }
  updateNavActive(r);
  const h1 = app.querySelector("h1");
  document.title = r.name === "home" || !h1 ? DEFAULT_TITLE : `${h1.textContent.trim()} | Jacaré Bike Store`;
  const st = history.state || {};
  const y = restore && typeof st.y === "number" ? st.y : 0;
  window.scrollTo(0, y);
  if (restore) restoreCarousels(st.cx);
  if (y) requestAnimationFrame(() => { window.scrollTo(0, y); restoreCarousels(st.cx); });
  showHeader();
  lastHash = location.hash;
  if (st.cart && !cartOpen()) openCart(); // recarregou com o carrinho aberto
  if (pendingToast) { const t = pendingToast; pendingToast = null; toast(...t); }
}
window.addEventListener("hashchange", () => {
  if (location.hash && !location.hash.startsWith("#/")) { app.focus({ preventScroll: true }); return; } // âncora interna, não é rota
  route(true);
});
function cameFrom() {
  return (history.state && history.state.from) || null;
}
// Link para a página em que o cliente já está: volta ao topo. Breadcrumb para a lista de onde ele veio: usa o "voltar" (mantém filtro e posição)
document.addEventListener("click", (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest('a[href^="#/"]');
  if (!a) return;
  const target = a.getAttribute("href");
  const from = cameFrom();
  if (a.dataset.back && from && from.split("?")[0].startsWith(a.dataset.back)) { e.preventDefault(); history.back(); return; }
  if (target === location.hash || (target === "#/" && !location.hash)) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    showHeader();
  }
});
document.querySelector(".skip-link").addEventListener("click", (e) => { e.preventDefault(); app.focus({ preventScroll: true }); });

// Guarda a posição de rolagem da tela atual para o "voltar" devolver o cliente ao mesmo ponto
let scrollSaveTimer;
window.addEventListener("scroll", () => {
  clearTimeout(scrollSaveTimer);
  scrollSaveTimer = setTimeout(saveScroll, 250);
}, { passive: true });
document.addEventListener("click", (e) => {
  const a = e.target.closest && e.target.closest('a[href^="#/"]');
  if (a) saveScroll();
}, true);

function updateNavActive(r) {
  const own = ["capacetes", "pneus", "selins"];
  let id = { bikes: "navBicicletas", bike: "navBicicletas", pecas: "navPecasBtn", personalize: "navBuilder" }[r.name];
  if (r.name === "categoria") id = own.includes(r.arg) ? `navCat-${r.arg}` : "navPecasBtn";
  if (r.name === "produto") {
    const p = PRODUCTS.find(x => x.id === r.arg);
    id = p && own.includes(p.cat) ? `navCat-${p.cat}` : "navPecasBtn";
  }
  document.querySelectorAll(".navbar [aria-current]").forEach(el => el.removeAttribute("aria-current"));
  const el = id && document.getElementById(id);
  const bar = document.querySelector(".navbar-inner");
  if (!bar) return;
  if (!el) { bar.scrollTo({ left: 0 }); return; }
  el.setAttribute("aria-current", "page");
  if (bar.scrollWidth <= bar.clientWidth) return; // desktop: o menu não rola
  const b = bar.getBoundingClientRect(), e = el.getBoundingClientRect();
  const PAD = 16, FADE = 40;
  const posInBar = e.left - b.left + bar.scrollLeft; // posição do item dentro da faixa rolável
  if (posInBar + e.width <= b.width - FADE) bar.scrollTo({ left: 0, behavior: "smooth" }); // cabe sem rolar: mostra o começo (botão Personalize inteiro)
  else if (e.left < b.left + PAD) bar.scrollBy({ left: e.left - b.left - PAD, behavior: "smooth" });
  else if (e.right > b.right - FADE) bar.scrollBy({ left: e.right - b.right + FADE, behavior: "smooth" });
}

// ---------- Cards ----------
function partsPriceHtml(price, fromPrefix) {
  return `
    <div class="price">${fromPrefix ? "<small>a&nbsp;partir&nbsp;de</small> " : ""}${money(price)}</div>
    <div class="price-terms">3x sem juros · <strong>${money(price * (1 - PIX_DISCOUNT))}</strong>&nbsp;no&nbsp;PIX</div>
  `;
}
function productHref(p, vi) {
  return `#/produto/${p.id}${vi !== undefined && hasChoice(p) ? `?v=${vi}` : ""}`;
}
function variantNoun(p) {
  return (p.variantLabel || "opção").toLowerCase();
}

// opts.vi: variante encontrada pela busca (abre o produto já nela)
function productCardHtml(p, opts) {
  const o = (opts && typeof opts === "object") ? opts : {};
  const vs = variantsOf(p);
  const choice = hasChoice(p);
  const pinned = Number.isInteger(o.vi) && choice;
  const vi = pinned ? o.vi : defaultVariantIdx(p);
  const v = vs[vi];
  const photo = productPhoto(p, v);
  const href = productHref(p, pinned ? vi : undefined);
  const inCart = Object.values(cart).some(e => e.item.id === p.id);
  let meta;
  if (pinned) meta = `${v.sku ? `Cód.&nbsp;${esc(v.sku)} · ` : ""}${nb(v.label)}`;
  else if (choice) meta = `${vs.length}&nbsp;opções de ${nb(variantNoun(p))}`;
  else meta = v.sku ? `Cód.&nbsp;${esc(v.sku)}` : "&nbsp;";
  const varies = !pinned && pricesVary(p);
  return `
    <div class="product-card">
      <div class="thumb">
        ${favBtnHtml("p__" + p.id, p.name)}
        <a href="${href}" class="thumb-link" tabindex="-1" aria-hidden="true">${imgHtml(photo.src, p.name, { note: !photo.exact })}</a>
      </div>
      <div class="info">
        <a class="name" href="${href}">${nameHtml(p.name)}</a>
        <div class="sku">${meta}</div>
        ${partsPriceHtml(pinned ? variantPrice(p, v) : (varies ? minPrice(p) : p.price), varies)}
        ${choice
          ? `<a class="add-btn" href="${href}">${variantNoun(p).startsWith("tamanho") ? "Ver tamanhos" : `Escolher ${esc(variantNoun(p).split(" / ")[0])}`}</a>`
          : `<button class="add-btn ${inCart ? "in-cart" : ""}" data-add="${p.id}" type="button">${inCart ? "✓ No carrinho" : "Adicionar"}</button>`}
      </div>
    </div>
  `;
}

function bikeInstallments(b) {
  const m = /^(\d+)x sem juros$/i.exec(b.installments);
  return m ? `${m[1]}x de ${installment(b.price, Number(m[1]))} sem juros` : b.installments;
}
function bikeCta(b) {
  if (b.aro === 29) return b.colors.length ? "Cor e tamanho" : "Ver tamanhos";
  return b.colors.length > 1 ? "Ver cores" : "Ver detalhes";
}
function bikeInstallmentsHtml(b) {
  const m = /^(\d+)x sem juros$/i.exec(b.installments);
  if (!m) return `ou&nbsp;${nb(b.installments)}`;
  return `ou&nbsp;${m[1]}x&nbsp;de&nbsp;${nb(installment(b.price, Number(m[1])))} sem&nbsp;juros`;
}
function bikeCardHtml(b, opts) {
  const o = (opts && typeof opts === "object") ? opts : {};
  const pinned = Number.isInteger(o.ci) && b.colors[o.ci] !== undefined;
  const ci = pinned ? o.ci : defaultColorIdx(b);
  const photo = bikePhoto(b, b.colors[ci]);
  const href = `#/bike/${b.id}${pinned ? `?c=${ci}` : ""}`;
  const colorsTxt = b.colors.length ? `${b.colors.length}&nbsp;${b.colors.length > 1 ? "cores" : "cor"}` : "Cores&nbsp;sob&nbsp;consulta";
  return `
    <div class="product-card bike-card">
      <div class="thumb">
        ${favBtnHtml("b__" + b.id, b.name)}
        <a href="${href}" class="thumb-link" tabindex="-1" aria-hidden="true">${imgHtml(photo.src, b.name, { note: !photo.exact })}</a>
        <span class="aro-tag">Aro ${b.aro}</span>
      </div>
      <div class="info">
        <a class="name" href="${href}">${nameHtml(b.name)}</a>
        <div class="sku">${pinned ? `Cor:&nbsp;${nb(b.colors[ci])}` : colorsTxt}${b.aro === 29 ? " · tam.&nbsp;15&nbsp;a&nbsp;21" : ""}</div>
        <div class="price">${money(b.price)} <small>à&nbsp;vista</small></div>
        <div class="price-terms">${bikeInstallmentsHtml(b)}</div>
        <a class="add-btn" href="${href}">${bikeCta(b)}</a>
      </div>
    </div>
  `;
}

// Liga botões dos cards (adicionar e favoritar); navegação é por <a href="#/...">
function bindCards(container) {
  if (!container) return;
  container.querySelectorAll("[data-add]").forEach(btn => {
    syncCardAddBtn(btn);
    btn.addEventListener("click", () => {
      const p = PRODUCTS.find(x => x.id === btn.dataset.add);
      if (Object.values(cart).some(e => e.item.id === p.id)) { openCart(); return; }
      addToCart(cartItem(p, variantsOf(p)[0]));
      syncCardAddBtn(btn);
    });
  });
  container.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(btn.dataset.fav, btn); });
  });
}

function bindCarouselArrows() {
  app.querySelectorAll(".carousel-arrow").forEach(btn => {
    btn.addEventListener("click", () => {
      const track = document.getElementById(btn.dataset.target);
      track.scrollBy({ left: (btn.classList.contains("prev") ? -1 : 1) * track.clientWidth * 0.8, behavior: "smooth" });
    });
  });
}

function carouselSectionHtml(title, cardsHtml, viewAllHref) {
  const id = "carousel-" + slug(title);
  return `
    <section class="carousel-section" aria-label="${esc(title)}">
      <div class="carousel-header">
        <h2 class="section-title">${title}</h2>
        ${viewAllHref ? `<a class="view-all-link" href="${viewAllHref}">Ver todos ›</a>` : ""}
      </div>
      <div class="carousel-wrap">
        <button class="carousel-arrow prev" data-target="${id}" type="button" aria-label="Anteriores">‹</button>
        <div class="carousel-track" id="${id}">${cardsHtml}</div>
        <button class="carousel-arrow next" data-target="${id}" type="button" aria-label="Próximos">›</button>
      </div>
    </section>
  `;
}

function categoryCover(catId) {
  const p = PRODUCTS.find(x => x.cat === catId && productImg(x, variantsOf(x)[defaultVariantIdx(x)]));
  return p ? productImg(p, variantsOf(p)[defaultVariantIdx(p)]) : null;
}

function emptyStateHtml(title, text, waMsg) {
  return `
    <div class="empty-state">
      ${title ? `<strong>${title}</strong>` : ""}
      ${text ? `<p>${text}</p>` : ""}
      ${waMsg ? `<a class="checkout-btn" href="${waLink(waMsg)}" target="_blank" rel="noopener">Perguntar no WhatsApp</a>` : ""}
      <div class="empty-links">
        <a href="#/bikes">Ver bicicletas</a>
        <a href="#/pecas">Ver peças e acessórios</a>
      </div>
    </div>
  `;
}

// ---------- Home ----------
function renderHome() {
  const bikes29 = BIKES.filter(b => b.aro === 29);
  const bikesOther = BIKES.filter(b => b.aro !== 29);
  const bikeCover = BIKES.map(b => bikePhoto(b, b.colors[defaultColorIdx(b)]).src).find(Boolean);

  app.innerHTML = `
    <h1 class="sr-only">Jacaré Bike Store — bicicletas e peças em São Leopoldo/RS</h1>
    <a class="hero-banner" href="#/bikes" aria-label="Ver bicicletas">
      <picture>
        <source media="(max-width: 600px)" srcset="assets/brand/hero-mobile.webp" width="760" height="530">
        <img src="assets/brand/hero-banner.webp" alt="Jacaré Bike Store — Liberdade sobre duas rodas" width="1983" height="793" fetchpriority="high" decoding="async">
      </picture>
      <span class="hero-cta" aria-hidden="true">Ver bicicletas →</span>
    </a>

    <div class="benefits-bar">
      <div class="benefit">
        <span class="benefit-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg></span>
        <div><strong>Parcele sem juros</strong><span>Peças em até 3x · 5% off no PIX</span></div>
      </div>
      <div class="benefit">
        <span class="benefit-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M8.2 13.5L7 22l5-3 5 3-1.2-8.5"></path></svg></span>
        <div><strong>Marcas de confiança</strong><span>Oggi, Absolute, Kenda e mais</span></div>
      </div>
      <div class="benefit">
        <span class="benefit-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.8 2.8-2-2z"></path></svg></span>
        <div><strong>Assistência Técnica</strong><span>Mecânica especializada</span></div>
      </div>
      <div class="benefit">
        <span class="benefit-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path></svg></span>
        <div><strong>Atendimento</strong><span>WhatsApp e loja em São Leopoldo</span></div>
      </div>
    </div>

    <section class="cats-section" aria-label="Compre por categoria">
      <h2 class="section-title center">Compre por Categoria</h2>
      <div class="section-sub center">Bicicletas, peças e acessórios</div>
      <div class="cat-icons-row">
        <a class="cat-icon" href="#/bikes">
          <span class="cat-icon-photo">${imgHtml(bikeCover, "", { small: true })}</span>
          <span class="cat-icon-label">Bicicletas</span>
        </a>
        ${CATEGORIES.map(cat => `
          <a class="cat-icon" href="#/categoria/${cat.id}">
            <span class="cat-icon-photo">${imgHtml(categoryCover(cat.id), "", { small: true })}</span>
            <span class="cat-icon-label">${cat.name}</span>
          </a>`).join("")}
      </div>
    </section>

    ${carouselSectionHtml("Bicicletas Aro 29", bikes29.map(bikeCardHtml).join(""), "#/bikes/29")}

    <div class="builder-cta">
      <div class="builder-cta-text">
        <div class="builder-cta-eyebrow">PERSONALIZE SUA BIKE</div>
        <h2>Troque as peças da sua bike</h2>
        <p>Diga o aro, escolha suspensão, pneus, freios, câmbio e mais — só aparece o que serve na sua bike. Veja o total na hora e peça pelo WhatsApp.</p>
      </div>
      <a class="builder-cta-btn" href="#/personalize">Começar →</a>
    </div>

    ${carouselSectionHtml("Aro 26, Juvenis e Infantis", bikesOther.map(bikeCardHtml).join(""), "#/bikes/outras")}
    ${carouselSectionHtml("Capacetes", PRODUCTS.filter(p => p.cat === "capacetes").map(p => productCardHtml(p)).join(""), "#/categoria/capacetes")}
    ${carouselSectionHtml("Pneus", PRODUCTS.filter(p => p.cat === "pneus").map(p => productCardHtml(p)).join(""), "#/categoria/pneus")}
    ${carouselSectionHtml("Selins", PRODUCTS.filter(p => p.cat === "selins").map(p => productCardHtml(p)).join(""), "#/categoria/selins")}
  `;
  app.querySelectorAll(".carousel-track").forEach(bindCards);
  bindCarouselArrows();
}

// ---------- Listagens ----------
function renderCategory(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  const products = PRODUCTS.filter(p => p.cat === catId);
  app.innerHTML = `
    <div class="category-page">
      <nav class="breadcrumb" aria-label="Você está em"><a href="#/">Início</a> / <a href="#/pecas">Peças</a> / ${cat.name}</nav>
      <h1 class="section-title">${cat.name}</h1>
      <div class="section-sub">${products.length} ${products.length === 1 ? "produto" : "produtos"}</div>
      <div class="product-grid">${products.map(p => productCardHtml(p)).join("")}</div>
    </div>
  `;
  bindCards(app.querySelector(".product-grid"));
}

function renderBikes(filter) {
  const groups = [
    { title: "Aro 29", list: BIKES.filter(b => b.aro === 29), key: "29" },
    { title: "Aro 26", list: BIKES.filter(b => b.aro === 26), key: "outras" },
    { title: "Juvenis e Infantis (aro 12 a 24)", list: BIKES.filter(b => b.aro < 26), key: "outras" },
  ].filter(g => filter === "all" || g.key === filter);

  app.innerHTML = `
    <div class="category-page">
      <nav class="breadcrumb" aria-label="Você está em"><a href="#/">Início</a> / Bicicletas</nav>
      <h1 class="section-title">Bicicletas</h1>
      <div class="bike-filter" role="group" aria-label="Filtrar bicicletas">
        <a class="${filter === "all" ? "active" : ""}" href="#/bikes" ${filter === "all" ? 'aria-current="true"' : ""}>Todas</a>
        <a class="${filter === "29" ? "active" : ""}" href="#/bikes/29" ${filter === "29" ? 'aria-current="true"' : ""}>Aro 29</a>
        <a class="${filter === "outras" ? "active" : ""}" href="#/bikes/outras" ${filter === "outras" ? 'aria-current="true"' : ""}>Aro 26 e infantis</a>
      </div>
      ${groups.map(g => `
        <h2 class="group-title">${g.title}</h2>
        <div class="product-grid">${g.list.map(bikeCardHtml).join("")}</div>
      `).join("")}
    </div>
  `;
  app.querySelectorAll(".product-grid").forEach(bindCards);
}

function renderNotFound(kind) {
  const isBike = kind === "bike";
  app.innerHTML = `
    <div class="category-page">
      <nav class="breadcrumb" aria-label="Você está em"><a href="#/">Início</a> / ${isBike ? '<a href="#/bikes">Bicicletas</a>' : '<a href="#/pecas">Peças</a>'}</nav>
      <h1 class="section-title">${isBike ? "Bicicleta não encontrada" : "Produto não encontrado"}</h1>
      ${emptyStateHtml("", "Esse item pode ter saído do catálogo ou o link está incompleto. Veja os modelos disponíveis ou pergunte à loja.", "Olá! Recebi um link do site que não abriu. Podem me ajudar?")}
    </div>
  `;
}

function renderAllCategories() {
  app.innerHTML = `
    <div class="category-page">
      <nav class="breadcrumb" aria-label="Você está em"><a href="#/">Início</a> / Peças e Acessórios</nav>
      <h1 class="section-title">Peças e Acessórios</h1>
      <div class="section-sub">Escolha uma categoria</div>
      <div class="cat-tiles">
        ${CATEGORIES.map(c => {
          const n = PRODUCTS.filter(p => p.cat === c.id).length;
          return `
          <a class="cat-tile" href="#/categoria/${c.id}">
            <span class="cat-tile-photo" aria-hidden="true">${imgHtml(categoryCover(c.id), "")}</span>
            <strong>${c.name}</strong>
            <span>${n} ${n === 1 ? "produto" : "produtos"}</span>
          </a>`;
        }).join("")}
      </div>
    </div>
  `;
}

function renderFavorites() {
  const products = PRODUCTS.filter(p => favorites.has("p__" + p.id));
  const bikes = BIKES.filter(b => favorites.has("b__" + b.id));
  const total = bikes.length + products.length;
  app.innerHTML = `
    <div class="category-page fav-page">
      <nav class="breadcrumb" aria-label="Você está em"><a href="#/">Início</a> / Favoritos</nav>
      <h1 class="section-title">Seus favoritos</h1>
      ${total ? `<div class="product-grid">${bikes.map(bikeCardHtml).join("")}${products.map(p => productCardHtml(p)).join("")}</div>`
        : emptyStateHtml("Nenhum favorito ainda", "Toque no ♡ de uma bike ou peça para guardar aqui.")}
    </div>
  `;
  bindCards(app.querySelector(".product-grid"));
}

// ---------- Opções (chips de cor/tamanho/versão) ----------
function chipVisual(opt) {
  if (opt.img) return `<img src="${smallOf(opt.img)}" alt="" loading="lazy">`;
  const sw = opt.swatch !== undefined ? opt.swatch : swatchCss(opt.label);
  return sw ? `<span class="chip-swatch" style="background:${sw}"></span>` : "";
}
function optionChipsHtml(title, options, selectedIdx, attr) {
  const sel = options[selectedIdx];
  const visual = options.some(o => o.img || (o.swatch !== null && swatchCss(o.label)));
  // só cores (sem tamanho/medida): no celular vira grade de amostras e o nome aparece no título
  const compact = visual && options.length > 3 && options.every(o => !/ — |\d/.test(o.label));
  return `
    <div class="pdp-option">
      <div class="pdp-option-head">
        ${visual && sel ? `<span class="pdp-option-preview" aria-hidden="true">${chipVisual(sel) || `<span class="chip-swatch"></span>`}</span>` : ""}
        <strong>${title}: <span class="pdp-option-value">${sel ? esc(sel.label) : "escolha abaixo"}</span></strong>
      </div>
      <div class="pdp-chips ${compact ? "compact" : ""}" role="group" aria-label="${esc(title)}">
        ${options.map((o, i) => `
          <button class="pdp-chip ${i === selectedIdx ? "active" : ""} ${visual ? "has-visual" : ""}" ${attr}="${i}" type="button" aria-pressed="${i === selectedIdx}" title="${esc(o.label)}">
            ${visual ? (chipVisual(o) || `<span class="chip-swatch"></span>`) : ""}<span class="chip-label">${esc(o.label).replace(/\//g, "/<wbr>")}${o.price ? ` <em>${o.price}</em>` : ""}</span>
          </button>`).join("")}
      </div>
    </div>
  `;
}
function refocus(selector) {
  const el = selector && app.querySelector(selector);
  if (el) el.focus({ preventScroll: true });
}

// Barra fixa de compra no celular: aparece quando o botão principal sai da tela
let stickyUpdate = null;
function setupStickyCta() {
  const main = app.querySelector(".pdp-add-btn");
  const bar = app.querySelector(".pdp-sticky-cta");
  if (!main || !bar) return;
  const update = () => {
    if (!main.isConnected) return;
    const hdr = siteHeader.classList.contains("is-hidden") ? 0 : siteHeader.offsetHeight;
    const r = main.getBoundingClientRect();
    const show = mobileMQ.matches && !(r.top >= hdr && r.bottom <= window.innerHeight);
    bar.classList.toggle("show", show);
    document.body.classList.toggle("has-sticky-cta", show);
  };
  bar.classList.add("no-anim");
  update();
  requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.remove("no-anim")));
  stickyUpdate = () => requestAnimationFrame(update);
  window.addEventListener("scroll", stickyUpdate, { passive: true });
  window.addEventListener("resize", stickyUpdate);
}
function clearStickyCta() {
  if (stickyUpdate) { window.removeEventListener("scroll", stickyUpdate); window.removeEventListener("resize", stickyUpdate); stickyUpdate = null; }
  document.body.classList.remove("has-sticky-cta");
}
// Trocou a cor com a foto grande fora da tela: avisa e oferece "Ver foto" (sem rolar sozinho)
function peekChoice(label) {
  if (!mobileMQ.matches) return;
  const g = app.querySelector(".pdp-gallery");
  if (!g) return;
  const hdr = siteHeader.classList.contains("is-hidden") ? 0 : siteHeader.offsetHeight;
  if (g.getBoundingClientRect().bottom > hdr + 60) return;
  toast(`<span>${esc(label)}</span>`, "Ver foto", () => {
    const top = g.getBoundingClientRect().top + window.scrollY - hdr - 8;
    window.scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
}

// ---------- Página do produto ----------
function renderProductDetail(productId, variantIdx) {
  const p = PRODUCTS.find(x => x.id === productId);
  const cat = CATEGORIES.find(c => c.id === p.cat);
  const vs = variantsOf(p);
  const vi = (Number.isInteger(variantIdx) && vs[variantIdx]) ? variantIdx : defaultVariantIdx(p);
  const v = vs[vi];
  const price = variantPrice(p, v);
  const photo = productPhoto(p, v);
  const item = cartItem(p, v);
  const inCart = cart[item.key];
  const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 10);
  const varies = pricesVary(p);
  clearStickyCta();

  const options = vs.map(x => ({
    label: x.label,
    img: exactImg(p.id, x.label),
    price: varies ? money(variantPrice(p, x)) : "",
  }));

  app.innerHTML = `
    <div class="pdp">
      <nav class="breadcrumb" aria-label="Você está em"><a href="#/">Início</a> / <a href="#/categoria/${cat.id}" data-back="#/categoria/${cat.id}">${cat.name}</a> / <span>${esc(p.name)}</span></nav>
      <div class="pdp-grid">
        <div class="pdp-gallery">
          ${favBtnHtml("p__" + p.id, p.name)}
          ${imgHtml(photo.src, p.name, { full: true, eager: true, note: !photo.exact })}
        </div>
        <div class="pdp-buy">
          <h1>${esc(p.name)}</h1>
          <div class="pdp-code">${v.sku ? `Cód. do produto: ${esc(v.sku)}` : "&nbsp;"}</div>
          <div class="pdp-price">${money(price)}</div>
          <div class="pdp-terms">3x de ${installment(price, 3)} sem juros<br>ou <strong>${money(price * (1 - PIX_DISCOUNT))}</strong> no PIX (5% off)</div>
          ${hasChoice(p) ? optionChipsHtml(p.variantLabel, options, vi, "data-vi")
            : (v.label ? `<div class="pdp-option"><strong>Cor: <span class="pdp-option-value">${esc(v.label)}</span></strong></div>` : "")}
          ${inCart ? `
            <button class="add-btn pdp-add-btn go-cart" id="pdpCartBtn" type="button">Ver carrinho e finalizar (${cartCount()})</button>
            <button class="pdp-more-btn" id="pdpAddBtn" type="button">+ Adicionar mais 1 (${inCart.qty} no carrinho)</button>`
            : `<button class="add-btn pdp-add-btn" id="pdpAddBtn" type="button">Adicionar ao carrinho</button>`}
          <a class="pdp-wa-link" target="_blank" rel="noopener" href="${waLink(`Olá! Tenho interesse em: ${item.name}${v.sku ? ` (cód. ${v.sku})` : ""} — ${money(price)}. Tem disponível?`)}">Tirar dúvida no WhatsApp</a>
          <div class="pdp-note">O pedido é finalizado direto com a loja pelo WhatsApp.</div>
        </div>
      </div>

      ${related.length ? `
      <section class="carousel-section" aria-label="Você também pode gostar de">
        <div class="carousel-header"><h2 class="section-title">Você também pode gostar de</h2></div>
        <div class="carousel-wrap">
          <button class="carousel-arrow prev" data-target="pdp-related" type="button" aria-label="Anteriores">‹</button>
          <div class="carousel-track" id="pdp-related">${related.map(x => productCardHtml(x)).join("")}</div>
          <button class="carousel-arrow next" data-target="pdp-related" type="button" aria-label="Próximos">›</button>
        </div>
      </section>` : ""}

      <div class="pdp-sticky-cta" aria-hidden="true">
        <div><strong>${money(price)}</strong><span>3x sem juros</span></div>
        <button type="button" class="add-btn" tabindex="-1">${inCart ? "Ver carrinho" : "Adicionar"}</button>
      </div>
    </div>
  `;

  app.querySelectorAll("[data-vi]").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.vi);
      setHashQuiet(productHref(p, i));
      renderProductDetail(p.id, i);
      refocus(`[data-vi="${i}"]`);
      if (exactImg(p.id, vs[i].label)) peekChoice(`${p.variantLabel}: ${vs[i].label}`);
    });
  });
  const addBtn = document.getElementById("pdpAddBtn");
  addBtn.addEventListener("click", () => {
    addToCart(item);
    renderProductDetail(p.id, vi);
    refocus("#pdpCartBtn");
  });
  const cartBtn = document.getElementById("pdpCartBtn");
  if (cartBtn) cartBtn.addEventListener("click", openCart);
  app.querySelector(".pdp-sticky-cta .add-btn").addEventListener("click", () => (cartBtn || addBtn).click());
  app.querySelector(".pdp-gallery .fav-btn").addEventListener("click", (e) => toggleFavorite(e.currentTarget.dataset.fav, e.currentTarget));
  bindCards(document.getElementById("pdp-related"));
  bindCarouselArrows();
  setupStickyCta();
}

// ---------- Página da bike ----------
const SIZE_HINT = { "15": "1,55 a 1,65 m", "17": "1,65 a 1,75 m", "19": "1,75 a 1,85 m", "21": "acima de 1,85 m" };

function bikeHasAroInName(b) {
  return /\baro\b/i.test(b.name);
}
function bikeWaMessage(b, color, size, version) {
  const parts = [`Olá! Quero a bicicleta ${b.name}${bikeHasAroInName(b) ? "" : ` (aro ${b.aro})`}`];
  if (version) parts.push(`versão ${version}`);
  parts.push(color ? `cor ${color}` : "gostaria de saber as cores disponíveis");
  if (b.aro === 29) parts.push(size ? `tamanho ${size}` : "preciso de ajuda para escolher o tamanho");
  return `${parts.join(", ")}. Valor no site: ${money(b.price)} à vista ou ${bikeInstallments(b)}. Tem disponível?`;
}
function bikeHref(b, ci, size, oi) {
  const q = [];
  if (ci !== undefined) q.push(`c=${ci}`);
  if (size) q.push(`s=${size}`);
  if (oi !== undefined) q.push(`o=${oi}`);
  return `#/bike/${b.id}${q.length ? "?" + q.join("&") : ""}`;
}

function renderBikeDetail(bikeId, colorIdx, size, versionIdx) {
  const b = BIKES.find(x => x.id === bikeId);
  const ci = (Number.isInteger(colorIdx) && b.colors[colorIdx] !== undefined) ? colorIdx : defaultColorIdx(b);
  const color = b.colors[ci] || null;
  const sizes = b.aro === 29 ? FRAME_SIZES_29 : [];
  const sz = sizes.includes(size) ? size : undefined;
  const versions = b.versions || [];
  const oi = Number.isInteger(versionIdx) && versions[versionIdx] ? versionIdx : undefined;
  const photo = bikePhoto(b, color);
  const others = BIKES.filter(x => x.id !== b.id)
    .sort((x, y) => (Math.abs(x.aro - b.aro) - Math.abs(y.aro - b.aro)) || (Math.abs(x.price - b.price) - Math.abs(y.price - b.price)))
    .slice(0, 8);
  const colorOpts = b.colors.map(c => ({ label: c, img: IMG[`${b.id}--${slug(c)}`] || null }));
  const waHref = waLink(bikeWaMessage(b, color, sz, oi !== undefined ? versions[oi] : null));
  clearStickyCta();

  app.innerHTML = `
    <div class="pdp">
      <nav class="breadcrumb" aria-label="Você está em"><a href="#/">Início</a> / <a href="#/bikes" data-back="#/bikes">Bicicletas</a> / <span>${esc(b.name)}</span></nav>
      <div class="pdp-grid">
        <div class="pdp-gallery bike-gallery">
          ${favBtnHtml("b__" + b.id, b.name)}
          ${imgHtml(photo.src, `${b.name}${color ? " " + color : ""}`, { full: true, eager: true, note: !photo.exact })}
        </div>
        <div class="pdp-buy">
          <div class="pdp-brand">${esc(b.brand)} · Aro ${b.aro}</div>
          <h1>${esc(b.name)}</h1>
          <div class="pdp-price">${money(b.price)} <small>à&nbsp;vista</small></div>
          <div class="pdp-terms">ou ${esc(bikeInstallments(b))}</div>
          ${versions.length ? optionChipsHtml("Versão", versions.map(x => ({ label: x, swatch: null })), oi === undefined ? -1 : oi, "data-oi") : ""}
          ${b.colors.length
            ? optionChipsHtml("Cor", colorOpts, ci, "data-ci")
            : `<div class="pdp-option"><strong>Cor: <span class="pdp-option-value">consulte as cores disponíveis</span></strong></div>`}
          ${sizes.length ? `
            <div class="pdp-option">
              <strong>Tamanho do quadro: <span class="pdp-option-value">${sz || "escolha abaixo"}</span></strong>
              <div class="pdp-chips sizes" role="group" aria-label="Tamanho do quadro">
                ${sizes.map(s => `<button class="pdp-chip size ${s === sz ? "active" : ""}" data-size="${s}" type="button" aria-pressed="${s === sz}"><span>${s}</span></button>`).join("")}
              </div>
              <dl class="size-guide">
                ${sizes.map(s => `<div class="${s === sz ? "active" : ""}"><dt>${s}</dt><dd>${SIZE_HINT[s]}</dd></div>`).join("")}
              </dl>
              <a class="size-help" target="_blank" rel="noopener" href="${waLink(`Olá! Qual tamanho da ${b.name} é melhor para mim? Minha altura é `)}">Na dúvida? Pergunte no WhatsApp pela sua altura</a>
            </div>` : ""}
          <a class="add-btn pdp-add-btn wa-btn" target="_blank" rel="noopener" href="${waHref}">Comprar pelo WhatsApp</a>
          <div class="pdp-note">${b.aro === 29 ? "Confirmamos disponibilidade, cor e tamanho e fechamos o pedido pelo WhatsApp." : "Confirmamos disponibilidade e cor e fechamos o pedido pelo WhatsApp."}</div>
        </div>
      </div>

      <div class="pdp-description">
        <h2>Destaques</h2>
        <ul class="pdp-specs">${b.specs.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
      </div>

      <section class="carousel-section" aria-label="Outros modelos">
        <div class="carousel-header"><h2 class="section-title">Outros modelos</h2></div>
        <div class="carousel-wrap">
          <button class="carousel-arrow prev" data-target="pdp-related-bikes" type="button" aria-label="Anteriores">‹</button>
          <div class="carousel-track" id="pdp-related-bikes">${others.map(bikeCardHtml).join("")}</div>
          <button class="carousel-arrow next" data-target="pdp-related-bikes" type="button" aria-label="Próximos">›</button>
        </div>
      </section>

      <div class="pdp-sticky-cta" aria-hidden="true">
        <div><strong>${money(b.price)}</strong><span>à vista</span></div>
        <a class="add-btn wa-btn" href="${waHref}" target="_blank" rel="noopener" tabindex="-1">Comprar pelo WhatsApp</a>
      </div>
    </div>
  `;

  const rerender = (nci, nsz, noi, focusSel) => {
    setHashQuiet(bikeHref(b, nci, nsz, noi));
    renderBikeDetail(b.id, nci, nsz, noi);
    refocus(focusSel);
  };
  app.querySelectorAll("[data-ci]").forEach(btn => btn.addEventListener("click", () => {
    const i = Number(btn.dataset.ci);
    rerender(i, sz, oi, `[data-ci="${i}"]`);
    if (IMG[`${b.id}--${slug(b.colors[i])}`]) peekChoice(`Cor: ${b.colors[i]}`);
  }));
  app.querySelectorAll("[data-size]").forEach(btn => btn.addEventListener("click", () => rerender(ci, btn.dataset.size, oi, `[data-size="${btn.dataset.size}"]`)));
  app.querySelectorAll("[data-oi]").forEach(btn => btn.addEventListener("click", () => rerender(ci, sz, Number(btn.dataset.oi), `[data-oi="${btn.dataset.oi}"]`)));
  app.querySelector(".pdp-gallery .fav-btn").addEventListener("click", (e) => toggleFavorite(e.currentTarget.dataset.fav, e.currentTarget));
  bindCards(document.getElementById("pdp-related-bikes"));
  bindCarouselArrows();
  setupStickyCta();
}

// ---------- Busca (palavra por palavra, sem acento, singular/plural, sinônimos) ----------
const STOP = new Set(["de", "da", "do", "das", "dos", "e", "com", "para", "pra", "a", "o", "as", "os", "em", "no", "na", "cod", "codigo", "um", "uma"]);
const SYN = { bike: "bicicleta", bikes: "bicicleta", bicicletas: "bicicleta", bici: "bicicleta", crianca: "infantil", criancas: "infantil", kids: "infantil", menino: "infantil", menina: "infantil", suspensoes: "suspensao", guidon: "guidao", mesa: "suporte" };
function stem(w) {
  w = SYN[w] || w;
  if (w.length > 3) w = w.replace(/(oes|aes)$/, "ao").replace(/ais$/, "al").replace(/eis$/, "el").replace(/ns$/, "m").replace(/s$/, "");
  if (w.length > 3) w = w.replace(/a$/, "o");
  return w;
}
function words(s) {
  return slug(s).split("-").filter(Boolean);
}
function arosOf(p) {
  const fromName = (p.name.match(/aro\s*\d{2}(?:\s*\/\s*\d{2})*/gi) || []).flatMap(m => m.match(/\d{2}/g).map(Number));
  return [...new Set([p.aro, ...variantsOf(p).map(v => v.aro), ...fromName].filter(Boolean))];
}
const SEARCH_INDEX = [
  ...BIKES.map(b => ({
    type: "bike", ref: b, skus: [], aros: [b.aro], head: ["bicicleta"],
    words: words([b.name, b.brand, "bicicleta", `aro ${b.aro}`, ...b.colors, ...b.specs, ...(b.versions || [])].join(" ")).map(stem),
    colors: b.colors.map(c => words(c).map(stem)),
  })),
  ...PRODUCTS.map(p => {
    const cat = CATEGORIES.find(c => c.id === p.cat);
    return {
      type: "product", ref: p, aros: arosOf(p),
      head: words([cat ? cat.name : "", p.name.split(" ")[0]].join(" ")).filter(t => !STOP.has(t)).map(stem),
      words: words([p.name, cat ? cat.name : "", p.color || "", p.aro ? `aro ${p.aro}` : "",
        ...variantsOf(p).flatMap(v => [v.label, v.aro ? `aro ${v.aro}` : ""])].join(" ")).map(stem),
      variants: variantsOf(p).map(v => ({ words: words(v.label).map(stem), sku: v.sku || "", aro: v.aro || null })),
      skus: variantsOf(p).map(v => v.sku).filter(Boolean),
    };
  }),
];
function searchCatalog(query) {
  let toks = words(String(query).replace(/\baro(\d)/gi, "aro $1")).filter(t => !STOP.has(t));
  // "aro 20" vira filtro pelo aro de verdade (não casa "2026" nem "12V")
  let aro = null;
  const ai = toks.findIndex((t, i) => t === "aro" && /^\d{2}$/.test(toks[i + 1] || ""));
  if (ai >= 0) { aro = Number(toks[ai + 1]); toks.splice(ai, 2); }
  const tokens = toks.map(stem);
  if (!tokens.length && aro === null) return { empty: true, results: [] };
  const tokenHits = (entryWords, skus, t) =>
    entryWords.some(w => w.startsWith(t)) || (/^\d{3,}$/.test(t) && skus.some(sk => sk.includes(t)));
  const results = [];
  SEARCH_INDEX.forEach((e, order) => {
    if (aro !== null && !e.aros.includes(aro)) return;
    if (!tokens.every(t => tokenHits(e.words, e.skus, t))) return;
    // quem casa pela categoria / tipo do produto vem primeiro ("aros" mostra os aros antes das bikes)
    const score = tokens.filter(t => e.head.some(w => w.startsWith(t))).length;
    const res = { e, score, order };
    if (e.type === "bike") {
      let best = 0;
      e.colors.forEach((cw, i) => {
        const sc = tokens.filter(t => tokenHits(cw, [], t)).length;
        const own = !!IMG[`${e.ref.id}--${slug(e.ref.colors[i])}`];
        if (sc > best || (sc && sc === best && own && !IMG[`${e.ref.id}--${slug(e.ref.colors[res.ci])}`])) { best = sc; res.ci = i; }
      });
    } else if (hasChoice(e.ref)) {
      let best = 0;
      e.variants.forEach((v, i) => {
        const sc = tokens.filter(t => tokenHits(v.words, v.sku ? [v.sku] : [], t)).length * 2 + (aro !== null && v.aro === aro ? 1 : 0);
        if (sc > best) { best = sc; res.vi = i; }
      });
    }
    results.push(res);
  });
  results.sort((x, y) => y.score - x.score || x.order - y.order);
  return { results };
}

function renderSearch(query) {
  const q = query.trim();
  const found = q.length >= 2 ? searchCatalog(q) : { empty: true, results: [] };
  if (found.empty) {
    app.innerHTML = `<div class="search-results"><h1 class="sr-only">Busca</h1><div class="empty-state"><strong>Digite o que procura</strong><p>Ex.: “capacete preto”, “pneu 29”, “oggi” ou o código da peça.</p></div></div>`;
    return;
  }
  const total = found.results.length;
  app.innerHTML = `
    <div class="search-results">
      <nav class="breadcrumb" aria-label="Você está em"><a href="#/">Início</a> / Busca</nav>
      <h1 class="section-title">${total ? `${total} ${total === 1 ? "resultado" : "resultados"}` : "Nada encontrado"}</h1>
      <div class="section-sub">para “${esc(q)}”</div>
      ${total
        ? `<div class="product-grid">${found.results.map(r => r.e.type === "bike" ? bikeCardHtml(r.e.ref, { ci: r.ci }) : productCardHtml(r.e.ref, { vi: r.vi })).join("")}</div>`
        : emptyStateHtml("", "A loja tem mais itens do que aparecem aqui — pergunte que a gente confere.", `Olá! Vocês têm ${q}?`)}
    </div>
  `;
  bindCards(app.querySelector(".product-grid"));
}

// ---------- Personalize sua Bike ----------
// Passo 0 pergunta o aro; cada etapa aceita mais de um item, com quantidade (aros e pneus vêm em par).
const BUILDER_STEPS = [
  { key: "garfos", cats: ["garfos"], label: "Suspensão", hint: "Suspensão ou garfo rígido" },
  { key: "aros", cats: ["aros"], label: "Aros", hint: "Vêm em par (dianteiro e traseiro) — ajuste a quantidade se precisar", qty: 2 },
  { key: "pneus", cats: ["pneus"], label: "Pneus", hint: "Vêm em par — ajuste a quantidade se precisar", qty: 2 },
  { key: "freios", cats: ["freios"], label: "Freios", hint: "Pode escolher o freio e também discos avulsos" },
  { key: "cambios", cats: ["cambios"], label: "Câmbio", hint: "Pode escolher câmbio e alavanca juntos" },
  { key: "pedivelas", cats: ["pedivelas"], label: "Pedivela", hint: "" },
  { key: "guidoes", cats: ["guidoes", "suportes"], label: "Guidão", hint: "Guidão e suporte (mesa)" },
  { key: "selins", cats: ["selins"], label: "Selim", hint: "" },
  { key: "pedais", cats: ["pedais", "manoplas"], label: "Pedais", hint: "Pedais e manoplas" },
];
const BUILDER_AROS = [26, 29];

let builderAro = null;
let builderChoices = {}; // stepKey -> { itemKey: { item, qty } }
let builderSel = {};     // "stepKey|productId" -> índice da variante escolhida no select
let builderLastStep = 0; // última etapa vista (o botão do menu volta para ela)

(function loadBuilder() {
  const s = load("jacare_builder", null);
  if (!s || !BUILDER_AROS.includes(s.aro)) return;
  builderAro = s.aro;
  builderSel = s.sel || {};
  builderLastStep = Number.isInteger(s.last) ? s.last : 0;
  Object.entries(s.choices || {}).forEach(([stepKey, bucket]) => {
    Object.values(bucket || {}).forEach(e => {
      const p = PRODUCTS.find(x => x.id === e.id);
      const v = p && findVariant(p, e.label);
      if (!v || !(e.qty > 0)) return;
      const item = cartItem(p, v);
      (builderChoices[stepKey] = builderChoices[stepKey] || {})[item.key] = { item, qty: e.qty };
    });
  });
})();
function saveBuilder() {
  const choices = {};
  Object.entries(builderChoices).forEach(([k, bucket]) => {
    choices[k] = {};
    Object.entries(bucket).forEach(([key, e]) => { choices[k][key] = { id: e.item.id, label: e.item.label, qty: e.qty }; });
  });
  store("jacare_builder", { aro: builderAro, choices, sel: builderSel, last: builderLastStep });
}

function fitsAro(p, v, aro) {
  const a = (v && v.aro) || p.aro;
  return !a || a === aro;
}
function builderVariants(p) {
  return variantsOf(p).filter(v => fitsAro(p, v, builderAro));
}
// opção mostrada no select: a escolhida pelo cliente; senão a que já está na montagem; senão a mais barata com foto
function builderSelIdx(stepKey, p, vs) {
  const saved = builderSel[`${stepKey}|${p.id}`];
  if (Number.isInteger(saved) && saved >= 0 && saved < vs.length) return saved;
  const mine = Object.values(builderChoices[stepKey] || {}).find(e => e.item.id === p.id);
  if (mine) { const j = vs.findIndex(v => (v.label || "") === mine.item.label); if (j >= 0) return j; }
  return defaultVariantIdx(p, vs);
}
const OTHER_NOUN = { cor: "Outra cor", faixa: "Outra faixa", tamanho: "Outro tamanho", aro: "Outro aro" };
function builderOtherText(p) {
  const noun = variantNoun(p).split(" / ").find(n => n !== "aro") || "aro";
  return OTHER_NOUN[noun] || "Outra opção";
}
function builderSnapshot() {
  return { aro: builderAro, sel: Object.assign({}, builderSel), last: builderLastStep,
    choices: JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(builderChoices).map(([k, b]) => [k, b])))) };
}
function builderRestore(snap) {
  builderAro = snap.aro; builderSel = snap.sel; builderLastStep = snap.last; builderChoices = snap.choices;
  saveBuilder();
}

function builderProducts(step) {
  return PRODUCTS.filter(p => step.cats.includes(p.cat) && builderVariants(p).length);
}
function builderEntries() {
  return BUILDER_STEPS.flatMap(s => Object.values(builderChoices[s.key] || {}).map(e => ({ step: s, ...e })));
}
function builderTotal() {
  return builderEntries().reduce((sum, e) => sum + e.item.price * e.qty, 0);
}
function stepDone(s) {
  return Object.keys(builderChoices[s.key] || {}).length > 0;
}

function startBuilder() {
  go(builderAro ? `#/personalize/${builderLastStep + 1}` : "#/personalize");
}
function goBuilderStep(i) {
  go(`#/personalize/${i + 1}`);
}
function renderBuilderRoute(arg) {
  if (!builderAro || !arg) { renderBuilderAro(); return; }
  if (arg === "resumo") { renderBuilderSummary(); return; }
  const n = Math.min(Math.max(parseInt(arg, 10) || 1, 1), BUILDER_STEPS.length);
  renderBuilderStep(n - 1);
}

function builderProgressHtml() {
  const total = BUILDER_STEPS.length;
  const done = BUILDER_STEPS.filter(stepDone).length;
  const pct = Math.round((done / total) * 100);
  const r = 54, c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const pieces = builderEntries().reduce((n, e) => n + e.qty, 0);
  return `
    <div class="builder-progress">
      <div class="progress-ring" aria-hidden="true">
        <svg viewBox="0 0 130 130">
          <circle class="ring-bg" cx="65" cy="65" r="${r}"></circle>
          <circle class="ring-fill" cx="65" cy="65" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"></circle>
        </svg>
        <div class="progress-ring-label">
          <strong>${done}<span>/${total}</span></strong>
          <span class="progress-ring-sub">etapas</span>
        </div>
      </div>
      <div class="progress-info">
        <div class="progress-title">Sua bike aro ${builderAro}${pieces ? ` · ${pieces} ${pieces === 1 ? "peça" : "peças"}` : ""} <a class="progress-change" href="#/personalize">trocar aro</a></div>
        <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}" aria-label="Etapas com peças escolhidas"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        <div class="progress-total-row"><span>Subtotal das peças</span><strong>${money(builderTotal())}</strong></div>
      </div>
    </div>
  `;
}

function renderBuilderAro() {
  const hasPieces = builderEntries().length > 0;
  app.innerHTML = `
    <div class="builder-page">
      <nav class="breadcrumb" aria-label="Você está em"><a href="#/">Início</a> / Personalize sua Bike</nav>
      <div class="builder-intro">
        <div class="builder-cta-eyebrow">PERSONALIZE SUA BIKE</div>
        <h1>Qual é o aro da sua bicicleta?</h1>
        <p>Assim mostramos só as peças que servem nela. O número do aro fica escrito na lateral do pneu (ex.: 29 × 2.10).</p>
        <div class="aro-options">
          ${BUILDER_AROS.map(a => `<button class="aro-option ${a === builderAro ? "current" : ""}" data-aro="${a}" type="button" aria-pressed="${a === builderAro}"><strong>Aro ${a}</strong><span>${a === builderAro ? "Seu aro atual — continuar" : (a === 29 ? "Mountain bike adulta, a mais comum hoje" : "Bikes urbanas, freestyle e modelos clássicos")}</span></button>`).join("")}
        </div>
        ${hasPieces ? `<button class="builder-restart" id="restartBuilder" type="button">Recomeçar do zero</button>` : ""}
        <a class="builder-help" target="_blank" rel="noopener" href="${waLink("Olá! Quero trocar peças da minha bike mas não sei o aro. Podem me ajudar?")}">Não sei o aro — pedir ajuda no WhatsApp</a>
      </div>
    </div>
  `;
  app.querySelectorAll("[data-aro]").forEach(btn => btn.addEventListener("click", () => {
    const novo = Number(btn.dataset.aro);
    if (novo === builderAro) { goBuilderStep(builderLastStep); return; }
    // mantém o que serve no aro novo; o que saiu aparece no aviso, com "Desfazer"
    const snap = builderSnapshot();
    let removed = 0;
    Object.values(builderChoices).forEach(bucket => Object.entries(bucket).forEach(([key, e]) => {
      const p = PRODUCTS.find(x => x.id === e.item.id);
      if (!fitsAro(p, findVariant(p, e.item.label), novo)) { delete bucket[key]; removed += e.qty; }
    }));
    builderSel = {};
    builderAro = novo;
    builderLastStep = 0;
    saveBuilder();
    if (removed) toastAfterRoute(`<span>${removed} ${removed === 1 ? "peça saiu: não serve" : "peças saíram: não servem"} no aro ${novo}</span>`, "Desfazer", () => {
      builderRestore(snap);
      go(`#/personalize/${snap.last + 1}`);
    });
    goBuilderStep(0);
  }));
  const restart = document.getElementById("restartBuilder");
  if (restart) restart.addEventListener("click", () => {
    const snap = builderSnapshot();
    builderChoices = {}; builderSel = {}; builderAro = null; builderLastStep = 0;
    saveBuilder();
    renderBuilderAro();
    toast("<span>Montagem zerada</span>", "Desfazer", () => { builderRestore(snap); renderBuilderAro(); });
  });
}

function renderBuilderStep(stepIdx) {
  const step = BUILDER_STEPS[stepIdx];
  if (builderLastStep !== stepIdx) { builderLastStep = stepIdx; saveBuilder(); }
  document.body.classList.add("has-bottom-bar");
  const products = builderProducts(step);
  const chosen = builderChoices[step.key] || {};
  const isLast = stepIdx === BUILDER_STEPS.length - 1;
  const optText = (label) => String(label).replace(new RegExp(`^${builderAro} (— |× )`), "");

  const tracker = BUILDER_STEPS.map((s, i) => `
    <a class="tracker-dot ${i === stepIdx ? "current" : ""} ${stepDone(s) ? "done" : ""}" href="#/personalize/${i + 1}" ${i === stepIdx ? 'aria-current="step"' : ""}>
      <span class="tracker-num">${stepDone(s) ? "✓" : i + 1}</span>
      <span class="tracker-label">${s.label}</span>
    </a>
  `).join("");

  const cards = products.map((p, pi) => {
    const vs = builderVariants(p);
    const si = builderSelIdx(step.key, p, vs);
    const sv = vs[si];
    const photo = productPhoto(p, sv);
    const chosenHere = Object.values(chosen).filter(e => e.item.id === p.id);
    const choice = vs.length > 1;
    const hasFree = vs.some(v => !chosen[cartItem(p, v).key]);
    const varies = pricesVary(p, vs);
    return `
      <div class="product-card builder-card ${chosenHere.length ? "chosen" : ""}" data-card="${pi}">
        <div class="thumb">${imgHtml(photo.src, p.name, { note: !photo.exact })}</div>
        <div class="info">
          <div class="name">${nameHtml(p.name)}</div>
          ${choice ? `
            <label class="variant-label"><span class="sr-only">${esc(p.variantLabel || "Opção")}</span>
              <select class="variant-select" data-pi="${pi}">
                ${vs.map((v, i) => `<option value="${i}" ${i === si ? "selected" : ""}>${esc(optText(v.label))}</option>`).join("")}
              </select>
            </label>` : (sv.label ? `<div class="sku">${esc(optText(sv.label))}</div>` : "")}
          <div class="price">${money(variantPrice(p, sv))}${step.qty ? " <small>cada</small>" : ""}</div>
          ${varies ? `<div class="price-range">Opções de ${money(minPrice(p))} a ${money(Math.max(...vs.map(v => variantPrice(p, v))))}</div>` : ""}
          ${chosenHere.map(e => `
            <div class="chosen-line">
              <span>✓ ${esc(optText(e.item.label) || "Escolhido")}</span>
              <div class="qty-control">
                <button type="button" data-dec="${esc(e.item.key)}" aria-label="${e.qty === 1 ? "Remover" : "Diminuir quantidade"}">${e.qty === 1 ? "🗑" : "−"}</button>
                <span class="qty" aria-live="polite">${e.qty}</span>
                <button type="button" data-inc="${esc(e.item.key)}" aria-label="Aumentar quantidade">+</button>
              </div>
            </div>`).join("")}
          ${!chosenHere.length
            ? `<button class="add-btn choose-btn" data-pi="${pi}" type="button">${step.qty ? "Adicionar par" : "Adicionar"}</button>`
            : (choice && hasFree ? `<button class="add-btn other-btn in-cart" data-pi="${pi}" type="button">+ ${builderOtherText(p)}</button>` : "")}
        </div>
      </div>
    `;
  }).join("");

  app.innerHTML = `
    <div class="builder-page">
      <nav class="breadcrumb builder-crumb" aria-label="Você está em"><a href="#/">Início</a> / Personalize sua Bike · <a href="#/personalize">aro ${builderAro} (trocar)</a></nav>
      ${builderProgressHtml()}
      <nav class="builder-tracker" aria-label="Etapas">${tracker}</nav>
      <h1 class="section-title">Passo ${stepIdx + 1} de ${BUILDER_STEPS.length}: ${step.label}</h1>
      <div class="section-sub">${products.length} ${products.length === 1 ? "opção" : "opções"} para aro ${builderAro}${step.hint ? ` · ${step.hint}` : ""}</div>
      <div class="product-grid">${cards || `<div class="empty-state"><strong>Nenhuma peça desta etapa para aro ${builderAro}</strong><p>Pode pular para a próxima.</p></div>`}</div>
      <div class="builder-nav">
        <button class="builder-nav-btn ghost" id="builderBackBtn" type="button" ${stepIdx === 0 ? "disabled" : ""}>← Voltar</button>
        <button class="builder-nav-btn primary" id="builderNextBtn" type="button">${isLast ? "Ver resumo →" : (stepDone(step) ? "Continuar →" : "Pular etapa →")}</button>
      </div>
    </div>
  `;

  // deixa a etapa atual visível na barra de etapas
  const tr = app.querySelector(".builder-tracker");
  const cur = tr.querySelector(".current");
  if (cur) tr.scrollLeft = Math.max(0, cur.offsetLeft - (tr.clientWidth - cur.offsetWidth) / 2);

  const rerender = (focusSel) => { saveBuilder(); renderBuilderStep(stepIdx); refocus(focusSel); };
  app.querySelectorAll(".variant-select").forEach(sel => {
    sel.addEventListener("change", () => {
      const p = products[Number(sel.dataset.pi)];
      const vs = builderVariants(p);
      builderSel[`${step.key}|${p.id}`] = Number(sel.value);
      // se só há uma opção escolhida deste produto, trocar o select troca a escolha (mantendo a quantidade)
      const bucket = builderChoices[step.key] || {};
      const mine = Object.entries(bucket).filter(([, e]) => e.item.id === p.id);
      if (mine.length === 1) {
        const [oldKey, e] = mine[0];
        const item = cartItem(p, vs[Number(sel.value)]);
        if (item.key !== oldKey) {
          delete bucket[oldKey];
          bucket[item.key] = bucket[item.key] ? { item, qty: bucket[item.key].qty + e.qty } : { item, qty: e.qty };
        }
      }
      rerender(`.variant-select[data-pi="${sel.dataset.pi}"]`);
    });
  });
  app.querySelectorAll(".other-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      // adiciona uma opção ainda não escolhida (a do select, se estiver livre)
      const p = products[Number(btn.dataset.pi)];
      const vs = builderVariants(p);
      const bucket = builderChoices[step.key] = builderChoices[step.key] || {};
      const cur = builderSelIdx(step.key, p, vs);
      const idx = !bucket[cartItem(p, vs[cur]).key] ? cur : vs.findIndex(v => !bucket[cartItem(p, v).key]);
      if (idx < 0) return;
      const item = cartItem(p, vs[idx]);
      bucket[item.key] = { item, qty: step.qty || 1 };
      builderSel[`${step.key}|${p.id}`] = idx;
      rerender(`.variant-select[data-pi="${btn.dataset.pi}"]`);
      toast(`<span>${esc(item.label)} adicionada — troque a opção no seletor se quiser</span>`);
    });
  });
  app.querySelectorAll(".choose-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = products[Number(btn.dataset.pi)];
      const vs = builderVariants(p);
      const si = builderSelIdx(step.key, p, vs);
      const item = cartItem(p, vs[si]);
      const bucket = builderChoices[step.key] = builderChoices[step.key] || {};
      if (bucket[item.key]) bucket[item.key].qty += step.qty || 1;
      else bucket[item.key] = { item, qty: step.qty || 1 };
      rerender(`[data-card="${btn.dataset.pi}"] [data-inc]`);
    });
  });
  const bump = (key, delta, pi) => {
    const bucket = builderChoices[step.key];
    bucket[key].qty += delta;
    const gone = bucket[key].qty <= 0;
    if (gone) delete bucket[key];
    rerender(gone ? `[data-card="${pi}"] .choose-btn` : `[data-${delta > 0 ? "inc" : "dec"}="${CSS.escape(key)}"]`);
  };
  app.querySelectorAll("[data-inc]").forEach(b => b.addEventListener("click", () => bump(b.dataset.inc, 1, b.closest("[data-card]").dataset.card)));
  app.querySelectorAll("[data-dec]").forEach(b => b.addEventListener("click", () => bump(b.dataset.dec, -1, b.closest("[data-card]").dataset.card)));
  document.getElementById("builderBackBtn").addEventListener("click", () => {
    if (stepIdx === 0) return;
    // se veio da etapa anterior, usa o "voltar" do navegador (não empilha etapas no histórico)
    if (cameFrom() === `#/personalize/${stepIdx}`) history.back(); else goBuilderStep(stepIdx - 1);
  });
  document.getElementById("builderNextBtn").addEventListener("click", () => {
    if (isLast) go("#/personalize/resumo"); else goBuilderStep(stepIdx + 1);
  });
}

function builderWaLink() {
  const lines = builderEntries().map(e => `• ${e.qty}x ${e.item.name}${e.item.sku ? ` (cód. ${e.item.sku})` : ""} — ${money(e.item.price * e.qty)}`);
  const total = builderTotal();
  return waLink(`Olá! Personalizei minha bike aro ${builderAro} no site e quero estas peças:\n\n${lines.join("\n")}\n\nTotal das peças: ${money(total)} (ou ${money(total * (1 - PIX_DISCOUNT))} no PIX)\n\nQuanto fica a instalação?`);
}

function renderBuilderSummary() {
  const entries = builderEntries();
  const total = builderTotal();
  const skipped = BUILDER_STEPS.filter(s => !stepDone(s)).map(s => s.label);
  const rows = BUILDER_STEPS.map((step, i) => stepDone(step) ? `
    <a class="summary-row" href="#/personalize/${i + 1}" aria-label="${step.label}: trocar peças">
      <div class="summary-label">${step.label}</div>
      <div class="summary-items">
        ${entries.filter(e => e.step.key === step.key).map(e => `
          <div class="summary-item">${e.item.img ? `<img src="${smallOf(e.item.img)}" alt="" loading="lazy">` : ""}<span>${e.qty > 1 ? `${e.qty}× ` : ""}${esc(e.item.name)}</span><strong>${money(e.item.price * e.qty)}</strong></div>`).join("")}
      </div>
      <span class="summary-edit" aria-hidden="true">Trocar ›</span>
    </a>` : "").join("");

  app.innerHTML = `
    <div class="builder-page">
      <nav class="breadcrumb" aria-label="Você está em"><a href="#/">Início</a> / <a href="#/personalize/1">Personalize sua Bike</a> / Resumo</nav>
      ${builderProgressHtml()}
      <h1 class="section-title">Suas peças para aro ${builderAro}</h1>
      ${entries.length ? `
        <div class="summary-list">${rows}</div>
        ${skipped.length ? `<p class="summary-skipped">Etapas sem peças: ${skipped.join(", ")}.</p>` : ""}
        <div class="summary-total">
          <div class="cart-total"><span>Total das peças</span><span>${money(total)}</span></div>
          <div class="cart-pix">ou <strong>${money(total * (1 - PIX_DISCOUNT))}</strong> no PIX · 3x sem juros no cartão</div>
          <p class="summary-note">A instalação é orçada à parte — é só perguntar na mensagem do WhatsApp.</p>
        </div>
        <div class="builder-nav summary-nav">
          <button class="builder-nav-btn ghost" id="editBuilderBtn" type="button">← Editar peças</button>
          <a class="checkout-btn" href="${builderWaLink()}" target="_blank" rel="noopener">Pedir no WhatsApp</a>
        </div>`
      : `<div class="empty-state"><strong>Você ainda não escolheu nenhuma peça</strong><p>Volte às etapas e toque em “Adicionar” nas peças que quer.</p><button class="builder-nav-btn primary" id="editBuilderBtn" type="button">Escolher peças</button><a class="builder-wa-help" href="${waLink("Olá! Quero trocar peças da minha bike e preciso de ajuda para escolher.")}" target="_blank" rel="noopener">Prefere ajuda? Fale no WhatsApp</a></div>`}
    </div>
  `;
  document.getElementById("editBuilderBtn").addEventListener("click", () => goBuilderStep(builderLastStep));
}

// ---------- Carrinho (gaveta) ----------
function waCheckoutLink() {
  const lines = Object.values(cart).map(e => `• ${e.qty}x ${e.item.name}${e.item.sku ? ` (cód. ${e.item.sku})` : ""} — ${money(e.item.price)} cada`);
  const total = cartTotal();
  return waLink(`Olá! Quero fazer um pedido pelo site:\n\n${lines.join("\n")}\n\nTotal: ${money(total)} (ou ${money(total * (1 - PIX_DISCOUNT))} no PIX)`);
}

function cartOpen() {
  return !!document.getElementById("cartOverlay");
}

function renderCartDrawer(force) {
  if (!force && !cartOpen()) return; // só openCart() cria a gaveta
  const entries = Object.entries(cart);
  const total = cartTotal();
  const rows = entries.map(([key, e]) => `
    <div class="cart-row">
      <div class="thumb">${e.item.img ? `<img src="${smallOf(e.item.img)}" alt="">` : `<img src="assets/brand/logo-120.webp" alt="">`}</div>
      <div class="details">
        <div class="name">${esc(e.item.name)}</div>
        <div class="price">${e.qty > 1 ? `${e.qty} × ${money(e.item.price)}` : (e.item.sku ? `Cód. ${esc(e.item.sku)}` : "")}${e.item.exact ? "" : " · foto ilustrativa"}</div>
        <div class="qty-control">
          <button type="button" data-action="dec" data-key="${esc(key)}" aria-label="${e.qty === 1 ? "Remover" : "Diminuir quantidade de"} ${esc(e.item.name)}">${e.qty === 1 ? "🗑" : "−"}</button>
          <span class="qty" aria-label="Quantidade">${e.qty}</span>
          <button type="button" data-action="inc" data-key="${esc(key)}" aria-label="Aumentar quantidade de ${esc(e.item.name)}">+</button>
        </div>
      </div>
      <div class="cart-row-right">
        <div class="price">${money(e.qty * e.item.price)}</div>
        ${e.qty > 1 ? `<button class="remove-link" type="button" data-action="remove" data-key="${esc(key)}" aria-label="Remover ${esc(e.item.name)}">remover</button>` : ""}
      </div>
    </div>
  `).join("");

  const wasOpen = cartOpen();
  cartOverlayRoot.innerHTML = `
    <div class="cart-overlay ${wasOpen ? "" : "animate"}" id="cartOverlay">
      <div class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
        <div class="cart-header">
          <h2 id="cartTitle">Seu carrinho</h2>
          <button id="closeCartBtn" type="button" aria-label="Fechar carrinho">&times;</button>
        </div>
        <div class="cart-items">
          ${entries.length ? rows : `
            <div class="cart-empty">
              <strong>Seu carrinho está vazio</strong>
              <p>Escolha uma bike ou as peças que precisa.</p>
              <div class="empty-links"><button type="button" data-go="#/bikes">Ver bicicletas</button><button type="button" data-go="#/pecas">Ver peças e acessórios</button></div>
            </div>`}
        </div>
        ${entries.length ? `
        <div class="cart-footer">
          <div class="cart-total"><span>Total</span><span>${money(total)}</span></div>
          <div class="cart-pix">ou <strong>${money(total * (1 - PIX_DISCOUNT))}</strong> no PIX · 3x sem juros no cartão</div>
          <a class="checkout-btn" href="${waCheckoutLink()}" target="_blank" rel="noopener">Finalizar pedido no WhatsApp</a>
        </div>` : ""}
      </div>
    </div>
  `;

  document.getElementById("cartOverlay").addEventListener("click", (e) => { if (e.target.id === "cartOverlay") closeCart(); });
  document.getElementById("closeCartBtn").addEventListener("click", () => closeCart());
  cartOverlayRoot.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      const action = btn.dataset.action;
      if (action === "inc") setQty(key, cart[key].qty + 1);
      else if (action === "dec" && cart[key].qty > 1) setQty(key, cart[key].qty - 1);
      else removeFromCart(key);
      const again = cartOverlayRoot.querySelector(`[data-action="${action}"][data-key="${CSS.escape(key)}"]`);
      (again || document.getElementById("closeCartBtn")).focus();
    });
  });
  cartOverlayRoot.querySelectorAll("[data-go]").forEach(btn => btn.addEventListener("click", () => closeCart(btn.dataset.go)));
}

let pendingGo = null;
function openCart() {
  hideToast();
  renderCartDrawer(true);
  document.documentElement.classList.add("no-scroll");
  document.getElementById("closeCartBtn").focus();
  try { if (!(history.state && history.state.cart)) history.pushState(Object.assign({}, history.state, { cart: true }), ""); } catch (e) {}
}
function closeCartDom() {
  if (!cartOpen()) return;
  cartOverlayRoot.innerHTML = "";
  document.documentElement.classList.remove("no-scroll");
  const t = document.getElementById("toast");
  if (t) t.style.bottom = "";
  syncPageToCart();
}
// Fechar o carrinho desfaz a entrada que ele criou no histórico (assim o "voltar" do celular também fecha)
function closeCart(thenGo) {
  if (!cartOpen()) return;
  if (history.state && history.state.cart) { pendingGo = thenGo || null; history.back(); }
  else { closeCartDom(); if (thenGo) go(thenGo); }
}
window.addEventListener("popstate", () => {
  const cartEntry = !!(history.state && history.state.cart);
  if (!cartOpen() && cartEntry && parseHash(location.hash).name === currentRoute.name) { openCart(); return; } // "avançar" para a entrada do carrinho
  if (cartOpen() && !cartEntry) {
    closeCartDom();
    document.getElementById("cartBtn").focus({ preventScroll: true });
    if (pendingGo) { const h = pendingGo; pendingGo = null; go(h); }
  }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && cartOpen()) closeCart(); });

// ---------- Cabeçalho: some ao rolar para baixo no celular, volta ao rolar para cima ----------
const siteHeader = document.querySelector(".site-header");
let lastY = window.scrollY, headerTick = false;
function showHeader() { siteHeader.classList.remove("is-hidden"); lastY = window.scrollY; }
window.addEventListener("scroll", () => {
  if (headerTick) return;
  headerTick = true;
  requestAnimationFrame(() => {
    headerTick = false;
    const y = window.scrollY;
    if (!mobileMQ.matches || cartOpen() || document.activeElement === searchInput) { siteHeader.classList.remove("is-hidden"); lastY = y; return; }
    if (Math.abs(y - lastY) < 8) return;
    siteHeader.classList.toggle("is-hidden", y > lastY && y > siteHeader.offsetHeight);
    lastY = y;
  });
}, { passive: true });

// ---------- Menus ----------
function thumbTag(src) {
  return `<img src="${src ? thumbOf(src) : "assets/brand/logo-120.webp"}" alt="" loading="lazy">`;
}
document.getElementById("navPecas").innerHTML = CATEGORIES.map(c => `<a href="#/categoria/${c.id}">${thumbTag(categoryCover(c.id))}${c.name}</a>`).join("")
  + `<a href="#/pecas" class="nav-mega-all">Ver todas as categorias ›</a>`;
const bikeThumb = (list) => thumbTag(list.map(b => bikePhoto(b, b.colors[defaultColorIdx(b)]).src).find(Boolean));
document.getElementById("navBikesPanel").innerHTML = `
  <a href="#/bikes/29">${bikeThumb(BIKES.filter(b => b.aro === 29))}Aro 29</a>
  <a href="#/bikes/outras">${bikeThumb(BIKES.filter(b => b.aro !== 29))}Aro 26, juvenis e infantis</a>
  <a href="#/bikes">${bikeThumb(BIKES)}Ver todas</a>
`;
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("navBuilder").addEventListener("click", (e) => { e.preventDefault(); startBuilder(); });

// ---------- Campo de busca ----------
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const searchClear = document.getElementById("searchClear");
function updateSearchClear() {
  searchClear.hidden = !searchInput.value;
}
let searchTimer;
function runSearch(value, fromSubmit) {
  const hash = `#/busca/${encodeURIComponent(value.trim())}`;
  if (currentRoute.name === "busca") {
    setHashQuiet(hash);
    currentRoute = parseHash(hash);
    renderSearch(value);
    if (fromSubmit) window.scrollTo(0, 0);
  } else go(hash);
}
searchInput.addEventListener("input", () => {
  updateSearchClear();
  clearTimeout(searchTimer);
  const val = searchInput.value;
  searchTimer = setTimeout(() => {
    if (!val.trim()) { if (currentRoute.name === "busca") go("#/"); return; }
    if (val.trim().length >= 2 || currentRoute.name === "busca") runSearch(val);
  }, 250);
});
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearTimeout(searchTimer);
  if (searchInput.value.trim()) { runSearch(searchInput.value, true); searchInput.blur(); }
});
searchClear.addEventListener("click", () => {
  searchInput.value = "";
  updateSearchClear();
  if (currentRoute.name === "busca") go("#/");
  searchInput.focus();
});

// no celular o botão "Personalize" vem primeiro também na ordem de leitura
function placeNavBuilder() {
  const b = document.getElementById("navBuilder"), m = document.querySelector(".navbar-main");
  if (mobileMQ.matches) m.before(b); else m.after(b);
}
if (mobileMQ.addEventListener) mobileMQ.addEventListener("change", placeNavBuilder);
placeNavBuilder();

if (!location.hash) { try { history.replaceState(history.state, "", "#/"); } catch (e) {} }
updateCartBadge();
updateFavBadge();
route(true);
