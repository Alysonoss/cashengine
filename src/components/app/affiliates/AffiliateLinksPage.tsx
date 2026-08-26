import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Link2, Search } from "lucide-react";
import { affiliateLinks, affiliatesFull, products, type AffiliateLink } from "@/lib/mock/data";
import { formatBRL, formatInt, formatPct } from "@/lib/format";
import { TableSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { EmptyState } from "@/components/app/EmptyState";
const PAGE_SIZE = 12;
export function AffiliateLinksPage() {
  const loading = useFakeLoading();
  const [query, setQuery] = useState("");
  const [productFilter, setProductFilter] = useState<string>("todos");
  const [affiliateFilter, setAffiliateFilter] = useState<string>("todos");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return affiliateLinks.filter((l) => {
      if (productFilter !== "todos" && l.product !== productFilter) return false;
      if (affiliateFilter !== "todos" && l.affiliate !== affiliateFilter) return false;
      if (!q) return true;
      return (
        l.slug.toLowerCase().includes(q) ||
        l.affiliate.toLowerCase().includes(q) ||
        l.product.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
      );
    });
  }, [query, productFilter, affiliateFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  function reset<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(1);
    };
  }
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Links</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Links de afiliado rastreáveis por produto e afiliado.
          </p>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => reset(setQuery)(e.target.value)}
            placeholder="Buscar por slug, afiliado ou produto"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <select
          value={productFilter}
          onChange={(e) => reset(setProductFilter)(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-primary/60"
        >
          <option value="todos">Todos os produtos</option>
          {products.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={affiliateFilter}
          onChange={(e) => reset(setAffiliateFilter)(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-primary/60"
        >
          <option value="todos">Todos os afiliados</option>
          {affiliatesFull.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {loading ? (
          <TableSkeleton rows={6} cols={7} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Link2}
            title="Nenhum link de afiliado encontrado"
            description="Ajuste a busca ou os filtros de produto e afiliado para encontrar o link que procura."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Link</th>
                    <th className="px-5 py-3 font-medium">Afiliado</th>
                    <th className="px-5 py-3 font-medium">Produto</th>
                    <th className="px-5 py-3 text-right font-medium">Cliques</th>
                    <th className="px-5 py-3 text-right font-medium">Vendas</th>
                    <th className="px-5 py-3 text-right font-medium">Conversão</th>
                    <th className="px-5 py-3 text-right font-medium">Comissão por venda</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((l: AffiliateLink) => (
                    <tr key={l.id} className="transition-colors hover:bg-muted/50">
                      <td className="px-5 py-3.5">
                        <p className="font-mono text-xs font-medium text-primary">
                          cashenginepro.app/{l.slug}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{l.id}</p>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-foreground">{l.affiliate}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{l.product}</td>
                      <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                        {formatInt(l.clicks)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums text-foreground">
                        {formatInt(l.sales)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                        {formatPct(l.conversion)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-foreground">
                        {formatBRL(l.commissionValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
              <p className="text-xs text-muted-foreground">
                Página {current} de {totalPages} · {formatInt(filtered.length)} links
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, current - 1))}
                  disabled={current === 1}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Anterior
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, current + 1))}
                  disabled={current === totalPages}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-40"
                >
                  Próxima
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
