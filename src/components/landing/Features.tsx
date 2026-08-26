import {
  BarChart3,
  Code2,
  CreditCard,
  LayoutDashboard,
  Percent,
  ShoppingCart,
  Split,
  Users,
} from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

const features = [
  {
    icon: CreditCard,
    title: "Pagamentos",
    text: "Processamento de transações com métodos e status acompanhados em tempo real.",
  },
  {
    icon: ShoppingCart,
    title: "Checkout",
    text: "Páginas de pagamento rápidas, responsivas e configuráveis por produto.",
  },
  {
    icon: BarChart3,
    title: "Gestão de vendas",
    text: "Pedidos, clientes e histórico organizados em uma base única.",
  },
  {
    icon: Users,
    title: "Afiliados",
    text: "Cadastro, links de divulgação e acompanhamento de performance.",
  },
  {
    icon: Percent,
    title: "Comissões",
    text: "Regras por produto, cálculo automático e histórico auditável.",
  },
  {
    icon: Split,
    title: "Split",
    text: "Divisão de valores entre participantes definida na própria transação.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    text: "Indicadores da operação reunidos em uma visão só.",
  },
  {
    icon: Code2,
    title: "API",
    text: "Endpoints e webhooks para integrar o Cash Engine PRO ao seu sistema.",
  },
];

export function Features() {
  return (
    <Section id="recursos" dark>
      <SectionHeading
        label="Recursos"
        title="Tudo conectado em uma única plataforma."
        description="Módulos que funcionam juntos por padrão, sem integrações improvisadas entre ferramentas diferentes."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.05} className="h-full">
            <div className="group surface-card h-full rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-primary-soft transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
