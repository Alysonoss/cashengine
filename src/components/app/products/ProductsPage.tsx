import { useMemo, useState } from "react";
import { Package, PackagePlus, Search, Settings2 } from "lucide-react";
import { products, type Product } from "@/lib/mock/data";
import { formatBRL, formatInt } from "@/lib/format";
import { EmptyState } from "@/components/app/EmptyState";
import { TableSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { CheckoutBuilder } from "@/components/app/products/CheckoutBuilder";
import { ProductCheckoutTabs } from "@/components/app/products/ProductCheckoutTabs";
import { cn } from "@/lib/utils";

const statusOptions = ["todos", "ativo", "pausado", "rascunho"] as const;
type StatusFilter = (typeof statusOptions)[number];

function StatusPill({ status }: { status: Product["status"] }) {
  const map: Record<Product["status"], string> = {
    ativo: "bg-emerald-500/10 text-emerald-700",
    pausado: "bg-amber-500/10 text-amber-700",
    rascunho: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", map[status])}
    >
      {status}
    </span>
  );
}

export function ProductsPage() {
  const loading = useFakeLoading();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("todos");
  const [builder, setBuilder] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (status !== "todos" && p.status !== status) return false;
      return !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    });
  }, [query, status]);

  if (builder.open) {
    return (
      <CheckoutBuilder
        product={builder.product}
        onBack={() => setBuilder({ open: false, product: null })}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <ProductCheckoutTabs />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Catálogo, preços, comissões e checkouts publicados.
          </p>
        </div>
        <button
          onClick={() => setBuilder({ open: true, product: null })}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <PackagePlus className="h-4 w-4" />
          Novo produto
        </button>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou código"
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

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Nenhum produto encontrado"
            description="Ajuste a busca ou os filtros de status, ou crie um novo produto para começar a vender."
            action={
              <button
                onClick={() => setBuilder({ open: true, product: null })}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Criar produto
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Produto</th>
                  <th className="px-5 py-3 font-medium">Preço</th>
                  <th className="px-5 py-3 font-medium">Comissão</th>
                  <th className="px-5 py-3 font-medium">Vendas</th>
                  <th className="px-5 py-3 font-medium">Receita</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{p.id}</p>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums text-foreground">
                      {formatBRL(p.price)}
                    </td>
                    <td className="px-5 py-3.5 tabular-nums text-muted-foreground">
                      {p.commission}%
                    </td>
                    <td className="px-5 py-3.5 tabular-nums text-muted-foreground">
                      {formatInt(p.sales)}
                    </td>
                    <td className="px-5 py-3.5 font-semibold tabular-nums text-foreground">
                      {formatBRL(p.revenue, { compact: true })}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setBuilder({ open: true, product: p })}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                        Editar checkout
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
