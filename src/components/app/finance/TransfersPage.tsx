import { useMemo } from "react";
import { transfers, type Transfer } from "@/lib/mock/data";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";

type TransferStatus = Transfer["status"];
type TransferType = Transfer["type"];

const typeStyles: Record<TransferType, { label: string; className: string }> = {
  afiliado: { label: "Afiliado", className: "bg-primary/12 text-primary" },
  coprodutor: { label: "Coprodutor", className: "bg-success/12 text-success" },
  fornecedor: {
    label: "Fornecedor",
    className: "bg-[oklch(0.78_0.15_80_/_18%)] text-[oklch(0.52_0.13_75)]",
  },
};

const statusStyles: Record<TransferStatus, { label: string; className: string; dot: string }> = {
  agendado: {
    label: "Agendado",
    className: "bg-[oklch(0.78_0.15_80_/_18%)] text-[oklch(0.52_0.13_75)]",
    dot: "bg-[oklch(0.72_0.15_80)]",
  },
  em_andamento: {
    label: "Em andamento",
    className: "bg-primary/12 text-primary",
    dot: "bg-primary",
  },
  concluido: {
    label: "Concluído",
    className: "bg-success/12 text-success",
    dot: "bg-success",
  },
};

function TypeBadge({ type }: { type: TransferType }) {
  const s = typeStyles[type];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}

function StatusBadge({ status }: { status: TransferStatus }) {
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

function KpiCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-3 text-2xl font-semibold tabular-nums tracking-tight",
          accent ? "text-primary" : "text-foreground",
        )}
      >
        {formatBRL(value, { compact: true })}
      </p>
    </div>
  );
}

export function TransfersPage() {
  const kpis = useMemo(() => {
    const byStatus = transfers.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] ?? 0) + t.amount;
        return acc;
      },
      {} as Record<TransferStatus, number>,
    );
    return {
      agendado: byStatus.agendado ?? 22900000,
      em_andamento: byStatus.em_andamento ?? 55100000,
      concluido: byStatus.concluido ?? 12500000,
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Repasses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Distribuição automática para afiliados, coprodutores e fornecedores.
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Agendados" value={kpis.agendado} />
        <KpiCard label="Em andamento" value={kpis.em_andamento} accent />
        <KpiCard label="Concluídos" value={kpis.concluido} />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Beneficiário</th>
                <th className="px-5 py-3 font-medium">Tipo</th>
                <th className="px-5 py-3 text-right font-medium">Valor</th>
                <th className="px-5 py-3 text-right font-medium">Parcelas</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Período</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transfers.map((t) => (
                <tr key={t.id} className="transition hover:bg-muted/60">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{t.recipient}</td>
                  <td className="px-5 py-3">
                    <TypeBadge type={t.type} />
                  </td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums text-foreground">
                    {formatBRL(t.amount)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {t.paid}/{t.installments}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {t.period}
                  </td>
                </tr>
              ))}
              {transfers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    Nenhum repasse encontrado.
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
