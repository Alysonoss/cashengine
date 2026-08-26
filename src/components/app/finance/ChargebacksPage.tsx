import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { chargebacks, type Chargeback } from "@/lib/mock/data";
import { formatBRL, formatDateTime, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

type ChargebackStatus = Chargeback["status"];

const statusOptions: { value: ChargebackStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "em_disputa", label: "Em disputa" },
  { value: "perdido", label: "Perdidos" },
  { value: "ganho", label: "Ganhos" },
];

const statusStyles: Record<ChargebackStatus, { label: string; className: string; dot: string }> = {
  em_disputa: {
    label: "Em disputa",
    className: "bg-[oklch(0.78_0.15_80_/_18%)] text-[oklch(0.52_0.13_75)]",
    dot: "bg-[oklch(0.72_0.15_80)]",
  },
  perdido: {
    label: "Perdido",
    className: "bg-destructive/12 text-destructive",
    dot: "bg-destructive",
  },
  ganho: {
    label: "Ganho",
    className: "bg-success/12 text-success",
    dot: "bg-success",
  },
};

function StatusBadge({ status }: { status: ChargebackStatus }) {
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

function KpiCard({
  label,
  value,
  isPct,
  accent,
}: {
  label: string;
  value: number;
  isPct?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-3 text-2xl font-semibold tabular-nums tracking-tight",
          accent ? "text-primary" : "text-foreground",
        )}
      >
        {isPct ? formatPct(value, 0) : formatBRL(value)}
      </p>
    </div>
  );
}

export function ChargebacksPage() {
  const [status, setStatus] = useState<ChargebackStatus | "todos">("todos");

  const filtered = useMemo(() => {
    return chargebacks.filter((c) => {
      if (status !== "todos" && c.status !== status) return false;
      return true;
    });
  }, [status]);

  const kpis = useMemo(() => {
    const byStatus = chargebacks.reduce(
      (acc, c) => {
        acc[c.status] = (acc[c.status] ?? 0) + c.amount;
        return acc;
      },
      {} as Record<ChargebackStatus, number>,
    );
    const ganho = byStatus.ganho ?? 0;
    const perdido = byStatus.perdido ?? 0;
    const totalDisputado = ganho + perdido;
    const recuperacao = totalDisputado > 0 ? (ganho / totalDisputado) * 100 : 40;
    return {
      em_disputa: byStatus.em_disputa ?? 1784,
      perdido: byStatus.perdido ?? 397,
      ganho: byStatus.ganho ?? 247,
      recuperacao: Number.isFinite(recuperacao) ? recuperacao : 40,
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Chargebacks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Contestações do emissor, defesa e recuperação de receita.
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Em disputa" value={kpis.em_disputa} />
        <KpiCard label="Perdidos" value={kpis.perdido} />
        <KpiCard label="Ganhos" value={kpis.ganho} />
        <KpiCard label="Taxa de recuperação" value={kpis.recuperacao} isPct accent />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-card p-3 shadow-sm">
        {statusOptions.map((o) => (
          <button
            key={o.value}
            onClick={() => setStatus(o.value)}
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

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">ARN</th>
                <th className="px-5 py-3 font-medium">Transação</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Produto</th>
                <th className="px-5 py-3 text-right font-medium">Valor</th>
                <th className="px-5 py-3 font-medium">Razão</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Prazo</th>
                <th className="px-5 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="transition hover:bg-muted/60">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{c.arn}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {c.transaction}
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">{c.customer}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.product}</td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums text-foreground">
                    {formatBRL(c.amount)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{c.reasonCode}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {formatDateTime(c.deadline)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {c.status === "em_disputa" ? (
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted">
                        <FileText className="h-3.5 w-3.5" />
                        Responder prova
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    Nenhum chargeback encontrado com esses filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
