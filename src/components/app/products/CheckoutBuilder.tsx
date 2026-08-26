import { useMemo, useState } from "react";
import { ArrowLeft, CreditCard, FileText, Lock, QrCode, ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/mock/data";
import { splitOf } from "@/lib/mock/transactions";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";

type Config = {
  name: string;
  price: number;
  installments: number;
  commission: number;
  methods: { pix: boolean; card: boolean; boleto: boolean };
  bumpEnabled: boolean;
  bumpTitle: string;
  bumpPrice: number;
  accent: string;
  askPhone: boolean;
  askDocument: boolean;
};

const accents = [
  { id: "azul", label: "Azul", color: "#1d4ed8" },
  { id: "verde", label: "Verde", color: "#047857" },
  { id: "roxo", label: "Roxo", color: "#6d28d9" },
  { id: "grafite", label: "Grafite", color: "#0f172a" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls =
  "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition hover:bg-muted/60"
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted-foreground/30",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-card shadow transition-all",
            checked ? "left-4.5" : "left-0.5",
          )}
          style={{ left: checked ? 18 : 2 }}
        />
      </span>
    </button>
  );
}

export function CheckoutBuilder({
  product,
  onBack,
}: {
  product: Product | null;
  onBack: () => void;
}) {
  const [cfg, setCfg] = useState<Config>({
    name: product?.name ?? "Novo produto digital",
    price: product?.price ?? 197,
    installments: 12,
    commission: product?.commission ?? 30,
    methods: { pix: true, card: true, boleto: false },
    bumpEnabled: true,
    bumpTitle: "Pack de bônus exclusivos",
    bumpPrice: 47,
    accent: "azul",
    askPhone: true,
    askDocument: true,
  });
  const [method, setMethod] = useState<"pix" | "card" | "boleto">("pix");
  const [bumpChecked, setBumpChecked] = useState(false);

  const set = <K extends keyof Config>(key: K, value: Config[K]) =>
    setCfg((c) => ({ ...c, [key]: value }));

  const accent = accents.find((a) => a.id === cfg.accent)!.color;
  const total = cfg.price + (cfg.bumpEnabled && bumpChecked ? cfg.bumpPrice : 0);

  const producer = useMemo(() => {
    const rows = splitOf(total, true);
    const share = rows.find((r) => r.key === "produtor")!;
    // recalcula a comissão configurada em vez dos 30% padrão
    const affiliate = total * (cfg.commission / 100);
    const gateway = total * 0.0349 + 0.99;
    const platform = total * 0.03;
    return { net: total - affiliate - gateway - platform, affiliate, gateway, platform, share };
  }, [total, cfg.commission]);

  const availableMethods = (["pix", "card", "boleto"] as const).filter((m) =>
    m === "pix" ? cfg.methods.pix : m === "card" ? cfg.methods.card : cfg.methods.boleto,
  );
  const activeMethod = availableMethods.includes(method) ? method : availableMethods[0];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para produtos
      </button>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {product ? "Editar checkout" : "Novo produto e checkout"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure à esquerda e veja o checkout mudar em tempo real.
          </p>
        </div>
        <button
          className="rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          style={{ backgroundColor: accent }}
        >
          Publicar checkout
        </button>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Painel de configuração */}
        <aside className="space-y-4">
          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Produto</h2>
            <div className="mt-3 space-y-3">
              <Field label="Nome do produto">
                <input
                  className={inputCls}
                  value={cfg.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <Field label={`Preço · ${formatBRL(cfg.price)}`}>
                <input
                  type="range"
                  min={19}
                  max={2997}
                  step={1}
                  value={cfg.price}
                  onChange={(e) => set("price", Number(e.target.value))}
                  className="w-full accent-[var(--accent-color)]"
                  style={{ ["--accent-color" as string]: accent }}
                />
              </Field>
              <Field label="Parcelamento máximo">
                <select
                  className={inputCls}
                  value={cfg.installments}
                  onChange={(e) => set("installments", Number(e.target.value))}
                >
                  {[1, 3, 6, 12].map((i) => (
                    <option key={i} value={i}>
                      {i}x
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Comissão de afiliado</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {cfg.commission}% por venda aprovada
            </p>
            <input
              type="range"
              min={0}
              max={70}
              value={cfg.commission}
              onChange={(e) => set("commission", Number(e.target.value))}
              className="mt-3 w-full"
              style={{ accentColor: accent }}
            />
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Métodos de pagamento</h2>
            <div className="mt-3 space-y-2">
              <Toggle
                label="Pix"
                checked={cfg.methods.pix}
                onChange={(v) => set("methods", { ...cfg.methods, pix: v })}
              />
              <Toggle
                label="Cartão de crédito"
                checked={cfg.methods.card}
                onChange={(v) => set("methods", { ...cfg.methods, card: v })}
              />
              <Toggle
                label="Boleto"
                checked={cfg.methods.boleto}
                onChange={(v) => set("methods", { ...cfg.methods, boleto: v })}
              />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Order Bump</h2>
            <div className="mt-3 space-y-3">
              <Toggle
                label="Ativar order bump"
                checked={cfg.bumpEnabled}
                onChange={(v) => set("bumpEnabled", v)}
              />
              <Field label="Título da oferta">
                <input
                  className={inputCls}
                  value={cfg.bumpTitle}
                  disabled={!cfg.bumpEnabled}
                  onChange={(e) => set("bumpTitle", e.target.value)}
                />
              </Field>
              <Field label="Preço do bump">
                <input
                  type="number"
                  className={inputCls}
                  value={cfg.bumpPrice}
                  disabled={!cfg.bumpEnabled}
                  onChange={(e) => set("bumpPrice", Number(e.target.value) || 0)}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Aparência e formulário</h2>
            <div className="mt-3 flex gap-2">
              {accents.map((a) => (
                <button
                  key={a.id}
                  onClick={() => set("accent", a.id)}
                  aria-label={a.label}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition",
                    cfg.accent === a.id ? "border-foreground" : "border-transparent",
                  )}
                  style={{ backgroundColor: a.color }}
                />
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <Toggle
                label="Pedir telefone"
                checked={cfg.askPhone}
                onChange={(v) => set("askPhone", v)}
              />
              <Toggle
                label="Pedir CPF/CNPJ"
                checked={cfg.askDocument}
                onChange={(v) => set("askDocument", v)}
              />
            </div>
          </section>
        </aside>

        {/* Preview do checkout */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/40 p-4 shadow-sm sm:p-8">
            <div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <div
                className="px-6 py-4 text-center text-sm font-semibold text-primary-foreground"
                style={{ backgroundColor: accent }}
              >
                Pagamento seguro · Cash Engine PRO
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Você está comprando
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">{cfg.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {formatBRL(cfg.price)}
                    {cfg.installments > 1
                      ? ` ou ${cfg.installments}x de ${formatBRL(cfg.price / cfg.installments)}`
                      : ""}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="h-9 rounded-lg border border-border bg-muted/50 px-3 text-sm leading-9 text-muted-foreground">
                    Nome completo
                  </div>
                  <div className="h-9 rounded-lg border border-border bg-muted/50 px-3 text-sm leading-9 text-muted-foreground">
                    E-mail
                  </div>
                  {cfg.askPhone ? (
                    <div className="h-9 rounded-lg border border-border bg-muted/50 px-3 text-sm leading-9 text-muted-foreground">
                      Telefone
                    </div>
                  ) : null}
                  {cfg.askDocument ? (
                    <div className="h-9 rounded-lg border border-border bg-muted/50 px-3 text-sm leading-9 text-muted-foreground">
                      CPF / CNPJ
                    </div>
                  ) : null}
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">Forma de pagamento</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(["pix", "card", "boleto"] as const).map((m) => {
                      const enabled = availableMethods.includes(m);
                      const Icon = m === "pix" ? QrCode : m === "card" ? CreditCard : FileText;
                      const label = m === "pix" ? "Pix" : m === "card" ? "Cartão" : "Boleto";
                      if (!enabled) return null;
                      const active = activeMethod === m;
                      return (
                        <button
                          key={m}
                          onClick={() => setMethod(m)}
                          className={cn(
                            "flex flex-col items-center gap-1 rounded-lg border px-3 py-2.5 text-xs font-medium transition",
                            active
                              ? "border-transparent text-primary-foreground"
                              : "border-border bg-background text-muted-foreground hover:bg-muted",
                          )}
                          style={active ? { backgroundColor: accent } : undefined}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {cfg.bumpEnabled ? (
                  <button
                    onClick={() => setBumpChecked((v) => !v)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border-2 border-dashed p-3 text-left transition",
                      bumpChecked ? "bg-muted/60" : "bg-background hover:bg-muted/40",
                    )}
                    style={{ borderColor: accent }}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        bumpChecked
                          ? "border-transparent text-primary-foreground"
                          : "border-border",
                      )}
                      style={bumpChecked ? { backgroundColor: accent } : undefined}
                    >
                      {bumpChecked ? "✓" : ""}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        {cfg.bumpTitle}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        Adicione por apenas {formatBRL(cfg.bumpPrice)} — oferta única nesta página.
                      </span>
                    </span>
                  </button>
                ) : null}

                <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatBRL(cfg.price)}</span>
                  </div>
                  {cfg.bumpEnabled && bumpChecked ? (
                    <div className="mt-1 flex items-center justify-between text-muted-foreground">
                      <span>{cfg.bumpTitle}</span>
                      <span className="tabular-nums">{formatBRL(cfg.bumpPrice)}</span>
                    </div>
                  ) : null}
                  <div className="mt-2 flex items-center justify-between border-t border-border pt-2 font-semibold text-foreground">
                    <span>Total</span>
                    <span className="tabular-nums">{formatBRL(total)}</span>
                  </div>
                </div>

                <button
                  className="w-full rounded-lg py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
                  style={{ backgroundColor: accent }}
                >
                  {activeMethod === "pix"
                    ? "Gerar Pix e pagar"
                    : activeMethod === "boleto"
                      ? "Gerar boleto"
                      : "Finalizar compra"}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Ambiente criptografado · antifraude ativo
                </p>
              </div>
            </div>
          </div>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                Quanto você recebe por venda
              </h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {[
                { label: "Você recebe", value: producer.net, strong: true },
                { label: "Afiliado", value: producer.affiliate },
                { label: "Cash Engine PRO", value: producer.platform },
                { label: "Processamento", value: producer.gateway },
              ].map((row) => (
                <div key={row.label} className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p
                    className={cn(
                      "mt-1 text-sm font-semibold tabular-nums",
                      row.strong ? "text-primary" : "text-foreground",
                    )}
                  >
                    {formatBRL(row.value)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
