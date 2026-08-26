import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Ban,
  Download,
  Edit,
  Globe2,
  MapPin,
  Monitor,
  Plus,
  Search,
  ShieldAlert,
  Undo2,
  User,
  Wifi,
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
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type TipoBanimento = "ip" | "usuario" | "pais" | "dispositivo";
type Gravidade = "baixa" | "media" | "alta" | "critica";

type Banimento = {
  id: string;
  tipo: TipoBanimento;
  identificador: string;
  motivo: string;
  gravidade: Gravidade;
  dataInicio: string;
  dataFim: string | null;
  permanente: boolean;
  criadoPor: string;
  pais?: string;
};

const banimentosMock: Banimento[] = [
  {
    id: "BAN-001",
    tipo: "ip",
    identificador: "187.45.12.88",
    motivo: "Múltiplas tentativas de login falhas em contas diferentes",
    gravidade: "alta",
    dataInicio: "2026-08-15T10:22:00Z",
    dataFim: "2026-09-15T10:22:00Z",
    permanente: false,
    criadoPor: "admin@cash.engine",
    pais: "Brasil",
  },
  {
    id: "BAN-002",
    tipo: "usuario",
    identificador: "USR-00006 · Paulo Henrique",
    motivo: "Empresa VerdeVida Suplementos bloqueada por risco crítico",
    gravidade: "critica",
    dataInicio: "2026-08-16T01:12:00Z",
    dataFim: null,
    permanente: true,
    criadoPor: "admin@cash.engine",
  },
  {
    id: "BAN-003",
    tipo: "ip",
    identificador: "45.177.88.12",
    motivo: "Origem suspeita · 12 chargebacks em 3 dias",
    gravidade: "critica",
    dataInicio: "2026-08-12T14:40:00Z",
    dataFim: null,
    permanente: true,
    criadoPor: "Sistema",
    pais: "Rússia",
  },
  {
    id: "BAN-004",
    tipo: "pais",
    identificador: "Ucrânia (UA)",
    motivo: "Bloqueio regional temporário por política de risco",
    gravidade: "media",
    dataInicio: "2026-07-20T08:00:00Z",
    dataFim: "2026-12-31T23:59:00Z",
    permanente: false,
    criadoPor: "admin@cash.engine",
  },
  {
    id: "BAN-005",
    tipo: "dispositivo",
    identificador: "DEV-d7f3a9b2-3a01",
    motivo: "Dispositivo associado a múltiplas contas fraudulentas",
    gravidade: "alta",
    dataInicio: "2026-08-05T19:15:00Z",
    dataFim: null,
    permanente: true,
    criadoPor: "Sistema",
  },
  {
    id: "BAN-006",
    tipo: "ip",
    identificador: "200.147.102.5",
    motivo: "Comportamento de scraping detectado",
    gravidade: "baixa",
    dataInicio: "2026-08-17T05:08:00Z",
    dataFim: "2026-08-24T05:08:00Z",
    permanente: false,
    criadoPor: "Sistema",
    pais: "Brasil",
  },
  {
    id: "BAN-007",
    tipo: "usuario",
    identificador: "USR-00012 · João Fake",
    motivo: "Uso de cartão roubado confirmado via chargeback",
    gravidade: "critica",
    dataInicio: "2026-08-10T11:30:00Z",
    dataFim: null,
    permanente: true,
    criadoPor: "admin@cash.engine",
  },
  {
    id: "BAN-008",
    tipo: "pais",
    identificador: "Coreia do Norte (KP)",
    motivo: "Bloqueio permanente por sanções OFAC",
    gravidade: "critica",
    dataInicio: "2024-11-01T00:00:00Z",
    dataFim: null,
    permanente: true,
    criadoPor: "Compliance",
  },
];

const tabs: TipoBanimento[] = ["ip", "usuario", "pais", "dispositivo"];

const tabIcons: Record<TipoBanimento, LucideIcon> = {
  ip: Wifi,
  usuario: User,
  pais: MapPin,
  dispositivo: Monitor,
};

const tabLabels: Record<TipoBanimento, string> = {
  ip: "Por IP",
  usuario: "Por Usuário",
  pais: "Por País",
  dispositivo: "Por Dispositivo",
};

function TipoIcon({ tipo }: { tipo: TipoBanimento }) {
  const Icon = tabIcons[tipo];
  return <Icon className="h-3.5 w-3.5" />;
}

function GravidadePill({ gravidade }: { gravidade: Gravidade }) {
  const map: Record<Gravidade, string> = {
    baixa: "bg-muted text-muted-foreground",
    media: "bg-amber-500/10 text-amber-700",
    alta: "bg-orange-500/10 text-orange-700",
    critica: "bg-rose-500/10 text-rose-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        map[gravidade],
      )}
    >
      <ShieldAlert className="h-3 w-3" />
      {gravidade}
    </span>
  );
}

function PermanentePill({ permanente }: { permanente: boolean }) {
  return permanente ? (
    <Badge variant="destructive" className="uppercase text-[10px]">
      Sim
    </Badge>
  ) : (
    <Badge variant="secondary" className="uppercase text-[10px] bg-muted">
      Não
    </Badge>
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

function NovoBanimentoDialog() {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<TipoBanimento>("ip");
  const [permanente, setPermanente] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Novo banimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="h-4 w-4 text-rose-600" />
            Criar novo banimento
          </DialogTitle>
          <DialogDescription>
            Adicione um bloqueio por IP, usuário, país ou dispositivo. Escolha o nível de gravidade
            corretamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Tipo de banimento</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as TipoBanimento)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tabs.map((t) => (
                  <SelectItem key={t} value={t} className="gap-2 capitalize">
                    <span className="inline-flex items-center gap-1.5">
                      <TipoIcon tipo={t} /> {tabLabels[t].replace("Por ", "")}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Identificador</Label>
            <Input
              className="mt-1.5"
              placeholder={
                tipo === "ip"
                  ? "Ex.: 187.45.12.88"
                  : tipo === "usuario"
                    ? "ID ou email do usuário"
                    : tipo === "pais"
                      ? "Ex.: Venezuela (VE)"
                      : "ID do dispositivo / fingerprint"
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Gravidade</Label>
              <Select defaultValue="media">
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["baixa", "media", "alta", "critica"] as Gravidade[]).map((g) => (
                    <SelectItem key={g} value={g} className="capitalize">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data de expiração</Label>
              <Input
                type="date"
                className="mt-1.5"
                disabled={permanente}
                defaultValue="2026-09-17"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Banimento permanente</p>
              <p className="text-xs text-muted-foreground">
                Quando marcado, o bloqueio nunca expira.
              </p>
            </div>
            <Switch checked={permanente} onCheckedChange={setPermanente} />
          </div>

          <div>
            <Label>Motivo / Nota interna</Label>
            <Textarea
              className="mt-1.5 min-h-[88px]"
              placeholder="Descreva o motivo para auditoria futura..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Aplicar banimento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AdminBanimentosPage() {
  const loading = useFakeLoading();
  const [tab, setTab] = useState<TipoBanimento>("ip");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return banimentosMock.filter((b) => {
      if (b.tipo !== tab) return false;
      if (!q) return true;
      return b.identificador.toLowerCase().includes(q) || b.motivo.toLowerCase().includes(q);
    });
  }, [tab, query]);

  const permanentes = banimentosMock.filter((b) => b.permanente).length;
  const criticos = banimentosMock.filter((b) => b.gravidade === "critica").length;
  const ips = banimentosMock.filter((b) => b.tipo === "ip").length;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Administração
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Banimentos</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Bloqueios aplicados em IPs, usuários, países e dispositivos na plataforma.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <Download className="h-4 w-4" /> Exportar
          </Button>
          <NovoBanimentoDialog />
        </div>
      </header>

      {loading ? (
        <div className="mt-6">
          <CardsSkeleton count={4} />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={Ban}
            label="Banimentos ativos"
            value={formatInt(banimentosMock.length)}
            hint={`${formatInt(permanentes)} permanentes`}
            accent
          />
          <KpiCard
            icon={Wifi}
            label="Bloqueios por IP"
            value={formatInt(ips)}
            hint="Números IPv4/IPv6 bloqueados"
          />
          <KpiCard
            icon={ShieldAlert}
            label="Gravidade crítica"
            value={formatInt(criticos)}
            hint="Requerem atenção permanente"
          />
          <KpiCard
            icon={Globe2}
            label="Países bloqueados"
            value={formatInt(banimentosMock.filter((b) => b.tipo === "pais").length)}
            hint="Bloqueio regional"
          />
        </div>
      )}

      <section className="mt-6">
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v as TipoBanimento);
            setQuery("");
          }}
          className="w-full"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
            <TabsList>
              {tabs.map((t) => (
                <TabsTrigger key={t} value={t} className="gap-1.5">
                  <TipoIcon tipo={t} />
                  {tabLabels[t]}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="relative min-w-[240px] flex-1 sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Buscar em ${tabLabels[tab].toLowerCase()}...`}
                className="pl-9"
              />
            </div>
          </div>

          {tabs.map((t) => (
            <TabsContent key={t} value={t} className="mt-4">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                {loading ? (
                  <TableSkeleton rows={5} cols={8} />
                ) : rows.length === 0 ? (
                  <EmptyState
                    icon={tabIcons[t]}
                    title={`Nenhum banimento por ${tabLabels[t].replace("Por ", "").toLowerCase()}`}
                    description="Clique em 'Novo banimento' para adicionar um bloqueio nesta categoria."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                          <th className="px-5 py-3 font-medium">Tipo</th>
                          <th className="px-5 py-3 font-medium">Identificador</th>
                          <th className="px-5 py-3 font-medium">Motivo</th>
                          <th className="px-5 py-3 font-medium">Gravidade</th>
                          <th className="px-5 py-3 font-medium">Data início</th>
                          <th className="px-5 py-3 font-medium">Data fim</th>
                          <th className="px-5 py-3 font-medium">Permanente</th>
                          <th className="px-5 py-3 text-right font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {rows.map((b) => (
                          <tr key={b.id} className="transition-colors hover:bg-muted/50">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <TipoIcon tipo={b.tipo} />
                                <span className="capitalize text-xs">
                                  {tabLabels[b.tipo].replace("Por ", "")}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <div className="min-w-0">
                                <p className="truncate font-mono text-xs font-medium text-foreground">
                                  {b.identificador}
                                </p>
                                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                                  por {b.criadoPor}
                                  {b.pais ? ` · ${b.pais}` : ""}
                                </p>
                              </div>
                            </td>
                            <td className="px-5 py-3 max-w-[260px]">
                              <p className="truncate text-muted-foreground">{b.motivo}</p>
                            </td>
                            <td className="px-5 py-3">
                              <GravidadePill gravidade={b.gravidade} />
                            </td>
                            <td className="px-5 py-3 tabular-nums text-xs text-muted-foreground">
                              {formatDateTime(b.dataInicio)}
                            </td>
                            <td className="px-5 py-3 tabular-nums text-xs text-muted-foreground">
                              {b.dataFim ? formatDateTime(b.dataFim) : "—"}
                            </td>
                            <td className="px-5 py-3">
                              <PermanentePill permanente={b.permanente} />
                            </td>
                            <td className="px-5 py-3 text-right">
                              <div className="inline-flex items-center gap-1">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Edit className="h-3.5 w-3.5" />
                                  <span className="sr-only">Editar</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700"
                                >
                                  <Undo2 className="h-3.5 w-3.5" />
                                  <span className="sr-only">Desfazer</span>
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
          ))}
        </Tabs>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/admin/banimentos")({
  head: () => ({ meta: [{ title: "Banimentos · Admin · Cash Engine PRO" }] }),
  component: AdminBanimentosPage,
});
