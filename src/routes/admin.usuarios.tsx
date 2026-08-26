import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Ban,
  Building2,
  ChevronDown,
  Crown,
  Download,
  Eye,
  KeyRound,
  RotateCcw,
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

type StatusUsuario = "ativo" | "suspenso" | "banido" | "pendente";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  empresaId: string;
  empresaNome: string;
  cargo: string;
  isAdminGlobal: boolean;
  isOwner: boolean;
  ultimoLogin: string | null;
  status: StatusUsuario;
  criadoEm: string;
};

const usuariosMock: Usuario[] = [
  {
    id: "USR-00001",
    nome: "Maria Fernanda",
    email: "maria@novatech.io",
    empresaId: "EMP-00001",
    empresaNome: "NovaTech Soluções Digitais",
    cargo: "Diretora de Operações",
    isAdminGlobal: true,
    isOwner: true,
    ultimoLogin: "2026-08-17T14:22:00Z",
    status: "ativo",
    criadoEm: "2025-03-12T09:30:00Z",
  },
  {
    id: "USR-00002",
    nome: "Carlos Eduardo",
    email: "carlos@blackpepper.shop",
    empresaId: "EMP-00002",
    empresaNome: "BlackPepper E-commerce",
    cargo: "CEO",
    isAdminGlobal: false,
    isOwner: true,
    ultimoLogin: "2026-08-16T22:10:00Z",
    status: "ativo",
    criadoEm: "2025-07-01T14:18:00Z",
  },
  {
    id: "USR-00003",
    nome: "Admin Suporte Cash",
    email: "admin@cash.engine",
    empresaId: "EMP-00000",
    empresaNome: "Cash Engine PRO (Plataforma)",
    cargo: "Administrador Global",
    isAdminGlobal: true,
    isOwner: false,
    ultimoLogin: "2026-08-17T08:05:00Z",
    status: "ativo",
    criadoEm: "2024-11-01T10:00:00Z",
  },
  {
    id: "USR-00004",
    nome: "Juliana Paiva",
    email: "juliana@lotuscursos.com",
    empresaId: "EMP-00003",
    empresaNome: "Lotus Cursos Online",
    cargo: "Head de Marketing",
    isAdminGlobal: false,
    isOwner: true,
    ultimoLogin: "2026-08-17T09:02:00Z",
    status: "ativo",
    criadoEm: "2025-10-18T07:45:00Z",
  },
  {
    id: "USR-00005",
    nome: "Rodrigo Silva",
    email: "rodrigo@mercadotop.com",
    empresaId: "EMP-00004",
    empresaNome: "MercadoTop Dropshipping",
    cargo: "Proprietário",
    isAdminGlobal: false,
    isOwner: true,
    ultimoLogin: "2026-08-10T18:55:00Z",
    status: "suspenso",
    criadoEm: "2026-01-30T19:10:00Z",
  },
  {
    id: "USR-00006",
    nome: "Paulo Henrique",
    email: "paulo@verdevida.fit",
    empresaId: "EMP-00005",
    empresaNome: "VerdeVida Suplementos",
    cargo: "Sócio Fundador",
    isAdminGlobal: false,
    isOwner: true,
    ultimoLogin: "2026-08-15T23:40:00Z",
    status: "banido",
    criadoEm: "2025-02-20T11:02:00Z",
  },
  {
    id: "USR-00007",
    nome: "Ana Beatriz",
    email: "ana@pixelmind.gg",
    empresaId: "EMP-00006",
    empresaNome: "PixelMind Games",
    cargo: "Community Manager",
    isAdminGlobal: false,
    isOwner: false,
    ultimoLogin: "2026-08-17T11:58:00Z",
    status: "ativo",
    criadoEm: "2025-11-20T16:30:00Z",
  },
  {
    id: "USR-00008",
    nome: "Larissa Mendes",
    email: "larissa@modaluma.com.br",
    empresaId: "EMP-00007",
    empresaNome: "ModaLuma Boutique",
    cargo: "Fundadora",
    isAdminGlobal: false,
    isOwner: true,
    ultimoLogin: null,
    status: "pendente",
    criadoEm: "2026-06-10T10:25:00Z",
  },
];

const statusFilter: (StatusUsuario | "todos")[] = [
  "todos",
  "ativo",
  "suspenso",
  "banido",
  "pendente",
];

function StatusPill({ status }: { status: StatusUsuario }) {
  const map: Record<StatusUsuario, string> = {
    ativo: "bg-emerald-500/10 text-emerald-700",
    suspenso: "bg-amber-500/10 text-amber-700",
    banido: "bg-rose-500/10 text-rose-700",
    pendente: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        map[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
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

function AdminUsuariosPage() {
  const loading = useFakeLoading();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusUsuario | "todos">("todos");
  const [admin, setAdmin] = useState<"todos" | "sim" | "nao">("todos");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return usuariosMock.filter((u) => {
      if (status !== "todos" && u.status !== status) return false;
      if (admin === "sim" && !u.isAdminGlobal) return false;
      if (admin === "nao" && u.isAdminGlobal) return false;
      if (!q) return true;
      return (
        u.nome.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.empresaNome.toLowerCase().includes(q)
      );
    });
  }, [query, status, admin]);

  const adminsGlobais = usuariosMock.filter((u) => u.isAdminGlobal).length;
  const banidos = usuariosMock.filter((u) => u.status === "banido").length;
  const pendentes = usuariosMock.filter((u) => u.status === "pendente").length;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Administração
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Usuários globais
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Controle completo de todas as contas, admins globais e owners das empresas.
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
            icon={User}
            label="Total de contas"
            value={formatInt(usuariosMock.length)}
            hint={`${formatInt(filtered.length)} no filtro atual`}
            accent
          />
          <KpiCard
            icon={ShieldHalf}
            label="Admins globais"
            value={formatInt(adminsGlobais)}
            hint="Acesso total à plataforma"
          />
          <KpiCard
            icon={ShieldAlert}
            label="Contas banidas"
            value={formatInt(banidos)}
            hint="Acesso bloqueado"
          />
          <KpiCard
            icon={RotateCcw}
            label="Pendentes de ativação"
            value={formatInt(pendentes)}
            hint="Aguardam primeiro login"
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[260px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, email ou empresa"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Status</span>
          <Select value={status} onValueChange={(v) => setStatus(v as StatusUsuario | "todos")}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusFilter.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s === "todos" ? "Todos os status" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Admin global</span>
          <Select value={admin} onValueChange={(v) => setAdmin(v as typeof admin)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="sim">Somente admins</SelectItem>
              <SelectItem value="nao">Exceto admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {loading ? (
          <TableSkeleton rows={6} cols={9} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={UserCog}
            title="Nenhum usuário encontrado"
            description="Ajuste a busca ou os filtros de status e nível de acesso."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Usuário</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">Cargo</th>
                  <th className="px-5 py-3 font-medium">Admin Global</th>
                  <th className="px-5 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 font-medium">Último login</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-background">
                          <User className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{u.nome}</p>
                          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                            {u.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="truncate">{u.empresaNome}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{u.cargo}</td>
                    <td className="px-5 py-3">
                      {u.isAdminGlobal ? (
                        <Badge variant="destructive" className="uppercase text-[10px]">
                          <ShieldCheck className="mr-1 h-3 w-3" /> Admin global
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {u.isOwner ? (
                        <Badge
                          variant="secondary"
                          className="bg-amber-500/10 text-amber-700 uppercase text-[10px]"
                        >
                          <Crown className="mr-1 h-3 w-3" /> Owner
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 tabular-nums text-xs text-muted-foreground">
                      {u.ultimoLogin ? formatDateTime(u.ultimoLogin) : "Nunca"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusPill status={u.status} />
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
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" /> Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className={cn("gap-2", !u.isAdminGlobal && "text-primary")}
                          >
                            <ShieldHalf className="h-4 w-4" />
                            {u.isAdminGlobal ? "Remover admin global" : "Tornar admin global"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <KeyRound className="h-4 w-4" /> Resetar senha
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className={cn("gap-2", u.status !== "banido" && "text-rose-600 focus:text-rose-600")}
                          >
                            <Ban className="h-4 w-4" />
                            {u.status === "banido" ? "Desbanir conta" : "Banir usuário"}
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
    </div>
  );
}

export const Route = createFileRoute("/admin/usuarios")({
  head: () => ({ meta: [{ title: "Usuários · Admin · Cash Engine PRO" }] }),
  component: AdminUsuariosPage,
});
