import { useMemo, useState } from "react";
import { CreditCard, Plus, Search } from "lucide-react";
import { checkouts, type Checkout, type CheckoutStatus } from "@/lib/mock/data";
import { formatBRL, formatInt, formatPct } from "@/lib/format";
import { CardsSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { EmptyState } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";
import { ProductCheckoutTabs } from "@/components/app/products/ProductCheckoutTabs";

const statusOptions = ["todos", "ativo", "rascunho", "arquivado"] as const;
type StatusFilter = (typeof statusOptions)[number];

function StatusPill({ status }: { status: CheckoutStatus }) {
  const map: Record<CheckoutStatus, string> = {
    ativo: "bg-emerald-500/10 text-emerald-700",
    rascunho: "bg-muted text-muted-foreground",
    arquivado: "bg-zinc-500/10 text-zinc-700",
  };
  return (
    <span
      className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", map[status])}
    >
      {status}
    </span>
  );
}

function MethodChip({ method }: { method: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {method}
    </span>
  );
}

function CheckoutCard({ checkout }: { checkout: Checkout }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-border/80 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground truncate">{checkout.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground truncate">{checkout.product}</p>
        </div>
        <StatusPill status={checkout.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {checkout.methods.map((m) => (
          <MethodChip key={m} method={m} />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Vendas</p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
            {formatInt(checkout.sales)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Receita</p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
            {formatBRL(checkout.revenue, { compact: true })}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Conversão</p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
            {formatPct(checkout.conversion)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <p className="text-xs font-medium text-foreground">{formatBRL(checkout.price)}</p>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted">
          Editar
        </button>
      </div>
    </div>
  );
}

export function CheckoutsPage() {
  const loading = useFakeLoading();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("todos");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return checkouts.filter((c) => {
      if (status !== "todos" && c.status !== status) return false;
      return !q || c.name.toLowerCase().includes(q) || c.product.toLowerCase().includes(q);
    });
  }, [query, status]);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <ProductCheckoutTabs />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Checkouts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Páginas de pagamento rápidas, responsivas e configuráveis por produto.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Novo checkout
        </button>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou produto"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition",
                status === s
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-6">
        {loading ? (
          <CardsSkeleton count={6} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="Nenhum checkout encontrado"
            description="Crie um novo checkout para começar a vender seus produtos com páginas otimizadas para conversão."
            action={
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Criar checkout
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((c) => (
              <CheckoutCard key={c.id} checkout={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
