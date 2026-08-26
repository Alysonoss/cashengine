import { Zap } from "lucide-react";

const columns = [
  {
    title: "Plataforma",
    links: [
      { label: "Solução", href: "#solucao" },
      { label: "Recursos", href: "#recursos" },
      { label: "Checkout", href: "#negocios" },
      { label: "Marketplace", href: "#marketplace" },
    ],
  },
  {
    title: "Operação",
    links: [
      { label: "Para Afiliados", href: "#afiliados" },
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Planos e taxas", href: "#planos" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de Uso", href: "#" },
      { label: "Política de Privacidade", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-5 py-14 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div>
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" />
              </span>
              <span className="truncate font-display text-sm font-semibold uppercase tracking-[0.14em]">
                Cash Engine <span className="text-primary-soft">PRO</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Infraestrutura de pagamentos para negócios que vendem na internet.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © 2026 Cash Engine PRO. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
