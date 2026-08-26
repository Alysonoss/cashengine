import { Counter } from "./Counter";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, CreditCard, Users, Wallet } from "lucide-react";

const bars = [42, 58, 36, 74, 51, 88, 66, 95];

export function DashboardMock() {
  const reduced = useReducedMotion();

  return (
    <div className="surface-card relative overflow-hidden rounded-2xl p-4 shadow-2xl sm:p-6">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-40" />
      <div className="relative">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Visão geral da operação
            </p>
            <p className="truncate font-display text-lg font-semibold">Dashboard</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            ao vivo
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric
            icon={<Wallet className="h-4 w-4" />}
            label="Saldo disponível"
            prefix="R$ "
            end={184320}
            decimals={2}
          />
          <Metric icon={<CreditCard className="h-4 w-4" />} label="Transações hoje" end={1287} />
          <Metric
            icon={<Users className="h-4 w-4" />}
            label="Conversão"
            end={7.4}
            decimals={1}
            suffix="%"
          />
        </div>

        <div className="mt-4 rounded-xl border border-border bg-surface-strong/60 p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <p className="min-w-0 truncate text-sm text-muted-foreground">
              Volume processado · últimos 30 dias
            </p>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-success">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +18,2%
            </span>
          </div>

          <svg
            viewBox="0 0 320 96"
            className="mt-4 h-24 w-full"
            role="img"
            aria-label="Gráfico de volume processado"
          >
            <defs>
              <linearGradient id="ce-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--primary-soft)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 78 C 40 70, 56 40, 92 46 S 150 74, 182 44 S 240 18, 276 26 S 310 12, 320 8"
              fill="none"
              stroke="url(#ce-line)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </svg>

          <div className="mt-4 flex h-16 items-end gap-1.5">
            {bars.map((h, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-sm bg-primary/45"
                initial={reduced ? false : { height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.7, delay: 0.15 * i, ease: "easeOut" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  end,
  prefix,
  suffix,
  decimals = 0,
}: {
  icon: React.ReactNode;
  label: string;
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/70 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-primary-soft">{icon}</span>
        <span className="truncate text-xs">{label}</span>
      </div>
      <p className="mt-2 font-display text-xl font-semibold tabular-nums sm:text-2xl">
        <Counter end={end} decimals={decimals} prefix={prefix ?? ""} suffix={suffix ?? ""} />
      </p>
    </div>
  );
}
