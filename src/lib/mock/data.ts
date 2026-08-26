export type TransactionStatus = "aprovada" | "pendente" | "recusada" | "estornada";
export type PaymentMethod = "Pix" | "Cartão" | "Boleto";

export type Transaction = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  method: PaymentMethod;
  status: TransactionStatus;
  affiliate: string | null;
  date: string;
};

export const transactions: Transaction[] = [
  {
    id: "TRX-90412",
    customer: "Marina Alves",
    product: "Método Escala 7",
    amount: 197,
    method: "Pix",
    status: "aprovada",
    affiliate: "Rafael Lima",
    date: "2026-08-14T14:32:00Z",
  },
  {
    id: "TRX-90411",
    customer: "Diego Souza",
    product: "Mentoria Cash Pro",
    amount: 1497,
    method: "Cartão",
    status: "aprovada",
    affiliate: null,
    date: "2026-08-14T13:58:00Z",
  },
  {
    id: "TRX-90410",
    customer: "Camila Ferreira",
    product: "Pack Criativos 2026",
    amount: 89.9,
    method: "Pix",
    status: "pendente",
    affiliate: "Ana Prado",
    date: "2026-08-14T13:21:00Z",
  },
  {
    id: "TRX-90409",
    customer: "Lucas Martins",
    product: "Método Escala 7",
    amount: 197,
    method: "Cartão",
    status: "recusada",
    affiliate: "Rafael Lima",
    date: "2026-08-14T12:47:00Z",
  },
  {
    id: "TRX-90408",
    customer: "Beatriz Nunes",
    product: "Curso Tráfego Direto",
    amount: 397,
    method: "Cartão",
    status: "aprovada",
    affiliate: null,
    date: "2026-08-14T12:02:00Z",
  },
  {
    id: "TRX-90407",
    customer: "Rodrigo Pinto",
    product: "Comunidade CE PRO",
    amount: 49.9,
    method: "Pix",
    status: "aprovada",
    affiliate: "Ana Prado",
    date: "2026-08-14T11:35:00Z",
  },
  {
    id: "TRX-90406",
    customer: "Juliana Castro",
    product: "Mentoria Cash Pro",
    amount: 1497,
    method: "Boleto",
    status: "pendente",
    affiliate: null,
    date: "2026-08-14T10:58:00Z",
  },
  {
    id: "TRX-90405",
    customer: "Felipe Andrade",
    product: "Pack Criativos 2026",
    amount: 89.9,
    method: "Pix",
    status: "aprovada",
    affiliate: "Bruno Reis",
    date: "2026-08-14T10:14:00Z",
  },
  {
    id: "TRX-90404",
    customer: "Tatiane Rocha",
    product: "Método Escala 7",
    amount: 197,
    method: "Cartão",
    status: "estornada",
    affiliate: "Rafael Lima",
    date: "2026-08-13T21:40:00Z",
  },
  {
    id: "TRX-90403",
    customer: "Gustavo Mendes",
    product: "Curso Tráfego Direto",
    amount: 397,
    method: "Pix",
    status: "aprovada",
    affiliate: "Bruno Reis",
    date: "2026-08-13T20:12:00Z",
  },
  {
    id: "TRX-90402",
    customer: "Larissa Dias",
    product: "Comunidade CE PRO",
    amount: 49.9,
    method: "Cartão",
    status: "aprovada",
    affiliate: null,
    date: "2026-08-13T19:03:00Z",
  },
  {
    id: "TRX-90401",
    customer: "Eduardo Ramos",
    product: "Método Escala 7",
    amount: 197,
    method: "Pix",
    status: "aprovada",
    affiliate: "Ana Prado",
    date: "2026-08-13T18:22:00Z",
  },
  {
    id: "TRX-90400",
    customer: "Patrícia Gomes",
    product: "Mentoria Cash Pro",
    amount: 1497,
    method: "Cartão",
    status: "recusada",
    affiliate: null,
    date: "2026-08-13T17:44:00Z",
  },
  {
    id: "TRX-90399",
    customer: "Vinícius Barros",
    product: "Pack Criativos 2026",
    amount: 89.9,
    method: "Pix",
    status: "aprovada",
    affiliate: "Bruno Reis",
    date: "2026-08-13T16:31:00Z",
  },
  {
    id: "TRX-90398",
    customer: "Aline Cardoso",
    product: "Curso Tráfego Direto",
    amount: 397,
    method: "Cartão",
    status: "aprovada",
    affiliate: "Rafael Lima",
    date: "2026-08-13T15:19:00Z",
  },
  {
    id: "TRX-90397",
    customer: "Henrique Melo",
    product: "Comunidade CE PRO",
    amount: 49.9,
    method: "Pix",
    status: "pendente",
    affiliate: null,
    date: "2026-08-13T14:07:00Z",
  },
  {
    id: "TRX-90396",
    customer: "Sofia Ribeiro",
    product: "Método Escala 7",
    amount: 197,
    method: "Cartão",
    status: "aprovada",
    affiliate: "Ana Prado",
    date: "2026-08-13T12:55:00Z",
  },
  {
    id: "TRX-90395",
    customer: "Otávio Freitas",
    product: "Mentoria Cash Pro",
    amount: 1497,
    method: "Pix",
    status: "aprovada",
    affiliate: null,
    date: "2026-08-13T11:26:00Z",
  },
];

export type Product = {
  id: string;
  name: string;
  price: number;
  commission: number;
  sales: number;
  revenue: number;
  status: "ativo" | "rascunho" | "pausado";
};

export const products: Product[] = [
  {
    id: "PRD-101",
    name: "Método Escala 7",
    price: 197,
    commission: 30,
    sales: 1284,
    revenue: 252948,
    status: "ativo",
  },
  {
    id: "PRD-102",
    name: "Mentoria Cash Pro",
    price: 1497,
    commission: 20,
    sales: 212,
    revenue: 317364,
    status: "ativo",
  },
  {
    id: "PRD-103",
    name: "Curso Tráfego Direto",
    price: 397,
    commission: 40,
    sales: 638,
    revenue: 253286,
    status: "ativo",
  },
  {
    id: "PRD-104",
    name: "Pack Criativos 2026",
    price: 89.9,
    commission: 50,
    sales: 1902,
    revenue: 170989.8,
    status: "ativo",
  },
  {
    id: "PRD-105",
    name: "Comunidade CE PRO",
    price: 49.9,
    commission: 25,
    sales: 2410,
    revenue: 120259,
    status: "ativo",
  },
  {
    id: "PRD-106",
    name: "Workshop Split Avançado",
    price: 297,
    commission: 35,
    sales: 148,
    revenue: 43956,
    status: "pausado",
  },
  {
    id: "PRD-107",
    name: "Templates de Checkout",
    price: 129,
    commission: 45,
    sales: 0,
    revenue: 0,
    status: "rascunho",
  },
];

export type Affiliate = {
  id: string;
  name: string;
  sales: number;
  commission: number;
  conversion: number;
};

export const affiliates: Affiliate[] = [
  { id: "AFF-01", name: "Rafael Lima", sales: 412, commission: 68420.5, conversion: 8.4 },
  { id: "AFF-02", name: "Ana Prado", sales: 388, commission: 61240.2, conversion: 7.9 },
  { id: "AFF-03", name: "Bruno Reis", sales: 271, commission: 42115.8, conversion: 6.5 },
  { id: "AFF-04", name: "Carla Souto", sales: 190, commission: 30880.4, conversion: 5.8 },
  { id: "AFF-05", name: "Thiago Nogueira", sales: 142, commission: 22014.9, conversion: 5.1 },
];

export type LedgerEntry = {
  id: string;
  description: string;
  type: "credito" | "debito";
  amount: number;
  date: string;
};

export const ledger: LedgerEntry[] = [
  {
    id: "LG-5011",
    description: "Venda aprovada · Método Escala 7",
    type: "credito",
    amount: 197,
    date: "2026-08-14T14:32:00Z",
  },
  {
    id: "LG-5010",
    description: "Taxa de processamento",
    type: "debito",
    amount: 9.85,
    date: "2026-08-14T14:32:00Z",
  },
  {
    id: "LG-5009",
    description: "Comissão de afiliado · Rafael Lima",
    type: "debito",
    amount: 59.1,
    date: "2026-08-14T14:32:00Z",
  },
  {
    id: "LG-5008",
    description: "Venda aprovada · Mentoria Cash Pro",
    type: "credito",
    amount: 1497,
    date: "2026-08-14T13:58:00Z",
  },
  {
    id: "LG-5007",
    description: "Saque solicitado",
    type: "debito",
    amount: 12000,
    date: "2026-08-13T18:00:00Z",
  },
  {
    id: "LG-5006",
    description: "Venda aprovada · Curso Tráfego Direto",
    type: "credito",
    amount: 397,
    date: "2026-08-13T15:19:00Z",
  },
  {
    id: "LG-5005",
    description: "Estorno · Método Escala 7",
    type: "debito",
    amount: 197,
    date: "2026-08-13T21:40:00Z",
  },
  {
    id: "LG-5004",
    description: "Venda aprovada · Pack Criativos 2026",
    type: "credito",
    amount: 89.9,
    date: "2026-08-13T16:31:00Z",
  },
];

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  date: string;
  result: "sucesso" | "falha";
};

export const auditLogs: AuditLog[] = [
  {
    id: "LOG-8801",
    actor: "Kelvin",
    action: "Gerou nova chave de API",
    date: "2026-08-14T09:12:00Z",
    result: "sucesso",
  },
  {
    id: "LOG-8800",
    actor: "Sistema",
    action: "Webhook order.paid entregue",
    date: "2026-08-14T08:41:00Z",
    result: "sucesso",
  },
  {
    id: "LOG-8799",
    actor: "Ana Prado",
    action: "Tentativa de login",
    date: "2026-08-13T23:02:00Z",
    result: "falha",
  },
  {
    id: "LOG-8798",
    actor: "Kelvin",
    action: "Aprovou saque de R$ 12.000,00",
    date: "2026-08-13T18:00:00Z",
    result: "sucesso",
  },
  {
    id: "LOG-8797",
    actor: "Kelvin",
    action: "Editou regra de split",
    date: "2026-08-13T15:44:00Z",
    result: "sucesso",
  },
];

export const kpis = {
  volume: 1284930.55,
  sales: 3241,
  revenue: 486210.3,
  approvalRate: 92.4,
};

export type OrderStatus =
  "aprovado" | "processando" | "pendente" | "cancelado" | "enviado" | "entregue";

export type Order = {
  id: string;
  transactionId: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  method: PaymentMethod;
  status: OrderStatus;
  date: string;
};

const orderStatuses: OrderStatus[] = [
  "aprovado",
  "aprovado",
  "aprovado",
  "processando",
  "pendente",
  "cancelado",
];

export const orders: Order[] = (() => {
  const rows: Order[] = [];
  for (let i = 0; i < 60; i += 1) {
    const src = transactions[i % transactions.length]!;
    rows.push({
      id: `PED-${String(10482 - i).padStart(5, "0")}`,
      transactionId: src.id,
      customer: src.customer,
      email: customerEmail(src.customer),
      product: src.product,
      amount: src.amount,
      method: src.method,
      status: orderStatuses[i % orderStatuses.length]!,
      date: src.date,
    });
  }
  return rows;
})();

export type CheckoutStatus = "ativo" | "rascunho" | "arquivado";

export type Checkout = {
  id: string;
  name: string;
  product: string;
  price: number;
  methods: PaymentMethod[];
  sales: number;
  revenue: number;
  conversion: number;
  status: CheckoutStatus;
  updatedAt: string;
};

export const checkouts: Checkout[] = [
  {
    id: "CHK-201",
    name: "Checkout Escala 7 · Padrão",
    product: "Método Escala 7",
    price: 197,
    methods: ["Pix", "Cartão"],
    sales: 1284,
    revenue: 252948,
    conversion: 7.4,
    status: "ativo",
    updatedAt: "2026-08-12T10:10:00Z",
  },
  {
    id: "CHK-202",
    name: "Checkout Mentoria · Premium",
    product: "Mentoria Cash Pro",
    price: 1497,
    methods: ["Pix", "Cartão", "Boleto"],
    sales: 212,
    revenue: 317364,
    conversion: 11.2,
    status: "ativo",
    updatedAt: "2026-08-10T14:20:00Z",
  },
  {
    id: "CHK-203",
    name: "Checkout Tráfego Direto",
    product: "Curso Tráfego Direto",
    price: 397,
    methods: ["Pix", "Cartão"],
    sales: 638,
    revenue: 253286,
    conversion: 9.8,
    status: "ativo",
    updatedAt: "2026-08-13T09:00:00Z",
  },
  {
    id: "CHK-204",
    name: "Checkout Criativos",
    product: "Pack Criativos 2026",
    price: 89.9,
    methods: ["Pix"],
    sales: 1902,
    revenue: 170989.8,
    conversion: 13.1,
    status: "ativo",
    updatedAt: "2026-08-09T16:40:00Z",
  },
  {
    id: "CHK-205",
    name: "Checkout Comunidade",
    product: "Comunidade CE PRO",
    price: 49.9,
    methods: ["Pix", "Cartão"],
    sales: 2410,
    revenue: 120259,
    conversion: 15.8,
    status: "ativo",
    updatedAt: "2026-08-11T21:10:00Z",
  },
  {
    id: "CHK-206",
    name: "Workshop Split · V2",
    product: "Workshop Split Avançado",
    price: 297,
    methods: ["Cartão"],
    sales: 0,
    revenue: 0,
    conversion: 0,
    status: "rascunho",
    updatedAt: "2026-08-14T08:12:00Z",
  },
];

export type PaymentLink = {
  id: string;
  code: string;
  product: string;
  amount: number;
  clicks: number;
  sales: number;
  conversion: number;
  revenue: number;
  expiresAt: string | null;
};

export const paymentLinks: PaymentLink[] = (() => {
  const base = [
    { p: "Método Escala 7", a: 197 },
    { p: "Pack Criativos 2026", a: 89.9 },
    { p: "Comunidade CE PRO", a: 49.9 },
    { p: "Curso Tráfego Direto", a: 397 },
    { p: "Mentoria Cash Pro", a: 1497 },
    { p: "Workshop Split Avançado", a: 297 },
  ];
  return base.map((b, i) => {
    const clicks = 1200 - i * 160;
    const sales = Math.round(clicks * (0.05 + (i % 3) * 0.015));
    return {
      id: `LNK-${301 + i}`,
      code: `pay-${b.p
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 16)}`,
      product: b.p,
      amount: b.a,
      clicks,
      sales,
      conversion: +((sales / clicks) * 100).toFixed(1),
      revenue: Math.round(b.a * sales * 100) / 100,
      expiresAt: i === 5 ? "2026-09-14T23:59:59Z" : null,
    };
  });
})();

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  purchases: number;
  totalSpent: number;
  lastPurchase: string | null;
};

function customerPhone(i: number) {
  const ddd = 11 + (i % 18);
  const rest = String(90000 + ((i * 1371) % 89999)).padStart(9, "0");
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

function customerDocument(i: number) {
  const seed = String(100_000_000 + ((i * 972317) % 899_999_999));
  return `${seed.slice(0, 3)}.${seed.slice(3, 6)}.${seed.slice(6, 9)}-${seed.slice(9).padEnd(2, "0")}`;
}

function customerEmail(name: string) {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const first = normalized[0] ?? "usuario";
  const last = normalized[normalized.length - 1] ?? "silva";
  const providers = ["gmail.com", "outlook.com", "yahoo.com.br", "hotmail.com", "icloud.com"];
  const seed = (first.length * 7 + last.length * 3) % providers.length;
  return `${first}.${last}@${providers[seed]}`;
}

export const customers: Customer[] = (() => {
  const names = Array.from(
    new Set([
      ...transactions.map((t) => t.customer),
      ...Array.from({ length: 32 }, (_, i) => {
        const list = [
          "Renata Lopes",
          "Caio Teixeira",
          "Fernanda Costa",
          "André Silva",
          "Mariana Rocha",
          "Thiago Duarte",
          "Isabela Freitas",
          "César Pires",
          "Nathalia Monteiro",
          "Renan Oliveira",
          "Dayane Souza",
          "Alan Figueiredo",
          "Lorena Barros",
          "Pedro Henrique Prado",
          "Karina Andrade",
          "Ricardo Costa",
          "Helena Martins",
          "Júlio César Rezende",
          "Amanda Rocha",
          "Paulo Sérgio Dias",
          "Clara Ribeiro",
          "Giovane Ferreira",
          "Manuela Assis",
          "Henrique Bastos",
          "Débora Tavares",
          "Fabrício Melo",
          "Vitória Lemos",
          "Rodrigo Viana",
          "Natasha Dutra",
          "Andressa Santana",
          "Evandro Lacerda",
          "Talita Duarte",
        ];
        return list[i];
      }),
    ]),
  ).slice(0, 50);
  const rows: Customer[] = [];
  for (let i = 0; i < names.length; i += 1) {
    const name = names[i]!;
    const purchases = 1 + (i % 8);
    const ticket = [49.9, 89.9, 197, 297, 397, 1497][i % 6]!;
    const total = Math.round(purchases * ticket * 100) / 100;
    const last = new Date(
      Date.parse("2026-08-14T18:00:00Z") - i * (23 * 3600 * 1000),
    ).toISOString();
    rows.push({
      id: `CLI-${String(4000 + i).padStart(5, "0")}`,
      name,
      email: customerEmail(name),
      phone: customerPhone(i),
      document: customerDocument(i),
      purchases,
      totalSpent: total,
      lastPurchase: i === names.length - 1 ? null : last,
    });
  }
  return rows;
})();

export type AffiliateStatus = "ativo" | "pendente" | "bloqueado";

export type AffiliateFull = {
  id: string;
  name: string;
  email: string;
  phone: string;
  sales: number;
  commission: number;
  conversion: number;
  clicks: number;
  status: AffiliateStatus;
  joinedAt: string;
};

export const affiliatesFull: AffiliateFull[] = (() => {
  const names = [
    "Rafael Lima",
    "Ana Prado",
    "Bruno Reis",
    "Carla Souto",
    "Thiago Nogueira",
    "Vanessa Castro",
    "Leonardo Siqueira",
    "Fernanda Vidal",
    "Ricardo Braga",
    "Luana Pinto",
    "Wagner Martins",
    "Aline Barbosa",
    "Daniel Carvalho",
    "Isadora Melo",
    "Gustavo Barreto",
  ];
  return names.map((n, i) => {
    const sales = 500 - i * 26;
    const clicks = sales * 12;
    const ticket = 220;
    const commission = Math.round(sales * ticket * 0.3 * 100) / 100;
    return {
      id: `AFF-${String(100 + i).padStart(3, "0")}`,
      name: n,
      email: customerEmail(n),
      phone: customerPhone(i + 4),
      sales,
      commission,
      conversion: +((sales / clicks) * 100).toFixed(1),
      clicks,
      status: i < 11 ? "ativo" : i < 13 ? "pendente" : "bloqueado",
      joinedAt: new Date(Date.parse("2026-03-21T10:00:00Z") + i * (86400 * 1000)).toISOString(),
    };
  });
})();

export type CommissionStatus = "liberada" | "pendente" | "paga" | "cancelada";

export type Commission = {
  id: string;
  affiliate: string;
  transaction: string;
  product: string;
  gross: number;
  rate: number;
  value: number;
  status: CommissionStatus;
  saleAt: string;
  liquidityAt: string;
};

export const commissions: Commission[] = (() => {
  const approved = transactions.filter((t) => t.affiliate && t.status !== "recusada");
  const rate = 0.3;
  const statuses: CommissionStatus[] = ["liberada", "paga", "pendente", "liberada", "paga"];
  return approved.slice(0, 48).map((t, i) => {
    const value = Math.round(t.amount * rate * 100) / 100;
    return {
      id: `COM-${String(72000 - i).padStart(5, "0")}`,
      affiliate: t.affiliate!,
      transaction: t.id,
      product: t.product,
      gross: t.amount,
      rate: +(rate * 100).toFixed(0),
      value,
      status: t.status === "estornada" ? "cancelada" : statuses[i % statuses.length]!,
      saleAt: t.date,
      liquidityAt: new Date(Date.parse(t.date) + (2 + (i % 14)) * 86400 * 1000).toISOString(),
    };
  });
})();

export type AffiliateLink = {
  id: string;
  slug: string;
  affiliate: string;
  product: string;
  clicks: number;
  sales: number;
  conversion: number;
  commissionValue: number;
};

export const affiliateLinks: AffiliateLink[] = (() => {
  const affs = affiliatesFull;
  const list: AffiliateLink[] = [];
  let counter = 9000;
  for (let i = 0; i < affs.length; i += 1) {
    const a = affs[i]!;
    const p1 = products[i % products.length]!;
    const p2 = products[(i + 2) % products.length]!;
    for (const p of [p1, p2]) {
      counter -= 1;
      const clicks = 1200 - (counter % 1100);
      const sales = Math.round(clicks * 0.062);
      list.push({
        id: `RFL-${counter}`,
        slug: `r/${p.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 18)}-${(a.name.split(" ")[0] ?? "").toLowerCase()}`,
        affiliate: a.name,
        product: p.name,
        clicks,
        sales,
        conversion: +((sales / clicks) * 100).toFixed(1),
        commissionValue: Math.round(p.price * (p.commission / 100) * 100) / 100,
      });
    }
  }
  return list;
})();

export type MarketplaceProduct = {
  id: string;
  name: string;
  category: string;
  producer: string;
  price: number;
  commission: number;
  commissionValue: number;
  sales: number;
  gravity: number;
  tag: "destaque" | "novo" | "manual" | null;
};

const categories = ["Negócios", "Educação", "Marketing", "Finanças", "Tecnologia", "Vendas"];
const producers = ["Instituto Escala", "Cash Lab", "Núcleo Digital", "Futura Edu", "Vértice Hub"];

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: "MKT-001",
    name: "Operação Digital do Zero",
    category: "Negócios",
    producer: producers[0]!,
    price: 497,
    commission: 40,
    commissionValue: 198.8,
    sales: 3128,
    gravity: 112,
    tag: "destaque",
  },
  {
    id: "MKT-002",
    name: "Mentoria de Escala",
    category: "Negócios",
    producer: producers[2]!,
    price: 1997,
    commission: 25,
    commissionValue: 499.25,
    sales: 812,
    gravity: 95,
    tag: "destaque",
  },
  {
    id: "MKT-003",
    name: "Checkout que Converte",
    category: "Marketing",
    producer: producers[1]!,
    price: 297,
    commission: 50,
    commissionValue: 148.5,
    sales: 1540,
    gravity: 141,
    tag: "novo",
  },
  {
    id: "MKT-004",
    name: "Gestão Financeira Digital",
    category: "Finanças",
    producer: producers[3]!,
    price: 697,
    commission: 30,
    commissionValue: 209.1,
    sales: 960,
    gravity: 78,
    tag: null,
  },
  {
    id: "MKT-005",
    name: "Automação com API",
    category: "Tecnologia",
    producer: producers[4]!,
    price: 897,
    commission: 35,
    commissionValue: 313.95,
    sales: 520,
    gravity: 62,
    tag: "novo",
  },
  {
    id: "MKT-006",
    name: "Rede de Afiliados na Prática",
    category: "Vendas",
    producer: producers[0]!,
    price: 397,
    commission: 45,
    commissionValue: 178.65,
    sales: 1780,
    gravity: 130,
    tag: "manual",
  },
  {
    id: "MKT-007",
    name: "Tráfego Pago para Iniciantes",
    category: "Marketing",
    producer: producers[2]!,
    price: 197,
    commission: 50,
    commissionValue: 98.5,
    sales: 4210,
    gravity: 168,
    tag: "destaque",
  },
  {
    id: "MKT-008",
    name: "Copywriting Avançado",
    category: "Marketing",
    producer: producers[1]!,
    price: 497,
    commission: 35,
    commissionValue: 173.95,
    sales: 780,
    gravity: 54,
    tag: null,
  },
];

export type WithdrawStatus = "solicitado" | "processando" | "concluido" | "rejeitado";

export type Withdraw = {
  id: string;
  account: string;
  amount: number;
  fee: number;
  net: number;
  status: WithdrawStatus;
  requestedAt: string;
  completedAt: string | null;
};

export const withdraws: Withdraw[] = (() => {
  const rows: Withdraw[] = [];
  const accounts = ["Nubank · CC 12345-6", "Itaú · CC 88210-4", "Pix · CNPJ 41.882.310/0001-09"];
  const statuses: WithdrawStatus[] = [
    "concluido",
    "concluido",
    "processando",
    "solicitado",
    "rejeitado",
  ];
  const values = [12000, 5000, 8500, 22000, 3200, 15000, 4500, 9800];
  const base = Date.parse("2026-08-14T17:00:00Z");
  for (let i = 0; i < 24; i += 1) {
    const amount = values[i % values.length]! + i * 100;
    const fee = 3.9;
    const net = Math.round((amount - fee) * 100) / 100;
    const status = statuses[i % statuses.length]!;
    const req = new Date(base - i * (2 * 86400 * 1000)).toISOString();
    rows.push({
      id: `SAQ-${String(5001 - i).padStart(5, "0")}`,
      account: accounts[i % accounts.length]!,
      amount,
      fee,
      net,
      status,
      requestedAt: req,
      completedAt:
        status === "concluido"
          ? new Date(Date.parse(req) + (12 + (i % 20)) * 3600 * 1000).toISOString()
          : null,
    });
  }
  return rows;
})();

export type Transfer = {
  id: string;
  recipient: string;
  type: "afiliado" | "coprodutor" | "fornecedor";
  amount: number;
  installments: number;
  paid: number;
  status: "agendado" | "em_andamento" | "concluido";
  period: string;
};

export const transfers: Transfer[] = [
  {
    id: "REP-101",
    recipient: "Rafael Lima",
    type: "afiliado",
    amount: 12840.5,
    installments: 4,
    paid: 3,
    status: "em_andamento",
    period: "2026-08",
  },
  {
    id: "REP-102",
    recipient: "Ana Prado",
    type: "afiliado",
    amount: 8920.3,
    installments: 4,
    paid: 4,
    status: "concluido",
    period: "2026-07",
  },
  {
    id: "REP-103",
    recipient: "Núcleo Digital",
    type: "coprodutor",
    amount: 42300,
    installments: 3,
    paid: 2,
    status: "em_andamento",
    period: "2026-08",
  },
  {
    id: "REP-104",
    recipient: "Bruno Reis",
    type: "afiliado",
    amount: 5210.8,
    installments: 2,
    paid: 0,
    status: "agendado",
    period: "2026-09",
  },
  {
    id: "REP-105",
    recipient: "Carla Souto",
    type: "afiliado",
    amount: 3650.1,
    installments: 2,
    paid: 2,
    status: "concluido",
    period: "2026-07",
  },
  {
    id: "REP-106",
    recipient: "Futura Edu",
    type: "fornecedor",
    amount: 15600,
    installments: 1,
    paid: 0,
    status: "agendado",
    period: "2026-09",
  },
  {
    id: "REP-107",
    recipient: "Thiago Nogueira",
    type: "afiliado",
    amount: 2140.5,
    installments: 2,
    paid: 2,
    status: "concluido",
    period: "2026-07",
  },
];

export type RefundReason = "garantia" | "desistencia" | "fraude" | "erro_operacional" | "outro";

export type Refund = {
  id: string;
  transaction: string;
  customer: string;
  product: string;
  amount: number;
  reason: RefundReason;
  requestedAt: string;
  status: "concluido" | "em_analise" | "rejeitado";
  completedAt: string | null;
};

const refundReasons: RefundReason[] = [
  "garantia",
  "desistencia",
  "fraude",
  "erro_operacional",
  "outro",
];
const refundStatuses: Refund["status"][] = [
  "concluido",
  "concluido",
  "em_analise",
  "concluido",
  "rejeitado",
];

export const refunds: Refund[] = (() => {
  const rows: Refund[] = [];
  const base = Date.parse("2026-08-14T18:00:00Z");
  for (let i = 0; i < 32; i += 1) {
    const src = transactions[i % transactions.length]!;
    const req = new Date(base - i * (1.2 * 86400 * 1000)).toISOString();
    const status = refundStatuses[i % refundStatuses.length]!;
    rows.push({
      id: `EST-${String(8001 - i).padStart(5, "0")}`,
      transaction: src.id,
      customer: src.customer,
      product: src.product,
      amount: src.amount,
      reason: refundReasons[i % refundReasons.length]!,
      requestedAt: req,
      status,
      completedAt:
        status === "concluido" ? new Date(Date.parse(req) + 18 * 3600 * 1000).toISOString() : null,
    });
  }
  return rows;
})();

export type Chargeback = {
  id: string;
  transaction: string;
  customer: string;
  product: string;
  amount: number;
  method: "Cartão";
  arn: string;
  status: "em_disputa" | "perdido" | "ganho";
  reasonCode: string;
  openedAt: string;
  deadline: string;
};

export const chargebacks: Chargeback[] = [
  {
    id: "CHB-10",
    transaction: "TRX-90394",
    customer: "Mariana Rocha",
    product: "Mentoria Cash Pro",
    amount: 1497,
    method: "Cartão",
    arn: "74502918273",
    status: "em_disputa",
    reasonCode: "4837 · Não reconhecido",
    openedAt: "2026-08-12T10:18:00Z",
    deadline: "2026-08-20T23:59:00Z",
  },
  {
    id: "CHB-09",
    transaction: "TRX-90382",
    customer: "Fabrício Melo",
    product: "Curso Tráfego Direto",
    amount: 397,
    method: "Cartão",
    arn: "74502910221",
    status: "perdido",
    reasonCode: "4853 · Produto não entregue",
    openedAt: "2026-08-05T18:30:00Z",
    deadline: "2026-08-13T23:59:00Z",
  },
  {
    id: "CHB-08",
    transaction: "TRX-90370",
    customer: "Sofia Ribeiro",
    product: "Método Escala 7",
    amount: 197,
    method: "Cartão",
    arn: "74502900812",
    status: "ganho",
    reasonCode: "4863 · Contestação",
    openedAt: "2026-07-29T14:40:00Z",
    deadline: "2026-08-06T23:59:00Z",
  },
  {
    id: "CHB-07",
    transaction: "TRX-90355",
    customer: "Thiago Duarte",
    product: "Pack Criativos 2026",
    amount: 89.9,
    method: "Cartão",
    arn: "74502898100",
    status: "em_disputa",
    reasonCode: "4837 · Não reconhecido",
    openedAt: "2026-08-13T08:12:00Z",
    deadline: "2026-08-21T23:59:00Z",
  },
  {
    id: "CHB-06",
    transaction: "TRX-90339",
    customer: "André Silva",
    product: "Comunidade CE PRO",
    amount: 49.9,
    method: "Cartão",
    arn: "74502887215",
    status: "ganho",
    reasonCode: "4841 · Em duplicidade",
    openedAt: "2026-07-18T16:00:00Z",
    deadline: "2026-07-26T23:59:00Z",
  },
];

export type FeeEntry = {
  id: string;
  category: "adquirente" | "antifraude" | "plataforma" | "saque" | "boleto";
  name: string;
  volume: number;
  fee: number;
  rate: number;
};

export const fees: FeeEntry[] = (() => {
  const pixVolume = 520_000;
  const cardVolume = 740_000;
  const boletoVolume = 91_000;
  const rows: FeeEntry[] = [
    {
      id: "TAX-1",
      category: "adquirente",
      name: "Pix · taxa fixa por transação",
      volume: pixVolume,
      fee: 5200 * 0.25,
      rate: 0.25,
    },
    {
      id: "TAX-2",
      category: "adquirente",
      name: "Cartão · taxa + fixa",
      volume: cardVolume,
      fee: cardVolume * 0.0349 + 720,
      rate: 3.49,
    },
    {
      id: "TAX-3",
      category: "boleto",
      name: "Emissão e registro de boleto",
      volume: boletoVolume,
      fee: 210 * 2.9,
      rate: 0.67,
    },
    {
      id: "TAX-4",
      category: "antifraude",
      name: "Antifraude por transação",
      volume: pixVolume + cardVolume + boletoVolume,
      fee: 14100 * 0.35,
      rate: 0.35,
    },
    {
      id: "TAX-5",
      category: "plataforma",
      name: "Cash Engine PRO · SaaS",
      volume: pixVolume + cardVolume,
      fee: (pixVolume + cardVolume) * 0.03,
      rate: 3.0,
    },
    {
      id: "TAX-6",
      category: "saque",
      name: "Saques e TED",
      volume: 95_000,
      fee: 24 * 3.9,
      rate: 0.1,
    },
  ];
  return rows;
})();

export type WebhookEndpoint = {
  id: string;
  url: string;
  events: string[];
  status: "ativo" | "pausado" | "com_erro";
  deliveries: number;
  lastEvent: string | null;
  secret: string;
  created: string;
};

export const webhookEndpoints: WebhookEndpoint[] = [
  {
    id: "wh-701",
    url: "https://api.cliente.com/hooks/cash",
    events: ["order.paid", "order.updated", "refund.created"],
    status: "ativo",
    deliveries: 2187,
    lastEvent: "2026-08-14T14:32:00Z",
    secret: "whsec_e5a17bd38c924721a9b1873af1a09d41",
    created: "2026-06-02T11:10:00Z",
  },
  {
    id: "wh-702",
    url: "https://crm.cliente.com/integrations/cash",
    events: ["customer.created", "order.paid"],
    status: "com_erro",
    deliveries: 124,
    lastEvent: "2026-08-13T22:00:00Z",
    secret: "whsec_82b39c01f44a4f02b5d612e8a30bf218",
    created: "2026-07-10T15:45:00Z",
  },
  {
    id: "wh-703",
    url: "https://automações.erp.com.br/cash",
    events: ["withdraw.completed", "transfer.completed"],
    status: "pausado",
    deliveries: 42,
    lastEvent: "2026-07-29T09:15:00Z",
    secret: "whsec_14c2290e6f1145aa9d3a92f5cf3aa993",
    created: "2026-07-20T10:22:00Z",
  },
];

export type WebhookDelivery = {
  id: string;
  endpointId: string;
  event: string;
  status: number | null;
  attempt: number;
  at: string;
  durationMs: number;
};

export const webhookDeliveries: WebhookDelivery[] = (() => {
  const events = [
    "order.paid",
    "order.updated",
    "refund.created",
    "customer.created",
    "withdraw.completed",
  ];
  const rows: WebhookDelivery[] = [];
  const base = Date.parse("2026-08-14T14:32:00Z");
  for (let i = 0; i < 18; i += 1) {
    const endpointId = webhookEndpoints[i % webhookEndpoints.length]!.id;
    const status = i % 5 === 2 ? 500 : i % 7 === 3 ? 429 : 200;
    rows.push({
      id: `evt_${(100000 + i * 73).toString(36)}`,
      endpointId,
      event: events[i % events.length]!,
      status: i % 11 === 4 ? null : status,
      attempt: 1 + (i % 3),
      at: new Date(base - i * (41 * 60 * 1000)).toISOString(),
      durationMs: 90 + ((i * 37) % 900),
    });
  }
  return rows;
})();

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "ativo" | "convite_pendente" | "inativo";
  lastAccess: string | null;
  createdAt: string;
};

export const teamMembers: TeamMember[] = [
  {
    id: "TE-01",
    name: "Kelvin",
    email: "kelvin@cashengine.pro",
    role: "Proprietário",
    status: "ativo",
    lastAccess: "2026-08-14T18:30:00Z",
    createdAt: "2026-01-10T09:00:00Z",
  },
  {
    id: "TE-02",
    name: "Marina Prado",
    email: "financeiro@cashengine.pro",
    role: "Financeiro",
    status: "ativo",
    lastAccess: "2026-08-14T10:11:00Z",
    createdAt: "2026-03-20T13:00:00Z",
  },
  {
    id: "TE-03",
    name: "Rodolfo Vaz",
    email: "atendimento@cashengine.pro",
    role: "Atendimento",
    status: "ativo",
    lastAccess: "2026-08-13T17:02:00Z",
    createdAt: "2026-04-08T11:30:00Z",
  },
  {
    id: "TE-04",
    name: "Gabriela Souza",
    email: "marketing@cashengine.pro",
    role: "Marketing",
    status: "ativo",
    lastAccess: "2026-08-12T15:20:00Z",
    createdAt: "2026-05-11T09:00:00Z",
  },
  {
    id: "TE-05",
    name: "Integrador Tech",
    email: "tech@parceiro.com",
    role: "Desenvolvedor",
    status: "convite_pendente",
    lastAccess: null,
    createdAt: "2026-08-10T14:00:00Z",
  },
  {
    id: "TE-06",
    name: "Estagiário Adm.",
    email: "estagio@cashengine.pro",
    role: "Leitura",
    status: "inativo",
    lastAccess: "2026-06-30T18:00:00Z",
    createdAt: "2026-02-20T10:00:00Z",
  },
];

export type PermissionGroup = {
  id: string;
  name: string;
  description: string;
  members: number;
  scope: string[];
};

export const permissionGroups: PermissionGroup[] = [
  {
    id: "GRP-01",
    name: "Proprietário",
    description: "Acesso completo à operação",
    members: 1,
    scope: ["tudo"],
  },
  {
    id: "GRP-02",
    name: "Financeiro",
    description: "Extrato, saldo, saques e relatórios financeiros",
    members: 1,
    scope: ["financeiro", "relatorios", "extrato", "saques"],
  },
  {
    id: "GRP-03",
    name: "Atendimento",
    description: "Vendas, clientes e estornos",
    members: 1,
    scope: ["vendas", "clientes", "estornos"],
  },
  {
    id: "GRP-04",
    name: "Marketing",
    description: "Afiliados, marketplace, comissões e checkouts",
    members: 1,
    scope: ["afiliados", "produtos", "checkouts", "marketplace", "comissoes", "links"],
  },
  {
    id: "GRP-05",
    name: "Desenvolvedor",
    description: "API, webhooks, logs e integrações",
    members: 1,
    scope: ["desenvolvedores", "integracoes"],
  },
  {
    id: "GRP-06",
    name: "Leitura",
    description: "Somente visualização de dashboards",
    members: 1,
    scope: ["dashboard", "relatorios"],
  },
];

export type Integration = {
  id: string;
  name: string;
  category: "ERP" | "CRM" | "Email" | "Analytics" | "Outro";
  status: "conectado" | "disponivel" | "em_breve";
  description: string;
};

export const integrations: Integration[] = [
  {
    id: "INT-01",
    name: "RD Station",
    category: "CRM",
    status: "disponivel",
    description: "Sincronia de leads e vendas com o RD Station CRM.",
  },
  {
    id: "INT-02",
    name: "HubSpot",
    category: "CRM",
    status: "disponivel",
    description: "Sincronia bidirecional de clientes e negociações.",
  },
  {
    id: "INT-03",
    name: "ActiveCampaign",
    category: "Email",
    status: "disponivel",
    description: "Triggers de automação por eventos de venda.",
  },
  {
    id: "INT-04",
    name: "Mailchimp",
    category: "Email",
    status: "disponivel",
    description: "Sincronia de clientes para listas e tags.",
  },
  {
    id: "INT-05",
    name: "Google Analytics 4",
    category: "Analytics",
    status: "conectado",
    description: "Eventos de compra enviados ao GA4 via Measurement Protocol.",
  },
  {
    id: "INT-06",
    name: "Meta Ads",
    category: "Analytics",
    status: "disponivel",
    description: "Envio de eventos de compra para otimização de campanhas.",
  },
  {
    id: "INT-07",
    name: "Google Ads",
    category: "Analytics",
    status: "disponivel",
    description: "Conversões offline e gclid para atribuição.",
  },
  {
    id: "INT-08",
    name: "Conta Azul",
    category: "ERP",
    status: "em_breve",
    description: "Integração contábil: faturamento, clientes e notas.",
  },
  {
    id: "INT-09",
    name: "Omie",
    category: "ERP",
    status: "em_breve",
    description: "Emissão de NFSe, boletos e integração financeira.",
  },
  {
    id: "INT-10",
    name: "Zapier",
    category: "Outro",
    status: "disponivel",
    description: "Conecte o Cash Engine PRO a 7 mil+ apps via Zapier.",
  },
  {
    id: "INT-11",
    name: "Make (Integromat)",
    category: "Outro",
    status: "disponivel",
    description: "Automações avançadas com cenários no Make.",
  },
  {
    id: "INT-12",
    name: "Slack",
    category: "Outro",
    status: "disponivel",
    description: "Alertas de vendas aprovadas, saques e chargebacks.",
  },
];

export type SecurityEvent = {
  id: string;
  type:
    | "login"
    | "senha_alterada"
    | "chave_rotacionada"
    | "saque_aprovado"
    | "permissao_alterada"
    | "2fa";
  actor: string;
  ip: string;
  device: string;
  location: string;
  at: string;
  result: "sucesso" | "falha";
};

export const securityEvents: SecurityEvent[] = (() => {
  const rows: SecurityEvent[] = [];
  const actors = ["Kelvin", "Marina Prado", "Rodolfo Vaz"];
  const types: SecurityEvent["type"][] = [
    "login",
    "login",
    "login",
    "senha_alterada",
    "chave_rotacionada",
    "saque_aprovado",
    "2fa",
    "permissao_alterada",
  ];
  const devices = [
    "Chrome · Windows 11",
    "Safari · macOS 14",
    "Edge · Windows 10",
    "Chrome · Android 14",
  ];
  const locations = ["São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Remoto · VPN"];
  const base = Date.parse("2026-08-14T18:30:00Z");
  for (let i = 0; i < 28; i += 1) {
    rows.push({
      id: `SEC-${1000 - i}`,
      type: types[i % types.length]!,
      actor: actors[i % actors.length]!,
      ip: `189.${(i * 31) % 250}.${(i * 13) % 250}.${(i * 7) % 250}`,
      device: devices[i % devices.length]!,
      location: locations[i % locations.length]!,
      at: new Date(base - i * (4 * 3600 * 1000)).toISOString(),
      result: i % 9 === 4 ? "falha" : "sucesso",
    });
  }
  return rows;
})();

export function customerDocumentMasked(d: string) {
  return d.replace(/^(\d{3}).*(\d{2})$/, "$1.***.***-**$2");
}

export const salesSeries = [
  { day: "01", volume: 28400 },
  { day: "04", volume: 33210 },
  { day: "07", volume: 29850 },
  { day: "10", volume: 41230 },
  { day: "13", volume: 38940 },
  { day: "16", volume: 47110 },
  { day: "19", volume: 52380 },
  { day: "22", volume: 48920 },
  { day: "25", volume: 61240 },
  { day: "28", volume: 68410 },
  { day: "30", volume: 74920 },
];

export function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export type CommissionRuleType = "percentual" | "fixa";
export type CommissionRuleScope = "padrao" | "produto" | "afiliado_produto";

export type CommissionRule = {
  id: string;
  scope: CommissionRuleScope;
  type: CommissionRuleType;
  value: number;
  productId?: string;
  productName?: string;
  affiliateId?: string | undefined;
  affiliateName?: string | undefined;
  status: "ativo" | "inativo";
  updatedAt: string;
  updatedBy: string;
};

export const defaultCommissionRule: CommissionRule = {
  id: "RULE-DEFAULT",
  scope: "padrao",
  type: "percentual",
  value: 30,
  status: "ativo",
  updatedAt: "2026-08-01T09:00:00Z",
  updatedBy: "Kelvin",
};

export const platformFeeRule = {
  type: "percentual" as CommissionRuleType,
  value: 3,
  updatedAt: "2026-08-01T09:00:00Z",
  updatedBy: "Kelvin",
};

export const productCommissionRules: CommissionRule[] = [
  {
    id: "RULE-PRD-101",
    scope: "produto",
    type: "percentual",
    value: 40,
    productId: "PRD-101",
    productName: "Método Escala 7",
    status: "ativo",
    updatedAt: "2026-08-10T14:20:00Z",
    updatedBy: "Kelvin",
  },
  {
    id: "RULE-PRD-102",
    scope: "produto",
    type: "percentual",
    value: 20,
    productId: "PRD-102",
    productName: "Mentoria Cash Pro",
    status: "ativo",
    updatedAt: "2026-08-05T11:00:00Z",
    updatedBy: "Kelvin",
  },
  {
    id: "RULE-PRD-103",
    scope: "produto",
    type: "percentual",
    value: 50,
    productId: "PRD-103",
    productName: "Curso Tráfego Direto",
    status: "ativo",
    updatedAt: "2026-08-12T16:45:00Z",
    updatedBy: "Kelvin",
  },
  {
    id: "RULE-PRD-104",
    scope: "produto",
    type: "fixa",
    value: 50,
    productId: "PRD-104",
    productName: "Pack Criativos 2026",
    status: "ativo",
    updatedAt: "2026-08-08T10:15:00Z",
    updatedBy: "Marina Prado",
  },
  {
    id: "RULE-PRD-105",
    scope: "produto",
    type: "percentual",
    value: 25,
    productId: "PRD-105",
    productName: "Comunidade CE PRO",
    status: "ativo",
    updatedAt: "2026-07-28T09:00:00Z",
    updatedBy: "Kelvin",
  },
];

export const affiliateProductCommissionRules: CommissionRule[] = [
  {
    id: "RULE-AFF-PRD-001",
    scope: "afiliado_produto",
    type: "percentual",
    value: 45,
    productId: "PRD-101",
    productName: "Método Escala 7",
    affiliateId: "AFF-01",
    affiliateName: "Rafael Lima",
    status: "ativo",
    updatedAt: "2026-08-14T09:30:00Z",
    updatedBy: "Kelvin",
  },
  {
    id: "RULE-AFF-PRD-002",
    scope: "afiliado_produto",
    type: "percentual",
    value: 55,
    productId: "PRD-103",
    productName: "Curso Tráfego Direto",
    affiliateId: "AFF-02",
    affiliateName: "Ana Prado",
    status: "ativo",
    updatedAt: "2026-08-13T15:10:00Z",
    updatedBy: "Kelvin",
  },
];

export type CommissionHistoryEntry = {
  id: string;
  description: string;
  scope: CommissionRuleScope;
  reference: string;
  previousType?: CommissionRuleType;
  previousValue?: number;
  newType: CommissionRuleType;
  newValue: number;
  changedBy: string;
  changedAt: string;
};

export const commissionHistory: CommissionHistoryEntry[] = [
  {
    id: "HIST-0010",
    description: "Comissão do Produto X alterada",
    scope: "produto",
    reference: "Método Escala 7",
    previousType: "percentual",
    previousValue: 30,
    newType: "percentual",
    newValue: 40,
    changedBy: "Kelvin",
    changedAt: "2026-08-15T10:32:00Z",
  },
  {
    id: "HIST-0009",
    description: "Comissão específica do afiliado criada",
    scope: "afiliado_produto",
    reference: "Rafael Lima · Método Escala 7",
    newType: "percentual",
    newValue: 45,
    changedBy: "Kelvin",
    changedAt: "2026-08-14T09:30:00Z",
  },
  {
    id: "HIST-0008",
    description: "Comissão Curso Tráfego Direto ajustada",
    scope: "produto",
    reference: "Curso Tráfego Direto",
    previousType: "percentual",
    previousValue: 40,
    newType: "percentual",
    newValue: 50,
    changedBy: "Kelvin",
    changedAt: "2026-08-12T16:45:00Z",
  },
  {
    id: "HIST-0007",
    description: "Comissão Pack Criativos alterada para fixa",
    scope: "produto",
    reference: "Pack Criativos 2026",
    previousType: "percentual",
    previousValue: 50,
    newType: "fixa",
    newValue: 50,
    changedBy: "Marina Prado",
    changedAt: "2026-08-08T10:15:00Z",
  },
  {
    id: "HIST-0006",
    description: "Comissão padrão atualizada",
    scope: "padrao",
    reference: "Plataforma",
    previousType: "percentual",
    previousValue: 25,
    newType: "percentual",
    newValue: 30,
    changedBy: "Kelvin",
    changedAt: "2026-08-01T09:00:00Z",
  },
  {
    id: "HIST-0005",
    description: "Taxa da plataforma ajustada",
    scope: "padrao",
    reference: "Plataforma (taxa)",
    previousType: "percentual",
    previousValue: 2.5,
    newType: "percentual",
    newValue: 3,
    changedBy: "Kelvin",
    changedAt: "2026-08-01T09:00:00Z",
  },
];

export type SaleRecord = {
  id: string;
  transactionId: string;
  product: string;
  productId: string;
  grossAmount: number;
  appliedCommissionType: CommissionRuleType;
  appliedCommissionValue: number;
  commissionAmount: number;
  platformFeePercent: number;
  platformFeeAmount: number;
  gatewayFeeAmount: number;
  producerAmount: number;
  affiliateId?: string | undefined;
  affiliateName?: string | undefined;
  date: string;
};

export const saleRecords: SaleRecord[] = transactions
  .filter((t) => t.status === "aprovada")
  .slice(0, 12)
  .map((t, i) => {
    const product = products.find((p) => p.name === t.product);
    const rateType = product?.id === "PRD-104" ? "fixa" : "percentual";
    const rateValue = product?.id === "PRD-104" ? 50 : (product?.commission ?? 30);
    const commissionAmount =
      rateType === "fixa" ? rateValue : Math.round(t.amount * (rateValue / 100) * 100) / 100;
    const platformFee = Math.round(t.amount * 0.03 * 100) / 100;
    const gatewayFee = Math.round((t.amount * 0.0349 + 0.99) * 100) / 100;
    const producer =
      Math.round((t.amount - commissionAmount - platformFee - gatewayFee) * 100) / 100;
    return {
      id: `SR-${String(2001 - i).padStart(5, "0")}`,
      transactionId: t.id,
      product: t.product,
      productId: product?.id ?? "PRD-000",
      grossAmount: t.amount,
      appliedCommissionType: rateType,
      appliedCommissionValue: rateValue,
      commissionAmount,
      platformFeePercent: 3,
      platformFeeAmount: platformFee,
      gatewayFeeAmount: gatewayFee,
      producerAmount: producer,
      affiliateId: t.affiliate ? "AFF-00" : undefined,
      affiliateName: t.affiliate ?? undefined,
      date: t.date,
    };
  });

export type CommunityReply = {
  id: string;
  author: string;
  avatarColor: string;
  role?: string;
  content: string;
  createdAt: string;
  likes: number;
};

export type CommunityPost = {
  id: string;
  author: string;
  avatarColor: string;
  role: "Admin" | "Produtor" | "Afiliado";
  content: string;
  createdAt: string;
  likes: number;
  liked: boolean;
  replies: CommunityReply[];
  mock?: boolean;
};

export const communityPosts: CommunityPost[] = [
  {
    id: "POST-0001",
    author: "Kelvin",
    avatarColor: "from-primary to-blue-500",
    role: "Admin",
    content:
      "Alguém já testou o novo checkout? Estou curtindo muito a performance e a taxa de conversão subiu quase 12% nos últimos 3 dias.",
    createdAt: "2026-08-15T09:12:00Z",
    likes: 24,
    liked: false,
    mock: true,
    replies: [
      {
        id: "REP-0001-1",
        author: "Victor",
        avatarColor: "from-emerald-500 to-teal-500",
        content:
          "Sim, aqui funcionou perfeitamente. O Pix aprovou em menos de 2 segundos em todos os testes.",
        createdAt: "2026-08-15T09:48:00Z",
        likes: 6,
      },
      {
        id: "REP-0001-2",
        author: "Marcos",
        avatarColor: "from-amber-500 to-orange-500",
        content: "Como faço para configurar meu link de afiliado direto para esse checkout novo?",
        createdAt: "2026-08-15T10:30:00Z",
        likes: 2,
      },
    ],
  },
  {
    id: "POST-0002",
    author: "Ana Prado",
    avatarColor: "from-pink-500 to-rose-500",
    role: "Afiliado",
    content:
      "Dica rápida: usando o link de afiliado com UTMs, o dashboard de comissões já mostra origem e campanha automaticamente. Mudou meu jogo na hora de otimizar campanhas.",
    createdAt: "2026-08-14T19:44:00Z",
    likes: 41,
    liked: true,
    mock: true,
    replies: [
      {
        id: "REP-0002-1",
        author: "Bruno Reis",
        avatarColor: "from-violet-500 to-purple-500",
        content: "Muito bom! Compartilha algum modelo de planilha de acompanhamento?",
        createdAt: "2026-08-14T20:10:00Z",
        likes: 3,
      },
    ],
  },
  {
    id: "POST-0003",
    author: "Rafael Lima",
    avatarColor: "from-sky-500 to-blue-600",
    role: "Afiliado",
    content:
      "A nova Calculadora Financeira ficou show. Finalmente consigo simular comissão real por produto e mostrar para o produtor antes de negociar.",
    createdAt: "2026-08-14T14:22:00Z",
    likes: 18,
    liked: false,
    mock: true,
    replies: [],
  },
  {
    id: "POST-0004",
    author: "Marina Prado",
    avatarColor: "from-cyan-500 to-sky-500",
    role: "Produtor",
    content:
      "Alguém tem um fluxo de retentativa de pagamento recomendado? As taxas de recuperação aqui estão em 18% e quero chegar a 30%.",
    createdAt: "2026-08-13T11:05:00Z",
    likes: 12,
    liked: false,
    mock: true,
    replies: [
      {
        id: "REP-0004-1",
        author: "Kelvin",
        avatarColor: "from-primary to-blue-500",
        role: "Admin",
        content:
          "Marina, já ativou a régua automática de recuperação em Configurações > Integrações > Email? Lá tem modelo pronto.",
        createdAt: "2026-08-13T12:18:00Z",
        likes: 8,
      },
    ],
  },
];

export type TrainingLesson = {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: "video" | "text" | "quiz";
};

export type TrainingModule = {
  id: string;
  title: string;
  description: string;
  lessons: TrainingLesson[];
};

export type Training = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: TrainingCategoryKey;
  cover: string;
  status: "publicado" | "rascunho";
  publishedAt: string;
  modules: TrainingModule[];
  progressPercent: number;
  lastLessonId?: string;
  allowedRoles: RoleKey[];
};

export type TrainingCategoryKey = "comece-aqui" | "vendas" | "afiliados" | "trafego" | "plataforma";

export type TrainingCategory = {
  key: TrainingCategoryKey;
  label: string;
  description: string;
  icon: string;
};

export const trainingCategories: TrainingCategory[] = [
  {
    key: "comece-aqui",
    label: "Comece aqui",
    description: "Introdução ao Cash Engine PRO.",
    icon: "rocket",
  },
  {
    key: "vendas",
    label: "Vendas",
    description: "Conteúdos relacionados a vendas e conversão.",
    icon: "shopping",
  },
  {
    key: "afiliados",
    label: "Afiliados",
    description: "Divulgação, links e comissões.",
    icon: "handshake",
  },
  { key: "trafego", label: "Tráfego", description: "Aquisição de clientes.", icon: "target" },
  {
    key: "plataforma",
    label: "Plataforma",
    description: "Tutoriais sobre utilização do Cash Engine PRO.",
    icon: "settings",
  },
];

export const trainings: Training[] = [
  {
    id: "TRN-001",
    title: "Primeiros passos no Cash Engine PRO",
    subtitle: "Do zero à primeira venda em 7 dias.",
    description:
      "Aprenda a configurar sua operação, cadastrar seu primeiro produto e começar a vender utilizando toda a potência do Cash Engine PRO.",
    category: "comece-aqui",
    cover: "linear-gradient(135deg,#0ea5e9,#6366f1)",
    status: "publicado",
    publishedAt: "2026-07-10T09:00:00Z",
    progressPercent: 80,
    lastLessonId: "LSN-001-02-02",
    allowedRoles: ["super-admin", "produtor", "afiliado"],
    modules: [
      {
        id: "MOD-001-01",
        title: "Módulo 01 — Introdução",
        description: "Conhecendo a plataforma e preparando sua conta.",
        lessons: [
          {
            id: "LSN-001-01-01",
            title: "Bem-vindo ao Cash Engine PRO",
            duration: "05:12",
            completed: true,
            type: "video",
          },
          {
            id: "LSN-001-01-02",
            title: "Conhecendo o painel",
            duration: "08:44",
            completed: true,
            type: "video",
          },
          {
            id: "LSN-001-01-03",
            title: "Configurando sua conta",
            duration: "11:20",
            completed: true,
            type: "video",
          },
        ],
      },
      {
        id: "MOD-001-02",
        title: "Módulo 02 — Produtos",
        description: "Crie, configure e venda.",
        lessons: [
          {
            id: "LSN-001-02-01",
            title: "Criando seu produto",
            duration: "14:07",
            completed: true,
            type: "video",
          },
          {
            id: "LSN-001-02-02",
            title: "Configurando o checkout",
            duration: "18:33",
            completed: true,
            type: "video",
          },
          {
            id: "LSN-001-02-03",
            title: "Configurando afiliados",
            duration: "12:51",
            completed: false,
            type: "video",
          },
        ],
      },
      {
        id: "MOD-001-03",
        title: "Módulo 03 — Vendas",
        description: "Acompanhamento e análise.",
        lessons: [
          {
            id: "LSN-001-03-01",
            title: "Acompanhando vendas",
            duration: "09:15",
            completed: false,
            type: "video",
          },
          {
            id: "LSN-001-03-02",
            title: "Entendendo transações",
            duration: "10:48",
            completed: false,
            type: "video",
          },
          {
            id: "LSN-001-03-03",
            title: "Analisando resultados",
            duration: "15:02",
            completed: false,
            type: "video",
          },
        ],
      },
    ],
  },
  {
    id: "TRN-002",
    title: "Afiliados na Prática",
    subtitle: "Como escalar com uma rede de afiliados.",
    description:
      "Aprenda a criar um programa de afiliados estruturado, configurar links comissionados, gerenciar comissões e analisar performance.",
    category: "afiliados",
    cover: "linear-gradient(135deg,#10b981,#0ea5e9)",
    status: "publicado",
    publishedAt: "2026-08-01T10:00:00Z",
    progressPercent: 25,
    allowedRoles: ["super-admin", "produtor", "afiliado"],
    modules: [
      {
        id: "MOD-002-01",
        title: "Módulo 01 — Estrutura",
        description: "Montando seu programa.",
        lessons: [
          {
            id: "LSN-002-01-01",
            title: "Definindo comissões competitivas",
            duration: "12:10",
            completed: true,
            type: "video",
          },
          {
            id: "LSN-002-01-02",
            title: "Regras e critérios claros",
            duration: "09:33",
            completed: false,
            type: "text",
          },
          {
            id: "LSN-002-01-03",
            title: "Convidando afiliados",
            duration: "08:20",
            completed: false,
            type: "video",
          },
        ],
      },
      {
        id: "MOD-002-02",
        title: "Módulo 02 — Operação",
        description: "Dia a dia com a rede.",
        lessons: [
          {
            id: "LSN-002-02-01",
            title: "Aprovando e onboarding",
            duration: "10:00",
            completed: false,
            type: "video",
          },
          {
            id: "LSN-002-02-02",
            title: "Materiais de divulgação",
            duration: "11:45",
            completed: false,
            type: "text",
          },
        ],
      },
    ],
  },
  {
    id: "TRN-003",
    title: "Checkout que Converte",
    subtitle: "Aumente sua taxa de pagamento aprovado.",
    description:
      "Checkout builder passo a passo, melhores práticas de UX e como configurar meios de pagamento que convertem mais.",
    category: "vendas",
    cover: "linear-gradient(135deg,#ef4444,#f97316)",
    status: "publicado",
    publishedAt: "2026-08-05T08:00:00Z",
    progressPercent: 0,
    allowedRoles: ["super-admin", "produtor"],
    modules: [
      {
        id: "MOD-003-01",
        title: "Módulo 01 — Fundamentos",
        description: "Entenda o funil de pagamento.",
        lessons: [
          {
            id: "LSN-003-01-01",
            title: "Anatomia de um checkout",
            duration: "14:22",
            completed: false,
            type: "video",
          },
          {
            id: "LSN-003-01-02",
            title: "Métodos de pagamento ideais",
            duration: "10:18",
            completed: false,
            type: "text",
          },
        ],
      },
    ],
  },
  {
    id: "TRN-004",
    title: "Tráfego Pago para Afiliados",
    subtitle: "Google, Meta e campanhas lucrativas.",
    description:
      "Como estruturar campanhas de tráfego pago como afiliado, acompanhar ROI e escalar sem quebrar o caixa.",
    category: "trafego",
    cover: "linear-gradient(135deg,#8b5cf6,#ec4899)",
    status: "publicado",
    publishedAt: "2026-08-10T12:00:00Z",
    progressPercent: 0,
    allowedRoles: ["super-admin", "produtor", "afiliado"],
    modules: [
      {
        id: "MOD-004-01",
        title: "Módulo 01 — Começando",
        description: "Primeiros passos em paid media.",
        lessons: [
          {
            id: "LSN-004-01-01",
            title: "Escolhendo a fonte de tráfego",
            duration: "13:40",
            completed: false,
            type: "video",
          },
          {
            id: "LSN-004-01-02",
            title: "Pixel e eventos na prática",
            duration: "16:55",
            completed: false,
            type: "video",
          },
        ],
      },
    ],
  },
  {
    id: "TRN-005",
    title: "Split Engine Avançado",
    subtitle: "Regras de distribuição financeira.",
    description:
      "Configurar regras de split, comissões por produto, simular distribuições e garantir fechamento financeiro correto.",
    category: "plataforma",
    cover: "linear-gradient(135deg,#0f172a,#475569)",
    status: "rascunho",
    publishedAt: "2026-08-12T09:00:00Z",
    progressPercent: 0,
    allowedRoles: ["super-admin", "produtor"],
    modules: [
      {
        id: "MOD-005-01",
        title: "Módulo 01 — Conceitos",
        description: "Como o split funciona.",
        lessons: [
          {
            id: "LSN-005-01-01",
            title: "Introdução ao Split Engine",
            duration: "09:12",
            completed: false,
            type: "video",
          },
          {
            id: "LSN-005-01-02",
            title: "Exemplo prático de distribuição",
            duration: "12:40",
            completed: false,
            type: "video",
          },
        ],
      },
    ],
  },
];

export type RoleKey = "admin_global" | "super-admin" | "produtor" | "afiliado";
