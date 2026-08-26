import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Banknote,
  Building2,
  CircleDollarSign,
  CreditCard,
  Download,
  GraduationCap,
  ScrollText,
  ShieldAlert,
  Ticket,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { KpiCard } from "@/components/app/dashboard/KpiCard";
import { SalesChart } from "@/components/app/dashboard/SalesChart";
import { periodLabel, useAppShell } from "@/components/app/app-shell-context";
import { sparkline, kpisByPeriod } from "@/lib/mock/dashboard";
import { formatBRL, formatInt, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

const fade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; label: string };
  hint?: string;
  tone?: "default" | "warning" | "danger" | "success";
};

function StatCard({ label, value, icon: Icon, trend, hint, tone = "default" }: StatCardProps) {
  const toneClasses = {
    default: "bg-primary/10 text-primary",
    warning: "bg-amber-500/10 text-amber-500",
    danger: "bg-destructive/10 text-destructive",
    success: "bg-emerald-500/10 text-emerald-500",
  } as const;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            toneClasses[tone],
          )}
        >
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
        {trend && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              trend.value >= 0
                ? "bg-success/12 text-success"
                : "bg-destructive/12 text-destructive",
            )}
          >
            {trend.value >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value >= 0 ? "+" : ""}
            {trend.value.toFixed(1)}%
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

type AuditActivity = {
  id: string;
  action: string;
  target: string;
  user: string;
  role: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
};

const auditActivities: AuditActivity[] = [
  {
    id: "1",
    action: "Banimento aplicado",
    target: "Empresa #4821 · TechVendas",
    user: "Sistema · Auto-moderação",
    role: "Sistema",
    timestamp: "há 3 minutos",
    severity: "critical",
  },
  {
    id: "2",
    action: "Saque aprovado",
    target: "R$ 12.450,00 · ID 88421",
    user: "Mariana Costa",
    role: "Financeiro",
    timestamp: "há 12 minutos",
    severity: "info",
  },
  {
    id: "3",
    action: "Configuração global alterada",
    target: "Taxa padrão de processamento",
    user: "Carlos Andrade",
    role: "Admin Global",
    timestamp: "há 34 minutos",
    severity: "warning",
  },
  {
    id: "4",
    action: "Nova empresa cadastrada",
    target: "Empresa #5012 · Infinito Digital",
    user: "KYC · Onboarding",
    role: "Sistema",
    timestamp: "há 1 hora",
    severity: "info",
  },
  {
    id: "5",
    action: "Chargeback contestado",
    target: "Transação #99234",
    user: "Suporte N3",
    role: "Operações",
    timestamp: "há 2 horas",
    severity: "warning",
  },
  {
    id: "6",
    action: "Usuário promovido",
    target: "João Silva → Admin Empresa",
    user: "Admin Global",
    role: "Admin Global",
    timestamp: "há 3 horas",
    severity: "info",
  },
];

type RecentCompany = {
  id: string;
  name: string;
  owner: string;
  plan: string;
  status: "ativo" | "pendente" | "analise";
  createdAt: string;
  volume: number;
};

const recentCompanies: RecentCompany[] = [
  {
    id: "5012",
    name: "Infinito Digital",
    owner: "Roberto Almeida",
    plan: "Pro",
    status: "ativo",
    createdAt: "há 1 hora",
    volume: 0,
  },
  {
    id: "5011",
    name: "Zenith Commerce",
    owner: "Juliana Martins",
    plan: "Business",
    status: "analise",
    createdAt: "há 3 horas",
    volume: 0,
  },
  {
    id: "5010",
    name: "Nexus Vendas",
    owner: "Pedro Henrique",
    plan: "Pro",
    status: "ativo",
    createdAt: "há 5 horas",
    volume: 18450,
  },
  {
    id: "5009",
    name: "Orbital Tech",
    owner: "Luiza Fernandes",
    plan: "Enterprise",
    status: "pendente",
    createdAt: "ontem",
    volume: 0,
  },
  {
    id: "5008",
    name: "Pico Digital",
    owner: "Marcelo Gomes",
    plan: "Business",
    status: "ativo",
    createdAt: "ontem",
    volume: 42300,
  },
];

function AdminDashboardPage() {
  const { period } = useAppShell();
  const kpis = kpisByPeriod[period];
  const volumePoints = sparkline(period, "volume");
  const salesPoints = sparkline(period, "sales");

  const mainKpis = [
    {
      label: "Empresas ativas",
      value: formatInt(3428),
      hint: "Total na plataforma · +128 neste mês",
      delta: 4.2,
      icon: Building2,
      points: salesPoints,
    },
    {
      label: "Usuários cadastrados",
      value: formatInt(89421),
      hint: "Contas em todas as empresas",
      delta: 8.7,
      icon: Users,
      points: salesPoints,
    },
    {
      label: "Volume processado TOTAL",
      value: formatBRL(142_847_320.98, { compact: true }),
      hint: formatBRL(142_847_320.98),
      delta: kpis.deltas.volume,
      icon: CreditCard,
      points: volumePoints,
    },
    {
      label: "Saques pendentes",
      value: formatInt(187),
      hint: "R$ 2.487.320 aguardando análise",
      delta: -3.1,
      icon: Banknote,
      points: volumePoints,
    },
  ];

  const statCards: StatCardProps[] = [
    {
      label: "Ativação 24h",
      value: formatInt(412),
      icon: GraduationCap,
      trend: { value: 12.4, label: "vs. dia anterior" },
      hint: "Empresas que ativaram checkout hoje",
      tone: "success",
    },
    {
      label: "Tickets em aberto",
      value: formatInt(58),
      icon: Ticket,
      trend: { value: -6.2, label: "vs. ontem" },
      hint: "14 urgentes · 8 críticos",
      tone: "warning",
    },
    {
      label: "Comissões a liberar",
      value: formatBRL(384_520.75, { compact: true }),
      icon: CircleDollarSign,
      trend: { value: 5.8, label: "vs. semana passada" },
      hint: "D+1 do próximo ciclo",
      tone: "default",
    },
    {
      label: "Taxa chargeback",
      value: formatPct(0.42),
      icon: ShieldAlert,
      trend: { value: 0.03, label: "vs. período ant." },
      hint: "Meta: abaixo de 0.50%",
      tone: "danger",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-destructive">
              <AlertTriangle className="h-3 w-3" />
              Ambiente Global
            </span>
          </div>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Dashboard Admin Global
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão consolidada de toda a plataforma nos últimos {periodLabel(period).toLowerCase()} ·
            atualizado agora
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            Exportar relatório
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <ScrollText className="h-4 w-4" />
            Auditoria completa
          </button>
        </div>
      </header>

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.06 }}
        className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {mainKpis.map((c) => (
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
        transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
        className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {statCards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18, ease: "easeOut" }}
        className="mt-5"
      >
        <SalesChart />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
        className="mt-5 grid gap-5 lg:grid-cols-2"
      >
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Últimas atividades de auditoria
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Trilha de eventos críticos do ambiente global
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {auditActivities.length} eventos recentes
            </span>
          </div>

          <ul className="mt-5 divide-y divide-border">
            {auditActivities.map((a) => {
              const severityTone = {
                info: "bg-primary/10 text-primary",
                warning: "bg-amber-500/10 text-amber-600",
                critical: "bg-destructive/10 text-destructive",
              } as const;
              const severityLabel = {
                info: "Info",
                warning: "Aviso",
                critical: "Crítico",
              } as const;

              return (
                <li
                  key={a.id}
                  className="group flex items-start gap-3 py-3 transition-colors first:pt-0 last:pb-0 hover:bg-muted/40 -mx-2 px-2 rounded-md"
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold uppercase tracking-wide",
                      severityTone[a.severity],
                    )}
                    title={severityLabel[a.severity]}
                  >
                    {a.severity[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <p className="truncate text-[13px] font-semibold text-foreground">
                        {a.action}
                      </p>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          severityTone[a.severity],
                        )}
                      >
                        {severityLabel[a.severity]}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{a.target}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                      <span className="truncate">{a.user}</span>
                      <span className="text-border">·</span>
                      <span className="truncate">{a.role}</span>
                      <span className="text-border">·</span>
                      <span className="shrink-0">{a.timestamp}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 pt-4 border-t border-border">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ScrollText className="h-4 w-4" />
              Ver trilha de auditoria completa
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Empresas recentes
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Onboarding e empresas que ativaram no período
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {recentCompanies.length} cadastros recentes
            </span>
          </div>

          <ul className="mt-5 divide-y divide-border">
            {recentCompanies.map((c) => {
              const statusTone = {
                ativo: "bg-emerald-500/10 text-emerald-600",
                pendente: "bg-amber-500/10 text-amber-600",
                analise: "bg-sky-500/10 text-sky-600",
              } as const;
              const statusLabel = {
                ativo: "Ativo",
                pendente: "Pendente",
                analise: "Em análise",
              } as const;

              return (
                <li
                  key={c.id}
                  className="group flex items-start gap-3 py-3 transition-colors first:pt-0 last:pb-0 hover:bg-muted/40 -mx-2 px-2 rounded-md"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-[11px] font-bold text-destructive">
                    {c.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <p className="truncate text-[13px] font-semibold text-foreground">{c.name}</p>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          statusTone[c.status],
                        )}
                      >
                        {statusLabel[c.status]}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                      <span className="truncate">{c.owner}</span>
                      <span className="text-border">·</span>
                      <span className="truncate">Plano {c.plan}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                      <span className="truncate">ID #{c.id}</span>
                      <span className="text-border">·</span>
                      <span className="shrink-0">{c.createdAt}</span>
                      {c.volume > 0 && (
                        <>
                          <span className="text-border">·</span>
                          <span className="font-semibold text-foreground tabular-nums">
                            {formatBRL(c.volume)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 pt-4 border-t border-border">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Building2 className="h-4 w-4" />
              Gerenciar todas as empresas
            </button>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
