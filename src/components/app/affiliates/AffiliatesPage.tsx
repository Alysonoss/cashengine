import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Network,
  Percent,
  Search,
  ShoppingBag,
  UserPlus,
} from "lucide-react";
import { affiliatesFull, type AffiliateFull, type AffiliateStatus } from "@/lib/mock/data";
import { formatBRL, formatInt, formatPct } from "@/lib/format";
import { CardsSkeleton, TableSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { EmptyState } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const statusOptions = ["todos", "ativo", "pendente", "bloqueado"] as const;
type StatusFilter = (typeof statusOptions)[number];
const PAGE_SIZE = 10;

function StatusPill({ status }: { status: AffiliateStatus }) {
  const map: Record<AffiliateStatus, string> = {
    ativo: "bg-emerald-500/10 text-emerald-700",
    pendente: "bg-amber-500/10 text-amber-700",
    bloqueado: "bg-rose-500/10 text-rose-700",
  };
  return (
    <span
      className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", map[status])}
    >
      {status}
    </span>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </span>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p
        className={
          accent
            ? "mt-4 text-2xl font-semibold tabular-nums tracking-tight text-primary"
            : "mt-4 text-2xl font-semibold tabular-nums tracking-tight text-foreground"
        }
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function AffiliatesPage() {
  const loading = useFakeLoading();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("todos");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return affiliatesFull.filter((a) => {
      if (status !== "todos" && a.status !== status) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    });
  }, [query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const totalRevenue = filtered.reduce((acc, a) => acc + a.sales * 220, 0);
  const totalCommission = filtered.reduce((acc, a) => acc + a.commission, 0);
  const avgConversion =
    filtered.length > 0 ? filtered.reduce((acc, a) => acc + a.conversion, 0) / filtered.length : 0;

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
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Afiliados</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastro, performance e comissões da sua rede.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
          <UserPlus className="h-4 w-4" />
          Convidar afiliado
        </button>
      </header>

      <div className="mt-6">
        {loading ? (
          <CardsSkeleton count={4} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              icon={Network}
              label="Ativos"
              value={formatInt(11)}
              hint={`${formatInt(filtered.filter((a) => a.status === "ativo").length)} no filtro`}
              accent
            />
            <KpiCard
              icon={ShoppingBag}
              label="Vendas do mês"
              value={formatInt(1872)}
              hint={`${formatInt(filtered.reduce((acc, a) => acc + a.sales, 0))} da rede filtrada`}
            />
            <KpiCard
              icon={DollarSign}
              label="Comissões"
              value="R$ 204,8 mil"
              hint={`${formatBRL(totalCommission, { compact: true })} filtradas`}
            />
            <KpiCard
              icon={Percent}
              label="Conversão média"
              value={formatPct(7.2)}
              hint={`${formatPct(avgConversion)} no filtro atual`}
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => reset(setQuery)(e.target.value)}
            placeholder="Buscar por nome, ID ou e-mail"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => reset(setStatus)(s)}
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
          <TableSkeleton rows={6} cols={7} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Network}
            title="Nenhum afiliado encontrado"
            description="Convide novos afiliados para expandir sua rede de vendas e aumentar o alcance dos seus produtos."
            action={
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Convidar afiliado
              </button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Nome</th>
                    <th className="px-5 py-3 font-medium">ID</th>
                    <th className="px-5 py-3 text-right font-medium">Vendas</th>
                    <th className="px-5 py-3 text-right font-medium">Receita gerada</th>
                    <th className="px-5 py-3 text-right font-medium">Comissão devida</th>
                    <th className="px-5 py-3 text-right font-medium">Conversão</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((a: AffiliateFull) => (
                    <tr key={a.id} className="transition-colors hover:bg-muted/50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-foreground">{a.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{a.email}</p>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{a.id}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                        {formatInt(a.sales)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-foreground">
                        {formatBRL(a.sales * 220, { compact: true })}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums text-foreground">
                        {formatBRL(a.commission, { compact: true })}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                        {formatPct(a.conversion)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusPill status={a.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
              <p className="text-xs text-muted-foreground">
                Página {current} de {totalPages} · {formatInt(filtered.length)} afiliados
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
