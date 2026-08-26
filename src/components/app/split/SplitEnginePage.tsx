import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  Handshake,
  History,
  Package,
  Percent,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  affiliateProductCommissionRules,
  defaultCommissionRule,
  platformFeeRule,
  productCommissionRules,
  products,
  affiliatesFull,
  saleRecords,
  type CommissionRule,
  type CommissionRuleType,
} from "@/lib/mock/data";
import { formatBRL, formatDateTime, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type SplitShare = {
  key: "produtor" | "afiliado" | "plataforma" | "taxa";
  label: string;
  percent: number;
  amount: number;
  ruleNote?: string;
};

const gatewayFixed = 0.99;
const gatewayPercent = 0.0349;

function resolveCommission(params: {
  productId: string;
  affiliateId?: string | undefined;
  customType?: CommissionRuleType | undefined;
  customValue?: number | undefined;
  gross: number;
}): { amount: number; type: CommissionRuleType; value: number; source: string } {
  const { productId, affiliateId, customType, customValue, gross } = params;

  if (customType && customValue !== undefined && !isNaN(customValue)) {
    const amount =
      customType === "percentual"
        ? Math.round(gross * (customValue / 100) * 100) / 100
        : Math.round(customValue * 100) / 100;
    return { amount, type: customType, value: customValue, source: "Simulação manual" };
  }

  if (affiliateId) {
    const specific = affiliateProductCommissionRules.find(
      (r) => r.productId === productId && r.affiliateId === affiliateId && r.status === "ativo",
    );
    if (specific) {
      const amount =
        specific.type === "percentual"
          ? Math.round(gross * (specific.value / 100) * 100) / 100
          : Math.round(specific.value * 100) / 100;
      return {
        amount,
        type: specific.type,
        value: specific.value,
        source: `Afiliado × Produto (${specific.affiliateName})`,
      };
    }
  }

  const product = products.find((p) => p.id === productId);
  if (product) {
    const pr = productCommissionRuleById(productId);
    if (pr) {
      const amount =
        pr.type === "percentual"
          ? Math.round(gross * (pr.value / 100) * 100) / 100
          : Math.round(pr.value * 100) / 100;
      return {
        amount,
        type: pr.type,
        value: pr.value,
        source: `Produto (${pr.productName ?? product.name})`,
      };
    }
    if (product.commission) {
      const amount = Math.round(gross * (product.commission / 100) * 100) / 100;
      return {
        amount,
        type: "percentual",
        value: product.commission,
        source: `Produto · cadastro (${product.name})`,
      };
    }
  }

  const amount =
    defaultCommissionRule.type === "percentual"
      ? Math.round(gross * (defaultCommissionRule.value / 100) * 100) / 100
      : Math.round(defaultCommissionRule.value * 100) / 100;
  return {
    amount,
    type: defaultCommissionRule.type,
    value: defaultCommissionRule.value,
    source: "Padrão da plataforma",
  };
}

function productCommissionRuleById(productId: string) {
  return productCommissionRules.find(
    (r: CommissionRule) => r.productId === productId && r.status === "ativo",
  );
}

function splitFor(
  gross: number,
  hasAffiliate: boolean,
  platformFeePct: number,
  commissionAmount: number,
): SplitShare[] {
  const gatewayFee = Math.round((gross * gatewayPercent + gatewayFixed) * 100) / 100;
  const platform = Math.round(gross * (platformFeePct / 100) * 100) / 100;
  const affiliate = hasAffiliate ? Math.min(commissionAmount, gross) : 0;
  let producer = gross - gatewayFee - platform - affiliate;

  let total = gatewayFee + platform + affiliate + producer;
  const diff = Math.round((gross - total) * 100);
  if (Math.abs(diff) >= 1) {
    producer = Math.round((producer + diff / 100) * 100) / 100;
    total = gatewayFee + platform + affiliate + producer;
  }

  const safePercent = (v: number) => (gross > 0 ? Math.round((v / gross) * 10000) / 100 : 0);

  const rows: SplitShare[] = [
    {
      key: "produtor",
      label: "Produtor",
      percent: safePercent(producer),
      amount: producer,
    },
  ];
  if (hasAffiliate) {
    rows.push({
      key: "afiliado",
      label: "Afiliado",
      percent: safePercent(affiliate),
      amount: affiliate,
    });
  }
  rows.push(
    {
      key: "plataforma",
      label: "Cash Engine PRO",
      percent: safePercent(platform),
      amount: platform,
    },
    {
      key: "taxa",
      label: "Taxa de processamento",
      percent: safePercent(gatewayFee),
      amount: gatewayFee,
    },
  );
  return rows;
}

const meta: Record<
  SplitShare["key"],
  { icon: React.ElementType; bar: string; chip: string; note: string }
> = {
  produtor: {
    icon: UserRound,
    bar: "bg-primary",
    chip: "bg-primary/10 text-primary",
    note: "Recebe o líquido em D+2 (Pix) ou D+30 (cartão).",
  },
  afiliado: {
    icon: Handshake,
    bar: "bg-[oklch(0.72_0.15_80)]",
    chip: "bg-[oklch(0.78_0.15_80_/_18%)] text-[oklch(0.5_0.13_75)]",
    note: "Comissão liberada junto com a liquidação da venda.",
  },
  plataforma: {
    icon: Building2,
    bar: "bg-foreground",
    chip: "bg-foreground/10 text-foreground",
    note: "Taxa da plataforma sobre o valor bruto.",
  },
  taxa: {
    icon: Percent,
    bar: "bg-muted-foreground/60",
    chip: "bg-muted text-muted-foreground",
    note: "Custo do adquirente/gateway por transação.",
  },
};

export function SplitEnginePage() {
  const [tab, setTab] = useState<"calculadora" | "registros">("calculadora");

  const [productId, setProductId] = useState(products[0]!.id);
  const [affiliateId, setAffiliateId] = useState<string>("none");
  const [amount, setAmount] = useState(String(products[0]!.price));
  const [platformFee, setPlatformFee] = useState(String(platformFeeRule.value));
  const [overrideType, setOverrideType] = useState<CommissionRuleType | "auto">("auto");
  const [overrideValue, setOverrideValue] = useState<string>("");
  const [withAffiliate, setWithAffiliate] = useState(true);

  const product = products.find((p) => p.id === productId) ?? products[0]!;
  const gross = Number(amount) || 0;
  const platformFeePct = Number(platformFee) || 0;
  const affiliate = affiliateId !== "none" ? affiliateId : undefined;

  const commission = useMemo(
    () =>
      resolveCommission({
        productId,
        affiliateId: affiliate,
        customType: overrideType === "auto" ? undefined : overrideType,
        customValue: overrideValue === "" ? undefined : Number(overrideValue),
        gross,
      }),
    [productId, affiliate, overrideType, overrideValue, gross],
  );

  const shares = useMemo(
    () => splitFor(gross, withAffiliate, platformFeePct, commission.amount),
    [gross, withAffiliate, platformFeePct, commission.amount],
  );

  const sum = useMemo(
    () => shares.reduce((acc, s) => Math.round((acc + s.amount) * 100) / 100, 0),
    [shares],
  );

  const sumOk = Math.abs(Math.round((gross - sum) * 100)) <= 1;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Calculadora Financeira
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Simule a distribuição exata de cada venda, considerando comissões por produto, afiliado
            e taxa da plataforma.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Fechamento financeiro consistente
        </span>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-6 w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="calculadora" className="gap-1.5">
            <Calculator className="h-3.5 w-3.5" />
            Calculadora
          </TabsTrigger>
          <TabsTrigger value="registros" className="gap-1.5">
            <History className="h-3.5 w-3.5" />
            Registros de venda
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculadora" className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Parâmetros da venda
              </CardTitle>
              <CardDescription>
                Selecione um produto para carregar suas regras de comissão automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide">Produto</Label>
                <Select
                  value={productId}
                  onValueChange={(v) => {
                    setProductId(v);
                    const p = products.find((x) => x.id === v);
                    if (p && !Number.isNaN(p.price)) setAmount(String(p.price));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} · {formatBRL(p.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide">Valor da venda (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  className="tabular-nums"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide">Afiliado</Label>
                <Select value={affiliateId} onValueChange={setAffiliateId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Venda direta (sem afiliado)</SelectItem>
                    {affiliatesFull.slice(0, 10).map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide">Valor da plataforma (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  className="tabular-nums"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Configurável — atual: {formatPct(platformFeeRule.value)}.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide">Comissão</Label>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-2">
                    <Select
                      value={overrideType}
                      onValueChange={(v) => setOverrideType(v as CommissionRuleType | "auto")}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto (regra)</SelectItem>
                        <SelectItem value="percentual">% manual</SelectItem>
                        <SelectItem value="fixa">R$ fixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="h-9 tabular-nums"
                      placeholder={
                        overrideType === "auto"
                          ? `${commission.type === "percentual" ? formatPct(commission.value) : formatBRL(commission.value)} (auto)`
                          : overrideType === "percentual"
                            ? "Ex: 40"
                            : "Ex: 50"
                      }
                      value={overrideValue}
                      onChange={(e) => setOverrideValue(e.target.value)}
                      disabled={overrideType === "auto"}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Badge
                    variant="secondary"
                    className="gap-1 bg-primary/5 text-primary border-primary/20"
                  >
                    <Sparkles className="h-3 w-3" />
                    {commission.source}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    Base:{" "}
                    {commission.type === "percentual"
                      ? formatPct(commission.value)
                      : formatBRL(commission.value)}
                    {" · "}
                    Calculado:{" "}
                    <strong className="text-foreground">{formatBRL(commission.amount)}</strong>
                  </span>
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant={withAffiliate ? "default" : "outline"}
                  onClick={() => setWithAffiliate((v) => !v)}
                  className="w-full gap-1.5"
                >
                  <Handshake className="h-4 w-4" />
                  {withAffiliate ? "Com afiliado" : "Venda direta"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-primary" />
                  Resultado
                </CardTitle>
                <CardDescription>
                  Valor bruto, distribuição e fechamento do cálculo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                    Venda bruta
                  </p>
                  <p className="mt-1.5 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
                    {formatBRL(gross)}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {product.name} · Pix / Cartão
                  </p>
                </div>

                <div className="flex h-3 w-full overflow-hidden rounded-full">
                  {shares.map((s) => (
                    <span
                      key={s.key}
                      className={cn("h-full transition-all duration-500", meta[s.key].bar)}
                      style={{ width: `${s.percent}%` }}
                    />
                  ))}
                </div>

                <ul className="space-y-2 text-xs">
                  {shares.map((s) => (
                    <li key={s.key} className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <span className={cn("h-2 w-2 rounded-full", meta[s.key].bar)} />
                        {s.label}
                      </span>
                      <span className="tabular-nums text-foreground font-medium">
                        {formatPct(s.percent)} · {formatBRL(s.amount)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-xl border border-border bg-background/60 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Soma distribuída</span>
                    <span className="flex items-center gap-1.5 tabular-nums font-semibold">
                      {formatBRL(sum)}
                      {sumOk ? (
                        <BadgeCheck className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <span className="text-rose-600">⚠ dif. {formatBRL(gross - sum)}</span>
                      )}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Diferença máxima de 1 centavo ajustada no produtor.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-foreground" />
                  Fluxo de caixa
                </CardTitle>
                <CardDescription>Distribuição detalhada e conferência de valores.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-[180px_1fr] md:items-center">
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                    Entrada
                  </p>
                  <p className="mt-1.5 text-xl font-semibold tabular-nums text-foreground">
                    {formatBRL(gross)}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Pagamento aprovado</p>
                </div>

                <ul className="space-y-3">
                  {shares.map((s) => {
                    const Icon = meta[s.key].icon;
                    return (
                      <li
                        key={s.key}
                        className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                      >
                        <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground md:block" />
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            meta[s.key].chip,
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <p className="text-sm font-medium text-foreground">{s.label}</p>
                            <p className="text-sm font-semibold tabular-nums text-foreground">
                              {formatBRL(s.amount)}
                            </p>
                          </div>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <span
                              className={cn(
                                "block h-full rounded-full transition-all duration-500",
                                meta[s.key].bar,
                              )}
                              style={{ width: `${s.percent}%` }}
                            />
                          </div>
                          <p className="mt-1.5 text-[11px] text-muted-foreground">
                            {meta[s.key].note}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="registros">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Vendas registradas (amostra)</CardTitle>
              <CardDescription>
                Cada venda armazena a comissão aplicada, taxa da plataforma, valor do produtor e
                afiliado relacionado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-2 py-3 font-medium">Transação</th>
                      <th className="px-2 py-3 font-medium">Produto</th>
                      <th className="px-2 py-3 text-right font-medium">Bruto</th>
                      <th className="px-2 py-3 font-medium">Comissão</th>
                      <th className="px-2 py-3 text-right font-medium">Afiliado</th>
                      <th className="px-2 py-3 text-right font-medium">Plataforma</th>
                      <th className="px-2 py-3 text-right font-medium">Gateway</th>
                      <th className="px-2 py-3 text-right font-medium">Produtor</th>
                      <th className="px-2 py-3 font-medium">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {saleRecords.map((sr) => (
                      <tr key={sr.id} className="hover:bg-muted/40">
                        <td className="px-2 py-2.5 font-mono text-xs text-muted-foreground">
                          {sr.transactionId}
                        </td>
                        <td className="px-2 py-2.5 font-medium text-foreground">{sr.product}</td>
                        <td className="px-2 py-2.5 text-right tabular-nums text-muted-foreground">
                          {formatBRL(sr.grossAmount)}
                        </td>
                        <td className="px-2 py-2.5 text-xs text-muted-foreground">
                          {sr.appliedCommissionType === "percentual"
                            ? `${sr.appliedCommissionValue}%`
                            : `R$ ${sr.appliedCommissionValue}`}
                        </td>
                        <td className="px-2 py-2.5 text-right tabular-nums">
                          {formatBRL(sr.commissionAmount)}
                        </td>
                        <td className="px-2 py-2.5 text-right tabular-nums">
                          {formatBRL(sr.platformFeeAmount)}
                        </td>
                        <td className="px-2 py-2.5 text-right tabular-nums text-muted-foreground">
                          {formatBRL(sr.gatewayFeeAmount)}
                        </td>
                        <td className="px-2 py-2.5 text-right font-semibold tabular-nums text-foreground">
                          {formatBRL(sr.producerAmount)}
                        </td>
                        <td className="px-2 py-2.5 text-xs tabular-nums text-muted-foreground">
                          {formatDateTime(sr.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
