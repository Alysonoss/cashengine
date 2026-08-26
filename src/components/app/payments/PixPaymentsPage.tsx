import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, Copy, Download, QrCode, Search, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { confirmDemoPayment, useDemoCommerce, type DemoPaymentStatus } from "@/lib/demo-commerce";
import { formatBRL, formatDateTime, formatInt } from "@/lib/format";
import { cn } from "@/lib/utils";

const filters: Array<{ value: "todos" | DemoPaymentStatus; label: string }> = [
  { value: "todos", label: "Todos" },
  { value: "pago", label: "Pagos" },
  { value: "pendente", label: "Pendentes" },
  { value: "cancelado", label: "Cancelados" },
];

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function exportCsv(rows: ReturnType<typeof useDemoCommerce>["payments"]) {
  const header = [
    "id",
    "referencia",
    "produto",
    "cliente",
    "email",
    "valor",
    "status",
    "criado_em",
    "pago_em",
  ];
  const body = rows.map((payment) => [
    payment.id,
    payment.reference,
    payment.product,
    payment.customer,
    payment.email,
    payment.amount.toFixed(2),
    payment.status,
    payment.createdAt,
    payment.paidAt ?? "",
  ]);
  const csv = [header, ...body]
    .map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "pagamentos-pix-teste.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function PixPaymentsPage() {
  const commerce = useDemoCommerce();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"todos" | DemoPaymentStatus>("todos");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return commerce.payments.filter((payment) => {
      if (status !== "todos" && payment.status !== status) return false;
      if (!q) return true;
      return (
        payment.id.toLowerCase().includes(q) ||
        payment.reference.toLowerCase().includes(q) ||
        payment.product.toLowerCase().includes(q) ||
        payment.customer.toLowerCase().includes(q) ||
        payment.email.toLowerCase().includes(q)
      );
    });
  }, [commerce.payments, query, status]);

  const paid = commerce.payments.filter((payment) => payment.status === "pago");
  const pending = commerce.payments.filter((payment) => payment.status === "pendente");
  const paidVolume = paid.reduce((sum, payment) => sum + payment.amount, 0);

  const summary = [
    {
      label: "Pagamentos",
      value: formatInt(commerce.payments.length),
      detail: "Cobranças Pix criadas",
      icon: WalletCards,
    },
    {
      label: "Pagos",
      value: formatInt(paid.length),
      detail: formatBRL(paidVolume),
      icon: CheckCircle2,
    },
    {
      label: "Pendentes",
      value: formatInt(pending.length),
      detail: "Aguardando confirmação",
      icon: Clock3,
    },
    {
      label: "Método",
      value: "Pix",
      detail: "Chave TESTE configurada",
      icon: QrCode,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Pagamentos Pix
            </h1>
            <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-600 dark:text-amber-400">
              TESTE
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe as cobranças geradas pelos checkouts dos seus links de pagamento.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            exportCsv(rows);
            toast.success("CSV de pagamentos exportado.");
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <section
              key={item.label}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {item.label}
                </p>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
            </section>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por cliente, produto, referência ou ID"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter.value}
              onClick={() => setStatus(filter.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                status === filter.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">Pagamento</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Produto</th>
                <th className="px-5 py-3 font-medium">Produtor</th>
                <th className="px-5 py-3 text-right font-medium">Valor</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Criado</th>
                <th className="px-5 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((payment) => {
                const link = commerce.links.find((item) => item.id === payment.linkId);
                return (
                  <tr key={payment.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs font-medium text-foreground">
                        {payment.reference}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {payment.id}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">{payment.customer}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {payment.email || "Sem e-mail"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-foreground">{payment.product}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{link?.seller || "TESTE"}</td>
                    <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-foreground">
                      {formatBRL(payment.amount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          payment.status === "pago" &&
                            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                          payment.status === "pendente" &&
                            "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                          payment.status === "cancelado" && "bg-muted text-muted-foreground",
                        )}
                      >
                        {payment.status === "pago"
                          ? "Pago"
                          : payment.status === "pendente"
                            ? "Pendente"
                            : "Cancelado"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {formatDateTime(payment.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            await copyToClipboard(payment.pixPayload);
                            toast.success("Pix Copia e Cola copiado.");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copiar Pix
                        </button>
                        {payment.status === "pendente" && (
                          <button
                            type="button"
                            onClick={() => {
                              confirmDemoPayment(payment.id);
                              toast.success("Pagamento confirmado no modo TESTE.");
                            }}
                            className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                          >
                            Confirmar TESTE
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center text-sm text-muted-foreground">
                    Nenhum pagamento encontrado com esses filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/25 p-4 text-xs leading-5 text-muted-foreground">
        No modo TESTE, o botão <strong className="text-foreground">Confirmar TESTE</strong> simula o
        evento que futuramente será recebido do PSP ou banco pelo webhook. O QR Code continua sendo
        gerado a partir da chave Pix configurada no projeto.
      </div>
    </div>
  );
}
