import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Search, SlidersHorizontal } from "lucide-react";
import { StatusBadge } from "@/components/app/dashboard/RecentTransactions";
import { TransactionDrawer } from "@/components/app/transactions/TransactionDrawer";
import { allTransactions } from "@/lib/mock/transactions";
import type { PaymentMethod, Transaction, TransactionStatus } from "@/lib/mock/data";
import { formatBRL, formatDateTime, formatInt } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusOptions: { value: TransactionStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "aprovada", label: "Aprovadas" },
  { value: "pendente", label: "Pendentes" },
  { value: "recusada", label: "Recusadas" },
  { value: "estornada", label: "Estornadas" },
];

const methodOptions: (PaymentMethod | "todos")[] = ["todos", "Pix", "Cartão", "Boleto"];
const PAGE_SIZE = 12;

export function TransactionsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TransactionStatus | "todos">("todos");
  const [method, setMethod] = useState<PaymentMethod | "todos">("todos");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTransactions.filter((t) => {
      if (status !== "todos" && t.status !== status) return false;
      if (method !== "todos" && t.method !== method) return false;
      if (!q) return true;
      return (
        t.id.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.product.toLowerCase().includes(q)
      );
    });
  }, [query, status, method]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const approvedVolume = filtered
    .filter((t) => t.status === "aprovada")
    .reduce((acc, t) => acc + t.amount, 0);

  function reset<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Transações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatInt(filtered.length)} transações · {formatBRL(approvedVolume)} aprovados
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted">
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => reset(setQuery)(e.target.value)}
            placeholder="Buscar por ID, cliente ou produto"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {statusOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => reset(setStatus)(o.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                status === o.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            value={method}
            onChange={(e) => reset(setMethod)(e.target.value as PaymentMethod | "todos")}
            className="h-9 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-primary/60"
          >
            {methodOptions.map((m) => (
              <option key={m} value={m}>
                {m === "todos" ? "Todos os métodos" : m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Produto</th>
                <th className="px-5 py-3 text-right font-medium">Valor</th>
                <th className="px-5 py-3 font-medium">Método</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className="cursor-pointer transition hover:bg-muted/60"
                >
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{t.customer}</td>
                  <td className="px-5 py-3 text-muted-foreground">{t.product}</td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums text-foreground">
                    {formatBRL(t.amount)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{t.method}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {formatDateTime(t.date)}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    Nenhuma transação encontrada com esses filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
          <p className="text-xs text-muted-foreground">
            Página {current} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, current - 1))}
              disabled={current === 1}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Anterior
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, current + 1))}
              disabled={current === totalPages}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-40"
            >
              Próxima
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <TransactionDrawer transaction={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}
