import { useMemo, useState } from "react";
import {
  BarChart3,
  Mail,
  Database,
  PieChart,
  Puzzle,
  Zap,
  Plug,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { integrations, type Integration } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

const categories = ["All", "CRM", "Email", "Analytics", "ERP", "Outro"] as const;
type CategoryFilter = (typeof categories)[number];

const categoryIcon: Record<Integration["category"], React.ElementType> = {
  CRM: Database,
  Email: Mail,
  Analytics: BarChart3,
  ERP: PieChart,
  Outro: Puzzle,
};

const categoryBadge: Record<Integration["category"], string> = {
  CRM: "bg-violet-500/10 text-violet-700",
  Email: "bg-sky-500/10 text-sky-700",
  Analytics: "bg-emerald-500/10 text-emerald-700",
  ERP: "bg-amber-500/10 text-amber-700",
  Outro: "bg-muted text-muted-foreground",
};

const statusBadge: Record<Integration["status"], string> = {
  conectado: "bg-emerald-500/10 text-emerald-700",
  disponivel: "bg-muted text-muted-foreground",
  em_breve: "bg-amber-500/10 text-amber-700",
};

const statusLabel: Record<Integration["status"], string> = {
  conectado: "Conectado",
  disponivel: "Disponível",
  em_breve: "Em breve",
};

function IntegrationCard({ item }: { item: Integration }) {
  const Icon = categoryIcon[item.category];
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            categoryBadge[item.category],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-medium",
            statusBadge[item.status],
          )}
        >
          {statusLabel[item.status]}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{item.name}</h3>
      </div>
      <span
        className={cn(
          "mt-2 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
          categoryBadge[item.category],
        )}
      >
        {item.category}
      </span>
      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {item.description}
      </p>
      <div className="mt-5 pt-4 border-t border-border">
        {item.status === "conectado" ? (
          <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Configurar
          </button>
        ) : item.status === "disponivel" ? (
          <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
            <Plug className="h-3.5 w-3.5" />
            Conectar
          </button>
        ) : (
          <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted">
            <Clock className="h-3.5 w-3.5" />
            Entrar na lista de espera
          </button>
        )}
      </div>
    </div>
  );
}

export function IntegrationsPage() {
  const [category, setCategory] = useState<CategoryFilter>("All");

  const rows = useMemo(() => {
    if (category === "All") return integrations;
    return integrations.filter((i) => i.category === category);
  }, [category]);

  const conectados = integrations.filter((i) => i.status === "conectado").length;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Integrações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plataformas conectadas e disponíveis para sua operação.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <Zap className="h-3.5 w-3.5 text-emerald-600" />
          {conectados} de {integrations.length} conectadas
        </span>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-card p-2 shadow-sm">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition",
              category === c
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((i) => (
          <IntegrationCard key={i.id} item={i} />
        ))}
      </div>
    </div>
  );
}
