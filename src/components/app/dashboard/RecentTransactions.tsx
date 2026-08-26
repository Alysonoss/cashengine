import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { transactions, type TransactionStatus } from "@/lib/mock/data";
import { formatBRL, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusStyles: Record<TransactionStatus, { label: string; className: string; dot: string }> = {
  aprovada: { label: "Aprovada", className: "bg-success/12 text-success", dot: "bg-success" },
  pendente: {
    label: "Pendente",
    className: "bg-[oklch(0.78_0.15_80_/_18%)] text-[oklch(0.52_0.13_75)]",
    dot: "bg-[oklch(0.72_0.15_80)]",
  },
  recusada: {
    label: "Recusada",
    className: "bg-destructive/12 text-destructive",
    dot: "bg-destructive",
  },
  estornada: {
    label: "Estornada",
    className: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

export function StatusBadge({ status }: { status: TransactionStatus }) {
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

export function RecentTransactions() {
  const rows = transactions.slice(0, 7);

  return (
    <section className="flex flex-col rounded-xl border border-border bg-card shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Últimas transações
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Atualizado em tempo real</p>
        </div>
        <Link
          to="/app/transacoes"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Ver todas
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <ul className="divide-y divide-border">
        {rows.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{t.customer}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                <span className="font-mono">{t.id}</span> · {t.method} · {formatDateTime(t.date)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {formatBRL(t.amount)}
              </span>
              <StatusBadge status={t.status} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
