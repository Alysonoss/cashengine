import { ArrowRight } from "lucide-react";
import { Reveal } from "./primitives";

export function FinalCta() {
  return (
    <section
      id="comecar"
      className="relative scroll-mt-20 overflow-hidden bg-surface-strong px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 tech-glow opacity-60" />
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20" />
      <div className="relative mx-auto w-full max-w-4xl text-center">
        <Reveal>
          <h2 className="text-3xl font-semibold leading-[1.08] sm:text-5xl md:text-6xl">
            Pronto para colocar sua operação{" "}
            <span className="text-gradient-blue">em outro nível?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground">
            Centralize pagamentos, checkout, afiliados e financeiro em uma única infraestrutura.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Começar agora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#recursos"
              className="inline-flex items-center justify-center rounded-xl border border-border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-surface"
            >
              Conhecer a plataforma
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
