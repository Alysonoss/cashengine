import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { products, salesSeries, kpis, type PaymentMethod } from "@/lib/mock/data";
import { formatBRL, formatInt, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import { downloadReportPdf } from "@/lib/report-pdf";

const periodOptions = ["Hoje", "7 dias", "30 dias", "90 dias"] as const;
type PeriodFilter = (typeof periodOptions)[number];
const methodOptions: (PaymentMethod | "Todos")[] = ["Todos", "Pix", "Cartão", "Boleto"];

function SparkBar({ data }: { data: { day: string; volume: number }[] }) {
  const max = Math.max(...data.map((d) => d.volume));
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-12 w-full text-primary">
      {data.map((d, i) => {
        const h = (d.volume / max) * 26;
        const x = (i / data.length) * 100 + 1;
        const w = 100 / data.length - 2;
        return (
          <rect
            key={d.day}
            x={x}
            y={28 - h}
            width={w}
            height={h}
            rx={1.5}
            className="fill-current"
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
}

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

export function SalesReportPage() {
  const [period, setPeriod] = useState<PeriodFilter>("30 dias");
  const [method, setMethod] = useState<PaymentMethod | "Todos">("Todos");

  const totalRevenue = useMemo(() => products.reduce((acc, p) => acc + p.revenue, 0), []);

  const handleDownloadPdf = () => {
    downloadReportPdf({
      title: "Relatório de Vendas",
      subtitle: "Volume, recorrência e performance por método e período.",
      period,
      filters: [`Método: ${method}`],
      fileName: `relatorio-vendas-${period.toLowerCase().replace(/\s+/g, "-")}.pdf`,
      kpis: [
        { label: "Volume total", value: formatBRL(kpis.volume), detail: "Bruto da operação" },
        { label: "Pedidos", value: formatInt(kpis.sales), detail: "Transações concluídas" },
        { label: "Aprovação", value: formatPct(kpis.approvalRate), detail: "Taxa de conversão" },
        {
          label: "Ticket médio",
          value: formatBRL(kpis.volume / kpis.sales),
          detail: "Por pedido aprovado",
        },
      ],
      columns: [
        { label: "Produto", width: 2.8 },
        { label: "Qtd. vendas", width: 1.1, align: "right" },
        { label: "Volume", width: 1.4, align: "right" },
        { label: "Ticket", width: 1.3, align: "right" },
        { label: "% do total", width: 1.1, align: "right" },
      ],
      rows: products.map((product) => {
        const pct = totalRevenue > 0 ? (product.revenue / totalRevenue) * 100 : 0;
        const ticket = product.sales > 0 ? product.revenue / product.sales : 0;
        return [
          `${product.name} (${product.id})`,
          formatInt(product.sales),
          formatBRL(product.revenue),
          formatBRL(ticket),
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
            Relatório de Vendas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Volume, recorrência e performance por método e período.
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
        <div className="ml-auto flex items-center gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod | "Todos")}
            className="h-9 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-primary/60"
          >
            {methodOptions.map((m) => (
              <option key={m} value={m}>
                {m === "Todos" ? "Todos os métodos" : m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Volume total" value={formatBRL(kpis.volume)} sub="Bruto da operação" />
        <KpiCard label="Pedidos" value={formatInt(kpis.sales)} sub="Transações concluídas" />
        <KpiCard label="Aprovação" value={formatPct(kpis.approvalRate)} sub="Taxa de conversão" />
        <KpiCard
          label="Ticket médio"
          value={formatBRL(kpis.volume / kpis.sales)}
          sub="Por pedido aprovado"
        />
      </div>

      <section className="mt-5 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Volume por dia</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Evolução diária do volume de vendas
            </p>
          </div>
        </div>
        <div className="mt-4">
          <SparkBar data={salesSeries} />
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            {salesSeries.map((d) => (
              <span key={d.day}>{d.day}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Performance por produto
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Agregado por catálogo do período</p>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">Produto</th>
                <th className="px-5 py-3 text-right font-medium">Qtd. vendas</th>
                <th className="px-5 py-3 text-right font-medium">Volume</th>
                <th className="px-5 py-3 text-right font-medium">Ticket</th>
                <th className="px-5 py-3 text-right font-medium">% do total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => {
                const pct = totalRevenue > 0 ? (p.revenue / totalRevenue) * 100 : 0;
                const ticket = p.sales > 0 ? p.revenue / p.sales : 0;
                return (
                  <tr key={p.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{p.id}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                      {formatInt(p.sales)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-foreground">
                      {formatBRL(p.revenue)}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                      {formatBRL(ticket)}
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
