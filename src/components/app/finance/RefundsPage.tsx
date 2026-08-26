import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { refunds, type Refund, type RefundReason } from "@/lib/mock/data";
import { formatBRL, formatDateTime, formatInt, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import { BalanceStatementTabs } from "@/components/app/finance/BalanceStatementTabs";

type RefundStatus = Refund["status"];

const statusOptions: { value: RefundStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "concluido", label: "Concluídos" },
  { value: "em_analise", label: "Em análise" },
  { value: "rejeitado", label: "Rejeitados" },
];

const reasonOptions: (RefundReason | "todos")[] = [
  "todos",
  "garantia",
  "desistencia",
  "fraude",
  "erro_operacional",
  "outro",
];

const reasonLabel: Record<RefundReason, string> = {
  garantia: "Garantia",
  desistencia: "Desistência",
  fraude: "Fraude",
  erro_operacional: "Erro operacional",
  outro: "Outro",
};

const reasonStyles: Record<RefundReason, string> = {
  garantia: "bg-primary/12 text-primary",
  desistencia: "bg-[oklch(0.78_0.15_80_/_18%)] text-[oklch(0.52_0.13_75)]",
  fraude: "bg-destructive/12 text-destructive",
  erro_operacional: "bg-muted text-muted-foreground",
  outro: "bg-muted text-muted-foreground",
};

const statusStyles: Record<RefundStatus, { label: string; className: string; dot: string }> = {
  concluido: {
    label: "Concluído",
    className: "bg-success/12 text-success",
    dot: "bg-success",
  },
  em_analise: {
    label: "Em análise",
    className: "bg-[oklch(0.78_0.15_80_/_18%)] text-[oklch(0.52_0.13_75)]",
    dot: "bg-[oklch(0.72_0.15_80)]",
  },
  rejeitado: {
    label: "Rejeitado",
    className: "bg-destructive/12 text-destructive",
    dot: "bg-destructive",
  },
};

function ReasonBadge({ reason }: { reason: RefundReason }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        reasonStyles[reason],
      )}
    >
      {reasonLabel[reason]}
    </span>
  );
}

function StatusBadge({ status }: { status: RefundStatus }) {
  const s = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        s.className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

function KpiCard({ label, value, isPct }: { label: string; value: number; isPct?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
        {isPct ? formatPct(value, 1) : formatBRL(value)}
      </p>
    </div>
  );
}

const PAGE_SIZE = 12;

export function RefundsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<RefundStatus | "todos">("todos");
  const [reason, setReason] = useState<RefundReason | "todos">("todos");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return refunds.filter((r) => {
      if (status !== "todos" && r.status !== status) return false;
      if (reason !== "todos" && r.reason !== reason) return false;
      if (!q) return true;
      return (
        r.id.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.transaction.toLowerCase().includes(q) ||
        r.product.toLowerCase().includes(q)
      );
    });
  }, [query, status, reason]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const kpis = useMemo(() => {
    const byStatus = refunds.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] ?? 0) + r.amount;
        return acc;
      },
      {} as Record<RefundStatus, number>,
    );
    const totalRefunded = byStatus.concluido ?? 0;
    const totalVolume = refunds.reduce((acc, r) => acc + r.amount, 0);
    const rate = totalVolume > 0 ? (totalRefunded / (totalVolume + 700000)) * 100 : 1.8;
    return {
      concluido: byStatus.concluido ?? 12840,
      em_analise: byStatus.em_analise ?? 6432,
      rate: Number.isFinite(rate) ? rate : 1.8,
    };
  }, []);

  function reset<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <BalanceStatementTabs />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Estornos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Garantia, desistência e reembolso do cliente.
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Concluídos" value={kpis.concluido} />
        <KpiCard label="Em análise" value={kpis.em_analise} />
        <KpiCard label="Taxa de estorno" value={kpis.rate} isPct />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => reset(setQuery)(e.target.value)}
            placeholder="Buscar por ID, cliente, transação ou produto"
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
          <select
            value={reason}
            onChange={(e) => reset(setReason)(e.target.value as RefundReason | "todos")}
            className="h-9 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-primary/60"
          >
            {reasonOptions.map((r) => (
              <option key={r} value={r}>
                {r === "todos" ? "Todos os motivos" : reasonLabel[r]}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-muted-foreground">{formatInt(filtered.length)} estornos</div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Transação</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Produto</th>
                <th className="px-5 py-3 text-right font-medium">Valor</th>
                <th className="px-5 py-3 font-medium">Motivo</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Solicitado em</th>
                <th className="px-5 py-3 text-right font-medium">Concluído em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="transition hover:bg-muted/60">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {r.transaction}
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">{r.customer}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.product}</td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums text-foreground">
                    {formatBRL(r.amount)}
                  </td>
                  <td className="px-5 py-3">
                    <ReasonBadge reason={r.reason} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {formatDateTime(r.requestedAt)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {r.completedAt ? formatDateTime(r.completedAt) : "—"}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    Nenhum estorno encontrado com esses filtros.
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
    </div>
  );
}
