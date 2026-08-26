import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Ban,
  Building2,
  Check,
  ChevronDown,
  Crown,
  Download,
  Eye,
  History,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { CardsSkeleton, TableSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { EmptyState } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";
import { formatBRL, formatDateTime, formatInt } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Plano = "free" | "pro" | "enterprise";
type Risco = "baixo" | "medio" | "alto" | "alerta";

type Empresa = {
  id: string;
  nome: string;
  cnpj: string;
  plano: Plano;
  risco: Risco;
  riscoScore: number;
  dataCriacao: string;
  ultimaAtividade: string;
  vip: boolean;
  bloqueada: boolean;
  razaoSocial: string;
  ie: string;
  contato: { nome: string; email: string; telefone: string };
  endereco: { cidade: string; uf: string };
  kpis: { volume30d: number; vendas30d: number; saques30d: number };
  historico: { data: string; usuario: string; acao: string }[];
};

const empresasMock: Empresa[] = [
  {
    id: "EMP-00001",
    nome: "NovaTech Soluções Digitais",
    razaoSocial: "NovaTech Soluções Digitais LTDA",
    cnpj: "12.345.678/0001-90",
    ie: "12345678-9",
    plano: "enterprise",
    risco: "baixo",
    riscoScore: 8,
    dataCriacao: "2025-03-12T09:30:00Z",
    ultimaAtividade: "2026-08-17T14:22:00Z",
    vip: true,
    bloqueada: false,
    contato: {
      nome: "Maria Fernanda",
      email: "maria@novatech.io",
      telefone: "(11) 99876-5432",
    },
    endereco: { cidade: "São Paulo", uf: "SP" },
    kpis: { volume30d: 2_480_000, vendas30d: 8420, saques30d: 1_860_000 },
    historico: [
      { data: "2026-08-15T10:12:00Z", usuario: "Sistema", acao: "Plano upgraded para Enterprise" },
      { data: "2026-07-28T16:40:00Z", usuario: "admin@cash", acao: "Marcada como VIP" },
      { data: "2026-05-02T08:20:00Z", usuario: "Sistema", acao: "Primeiro saque aprovado" },
      { data: "2025-03-12T09:30:00Z", usuario: "Sistema", acao: "Cadastro realizado" },
    ],
  },
  {
    id: "EMP-00002",
    nome: "BlackPepper E-commerce",
    razaoSocial: "BlackPepper Comércio Digital ME",
    cnpj: "98.765.432/0001-10",
    ie: "Isento",
    plano: "pro",
    risco: "medio",
    riscoScore: 42,
    dataCriacao: "2025-07-01T14:18:00Z",
    ultimaAtividade: "2026-08-16T22:10:00Z",
    vip: false,
    bloqueada: false,
    contato: {
      nome: "Carlos Eduardo",
      email: "carlos@blackpepper.shop",
      telefone: "(31) 98765-4321",
    },
    endereco: { cidade: "Belo Horizonte", uf: "MG" },
    kpis: { volume30d: 423_500, vendas30d: 1240, saques30d: 330_200 },
    historico: [
      { data: "2026-08-01T10:00:00Z", usuario: "Sistema", acao: "Risco ajustado: médio" },
      { data: "2026-06-10T11:20:00Z", usuario: "admin@cash", acao: "Plano upgraded para Pro" },
      { data: "2025-07-01T14:18:00Z", usuario: "Sistema", acao: "Cadastro realizado" },
    ],
  },
  {
    id: "EMP-00003",
    nome: "Lotus Cursos Online",
    razaoSocial: "Lotus Educação Digital LTDA",
    cnpj: "45.678.901/0001-23",
    ie: "98765432-1",
    plano: "pro",
    risco: "baixo",
    riscoScore: 18,
    dataCriacao: "2025-10-18T07:45:00Z",
    ultimaAtividade: "2026-08-17T09:02:00Z",
    vip: true,
    bloqueada: false,
    contato: {
      nome: "Juliana Paiva",
      email: "juliana@lotuscursos.com",
      telefone: "(21) 97654-3210",
    },
    endereco: { cidade: "Rio de Janeiro", uf: "RJ" },
    kpis: { volume30d: 891_200, vendas30d: 3110, saques30d: 702_000 },
    historico: [
      { data: "2026-07-02T14:00:00Z", usuario: "admin@cash", acao: "Marcada como VIP" },
      { data: "2025-10-18T07:45:00Z", usuario: "Sistema", acao: "Cadastro realizado" },
    ],
  },
  {
    id: "EMP-00004",
    nome: "MercadoTop Dropshipping",
    razaoSocial: "MercadoTop Comércio MEI",
    cnpj: "11.222.333/0001-44",
    ie: "Isento",
    plano: "free",
    risco: "alto",
    riscoScore: 76,
    dataCriacao: "2026-01-30T19:10:00Z",
    ultimaAtividade: "2026-08-10T18:55:00Z",
    vip: false,
    bloqueada: false,
    contato: {
      nome: "Rodrigo Silva",
      email: "rodrigo@mercadotop.com",
      telefone: "(41) 96543-2109",
    },
    endereco: { cidade: "Curitiba", uf: "PR" },
    kpis: { volume30d: 48_900, vendas30d: 182, saques30d: 32_100 },
    historico: [
      { data: "2026-08-11T08:00:00Z", usuario: "Sistema", acao: "Chargeback detectado: 3 em 7 dias" },
      { data: "2026-01-30T19:10:00Z", usuario: "Sistema", acao: "Cadastro realizado" },
    ],
  },
  {
    id: "EMP-00005",
    nome: "VerdeVida Suplementos",
    razaoSocial: "VerdeVida Produtos Naturais LTDA",
    cnpj: "22.333.444/0001-55",
    ie: "45678901-2",
    plano: "enterprise",
    risco: "alerta",
    riscoScore: 92,
    dataCriacao: "2025-02-20T11:02:00Z",
    ultimaAtividade: "2026-08-15T23:40:00Z",
    vip: false,
    bloqueada: true,
    contato: {
      nome: "Paulo Henrique",
      email: "paulo@verdevida.fit",
      telefone: "(51) 95432-1098",
    },
    endereco: { cidade: "Porto Alegre", uf: "RS" },
    kpis: { volume30d: 1_120_000, vendas30d: 5800, saques30d: 0 },
    historico: [
      { data: "2026-08-16T01:12:00Z", usuario: "admin@cash", acao: "Empresa bloqueada manualmente" },
      { data: "2026-08-15T23:40:00Z", usuario: "Sistema", acao: "Alerta disparado: risco crítico" },
      { data: "2025-02-20T11:02:00Z", usuario: "Sistema", acao: "Cadastro realizado" },
    ],
  },
  {
    id: "EMP-00006",
    nome: "PixelMind Games",
    razaoSocial: "PixelMind Studio LTDA",
    cnpj: "33.444.555/0001-66",
    ie: "78901234-5",
    plano: "pro",
    risco: "baixo",
    riscoScore: 12,
    dataCriacao: "2025-11-05T16:30:00Z",
    ultimaAtividade: "2026-08-17T11:58:00Z",
    vip: false,
    bloqueada: false,
    contato: {
      nome: "Ana Beatriz",
      email: "ana@pixelmind.gg",
      telefone: "(62) 94321-0987",
    },
    endereco: { cidade: "Goiânia", uf: "GO" },
    kpis: { volume30d: 298_400, vendas30d: 1980, saques30d: 220_000 },
    historico: [
      { data: "2026-04-20T10:10:00Z", usuario: "admin@cash", acao: "Limite de saque aumentado" },
      { data: "2025-11-05T16:30:00Z", usuario: "Sistema", acao: "Cadastro realizado" },
    ],
  },
  {
    id: "EMP-00007",
    nome: "ModaLuma Boutique",
    razaoSocial: "ModaLuma Confecções ME",
    cnpj: "44.555.666/0001-77",
    ie: "Isento",
    plano: "free",
    risco: "medio",
    riscoScore: 38,
    dataCriacao: "2026-06-10T10:25:00Z",
    ultimaAtividade: "2026-08-16T15:44:00Z",
    vip: false,
    bloqueada: false,
    contato: {
      nome: "Larissa Mendes",
      email: "larissa@modaluma.com.br",
      telefone: "(71) 93210-9876",
    },
    endereco: { cidade: "Salvador", uf: "BA" },
    kpis: { volume30d: 18_600, vendas30d: 72, saques30d: 11_200 },
    historico: [
      { data: "2026-06-10T10:25:00Z", usuario: "Sistema", acao: "Cadastro realizado" },
    ],
  },
];

const planosFilter: (Plano | "todos")[] = ["todos", "free", "pro", "enterprise"];
const riscosFilter: (Risco | "todos")[] = ["todos", "baixo", "medio", "alto", "alerta"];

function PlanoPill({ plano }: { plano: Plano }) {
  const map: Record<Plano, string> = {
    free: "bg-muted text-muted-foreground",
    pro: "bg-primary/10 text-primary",
    enterprise: "bg-purple-500/10 text-purple-600",
  };
  return (
    <Badge variant="secondary" className={cn("font-medium uppercase text-[10px]", map[plano])}>
      {plano}
    </Badge>
  );
}

function RiscoPill({ risco, score }: { risco: Risco; score: number }) {
  const map: Record<Risco, { cls: string; icon: LucideIcon }> = {
    baixo: { cls: "bg-emerald-500/10 text-emerald-700", icon: ShieldCheck },
    medio: { cls: "bg-amber-500/10 text-amber-700", icon: ShieldAlert },
    alto: { cls: "bg-orange-500/10 text-orange-700", icon: ShieldAlert },
    alerta: { cls: "bg-rose-500/10 text-rose-700", icon: ShieldAlert },
  };
  const item = map[risco];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        item.cls,
      )}
    >
      <item.icon className="h-3 w-3" />
      {risco} · {score}
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

function EmpresaSheet({
  empresa,
  onOpenChange,
}: {
  empresa: Empresa | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={!!empresa} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="h-full overflow-y-auto p-0 sm:max-w-lg">
        {empresa ? <SheetBody empresa={empresa} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function SheetBody({ empresa }: { empresa: Empresa }) {
  return (
    <div className="flex flex-col">
      <SheetHeader className="space-y-3 border-b border-border px-6 py-5 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              empresa.bloqueada ? "bg-rose-500/10 text-rose-600" : "bg-primary/10 text-primary",
            )}
          >
            <Building2 className="h-4 w-4" />
          </span>
          <PlanoPill plano={empresa.plano} />
          {empresa.vip && (
            <Badge
              variant="secondary"
              className="bg-amber-500/10 text-amber-700 uppercase text-[10px]"
            >
              <Crown className="mr-1 h-3 w-3" /> VIP
            </Badge>
          )}
          {empresa.bloqueada && (
            <Badge variant="destructive" className="uppercase text-[10px]">
              Bloqueada
            </Badge>
          )}
          <RiscoPill risco={empresa.risco} score={empresa.riscoScore} />
        </div>
        <SheetTitle className="text-xl font-semibold tracking-tight">{empresa.nome}</SheetTitle>
        <SheetDescription>
          {empresa.razaoSocial} · CNPJ {empresa.cnpj}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-5 px-6 py-6">
        <section className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Volume 30d
            </p>
            <p className="mt-2 font-semibold tabular-nums text-foreground">
              {formatBRL(empresa.kpis.volume30d, { compact: true })}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Vendas 30d
            </p>
            <p className="mt-2 font-semibold tabular-nums text-foreground">
              {formatInt(empresa.kpis.vendas30d)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Saques 30d
            </p>
            <p className="mt-2 font-semibold tabular-nums text-foreground">
              {formatBRL(empresa.kpis.saques30d, { compact: true })}
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Dados fiscais
          </h3>
          <dl className="mt-3 space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">CNPJ</span>
              <span className="font-mono text-xs text-foreground">{empresa.cnpj}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Inscrição Estadual</span>
              <span className="font-medium text-foreground">{empresa.ie}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Razão social</span>
              <span className="truncate text-right font-medium text-foreground">
                {empresa.razaoSocial}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Localização</span>
              <span className="text-foreground">
                {empresa.endereco.cidade} · {empresa.endereco.uf}
              </span>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Contato principal
          </h3>
          <div className="mt-3 space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Responsável
              </span>
              <span className="font-medium text-foreground">{empresa.contato.nome}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                E-mail
              </span>
              <span className="truncate font-medium text-foreground">{empresa.contato.email}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                Telefone
              </span>
              <span className="font-medium text-foreground">{empresa.contato.telefone}</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Histórico de ações
          </h3>
          <ol className="mt-4 space-y-0">
            {empresa.historico.map((h, i) => {
              const last = i === empresa.historico.length - 1;
              return (
                <li key={h.data + i} className="relative flex gap-3 pb-5 last:pb-0">
                  {!last && (
                    <span className="absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-px bg-border" />
                  )}
                  <span className="relative z-[1] mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <History className="h-3 w-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{h.acao}</p>
                    <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
                      {h.usuario} · {formatDateTime(h.data)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" className="flex-1 gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Mudar plano
          </Button>
          <Button variant="destructive" className="flex-1 gap-1.5">
            <Ban className="h-3.5 w-3.5" />
            {empresa.bloqueada ? "Desbloquear" : "Bloquear empresa"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function User({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function AdminEmpresasPage() {
  const loading = useFakeLoading();
  const [query, setQuery] = useState("");
  const [plano, setPlano] = useState<Plano | "todos">("todos");
  const [risco, setRisco] = useState<Risco | "todos">("todos");
  const [selected, setSelected] = useState<Empresa | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return empresasMock.filter((e) => {
      if (plano !== "todos" && e.plano !== plano) return false;
      if (risco !== "todos" && e.risco !== risco) return false;
      if (!q) return true;
      return e.nome.toLowerCase().includes(q) || e.cnpj.includes(q);
    });
  }, [query, plano, risco]);

  const ativas = empresasMock.filter((e) => !e.bloqueada).length;
  const vips = empresasMock.filter((e) => e.vip).length;
  const alerta = empresasMock.filter((e) => e.risco === "alerta" || e.risco === "alto").length;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Administração
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Gestão de empresas
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão completa das empresas da plataforma, planos, risco e ações operacionais.
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
            icon={Building2}
            label="Empresas ativas"
            value={formatInt(ativas)}
            hint={`Total ${formatInt(empresasMock.length)} cadastradas`}
            accent
          />
          <KpiCard
            icon={Sparkles}
            label="Enterprise"
            value={formatInt(empresasMock.filter((e) => e.plano === "enterprise").length)}
            hint="Plano top de linha"
          />
          <KpiCard
            icon={Crown}
            label="Empresas VIP"
            value={formatInt(vips)}
            hint="Tratamento prioritário"
          />
          <KpiCard
            icon={ShieldAlert}
            label="Risco alto / alerta"
            value={formatInt(alerta)}
            hint="Requerem atenção"
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome da empresa ou CNPJ"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Plano</span>
          <Select value={plano} onValueChange={(v) => setPlano(v as Plano | "todos")}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {planosFilter.map((p) => (
                <SelectItem key={p} value={p} className="capitalize">
                  {p === "todos" ? "Todos os planos" : p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Risco</span>
          <Select value={risco} onValueChange={(v) => setRisco(v as Risco | "todos")}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {riscosFilter.map((r) => (
                <SelectItem key={r} value={r} className="capitalize">
                  {r === "todos" ? "Todos os riscos" : r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {loading ? (
          <TableSkeleton rows={6} cols={8} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Nenhuma empresa encontrada"
            description="Ajuste a busca ou os filtros de plano e risco para encontrar o que procura."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">CNPJ</th>
                  <th className="px-5 py-3 font-medium">Plano</th>
                  <th className="px-5 py-3 font-medium">Risco</th>
                  <th className="px-5 py-3 font-medium">Criada em</th>
                  <th className="px-5 py-3 font-medium">Última atividade</th>
                  <th className="px-5 py-3 font-medium">VIP</th>
                  <th className="px-5 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((e) => (
                  <tr key={e.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                            e.bloqueada ? "bg-rose-500/10 text-rose-600" : "bg-primary/10 text-primary",
                          )}
                        >
                          <Building2 className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {e.nome}
                            {e.vip && (
                              <Crown className="ml-1.5 inline h-3.5 w-3.5 text-amber-500 align-[-3px]" />
                            )}
                          </p>
                          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                            {e.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{e.cnpj}</td>
                    <td className="px-5 py-3">
                      <PlanoPill plano={e.plano} />
                    </td>
                    <td className="px-5 py-3">
                      <RiscoPill risco={e.risco} score={e.riscoScore} />
                    </td>
                    <td className="px-5 py-3 tabular-nums text-xs text-muted-foreground">
                      {formatDateTime(e.dataCriacao)}
                    </td>
                    <td className="px-5 py-3 tabular-nums text-xs text-muted-foreground">
                      {formatDateTime(e.ultimaAtividade)}
                    </td>
                    <td className="px-5 py-3">
                      {e.vip ? (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                          <Check className="h-3 w-3" />
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="gap-1.5">
                            Ações
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Operações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelected(e)} className="gap-2">
                            <Eye className="h-4 w-4" /> Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                            <RefreshCw className="h-4 w-4" /> Mudar plano
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Crown className="h-4 w-4" /> {e.vip ? "Remover VIP" : "Marcar como VIP"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className={cn("gap-2", !e.bloqueada && "text-rose-600 focus:text-rose-600")}
                          >
                            <Ban className="h-4 w-4" />
                            {e.bloqueada ? "Desbloquear empresa" : "Bloquear empresa"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <EmpresaSheet empresa={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}

export const Route = createFileRoute("/admin/empresas")({
  head: () => ({ meta: [{ title: "Empresas · Admin · Cash Engine PRO" }] }),
  component: AdminEmpresasPage,
});
