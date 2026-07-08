// Dados reais extraídos do catálogo PDF (CATALOGO DE ABRIL).
const CATEGORIES = [
  { id: "bombas", name: "Bombas" },
  { id: "pneus", name: "Pneus, Câmaras & Componentes" },
  { id: "rodas", name: "Rodas & Aros" },
  { id: "selins", name: "Selins" },
  { id: "capacetes", name: "Capacetes" },
  { id: "acessorios", name: "Acessórios" },
  { id: "cambios", name: "Câmbios & Alavancas" },
  { id: "freios", name: "Freios, Pastilhas & Componentes" },
  { id: "guidoes", name: "Guidões & Suportes" },
  { id: "quadros", name: "Quadros" },
];

const COMING_SOON_CATEGORIES = [
  "Cabos & Conduítes",
  "Canotes & Abraçadeiras",
  "Correntes",
  "Cubos, Eixos & Componentes",
  "Ferramentas",
  "Gancheiras",
  "Maçanetas e Manoplas",
  "Movimentos Central",
  "Movimentos Direção",
  "Pedais & Componentes",
  "Pedivelas & Engrenagens",
  "Raios",
  "Roda Livre & Cassetes",
  "Suspensão",
  "Suplementos Esportivo",
  "Skydroll (Graxa, Selante, Cera)",
  "Squeeze & Suportes",
];

const PRODUCTS = [
  // BOMBAS
  { sku: "H-1675", name: "Bomba Creeper", price: 39.9, cat: "bombas", img: "assets/products/p6_00.jpg" },
  { sku: "H-1853", name: "Bomba Slim-Pocket", price: 29.9, cat: "bombas", img: "assets/products/p6_01.jpg" },
  { sku: "S 0180", name: "Bomba Mini Alum Smart 150 PSI Pro", price: 49.9, cat: "bombas", img: "assets/products/p6_02.jpg" },
  { sku: "H-1852", name: "Bomba New Slim", price: 44.9, cat: "bombas", img: "assets/products/p6_03.jpg" },
  { sku: "S0111", name: "Bomba Two Air", price: 24.9, cat: "bombas", img: "assets/products/p6_04.jpg" },
  { sku: "89006", name: "Bomba Mini Pump 25cm Collor", price: 10.9, cat: "bombas", img: "assets/products/p6_05.jpg" },
  { sku: "S0076", name: "Bomba de Ar Oficina Alu c/Manômetro 180PSI Premium", price: 89.9, cat: "bombas", img: "assets/products/p6_06.jpg" },
  { sku: "S0073", name: "Bomba de Oficina 160 PSI c/Manômetro", price: 79.9, cat: "bombas", img: "assets/products/p6_07.jpg" },
  { sku: "S0075", name: "Bomba de Oficina", price: 69.9, cat: "bombas", img: "assets/products/p6_08.jpg" },
  { sku: "6561", name: "Mangueira Flexível p/ Bomba 700mm Bico Duplo", price: 6.78, cat: "bombas", img: "assets/products/p6_09.jpg" },

  // PNEUS, CÂMARAS & COMPONENTES
  { sku: "9477", name: "Pneu 16 X 2.00 Thunder Preto (Paco)", price: 27.79, cat: "pneus", img: "assets/products/p63_00.jpg" },
  { sku: "054960", name: "Pneu 16X1.75 Top Cross Pto (Pirelli Imp)", price: 29.9, cat: "pneus", img: "assets/products/p63_01.jpg" },
  { sku: "054961", name: "Pneu 20X1.75 Top Cross (Pirelli)", price: 34.9, cat: "pneus", img: "assets/products/p63_02.jpg" },
  { sku: "9479", name: "Pneu 20 X 1.95 Cruise Preto (Paco)", price: 34.9, cat: "pneus", img: "assets/products/p63_03.jpg" },
  { sku: "054958", name: "Pneu 20X2X13/4 Carga 102 (Pirelli)", price: 44.9, cat: "pneus", img: "assets/products/p63_04.jpg" },
  { sku: "9480", name: "Pneu 20 X 2.00 Thunder Preto (Paco)", price: 30.9, cat: "pneus", img: "assets/products/p63_05.jpg" },
  { sku: "9894", name: "Pneu 20X2.25 Rider Preto", price: 39.89, cat: "pneus", img: "assets/products/p63_06.jpg" },
  { sku: "055288", name: "Pneu 20X1.75 BMX (Chaoyang)", price: 29.99, cat: "pneus", img: "assets/products/p63_07.jpg" },
  { sku: "28526", name: "Pneu 20*4.0 V8 Fat Street Go (Arisun)", price: 139.0, cat: "pneus", img: "assets/products/p63_08.jpg" },
  { sku: "28529", name: "Pneu 24 X 2.125 Flame (Arisun)", price: 46.9, cat: "pneus", img: "assets/products/p63_09.jpg" },
  { sku: "056026", name: "Pneu 26X1.3/8 Touring - Ceci, Brisa, Poti (Pirelli)", price: 45.9, cat: "pneus", img: "assets/products/p63_10.jpg" },
  { sku: "9538", name: "Pneu 24X1.75 Wind Preto (Paco)", price: 34.9, cat: "pneus", img: "assets/products/p63_11.jpg" },
  { sku: "10200", name: "Pneu 26 X 1.95 Excess EX (Levorim)", price: 38.9, cat: "pneus", img: "assets/products/p64_00.jpg" },
  { sku: "055292", name: "Pneu 26X1.95 (Chaoyang)", price: 38.9, cat: "pneus", img: "assets/products/p64_01.jpg" },
  { sku: "28530", name: "Pneu 26 X 2.125 Fuego (Arisun)", price: 49.9, cat: "pneus", img: "assets/products/p64_02.jpg" },
  { sku: "9900", name: "Pneu 26X2.35 Off Road MTB (Paco)", price: 46.9, cat: "pneus", img: "assets/products/p64_03.jpg" },
  { sku: "9481", name: "Pneu 26 X 1.50 Slick Preto SRI-39", price: 32.9, cat: "pneus", img: "assets/products/p64_04.jpg" },
  { sku: "9482", name: "Pneu 26 X 1.90 Slick Preto c/ Faixa Branca (Paco)", price: 39.9, cat: "pneus", img: "assets/products/p64_05.jpg" },
  { sku: "10143", name: "Pneu 26X1.1/2X2 Passeio (Paco)", price: 36.9, cat: "pneus", img: "assets/products/p64_06.jpg" },
  { sku: "054956", name: "Pneu 26X1.1/2X2 Manga Turbo (Pirelli)", price: 39.9, cat: "pneus", img: "assets/products/p64_07.jpg" },
  { sku: "054957", name: "Pneu 26X1.1/2X2 Primor (Pirelli Imp)", price: 44.9, cat: "pneus", img: "assets/products/p64_08.jpg" },
  { sku: "9483", name: "Pneu 26 X 2.00 MTB Thunder Preto (Paco)", price: 34.9, cat: "pneus", img: "assets/products/p64_09.jpg" },
  { sku: "11024", name: "Pneu 26X2.125 Fire Flame Importado (Paco)", price: 59.9, cat: "pneus", img: "assets/products/p64_10.jpg" },
  { sku: "060628", name: "Pneu 26X1.1/2X2 Rio (Chaoyang)", price: 39.9, cat: "pneus", img: "assets/products/p64_11.jpg" },

  // RODAS & AROS
  { sku: "006", name: "Aro 16/16F Preto S/ADS (Vzan)", price: 14.9, cat: "rodas", img: "assets/products/p84_00.jpg" },
  { sku: "122", name: "Aro Aero BMX 20 36F S/Usinagem", price: 21.9, cat: "rodas", img: "assets/products/p84_01.jpg" },
  { sku: "000058", name: "Aro 20 Aero Escape 36F Preto V-Brake Vzan", price: 29.9, cat: "rodas", img: "assets/products/p84_02.jpg" },
  { sku: "000017", name: "Aro 20/36F Natural Polido Vzan", price: 19.9, cat: "rodas", img: "assets/products/p84_03.jpg" },
  { sku: "000097", name: "Aro 24 Aero Escape 36F Preto V-Brake Vzan", price: 33.9, cat: "rodas", img: "assets/products/p84_04.jpg" },
  { sku: "0198", name: "Aro 26X1.1/2 (barra circular) 36F Vzan Escape Preto V-Brake c/ADS", price: 34.9, cat: "rodas", img: "assets/products/p84_05.jpg" },
  { sku: "0145", name: "Aro Escape 26x1.95 36F Preto V-Brake", price: 32.9, cat: "rodas", img: "assets/products/p84_06.jpg" },
  { sku: "0288", name: "Aro 26X1.1/2 36F VMAXX Preto V-Brake c/ADS Preto", price: 59.9, cat: "rodas", img: "assets/products/p84_07.jpg" },
  { sku: "0960", name: "Aro VMAXX 26/36F Preto Fosco Disc Preto", price: 68.9, cat: "rodas", img: "assets/products/p84_08.jpg" },
  { sku: "0718", name: "Aro 26X1.1/2 VMAXX Preto P69 Disc c/ADS Preto", price: 59.9, cat: "rodas", img: "assets/products/p84_09.jpg" },
  { sku: "000804", name: "Aro Ace 29/36F Preto Disc Vzan", price: 34.9, cat: "rodas", img: "assets/products/p84_10.jpg" },
  { sku: "000464", name: "Aro 29 Extreme Pro 32F Preto Fosco Disc c/Ilhós Vzan", price: 59.9, cat: "rodas", img: "assets/products/p84_11.jpg" },
  { sku: "T100", name: "Aro 29 Aero Double Disc Preto 36F", price: 29.9, cat: "rodas", img: "assets/products/p85_00.jpg" },
  { sku: "000471", name: "Aro 29 Extreme Pro 36F Preto Disc c/Ilhós Vzan", price: 59.9, cat: "rodas", img: "assets/products/p85_01.jpg" },
  { sku: "0020", name: "Roda Aro 16 Comum Alumínio (Par)", price: 79.9, cat: "rodas", img: "assets/products/p85_02.jpg" },
  { sku: "000556", name: "Roda Vzan Vnine 29/32F Disc Rosca c/Rol", price: 219.0, cat: "rodas", img: "assets/products/p85_03.jpg" },
  { sku: "0024", name: "Roda Aro 24 Comum Alum (Par)", price: 79.9, cat: "rodas", img: "assets/products/p85_04.jpg" },
  { sku: "001077", name: "Roda Vzan Extreme Pro 29/32F Preto Fosco Disc c/Rol Cassete 7/12 Vel HG", price: 279.0, cat: "rodas", img: "assets/products/p85_05.jpg" },

  // SELINS
  { sku: "S9122", name: "Selim Infantil Masc c/Alça Aier", price: 19.9, cat: "selins", img: "assets/products/p87_00.jpg" },
  { sku: "S9122", name: "Selim Infantil Masc c/Alça Aier (cor 2)", price: 19.9, cat: "selins", img: "assets/products/p87_01.jpg" },
  { sku: "S9123", name: "Selim Infantil Fem Lady Soft Premium c/Cast", price: 22.9, cat: "selins", img: "assets/products/p87_02.jpg" },
  { sku: "0158", name: "Selim Infantil Girls", price: 19.9, cat: "selins", img: "assets/products/p87_03.jpg" },
  { sku: "0158", name: "Selim Infantil Girls (cor 2)", price: 19.9, cat: "selins", img: "assets/products/p87_04.jpg" },
  { sku: "0158", name: "Selim Infantil Girls (cor 3)", price: 19.9, cat: "selins", img: "assets/products/p87_05.jpg" },
  { sku: "SKF304URS", name: "Selim Junior KVS Urso Colorir", price: 21.9, cat: "selins", img: "assets/products/p87_06.jpg" },
  { sku: "KF304CAP", name: "Selim Junior KVS Capivara Colorir", price: 21.9, cat: "selins", img: "assets/products/p87_07.jpg" },
  { sku: "KF304CAO", name: "Selim Junior KVS Cachorro Colorir", price: 21.9, cat: "selins", img: "assets/products/p87_08.jpg" },
  { sku: "KF304GAT", name: "Selim Junior KVS Gato Colorir", price: 21.9, cat: "selins", img: "assets/products/p87_09.jpg" },
  { sku: "10011", name: "Selim Mirim c/Canote Fucsia Love", price: 18.9, cat: "selins", img: "assets/products/p87_10.jpg" },
  { sku: "10113", name: "Selim Mirim c/Canote Verde/B10", price: 18.9, cat: "selins", img: "assets/products/p87_11.jpg" },
  { sku: "10012", name: "Selim Mirim c/Canote Vermelho/Aranha", price: 18.9, cat: "selins", img: "assets/products/p88_00.jpg" },
  { sku: "S9118", name: "Selim BMX Premium Costurado c/Castanha", price: 26.9, cat: "selins", img: "assets/products/p88_01.jpg" },
  { sku: "S9117", name: "Selim Infantil Preto Soft Premium c/Castanha", price: 16.9, cat: "selins", img: "assets/products/p88_02.jpg" },
  { sku: "11703", name: "Selim BMX Dirt c/Castanha Imp", price: 19.9, cat: "selins", img: "assets/products/p88_03.jpg" },
  { sku: "S9119", name: "Selim BMX Basic c/Trava e Castanha", price: 15.9, cat: "selins", img: "assets/products/p88_04.jpg" },
  { sku: "S9121", name: "Selim c/Mola Confort - Ceci, Brisa/Poti Rosa", price: 24.9, cat: "selins", img: "assets/products/p88_05.jpg" },
  { sku: "10737", name: "Selim MTB Costurado c/Cavidade Preto/Rosa", price: 22.9, cat: "selins", img: "assets/products/p88_06.jpg" },
  { sku: "0215", name: "Selim MTB Sport Preto (Selle Royal)", price: 19.9, cat: "selins", img: "assets/products/p88_07.jpg" },
  { sku: "1831", name: "Selim MTB/Speed Flexível", price: 17.9, cat: "selins", img: "assets/products/p88_08.jpg" },
  { sku: "10317", name: "Selim Vovô Duas Molas Preto", price: 32.9, cat: "selins", img: "assets/products/p88_09.jpg" },
  { sku: "9886", name: "Selim Comfort Gel Tech c/Refletor GTA", price: 39.9, cat: "selins", img: "assets/products/p88_10.jpg" },
  { sku: "10561", name: "Selim Sueco 2 Molas Imp", price: 15.99, cat: "selins", img: "assets/products/p88_11.jpg" },

  // CAPACETES
  { sku: "S9025", name: "Capacete Mirim Inmold c/Reg 46/52 To Look Rosa", price: 59.9, cat: "capacetes", img: "assets/products/p98_00.jpg" },
  { sku: "S9025", name: "Capacete Mirim Inmold c/Reg 46/52 To Look Azul", price: 59.9, cat: "capacetes", img: "assets/products/p98_01.jpg" },
  { sku: "S9025", name: "Capacete Mirim Inmold c/Reg 46/52 To Look Verde", price: 59.9, cat: "capacetes", img: "assets/products/p98_02.jpg" },
  { sku: "S9025", name: "Capacete Mirim Inmold c/Reg 46/52 To Look Azul (cor 2)", price: 59.9, cat: "capacetes", img: "assets/products/p98_03.jpg" },
  { sku: "9830", name: "Capacete Infantil Rosa 48-54 Candy", price: 31.89, cat: "capacetes", img: "assets/products/p98_04.jpg" },
  { sku: "9831", name: "Capacete Infantil 52-56 8F Aurora", price: 29.9, cat: "capacetes", img: "assets/products/p98_05.jpg" },
  { sku: "11757", name: "Capacete Infantil 52-56 8F Fest", price: 29.9, cat: "capacetes", img: "assets/products/p98_06.jpg" },
  { sku: "9828", name: "Capacete Infantil 52-56 8F Rapid", price: 29.9, cat: "capacetes", img: "assets/products/p98_07.jpg" },
  { sku: "9829", name: "Capacete Infantil 50-54 8F Energy", price: 32.9, cat: "capacetes", img: "assets/products/p98_08.jpg" },
  { sku: "S9026", name: "Capacete Juvenil Inmold Bike Skate Roller c/Reg 56/48 Rider Ciano", price: 69.9, cat: "capacetes", img: "assets/products/p98_09.jpg" },
  { sku: "S9026", name: "Capacete Juvenil Inmold Bike Skate Roller c/Reg 56/48 Rider Ciano (cor 2)", price: 69.9, cat: "capacetes", img: "assets/products/p98_10.jpg" },
  { sku: "S9026", name: "Capacete Juvenil Inmold Bike Skate Roller c/Reg 56/48 Rider Branco", price: 69.9, cat: "capacetes", img: "assets/products/p98_11.jpg" },
  { sku: "S9026", name: "Capacete Juvenil Inmold Bike Skate Roller c/Reg 56/48 Rider Azul", price: 69.9, cat: "capacetes", img: "assets/products/p99_00.jpg" },
  { sku: "S9026", name: "Capacete Juvenil Inmold Bike Skate Roller c/Reg 56/48 Rider Rosa", price: 69.9, cat: "capacetes", img: "assets/products/p99_01.jpg" },
  { sku: "H-1153", name: "Capacete Inmold Top", price: 79.9, cat: "capacetes", img: "assets/products/p99_02.jpg" },
  { sku: "S9024", name: "Capacete MTB/Road Inmold c/Tela Cinta Refl Fosco Degradê", price: 99.9, cat: "capacetes", img: "assets/products/p99_03.jpg" },
  { sku: "H-1153", name: "Capacete Inmold Top (cor 2)", price: 79.9, cat: "capacetes", img: "assets/products/p99_04.jpg" },
  { sku: "H-1153", name: "Capacete Inmold Top (cor 3)", price: 79.9, cat: "capacetes", img: "assets/products/p99_05.jpg" },
  { sku: "11972", name: "Capacete Urban Elétric Bike/Scooter c/Sinalizador e Reg 58-62", price: 139.9, cat: "capacetes", img: "assets/products/p99_06.jpg" },

  // ACESSÓRIOS
  { sku: "S10001", name: "Luva para Ciclismo 1/2 Dedo Gel Soft Premium (Aoito)", price: 49.9, cat: "acessorios", img: "assets/products/p107_00.jpg" },
  { sku: "S10003", name: "Luva Mirim/Infanto Sport Tam Único 12x8cm", price: 16.8, cat: "acessorios", img: "assets/products/p107_01.jpg" },
  { sku: "S0129", name: "Bagageiro Bolsa 15 Litros Audax Long Distance", price: 99.0, cat: "acessorios", img: "assets/products/p107_02.jpg" },
  { sku: "S0116", name: "Capa para Cobrir Bicicletas Forrada Impermeável Aro 24/26/29", price: 29.9, cat: "acessorios", img: "assets/products/p107_03.jpg" },
  { sku: "10617", name: "Cesta Aro 26 Nylon Preto c/Haste 34x22x25cm", price: 19.9, cat: "acessorios", img: "assets/products/p107_04.jpg" },
  { sku: "MX01", name: "Bagageiro Rabetão Tubão Articulado Color", price: 36.9, cat: "acessorios", img: "assets/products/p107_05.jpg" },
  { sku: "H-1666", name: "Bagageiro Traseiro Alum Regulável/Articulado MTB", price: 99.0, cat: "acessorios", img: "assets/products/p107_06.jpg" },
  { sku: "H-1665", name: "Bagageiro Frontal Alum Fixação Pino V-Brake", price: 49.9, cat: "acessorios", img: "assets/products/p107_07.jpg" },
  { sku: "AMR 659/PT", name: "Paralama 16 Mirim - Preto", price: 5.9, cat: "acessorios", img: "assets/products/p107_08.jpg" },
  { sku: "R-1677", name: "Paralama de Selim, Fit A-8", price: 4.9, cat: "acessorios", img: "assets/products/p107_09.jpg" },
  { sku: "H-1737", name: "Óculos Ciclismo Sport 5 Lentes", price: 65.0, cat: "acessorios", img: "assets/products/p117_00.jpg" },
  { sku: "R-1747", name: "Óculos de Ciclismo A8 (5 Lentes e Acessórios)", price: 74.9, cat: "acessorios", img: "assets/products/p117_01.jpg" },
  { sku: "11351", name: "Óculos de Ciclismo Large Preto c/Cavidades Anti-Embaço", price: 32.9, cat: "acessorios", img: "assets/products/p117_02.jpg" },
  { sku: "H-1736", name: "Óculos Ciclismo Sport Basic", price: 22.9, cat: "acessorios", img: "assets/products/p117_03.jpg" },
  { sku: "11359", name: "Óculos de Ciclismo Preto c/Ventilação Anti-Embaço", price: 39.9, cat: "acessorios", img: "assets/products/p117_04.jpg" },

  // CÂMBIOS & ALAVANCAS
  { sku: "SL-M315", name: "ALAVANCA CAMBIO ALTUS SL-M315 3X8 V SHIMANO", price: 159.9, cat: "cambios", img: "assets/products/p11_00.jpg" },
  { sku: "9443", name: "ALAVANCA DE CAMBIO EZ FIRE 3X7 C/CABO (SEM MAÇANETA) SUN RUN", price: 39.9, cat: "cambios", img: "assets/products/p11_01.jpg" },
  { sku: "9444", name: "ALAVANCA CAMBIO V FIRE 3X8 C/CABO (V24) SUN RUN", price: 39.9, cat: "cambios", img: "assets/products/p11_02.jpg" },
  { sku: "M2010", name: "ALAVANCA CAMBIO SHIMANO ALTUS SL-M2010 2x9 SHIMANO", price: 126.68, cat: "cambios", img: "assets/products/p11_03.jpg" },
  { sku: "11432", name: "ALAVANCA DE CAMBIO V FIRE 3X9 S/MAC", price: 49.9, cat: "cambios", img: "assets/products/p11_04.jpg" },
  { sku: "7174", name: "ALAVANCA DE CAMBIO C/CABOS 6V AL S. SHINE", price: 9.9, cat: "cambios", img: "assets/products/p11_05.jpg" },
  { sku: "8393", name: "ALAVANCA DE CAMBIO MTB 6V AL POL POWER", price: 7.99, cat: "cambios", img: "assets/products/p11_06.jpg" },
  { sku: "11909", name: "ALAVANCA DE CAMBIO PAR 18V NYLON C/CABOS:BLACK", price: 7.99, cat: "cambios", img: "assets/products/p11_07.jpg" },
  { sku: "9995", name: "ALAVANCA DE CAMBIO GRIP 3X7V NYLON N/INDEX INVIKTUS", price: 9.9, cat: "cambios", img: "assets/products/p11_08.jpg" },
  { sku: "7176", name: "ALAVANCA DE CAMBIO GRIP INDEX 3X7V NYLON S.SHINE", price: 11.49, cat: "cambios", img: "assets/products/p11_09.jpg" },
  { sku: "ST-EF500", name: "ALAVANCA CAMBIO/FREIO ST-EF500 EZ FIRE P/VBRAKE 3X8 V SHIMANO", price: 149.9, cat: "cambios", img: "assets/products/p11_10.jpg" },
  { sku: "ST-EF41", name: "ALAVANCA CAMBIO/FREIO TOURNEY ST-EF41 7X3 V Preto SHIMANO", price: 109.0, cat: "cambios", img: "assets/products/p11_11.jpg" },
  { sku: "11853", name: "ALAVANCA DE CAMBIO RAPID FIRE 3X7 C/CABOS", price: 29.88, cat: "cambios", img: "assets/products/p12_00.jpg" },
  { sku: "10278", name: "ALAVANCA DE CAMBIO RAPID FIRE C/MAC 3X7 SUN RUN", price: 34.9, cat: "cambios", img: "assets/products/p12_01.jpg" },
  { sku: "10279", name: "ALAVANCA DE CAMBIO RAPID FIRE 3X8 C/CABOS SUN RUN", price: 34.9, cat: "cambios", img: "assets/products/p12_02.jpg" },
  { sku: "11201", name: "KIT CAMBIO 12 VELOCIDADES ALAV+CAMBIO GTA", price: 129.9, cat: "cambios", img: "assets/products/p12_03.jpg" },
  { sku: "5277", name: "KIT CAMBIO V FIRE ALUMINIO M8A INVIKTUS", price: 89.99, cat: "cambios", img: "assets/products/p12_04.jpg" },
  { sku: "9879", name: "KIT DE CAMBIO 21 VEL COM RAPID FIRE SUN RUN", price: 59.9, cat: "cambios", img: "assets/products/p12_05.jpg" },
  { sku: "11915", name: "CAMBIO TRASEIRO C/ GANCHEIRA:BLACK", price: 8.99, cat: "cambios", img: "assets/products/p12_06.jpg" },
  { sku: "0016", name: "CAMBIO TRASEIRO 6V C/GANC 6/7VEL PRETO WG SPORTS", price: 13.9, cat: "cambios", img: "assets/products/p12_07.jpg" },
  { sku: "10070", name: "CAMBIO TRASEIRO INDEX 7V 43D C/GANCHEIRA REMOVIVEL SUN RUN", price: 18.9, cat: "cambios", img: "assets/products/p12_08.jpg" },
  { sku: "11918", name: "CAMBIO TRAS 7/8V CAGE LONGO C/ GANC REMOVIVEL:BLACK", price: 10.9, cat: "cambios", img: "assets/products/p12_09.jpg" },
  { sku: "RD-M360L", name: "CAMBIO TRASEIRO ACERA RD-M360L SGS 7/8V PRETO SHIMANO", price: 139.9, cat: "cambios", img: "assets/products/p12_10.jpg" },
  { sku: "D1-51944", name: "CAMBIO TRASEIRO S/GANCH 7V INDEX RD-15 MONTAGEM DIRETA", price: 10.99, cat: "cambios", img: "assets/products/p12_11.jpg" },
  { sku: "9455", name: "CAMBIO TRASEIRO 9V PTO 43D CAGE LONGO POLY SUN RUN", price: 49.9, cat: "cambios", img: "assets/products/p13_00.jpg" },
  { sku: "9450", name: "CAMBIO TRASEIRO 7V INDEX PTO 43D CAGE LONGO SUN RUN", price: 17.9, cat: "cambios", img: "assets/products/p13_01.jpg" },
  { sku: "9453", name: "CAMBIO TRASEIRO 8V INDEX PTO 43D CAGE MEDIO SUN RUN", price: 22.9, cat: "cambios", img: "assets/products/p13_02.jpg" },
  { sku: "RD-TZ31", name: "CAMBIO TRASEIRO TOURNEY RD-TZ31-A GS 6/7V SEM GANCHEIRA", price: 49.9, cat: "cambios", img: "assets/products/p13_03.jpg" },
  { sku: "9449", name: "CAMBIO DIANTEIRO 9V DUAL PULL 44D 31.8 POLY SUN RUN", price: 36.9, cat: "cambios", img: "assets/products/p13_04.jpg" },
  { sku: "9531", name: "CAMBIO DIANT TOP PULL (PUXA POR CIMA) 42D 31.8MM SUN RUN", price: 8.9, cat: "cambios", img: "assets/products/p13_05.jpg" },
  { sku: "9300", name: "CAMBIO DIANTEIRO PRETO 48D 28.6 DOWN PULL PACO", price: 15.9, cat: "cambios", img: "assets/products/p13_06.jpg" },
  { sku: "9301", name: "CAMBIO DIANT DOWN PULL 28.6 48D", price: 5.99, cat: "cambios", img: "assets/products/p13_07.jpg" },
  { sku: "FD-TY500", name: "CAMBIO DIANTEIRO TOURNEY FD- TY500 P/42D 34.9MM T SWING DUALPUL", price: 49.9, cat: "cambios", img: "assets/products/p13_08.jpg" },

  // FREIOS, PASTILHAS & COMPONENTES
  { sku: "11987", name: "FREIO DISC MEC 160MM D+TR C/ROTOR", price: 36.9, cat: "freios", img: "assets/products/p29_00.jpg" },
  { sku: "10635", name: "FREIO A DISCO MEC 160MM C/ROTOR SF-M350 SHUNFENG", price: 49.9, cat: "freios", img: "assets/products/p29_01.jpg" },
  { sku: "MT200", name: "FREIO A DISCO HID ALTUS MT200 DT900MM/TS1700MM", price: 299.0, cat: "freios", img: "assets/products/p29_02.jpg" },
  { sku: "10489", name: "FREIO A DISCO HIDR AL D+T C/ ROTOR :BLACK", price: 159.9, cat: "freios", img: "assets/products/p29_03.jpg" },
  { sku: "16103", name: "FREIO A DISCO HIDRAULICO C/ROTOR 160MM NITRUS", price: 149.9, cat: "freios", img: "assets/products/p29_04.jpg" },
  { sku: "10713", name: "FREIO V-BRAKE NYL ROSA PINO 70MM", price: 16.5, cat: "freios", img: "assets/products/p29_05.jpg" },
  { sku: "9174", name: "FREIO V-BRAKE ALUM ORBITAL PRETO", price: 22.9, cat: "freios", img: "assets/products/p29_06.jpg" },
  { sku: "9523", name: "FREIO V- BRAKE NYLON ORBITAL 70MM", price: 14.99, cat: "freios", img: "assets/products/p29_07.jpg" },
  { sku: "11727", name: "FREIO CLASSIC FERRADURA ALUMINO PRETO", price: 39.9, cat: "freios", img: "assets/products/p29_08.jpg" },
  { sku: "10714", name: "FREIO FERRADURA ACO SIDE PULL DIANT/TRAS", price: 14.99, cat: "freios", img: "assets/products/p29_09.jpg" },
  { sku: "10926", name: "FREIO SIDE PULL (FERRADURA) SPEED DIANT/TRAS ALUMINIO PRETO", price: 39.9, cat: "freios", img: "assets/products/p29_10.jpg" },
  { sku: "S9102", name: "SAPATA ORBITAL C/LIMITADOR 70MM BLUE/RED", price: 9.49, cat: "freios", img: "assets/products/p29_11.jpg" },
  { sku: "S9102", name: "SAPATA ORBITAL C/LIMITADOR 70MM BLUE/RED (cor 2)", price: 9.49, cat: "freios", img: "assets/products/p30_00.jpg" },
  { sku: "D1-5427", name: "SAPATA MTB 68MM ALLEN/ORBITAL SUPER RESISTENTE", price: 10.99, cat: "freios", img: "assets/products/p30_01.jpg" },
  { sku: "056969", name: "SAPATA V-BRAKE ALLEN 70MM ALTA WG SPORTS", price: 5.99, cat: "freios", img: "assets/products/p30_02.jpg" },
  { sku: "10028", name: "SAPATA V BRAKE 70MM ORBITAL (25 PR)", price: 58.9, cat: "freios", img: "assets/products/p30_03.jpg" },
  { sku: "8215", name: "SAPATA V-BRAKE ALLEN 70MM WG SPORTS", price: 4.19, cat: "freios", img: "assets/products/p30_04.jpg" },
  { sku: "S9101", name: "SAPATA ORBITAL PREMIUM 70MMM SHUANGJIE", price: 8.99, cat: "freios", img: "assets/products/p30_05.jpg" },
  { sku: "10739", name: "SAPATA DE FREIO ORBITAL 70MM C/BLISTER C26", price: 5.57, cat: "freios", img: "assets/products/p30_06.jpg" },
  { sku: "10027", name: "SAPATA MTB PINO YX- 50MM (25 PRS) PACO", price: 27.15, cat: "freios", img: "assets/products/p30_07.jpg" },
  { sku: "8216", name: "SAPATA V-BRAKE SINTETICA PINO 60MM WG SPORTS", price: 3.49, cat: "freios", img: "assets/products/p30_08.jpg" },
  { sku: "10029", name: "SAPATA V- BRAKE 70MM PINO (25 PR)", price: 34.9, cat: "freios", img: "assets/products/p30_09.jpg" },
  { sku: "008217", name: "SAPATA V-BRAKE LATERAL 70MM ALTA WG SPORTS", price: 4.99, cat: "freios", img: "assets/products/p30_10.jpg" },
  { sku: "5284", name: "PASTILHA FREIO PINO C/MOLA PADRAO MT200 INVIKTUS", price: 10.9, cat: "freios", img: "assets/products/p30_11.jpg" },
  { sku: "19081", name: "PASTILHA DE FREIO DISCO C/MOLA PADRAO MT200 NITRUS", price: 6.9, cat: "freios", img: "assets/products/p31_00.jpg" },
  { sku: "S-0150", name: "PASTILHA DE FREIO A DISCO C/MOLA COMP XT LX", price: 8.9, cat: "freios", img: "assets/products/p31_01.jpg" },
  { sku: "S0151", name: "PASTILHA DE FREIO C/MOLA COMP MT200 PREMIUM ULTRA RESISTG ANKE", price: 11.99, cat: "freios", img: "assets/products/p31_02.jpg" },
  { sku: "S9099", name: "PASTILHA DE FREIO C/CAVIDADE E ORIFICIO TRAVA LAT C/MOLA PREMIM ALTA RESIST QANKE", price: 10.99, cat: "freios", img: "assets/products/p31_03.jpg" },
  { sku: "S-0152", name: "PASTILHA DE FREIO A DISCO C/MOLA SHIMANO", price: 8.9, cat: "freios", img: "assets/products/p31_04.jpg" },
  { sku: "S-0153", name: "PASTILHA DE FREIO A DISCO C/MOLA SRAM,AVID", price: 8.9, cat: "freios", img: "assets/products/p31_05.jpg" },
  { sku: "10936", name: "PASTILHA DE FREIO QUADRADA C/ORIFICIO E TRAVAS LATERAL", price: 4.99, cat: "freios", img: "assets/products/p31_06.jpg" },
  { sku: "10229", name: "PASTILHA DE FREIO DISCO QUADRADA C/CAVIDADE SEMIMETAL", price: 6.99, cat: "freios", img: "assets/products/p31_07.jpg" },
  { sku: "9767", name: "PASTILHA DE FREIO DISCO LXZ912 C/MOLA E CAVIDADE SEMI METALICA", price: 6.9, cat: "freios", img: "assets/products/p31_08.jpg" },
  { sku: "8768", name: "PASTILHA DE FREIO DISCO P01-SEMIMETALICA", price: 5.99, cat: "freios", img: "assets/products/p31_09.jpg" },
  { sku: "H-1692", name: "PASTILHA DE FREIO A DISCO PARA BICICLETAS (COMPATÍVEL FREIO ZOOM DEORE SLX XT E XTR", price: 6.9, cat: "freios", img: "assets/products/p31_10.jpg" },
  { sku: "H-1697", name: "PASTILHA DE FREIO A DISCO PARA BICICLETAS", price: 6.9, cat: "freios", img: "assets/products/p31_11.jpg" },
  { sku: "S9100", name: "PASTILHA DE FREIO REDONDA 21MM PREMIUM QANKE", price: 10.9, cat: "freios", img: "assets/products/p32_00.jpg" },
  { sku: "H-1689", name: "PASTILHA DE FREIO A DISCO PARA BICICLETAS", price: 6.9, cat: "freios", img: "assets/products/p32_01.jpg" },
  { sku: "H1699", name: "PASTILHA DE FREIO A DISCO PARA BICICLETAS", price: 6.9, cat: "freios", img: "assets/products/p32_02.jpg" },
  { sku: "H-1690", name: "PASTILHA DE FREIO A DISCO PARA BICICLETAS", price: 6.9, cat: "freios", img: "assets/products/p32_03.jpg" },
  { sku: "H-1691", name: "PASTILHA DE FREIO A DISCO PARA BICICLETAS", price: 6.9, cat: "freios", img: "assets/products/p32_04.jpg" },
  { sku: "H-1687", name: "PASTILHA DE FREIO DISCO PARA BICICLETAS (COMPATÍVEL C/ SHIMANO", price: 7.9, cat: "freios", img: "assets/products/p32_05.jpg" },
  { sku: "H-1696", name: "PASTILHA DE FREIO DISCO PARA BICICLETAS (COMPATÍVEL C/ HOPPE)", price: 6.9, cat: "freios", img: "assets/products/p32_06.jpg" },
  { sku: "H-1693", name: "PASTILHA DE FREIO DISCO PARA BICICLETAS", price: 6.9, cat: "freios", img: "assets/products/p32_07.jpg" },
  { sku: "10722", name: "KIT TUBO GUIA C/ PARAFUSOS (PCT 20JG)", price: 69.9, cat: "freios", img: "assets/products/p32_08.jpg" },
  { sku: "10110", name: "KIT OLIVA PINO DURADO P FREIO HIDR 10 PARES", price: 39.9, cat: "freios", img: "assets/products/p32_09.jpg" },
  { sku: "127", name: "PARAFUSO REGULADOR DE FREIO DA MACANETA GROSSO ALUM", price: 0.98, cat: "freios", img: "assets/products/p32_10.jpg" },

  // GUIDÕES & SUPORTES
  { sku: "02245", name: "GUIDAO MTB ALUMINIO RETO 700MM 31,8", price: 16.9, cat: "guidoes", img: "assets/products/p40_00.jpg" },
  { sku: "9696", name: "GUIDAO ALUM DOWN HILL 680X31.8MM PRETO", price: 20.9, cat: "guidoes", img: "assets/products/p40_01.jpg" },
  { sku: "44317", name: "GUIDAO MTB AL PRETO 31,8X700MM MARCA:ZOOM", price: 39.9, cat: "guidoes", img: "assets/products/p40_02.jpg" },
  { sku: "254", name: "GUIDAO FERRO CG 22.2X650MM /PRETO TX", price: 29.9, cat: "guidoes", img: "assets/products/p40_03.jpg" },
  { sku: "10646", name: "GUIDAO POTI ACO CROMADO 680X125", price: 26.9, cat: "guidoes", img: "assets/products/p40_04.jpg" },
  { sku: "960", name: "GUIDAO ALTO ALUM 31.8X830X15MM PRETO", price: 49.9, cat: "guidoes", img: "assets/products/p40_05.jpg" },
  { sku: "10644", name: "GUIDAO ACO BMX 670X22.2MM", price: 26.9, cat: "guidoes", img: "assets/products/p40_06.jpg" },
  { sku: "10645", name: "GUIDAO ACO BASIC DH/MTB EXPANDIDO 580X35MM/1.2MM", price: 9.98, cat: "guidoes", img: "assets/products/p40_07.jpg" },
  { sku: "19356", name: "GUIDAO DH 720X31,8X 80MM ALT ACO PREMIUM INVIKTUS GO", price: 18.9, cat: "guidoes", img: "assets/products/p40_08.jpg" },
  { sku: "15152", name: "GUIDAO POTI 600X22.2 ,4X80MM ACO", price: 15.49, cat: "guidoes", img: "assets/products/p40_09.jpg" },
  { sku: "19361", name: "SUPORTE DE GUIDAO HEADSET DH 31,8X60 MM PRETO", price: 18.9, cat: "guidoes", img: "assets/products/p40_10.jpg" },
  { sku: "19360", name: "SUPORTE DE GUIDAO HEADSET DH 31,8X80 MM PRETO", price: 19.98, cat: "guidoes", img: "assets/products/p40_11.jpg" },
  { sku: "9697", name: "SUPORTE DE GUIDAO AHEAD 80 31.8MM PRETO", price: 20.9, cat: "guidoes", img: "assets/products/p41_00.jpg" },
  { sku: "9697", name: "SUPORTE DE GUIDAO AHEAD 80 31.8MM PRETO (cor 2)", price: 29.9, cat: "guidoes", img: "assets/products/p41_01.jpg" },
  { sku: "11540", name: "SUPORTE DE GUIDAO AHEAD 35MM 0 GRAU 31.8MM CNC RAINBOW", price: 89.9, cat: "guidoes", img: "assets/products/p41_02.jpg" },
  { sku: "11539", name: "SUPORTE DE GUIDAO AHEAD 35MM 0 GRAU CNC 31.8MM ROXO", price: 69.9, cat: "guidoes", img: "assets/products/p41_03.jpg" },
  { sku: "11050", name: "SUPORTE DE GUIDAO AHEAD 45MM 0 31.8MM DOURADO", price: 39.9, cat: "guidoes", img: "assets/products/p41_04.jpg" },
  { sku: "50108", name: "SUPORTE DE GUIDAO CROSS GTU JUNIOR LILAS", price: 19.9, cat: "guidoes", img: "assets/products/p41_05.jpg" },
  { sku: "0115V", name: "SUPORTE DE GUIDAO CROSS GTU JUNIOR VERMELHO", price: 19.9, cat: "guidoes", img: "assets/products/p41_06.jpg" },
  { sku: "0103A", name: "SUPORTE DE GUIDAO CROSS GTU JUNIOR AZUL", price: 19.9, cat: "guidoes", img: "assets/products/p41_07.jpg" },
  { sku: "112R", name: "SUPORTE DE GUIDAO CROSS GTU JUNIOR ROSA", price: 19.9, cat: "guidoes", img: "assets/products/p41_08.jpg" },
  { sku: "0115PRT", name: "SUPORTE DE GUIDAO JUNIOR GTU PRETO", price: 20.9, cat: "guidoes", img: "assets/products/p41_09.jpg" },
  { sku: "S9116", name: "SUPORTE DE GUIDAO CHANFRADO RETRO ESPIGA 22.2X200MM C/EXPANDER ALLEN", price: 19.9, cat: "guidoes", img: "assets/products/p41_10.jpg" },
  { sku: "774", name: "SUPORTE DE GUIDAOBMX 21,1 MM PRETO", price: 18.9, cat: "guidoes", img: "assets/products/p41_11.jpg" },
  { sku: "12275", name: "SUPORTE DE GUIDAO MTB C/ EXP ALLEN 21.1MM", price: 12.98, cat: "guidoes", img: "assets/products/p42_00.jpg" },
  { sku: "19357", name: "SUPORTE DE GUIDAO C/EXP 21,1 MM ACO", price: 11.98, cat: "guidoes", img: "assets/products/p42_01.jpg" },
  { sku: "S9114", name: "EXTENSOR DE GUIDAO ALUM ALLOY 200MM C/2 ABRAC EXTENSIVA 31,8/22,2", price: 29.9, cat: "guidoes", img: "assets/products/p42_02.jpg" },
  { sku: "10610", name: "EXPANDER 21.1X165MM SEXTAVADO", price: 3.99, cat: "guidoes", img: "assets/products/p42_03.jpg" },
  { sku: "10704", name: "PARAFUSO EXPANDER 21.1X165MM ALLEN", price: 3.85, cat: "guidoes", img: "assets/products/p42_04.jpg" },

  // QUADROS
  { sku: "2929", name: "QUADRO ALUMINIO MTB ARO 29 MAXXI", price: 179.9, cat: "quadros", img: "assets/products/p74_00.jpg" },
  { sku: "2929", name: "QUADRO ALUMINIO MTB ARO 29 MAXXI (cor 2)", price: 179.9, cat: "quadros", img: "assets/products/p74_01.jpg" },
  { sku: "2929", name: "QUADRO ALUMINIO MTB ARO 29 MAXXI (cor 3)", price: 179.9, cat: "quadros", img: "assets/products/p74_02.jpg" },
  { sku: "2929", name: "QUADRO ALUMINIO MTB ARO 29 MAXXI (cor 4)", price: 179.9, cat: "quadros", img: "assets/products/p74_03.jpg" },
  { sku: "12196", name: "QUADRO 26 AL FREERIDE REBEL BRANCO C/KIT", price: 499.0, cat: "quadros", img: "assets/products/p74_04.jpg" },
  { sku: "10973", name: "QUADRO 26 AL GTA FREERIDE REBEL RNBW + KIT", price: 699.0, cat: "quadros", img: "assets/products/p74_05.jpg" },
  { sku: "10972", name: "QUADRO 26 AL FREERIDE REBEL AZUL C/KIT", price: 499.0, cat: "quadros", img: "assets/products/p74_06.jpg" },
  { sku: "12199", name: "QUADRO 26 AL FREERIDE REBEL AZUL BABY+PINK C/KIT", price: 499.0, cat: "quadros", img: "assets/products/p75_00.jpg" },
  { sku: "12198", name: "QUADRO REBEL VERDE", price: 499.0, cat: "quadros", img: "assets/products/p75_01.jpg" },
  { sku: "12197", name: "QUADRO REBEL VERMELHO", price: 499.0, cat: "quadros", img: "assets/products/p75_02.jpg" },
  { sku: "12196", name: "QUADRO 26 AL FREERIDE REBEL BRANCO C/KIT (cor 2)", price: 499.0, cat: "quadros", img: "assets/products/p75_03.jpg" },
  { sku: "10968", name: "QUADRO 26 AL FREERIDE REBEL PRETO C/ KIT", price: 499.0, cat: "quadros", img: "assets/products/p75_04.jpg" },
  { sku: "10969", name: "QUADRO REBEL ROXO", price: 499.0, cat: "quadros", img: "assets/products/p75_05.jpg" },

];

const BIKES = 
[
  {
    "id": "sunpeed-ace",
    "name": "Sunpeed Ace",
    "specs": [
      "Freios a disco hidráulico Shimano MT-200 160mm",
      "Câmbio traseiro Shimano Deore M6100 12V",
      "Pedivela Single Hollowtech Prowheel",
      "Cubos Faweks M203 32H rolamentos selados"
    ],
    "colors": [
      {
        "name": "Branco",
        "img": "assets/products/bike_ace_white.jpg"
      },
      {
        "name": "Preto",
        "img": "assets/products/bike_ace_black.jpg"
      },
      {
        "name": "Verde",
        "img": "assets/products/bike_ace_green.jpg"
      },
      {
        "name": "Vermelho",
        "img": "assets/products/bike_ace_red.jpg"
      }
    ]
  },
  {
    "id": "sunpeed-rule",
    "name": "Sunpeed Rule",
    "specs": [
      "Freios a disco hidráulico Shimano MT-200 160mm",
      "Câmbio traseiro Shimano Altus 9V",
      "Cassete Sunshine 11/42T",
      "Cubo dianteiro/traseiro Solon MTB 801F alumínio"
    ],
    "colors": [
      {
        "name": "Prata",
        "img": "assets/products/bike_rule_silver.jpg"
      },
      {
        "name": "Preto/Vermelho",
        "img": "assets/products/bike_rule_black.jpg"
      },
      {
        "name": "Laranja/Azul",
        "img": "assets/products/bike_rule_orange.jpg"
      }
    ]
  },
  {
    "id": "sunpeed-zero",
    "name": "Sunpeed Zero",
    "specs": [
      "Freios a disco mecânicos",
      "Câmbios Shimano Tourney TY300 (diant. e tras.)",
      "Pedivela triplo Prowheel alumínio 24/34/42T",
      "Suspensão Sunpeed 100mm 29\" com trava no ombro"
    ],
    "colors": [
      {
        "name": "Azul/Amarelo",
        "img": "assets/products/bike_zero_blue.jpg"
      },
      {
        "name": "Prata",
        "img": "assets/products/bike_zero_silver.jpg"
      },
      {
        "name": "Grafite",
        "img": "assets/products/bike_zero_graphite.jpg"
      },
      {
        "name": "Vermelho",
        "img": "assets/products/bike_zero_red.jpg"
      }
    ]
  }
];