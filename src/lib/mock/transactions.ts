import {
  transactions as seed,
  type PaymentMethod,
  type Transaction,
  type TransactionStatus,
} from "@/lib/mock/data";

const customers = [
  "Marina Alves",
  "Diego Souza",
  "Camila Ferreira",
  "Lucas Martins",
  "Beatriz Nunes",
  "Rodrigo Pinto",
  "Juliana Castro",
  "Felipe Andrade",
  "Tatiane Rocha",
  "Gustavo Mendes",
  "Larissa Dias",
  "Eduardo Ramos",
  "Patrícia Gomes",
  "Vinícius Barros",
  "Aline Cardoso",
  "Henrique Melo",
  "Sofia Ribeiro",
  "Otávio Freitas",
  "Renata Lopes",
  "Caio Teixeira",
];

const catalog: { product: string; amount: number }[] = [
  { product: "Método Escala 7", amount: 197 },
  { product: "Mentoria Cash Pro", amount: 1497 },
  { product: "Pack Criativos 2026", amount: 89.9 },
  { product: "Curso Tráfego Direto", amount: 397 },
  { product: "Comunidade CE PRO", amount: 49.9 },
  { product: "Workshop Split Avançado", amount: 297 },
];

const methods: PaymentMethod[] = ["Pix", "Cartão", "Boleto"];
const statuses: TransactionStatus[] = [
  "aprovada",
  "aprovada",
  "aprovada",
  "aprovada",
  "aprovada",
  "aprovada",
  "pendente",
  "pendente",
  "recusada",
  "estornada",
];
const affiliateNames = [null, "Rafael Lima", "Ana Prado", "Bruno Reis", "Carla Souto", null];

/** Deterministic pseudo-random so SSR and client render identically. */
function rng(seedValue: number) {
  let s = seedValue;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function generate(): Transaction[] {
  const rand = rng(20260814);
  const base = Date.parse("2026-08-13T11:00:00Z");
  const rows: Transaction[] = [];

  for (let i = 0; i < 112; i += 1) {
    const item = catalog[Math.floor(rand() * catalog.length)]!;
    const date = new Date(base - i * (37 * 60 * 1000 + Math.floor(rand() * 22) * 60 * 1000));
    rows.push({
      id: `TRX-${90394 - i}`,
      customer: customers[Math.floor(rand() * customers.length)]!,
      product: item.product,
      amount: item.amount,
      method: methods[Math.floor(rand() * methods.length)]!,
      status: statuses[Math.floor(rand() * statuses.length)]!,
      affiliate: affiliateNames[Math.floor(rand() * affiliateNames.length)] ?? null,
      date: date.toISOString(),
    });
  }

  return rows;
}

export const allTransactions: Transaction[] = [...seed, ...generate()];

export function customerEmail(name: string) {
  return `${name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ".")}@email.com`;
}

export type TimelineStep = {
  label: string;
  description: string;
  at: string | null;
  state: "done" | "current" | "failed" | "pending";
};

export function buildTimeline(t: Transaction): TimelineStep[] {
  const start = Date.parse(t.date);
  const at = (min: number) => new Date(start + min * 60 * 1000).toISOString();

  const steps: TimelineStep[] = [
    {
      label: "Checkout iniciado",
      description: "Cliente abriu o checkout e preencheu os dados.",
      at: at(-6),
      state: "done",
    },
    {
      label: "Pedido criado",
      description: `Pedido gerado com pagamento via ${t.method}.`,
      at: at(-4),
      state: "done",
    },
    {
      label:
        t.method === "Pix"
          ? "QR Code gerado"
          : t.method === "Boleto"
            ? "Boleto emitido"
            : "Autorização solicitada",
      description:
        t.method === "Cartão"
          ? "Enviado ao adquirente para autorização."
          : "Aguardando confirmação do banco emissor.",
      at: at(-3),
      state: "done",
    },
  ];

  if (t.status === "recusada") {
    steps.push({
      label: "Pagamento recusado",
      description: "Emissor retornou o código 51 · saldo insuficiente.",
      at: t.date,
      state: "failed",
    });
    steps.push({
      label: "Retentativa disponível",
      description: "Régua de recuperação acionada por e-mail.",
      at: null,
      state: "pending",
    });
    return steps;
  }

  if (t.status === "pendente") {
    steps.push({
      label: "Aguardando pagamento",
      description:
        t.method === "Boleto"
          ? "Compensação em até 2 dias úteis."
          : "Aguardando confirmação do pagador.",
      at: t.date,
      state: "current",
    });
    steps.push({
      label: "Liberação de acesso",
      description: "Ocorre automaticamente após a confirmação.",
      at: null,
      state: "pending",
    });
    return steps;
  }

  steps.push({
    label: "Pagamento aprovado",
    description: "Confirmação recebida e antifraude liberado.",
    at: t.date,
    state: "done",
  });
  steps.push({
    label: "Split executado",
    description: "Valores distribuídos entre produtor, afiliado e plataforma.",
    at: at(1),
    state: "done",
  });
  steps.push({
    label: "Acesso liberado",
    description: "Cliente recebeu e-mail com as credenciais.",
    at: at(2),
    state: "done",
  });

  if (t.status === "estornada") {
    steps.push({
      label: "Estorno solicitado",
      description: "Dentro do prazo de garantia de 7 dias.",
      at: at(2880),
      state: "done",
    });
    steps.push({
      label: "Estorno concluído",
      description: "Valor devolvido e split revertido.",
      at: at(2940),
      state: "failed",
    });
  }

  return steps;
}

export type SplitShare = {
  key: "produtor" | "afiliado" | "plataforma" | "taxa";
  label: string;
  percent: number;
  amount: number;
};

export function splitOf(amount: number, hasAffiliate: boolean): SplitShare[] {
  const gatewayFee = amount * 0.0349 + 0.99;
  const platform = amount * 0.03;
  const affiliate = hasAffiliate ? amount * 0.3 : 0;
  const producer = amount - gatewayFee - platform - affiliate;

  const rows: SplitShare[] = [
    { key: "produtor", label: "Produtor", percent: (producer / amount) * 100, amount: producer },
  ];
  if (hasAffiliate) {
    rows.push({
      key: "afiliado",
      label: "Afiliado",
      percent: (affiliate / amount) * 100,
      amount: affiliate,
    });
  }
  rows.push(
    {
      key: "plataforma",
      label: "Cash Engine PRO",
      percent: (platform / amount) * 100,
      amount: platform,
    },
    {
      key: "taxa",
      label: "Taxa de processamento",
      percent: (gatewayFee / amount) * 100,
      amount: gatewayFee,
    },
  );
  return rows;
}
