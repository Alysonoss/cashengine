import { Clock, Lock, Wallet } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { availableSpark, balances, pendingSpark, reservedSpark } from "@/lib/mock/finance";
import { formatBRL } from "@/lib/format";
import { CardsSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { StatementTable } from "@/components/app/finance/StatementTable";
import { WithdrawDialog } from "@/components/app/finance/WithdrawDialog";
import { BalanceStatementTabs } from "@/components/app/finance/BalanceStatementTabs";
import type { LucideIcon } from "lucide-react";

function Spark({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 28 - ((v - min) / Math.max(1, max - min)) * 24;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="mt-4 h-8 w-full">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function BalanceCard({
  icon: Icon,
  label,
  value,
  hint,
  data,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  hint: string;
  data: number[];
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
        {formatBRL(value)}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      <div className={accent ? "text-primary" : "text-muted-foreground/50"}>
        <Spark data={data} />
      </div>
    </div>
  );
}

export function BalancePage() {
  const loading = useFakeLoading();

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <BalanceStatementTabs />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Saldo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Carteira da operação, liberações futuras e saques.
          </p>
        </div>
        <WithdrawDialog />
      </header>

      <div className="mt-6">
        {loading ? (
          <CardsSkeleton count={3} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <BalanceCard
              icon={Wallet}
              label="Saldo disponível"
              value={balances.available}
              hint="Pronto para saque imediato"
              data={availableSpark}
              accent
            />
            <BalanceCard
              icon={Clock}
              label="Pendente"
              value={balances.pending}
              hint="Liberação em D+2 a D+30"
              data={pendingSpark}
            />
            <BalanceCard
              icon={Lock}
              label="Reservado"
              value={balances.reserved}
              hint="Reserva de segurança para estornos"
              data={reservedSpark}
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Últimos lançamentos
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Entradas, taxas, comissões e saques
          </p>
        </div>
        <Link to="/app/extrato" className="text-xs font-medium text-primary hover:underline">
          Ver extrato completo
        </Link>
      </div>

      <div className="mt-3">
        <StatementTable loading={loading} pageSize={8} limit={30} />
      </div>
    </div>
  );
}
