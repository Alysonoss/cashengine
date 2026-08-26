import { Reveal, Section, SectionHeading } from "./primitives";

const products = [
  { name: "Operação Digital do Zero", category: "Negócios", price: "R$ 497,00", commission: "40%" },
  { name: "Mentoria de Escala", category: "Educação", price: "R$ 1.997,00", commission: "25%" },
  { name: "Checkout que Converte", category: "Marketing", price: "R$ 297,00", commission: "50%" },
  {
    name: "Gestão Financeira Digital",
    category: "Finanças",
    price: "R$ 697,00",
    commission: "30%",
  },
  { name: "Automação com API", category: "Tecnologia", price: "R$ 897,00", commission: "35%" },
  {
    name: "Rede de Afiliados na Prática",
    category: "Vendas",
    price: "R$ 397,00",
    commission: "45%",
  },
];

export function Marketplace() {
  return (
    <Section id="marketplace">
      <SectionHeading
        label="Ecossistema"
        title="Produtos para vender. Oportunidades para crescer."
        description="Um catálogo interno onde produtores publicam suas ofertas e afiliados encontram o que promover."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.05} className="h-full">
            <article className="surface-card flex h-full flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
              <span className="w-fit rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {p.category}
              </span>
              <h3 className="mt-4 text-base font-semibold leading-snug">{p.name}</h3>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Preço
                  </p>
                  <p className="truncate text-sm font-medium tabular-nums">{p.price}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Comissão
                  </p>
                  <p className="truncate text-sm font-medium text-primary-soft tabular-nums">
                    {p.commission}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="mt-5 w-full rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Promover
              </button>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Produtos exibidos apenas como demonstração da interface do marketplace.
        </p>
      </Reveal>
    </Section>
  );
}
