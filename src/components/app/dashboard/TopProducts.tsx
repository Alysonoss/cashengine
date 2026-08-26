import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { products } from "@/lib/mock/data";
import { formatBRL, formatInt } from "@/lib/format";

export function TopProducts() {
  const rows = [...products]
    .filter((p) => p.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  const max = rows[0]?.revenue ?? 1;

  return (
    <section className="flex flex-col rounded-xl border border-border bg-card shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Top produtos</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Por receita no período</p>
        </div>
        <Link
          to="/app/produtos"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Ver todos
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <ul className="divide-y divide-border">
        {rows.map((p, i) => (
          <li key={p.id} className="px-5 py-3.5 transition-colors hover:bg-muted/50">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatInt(p.sales)} vendas · {p.commission}% de comissão
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                {formatBRL(p.revenue, { compact: true })}
              </span>
            </div>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(8, (p.revenue / max) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
