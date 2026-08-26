import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { DashboardMock } from "./DashboardMock";
import heroVideo from "@/assets/hero-bg.mp4.asset.json";
import heroPoster from "@/assets/hero-poster.jpg.asset.json";

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="topo"
      className="relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 md:pb-24 md:pt-40"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {reduced ? (
          <img
            src={heroPoster.url}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            aria-hidden="true"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroPoster.url}
            src={heroVideo.url}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-background/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] tech-glow opacity-40" />
      <div className="pointer-events-none absolute inset-0 z-[1] tech-grid opacity-15 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
        <div>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Infraestrutura de pagamentos
          </motion.span>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl"
          >
            Sua operação de pagamentos. <span className="text-gradient-blue">Em um só lugar.</span>
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            O Cash Engine PRO conecta pagamentos, checkout, vendas, afiliados e gestão financeira em
            uma infraestrutura criada para negócios que vendem na internet.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Quero conhecer o Cash Engine PRO
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-transparent px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              <PlayCircle className="h-4 w-4" />
              Ver como funciona
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <DashboardMock />
        </motion.div>
      </div>
    </section>
  );
}
