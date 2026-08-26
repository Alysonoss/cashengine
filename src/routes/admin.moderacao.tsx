import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Ban,
  Building2,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Gavel,
  Package,
  Receipt,
  Search,
  ShieldAlert,
  ThumbsDown,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";
import { CardsSkeleton, TableSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { EmptyState } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";
import { formatDateTime, formatInt } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TipoItem = "produto" | "checkout" | "empresa";
type CategoriaRisco = "conteudo" | "financeiro" | "fraude" | "seguranca" | "outros";
type StatusMod = "pendente" | "analise" | "aprovado" | "rejeitado";
type TabMod = StatusMod | "todos";

type Denuncia = {
  id: string;
  tipoItem: TipoItem;
  itemId: string;
  itemTitulo: string;
  reportadoPor: string;
  reportadoPorEmail: string;
  motivo: string;
  categoria: CategoriaRisco;
  status: StatusMod;
  dataDenuncia: string;
  atribuido: string | null;
  notas?: string;
};

const denunciasMock: Denuncia[] = [
  {
    id: "DEN-2026-00142",
    tipoItem: "produto",
    itemId: "PRD-1098",
    itemTitulo: "Curso Investidor Pro",
    reportadoPor: "Cliente anônimo",
    reportadoPorEmail: "anonimo@email.com",
    motivo: "Promessas de retorno garantido e uso de depoimentos falsos.",
    categoria: "fraude",
    status: "pendente",
    dataDenuncia: "2026-08-17T12:40:00Z",
    atribuido: null,
  },
  {
    id: "DEN-2026-00141",
    tipoItem: "empresa",
    itemId: "EMP-00005",
    itemTitulo: "VerdeVida Suplementos",
    reportadoPor: "Carlos Eduardo",
    reportadoPorEmail: "carlos@blackpepper.shop",
    motivo: "Produtos sem autorização da ANVISA, alegações medicinais proibidas.",
    categoria: "conteudo",
    status: "analise",
    dataDenuncia: "2026-08-16T09:22:00Z",
    atribuido: "admin@cash.engine",
    notas: "Coletando provas e verificando documentação junto ao parceiro.",
  },
  {
    id: "DEN-2026-00140",
    tipoItem: "checkout",
    itemId: "CK-44221",
    itemTitulo: "Checkout Produto X · 12x",
    reportadoPor: "Maria Fernanda",
    reportadoPorEmail: "maria@novatech.io",
    motivo: "Checkout phishing que clona layout da NovaTech.",
    categoria: "seguranca",
    status: "rejeitado",
    dataDenuncia: "2026-08-15T18:05:00Z",
    atribuido: "admin@cash.engine",
    notas: "Após análise, tratou-se de um checkout de empresa parceira autorizada. Desculpas pelo transtorno.",
  },
  {
    id: "DEN-2026-00139",
    tipoItem: "produto",
    itemId: "PRD-0777",
    itemTitulo: "E-book Segredos da Sorte",
    reportadoPor: "Juliana Paiva",
    reportadoPorEmail: "juliana@lotuscursos.com",
    motivo: "Conteúdo plagiado do meu treinamento original.",
    categoria: "conteudo",
    status: "analise",
    dataDenuncia: "2026-08-14T11:50:00Z",
    atribuido: "Moderador Tiago",
  },
  {
    id: "DEN-2026-00138",
    tipoItem: "empresa",
    itemId: "EMP-00004",
    itemTitulo: "MercadoTop Dropshipping",
    reportadoPor: "Cliente anônimo",
    reportadoPorEmail: "anonimo2@email.com",
    motivo: "Nunca receberam o produto, vários chargebacks, empresa desapareceu.",
    categoria: "financeiro",
    status: "aprovado",
    dataDenuncia: "2026-08-12T07:15:00Z",
    atribuido: "admin@cash.engine",
    notas: "Denúncia procedente. Risco ajustado para alto e empresa sob monitoramento.",
  },
  {
    id: "DEN-2026-00137",
    tipoItem: "produto",
    itemId: "PRD-0654",
    itemTitulo: "Pack Presets Premium",
    reportadoPor: "Ana Beatriz",
    reportadoPorEmail: "ana@pixelmind.gg",
    motivo: "Material gratuito sendo vendido como exclusivo.",
    categoria: "fraude",
    status: "pendente",
    dataDenuncia: "2026-08-17T08:33:00Z",
    atribuido: null,
  },
  {
    id: "DEN-2026-00136",
    tipoItem: "checkout",
    itemId: "CK-41102",
    itemTitulo: "Checkout Black Weekend · 5x",
    reportadoPor: "Larissa Mendes",
    reportadoPorEmail: "larissa@modaluma.com.br",
    motivo: "Taxa de juros embutida não declarada no carrinho.",
    categoria: "financeiro",
    status: "pendente",
    dataDenuncia: "2026-08-16T22:10:00Z",
    atribuido: null,
  },
  {
    id: "DEN-2026-00135",
    tipoItem: "empresa",
    itemId: "EMP-00008",
    itemTitulo: "CryptoClub Investimentos",
    reportadoPor: "Cliente anônimo",
    reportadoPorEmail: "anonimo3@email.com",
    motivo: "Esquema de pirâmide, prometem ganhos com indicações.",
    categoria: "fraude",
    status: "aprovado",
    dataDenuncia: "2026-07-28T14:00:00Z",
    atribuido: "Compliance",
    notas: "Empresa banida permanentemente e conta congelada.",
  },
];

const tabs: TabMod[] = ["pendente", "analise", "aprovado", "rejeitado", "todos"];

const tabsMap: Record<TabMod, { label: string; icon: LucideIcon; count?: number }> = {
  pendente: { label: "Pendentes", icon: ShieldAlert },
  analise: { label: "Em análise", icon: Eye },
  aprovado: { label: "Aprovados", icon: ThumbsUp },
  rejeitado: { label: "Rejeitados", icon: ThumbsDown },
  todos: { label: "Todos", icon: Gavel },
};

const tipoIcon: Record<TipoItem, LucideIcon> = {
  produto: Package,
  checkout: Receipt,
  empresa: Building2,
};

function ItemTipo({ tipo }: { tipo: TipoItem }) {
  const Icon = tipoIcon[tipo];
  const map: Record<TipoItem, string> = {
    produto: "bg-purple-500/10 text-purple-600",
    checkout: "bg-blue-500/10 text-blue-600",
    empresa: "bg-primary/10 text-primary",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        map[tipo],
      )}
    >
      <Icon className="h-3 w-3" />
      {tipo}
    </span>
  );
}

function CategoriaPill({ cat }: { cat: CategoriaRisco }) {
  const map: Record<CategoriaRisco, string> = {
    conteudo: "bg-blue-500/10 text-blue-600",
    financeiro: "bg-amber-500/10 text-amber-700",
    fraude: "bg-rose-500/10 text-rose-700",
    seguranca: "bg-orange-500/10 text-orange-700",
    outros: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        map[cat],
      )}
    >
      {cat}
    </span>
  );
}

function StatusPill({ status }: { status: StatusMod }) {
  const map: Record<StatusMod, string> = {
    pendente: "bg-amber-500/10 text-amber-700",
    analise: "bg-blue-500/10 text-blue-600",
    aprovado: "bg-emerald-500/10 text-emerald-700",
    rejeitado: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        map[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {status === "analise" ? "em análise" : status}
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

function AdminModeracaoPage() {
  const loading = useFakeLoading();
  const [tab, setTab] = useState<TabMod>("pendente");
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState<CategoriaRisco | "todos">("todos");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return denunciasMock.filter((d) => {
      if (tab !== "todos" && d.status !== tab) return false;
      if (categoria !== "todos" && d.categoria !== categoria) return false;
      if (!q) return true;
      return (
        d.itemTitulo.toLowerCase().includes(q) ||
        d.motivo.toLowerCase().includes(q) ||
        d.reportadoPor.toLowerCase().includes(q)
      );
    });
  }, [tab, query, categoria]);

  const pendentes = denunciasMock.filter((d) => d.status === "pendente").length;
  const analise = denunciasMock.filter((d) => d.status === "analise").length;
  const aprovadas = denunciasMock.filter((d) => d.status === "aprovado").length;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Administração
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Moderação</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Denúncias de produtos, checkouts e empresas reportadas por usuários da plataforma.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <Download className="h-4 w-4" /> Exportar
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="mt-6">
          <CardsSkeleton count={4} />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={ShieldAlert}
            label="Pendentes de triagem"
            value={formatInt(pendentes)}
            hint="Novas denúncias sem triagem"
            accent
          />
          <KpiCard
            icon={Eye}
            label="Em análise"
            value={formatInt(analise)}
            hint="Aguardando decisão do moderador"
          />
          <KpiCard
            icon={CheckCircle2}
            label="Procedentes"
            value={formatInt(aprovadas)}
            hint="Denúncias confirmadas este mês"
          />
          <KpiCard
            icon={Gavel}
            label="Total analisado"
            value={formatInt(denunciasMock.length)}
            hint="Histórico de moderação"
          />
        </div>
      )}

      <section className="mt-6">
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v as TabMod);
          }}
          className="w-full"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
            <TabsList>
              {tabs.map((t) => {
                const meta = tabsMap[t];
                const count =
                  t === "todos"
                    ? denunciasMock.length
                    : denunciasMock.filter((d) => d.status === t).length;
                return (
                  <TabsTrigger key={t} value={t} className="gap-1.5">
                    <meta.icon className="h-3.5 w-3.5" />
                    {meta.label}
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                      {count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar item ou denunciante..."
                  className="pl-9"
                />
              </div>
              <Select
                value={categoria}
                onValueChange={(v) => setCategoria(v as CategoriaRisco | "todos")}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as categorias</SelectItem>
                  {(["conteudo", "financeiro", "fraude", "seguranca", "outros"] as CategoriaRisco[]).map(
                    (c) => (
                      <SelectItem key={c} value={c} className="capitalize">
                        {c}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={tab} className="mt-4">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              {loading ? (
                <TableSkeleton rows={6} cols={9} />
              ) : rows.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Nenhuma denúncia nesta fila"
                  description="Troque de aba ou ajuste os filtros de busca e categoria para ver mais itens."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1200px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-5 py-3 font-medium">Item</th>
                        <th className="px-5 py-3 font-medium">Reportado por</th>
                        <th className="px-5 py-3 font-medium">Motivo</th>
                        <th className="px-5 py-3 font-medium">Categoria</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Atribuído</th>
                        <th className="px-5 py-3 font-medium">Denúncia</th>
                        <th className="px-5 py-3 text-right font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rows.map((d) => (
                        <tr key={d.id} className="transition-colors hover:bg-muted/50">
                          <td className="px-5 py-3">
                            <div className="flex items-start gap-2.5">
                              <ItemTipo tipo={d.tipoItem} />
                              <div className="min-w-0">
                                <p className="truncate font-medium text-foreground">
                                  {d.itemTitulo}
                                </p>
                                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                  {d.itemId}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <p className="font-medium text-foreground">{d.reportadoPor}</p>
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {d.reportadoPorEmail}
                            </p>
                          </td>
                          <td className="px-5 py-3 max-w-[300px]">
                            <p className="line-clamp-2 text-muted-foreground">{d.motivo}</p>
                            {d.notas && (
                              <p className="mt-1.5 truncate text-[11px] italic text-muted-foreground">
                                Nota: {d.notas}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <CategoriaPill cat={d.categoria} />
                          </td>
                          <td className="px-5 py-3">
                            <StatusPill status={d.status} />
                          </td>
                          <td className="px-5 py-3 text-xs text-muted-foreground">
                            {d.atribuido ?? (
                              <Badge variant="outline" className="border-dashed text-[10px]">
                                Não atribuído
                              </Badge>
                            )}
                          </td>
                          <td className="px-5 py-3 tabular-nums text-xs text-muted-foreground">
                            {formatDateTime(d.dataDenuncia)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <Button size="sm" variant="ghost" className="gap-1 h-8 px-2">
                                <Eye className="h-3.5 w-3.5" />
                                Detalhes
                              </Button>
                              {d.status !== "aprovado" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700"
                                >
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                  <span className="sr-only">Aprovar</span>
                                </Button>
                              )}
                              {d.status !== "rejeitado" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-muted-foreground"
                                >
                                  <ThumbsDown className="h-3.5 w-3.5" />
                                  <span className="sr-only">Rejeitar</span>
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700"
                              >
                                <Ban className="h-3.5 w-3.5" />
                                <span className="sr-only">Banir</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/admin/moderacao")({
  head: () => ({ meta: [{ title: "Moderação · Admin · Cash Engine PRO" }] }),
  component: AdminModeracaoPage,
});
