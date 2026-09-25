// Catálogo real da Jacaré Bike Store — planilha SITEE.xlsx enviada pela loja (30/07/2026).
// Produtos com cor/tamanho diferentes viram UM produto com "variants" (cada variante tem seu código).
// Variante sem "price" usa o preço do produto. "aro" (no produto ou na variante) filtra o "Personalize sua Bike". "img" é opcional: sem foto, o site mostra o placeholder.

const CATEGORIES = [
  { id: "capacetes", name: "Capacetes" },
  { id: "guidoes", name: "Guidões" },
  { id: "suportes", name: "Suportes de Guidão" },
  { id: "garfos", name: "Garfos & Suspensão" },
  { id: "pedais", name: "Pedais" },
  { id: "pedivelas", name: "Pedivelas" },
  { id: "cambios", name: "Câmbios & Alavancas" },
  { id: "freios", name: "Freios & Discos" },
  { id: "selins", name: "Selins" },
  { id: "aros", name: "Aros" },
  { id: "pneus", name: "Pneus" },
  { id: "manoplas", name: "Manoplas" },
  { id: "acessorios", name: "Acessórios" },
];

// Condição de pagamento das peças (planilha: "3X SEM JUROS" + "PIX 5%")
const PARTS_PAYMENT = "3x sem juros · 5% off no PIX";

const PRODUCTS = [
  // CAPACETES
  { id: "capacete-luna", name: "Capacete Feminino Absolute Luna", cat: "capacetes", price: 99.99, variantLabel: "Cor",
    variants: [{ label: "Branco/Verde", sku: "51739" }, { label: "Preto/Roxo", sku: "51740" }] },
  { id: "capacete-mia", name: "Capacete Feminino Absolute Mia", cat: "capacetes", price: 99.99, variantLabel: "Cor",
    variants: [{ label: "Branco/Verde", sku: "51731" }, { label: "Preto/Rosa", sku: "51732" }] },
  { id: "capacete-nero", name: "Capacete Absolute Nero", cat: "capacetes", price: 99.99, variantLabel: "Cor / Tamanho",
    variants: [
      { label: "Preto — M", sku: "44737" }, { label: "Preto — G", sku: "44730" },
      { label: "Vermelho/Branco — M", sku: "51725" }, { label: "Vermelho/Branco — G", sku: "51719" },
      { label: "Azul/Branco — M", sku: "51722" }, { label: "Azul/Branco — G", sku: "51728" },
    ] },
  { id: "capacete-prime-ex", name: "Capacete Absolute Prime EX", cat: "capacetes", price: 249.99, variantLabel: "Cor / Tamanho",
    variants: [
      { label: "Preto — M", sku: "52817" }, { label: "Preto — G", sku: "52818" },
      { label: "Azul — M", sku: "52821" }, { label: "Azul — G", sku: "52822" },
      { label: "Vermelho — M", sku: "52819" }, { label: "Vermelho — G", sku: "52820" },
      { label: "Azul Claro — M", sku: "52823" }, { label: "Azul Claro — G", sku: "52824" },
    ] },
  { id: "capacete-wild-flash", name: "Capacete Absolute Wild Flash (G)", cat: "capacetes", price: 99.99, variantLabel: "Cor",
    variants: [
      { label: "Preto", sku: "51744" }, { label: "Branco/Azul", sku: "51741" }, { label: "Branco/Prata", sku: "51743" },
      { label: "Preto/Vermelho", sku: "51745" }, { label: "Preto/Amarelo", sku: "51746" },
    ] },

  // GUIDÕES
  { id: "guidao-hb02-720", name: "Guidão Absolute HB02 Alumínio MTB 31.8 × 720mm", cat: "guidoes", price: 79.99, sku: "56801", color: "Prata" },
  { id: "guidao-hb02-780", name: "Guidão Absolute HB02 Alumínio MTB 31.8 × 780mm", cat: "guidoes", price: 129.99, sku: "56781", color: "Oil Slick" },
  { id: "guidao-prime-ex", name: "Guidão Absolute Prime EX Alumínio MTB 31.8 × 780mm", cat: "guidoes", price: 129.99, sku: "51193", color: "Preto" },
  { id: "guidao-voador", name: "Guidão Absolute Voador Aço MTB 31.8 × 680mm", cat: "guidoes", price: 69.99, sku: "56786", color: "Preto" },
  { id: "guidao-brutus-50", name: "Guidão Absolute Brutus 50 — 31.8 × 780mm", cat: "guidoes", price: 129.99, variantLabel: "Cor",
    variants: [
      { label: "Preto/Laranja", sku: "54817" }, { label: "Preto/Amarelo", sku: "54833" }, { label: "Preto/Rosa", sku: "54822" },
      { label: "Vermelho", sku: "54830" }, { label: "Roxo", sku: "54834" },
    ] },

  // SUPORTES DE GUIDÃO (mesa)
  { id: "suporte-hs175", name: "Suporte de Guidão Absolute HS175 Alumínio 31.8 × 35mm", cat: "suportes", price: 59.99, variantLabel: "Cor",
    variants: [{ label: "Preto", sku: "56783" }, { label: "Oil Slick", sku: "56782", price: 89.99 }] },
  { id: "suporte-brutus-3", name: "Suporte de Guidão Absolute Brutus 3 — 31.8 × 35mm", cat: "suportes", price: 99.99, variantLabel: "Cor",
    variants: [
      { label: "Preto", sku: "56866" }, { label: "Rosa", sku: "56867" }, { label: "Roxo", sku: "56868" },
      { label: "Amarelo", sku: "56862" }, { label: "Laranja", sku: "56864" }, { label: "Azul/Preto", sku: "56863" },
      { label: "Vermelho/Preto", sku: "56869" }, { label: "Preto/Rosa", sku: "57272", price: 129.99 },
    ] },

  // GARFOS E SUSPENSÃO
  { id: "garfo-nero-sport-rl", aro: 29, name: "Suspensão Absolute Nero Sport RL Aro 29 — 100mm, com trava", cat: "garfos", price: 499.99, sku: "56826" },
  { id: "garfo-nero-sport", aro: 29, name: "Suspensão Absolute Nero Sport Aro 29 — 100mm, com regulagem", cat: "garfos", price: 399.90, sku: "56825" },
  { id: "garfo-ahd-938sd", aro: 29, name: "Suspensão AHD 938SD Aro 29 — 100mm, com trava", cat: "garfos", price: 149.99, sku: "51415" },
  { id: "garfo-brutus-fr-pro", aro: 26, name: "Suspensão Brutus FR Pro Aro 26 — 150mm, com regulagem", cat: "garfos", price: 399.99, sku: "54116" },
  { id: "garfo-absolute-jr", aro: 24, name: "Suspensão Absolute JR Aro 24 — 80mm", cat: "garfos", price: 129.99, sku: "57451", color: "Preto" },
  { id: "garfo-brutus-rl-26", aro: 26, name: "Garfo Rígido Absolute Brutus RL Aro 26 — Aço", cat: "garfos", price: 129.99, sku: "55829" },
  { id: "garfo-brutus-rl-29", aro: 29, name: "Garfo Rígido Absolute Brutus RL Aro 29 — Aço", cat: "garfos", price: 129.99, sku: "55876", color: "Preto" },

  // PEDAIS
  { id: "pedal-brutus-flat", name: "Pedal Plataforma Absolute Brutus Flat — Alumínio, eixo Boron", cat: "pedais", price: 69.99, variantLabel: "Cor",
    variants: [
      { label: "Preto", sku: "51444" }, { label: "Roxo", sku: "55012" }, { label: "Rosa", sku: "55015" },
      { label: "Azul", sku: "55010" }, { label: "Camaleão", sku: "55016" }, { label: "Vermelho", sku: "55011" },
      { label: "Laranja", sku: "55014" }, { label: "Amarelo", sku: "55013" },
    ] },
  { id: "pedal-absolute-dual", name: "Pedal Absolute Dual — Encaixe + Plataforma MTB", cat: "pedais", price: 169.99, sku: "56839", color: "Preto" },
  { id: "pedal-wellgo-8239", name: "Pedal Wellgo WPD-823 — Encaixe MTB, Alumínio", cat: "pedais", price: 169.99, sku: "56749", color: "Preto" },

  // PEDIVELAS
  { id: "pedivela-nero-1x", name: "Pedivela Absolute Nero 1x — 170mm, 34D, Alumínio", cat: "pedivelas", price: 99.99, variantLabel: "Cor",
    variants: [{ label: "Preto", sku: "56894" }, { label: "Roxo", sku: "57057" }] },
  { id: "pedivela-nero-jr", name: "Pedivela Absolute Nero JR — Aço, 32D", cat: "pedivelas", price: 49.99, variantLabel: "Tamanho",
    variants: [{ label: "152mm (aro 24)", aro: 24, sku: "56896" }, { label: "127mm (aro 20)", aro: 20, sku: "56895" }] },
  { id: "pedivela-wild", name: "Pedivela Absolute Wild — Alumínio, 175mm, 34D", cat: "pedivelas", price: 189.99, sku: "56792", color: "Oil Slick" },
  { id: "pedivela-prime-d", name: "Pedivela Absolute Prime D — 165mm, 34D", cat: "pedivelas", price: 349.99, sku: "56680" },

  // CÂMBIOS E ALAVANCAS
  { id: "cambio-nero-12v", name: "Câmbio Traseiro Absolute Nero 12V — até 52D", cat: "cambios", price: 99.99, sku: "56842" },
  { id: "cambio-prime-12v", name: "Câmbio Traseiro Absolute Prime 12V — até 52D", cat: "cambios", price: 249.99, sku: "51272" },
  { id: "cambio-wild-12v", name: "Câmbio Traseiro Absolute Wild 12V — até 52D", cat: "cambios", price: 349.99, sku: "53169" },
  { id: "alavanca-nero-12v", name: "Alavanca de Câmbio Absolute Nero 12V", cat: "cambios", price: 69.99, sku: "56841", color: "Preto" },
  { id: "alavanca-wild-12v", name: "Alavanca de Câmbio Absolute Wild 12V", cat: "cambios", price: 199.99, sku: "53159" },
  { id: "alavanca-prime-12v", name: "Alavanca de Câmbio Absolute Prime 12V — Alumínio", cat: "cambios", price: 249.99, sku: "51307", color: "Cinza" },

  // FREIOS
  { id: "freio-wild-2", name: "Freio a Disco Hidráulico Absolute Wild 2 — 2 pistões, discos 160mm", cat: "freios", price: 199.99, sku: "56577" },
  { id: "freio-brutus-4p", name: "Freio a Disco Hidráulico Absolute Brutus — 4 pistões, discos 180mm", cat: "freios", price: 349.99, sku: "52451" },
  { id: "freio-nero-td01", name: "Freio a Disco Mecânico Absolute Nero TD-01 — discos 160mm", cat: "freios", price: 59.99, sku: "51880" },
  { id: "disco-oil-slick", name: "Disco de Freio Absolute 6 Furos — Oil Slick", cat: "freios", price: 34.90, variantLabel: "Tamanho",
    variants: [
      { label: "160mm", sku: "56951" }, { label: "180mm", sku: "56952", price: 39.99 }, { label: "203mm", sku: "56953", price: 49.99 },
    ] },

  // SELINS
  { id: "selim-brutus", name: "Selim Absolute Brutus — 243 × 163mm", cat: "selins", price: 69.99, variantLabel: "Cor",
    variants: [
      { label: "Preto", sku: "56723" }, { label: "Preto/Branco", sku: "56721" }, { label: "Preto/Vermelho", sku: "56726" },
      { label: "Preto/Azul", sku: "56720" }, { label: "Preto/Rosa", sku: "56724" }, { label: "Preto/Roxo", sku: "56725" },
      { label: "Preto/Amarelo", sku: "56719" },
    ] },
  { id: "selim-3256", name: "Selim Absolute 3256-1 Vazado", cat: "selins", price: 69.99, variantLabel: "Cor",
    variants: [{ label: "Preto/Vermelho", sku: "52700" }, { label: "Preto/Azul", sku: "52701" }] },
  { id: "selim-comfort-gel", name: "Selim Absolute Comfort Vazado com Gel", cat: "selins", price: 69.99, sku: "51386" },
  { id: "selim-velo-l4470", name: "Selim Velo L-4470", cat: "selins", price: 149.99, sku: "56679", color: "Preto/Verde" },
  { id: "selim-ddk-243", name: "Selim DDK-243 BMX / Freestyle", cat: "selins", price: 149.99, sku: "" },

  // AROS
  { id: "aro-vmaxx-sl", name: "Aro Vmaxx SL Disc — 36 furos", cat: "aros", price: 89.99, variantLabel: "Aro / Cor",
    variants: [
      { label: "26 — Preto", aro: 26, sku: "81950" }, { label: "29 — Preto", aro: 29, sku: "81952" }, { label: "26 — Amarelo Neon", aro: 26, sku: "85605" },
      { label: "26 — Azul", aro: 26, sku: "85606" }, { label: "26 — Vermelho", aro: 26, sku: "85610" }, { label: "26 — Branco", aro: 26, sku: "85607" },
      { label: "26 — Rosa Neon", aro: 26, sku: "85609" },
    ] },
  { id: "aro-slide-disc", name: "Aro Absolute Slide Disc — Alumínio, 36 furos", cat: "aros", price: 59.99, variantLabel: "Aro",
    variants: [{ label: "26", aro: 26, sku: "43379" }, { label: "29", aro: 29, sku: "43391" }] },
  { id: "aro-extreme-pro", aro: 29, name: "Aro Extreme Pro 29 — 32 furos, com ilhós", cat: "aros", price: 129.99, sku: "8777", color: "Preto" },

  // PNEUS
  { id: "pneu-kenda-k1008-26", aro: 26, name: "Pneu Kenda Flame K1008 26 × 2.125 — faixa colorida", cat: "pneus", price: 149.99, variantLabel: "Faixa",
    variants: [
      { label: "Preto", sku: "59068", price: 129.99 }, { label: "Rosa", sku: "59173" }, { label: "Roxo", sku: "59175" },
      { label: "Vermelho", sku: "59177" }, { label: "Azul", sku: "59174" },
    ] },
  { id: "pneu-maxxis-hookworm", name: "Pneu Maxxis Hookworm 2.50 Slick — Wheeling / Grau / Dirt", cat: "pneus", price: 399.99, variantLabel: "Aro",
    variants: [{ label: "26 × 2.50", aro: 26, sku: "" }, { label: "29 × 2.50", aro: 29, sku: "" }] },
  { id: "pneu-kenda-k1008a-29", aro: 29, name: "Pneu Kenda Flame K1008A 29 × 2.125", cat: "pneus", price: 99.99, sku: "59355", color: "Preto" },
  { id: "pneu-kenda-k1256-29", aro: 29, name: "Pneu Kenda Regio K1256 29 × 2.2", cat: "pneus", price: 129.99, sku: "59943", color: "Preto" },
  { id: "pneu-kenda-k1153-29", aro: 29, name: "Pneu Kenda K1153 MTB 29 × 2.10 — faixa marrom", cat: "pneus", price: 99.99, sku: "59936" },
  { id: "pneu-levorin-eruption-29", aro: 29, name: "Pneu Levorin Eruption 29 × 2.30", cat: "pneus", price: 99.99, sku: "3072", color: "Preto" },

  // MANOPLAS
  { id: "manopla-bmx3", name: "Manopla Absolute BMX3 — Borracha, 160mm, com tampa", cat: "manoplas", price: 25.00, variantLabel: "Cor",
    variants: [
      { label: "Preto", sku: "55543" }, { label: "Azul", sku: "55547" }, { label: "Vermelho", sku: "55559" },
      { label: "Rosa", sku: "55546" }, { label: "Roxo", sku: "55555" }, { label: "Branco", sku: "55573" },
      { label: "Laranja", sku: "55561" }, { label: "Amarelo", sku: "55560" },
    ] },
  { id: "manopla-hl-g247", name: "Manopla Absolute HL-G247 — com trava de alumínio, 130mm", cat: "manoplas", price: 39.99, variantLabel: "Cor",
    variants: [{ label: "Preto", sku: "51587", price: 49.99 }, { label: "Vermelho", sku: "51588" }, { label: "Azul", sku: "51589" }] },

  // ACESSÓRIOS
  { id: "cesta-quick-release", name: "Cesta Absolute Quick Release — Aro 26/29", cat: "acessorios", price: 149.99, sku: "56791", color: "Preto" },
];

// Tamanhos de quadro oferecidos nas aro 29 (pedido da loja no WhatsApp, 30/07)
const FRAME_SIZES_29 = ["15", "17", "19", "21"];

// Bicicletas: price = à vista; installments = texto do parcelado da planilha.
// colors vazio = loja ainda vai confirmar as cores (o site mostra "cores sob consulta"). versions = opções extras (ex.: Single/7V).
const BIKES = [
  { id: "oggi-bw-74", brand: "Oggi", name: "Oggi Big Wheel 7.4 SLX 12V 2026", aro: 29, price: 9810.00, installments: "18x de R$ 605,55",
    colors: ["Grafite/Preto", "Preto/Cinza"], specs: ["Aro 29", "Grupo Shimano SLX 12 velocidades", "Modelo 2026"] },
  { id: "oggi-bw-72", brand: "Oggi", name: "Oggi Big Wheel 7.2 Deore 12V 2026", aro: 29, price: 5849.10, installments: "12x de R$ 541,66",
    colors: ["Grafite/Amarelo/Cinza"], specs: ["Aro 29", "Grupo Shimano Deore 12 velocidades", "Modelo 2026"] },
  { id: "oggi-bw-71", brand: "Oggi", name: "Oggi Big Wheel 7.1 CUES 10V 2026", aro: 29, price: 3999.99, installments: "12x de R$ 374,99",
    colors: ["Verde/Vermelho/Cinza"], specs: ["Aro 29", "Grupo Shimano CUES 10 velocidades", "Modelo 2026"] },
  { id: "oggi-hacker-hds", brand: "Oggi", name: "Oggi Hacker HDS Essa 8V 2026", aro: 29, price: 2789.10, installments: "12x de R$ 258,25",
    colors: ["Verde/Branco/Laranja", "Vermelho/Branco/Azul"], specs: ["Aro 29", "Grupo Shimano Essa 8 velocidades", "Modelo 2026"] },
  { id: "absolute-wild-boost", brand: "Absolute", name: "Absolute Wild Boost 12V Prime", aro: 29, price: 3499.99, installments: "12x de R$ 324,91",
    colors: ["Vermelho", "Cinza"], specs: ["Aro 29", "12 velocidades — grupo Absolute Prime", "Padrão Boost"] },
  { id: "absolute-nero-6-prime", brand: "Absolute", name: "Absolute Nero 6 12V Prime", aro: 29, price: 2799.99, installments: "12x de R$ 249,99",
    colors: [], specs: ["Aro 29", "12 velocidades — grupo Absolute Prime"] },
  { id: "absolute-nero-5", brand: "Absolute", name: "Absolute Nero 5 12V", aro: 29, price: 1799.99, installments: "12x de R$ 166,66",
    colors: [], specs: ["Aro 29", "12 velocidades"] },
  { id: "absolute-nero-6-cassete", brand: "Absolute", name: "Absolute Nero 6 Cubo Cassete", aro: 29, price: 999.99, installments: "12x de R$ 99,99",
    colors: [], specs: ["Aro 29", "Cubo cassete"] },
  { id: "gti-chroma", brand: "GTI", name: "GTI Chroma 21V Cubo Cassete", aro: 29, price: 899.99, installments: "12x de R$ 95,00",
    colors: ["Azul", "Vermelho", "Verde", "Amarelo", "Roxo"], specs: ["Aro 29", "21 velocidades", "Cubo cassete"] },
  { id: "absolute-brutus", brand: "Absolute", name: "Absolute Brutus Personalizada — Single ou 7V", aro: 26, price: 2999.99, installments: "12x sem juros",
    colors: [], versions: ["Single speed", "7 velocidades"], specs: ["Aro 26", "Single speed ou 7 velocidades", "Montagem personalizada — cores à escolha"] },
  { id: "viking-tuff25", brand: "Viking", name: "Viking Tuff 25 — 21V", aro: 26, price: 1499.99, installments: "10x sem juros",
    colors: ["Rosa/Azul", "Rosa/Verde", "Cinza/Preto", "Azul Metálico", "Prata/Azul/Verde", "Preto/Azul", "Preto/Rosa", "Roxo/Amarelo/Verde"],
    specs: ["Aro 26", "21 velocidades"] },
  { id: "viking-tuff44", brand: "Viking", name: "Viking Tuff 44 — 21V", aro: 26, price: 1499.99, installments: "10x sem juros",
    colors: ["Azul/Roxo", "Rosa/Preto", "Verde/Roxo", "Roxo/Branco", "Verde/Preto", "Preto/Branco", "Amarelo/Verde", "Azul/Amarelo", "Azul/Laranja", "Branco/Verde", "Roxo/Amarelo", "Vermelho/Azul"],
    specs: ["Aro 26", "21 velocidades"] },
  { id: "absolute-hera", brand: "Absolute", name: "Absolute Hera", aro: 26, price: 999.99, installments: "6x sem juros",
    colors: ["Preto/Rosa", "Branco/Rosa", "Azul/Rosa"], specs: ["Aro 26"] },
  { id: "absolute-nero-jr-24", brand: "Absolute", name: "Absolute Nero JR 7V — Aro 24", aro: 24, price: 1299.99, installments: "12x sem juros",
    colors: ["Vermelho", "Azul"], specs: ["Aro 24 — juvenil", "7 velocidades"] },
  { id: "absolute-nero-jr-20", brand: "Absolute", name: "Absolute Nero JR 7V — Aro 20", aro: 20, price: 1299.99, installments: "12x sem juros",
    colors: ["Roxo", "Verde"], specs: ["Aro 20 — infantil", "7 velocidades"] },
  { id: "nathor-unicorn-16", brand: "Nathor", name: "Nathor Unicorn — Aro 16", aro: 16, price: 649.99, installments: "12x sem juros",
    colors: ["Azul/Roxo/Rosa"], specs: ["Aro 16 — infantil"] },
  { id: "nathor-hot-wheels-12", brand: "Nathor", name: "Nathor Hot Wheels — Aro 12", aro: 12, price: 299.99, installments: "12x sem juros",
    colors: ["Preto/Laranja/Azul"], specs: ["Aro 12 — infantil", "Licenciada Hot Wheels"] },
];

