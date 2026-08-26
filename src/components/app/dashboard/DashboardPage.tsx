import { motion } from "motion/react";
import { CheckCircle2, CreditCard, Download, Link2, Plus, ShoppingBag, Wallet } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { periodLabel, useAppShell } from "@/components/app/app-shell-context";
import { KpiCard } from "@/components/app/dashboard/KpiCard";
import { SalesChart } from "@/components/app/dashboard/SalesChart";
import { RecentTransactions } from "@/components/app/dashboard/RecentTransactions";
import { TopProducts } from "@/components/app/dashboard/TopProducts";
import { kpisByPeriod, sparkline } from "@/lib/mock/dashboard";
import { formatBRL, formatInt, formatPct } from "@/lib/format";

const fade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  const { period } = useAppShell();
  const kpis = kpisByPeriod[period];
  const volumePoints = sparkline(period, "volume");
  const salesPoints = sparkline(period, "sales");

  const cards = [
    {
      label: "Volume processado",
      value: formatBRL(kpis.volume, { compact: true }),
      hint: formatBRL(kpis.volume),
      delta: kpis.deltas.volume,
      icon: CreditCard,
      points: volumePoints,
    },
    {
      label: "Vendas",
      value: formatInt(kpis.sales),
      hint: "Pedidos pagos no período",
      delta: kpis.deltas.sales,
      icon: ShoppingBag,
      points: salesPoints,
    },
    {
      label: "Receita",
      value: formatBRL(kpis.revenue, { compact: true }),
      hint: "Líquida após taxas e comissões",
      delta: kpis.deltas.revenue,
      icon: Wallet,
      points: volumePoints,
    },
    {
      label: "Taxa de aprovação",
      value: formatPct(kpis.approvalRate),
      hint: "Média ponderada por método",
      delta: kpis.deltas.approvalRate,
      icon: CheckCircle2,
      points: salesPoints,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Visão geral
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sua operação nos últimos {periodLabel(period).toLowerCase()} · atualizado agora
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
          <Link
            to="/app/links-de-pagamento"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            <Link2 className="h-4 w-4" />
            Criar link Pix
          </Link>
          <Link
            to="/app/produtos"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Novo produto
          </Link>
        </div>
      </header>

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.06 }}
        className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map((c) => (
          <motion.div
            key={c.label}
            variants={fade}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <KpiCard {...c} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="mt-5"
      >
        <SalesChart />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
        className="mt-5 grid gap-5 lg:grid-cols-2"
      >
        <RecentTransactions />
        <TopProducts />
      </motion.div>
    </div>
  );
}
