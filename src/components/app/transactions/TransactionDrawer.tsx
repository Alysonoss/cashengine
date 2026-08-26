import { AlertTriangle, Check, Clock, Copy, Mail, Receipt, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/app/dashboard/RecentTransactions";
import { buildTimeline, customerEmail, splitOf } from "@/lib/mock/transactions";
import type { Transaction } from "@/lib/mock/data";
import { formatBRL, formatDateTime, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

const stateStyles = {
  done: { dot: "bg-success text-success-foreground", line: "bg-success/30", Icon: Check },
  current: { dot: "bg-primary text-primary-foreground", line: "bg-border", Icon: Clock },
  failed: {
    dot: "bg-destructive text-destructive-foreground",
    line: "bg-border",
    Icon: AlertTriangle,
  },
  pending: { dot: "bg-muted text-muted-foreground", line: "bg-border", Icon: Clock },
} as const;

export function TransactionDrawer({
  transaction,
  onOpenChange,
}: {
  transaction: Transaction | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={!!transaction} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-lg">
        {transaction ? <DrawerBody t={transaction} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function DrawerBody({ t }: { t: Transaction }) {
  const timeline = buildTimeline(t);
  const shares = splitOf(t.amount, !!t.affiliate);

  return (
    <div className="flex flex-col">
      <SheetHeader className="space-y-3 border-b border-border px-6 py-5 text-left">
        <div className="flex items-center gap-2">
          <StatusBadge status={t.status} />
          <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
        </div>
        <SheetTitle className="text-2xl font-semibold tracking-tight tabular-nums">
          {formatBRL(t.amount)}
        </SheetTitle>
        <SheetDescription>
          {t.product} · {t.method} · {formatDateTime(t.date)}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 px-6 py-6">
        <section className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Cliente
          </h3>
          <div className="mt-3 space-y-2 text-sm">
            <Row icon={User} label="Nome" value={t.customer} />
            <Row icon={Mail} label="E-mail" value={customerEmail(t.customer)} />
            <Row icon={Receipt} label="Afiliado" value={t.affiliate ?? "Venda direta"} />
            <Row icon={Copy} label="Referência" value={`${t.id}-${t.method.toUpperCase()}`} mono />
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Timeline do pagamento
          </h3>
          <ol className="mt-4 space-y-0">
            {timeline.map((step, i) => {
              const s = stateStyles[step.state];
              const last = i === timeline.length - 1;
              return (
                <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
                  {!last && (
                    <span
                      className={cn(
                        "absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-px",
                        s.line,
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-[1] mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full",
                      s.dot,
                    )}
                  >
                    <s.Icon className="h-3 w-3" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{step.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
                    <p className="mt-1 text-[11px] tabular-nums text-muted-foreground/80">
                      {step.at ? formatDateTime(step.at) : "—"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="rounded-xl border border-border bg-muted/40 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Distribuição do valor
          </h3>
          <ul className="mt-3 space-y-2">
            {shares.map((s) => (
              <li key={s.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {s.label}
                  <span className="ml-1.5 text-xs text-muted-foreground/70">
                    {formatPct(s.percent)}
                  </span>
                </span>
                <span className="font-medium tabular-nums text-foreground">
                  {formatBRL(s.amount)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className={cn("truncate text-foreground", mono && "font-mono text-xs")}>{value}</span>
    </div>
  );
}
