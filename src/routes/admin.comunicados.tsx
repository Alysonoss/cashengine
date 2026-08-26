import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  BadgeCheck,
  BellRing,
  Building2,
  Calendar,
  Download,
  Edit,
  Eye,
  Info,
  Megaphone,
  Pencil,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { CardsSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { EmptyState } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";
import { formatDateTime, formatInt } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TipoComunicado = "informativo" | "aviso" | "manutencao" | "urgente";
type PublicoAlvo = "todos" | "empresas_pro" | "empresas_enterprise" | "usuarios_admin" | "afiliados";

type Comunicado = {
  id: string;
  titulo: string;
  tipo: TipoComunicado;
  mensagem: string;
  dataInicio: string;
  dataFim: string | null;
  publicoAlvo: PublicoAlvo;
  totalVisualizacoes: number;
  totalEntregues: number;
  criadoPor: string;
  criadoEm: string;
  ativo: boolean;
};

const comunicadosMock: Comunicado[] = [
  {
    id: "COM-2026-00008",
    titulo: "Manutenção programada · 22/08 · 02:00 às 04:00",
    tipo: "manutencao",
    mensagem:
      "Realizaremos atualizações no módulo de split e nos gateways de cartão. API, painel e checkouts podem ficar indisponíveis por até 15 minutos durante a janela. Nenhum dado será perdido.",
    dataInicio: "2026-08-20T00:00:00Z",
    dataFim: "2026-08-23T05:00:00Z",
    publicoAlvo: "todos",
    totalVisualizacoes: 3842,
    totalEntregues: 9120,
    criadoPor: "admin@cash.engine",
    criadoEm: "2026-08-16T10:00:00Z",
    ativo: true,
  },
  {
    id: "COM-2026-00007",
    titulo: "URGENTE · Novo gateway Pix ativo",
    tipo: "urgente",
    mensagem:
      "Adicionamos o Gerencianet como novo provedor de Pix. Recomendamos migrar suas chaves até 30/08 para evitar indisponibilidade. Melhor taxa: 0,99% sem tarifa mínima.",
    dataInicio: "2026-08-15T12:00:00Z",
    dataFim: "2026-08-31T23:59:00Z",
    publicoAlvo: "empresas_enterprise",
    totalVisualizacoes: 128,
    totalEntregues: 210,
    criadoPor: "admin@cash.engine",
    criadoEm: "2026-08-15T11:30:00Z",
    ativo: true,
  },
  {
    id: "COM-2026-00006",
    titulo: "Aviso · Política de chargeback atualizada",
    tipo: "aviso",
    mensagem:
      "A partir de 01/09, empresas com taxa de chargeback acima de 1,5% serão automaticamente movidas para análise de risco reforçada, com retenção adicional de 5 dias nos valores.",
    dataInicio: "2026-08-14T00:00:00Z",
    dataFim: "2026-09-10T23:59:00Z",
    publicoAlvo: "empresas_pro",
    totalVisualizacoes: 2104,
    totalEntregues: 5880,
    criadoPor: "Compliance",
    criadoEm: "2026-08-14T09:15:00Z",
    ativo: true,
  },
  {
    id: "COM-2026-00005",
    titulo: "Informativo · Programa VIP agora inclui suporte prioritário",
    tipo: "informativo",
    mensagem:
      "Empresas marcadas como VIP contam agora com SLA de resposta em 15 minutos no suporte, gerente de conta dedicado e limite de saque diário dobrado. Solicite pelo suporte.",
    dataInicio: "2026-08-10T00:00:00Z",
    dataFim: null,
    publicoAlvo: "todos",
    totalVisualizacoes: 5520,
    totalEntregues: 9120,
    criadoPor: "admin@cash.engine",
    criadoEm: "2026-08-10T14:00:00Z",
    ativo: true,
  },
  {
    id: "COM-2026-00004",
    titulo: "Manutenção concluída · Pix melhorado",
    tipo: "informativo",
    mensagem:
      "A janela de manutenção do dia 10/08 foi concluída com sucesso. Aprovação Pix instantânea agora é 3x mais rápida e temos 99,98% de uptime.",
    dataInicio: "2026-08-11T00:00:00Z",
    dataFim: "2026-08-18T23:59:00Z",
    publicoAlvo: "todos",
    totalVisualizacoes: 4102,
    totalEntregues: 9120,
    criadoPor: "Engenharia",
    criadoEm: "2026-08-11T05:30:00Z",
    ativo: false,
  },
  {
    id: "COM-2026-00003",
    titulo: "Aviso · Admin global agora exige 2FA obrigatório",
    tipo: "aviso",
    mensagem:
      "Para reforçar a segurança, todos os administradores globais devem ativar 2FA em até 15 dias após o primeiro login. Acesse Configurações → Segurança.",
    dataInicio: "2026-08-05T00:00:00Z",
    dataFim: "2026-08-20T23:59:00Z",
    publicoAlvo: "usuarios_admin",
    totalVisualizacoes: 42,
    totalEntregues: 48,
    criadoPor: "Segurança",
    criadoEm: "2026-08-05T08:00:00Z",
    ativo: true,
  },
  {
    id: "COM-2026-00002",
    titulo: "URGENTE · Bugs detectados em split em produtos com bump",
    tipo: "urgente",
    mensagem:
      "Identificamos um problema no cálculo de split em checkouts com order bump. Já está sendo corrigido e valores são reprocessados automaticamente até end of day.",
    dataInicio: "2026-07-28T18:30:00Z",
    dataFim: "2026-08-01T23:59:00Z",
    publicoAlvo: "empresas_pro",
    totalVisualizacoes: 3901,
    totalEntregues: 5880,
    criadoPor: "Engenharia",
    criadoEm: "2026-07-28T18:00:00Z",
    ativo: false,
  },
  {
    id: "COM-2026-00001",
    titulo: "Informativo · Programa de afiliados 2.0 lançado",
    tipo: "informativo",
    mensagem:
      "Agora os afiliados contam com marketplace próprio, links inteligentes e ranking com premiações. Comissão padrão permanece em 30%.",
    dataInicio: "2026-07-20T00:00:00Z",
    dataFim: null,
    publicoAlvo: "afiliados",
    totalVisualizacoes: 7280,
    totalEntregues: 12450,
    criadoPor: "Marketing",
    criadoEm: "2026-07-19T17:00:00Z",
    ativo: true,
  },
];

const publicoLabels: Record<PublicoAlvo, string> = {
  todos: "Toda a plataforma",
  empresas_pro: "Planos Pro e Free",
  empresas_enterprise: "Planos Enterprise",
  usuarios_admin: "Somente admins globais",
  afiliados: "Afiliados",
};

const tipoMeta: Record<TipoComunicado, { label: string; cls: string; icon: LucideIcon }> = {
  informativo: {
    label: "Informativo",
    cls: "bg-blue-500/10 text-blue-600",
    icon: Info,
  },
  aviso: {
    label: "Aviso",
    cls: "bg-amber-500/10 text-amber-700",
    icon: AlertTriangle,
  },
  manutencao: {
    label: "Manutenção",
    cls: "bg-purple-500/10 text-purple-600",
    icon: Wrench,
  },
  urgente: {
    label: "Urgente",
    cls: "bg-rose-500/10 text-rose-700",
    icon: Megaphone,
  },
};

function TipoBadge({ tipo }: { tipo: TipoComunicado }) {
  const item = tipoMeta[tipo];
  const Icon = item.icon;
  return (
    <Badge variant="secondary" className={cn("uppercase text-[10px] font-medium", item.cls)}>
      <Icon className="mr-1 h-3 w-3" /> {item.label}
    </Badge>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
  danger,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            danger ? "bg-rose-500/10 text-rose-600" : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p
        className={
          accent
            ? "mt-4 text-2xl font-semibold tabular-nums tracking-tight text-primary"
            : danger
              ? "mt-4 text-2xl font-semibold tabular-nums tracking-tight text-rose-600"
              : "mt-4 text-2xl font-semibold tabular-nums tracking-tight text-foreground"
        }
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function AdminComunicadosPage() {
  const loading = useFakeLoading();
  const [query, setQuery] = useState("");
  const [tipo, setTipo] = useState<TipoComunicado | "todos">("todos");
  const [publico, setPublico] = useState<PublicoAlvo | "todos">("todos");
  const [status, setStatus] = useState<"todos" | "ativos" | "arquivados">("ativos");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return comunicadosMock.filter((c) => {
      if (tipo !== "todos" && c.tipo !== tipo) return false;
      if (publico !== "todos" && c.publicoAlvo !== publico) return false;
      if (status === "ativos" && !c.ativo) return false;
      if (status === "arquivados" && c.ativo) return false;
      if (!q) return true;
      return c.titulo.toLowerCase().includes(q) || c.mensagem.toLowerCase().includes(q);
    });
  }, [query, tipo, publico, status]);

  const ativos = comunicadosMock.filter((c) => c.ativo).length;
  const urgentes = comunicadosMock.filter((c) => c.tipo === "urgente" && c.ativo).length;
  const totalViews = comunicadosMock.reduce((a, b) => a + b.totalVisualizacoes, 0);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Administração
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Comunicados</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Avisos, manutenções e comunicados globais para toda a plataforma ou públicos-alvo
            específicos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <Download className="h-4 w-4" /> Exportar
          </Button>
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" /> Novo comunicado
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
            icon={Megaphone}
            label="Ativos agora"
            value={formatInt(ativos)}
            hint={`${formatInt(comunicadosMock.length)} total publicados`}
            accent
          />
          <KpiCard
            icon={BellRing}
            label="Comunicados urgentes"
            value={formatInt(urgentes)}
            hint="Alta prioridade · destaque"
            danger
          />
          <KpiCard
            icon={Eye}
            label="Visualizações totais"
            value={formatInt(totalViews)}
            hint="Soma de todos os comunicados"
          />
          <KpiCard
            icon={Users}
            label="Alcance único"
            value="9.120"
            hint="Contas atingidas nesta semana"
          />
        </div>
      )}

      <section className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar comunicado por título ou mensagem..."
            className="pl-9"
          />
        </div>
        <Select value={tipo} onValueChange={(v) => setTipo(v as TipoComunicado | "todos")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            {(["informativo", "aviso", "manutencao", "urgente"] as TipoComunicado[]).map((t) => (
              <SelectItem key={t} value={t} className="capitalize">
                {tipoMeta[t].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={publico} onValueChange={(v) => setPublico(v as PublicoAlvo | "todos")}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Público alvo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os públicos</SelectItem>
            {([
              "todos",
              "empresas_pro",
              "empresas_enterprise",
              "usuarios_admin",
              "afiliados",
            ] as PublicoAlvo[]).map((p) => (
              <SelectItem key={p} value={p}>
                {publicoLabels[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativos">Ativos</SelectItem>
            <SelectItem value="arquivados">Arquivados</SelectItem>
            <SelectItem value="todos">Todos</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section className="mt-4">
        {loading ? (
          <CardsSkeleton count={4} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="Nenhum comunicado encontrado"
            description="Crie um novo comunicado para avisar toda a plataforma sobre manutenções, atualizações ou emergências."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((c) => {
              const tipoInfo = tipoMeta[c.tipo];
              const TipoIcon = tipoInfo.icon;
              return (
                <Card
                  key={c.id}
                  className={cn(
                    "group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md",
                    c.tipo === "urgente" && "border-rose-500/40",
                  )}
                >
                  {c.tipo === "urgente" ? (
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500 via-rose-400 to-rose-500" />
                  ) : c.tipo === "manutencao" ? (
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500" />
                  ) : null}
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <TipoBadge tipo={c.tipo} />
                      {c.ativo ? (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-700 uppercase text-[10px]"
                        >
                          <Sparkles className="mr-1 h-3 w-3" /> Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-dashed uppercase text-[10px]">
                          Arquivado
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base leading-snug">{c.titulo}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-[11px]">
                      <Settings className="h-3 w-3" /> Por {c.criadoPor} ·{" "}
                      {formatDateTime(c.criadoEm)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3 space-y-3">
                    <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                      {c.mensagem}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                          <Calendar className="h-3 w-3" /> Vigência
                        </div>
                        <p className="mt-1 text-xs font-medium text-foreground">
                          Início: {formatDateTime(c.dataInicio).split(" ")[0]}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Fim: {c.dataFim ? formatDateTime(c.dataFim).split(" ")[0] : "Indeterminado"}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                          <Users className="h-3 w-3" /> Público
                        </div>
                        <p className="mt-1 text-xs font-medium text-foreground line-clamp-2">
                          {publicoLabels[c.publicoAlvo]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Eye className="h-3.5 w-3.5" />
                        Visualizações
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums text-foreground">
                          {formatInt(c.totalVisualizacoes)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          de {formatInt(c.totalEntregues)} entregues
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Taxa de abertura</span>
                        <span className="font-semibold tabular-nums text-foreground">
                          {formatInt(
                            Math.round((c.totalVisualizacoes / c.totalEntregues) * 100),
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            c.tipo === "urgente"
                              ? "bg-rose-500"
                              : c.tipo === "manutencao"
                                ? "bg-purple-500"
                                : c.tipo === "aviso"
                                  ? "bg-amber-500"
                                  : "bg-primary",
                          )}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((c.totalVisualizacoes / c.totalEntregues) * 100),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span className="truncate">{c.id}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-3.5 w-3.5" />
                        <span className="sr-only">Visualizar</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Ações</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuLabel>Operações</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <BadgeCheck className="h-4 w-4" />
                            {c.ativo ? "Arquivar" : "Reativar"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600">
                            <Trash2 className="h-4 w-4" /> Excluir comunicado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export const Route = createFileRoute("/admin/comunicados")({
  head: () => ({ meta: [{ title: "Comunicados · Admin · Cash Engine PRO" }] }),
  component: AdminComunicadosPage,
});
