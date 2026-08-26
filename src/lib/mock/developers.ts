export type ApiKey = {
  id: string;
  env: "teste" | "producao";
  kind: "publica" | "secreta";
  label: string;
  value: string;
  createdAt: string;
  lastUsed: string | null;
};

export const apiKeys: ApiKey[] = [
  {
    id: "key-1",
    env: "teste",
    kind: "publica",
    label: "Chave publicável",
    value: "pk_test_9f4c1ab27de84c0fa1b6d3e75c209aa1",
    createdAt: "2026-05-02T10:00:00Z",
    lastUsed: "2026-08-14T09:12:00Z",
  },
  {
    id: "key-2",
    env: "teste",
    kind: "secreta",
    label: "Chave secreta",
    value: "sk_test_2b71e6d0c94f4a1e8d55f3c7b0a92e44",
    createdAt: "2026-05-02T10:00:00Z",
    lastUsed: "2026-08-14T08:41:00Z",
  },
  {
    id: "key-3",
    env: "producao",
    kind: "publica",
    label: "Chave publicável",
    value: "pk_live_71ac9e35bb2247d0af1c6e88d40b7f12",
    createdAt: "2026-06-18T14:30:00Z",
    lastUsed: "2026-08-14T14:32:00Z",
  },
  {
    id: "key-4",
    env: "producao",
    kind: "secreta",
    label: "Chave secreta",
    value: "sk_live_d3f5077a1c6b4b23a9e2c8f1904ab6ce",
    createdAt: "2026-06-18T14:30:00Z",
    lastUsed: "2026-08-14T14:32:00Z",
  },
];

export function maskKey(value: string) {
  const prefix = value.slice(0, value.indexOf("_", value.indexOf("_") + 1) + 1);
  return `${prefix}${"•".repeat(24)}`;
}

export type AuditRow = {
  id: string;
  actor: string;
  action: string;
  target: string;
  date: string;
  result: "sucesso" | "falha";
  ip: string;
};

const actors = ["Kelvin", "Sistema", "Ana Prado", "Rafael Lima", "Bruno Reis"];
const actions: { action: string; target: string }[] = [
  { action: "Gerou nova chave de API", target: "sk_live_••••" },
  { action: "Webhook order.paid entregue", target: "https://api.cliente.com/hooks" },
  { action: "Tentativa de login", target: "painel/login" },
  { action: "Aprovou saque", target: "R$ 12.000,00" },
  { action: "Editou regra de split", target: "Método Escala 7" },
  { action: "Criou produto", target: "Templates de Checkout" },
  { action: "Estornou transação", target: "TRX-90404" },
  { action: "Atualizou dados bancários", target: "Itaú · CC 88210-4" },
  { action: "Convidou membro da equipe", target: "financeiro@cashengine.pro" },
  { action: "Rotacionou chave secreta", target: "sk_test_••••" },
];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export const auditRows: AuditRow[] = (() => {
  const rand = rng(41221);
  const base = Date.parse("2026-08-14T17:40:00Z");
  const rows: AuditRow[] = [];
  for (let i = 0; i < 42; i += 1) {
    const a = actions[Math.floor(rand() * actions.length)]!;
    rows.push({
      id: `LOG-${8830 - i}`,
      actor: actors[Math.floor(rand() * actors.length)]!,
      action: a.action,
      target: a.target,
      date: new Date(base - i * (26 + Math.floor(rand() * 90)) * 60 * 1000).toISOString(),
      result: rand() > 0.14 ? "sucesso" : "falha",
      ip: `189.${Math.floor(rand() * 250)}.${Math.floor(rand() * 250)}.${Math.floor(rand() * 250)}`,
    });
  }
  return rows;
})();

export const curlSample = `curl https://api.cashenginepro.com/v1/charges \\
  -H "Authorization: Bearer sk_live_••••••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 19700,
    "currency": "BRL",
    "payment_method": "pix",
    "customer": { "name": "Marina Alves", "email": "marina@email.com" }
  }'`;
