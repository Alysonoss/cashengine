import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { orders, type Order, type OrderStatus, type PaymentMethod } from "@/lib/mock/data";
import { formatBRL, formatDateTime, formatInt } from "@/lib/format";
import { CardsSkeleton, TableSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { EmptyState } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const statusOptions: { value: OrderStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "aprovado", label: "Aprovados" },
  { value: "processando", label: "Processando" },
  { value: "pendente", label: "Pendentes" },
  { value: "cancelado", label: "Cancelados" },
  { value: "enviado", label: "Enviados" },
  { value: "entregue", label: "Entregues" },
];

const methodOptions: (PaymentMethod | "todos")[] = ["todos", "Pix", "Cartão", "Boleto"];
const PAGE_SIZE = 12;

function OrderStatusPill({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    aprovado: "bg-emerald-500/10 text-emerald-700",
    processando: "bg-blue-500/10 text-blue-700",
    pendente: "bg-amber-500/10 text-amber-700",
    cancelado: "bg-rose-500/10 text-rose-700",
    enviado: "bg-indigo-500/10 text-indigo-700",
    entregue: "bg-emerald-500/10 text-emerald-700",
  };
  return (
    <span
      className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", map[status])}
    >
      {status}
    </span>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </span>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p
        className={
          accent
            ? "mt-4 text-2xl font-semibold tabular-nums tracking-tight text-primary"
            : "mt-4 text-2xl font-semibold tabular-nums tracking-tight text-foreground"
        }
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function VendasPage() {
  const loading = useFakeLoading();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "todos">("todos");
  const [method, setMethod] = useState<PaymentMethod | "todos">("todos");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (status !== "todos" && o.status !== status) return false;
      if (method !== "todos" && o.method !== method) return false;
      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q)
      );
    });
  }, [query, status, method]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const totalRevenue = filtered.reduce((acc, o) => acc + o.amount, 0);
  const avgTicket = filtered.length > 0 ? totalRevenue / filtered.length : 0;

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
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Vendas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe pedidos, receita e status de cada venda.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted">
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </header>

      <div className="mt-6">
        {loading ? (
          <CardsSkeleton count={3} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              icon={ShoppingBag}
              label="Pedidos"
              value={formatInt(5046)}
              hint={`${formatInt(filtered.length)} no filtro atual`}
              accent
            />
            <KpiCard
              icon={Wallet}
              label="Receita"
              value="R$ 1,4 mi"
              hint={`${formatBRL(totalRevenue)} filtrados`}
            />
            <KpiCard
              icon={TrendingUp}
              label="Ticket médio"
              value={formatBRL(268.4)}
              hint={`${formatBRL(avgTicket)} no filtro atual`}
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => reset(setQuery)(e.target.value)}
            placeholder="Buscar por pedido, cliente ou produto"
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

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {loading ? (
          <TableSkeleton rows={6} cols={7} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Nenhuma venda encontrada"
            description="Ajuste a busca ou os filtros de status e método para encontrar o que procura."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Pedido</th>
                    <th className="px-5 py-3 font-medium">Cliente</th>
                    <th className="px-5 py-3 font-medium">Produto</th>
                    <th className="px-5 py-3 text-right font-medium">Valor</th>
                    <th className="px-5 py-3 font-medium">Método</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((o: Order) => (
                    <tr key={o.id} className="transition-colors hover:bg-muted/50">
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{o.id}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-foreground">{o.customer}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{o.email}</p>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{o.product}</td>
                      <td className="px-5 py-3 text-right font-medium tabular-nums text-foreground">
                        {formatBRL(o.amount)}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{o.method}</td>
                      <td className="px-5 py-3">
                        <OrderStatusPill status={o.status} />
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                        {formatDateTime(o.date)}
                      </td>
                    </tr>
                  ))}
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
          </>
        )}
      </section>
    </div>
  );
}
