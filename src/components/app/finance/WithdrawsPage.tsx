import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { withdraws, type WithdrawStatus } from "@/lib/mock/data";
import { formatBRL, formatDateTime, formatInt } from "@/lib/format";
import { cn } from "@/lib/utils";
import { WithdrawDialog } from "@/components/app/finance/WithdrawDialog";
import { BalanceStatementTabs } from "@/components/app/finance/BalanceStatementTabs";

const statusOptions: { value: WithdrawStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "solicitado", label: "Solicitado" },
  { value: "processando", label: "Processando" },
  { value: "concluido", label: "Concluído" },
  { value: "rejeitado", label: "Rejeitado" },
];

const statusStyles: Record<WithdrawStatus, { label: string; className: string; dot: string }> = {
  solicitado: {
    label: "Solicitado",
    className: "bg-[oklch(0.78_0.15_80_/_18%)] text-[oklch(0.52_0.13_75)]",
    dot: "bg-[oklch(0.72_0.15_80)]",
  },
  processando: {
    label: "Processando",
    className: "bg-primary/12 text-primary",
    dot: "bg-primary",
  },
  concluido: {
    label: "Concluído",
    className: "bg-success/12 text-success",
    dot: "bg-success",
  },
  rejeitado: {
    label: "Rejeitado",
    className: "bg-destructive/12 text-destructive",
    dot: "bg-destructive",
  },
};

function StatusBadge({ status }: { status: WithdrawStatus }) {
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

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
        {formatBRL(value)}
      </p>
    </div>
  );
}

const PAGE_SIZE = 12;

export function WithdrawsPage() {
  const [status, setStatus] = useState<WithdrawStatus | "todos">("todos");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return withdraws.filter((w) => {
      if (status !== "todos" && w.status !== status) return false;
      return true;
    });
  }, [status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const kpis = useMemo(() => {
    const byStatus = withdraws.reduce(
      (acc, w) => {
        acc[w.status] = (acc[w.status] ?? 0) + w.amount;
        return acc;
      },
      {} as Record<WithdrawStatus, number>,
    );
    return {
      solicitado: byStatus.solicitado ?? 0,
      processando: byStatus.processando ?? 0,
      concluido: byStatus.concluido ?? 0,
      rejeitado: byStatus.rejeitado ?? 0,
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <BalanceStatementTabs />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Saques</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Solicitações de saque e status de liquidação.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted">
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
          <WithdrawDialog />
        </div>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Solicitados" value={kpis.solicitado} />
        <KpiCard label="Processando" value={kpis.processando} />
        <KpiCard label="Concluídos" value={kpis.concluido} />
        <KpiCard label="Rejeitados" value={kpis.rejeitado} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-card p-3 shadow-sm">
        {statusOptions.map((o) => (
          <button
            key={o.value}
            onClick={() => {
              setStatus(o.value);
              setPage(1);
            }}
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
        <div className="ml-auto text-xs text-muted-foreground">
          {formatInt(filtered.length)} saques
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Conta destino</th>
                <th className="px-5 py-3 text-right font-medium">Valor bruto</th>
                <th className="px-5 py-3 text-right font-medium">Taxa</th>
                <th className="px-5 py-3 text-right font-medium">Líquido</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Solicitado em</th>
                <th className="px-5 py-3 text-right font-medium">Concluído em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((w) => (
                <tr key={w.id} className="transition hover:bg-muted/60">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{w.id}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{w.account}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-foreground">
                    {formatBRL(w.amount)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {formatBRL(w.fee)}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums text-foreground">
                    {formatBRL(w.net)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={w.status} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {formatDateTime(w.requestedAt)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {w.completedAt ? formatDateTime(w.completedAt) : "—"}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    Nenhum saque encontrado com esses filtros.
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
