import { Check, Minus } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

const rows = [
  "Pagamentos e checkout no mesmo fluxo",
  "Comissões calculadas junto da transação",
  "Split entre participantes por venda",
  "Rede de afiliados integrada ao catálogo",
  "Extrato e repasses na mesma base de dados",
  "API e webhooks sobre toda a operação",
];

export function Comparison() {
  return (
    <Section>
      <SectionHeading
        label="Diferencial"
        title="Ferramenta isolada não é infraestrutura."
        description="A diferença não está em ter mais recursos, e sim em ter os recursos conectados."
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-2">
        <Reveal className="h-full">
          <div className="h-full rounded-2xl border border-border bg-surface/30 p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">
              Ferramenta isolada
            </p>
            <ul className="mt-5 space-y-3">
              {rows.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="h-full">
          <div className="surface-card h-full rounded-2xl border-primary/40 p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-primary-soft">Cash Engine PRO</p>
            <ul className="mt-5 space-y-3">
              {rows.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-soft" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export function PricingPlaceholder() {
  return (
    <Section id="planos">
      <SectionHeading
        label="Planos e taxas"
        title="Estrutura de planos em definição."
        description="O espaço para condições comerciais já faz parte da plataforma e será publicado em breve."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {["Essencial", "Operação", "Escala"].map((plan, i) => (
          <Reveal key={plan} delay={i * 0.07} className="h-full">
            <div className="surface-card flex h-full flex-col rounded-2xl p-6">
              <p className="font-display text-base font-semibold">{plan}</p>
              <div className="mt-6 space-y-2">
                <div className="h-7 w-2/3 rounded-md bg-muted/60" />
                <div className="h-3 w-1/2 rounded-md bg-muted/40" />
              </div>
              <div className="mt-6 space-y-2">
                {[0, 1, 2].map((n) => (
                  <div key={n} className="h-3 w-full rounded-md bg-muted/30" />
                ))}
              </div>
              <p className="mt-6 text-xs text-muted-foreground">Condições em breve.</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
