import { useMemo, useState } from "react";
import {
  BadgePercent,
  Building2,
  History,
  Package,
  Plus,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  affiliatesFull,
  affiliateProductCommissionRules,
  commissionHistory,
  defaultCommissionRule,
  platformFeeRule,
  productCommissionRules,
  products,
  type CommissionHistoryEntry,
  type CommissionRule,
  type CommissionRuleType,
} from "@/lib/mock/data";
import { formatBRL, formatDateTime, formatPct } from "@/lib/format";
import { CardsSkeleton, TableSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { EmptyState } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ScopeBadge({ scope }: { scope: CommissionRule["scope"] }) {
  const map: Record<CommissionRule["scope"], { label: string; className: string }> = {
    padrao: { label: "Plataforma", className: "bg-foreground/10 text-foreground" },
    produto: { label: "Produto", className: "bg-primary/10 text-primary" },
    afiliado_produto: { label: "Afiliado × Produto", className: "bg-amber-500/10 text-amber-700" },
  };
  const item = map[scope];
  return (
    <Badge variant="secondary" className={cn("font-medium", item.className)}>
      {item.label}
    </Badge>
  );
}

function RuleValue({ type, value }: { type: CommissionRuleType; value: number }) {
  if (type === "percentual") return <span>{formatPct(value)}</span>;
  return <span>{formatBRL(value)}</span>;
}

function HistoryEntry({ entry }: { entry: CommissionHistoryEntry }) {
  const prev =
    entry.previousType && entry.previousValue !== undefined ? (
      <span className="tabular-nums text-rose-600 line-through">
        <RuleValue type={entry.previousType} value={entry.previousValue} />
      </span>
    ) : (
      <span className="text-muted-foreground">—</span>
    );
  return (
    <div className="flex items-start gap-3 border-b border-border last:border-0 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <History className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{entry.description}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Referência: <span className="font-medium text-foreground">{entry.reference}</span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">Anterior:</span>
          {prev}
          <span className="text-muted-foreground">→ Novo:</span>
          <span className="font-semibold tabular-nums text-emerald-600">
            <RuleValue type={entry.newType} value={entry.newValue} />
          </span>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Alterado por <span className="font-medium">{entry.changedBy}</span> em{" "}
          {formatDateTime(entry.changedAt)}
        </p>
      </div>
    </div>
  );
}

export function AdminCommissionsPage() {
  const loading = useFakeLoading();
  const [tab, setTab] = useState<"regras" | "historico">("regras");

  const [defaultType, setDefaultType] = useState<CommissionRuleType>(defaultCommissionRule.type);
  const [defaultValue, setDefaultValue] = useState(String(defaultCommissionRule.value));
  const [platformValue, setPlatformValue] = useState(String(platformFeeRule.value));

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Administração
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Controle de Comissão
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Regras de prioridade: Afiliado × Produto → Produto → Padrão da plataforma. Alterações
            valem apenas para novas vendas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Não afeta vendas antigas
          </Badge>
        </div>
      </header>

      {loading ? (
        <CardsSkeleton count={3} />
      ) : (
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Comissão padrão
                </CardTitle>
                <ScopeBadge scope="padrao" />
              </div>
              <CardDescription>Aplicada quando não há regra específica.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Tipo
                  </Label>
                  <Select
                    value={defaultType}
                    onValueChange={(v) => setDefaultType(v as CommissionRuleType)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentual">Percentual (%)</SelectItem>
                      <SelectItem value="fixa">Fixa (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Valor
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    className="mt-1.5 tabular-nums"
                    value={defaultValue}
                    onChange={(e) => setDefaultValue(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Atual:{" "}
                <RuleValue type={defaultCommissionRule.type} value={defaultCommissionRule.value} />{" "}
                · definido por {defaultCommissionRule.updatedBy}
              </p>
              <Button size="sm" className="w-full gap-1.5">
                <Save className="h-3.5 w-3.5" />
                Salvar padrão
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-foreground" />
                  Taxa da plataforma
                </CardTitle>
                <Badge variant="secondary">Plataforma</Badge>
              </div>
              <CardDescription>Valor que pertence ao Cash Engine PRO.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Tipo
                  </Label>
                  <Select defaultValue="percentual">
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentual">Percentual (%)</SelectItem>
                      <SelectItem value="fixa">Fixa (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Valor
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    className="mt-1.5 tabular-nums"
                    value={platformValue}
                    onChange={(e) => setPlatformValue(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Atual: {formatPct(platformFeeRule.value)} · aplicável sobre o valor bruto.
              </p>
              <Button size="sm" variant="outline" className="w-full gap-1.5">
                <Save className="h-3.5 w-3.5" />
                Salvar taxa
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  Prioridade
                </CardTitle>
              </div>
              <CardDescription>Ordem de aplicação das regras.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                {
                  icon: UserCog,
                  label: "Afiliado × Produto",
                  desc: "Específica para um afiliado num produto",
                  strong: true,
                },
                { icon: Package, label: "Produto", desc: "Regra específica do produto" },
                { icon: Sparkles, label: "Padrão", desc: "Regra geral da plataforma" },
              ].map((r, i) => (
                <div
                  key={r.label}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-2.5",
                    r.strong ? "border-primary/30 bg-primary/5" : "border-border bg-background/50",
                  )}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                    {i + 1}
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-foreground/5 text-foreground">
                    <r.icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{r.label}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{r.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      <section className="mt-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="regras" className="gap-1.5">
              <BadgePercent className="h-3.5 w-3.5" />
              Regras configuradas
            </TabsTrigger>
            <TabsTrigger value="historico" className="gap-1.5">
              <History className="h-3.5 w-3.5" />
              Histórico de alterações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="regras" className="space-y-5">
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    Comissão por produto
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Regras específicas sobrescrevem o padrão da plataforma.
                  </p>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Nova regra de produto
                </Button>
              </div>
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-5 py-3 font-medium">Produto</th>
                        <th className="px-5 py-3 font-medium">Tipo</th>
                        <th className="px-5 py-3 text-right font-medium">Valor</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Atualizado por</th>
                        <th className="px-5 py-3 font-medium">Em</th>
                        <th className="px-5 py-3 text-right font-medium">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {productCommissionRules.map((r) => (
                        <tr key={r.id} className="hover:bg-muted/40">
                          <td className="px-5 py-3 font-medium text-foreground">{r.productName}</td>
                          <td className="px-5 py-3 text-muted-foreground capitalize">{r.type}</td>
                          <td className="px-5 py-3 text-right font-semibold tabular-nums">
                            <RuleValue type={r.type} value={r.value} />
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                                r.status === "ativo"
                                  ? "bg-emerald-500/10 text-emerald-700"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {r.status === "ativo" ? "Ativa" : "Inativa"}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">{r.updatedBy}</td>
                          <td className="px-5 py-3 text-xs tabular-nums text-muted-foreground">
                            {formatDateTime(r.updatedAt)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Button size="sm" variant="ghost">
                              Editar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    Comissão por afiliado × produto
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Maior prioridade, aplicada antes das regras de produto e padrão.
                  </p>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Nova regra afiliado
                </Button>
              </div>
              {loading ? (
                <TableSkeleton rows={3} cols={7} />
              ) : affiliateProductCommissionRules.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="Nenhuma regra específica de afiliado"
                  description="Crie uma regra individual para um afiliado em um produto específico quando precisar de condições comerciais diferenciadas."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-5 py-3 font-medium">Afiliado</th>
                        <th className="px-5 py-3 font-medium">Produto</th>
                        <th className="px-5 py-3 font-medium">Tipo</th>
                        <th className="px-5 py-3 text-right font-medium">Valor</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Atualizado por</th>
                        <th className="px-5 py-3 text-right font-medium">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {affiliateProductCommissionRules.map((r) => (
                        <tr key={r.id} className="hover:bg-muted/40">
                          <td className="px-5 py-3 font-medium text-foreground">
                            {r.affiliateName}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">{r.productName}</td>
                          <td className="px-5 py-3 text-muted-foreground capitalize">{r.type}</td>
                          <td className="px-5 py-3 text-right font-semibold tabular-nums">
                            <RuleValue type={r.type} value={r.value} />
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                                r.status === "ativo"
                                  ? "bg-emerald-500/10 text-emerald-700"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {r.status === "ativo" ? "Ativa" : "Inativa"}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">{r.updatedBy}</td>
                          <td className="px-5 py-3 text-right">
                            <Button size="sm" variant="ghost">
                              Editar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="historico">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">Histórico completo</h3>
                  <p className="text-xs text-muted-foreground">
                    Toda alteração de regra é registrada com autor, data e valores anterior/novo.
                  </p>
                </div>
              </div>
              {loading ? (
                <CardsSkeleton count={5} />
              ) : commissionHistory.length === 0 ? (
                <EmptyState
                  icon={History}
                  title="Sem alterações ainda"
                  description="As alterações de comissão aparecerão aqui com detalhes completos de auditoria."
                />
              ) : (
                <div className="divide-y divide-border">
                  {commissionHistory.map((h) => (
                    <HistoryEntry key={h.id} entry={h} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
