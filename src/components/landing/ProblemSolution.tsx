import { motion, useReducedMotion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

const chaos = [
  "Gateway de pagamento",
  "Plataforma de checkout",
  "Planilha de comissões",
  "Controle de afiliados",
  "Relatórios manuais",
  "Conciliação financeira",
];

const flow = [
  "Cliente",
  "Checkout",
  "Cash Engine PRO",
  "Pagamento",
  "Venda",
  "Comissão / Financeiro",
];

export function ProblemSolution() {
  const reduced = useReducedMotion();

  return (
    <Section id="solucao">
      <SectionHeading
        label="Visão sistêmica"
        title="Vender online não deveria ser complicado."
        description="Operações digitais costumam ser montadas com ferramentas soltas que não conversam entre si. O resultado é retrabalho, dados espalhados e decisões tomadas no escuro."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <Reveal className="h-full">
          <div className="surface-card h-full rounded-2xl p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Operação fragmentada
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {chaos.map((item, i) => (
                <motion.div
                  key={item}
                  initial={reduced ? false : { opacity: 0, rotate: 0 }}
                  whileInView={{ opacity: 1, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="rounded-lg border border-dashed border-border bg-surface/40 px-3 py-4 text-xs text-muted-foreground"
                >
                  {item}
                </motion.div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Cada ferramenta com seu próprio painel, seu próprio dado e sua própria exportação.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="h-full">
          <div className="surface-card relative h-full overflow-hidden rounded-2xl p-6">
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-30" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Uma infraestrutura. Toda a sua operação.
              </div>

              <ol className="mt-6 space-y-2">
                {flow.map((step, i) => (
                  <motion.li
                    key={step}
                    initial={reduced ? false : { opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                      step === "Cash Engine PRO"
                        ? "border-primary/50 bg-primary/15 font-medium text-foreground"
                        : "border-border bg-surface/50 text-muted-foreground"
                    }`}
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-border text-[11px] tabular-nums">
                      {i + 1}
                    </span>
                    <span className="min-w-0 truncate">{step}</span>
                  </motion.li>
                ))}
              </ol>

              <p className="mt-6 text-sm text-muted-foreground">
                O fluxo inteiro converge para um único lugar — do clique do cliente ao repasse do
                participante.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
