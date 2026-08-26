import { Reveal, Section, SectionHeading } from "./primitives";

const steps = [
  {
    title: "Cadastre sua operação",
    text: "Crie sua conta, configure seus produtos e defina as regras do seu negócio.",
  },
  {
    title: "Configure seu checkout",
    text: "Escolha métodos de pagamento, comissões e participantes do split.",
  },
  {
    title: "Comece a vender",
    text: "Publique seus links, ative afiliados e receba as transações na plataforma.",
  },
  {
    title: "Acompanhe tudo",
    text: "Vendas, comissões, repasses e indicadores em um painel único.",
  },
];

export function HowItWorks() {
  return (
    <Section id="como-funciona">
      <SectionHeading label="Como funciona" title="Quatro passos até a operação rodando." />

      <div className="relative mt-14">
        <div className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-border lg:left-0 lg:top-9 lg:h-px lg:w-full lg:block" />
        <div className="grid gap-4 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="h-full">
              <div className="surface-card relative h-full rounded-2xl p-5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
