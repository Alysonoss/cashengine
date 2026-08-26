import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { statement, categoryLabel, type LedgerCategory } from "@/lib/mock/finance";
import { formatBRL, formatInt, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import { downloadReportPdf } from "@/lib/report-pdf";

const periodOptions = ["Hoje", "7 dias", "30 dias", "90 dias"] as const;
type PeriodFilter = (typeof periodOptions)[number];

const categoryColor: Record<LedgerCategory, string> = {
  venda: "bg-emerald-500/10 text-emerald-700",
  taxa: "bg-muted text-muted-foreground",
  comissao: "bg-[oklch(0.78_0.15_80_/_18%)] text-[oklch(0.5_0.13_75)]",
  saque: "bg-primary/10 text-primary",
  estorno: "bg-rose-500/10 text-rose-700",
};

const distribution = [
  { label: "Líquido produtor", percent: 55, color: "bg-primary" },
  { label: "Afiliados", percent: 30, color: "bg-[oklch(0.72_0.15_80)]" },
  { label: "Coprodutor", percent: 10, color: "bg-foreground" },
  { label: "Taxas", percent: 5, color: "bg-muted-foreground/60" },
];

function KpiCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tabular-nums tracking-tight",
          accent ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </p>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export function FinanceReportPage() {
  const [period, setPeriod] = useState<PeriodFilter>("30 dias");

  const entradas = 1351501;
  const saidas = useMemo(
    () => statement.filter((s) => s.type === "debito").reduce((acc, s) => acc + s.amount, 0),
    [],
  );
  const custosAfiliados = 204800;
  const taxasProcessamento = 49200;
  const resultadoLiquido = entradas - saidas;

  const aggregated = useMemo(() => {
    const map = new Map<LedgerCategory, { count: number; total: number }>();
    for (const row of statement) {
      const curr = map.get(row.category) ?? { count: 0, total: 0 };
      curr.count += 1;
      curr.total += row.type === "debito" ? row.amount : row.amount;
      map.set(row.category, curr);
    }
    const entries: { category: LedgerCategory; count: number; total: number }[] = [];
    for (const [category, v] of map.entries()) {
      entries.push({ category, ...v });
    }
    return entries;
  }, []);

  const grandTotal = aggregated.reduce((acc, a) => acc + a.total, 0);

  const handleDownloadPdf = () => {
    downloadReportPdf({
      title: "Relatório Financeiro",
      subtitle: "Entradas, saídas, custos e resultado do período.",
      period,
      fileName: `relatorio-financeiro-${period.toLowerCase().replace(/\s+/g, "-")}.pdf`,
      kpis: [
        { label: "Entradas", value: formatBRL(entradas), detail: "Créditos do período" },
        { label: "Saídas e taxas", value: formatBRL(saidas), detail: "Débitos totais" },
        {
          label: "Resultado líquido",
          value: formatBRL(resultadoLiquido),
          detail: "Entradas - Saídas",
        },
        {
          label: "Custos afiliados",
          value: formatBRL(custosAfiliados),
          detail: "Comissões pagas",
        },
        {
          label: "Taxas processamento",
          value: formatBRL(taxasProcessamento),
          detail: "Adquirente + antifraude",
        },
      ],
      columns: [
        { label: "Categoria", width: 2.2 },
        { label: "Lançamentos", width: 1.2, align: "right" },
        { label: "Valor total", width: 1.6, align: "right" },
        { label: "% do total", width: 1.2, align: "right" },
      ],
      rows: aggregated.map((item) => {
        const pct = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0;
        return [
          categoryLabel[item.category],
          formatInt(item.count),
          formatBRL(item.total),
          formatPct(pct),
        ];
      }),
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Relatório Financeiro
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entradas, saídas, custos e resultado do período.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
        >
          <Download className="h-4 w-4" />
          Baixar PDF
        </button>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          {periodOptions.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                period === p
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Entradas" value={formatBRL(entradas)} sub="Créditos do período" />
        <KpiCard label="Saídas e taxas" value={formatBRL(saidas)} sub="Débitos totais" />
        <KpiCard
          label="Resultado líquido"
          value={formatBRL(resultadoLiquido)}
          accent
          sub="Entradas - Saídas"
        />
        <KpiCard
          label="Custos com afiliados"
          value={formatBRL(custosAfiliados, { compact: true })}
          sub="Comissões pagas"
        />
        <KpiCard
          label="Taxas de processamento"
          value={formatBRL(taxasProcessamento, { compact: true })}
          sub="Adquirente + antifraude"
        />
      </div>

      <section className="mt-5 rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Distribuição da receita
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Alocação percentual sobre o valor bruto
        </p>
        <div className="mt-5">
          <div className="flex h-3 w-full overflow-hidden rounded-full">
            {distribution.map((d) => (
              <span
                key={d.label}
                className={cn("h-full transition-all duration-500", d.color)}
                style={{ width: `${d.percent}%` }}
              />
            ))}
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {distribution.map((d) => (
              <li key={d.label} className="flex items-center justify-between gap-3 text-xs">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <span className={cn("h-2 w-2 rounded-full", d.color)} />
                  {d.label}
                </span>
                <span className="font-medium tabular-nums text-foreground">
                  {formatPct(d.percent, 0)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Lançamentos por categoria
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Agrupados por tipo de operação</p>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">Categoria</th>
                <th className="px-5 py-3 text-right font-medium">Lançamentos</th>
                <th className="px-5 py-3 text-right font-medium">Valor total</th>
                <th className="px-5 py-3 text-right font-medium">% do total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {aggregated.map((a) => {
                const pct = grandTotal > 0 ? (a.total / grandTotal) * 100 : 0;
                return (
                  <tr key={a.category} className="transition-colors hover:bg-muted/40">
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-medium",
                          categoryColor[a.category],
                        )}
                      >
                        {categoryLabel[a.category]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                      {formatInt(a.count)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-foreground">
                      {formatBRL(a.total)}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-foreground">
                      {formatPct(pct)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
