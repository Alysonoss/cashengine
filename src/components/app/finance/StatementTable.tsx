import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Receipt, Search } from "lucide-react";
import { categoryLabel, statement, type LedgerCategory } from "@/lib/mock/finance";
import { formatBRL, formatDateTime, formatInt } from "@/lib/format";
import { EmptyState } from "@/components/app/EmptyState";
import { TableSkeleton } from "@/components/app/Skeletons";
import { cn } from "@/lib/utils";

const typeOptions = ["todos", "credito", "debito"] as const;
const categoryOptions: (LedgerCategory | "todas")[] = [
  "todas",
  "venda",
  "taxa",
  "comissao",
  "saque",
  "estorno",
];

export function StatementTable({
  loading,
  pageSize = 12,
  limit,
}: {
  loading: boolean;
  pageSize?: number;
  limit?: number;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof typeOptions)[number]>("todos");
  const [category, setCategory] = useState<(typeof categoryOptions)[number]>("todas");
  const [page, setPage] = useState(1);

  const source = useMemo(() => (limit ? statement.slice(0, limit) : statement), [limit]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return source.filter((r) => {
      if (type !== "todos" && r.type !== type) return false;
      if (category !== "todas" && r.category !== category) return false;
      return !q || r.description.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    });
  }, [source, query, type, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * pageSize, current * pageSize);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <header className="flex flex-wrap items-center gap-3 border-b border-border p-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar no extrato"
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {typeOptions.map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t);
                setPage(1);
              }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition",
                type === t
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              {t === "credito" ? "Entradas" : t === "debito" ? "Saídas" : "Todos"}
            </button>
          ))}
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as LedgerCategory | "todas");
            setPage(1);
          }}
          className="h-9 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-primary/60"
        >
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c === "todas" ? "Todas as categorias" : categoryLabel[c]}
            </option>
          ))}
        </select>
      </header>

      {loading ? (
        <TableSkeleton rows={8} cols={5} />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Nenhum lançamento encontrado"
          description="Nenhuma movimentação corresponde aos filtros selecionados. Tente outra categoria ou período."
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Data</th>
                  <th className="px-5 py-3 font-medium">Descrição</th>
                  <th className="px-5 py-3 font-medium">Categoria</th>
                  <th className="px-5 py-3 text-right font-medium">Valor</th>
                  <th className="px-5 py-3 text-right font-medium">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-muted/50">
                    <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">
                      {formatDateTime(r.date)}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">{r.description}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{r.id}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {categoryLabel[r.category]}
                      </span>
                    </td>
                    <td
                      className={cn(
                        "px-5 py-3.5 text-right font-semibold tabular-nums",
                        r.type === "credito" ? "text-emerald-600" : "text-foreground",
                      )}
                    >
                      {r.type === "credito" ? "+" : "−"}
                      {formatBRL(r.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                      {formatBRL(r.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground">
            <span>{formatInt(filtered.length)} lançamentos</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={current === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background transition hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span>
                {current} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={current === totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background transition hover:bg-muted disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}
