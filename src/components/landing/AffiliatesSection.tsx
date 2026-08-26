import { Counter } from "./Counter";
import { Link2, MousePointerClick, Package, TrendingUp } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

const steps = [
  {
    title: "Afiliado se cadastra",
    text: "Acesso ao painel e aos produtos liberados para divulgação.",
  },
  { title: "Gera o link", text: "Cada divulgação recebe um link rastreável e único." },
  { title: "Venda acontece", text: "A origem da venda é registrada na própria transação." },
  {
    title: "Comissão calculada",
    text: "Regras aplicadas automaticamente e refletidas no financeiro.",
  },
];

export function AffiliatesSection() {
  return (
    <Section id="afiliados" dark>
      <SectionHeading
        label="Para afiliados"
        title="Transforme sua operação em uma rede de vendas."
        description="Divulgação, rastreio e comissionamento acontecem dentro da mesma infraestrutura que processa o pagamento."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="space-y-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07}>
              <div className="surface-card grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-2xl p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 font-display text-sm font-semibold text-primary-soft">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="surface-card rounded-2xl p-5 sm:p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <p className="min-w-0 truncate font-display text-base font-semibold">
                Painel do afiliado
              </p>
              <span className="shrink-0 rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
                últimos 7 dias
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <Stat icon={<MousePointerClick className="h-4 w-4" />} label="Cliques" end={4820} />
              <Stat
                icon={<TrendingUp className="h-4 w-4" />}
                label="Conversão"
                end={5.9}
                decimals={1}
                suffix="%"
              />
              <Stat icon={<Package className="h-4 w-4" />} label="Produtos" end={12} />
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Links de divulgação
              </p>
              {["curso-operacao-digital", "mentoria-escala", "ebook-checkout"].map((slug) => (
                <div
                  key={slug}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-surface/50 px-3 py-2.5"
                >
                  <Link2 className="h-4 w-4 shrink-0 text-primary-soft" />
                  <span className="min-w-0 truncate text-xs text-muted-foreground">
                    cashenginepro.app/r/{slug}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">copiar</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Stat({
  icon,
  label,
  end,
  decimals = 0,
  suffix = "",
}: {
  icon: React.ReactNode;
  label: string;
  end: number;
  decimals?: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 p-3">
      <span className="text-primary-soft">{icon}</span>
      <p className="mt-2 font-display text-lg font-semibold tabular-nums">
        <Counter end={end} decimals={decimals} suffix={suffix} />
      </p>
      <p className="truncate text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
