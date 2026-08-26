import { useMemo, useState } from "react";
import { Megaphone, Search, Store } from "lucide-react";
import { marketplaceProducts, type MarketplaceProduct } from "@/lib/mock/data";
import { formatBRL, formatInt, formatPct } from "@/lib/format";
import { CardsSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { EmptyState } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";

const categoryOptions = [
  "Todas",
  "Negócios",
  "Educação",
  "Marketing",
  "Finanças",
  "Tecnologia",
  "Vendas",
] as const;
type CategoryFilter = (typeof categoryOptions)[number];

function TagPill({ tag }: { tag: NonNullable<MarketplaceProduct["tag"]> }) {
  const map: Record<NonNullable<MarketplaceProduct["tag"]>, string> = {
    destaque: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    novo: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    manual: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
        map[tag],
      )}
    >
      {tag}
    </span>
  );
}

function ProductCard({ product }: { product: MarketplaceProduct }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:border-border/80 hover:shadow-md">
      <div className="relative aspect-[16/9] bg-gradient-to-br from-[#0b1e3f] via-[#111827] to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        {product.tag && (
          <div className="absolute left-3 top-3">
            <TagPill tag={product.tag} />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <Store className="h-10 w-10 text-white/30" />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {product.category}
          </p>
          <p className="text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">Gravity</span> {product.gravity}
          </p>
        </div>

        <h3 className="mt-2 font-semibold text-foreground">{product.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">por {product.producer}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Preço</p>
            <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
              {formatBRL(product.price)}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Comissão</p>
            <p className="mt-1 text-sm font-semibold tabular-nums text-emerald-600">
              {formatPct(product.commission)}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Vendas</p>
            <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
              {formatInt(product.sales)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Ganhe{" "}
            <span className="font-semibold text-foreground">
              {formatBRL(product.commissionValue)}
            </span>{" "}
            por venda
          </p>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
            <Megaphone className="h-3.5 w-3.5" />
            Promover
          </button>
        </div>
      </div>
    </div>
  );
}

export function MarketplacePage() {
  const loading = useFakeLoading();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("Todas");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return marketplaceProducts.filter((p) => {
      if (category !== "Todas" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.producer.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Marketplace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Catálogo de produtos para afiliados promoverem e ganharem comissão.
          </p>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por produto, produtor ou categoria"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categoryOptions.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition",
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-6">
        {loading ? (
          <CardsSkeleton count={6} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Store}
            title="Nenhum produto encontrado"
            description="Ajuste a busca ou os filtros de categoria para encontrar produtos para promover."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
