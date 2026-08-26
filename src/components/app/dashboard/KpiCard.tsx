import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { formatDelta } from "@/lib/format";
import { cn } from "@/lib/utils";

function Sparkline({ points, positive }: { points: number[]; positive: boolean }) {
  if (points.length < 2) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const w = 100;
  const h = 32;
  const coords = points.map((v, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((v - min) / span) * (h - 4) - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const line = `M ${coords.join(" L ")}`;
  const area = `${line} L ${w},${h} L 0,${h} Z`;
  const stroke = positive ? "var(--color-primary)" : "var(--color-destructive)";
  const id = `spark-${positive ? "up" : "down"}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-8 w-full" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  points,
  hint,
}: {
  label: string;
  value: string;
  delta: number;
  icon: LucideIcon;
  points: number[];
  hint: string;
}) {
  const positive = delta >= 0;
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[11px] font-medium uppercase leading-tight tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums sm:text-[1.7rem]">
          {value}
        </p>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            positive ? "bg-success/12 text-success" : "bg-destructive/12 text-destructive",
          )}
        >
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {formatDelta(delta)}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>

      <div className="mt-4 -mb-1">
        <Sparkline points={points} positive={positive} />
      </div>
    </div>
  );
}
