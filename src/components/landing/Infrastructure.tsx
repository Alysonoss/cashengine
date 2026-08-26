import {
  Activity,
  Code2,
  FileSearch,
  KeyRound,
  ShieldCheck,
  Webhook,
  Workflow,
} from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

const tech = [
  {
    icon: Code2,
    title: "API",
    text: "Endpoints para integrar produtos, vendas e participantes ao seu sistema.",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    text: "Eventos enviados em tempo real para acionar suas automações.",
  },
  {
    icon: Workflow,
    title: "Automação",
    text: "Fluxos que reagem a status de pagamento sem intervenção manual.",
  },
  {
    icon: Activity,
    title: "Rastreamento",
    text: "Origem, etapa e status registrados em cada transação.",
  },
];

const security = [
  {
    icon: KeyRound,
    title: "Controle de acesso",
    text: "Permissões por perfil dentro da operação.",
  },
  {
    icon: ShieldCheck,
    title: "Autenticação",
    text: "Sessões protegidas e credenciais gerenciadas.",
  },
  {
    icon: FileSearch,
    title: "Logs e auditoria",
    text: "Histórico de ações e eventos para consulta.",
  },
];

export function Infrastructure() {
  return (
    <div className="relative overflow-hidden bg-surface-strong">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 tech-glow opacity-40" />
      <Section className="relative">
        <SectionHeading
          label="Infraestrutura"
          title="Tecnologia que sustenta a operação."
          description="A plataforma foi construída para ser integrada, observada e auditada — não apenas usada."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tech.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.06} className="h-full">
              <div className="surface-card h-full rounded-2xl p-5">
                <Icon className="h-5 w-5 text-primary-soft" />
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {security.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.06} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-background/40 p-5">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-primary-soft" />
                  <h3 className="truncate text-sm font-semibold">{title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}
