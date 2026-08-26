import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  MessageCircle,
  Search,
  ShieldCheck,
  Ticket,
  UserCheck,
  XCircle,
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

type TabTicket = "abertos" | "respondidos" | "analise" | "resolvidos" | "fechados";
type Prioridade = "baixa" | "media" | "alta" | "critica";
type Departamento = "atendimento" | "financeiro" | "tecnico" | "comercial" | "compliance";
type TipoTicket = "duvida" | "problema" | "solicitacao" | "bug" | "reclamacao";
type StatusTicket = TabTicket;

type TicketSuporte = {
  protocolo: string;
  assunto: string;
  clienteNome: string;
  clienteEmpresa: string | null;
  tipo: TipoTicket;
  prioridade: Prioridade;
  departamento: Departamento;
  atribuidoPara: string | null;
  dataAbertura: string;
  slaMinutos: number;
  slaViolado: boolean;
  status: StatusTicket;
  qtdMensagens: number;
};

const ticketsMock: TicketSuporte[] = [
  {
    protocolo: "SUP-2026-00184",
    assunto: "Não consigo sacar meu saldo de R$ 18.400",
    clienteNome: "Maria Fernanda",
    clienteEmpresa: "NovaTech Soluções Digitais",
    tipo: "problema",
    prioridade: "critica",
    departamento: "financeiro",
    atribuidoPara: "Atendente Rafael",
    dataAbertura: "2026-08-17T12:40:00Z",
    slaMinutos: 60,
    slaViolado: true,
    status: "abertos",
    qtdMensagens: 4,
  },
  {
    protocolo: "SUP-2026-00183",
    assunto: "Webhook não está disparando após aprovação do Pix",
    clienteNome: "Juliana Paiva",
    clienteEmpresa: "Lotus Cursos Online",
    tipo: "bug",
    prioridade: "alta",
    departamento: "tecnico",
    atribuidoPara: "Suporte Camila",
    dataAbertura: "2026-08-17T10:12:00Z",
    slaMinutos: 120,
    slaViolado: true,
    status: "analise",
    qtdMensagens: 9,
  },
  {
    protocolo: "SUP-2026-00182",
    assunto: "Solicitação de aumento de limite de saque diário",
    clienteNome: "Ana Beatriz",
    clienteEmpresa: "PixelMind Games",
    tipo: "solicitacao",
    prioridade: "media",
    departamento: "comercial",
    atribuidoPara: "Gerente Lucas",
    dataAbertura: "2026-08-17T08:58:00Z",
    slaMinutos: 240,
    slaViolado: false,
    status: "respondidos",
    qtdMensagens: 3,
  },
  {
    protocolo: "SUP-2026-00181",
    assunto: "Dúvida sobre emissão de nota fiscal em vendas com split",
    clienteNome: "Carlos Eduardo",
    clienteEmpresa: "BlackPepper E-commerce",
    tipo: "duvida",
    prioridade: "baixa",
    departamento: "atendimento",
    atribuidoPara: "Atendente Clara",
    dataAbertura: "2026-08-16T17:33:00Z",
    slaMinutos: 480,
    slaViolado: false,
    status: "resolvidos",
    qtdMensagens: 6,
  },
  {
    protocolo: "SUP-2026-00180",
    assunto: "Chargeback indevido em transação Pix CK-55110",
    clienteNome: "Larissa Mendes",
    clienteEmpresa: "ModaLuma Boutique",
    tipo: "reclamacao",
    prioridade: "alta",
    departamento: "financeiro",
    atribuidoPara: "Financeiro Priscila",
    dataAbertura: "2026-08-16T15:05:00Z",
    slaMinutos: 120,
    slaViolado: false,
    status: "analise",
    qtdMensagens: 7,
  },
  {
    protocolo: "SUP-2026-00179",
    assunto: "Contratando plano Enterprise · preciso de proposta",
    clienteNome: "Comprador @ BigCorp",
    clienteEmpresa: "BigCorp Brasil",
    tipo: "solicitacao",
    prioridade: "media",
    departamento: "comercial",
    atribuidoPara: null,
    dataAbertura: "2026-08-16T14:20:00Z",
    slaMinutos: 240,
    slaViolado: true,
    status: "abertos",
    qtdMensagens: 1,
  },
  {
    protocolo: "SUP-2026-00178",
    assunto: "API de saques retornando erro 500 desde 02:00",
    clienteNome: "Integrações NovaTech",
    clienteEmpresa: "NovaTech Soluções Digitais",
    tipo: "bug",
    prioridade: "critica",
    departamento: "tecnico",
    atribuidoPara: "Engenheiro Leo",
    dataAbertura: "2026-08-17T02:14:00Z",
    slaMinutos: 15,
    slaViolado: false,
    status: "fechados",
    qtdMensagens: 12,
  },
  {
    protocolo: "SUP-2026-00177",
    assunto: "Alteração de titularidade da conta",
    clienteNome: "Paulo Henrique",
    clienteEmpresa: "VerdeVida Suplementos",
    tipo: "solicitacao",
    prioridade: "alta",
    departamento: "compliance",
    atribuidoPara: "Compliance Sofia",
    dataAbertura: "2026-08-15T11:00:00Z",
    slaMinutos: 180,
    slaViolado: false,
    status: "respondidos",
    qtdMensagens: 5,
  },
];

const tabs: TabTicket[] = ["abertos", "respondidos", "analise", "resolvidos", "fechados"];

const tabLabels: Record<TabTicket, string> = {
  abertos: "Abertos",
  respondidos: "Respondidos",
  analise: "Em análise",
  resolvidos: "Resolvidos",
  fechados: "Fechados",
};

function PrioridadePill({ prioridade }: { prioridade: Prioridade }) {
  const map: Record<Prioridade, string> = {
    baixa: "bg-muted text-muted-foreground",
    media: "bg-blue-500/10 text-blue-600",
    alta: "bg-orange-500/10 text-orange-700",
    critica: "bg-rose-500/10 text-rose-700",
  };
  return (
    <Badge
      variant="secondary"
      className={cn("uppercase text-[10px] font-medium", map[prioridade])}
    >
      {prioridade}
    </Badge>
  );
}

function TipoBadge({ tipo }: { tipo: TipoTicket }) {
  const map: Record<TipoTicket, { label: string; cls: string }> = {
    duvida: { label: "Dúvida", cls: "bg-indigo-500/10 text-indigo-600" },
    problema: { label: "Problema", cls: "bg-rose-500/10 text-rose-700" },
    solicitacao: { label: "Solicitação", cls: "bg-emerald-500/10 text-emerald-700" },
    bug: { label: "Bug", cls: "bg-amber-500/10 text-amber-700" },
    reclamacao: { label: "Reclamação", cls: "bg-purple-500/10 text-purple-600" },
  };
  const item = map[tipo];
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        item.cls,
      )}
    >
      {item.label}
    </span>
  );
}

function SlaBadge({ violado, minutos }: { violado: boolean; minutos: number }) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  const text = h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ""}` : `${m}m`;
  if (violado) {
    return (
      <Badge variant="destructive" className="uppercase text-[10px]">
        <AlertTriangle className="mr-1 h-3 w-3" /> violado · {text}
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="uppercase text-[10px] bg-emerald-500/10 text-emerald-700">
      <Clock className="mr-1 h-3 w-3" /> {text}
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

function AdminSuportePage() {
  const loading = useFakeLoading();
  const [tab, setTab] = useState<TabTicket>("abertos");
  const [query, setQuery] = useState("");
  const [prioridade, setPrioridade] = useState<Prioridade | "todos">("todos");
  const [departamento, setDepartamento] = useState<Departamento | "todos">("todos");
  const [tipo, setTipo] = useState<TipoTicket | "todos">("todos");
  const [atribuido, setAtribuido] = useState<"todos" | "sim" | "nao">("todos");
  const [slaViolado, setSlaViolado] = useState<"todos" | "sim" | "nao">("todos");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ticketsMock.filter((t) => {
      if (t.status !== tab) return false;
      if (prioridade !== "todos" && t.prioridade !== prioridade) return false;
      if (departamento !== "todos" && t.departamento !== departamento) return false;
      if (tipo !== "todos" && t.tipo !== tipo) return false;
      if (atribuido === "sim" && !t.atribuidoPara) return false;
      if (atribuido === "nao" && t.atribuidoPara) return false;
      if (slaViolado === "sim" && !t.slaViolado) return false;
      if (slaViolado === "nao" && t.slaViolado) return false;
      if (!q) return true;
      return (
        t.assunto.toLowerCase().includes(q) ||
        t.protocolo.toLowerCase().includes(q) ||
        t.clienteNome.toLowerCase().includes(q)
      );
    });
  }, [tab, query, prioridade, departamento, tipo, atribuido, slaViolado]);

  const abertos = ticketsMock.filter((t) => t.status === "abertos").length;
  const violados = ticketsMock.filter((t) => t.slaViolado).length;
  const criticos = ticketsMock.filter((t) => t.prioridade === "critica").length;
  const naoAtribuidos = ticketsMock.filter((t) => !t.atribuidoPara).length;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Administração
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Suporte</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Tickets globais de toda a plataforma com SLA, prioridades e atribuições.
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
            icon={Ticket}
            label="Abertos agora"
            value={formatInt(abertos)}
            hint="Aguardando primeira resposta"
            accent
          />
          <KpiCard
            icon={AlertTriangle}
            label="SLA violado"
            value={formatInt(violados)}
            hint="Fora do prazo acordado"
            danger
          />
          <KpiCard
            icon={ShieldCheck}
            label="Prioridade crítica"
            value={formatInt(criticos)}
            hint="Requerem atenção imediata"
            danger
          />
          <KpiCard
            icon={UserCheck}
            label="Sem atribuição"
            value={formatInt(naoAtribuidos)}
            hint="Precisam de responsável"
          />
        </div>
      )}

      <section className="mt-6">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as TabTicket)}
          className="w-full"
        >
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-3">
              <TabsList>
                {tabs.map((t) => {
                  const count = ticketsMock.filter((x) => x.status === t).length;
                  return (
                    <TabsTrigger key={t} value={t} className="gap-1.5">
                      {tabLabels[t]}
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                        {count}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              <div className="relative min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busca · protocolo, assunto, cliente..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid gap-2 border-b border-border p-3 sm:grid-cols-5">
              <Select
                value={prioridade}
                onValueChange={(v) => setPrioridade(v as Prioridade | "todos")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as prioridades</SelectItem>
                  {(["baixa", "media", "alta", "critica"] as Prioridade[]).map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={departamento}
                onValueChange={(v) => setDepartamento(v as Departamento | "todos")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os deptos</SelectItem>
                  {([
                    "atendimento",
                    "financeiro",
                    "tecnico",
                    "comercial",
                    "compliance",
                  ] as Departamento[]).map((d) => (
                    <SelectItem key={d} value={d} className="capitalize">
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={tipo} onValueChange={(v) => setTipo(v as TipoTicket | "todos")}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  {(["duvida", "problema", "solicitacao", "bug", "reclamacao"] as TipoTicket[]).map(
                    (t) => (
                      <SelectItem key={t} value={t} className="capitalize">
                        {t}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>

              <Select value={atribuido} onValueChange={(v) => setAtribuido(v as typeof atribuido)}>
                <SelectTrigger>
                  <SelectValue placeholder="Atribuído" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="sim">Atribuídos</SelectItem>
                  <SelectItem value="nao">Não atribuídos</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={slaViolado}
                onValueChange={(v) => setSlaViolado(v as typeof slaViolado)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="SLA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="sim">Somente SLA violado</SelectItem>
                  <SelectItem value="nao">SLA em dia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tabs.map((t) => (
              <TabsContent key={t} value={t} className="mt-0">
                {loading ? (
                  <TableSkeleton rows={6} cols={9} />
                ) : rows.length === 0 ? (
                  <EmptyState
                    icon={MessageCircle}
                    title={`Nenhum ticket em "${tabLabels[t].toLowerCase()}"`}
                    description="Ajuste os filtros de prioridade, departamento, atribuição ou SLA para ver mais resultados."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px] text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                          <th className="px-5 py-3 font-medium">Protocolo</th>
                          <th className="px-5 py-3 font-medium">Assunto</th>
                          <th className="px-5 py-3 font-medium">Cliente / Empresa</th>
                          <th className="px-5 py-3 font-medium">Tipo</th>
                          <th className="px-5 py-3 font-medium">Prioridade</th>
                          <th className="px-5 py-3 font-medium">Atribuído</th>
                          <th className="px-5 py-3 font-medium">Aberto em</th>
                          <th className="px-5 py-3 font-medium">SLA</th>
                          <th className="px-5 py-3 text-right font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {rows.map((tk) => (
                          <tr key={tk.protocolo} className="transition-colors hover:bg-muted/50">
                            <td className="px-5 py-3">
                              <div>
                                <p className="font-mono text-xs font-medium text-foreground">
                                  {tk.protocolo}
                                </p>
                                <p className="mt-0.5 text-[11px] text-muted-foreground">
                                  <MessageCircle className="mr-1 inline h-3 w-3 align-[-2px]" />
                                  {tk.qtdMensagens} mensagens
                                </p>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <p className="truncate font-medium text-foreground max-w-[340px]">
                                {tk.assunto}
                              </p>
                            </td>
                            <td className="px-5 py-3">
                              <div className="min-w-0">
                                <p className="truncate font-medium text-foreground">
                                  {tk.clienteNome}
                                </p>
                                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                                  {tk.clienteEmpresa ?? "Cliente sem empresa"}
                                </p>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <TipoBadge tipo={tk.tipo} />
                            </td>
                            <td className="px-5 py-3">
                              <PrioridadePill prioridade={tk.prioridade} />
                            </td>
                            <td className="px-5 py-3 text-xs">
                              {tk.atribuidoPara ? (
                                <div className="flex items-center gap-1.5 text-foreground">
                                  <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                                  <span className="truncate">{tk.atribuidoPara}</span>
                                </div>
                              ) : (
                                <Badge variant="outline" className="border-dashed text-[10px]">
                                  Não atribuído
                                </Badge>
                              )}
                            </td>
                            <td className="px-5 py-3 tabular-nums text-xs text-muted-foreground">
                              {formatDateTime(tk.dataAbertura)}
                            </td>
                            <td className="px-5 py-3">
                              <SlaBadge violado={tk.slaViolado} minutos={tk.slaMinutos} />
                            </td>
                            <td className="px-5 py-3 text-right">
                              <div className="inline-flex items-center gap-1">
                                <Button size="sm" variant="ghost" className="gap-1 h-8 px-2">
                                  <Eye className="h-3.5 w-3.5" /> Abrir
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-primary"
                                  title="Responder"
                                >
                                  <MessageCircle className="h-3.5 w-3.5" />
                                  <span className="sr-only">Responder</span>
                                </Button>
                                {tk.status !== "fechados" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-rose-600"
                                    title="Fechar"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only">Fechar</span>
                                  </Button>
                                )}
                                {tk.status === "resolvidos" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-emerald-600"
                                    title="Marcar resolvido"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span className="sr-only">Resolver</span>
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/admin/suporte")({
  head: () => ({ meta: [{ title: "Suporte · Admin · Cash Engine PRO" }] }),
  component: AdminSuportePage,
});
