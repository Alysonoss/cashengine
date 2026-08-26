import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, CreditCard, Lock, QrCode, Smartphone } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

const methods = [
  { id: "pix", label: "Pix", icon: QrCode, hint: "Confirmação imediata" },
  { id: "card", label: "Cartão", icon: CreditCard, hint: "Parcelamento configurável" },
  { id: "wallet", label: "Carteira", icon: Smartphone, hint: "Pagamento em um toque" },
];

const highlights = [
  "Fluxo curto, com menos campos e menos abandono",
  "Layout responsivo pensado primeiro para o celular",
  "Métodos de pagamento configuráveis por produto",
  "Status da transação atualizado no painel em tempo real",
];

export function CheckoutSection() {
  const [selected, setSelected] = useState("pix");

  return (
    <Section id="negocios">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            align="left"
            label="Checkout"
            title="Um checkout feito para vender."
            description="A etapa mais sensível da venda merece uma interface rápida, clara e previsível — em qualquer dispositivo."
          />
          <ul className="mt-8 space-y-3">
            {highlights.map((h, i) => (
              <Reveal key={h} delay={i * 0.06}>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-soft" />
                  <span>{h}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1}>
          <div className="surface-card mx-auto w-full max-w-md rounded-2xl p-5 sm:p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Plano Operação Digital</p>
                <p className="text-xs text-muted-foreground">Pagamento único</p>
              </div>
              <p className="shrink-0 font-display text-lg font-semibold tabular-nums">R$ 497,00</p>
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Método de pagamento
              </p>
              <div className="grid grid-cols-3 gap-2">
                {methods.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelected(id)}
                    aria-pressed={selected === id}
                    className={`relative flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs transition-colors ${
                      selected === id
                        ? "border-primary/60 text-foreground"
                        : "border-border text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {selected === id ? (
                      <motion.span
                        layoutId="checkout-method"
                        className="absolute inset-0 rounded-xl bg-primary/15"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    ) : null}
                    <Icon className="relative h-4 w-4" />
                    <span className="relative">{label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {methods.find((m) => m.id === selected)?.hint}
              </p>
            </div>

            <div className="mt-5 space-y-2.5">
              <MockField label="E-mail" value="cliente@empresa.com" />
              <div className="grid grid-cols-2 gap-2.5">
                <MockField label="CPF/CNPJ" value="000.000.000-00" />
                <MockField label="Telefone" value="(11) 90000-0000" />
              </div>
              {selected === "card" ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <MockField label="Número do cartão" value="•••• •••• •••• 4242" />
                  <MockField label="Validade / CVV" value="08/30 · •••" />
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01]"
            >
              Finalizar pagamento
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" />
              Dados transmitidos por conexão criptografada
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function MockField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/50 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="truncate text-sm text-foreground/80">{value}</p>
    </div>
  );
}
