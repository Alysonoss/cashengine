import { useMemo, useState } from "react";
import { ScrollText, Search } from "lucide-react";
import { auditRows } from "@/lib/mock/developers";
import { formatDateTime, formatInt } from "@/lib/format";
import { EmptyState } from "@/components/app/EmptyState";
import { TableSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { cn } from "@/lib/utils";

const resultOptions = ["todos", "sucesso", "falha"] as const;

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function LogsPage() {
  const loading = useFakeLoading();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<(typeof resultOptions)[number]>("todos");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return auditRows.filter((r) => {
      if (result !== "todos" && r.result !== result) return false;
      return (
        !q ||
        r.actor.toLowerCase().includes(q) ||
        r.action.toLowerCase().includes(q) ||
        r.target.toLowerCase().includes(q)
      );
    });
  }, [query, result]);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Logs de auditoria</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatInt(rows.length)} eventos · quem fez, o que fez, quando e qual foi o resultado.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por ator, ação ou alvo"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex gap-1.5">
          {resultOptions.map((r) => (
            <button
              key={r}
              onClick={() => setResult(r)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition",
                result === r
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {loading ? (
          <TableSkeleton rows={8} cols={4} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={ScrollText}
            title="Nenhum evento encontrado"
            description="Nenhum registro de auditoria corresponde à busca ou ao filtro de resultado."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Quem</th>
                  <th className="px-5 py-3 font-medium">Ação</th>
                  <th className="px-5 py-3 font-medium">Quando</th>
                  <th className="px-5 py-3 font-medium">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                          {initials(r.actor)}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{r.actor}</p>
                          <p className="text-xs text-muted-foreground">{r.ip}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-foreground">{r.action}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{r.target}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">
                      {formatDateTime(r.date)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                          r.result === "sucesso"
                            ? "bg-emerald-500/10 text-emerald-700"
                            : "bg-red-500/10 text-red-700",
                        )}
                      >
                        {r.result}
                      </span>
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
