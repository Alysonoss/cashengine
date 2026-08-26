# Cash Engine PRO — Landing Page

Landing page única em português, estética fintech premium (preto profundo, azul vibrante, branco), animada e mobile-first.

## Direção visual

- Paleta: fundo preto/near-black, azul elétrico como cor de ação, branco/cinza para leitura. Tudo via tokens semânticos em `src/styles.css` (oklch), sem cores hardcoded.
- Tipografia: display geométrica para títulos + sans neutra para texto, carregada por `<link>` no `__root.tsx`.
- Fundo tecnológico sutil: camada de gradiente fluido escuro + grid/partículas leves em CSS/SVG, sem prejudicar leitura.
- Sem emojis, sem gradientes saturados, sem linguagem de "dinheiro fácil".

## Estrutura da página (rota `/`)

1. Header sticky: logo CASH ENGINE PRO, menu (Solução, Recursos, Para Afiliados, Para Negócios, Como funciona, FAQ), CTA "Começar agora", menu hamburger no mobile.
2. Hero: headline "Sua operação de pagamentos. Em um só lugar.", subheadline, CTA primário + secundário, mockup de dashboard vivo com números animados (contagem a partir de zero) e gráfico SVG desenhado na entrada.
3. Trust bar: mensagem curta + indicadores Pagamentos, Checkout, Afiliados, Financeiro, Analytics (sem números fictícios de clientes).
4. Problema vs. Solução: caos de ferramentas fragmentadas vs. diagrama animado Cliente → Checkout → Cash Engine PRO → Pagamento → Venda → Comissão/Financeiro.
5. Grid de recursos: 8 cards (Pagamentos, Checkout, Gestão de vendas, Afiliados, Comissões, Split, Dashboard, API) com hover sutil.
6. Seções de foco com mockups: Checkout (seleção Pix/cartão interativa), Afiliados (painel com links, produtos, conversão), Marketplace (cards de produto com categoria, preço, comissão, botão "Promover"), Dashboard & Financeiro (extratos, repasses, visual de Split).
7. Como funciona: 4 passos escalonados.
8. Infraestrutura e segurança: fundo preto profundo, APIs/webhooks/automação/rastreamento e controle de acesso, autenticação, logs, auditoria — sem claims não comprováveis.
9. Diferencial e conversão: comparativo lado a lado, bloco de planos/taxas estrutural sem valores, CTA final imponente.
10. FAQ em accordion animado + footer em colunas com Termos, Privacidade e copyright 2026.

## Detalhes técnicos

- Rota única reescrevendo `src/routes/index.tsx` (substitui o placeholder), com `head()` próprio: title, description, og:title, og:description, og:type, twitter:card.
- Componentes em `src/components/landing/*` (um arquivo por seção) para manter os arquivos pequenos.
- Dependências a instalar: `framer-motion` (motion), `react-countup`. `lucide-react` já disponível; accordion via shadcn `Accordion` (adicionar componente se ausente).
- Animações: entradas com `whileInView`/`viewport once`, respeitando `prefers-reduced-motion`; gráficos SVG animados por `pathLength`.
- Responsividade: grids em duas/três colunas no desktop degradando para cards empilhados; linhas com texto + widget usam `grid-cols-[minmax(0,1fr)_auto]` + `min-w-0`.
- Sem backend: conteúdo estático, nenhum dado real ou jurídico inventado.
