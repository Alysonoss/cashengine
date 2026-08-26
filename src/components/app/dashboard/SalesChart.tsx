import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  CreditCard,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { periods, useAppShell, type PeriodKey } from "@/components/app/app-shell-context";
import { seriesByPeriod } from "@/lib/mock/dashboard";
import { formatBRL, formatInt, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as { volume: number; sales: number };
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
        {formatBRL(point.volume)}
      </p>
      <p className="text-xs text-muted-foreground">{formatInt(point.sales)} vendas</p>
    </div>
  );
}

type DeltaBadgeProps = { value: number; suffix?: string };

function DeltaBadge({ value, suffix = "%" }: DeltaBadgeProps) {
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        positive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600",
      )}
    >
      {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {positive ? "+" : ""}
      {value.toFixed(1)}
      {suffix}
    </span>
  );
}

function MiniKpi({
  icon: Icon,
  label,
  value,
  badge,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="truncate text-sm font-semibold tabular-nums text-foreground">{value}</p>
          {badge}
        </div>
      </div>
    </div>
  );
}

export function SalesChart() {
  const { period, setPeriod } = useAppShell();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const data = seriesByPeriod[period];
  const totalRevenue = useMemo(() => data.reduce((acc, p) => acc + p.volume, 0), [data]);
  const totalSales = useMemo(() => data.reduce((acc, p) => acc + p.sales, 0), [data]);
  const avgTicket = useMemo(
    () => (totalSales > 0 ? totalRevenue / totalSales : 0),
    [totalRevenue, totalSales],
  );

  const { growthRevenue, growthSales } = useMemo(() => {
    const deltasByPeriod: Record<PeriodKey, { revenue: number; sales: number }> = {
      hoje: { revenue: 12.6, sales: 9.8 },
      "7d": { revenue: 18.4, sales: 14.2 },
      "30d": { revenue: 24.7, sales: 19.3 },
      "90d": { revenue: 41.2, sales: 33.7 },
      "12m": { revenue: 62.1, sales: 54.3 },
    };
    return {
      growthRevenue: deltasByPeriod[period]?.revenue ?? 0,
      growthSales: deltasByPeriod[period]?.sales ?? 0,
    };
  }, [period]);

  const tickInterval = Math.max(0, Math.floor(data.length / 7) - 1);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Evolução de faturamento
            </h2>
            <DeltaBadge value={growthRevenue} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatBRL(totalRevenue)} processados no período · comparativo vs período anterior
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-border bg-muted/60 p-0.5">
          {periods.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key as PeriodKey)}
              className={cn(
                "rounded-[7px] px-3 py-1.5 text-xs font-medium transition-colors",
                period === p.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniKpi
          icon={CreditCard}
          label="Faturamento bruto"
          value={formatBRL(totalRevenue)}
          badge={<DeltaBadge value={growthRevenue} />}
        />
        <MiniKpi
          icon={ShoppingBag}
          label="Número de vendas"
          value={formatInt(totalSales)}
          badge={<DeltaBadge value={growthSales} />}
        />
        <MiniKpi
          icon={Calculator}
          label="Ticket médio"
          value={formatBRL(avgTicket)}
          badge={
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              R$ / venda
            </span>
          }
        />
        <MiniKpi
          icon={TrendingUp}
          label="Crescimento acum."
          value={formatPct(growthRevenue)}
          badge={<DeltaBadge value={growthSales} suffix=" pp" />}
        />
      </div>

      <div className="mt-6 h-[320px] w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.26} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="4 6" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                interval={tickInterval}
                tickMargin={12}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={78}
                tickMargin={8}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                tickFormatter={(v: number) =>
                  formatBRL(v, { compact: true }).replace(/ /g, "\u00a0")
                }
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "var(--color-primary)", strokeOpacity: 0.35, strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="var(--color-primary)"
                strokeWidth={2.2}
                fill="url(#volumeFill)"
                activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--color-card)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full rounded-lg bg-muted/50" />
        )}
      </div>
    </section>
  );
}
