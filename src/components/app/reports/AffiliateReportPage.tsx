import { useMemo, useState } from "react";
import { Download, TrendingUp } from "lucide-react";
import { affiliatesFull } from "@/lib/mock/data";
import { formatBRL, formatInt, formatPct, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { downloadReportPdf } from "@/lib/report-pdf";

const periodOptions = ["Hoje", "7 dias", "30 dias", "90 dias"] as const;
type PeriodFilter = (typeof periodOptions)[number];

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </p>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export function AffiliateReportPage() {
  const [period, setPeriod] = useState<PeriodFilter>("30 dias");

  const ranking = useMemo(
    () => [...affiliatesFull].sort((a, b) => b.sales - a.sales).slice(0, 12),
    [],
  );

  const totalSales = ranking.reduce((acc, a) => acc + a.sales, 0);
  const totalCommission = ranking.reduce((acc, a) => acc + a.commission, 0);
  const avgConversion = ranking.reduce((acc, a) => acc + a.conversion, 0) / (ranking.length || 1);

  const handleDownloadPdf = () => {
    downloadReportPdf({
      title: "Relatório de Afiliados",
      subtitle: "Performance da rede, top afiliados e comissões.",
      period,
      fileName: `relatorio-afiliados-${period.toLowerCase().replace(/\s+/g, "-")}.pdf`,
      kpis: [
        { label: "Afiliados ativos", value: formatInt(11), detail: "Rede produtiva" },
        { label: "Vendas afiliadas", value: formatInt(totalSales), detail: "Atribuídas à rede" },
        {
          label: "Comissões pagas",
          value: formatBRL(totalCommission),
          detail: "Líquidas para afiliados",
        },
        {
          label: "Conversão média",
          value: formatPct(avgConversion),
          detail: "Cliques para vendas",
        },
      ],
      columns: [
        { label: "Pos.", width: 0.55 },
        { label: "Afiliado", width: 2.4 },
        { label: "Vendas", width: 0.85, align: "right" },
        { label: "Receita", width: 1.25, align: "right" },
        { label: "Comissão", width: 1.2, align: "right" },
        { label: "Conversão", width: 1.0, align: "right" },
        { label: "Cliques", width: 0.8, align: "right" },
      ],
      rows: ranking.map((affiliate, index) => [
        String(index + 1),
        `${affiliate.name} (${affiliate.email})`,
        formatInt(affiliate.sales),
        formatBRL(affiliate.sales * 220),
        formatBRL(affiliate.commission),
        formatPct(affiliate.conversion),
        formatInt(affiliate.clicks),
      ]),
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Relatório de Afiliados
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Performance da rede, top afiliados, comissões e gravidade.
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

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Afiliados ativos" value={formatInt(11)} sub="Rede produtiva" />
        <KpiCard label="Vendas afiliadas" value={formatInt(totalSales)} sub="Atribuídas à rede" />
        <KpiCard
          label="Comissões pagas"
          value={formatBRL(totalCommission, { compact: true })}
          sub="Líquidas para afiliados"
        />
        <KpiCard label="Conversão média" value={formatPct(avgConversion)} sub="Cliques → Vendas" />
      </div>

      <section className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Top afiliados</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Ranking por volume de vendas no período
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
            <TrendingUp className="h-3.5 w-3.5" />
            Semana positiva
          </span>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">Posição</th>
                <th className="px-5 py-3 font-medium">Afiliado</th>
                <th className="px-5 py-3 text-right font-medium">Vendas</th>
                <th className="px-5 py-3 text-right font-medium">Receita gerada</th>
                <th className="px-5 py-3 text-right font-medium">Comissão devida</th>
                <th className="px-5 py-3 text-right font-medium">Conversão</th>
                <th className="px-5 py-3 text-right font-medium">Cliques</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ranking.map((a, idx) => (
                <tr key={a.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums",
                        idx === 0
                          ? "bg-amber-500/15 text-amber-700"
                          : idx === 1
                            ? "bg-muted-foreground/15 text-muted-foreground"
                            : idx === 2
                              ? "bg-[oklch(0.7_0.15_45_/_25%)] text-[oklch(0.5_0.15_45)]"
                              : "bg-muted text-muted-foreground",
                      )}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-foreground">{a.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                    {formatInt(a.sales)}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-foreground">
                    {formatBRL(a.sales * 220)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-foreground">
                    {formatBRL(a.commission)}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-foreground">
                    {formatPct(a.conversion)}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                    {formatInt(a.clicks)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-3 text-right text-[11px] text-muted-foreground">
        Atualizado em {formatDateTime(new Date().toISOString())}
      </p>
    </div>
  );
}
