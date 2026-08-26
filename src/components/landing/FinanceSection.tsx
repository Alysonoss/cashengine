import { motion, useReducedMotion } from "motion/react";
import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

const entries = [
  { label: "Venda aprovada · Pix", value: "+ R$ 497,00", positive: true },
  { label: "Comissão de afiliado", value: "- R$ 198,80", positive: false },
  { label: "Venda aprovada · Cartão", value: "+ R$ 1.997,00", positive: true },
  { label: "Repasse programado", value: "- R$ 1.240,00", positive: false },
];

const split = [
  { label: "Produtor", pct: 55 },
  { label: "Afiliado", pct: 30 },
  { label: "Co-produtor", pct: 10 },
  { label: "Taxas", pct: 5 },
];

export function FinanceSection() {
  const reduced = useReducedMotion();

  return (
    <Section dark>
      <SectionHeading
        label="Dashboard & Financeiro"
        title="Seus números. Sem complicação."
        description="Extrato, repasses e divisão de valores no mesmo lugar em que a venda foi processada."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <Reveal className="h-full">
          <div className="surface-card h-full rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Receipt className="h-4 w-4 text-primary-soft" />
              Extrato da operação
            </div>
            <ul className="mt-5 space-y-2">
              {entries.map((e, i) => (
                <motion.li
                  key={e.label}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-surface/50 px-3 py-3"
                >
                  {e.positive ? (
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="min-w-0 truncate text-sm text-muted-foreground">{e.label}</span>
                  <span
                    className={`shrink-0 text-sm tabular-nums ${
                      e.positive ? "text-success" : "text-foreground/70"
                    }`}
                  >
                    {e.value}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="h-full">
          <div className="surface-card h-full rounded-2xl p-5 sm:p-6">
            <p className="font-display text-base font-semibold">
              Cada venda. Cada participante. Cada valor.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              O split define a divisão no momento da transação, com histórico de quem recebeu o quê.
            </p>

            <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full border border-border">
              {split.map((s, i) => (
                <motion.span
                  key={s.label}
                  initial={reduced ? false : { width: 0 }}
                  whileInView={{ width: `${s.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: "easeOut" }}
                  className={
                    ["bg-primary", "bg-primary-soft", "bg-chart-3", "bg-muted-foreground/40"][i]
                  }
                />
              ))}
            </div>

            <ul className="mt-5 space-y-2">
              {split.map((s, i) => (
                <li
                  key={s.label}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 text-sm"
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      ["bg-primary", "bg-primary-soft", "bg-chart-3", "bg-muted-foreground/40"][i]
                    }`}
                  />
                  <span className="min-w-0 truncate text-muted-foreground">{s.label}</span>
                  <span className="shrink-0 tabular-nums">{s.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
