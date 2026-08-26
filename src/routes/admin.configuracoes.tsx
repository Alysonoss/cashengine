import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  HardDriveUpload,
  Link2,
  Mail,
  Megaphone,
  Save,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Wallet,
} from "lucide-react";
import { CardsSkeleton, useFakeLoading } from "@/components/app/Skeletons";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/admin/configuracoes")({
  component: Page,
});

type PreviewCard = {
  title: string;
  value: string;
  hint?: string;
  accent?: boolean;
};

function PreviewCard({ title, value, hint, accent }: PreviewCard) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        accent ? "border-primary/30 bg-primary/5" : "border-border bg-card",
      )}
    >
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className={cn("mt-1 text-lg font-semibold tabular-nums", accent ? "text-primary" : "text-foreground")}>
        {value}
      </p>
      {hint ? <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function KpiRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className={cn("text-sm", muted ? "text-muted-foreground" : "text-foreground")}>{label}</span>
      <span className="text-sm font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-[13px] text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function Page() {
  const loading = useFakeLoading(500);
  const [openSection, setOpenSection] = useState<string>("identidade");

  const kpis = useMemo<PreviewCard[]>(
    () => [
      { title: "Taxa média", value: "3,00%", hint: "padrão plataforma", accent: true },
      { title: "Saques / dia", value: "R$ 100.000", hint: "Free: 5k · Pro: 100k" },
      { title: "Retenção", value: "14 dias", hint: "vendas padrão" },
      { title: "Armazenamento", value: "50 GB", hint: "Pro · 1GB Free" },
    ],
    [],
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <CardsSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      <header className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">
            Administração
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Configurações globais
        </h1>
        <p className="text-[14px] text-muted-foreground">
          Ajustes padrão para toda a plataforma Cash Engine PRO: identidade, taxas, segurança e integrações.
        </p>
      </header>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          <Accordion type="single" collapsible value={openSection} onValueChange={setOpenSection}>
            <AccordionItem value="identidade" className="rounded-xl border border-border bg-card px-5 pb-0">
              <AccordionTrigger className="!no-underline py-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Identidade da plataforma</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-6">
                <SectionHeader
                  icon={Building2}
                  title="Identidade visual e marca"
                  desc="Nome, domínio e cores que aparecem em todo o ecossistema."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label>Nome fantasia</Label>
                    <Input className="mt-1.5" defaultValue="Cash Engine PRO" />
                  </div>
                  <div>
                    <Label>Razão social</Label>
                    <Input className="mt-1.5" defaultValue="Cash Engine Soluções de Pagamento LTDA" />
                  </div>
                  <div>
                    <Label>CNPJ</Label>
                    <Input className="mt-1.5 font-mono" defaultValue="42.591.651/0001-73" />
                  </div>
                  <div>
                    <Label>Domínio principal</Label>
                    <Input className="mt-1.5" defaultValue="https://cashengine.pro" />
                  </div>
                  <div>
                    <Label>Cor primary (hex)</Label>
                    <Input className="mt-1.5 font-mono" defaultValue="#ef4444" />
                  </div>
                  <div>
                    <Label>Slogan do painel</Label>
                    <Input className="mt-1.5" defaultValue="Infraestrutura de pagamentos" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Descrição curta (SEO / emails)</Label>
                    <textarea
                      className="mt-1.5 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      defaultValue="A Cash Engine PRO é a infraestrutura de pagamentos brasileira feita para escalar infoprodutos, SaaS e e-commerce com split inteligente."
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" className="gap-1.5">
                    <Save className="h-3.5 w-3.5" /> Salvar identidade
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="financeiro" className="mt-3 rounded-xl border border-border bg-card px-5 pb-0">
              <AccordionTrigger className="!no-underline py-4">
                <div className="flex items-center gap-3">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Financeiro · taxas e limites</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-6">
                <SectionHeader
                  icon={Wallet}
                  title="Taxas e limites padrão"
                  desc="Aplicados automaticamente em toda empresa nova. Podem ser sobrescritos por plano."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Taxa padrão da plataforma (%)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="3.00" type="number" step="0.01" />
                  </div>
                  <div>
                    <Label>Taxa mínima por transação (R$)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="0.50" type="number" step="0.01" />
                  </div>
                  <div>
                    <Label>Limite de saque diário (Free · R$)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="5000" type="number" />
                  </div>
                  <div>
                    <Label>Limite de saque diário (Pro · R$)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="100000" type="number" />
                  </div>
                  <div>
                    <Label>Dias de retenção de vendas</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="14" type="number" />
                  </div>
                  <div>
                    <Label>Chargeback máximo permitido (%)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="1.0" type="number" step="0.1" />
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">Cobrar taxa mínima sobre saques</p>
                      <p className="text-xs text-muted-foreground">Aplica a taxa mínima também em saques TED/Pix.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">Aplicar split no momento da captura</p>
                      <p className="text-xs text-muted-foreground">Realiza split imediatamente ao capturar transação.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" className="gap-1.5">
                    <Save className="h-3.5 w-3.5" /> Salvar financeiro
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="seguranca" className="mt-3 rounded-xl border border-border bg-card px-5 pb-0">
              <AccordionTrigger className="!no-underline py-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Segurança · senha, login e 2FA</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-6">
                <SectionHeader
                  icon={ShieldCheck}
                  title="Políticas globais de segurança"
                  desc="Definições de senha, bloqueio e fatores obrigatórios para admins."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Tamanho mínimo de senha</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="10" type="number" />
                  </div>
                  <div>
                    <Label>Complexidade mínima</Label>
                    <Select defaultValue="medio">
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixo">Baixa · só letras/números</SelectItem>
                        <SelectItem value="medio">Média · 1 símbolo e 1 número</SelectItem>
                        <SelectItem value="alto">Alta · símbolo, número e maiúscula</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tentativas de login antes do bloqueio</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="6" type="number" />
                  </div>
                  <div>
                    <Label>Tempo de bloqueio (min)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="30" type="number" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Chave de assinatura de sessões (rotação)</Label>
                    <Input className="mt-1.5 font-mono" defaultValue="••••••••••••••••sk_live_•••••••" readOnly />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Última rotação: 2026-08-01 · próxima agendada: 2026-11-01.
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">2FA obrigatório para admins globais</p>
                      <p className="text-xs text-muted-foreground">Bloqueia login do admin sem 2FA ativado.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">2FA obrigatório para owners</p>
                      <p className="text-xs text-muted-foreground">Aplica também para donos de empresa.</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">Expirar sessão após inatividade</p>
                      <p className="text-xs text-muted-foreground">Deslogar usuários após 1 hora sem interação.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Save className="h-3.5 w-3.5" /> Salvar seção
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="comunicacao" className="mt-3 rounded-xl border border-border bg-card px-5 pb-0">
              <AccordionTrigger className="!no-underline py-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Comunicação e transacionais</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-6">
                <SectionHeader
                  icon={Mail}
                  title="Email, SMS e canais transacionais"
                  desc="Remetentes padrão e modelos enviados pela plataforma."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Nome remetente de e-mail</Label>
                    <Input className="mt-1.5" defaultValue="Cash Engine PRO" />
                  </div>
                  <div>
                    <Label>E-mail remetente</Label>
                    <Input className="mt-1.5 font-mono" defaultValue="naoresponda@cashengine.pro" />
                  </div>
                  <div>
                    <Label>Responder para</Label>
                    <Input className="mt-1.5 font-mono" defaultValue="suporte@cashengine.pro" />
                  </div>
                  <div>
                    <Label>Servidor SMTP padrão</Label>
                    <Select defaultValue="ses">
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ses">AWS SES (sa-east-1)</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="resend">Resend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Assinatura global de email (HTML simples)</Label>
                    <textarea
                      className="mt-1.5 min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      defaultValue="<strong>Cash Engine PRO</strong><br/>Infraestrutura de pagamentos brasileira."
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Save className="h-3.5 w-3.5" /> Salvar comunicação
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="convites" className="mt-3 rounded-xl border border-border bg-card px-5 pb-0">
              <AccordionTrigger className="!no-underline py-4">
                <div className="flex items-center gap-3">
                  <UsersRound className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Convites e afiliados</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-6">
                <SectionHeader
                  icon={UsersRound}
                  title="Programa de afiliados e convites"
                  desc="Regras de comissão e limites de convites por plano."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Bônus de boas-vindas (R$)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="0" type="number" step="0.01" />
                  </div>
                  <div>
                    <Label>Comissão padrão de afiliados (%)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="30" type="number" step="0.1" />
                  </div>
                  <div>
                    <Label>Máximo de convites por empresa (Free)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="50" type="number" />
                  </div>
                  <div>
                    <Label>Máximo de convites por empresa (Pro)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="5000" type="number" />
                  </div>
                  <div>
                    <Label>Dias de validade de um convite</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="15" type="number" />
                  </div>
                  <div>
                    <Label>Parceiro padrão para empresas novas</Label>
                    <Select defaultValue="nenhum">
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nenhum">Nenhum</SelectItem>
                        <SelectItem value="parceiro1">Parceiro AnonDemo</SelectItem>
                        <SelectItem value="parceiro2">Parceiro XYZ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">Permitir empresas convidar pessoas externas</p>
                      <p className="text-xs text-muted-foreground">Se desligado, só admins globais convidam.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">Pagar comissão em recorrentes</p>
                      <p className="text-xs text-muted-foreground">Comissão do afiliado em assinaturas renovadas.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Save className="h-3.5 w-3.5" /> Salvar afiliados
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="storage" className="mt-3 rounded-xl border border-border bg-card px-5 pb-0">
              <AccordionTrigger className="!no-underline py-4">
                <div className="flex items-center gap-3">
                  <HardDriveUpload className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Storage e uploads</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-6">
                <SectionHeader
                  icon={HardDriveUpload}
                  title="Armazenamento de arquivos"
                  desc="Provedor S3 compatível e cotas por plano."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Provedor padrão</Label>
                    <Select defaultValue="s3">
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="s3">AWS S3</SelectItem>
                        <SelectItem value="r2">Cloudflare R2</SelectItem>
                        <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Região</Label>
                    <Input className="mt-1.5 font-mono" defaultValue="us-east-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Bucket padrão</Label>
                    <Input className="mt-1.5 font-mono" defaultValue="cash-engine-pro-prod" />
                  </div>
                  <div>
                    <Label>Armazenamento Free (GB)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="1" type="number" />
                  </div>
                  <div>
                    <Label>Armazenamento Pro (GB)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="50" type="number" />
                  </div>
                  <div>
                    <Label>Retenção de logs (dias)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="90" type="number" />
                  </div>
                  <div>
                    <Label>Tamanho máximo por upload (MB)</Label>
                    <Input className="mt-1.5 tabular-nums" defaultValue="100" type="number" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Save className="h-3.5 w-3.5" /> Salvar storage
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="integracoes" className="mt-3 rounded-xl border border-border bg-card px-5 pb-0">
              <AccordionTrigger className="!no-underline py-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Integrações padrão</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-6">
                <SectionHeader
                  icon={Link2}
                  title="Gateways e webhooks globais"
                  desc="Configuração default aplicada a novas empresas (podem sobrescrever)."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Gateway padrão de captura</Label>
                    <Select defaultValue="stripe">
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="mercado-pago">Mercado Pago</SelectItem>
                        <SelectItem value="asaas">Asaas</SelectItem>
                        <SelectItem value="pagarme">Pagar.me</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Antifraude padrão</Label>
                    <Select defaultValue="klarna">
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clear">ClearSale</SelectItem>
                        <SelectItem value="klarna">Klarna</SelectItem>
                        <SelectItem value="legiti">Legiti</SelectItem>
                        <SelectItem value="nenhum">Nenhum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>URL base de webhooks (padrão)</Label>
                    <Input className="mt-1.5 font-mono" defaultValue="https://hooks.cashengine.pro/v1" />
                  </div>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-foreground">Split de comissões em tempo real</p>
                      <p className="text-xs text-muted-foreground">Processa split no momento da captura.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-foreground">PIX automático no recebível</p>
                      <p className="text-xs text-muted-foreground">Saque automático para conta vinculada ao bater meta.</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-foreground">Webhook de todos os eventos</p>
                      <p className="text-xs text-muted-foreground">Replay e idempotência de chave habilitados.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                    <Megaphone className="h-3.5 w-3.5" /> Testar webhook
                  </Button>
                  <Button size="sm" className="gap-1.5">
                    <Save className="h-3.5 w-3.5" /> Salvar integrações
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-foreground">Resumo ao vivo</CardTitle>
                <Badge variant="secondary" className="text-[11px]">preview</Badge>
              </div>
              <CardDescription className="text-[13px]">
                Baseado nas configurações ativas de toda plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {kpis.map((k) => (
                  <PreviewCard key={k.title} {...k} />
                ))}
              </div>

              <Separator />

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Split exemplo
                  </span>
                  <span className="text-xs text-muted-foreground">transação R$ 197,00</span>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Valor bruto</span>
                    <span className="text-base font-semibold tabular-nums text-foreground">
                      {formatBRL(197)}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <KpiRow label="Taxa plataforma (3%)" value={`− ${formatBRL(5.91)}`} />
                  <KpiRow label="Gateway médio (~3.99% + 0.39)" value={`− ${formatBRL(8.25)}`} />
                  <KpiRow
                    label="Afiliado padrão (30%)"
                    value={`− ${formatBRL(59.1)}`}
                  />
                  <Separator className="my-2" />
                  <KpiRow label="Líquido produtor" value={formatBRL(123.74)} />
                </div>
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Segurança atual
                </p>
                <ul className="space-y-1.5 text-[13px]">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">2FA admins</span>
                    <Badge className="bg-emerald-500/10 text-emerald-700">ativo</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">2FA owners</span>
                    <Badge variant="secondary">desligado</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Bloqueio após</span>
                    <span className="font-medium tabular-nums text-foreground">6 tentativas</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Mínimo senha</span>
                    <span className="font-medium tabular-nums text-foreground">10 chars</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Integrações ativas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary">Stripe</Badge>
                  <Badge variant="secondary">Mercado Pago</Badge>
                  <Badge variant="secondary">Asaas</Badge>
                  <Badge variant="secondary">Klarna AF</Badge>
                  <Badge variant="secondary">AWS S3</Badge>
                  <Badge variant="secondary">SES emails</Badge>
                  <Badge variant="secondary">Webhooks v1</Badge>
                </div>
              </div>

              <Separator />

              <Button className="w-full gap-1.5">
                <Save className="h-4 w-4" /> Salvar todas as seções
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                Última publicação: 2026-01-14 09:12 · por admin.global@cashengine.pro
              </p>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}
