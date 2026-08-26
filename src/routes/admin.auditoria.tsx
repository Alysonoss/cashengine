import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Download,
  Eye,
  FileJson,
  Fingerprint,
  KeyRound,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShieldHalf,
  User,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { CardsSkeleton, TableSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { EmptyState } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";
import { formatDateTime, formatInt } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

type Modulo =
  | "auth"
  | "empresas"
  | "usuarios"
  | "financeiro"
  | "produtos"
  | "checkouts"
  | "moderacao"
  | "admin";

type Acao = "create" | "update" | "delete" | "read" | "login_sucesso" | "login_falha" | "export";

type RiscoAud = "baixo" | "medio" | "alto" | "critico";

type LogAuditoria = {
  id: string;
  dataHora: string;
  usuario: string;
  usuarioId: string;
  empresa: string | null;
  empresaId: string | null;
  modulo: Modulo;
  acao: Acao;
  ip: string;
  pais: string;
  riscoScore: number;
  risco: RiscoAud;
  alerta: boolean;
  descricao: string;
  payload: Record<string, unknown>;
};

const logsMock: LogAuditoria[] = [
  {
    id: "LOG-20260817-00001",
    dataHora: "2026-08-17T14:32:18Z",
    usuario: "Maria Fernanda",
    usuarioId: "USR-00001",
    empresa: "NovaTech Soluções Digitais",
    empresaId: "EMP-00001",
    modulo: "financeiro",
    acao: "create",
    ip: "187.45.12.88",
    pais: "Brasil",
    riscoScore: 6,
    risco: "baixo",
    alerta: false,
    descricao: "Solicitação de saque no valor de R$ 12.500,00 para conta bancária cadastrada.",
    payload: {
      valor: 12500,
      tipo: "saque_ted",
      conta: "***0012-3",
    },
  },
  {
    id: "LOG-20260817-00002",
    dataHora: "2026-08-17T14:28:05Z",
    usuario: "Tentativa anônima",
    usuarioId: null as unknown as string,
    empresa: null,
    empresaId: null,
    modulo: "auth",
    acao: "login_falha",
    ip: "45.177.88.12",
    pais: "Rússia",
    riscoScore: 98,
    risco: "critico",
    alerta: true,
    descricao: "Tentativa de login com credenciais inválidas · 8ª tentativa seguida em 2 minutos.",
    payload: {
      tentativas: 8,
      email_alvo: "admin@cash.engine",
      bloqueio_aplicado: true,
    },
  },
  {
    id: "LOG-20260817-00003",
    dataHora: "2026-08-17T13:55:44Z",
    usuario: "admin@cash.engine",
    usuarioId: "USR-00003",
    empresa: "Cash Engine PRO",
    empresaId: "EMP-00000",
    modulo: "admin",
    acao: "update",
    ip: "200.147.102.20",
    pais: "Brasil",
    riscoScore: 22,
    risco: "medio",
    alerta: false,
    descricao: "Permissão de 'admin.global' concedida ao usuário USR-00019.",
    payload: {
      usuario_alvo: "USR-00019",
      nivel_anterior: "owner",
      nivel_novo: "admin.global",
    },
  },
  {
    id: "LOG-20260817-00004",
    dataHora: "2026-08-17T12:40:00Z",
    usuario: "Cliente anônimo",
    usuarioId: null as unknown as string,
    empresa: "Curso Investidor Pro",
    empresaId: "EMP-00010",
    modulo: "moderacao",
    acao: "create",
    ip: "177.92.44.101",
    pais: "Brasil",
    riscoScore: 38,
    risco: "medio",
    alerta: false,
    descricao: "Denúncia enviada contra produto PRD-1098 · categoria fraude.",
    payload: { denuncia: "DEN-2026-00142" },
  },
  {
    id: "LOG-20260817-00005",
    dataHora: "2026-08-17T11:02:11Z",
    usuario: "Paulo Henrique",
    usuarioId: "USR-00006",
    empresa: "VerdeVida Suplementos",
    empresaId: "EMP-00005",
    modulo: "produtos",
    acao: "delete",
    ip: "170.80.55.32",
    pais: "Brasil",
    riscoScore: 82,
    risco: "alto",
    alerta: true,
    descricao: "Exclusão de 14 produtos simultaneamente em conta sob investigação.",
    payload: {
      produtos_removidos: 14,
      valor_total_removido: 28450,
    },
  },
  {
    id: "LOG-20260817-00006",
    dataHora: "2026-08-17T09:48:22Z",
    usuario: "Juliana Paiva",
    usuarioId: "USR-00004",
    empresa: "Lotus Cursos Online",
    empresaId: "EMP-00003",
    modulo: "checkouts",
    acao: "update",
    ip: "189.12.200.5",
    pais: "Brasil",
    riscoScore: 14,
    risco: "baixo",
    alerta: false,
    descricao: "Checkout CK-55102 atualizado com nova comissão de afiliado 32%.",
    payload: { comissao_anterior: 30, comissao_nova: 32 },
  },
  {
    id: "LOG-20260817-00007",
    dataHora: "2026-08-17T08:05:00Z",
    usuario: "admin@cash.engine",
    usuarioId: "USR-00003",
    empresa: "Cash Engine PRO",
    empresaId: "EMP-00000",
    modulo: "admin",
    acao: "export",
    ip: "200.147.102.20",
    pais: "Brasil",
    riscoScore: 18,
    risco: "baixo",
    alerta: false,
    descricao: "Exportação de relatório financeiro completo em CSV.",
    payload: { registros: 5842, filtro: "periodo 2026-07 / 2026-08" },
  },
  {
    id: "LOG-20260817-00008",
    dataHora: "2026-08-16T23:40:10Z",
    usuario: "Sistema",
    usuarioId: "SYS-00001",
    empresa: "VerdeVida Suplementos",
    empresaId: "EMP-00005",
    modulo: "empresas",
    acao: "update",
    ip: "—",
    pais: "—",
    riscoScore: 94,
    risco: "critico",
    alerta: true,
    descricao: "Alerta de risco crítico disparado automaticamente · risco > 90.",
    payload: {
      score_anterior: 62,
      score_novo: 94,
      motivo: "3 chargebacks + exclusão de produtos em massa",
    },
  },
  {
    id: "LOG-20260816-00009",
    dataHora: "2026-08-16T19:20:02Z",
    usuario: "Ana Beatriz",
    usuarioId: "USR-00007",
    empresa: "PixelMind Games",
    empresaId: "EMP-00006",
    modulo: "financeiro",
    acao: "read",
    ip: "177.201.54.100",
    pais: "Brasil",
    riscoScore: 5,
    risco: "baixo",
    alerta: false,
    descricao: "Acesso ao extrato financeiro mês de agosto.",
    payload: { periodo: "2026-08" },
  },
  {
    id: "LOG-20260816-00010",
    dataHora: "2026-08-16T14:10:55Z",
    usuario: "admin@cash.engine",
    usuarioId: "USR-00003",
    empresa: "Cash Engine PRO",
    empresaId: "EMP-00000",
    modulo: "usuarios",
    acao: "delete",
    ip: "200.147.102.20",
    pais: "Brasil",
    riscoScore: 70,
    risco: "alto",
    alerta: false,
    descricao: "Conta de usuário USR-00012 banida permanentemente.",
    payload: { motivo: "uso de cartão roubado confirmado" },
  },
];

const moduloOptions: Modulo[] = [
  "auth",
  "empresas",
  "usuarios",
  "financeiro",
  "produtos",
  "checkouts",
  "moderacao",
  "admin",
];

const acaoOptions: Acao[] = [
  "create",
  "update",
  "delete",
  "read",
  "login_sucesso",
  "login_falha",
  "export",
];

const riscoOptions: RiscoAud[] = ["baixo", "medio", "alto", "critico"];

const moduloLabels: Record<Modulo, string> = {
  auth: "Autenticação",
  empresas: "Empresas",
  usuarios: "Usuários",
  financeiro: "Financeiro",
  produtos: "Produtos",
  checkouts: "Checkouts",
  moderacao: "Moderação",
  admin: "Admin",
};

function ModuloBadge({ mod }: { mod: Modulo }) {
  const map: Record<Modulo, string> = {
    auth: "bg-indigo-500/10 text-indigo-600",
    empresas: "bg-primary/10 text-primary",
    usuarios: "bg-emerald-500/10 text-emerald-700",
    financeiro: "bg-amber-500/10 text-amber-700",
    produtos: "bg-purple-500/10 text-purple-600",
    checkouts: "bg-blue-500/10 text-blue-600",
    moderacao: "bg-orange-500/10 text-orange-700",
    admin: "bg-rose-500/10 text-rose-700",
  };
  return (
    <Badge variant="secondary" className={cn("uppercase text-[10px] font-medium", map[mod])}>
      {moduloLabels[mod]}
    </Badge>
  );
}

function AcaoPill({ acao }: { acao: Acao }) {
  const map: Record<Acao, { cls: string; label: string }> = {
    create: { cls: "bg-emerald-500/10 text-emerald-700", label: "Criar" },
    update: { cls: "bg-blue-500/10 text-blue-600", label: "Atualizar" },
    delete: { cls: "bg-rose-500/10 text-rose-700", label: "Excluir" },
    read: { cls: "bg-muted text-muted-foreground", label: "Ler" },
    login_sucesso: { cls: "bg-indigo-500/10 text-indigo-600", label: "Login OK" },
    login_falha: { cls: "bg-rose-500/10 text-rose-700", label: "Login falha" },
    export: { cls: "bg-purple-500/10 text-purple-600", label: "Exportar" },
  };
  const item = map[acao];
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

function RiscoPill({ risco, score }: { risco: RiscoAud; score: number }) {
  const map: Record<RiscoAud, string> = {
    baixo: "bg-emerald-500/10 text-emerald-700",
    medio: "bg-amber-500/10 text-amber-700",
    alto: "bg-orange-500/10 text-orange-700",
    critico: "bg-rose-500/10 text-rose-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        map[risco],
      )}
    >
      <ShieldCheck className="h-3 w-3" />
      {score}
    </span>
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

function JsonPreviewDialog({ log }: { log: LogAuditoria | null }) {
  return (
    <Dialog open={!!log}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <FileJson className="h-4 w-4 text-primary" />
            Detalhes JSON · {log?.id}
          </DialogTitle>
          <DialogDescription>
            Payload bruto registrado na trilha de auditoria em {log ? formatDateTime(log.dataHora) : ""}.
          </DialogDescription>
        </DialogHeader>
        {log && (
          <ScrollArea className="max-h-[420px]">
            <pre className="rounded-xl border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground">
              {JSON.stringify(
                {
                  id: log.id,
                  dataHora: log.dataHora,
                  usuario: { id: log.usuarioId, nome: log.usuario },
                  empresa: log.empresaId ? { id: log.empresaId, nome: log.empresa } : null,
                  rede: { ip: log.ip, pais: log.pais },
                  contexto: { modulo: log.modulo, acao: log.acao },
                  risco: { classificacao: log.risco, score: log.riscoScore, alerta: log.alerta },
                  descricao: log.descricao,
                  payload: log.payload,
                },
                null,
                2,
              )}
            </pre>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AdminAuditoriaPage() {
  const loading = useFakeLoading();
  const [query, setQuery] = useState("");
  const [modulo, setModulo] = useState<Modulo | "todos">("todos");
  const [acao, setAcao] = useState<Acao | "todos">("todos");
  const [risco, setRisco] = useState<RiscoAud | "todos">("todos");
  const [usuario, setUsuario] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [alerta, setAlerta] = useState(false);
  const [jsonDialog, setJsonDialog] = useState<LogAuditoria | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return logsMock.filter((l) => {
      if (modulo !== "todos" && l.modulo !== modulo) return false;
      if (acao !== "todos" && l.acao !== acao) return false;
      if (risco !== "todos" && l.risco !== risco) return false;
      if (alerta && !l.alerta) return false;
      if (usuario && !l.usuario.toLowerCase().includes(usuario.toLowerCase())) return false;
      if (empresa && !(l.empresa ?? "").toLowerCase().includes(empresa.toLowerCase())) return false;
      if (!q) return true;
      return (
        l.descricao.toLowerCase().includes(q) ||
        l.ip.includes(q) ||
        l.usuario.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
      );
    });
  }, [query, modulo, acao, risco, usuario, empresa, alerta]);

  const logs24h = 18442;
  const alertas = 127;
  const loginsSus = 84;
  const permissoesAlteradas = 22;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Administração
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Auditoria</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Trilha de auditoria imutável de todas as ações, acessos e alertas da plataforma.
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
            icon={Eye}
            label="Logs · 24h"
            value={formatInt(logs24h)}
            hint={`${formatInt(logsMock.length)} carregados na página`}
            accent
          />
          <KpiCard
            icon={AlertTriangle}
            label="Alertas disparados"
            value={formatInt(alertas)}
            hint="Risco alto / crítico na janela"
            danger
          />
          <KpiCard
            icon={ShieldAlert}
            label="Logins suspeitos"
            value={formatInt(loginsSus)}
            hint="Geo inconsistente + velocidade"
            danger
          />
          <KpiCard
            icon={KeyRound}
            label="Permissões alteradas"
            value={formatInt(permissoesAlteradas)}
            hint="Role, grants, owners nos últimos 7d"
          />
        </div>
      )}

      <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca geral · descrição, IP, ID..."
              className="pl-9"
            />
          </div>
          <div>
            <Label className="sr-only">Módulo</Label>
            <Select value={modulo} onValueChange={(v) => setModulo(v as Modulo | "todos")}>
              <SelectTrigger>
                <SelectValue placeholder="Módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os módulos</SelectItem>
                {moduloOptions.map((m) => (
                  <SelectItem key={m} value={m}>
                    {moduloLabels[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="sr-only">Ação</Label>
            <Select value={acao} onValueChange={(v) => setAcao(v as Acao | "todos")}>
              <SelectTrigger>
                <SelectValue placeholder="Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as ações</SelectItem>
                {acaoOptions.map((a) => (
                  <SelectItem key={a} value={a} className="capitalize">
                    {a.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="sr-only">Risco</Label>
            <Select value={risco} onValueChange={(v) => setRisco(v as RiscoAud | "todos")}>
              <SelectTrigger>
                <SelectValue placeholder="Risco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os riscos</SelectItem>
                {riscoOptions.map((r) => (
                  <SelectItem key={r} value={r} className="capitalize">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label className="sr-only">Usuário</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Filtrar por usuário..."
                className="pl-9"
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <Label className="sr-only">Empresa</Label>
            <div className="relative">
              <UserCog className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Empresa..."
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3">
            <Switch checked={alerta} onCheckedChange={setAlerta} id="alerta-toggle" />
            <Label htmlFor="alerta-toggle" className="cursor-pointer text-sm text-foreground">
              <span className="inline-flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                Somente com alerta disparado
              </span>
            </Label>
          </div>
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {loading ? (
          <TableSkeleton rows={6} cols={10} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Fingerprint}
            title="Nenhum log encontrado nos filtros"
            description="Ajuste a busca, o módulo, ação ou nível de risco para expandir os resultados."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1500px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Data / Hora</th>
                  <th className="px-5 py-3 font-medium">Usuário</th>
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">Módulo</th>
                  <th className="px-5 py-3 font-medium">Ação</th>
                  <th className="px-5 py-3 font-medium">IP · País</th>
                  <th className="px-5 py-3 font-medium">Risco</th>
                  <th className="px-5 py-3 font-medium">Alerta</th>
                  <th className="px-5 py-3 font-medium">Descrição</th>
                  <th className="px-5 py-3 text-right font-medium">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((l) => (
                  <tr key={l.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-5 py-3 tabular-nums text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(l.dataHora)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{l.usuario}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                          {l.usuarioId ?? "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-foreground">{l.empresa ?? "—"}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                          {l.empresaId ?? "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <ModuloBadge mod={l.modulo} />
                    </td>
                    <td className="px-5 py-3">
                      <AcaoPill acao={l.acao} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-mono text-xs text-foreground">{l.ip}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{l.pais}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <RiscoPill risco={l.risco} score={l.riscoScore} />
                    </td>
                    <td className="px-5 py-3">
                      {l.alerta ? (
                        <Badge
                          variant="destructive"
                          className="uppercase text-[10px] animate-pulse"
                        >
                          <AlertTriangle className="mr-1 h-3 w-3" /> disparado
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 max-w-[360px]">
                      <p className="line-clamp-2 text-muted-foreground">{l.descricao}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/80">
                        {l.id}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1.5"
                          onClick={() => setJsonDialog(l)}
                        >
                          <FileJson className="h-3.5 w-3.5" /> JSON
                        </Button>
                      </DialogTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <JsonPreviewDialog log={jsonDialog} />
    </div>
  );
}

export const Route = createFileRoute("/admin/auditoria")({
  head: () => ({ meta: [{ title: "Auditoria · Admin · Cash Engine PRO" }] }),
  component: AdminAuditoriaPage,
});
