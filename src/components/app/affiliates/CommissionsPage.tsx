import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  Wallet,
  XCircle,
} from "lucide-react";
import {
  affiliatesFull,
  commissions,
  type Commission,
  type CommissionStatus,
} from "@/lib/mock/data";
import { formatBRL, formatDateTime, formatInt } from "@/lib/format";
import { CardsSkeleton, TableSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { EmptyState } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const statusOptions = ["todos", "liberada", "pendente", "paga", "cancelada"] as const;
type StatusFilter = (typeof statusOptions)[number];
const periodOptions = ["30d", "7d", "hoje"] as const;
type PeriodFilter = (typeof periodOptions)[number];
const PAGE_SIZE = 12;

function StatusPill({ status }: { status: CommissionStatus }) {
  const map: Record<CommissionStatus, string> = {
    liberada: "bg-emerald-500/10 text-emerald-700",
    pendente: "bg-amber-500/10 text-amber-700",
    paga: "bg-blue-500/10 text-blue-700",
    cancelada: "bg-rose-500/10 text-rose-700",
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

export function CommissionsPage() {
  const loading = useFakeLoading();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("todos");
  const [affiliate, setAffiliate] = useState<string>("todos");
  const [period, setPeriod] = useState<PeriodFilter>("30d");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = Date.now();
    const periodMs =
      period === "hoje" ? 24 * 3600 * 1000 : period === "7d" ? 7 * 86400 * 1000 : 30 * 86400 * 1000;

    return commissions.filter((c) => {
      if (status !== "todos" && c.status !== status) return false;
      if (affiliate !== "todos" && c.affiliate !== affiliate) return false;
      if (now - new Date(c.saleAt).getTime() > periodMs) return false;
      if (!q) return true;
      return (
        c.id.toLowerCase().includes(q) ||
        c.affiliate.toLowerCase().includes(q) ||
        c.product.toLowerCase().includes(q) ||
        c.transaction.toLowerCase().includes(q)
      );
    });
  }, [query, status, affiliate, period]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const liberated = filtered
    .filter((c) => c.status === "liberada")
    .reduce((acc, c) => acc + c.value, 0);
  const pending = filtered
    .filter((c) => c.status === "pendente")
    .reduce((acc, c) => acc + c.value, 0);
  const paid = filtered.filter((c) => c.status === "paga").reduce((acc, c) => acc + c.value, 0);

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
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Comissões</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cálculo por venda, status de liquidação e histórico.
          </p>
        </div>
      </header>

      <div className="mt-6">
        {loading ? (
          <CardsSkeleton count={3} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              icon={CheckCircle2}
              label="Liberadas"
              value="R$ 42,8 mil"
              hint={`${formatBRL(liberated, { compact: true })} filtradas`}
              accent
            />
            <KpiCard
              icon={Clock}
              label="Pendentes"
              value="R$ 19,1 mil"
              hint={`${formatBRL(pending, { compact: true })} filtradas`}
            />
            <KpiCard
              icon={Wallet}
              label="Pagas"
              value="R$ 142,9 mil"
              hint={`${formatBRL(paid, { compact: true })} filtradas`}
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
            placeholder="Buscar por ID, afiliado, produto ou transação"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {periodOptions.map((p) => (
            <button
              key={p}
              onClick={() => reset(setPeriod)(p)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                period === p
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {p === "30d" ? "30 dias" : p === "7d" ? "7 dias" : "Hoje"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => reset(setStatus)(e.target.value as StatusFilter)}
            className="h-9 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-primary/60"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === "todos" ? "Todos os status" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={affiliate}
            onChange={(e) => reset(setAffiliate)(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-primary/60"
          >
            <option value="todos">Todos os afiliados</option>
            {affiliatesFull.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>

          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {loading ? (
          <TableSkeleton rows={6} cols={9} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={XCircle}
            title="Nenhuma comissão encontrada"
            description="Ajuste os filtros de status, afiliado ou período para encontrar o que procura."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">ID</th>
                    <th className="px-5 py-3 font-medium">Afiliado</th>
                    <th className="px-5 py-3 font-medium">Transação</th>
                    <th className="px-5 py-3 font-medium">Produto</th>
                    <th className="px-5 py-3 text-right font-medium">Bruto</th>
                    <th className="px-5 py-3 text-right font-medium">Taxa</th>
                    <th className="px-5 py-3 text-right font-medium">Valor</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Venda em</th>
                    <th className="px-5 py-3 text-right font-medium">Liquidação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((c: Commission) => (
                    <tr key={c.id} className="transition-colors hover:bg-muted/50">
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                      <td className="px-5 py-3 font-medium text-foreground">{c.affiliate}</td>
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                        {c.transaction}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{c.product}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                        {formatBRL(c.gross)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                        {c.rate}%
                      </td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums text-foreground">
                        {formatBRL(c.value)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusPill status={c.status} />
                      </td>
                      <td className="px-5 py-3 tabular-nums text-muted-foreground">
                        {formatDateTime(c.saleAt)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                        {formatDateTime(c.liquidityAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
              <p className="text-xs text-muted-foreground">
                Página {current} de {totalPages} · {formatInt(filtered.length)} comissões
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
