import type { PeriodKey } from "@/components/app/app-shell-context";

export type SeriesPoint = {
  label: string;
  volume: number;
  sales: number;
};

/** Gerador determinístico (sem Math.random) para manter SSR e cliente iguais. */
function wave(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function buildDaily(days: number, base: number, growth: number): SeriesPoint[] {
  const start = new Date(Date.UTC(2026, 7, 14));
  const points: SeriesPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() - i);
    const weekday = d.getUTCDay();
    // fim de semana vende menos
    const weekendFactor = weekday === 0 ? 0.72 : weekday === 6 ? 0.82 : 1;
    const trend = 1 + ((days - 1 - i) / Math.max(days - 1, 1)) * growth;
    const noise = 0.88 + wave(i + days) * 0.26;
    const volume = Math.round(base * weekendFactor * trend * noise);
    points.push({
      label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "UTC" }),
      volume,
      sales: Math.round(volume / 268),
    });
  }
  return points;
}

function buildHourly(): SeriesPoint[] {
  const shape = [
    0.12, 0.08, 0.05, 0.04, 0.04, 0.06, 0.14, 0.28, 0.46, 0.62, 0.74, 0.8, 0.72, 0.68, 0.78, 0.86,
    0.94, 1, 0.96, 0.88, 0.82, 0.66, 0.42, 0.24,
  ];
  return shape.map((f, h) => {
    const volume = Math.round(3400 * f * (0.92 + wave(h) * 0.16));
    return { label: `${String(h).padStart(2, "0")}h`, volume, sales: Math.round(volume / 268) };
  });
}

function buildMonthly(months: number, base: number, growth: number): SeriesPoint[] {
  const start = new Date(Date.UTC(2026, 7, 14));
  const points: SeriesPoint[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() - i, 1));
    const monthFactor = 0.88 + wave(i + months) * 0.28;
    const trend = 1 + ((months - 1 - i) / Math.max(months - 1, 1)) * growth;
    const volume = Math.round(base * monthFactor * trend * (0.92 + (i % 3) * 0.08));
    points.push({
      label: d.toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" }).replace(".", ""),
      volume,
      sales: Math.round(volume / 268),
    });
  }
  return points;
}

export const seriesByPeriod: Record<PeriodKey, SeriesPoint[]> = {
  hoje: buildHourly(),
  "7d": buildDaily(7, 42000, 0.22),
  "30d": buildDaily(30, 38000, 0.48),
  "90d": buildDaily(90, 31000, 0.86),
  "12m": buildMonthly(12, 1280000, 1.5),
};

export type DashboardKpis = {
  volume: number;
  sales: number;
  revenue: number;
  approvalRate: number;
  deltas: { volume: number; sales: number; revenue: number; approvalRate: number };
};

function summarize(period: PeriodKey, approvalRate: number, deltas: DashboardKpis["deltas"]) {
  const series = seriesByPeriod[period];
  const volume = series.reduce((acc, p) => acc + p.volume, 0);
  const sales = series.reduce((acc, p) => acc + p.sales, 0);
  return {
    volume,
    sales,
    revenue: Math.round(volume * 0.378 * 100) / 100,
    approvalRate,
    deltas,
  } satisfies DashboardKpis;
}

export const kpisByPeriod: Record<PeriodKey, DashboardKpis> = {
  hoje: summarize("hoje", 93.1, { volume: 12.6, sales: 9.8, revenue: 11.4, approvalRate: 0.8 }),
  "7d": summarize("7d", 92.8, { volume: 18.4, sales: 14.2, revenue: 16.9, approvalRate: 1.2 }),
  "30d": summarize("30d", 92.4, { volume: 24.7, sales: 19.3, revenue: 21.8, approvalRate: 2.1 }),
  "90d": summarize("90d", 91.6, { volume: 41.2, sales: 33.7, revenue: 38.5, approvalRate: -0.6 }),
  "12m": summarize("12m", 92.0, { volume: 62.1, sales: 54.3, revenue: 58.9, approvalRate: 3.4 }),
};

/** Série curta para os sparklines dos cards de KPI. */
export function sparkline(period: PeriodKey, key: "volume" | "sales" = "volume") {
  const series = seriesByPeriod[period];
  const step = Math.max(1, Math.floor(series.length / 12));
  return series.filter((_, i) => i % step === 0).map((p) => p[key]);
}
