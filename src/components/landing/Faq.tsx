import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading, Reveal } from "./primitives";

const faqs = [
  {
    q: "O que é o Cash Engine PRO?",
    a: "É uma infraestrutura de pagamentos para negócios digitais que reúne processamento, checkout, gestão de vendas, afiliados e financeiro em uma única plataforma.",
  },
  {
    q: "Para quem a plataforma foi criada?",
    a: "Para produtores, negócios digitais e operações que vendem pela internet e precisam centralizar pagamento, comissionamento e acompanhamento em um só lugar.",
  },
  {
    q: "Como funciona o checkout?",
    a: "Você configura os produtos, os métodos de pagamento aceitos e as regras da venda. O checkout é responsivo e o status de cada transação aparece no painel.",
  },
  {
    q: "Como funciona o módulo de afiliados?",
    a: "Afiliados acessam os produtos liberados, geram links rastreáveis e acompanham cliques, conversões e comissões. As regras de comissão são aplicadas na própria transação.",
  },
  {
    q: "O que é o split de pagamentos?",
    a: "É a divisão automática do valor de uma venda entre os participantes definidos — produtor, co-produtor, afiliado e taxas —, com histórico de cada repasse.",
  },
  {
    q: "É possível integrar com meus sistemas?",
    a: "Sim. A plataforma expõe API e webhooks para sincronizar dados e acionar automações a partir dos eventos da operação.",
  },
  {
    q: "Quais são os planos e taxas?",
    a: "As condições comerciais estão em definição e serão publicadas nesta página assim que disponíveis.",
  },
];

export function Faq() {
  return (
    <Section id="faq">
      <SectionHeading label="FAQ" title="Perguntas frequentes" />
      <Reveal className="mt-12">
        <Accordion type="single" collapsible className="mx-auto w-full max-w-3xl">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Section>
  );
}
