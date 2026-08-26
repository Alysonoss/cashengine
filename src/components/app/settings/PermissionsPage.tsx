import { permissionGroups } from "@/lib/mock/data";
import { formatInt } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Check, ShieldCheck, Users, Plus } from "lucide-react";

const scopeLabels: Record<string, string> = {
  tudo: "Geral",
  financeiro: "Financeiro",
  relatorios: "Relatórios",
  extrato: "Extrato",
  saques: "Saques",
  vendas: "Vendas",
  clientes: "Clientes",
  estornos: "Estornos",
  afiliados: "Afiliados",
  produtos: "Produtos",
  checkouts: "Checkouts",
  marketplace: "Marketplace",
  comissoes: "Comissões",
  links: "Links",
  desenvolvedores: "Desenvolvedores",
  integracoes: "Integrações",
  dashboard: "Dashboard",
};

const modules = [
  "Dashboard",
  "Vendas",
  "Clientes",
  "Produtos",
  "Checkouts",
  "Afiliados",
  "Marketplace",
  "Financeiro",
  "Relatórios",
  "API/Logs",
  "Configurações",
] as const;

const matrix: Record<string, boolean[]> = {
  Proprietário: [true, true, true, true, true, true, true, true, true, true, true],
  Financeiro: [true, true, true, false, false, false, false, true, true, false, false],
  Atendimento: [true, true, true, true, false, false, false, false, false, false, false],
  Marketing: [true, false, false, true, true, true, true, false, false, false, false],
  Desenvolvedor: [true, false, false, false, false, false, false, false, true, true, true],
  Leitura: [true, false, false, false, false, false, false, false, true, false, false],
};

function ScopeChip({ scope }: { scope: string }) {
  const label = scopeLabels[scope] ?? scope;
  return (
    <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      {label}
    </span>
  );
}

export function PermissionsPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Permissões</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Grupos de acesso e permissões por módulo.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Criar novo grupo
        </button>
      </header>

      <section className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {permissionGroups.map((g) => (
            <div
              key={g.id}
              className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                      {g.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{g.description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {formatInt(g.members)} membros
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {g.scope.map((s) => (
                  <ScopeChip key={s} scope={s} />
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-border">
                <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted">
                  Gerenciar permissões
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Matriz de permissões
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Acesso por grupo vs módulos da plataforma
            </p>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="sticky left-0 bg-muted/40 px-5 py-3 font-medium">Grupo</th>
                {modules.map((m) => (
                  <th key={m} className="px-3 py-3 text-center font-medium whitespace-nowrap">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.entries(matrix).map(([group, perms]) => (
                <tr key={group} className="transition-colors hover:bg-muted/30">
                  <td className="sticky left-0 bg-card px-5 py-3 font-medium text-foreground">
                    {group}
                  </td>
                  {perms.map((ok, i) => (
                    <td key={i} className="px-3 py-3 text-center">
                      {ok ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
