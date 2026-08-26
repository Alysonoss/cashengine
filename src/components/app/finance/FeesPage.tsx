import { useMemo } from "react";
import { fees, type FeeEntry } from "@/lib/mock/data";
import { formatBRL, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

type FeeCategory = FeeEntry["category"];

const categoryLabel: Record<FeeCategory, string> = {
  adquirente: "Adquirente",
  antifraude: "Antifraude",
  plataforma: "Plataforma",
  saque: "Saque",
  boleto: "Boleto",
};

const categoryStyles: Record<FeeCategory, { pill: string; bar: string }> = {
  adquirente: {
    pill: "bg-primary/12 text-primary",
    bar: "bg-primary",
  },
  antifraude: {
    pill: "bg-[oklch(0.70_0.18_280_/_18%)] text-[oklch(0.50_0.16_280)]",
    bar: "bg-[oklch(0.60_0.18_280)]",
  },
  plataforma: {
    pill: "bg-success/12 text-success",
    bar: "bg-success",
  },
  saque: {
    pill: "bg-[oklch(0.78_0.15_80_/_18%)] text-[oklch(0.52_0.13_75)]",
    bar: "bg-[oklch(0.72_0.15_80)]",
  },
  boleto: {
    pill: "bg-muted text-muted-foreground",
    bar: "bg-muted-foreground/60",
  },
};

function CategoryBadge({ category }: { category: FeeCategory }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        categoryStyles[category].pill,
      )}
    >
      {categoryLabel[category]}
    </span>
  );
}

export function FeesPage() {
  const totalFees = useMemo(() => fees.reduce((acc, f) => acc + f.fee, 0), []);
  const totalVolume = useMemo(() => {
    const uniqueVolumes = new Map<string, number>();
    fees.forEach((f) => uniqueVolumes.set(f.category + f.name, f.volume));
    return Array.from(uniqueVolumes.values()).reduce((a, b) => a + b, 0) / 2;
  }, []);

  const stacked = useMemo(() => {
    const byCategory = fees.reduce(
      (acc, f) => {
        acc[f.category] = (acc[f.category] ?? 0) + f.fee;
        return acc;
      },
      {} as Record<FeeCategory, number>,
    );
    const total = Object.values(byCategory).reduce((a, b) => a + b, 0);
    const order: FeeCategory[] = ["adquirente", "plataforma", "antifraude", "boleto", "saque"];
    return order
      .filter((c) => (byCategory[c] ?? 0) > 0)
      .map((c) => ({
        category: c,
        value: byCategory[c]!,
        pct: total > 0 ? (byCategory[c]! / total) * 100 : 0,
      }));
  }, []);

  const avgRate = 4.2;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Taxas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Taxas por método de pagamento e antecipação.
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Total de taxas</p>
          <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            {formatBRL(totalFees)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Taxa média efetiva</p>
          <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-primary">
            {formatPct(avgRate, 1)}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">
              Composição por categoria
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Percentual de cada grupo sobre o total de taxas
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex h-8 w-full overflow-hidden rounded-lg bg-muted/60">
            {stacked.map((s) => (
              <div
                key={s.category}
                className={cn("h-full", categoryStyles[s.category].bar)}
                style={{ width: `${s.pct}%` }}
                title={`${categoryLabel[s.category]}: ${formatPct(s.pct, 1)} · ${formatBRL(s.value)}`}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {stacked.map((s) => (
              <div key={s.category} className="flex items-center gap-2 text-xs">
                <span className={cn("h-2.5 w-2.5 rounded-sm", categoryStyles[s.category].bar)} />
                <span className="font-medium text-foreground">{categoryLabel[s.category]}</span>
                <span className="tabular-nums text-muted-foreground">{formatPct(s.pct, 0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">Categoria</th>
                <th className="px-5 py-3 font-medium">Descrição</th>
                <th className="px-5 py-3 text-right font-medium">Volume processado</th>
                <th className="px-5 py-3 text-right font-medium">Valor cobrado</th>
                <th className="px-5 py-3 text-right font-medium">Taxa (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fees.map((f) => (
                <tr key={f.id} className="transition hover:bg-muted/60">
                  <td className="px-5 py-3">
                    <CategoryBadge category={f.category} />
                  </td>
                  <td className="px-5 py-3 text-foreground">{f.name}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {formatBRL(f.volume, { compact: true })}
                  </td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums text-foreground">
                    {formatBRL(f.fee)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {formatPct(f.rate, 2)}
                  </td>
                </tr>
              ))}
              {fees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    Nenhuma taxa registrada.
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
