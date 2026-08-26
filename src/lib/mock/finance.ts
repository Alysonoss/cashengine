export type LedgerCategory = "venda" | "taxa" | "comissao" | "saque" | "estorno";

export type StatementRow = {
  id: string;
  date: string;
  description: string;
  category: LedgerCategory;
  type: "credito" | "debito";
  amount: number;
  balance: number;
};

export const balances = {
  available: 184320.45,
  pending: 76940.1,
  reserved: 21480,
};

export const availableSpark = [42, 48, 45, 53, 61, 58, 66, 72, 69, 78, 84, 91];
export const pendingSpark = [30, 34, 31, 38, 36, 41, 44, 40, 46, 49, 47, 52];
export const reservedSpark = [18, 19, 18, 20, 21, 20, 22, 21, 23, 22, 24, 23];

export const bankAccounts = [
  { id: "acc-1", label: "Nubank · Ag 0001 · CC 12345-6" },
  { id: "acc-2", label: "Itaú · Ag 3312 · CC 88210-4" },
  { id: "acc-3", label: "Pix · CNPJ 41.882.310/0001-09" },
];

export const WITHDRAW_FEE = 3.9;

const seedRows: Omit<StatementRow, "balance">[] = [];

const catalog = [
  { product: "Método Escala 7", amount: 197 },
  { product: "Mentoria Cash Pro", amount: 1497 },
  { product: "Pack Criativos 2026", amount: 89.9 },
  { product: "Curso Tráfego Direto", amount: 397 },
  { product: "Comunidade CE PRO", amount: 49.9 },
];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = rng(880114);
const base = Date.parse("2026-08-14T18:00:00Z");
let n = 7100;

for (let i = 0; i < 46; i += 1) {
  const item = catalog[Math.floor(rand() * catalog.length)]!;
  const date = new Date(base - i * (3 * 60 + Math.floor(rand() * 180)) * 60 * 1000).toISOString();
  seedRows.push({
    id: `LG-${n--}`,
    date,
    description: `Venda aprovada · ${item.product}`,
    category: "venda",
    type: "credito",
    amount: item.amount,
  });
  seedRows.push({
    id: `LG-${n--}`,
    date,
    description: "Taxa de processamento",
    category: "taxa",
    type: "debito",
    amount: Math.round((item.amount * 0.0349 + 0.99) * 100) / 100,
  });
  const r = rand();
  if (r > 0.55) {
    seedRows.push({
      id: `LG-${n--}`,
      date,
      description: `Comissão de afiliado · ${["Rafael Lima", "Ana Prado", "Bruno Reis"][Math.floor(rand() * 3)]}`,
      category: "comissao",
      type: "debito",
      amount: Math.round(item.amount * 0.3 * 100) / 100,
    });
  }
  if (i % 11 === 5) {
    seedRows.push({
      id: `LG-${n--}`,
      date,
      description: "Saque para conta bancária",
      category: "saque",
      type: "debito",
      amount: 12000,
    });
  }
  if (i % 17 === 9) {
    seedRows.push({
      id: `LG-${n--}`,
      date,
      description: `Estorno · ${item.product}`,
      category: "estorno",
      type: "debito",
      amount: item.amount,
    });
  }
}

/** Extrato com saldo acumulado, do mais recente para o mais antigo. */
export const statement: StatementRow[] = (() => {
  const ordered = [...seedRows].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  let running = balances.available;
  return ordered.map((row) => {
    const withBalance: StatementRow = { ...row, balance: Math.round(running * 100) / 100 };
    running -= row.type === "credito" ? row.amount : -row.amount;
    return withBalance;
  });
})();

export const categoryLabel: Record<LedgerCategory, string> = {
  venda: "Venda",
  taxa: "Taxa",
  comissao: "Comissão",
  saque: "Saque",
  estorno: "Estorno",
};
