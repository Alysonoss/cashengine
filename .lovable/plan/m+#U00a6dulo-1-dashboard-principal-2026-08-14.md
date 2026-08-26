# Módulo 1 — Dashboard Principal

Construir a tela inicial de `/app` usando o layout, tokens claros e dados mockados já criados na Parte 1.

## Estrutura da tela

1. **Cabeçalho da página** — título "Visão geral", subtítulo com o período ativo (vindo do seletor da topbar) e ações rápidas (exportar, novo produto).
2. **Grid de KPIs** — 4 cards: Volume processado (R$), Vendas (qtd), Receita líquida (R$) e Taxa de aprovação (%). Cada card traz ícone discreto, valor grande, badge de variação (verde para alta, vermelho para queda) e um mini-sparkline SVG.
3. **Gráfico principal** — "Volume de vendas" em Recharts (área com gradiente azul), sem grade pesada: apenas linhas horizontais tênues, eixos sem borda, tooltip customizado com data, volume e nº de vendas. Toggle interno de período (Hoje, 7 dias, 30 dias, 90 dias) sincronizado com o seletor global da topbar.
4. **Duas seções lado a lado** (empilham no mobile):
   - **Últimas Transações** — ID, cliente, valor e status com badge colorido (Aprovada verde, Pendente âmbar, Recusada vermelha, Estornada cinza) + link "ver todas".
   - **Top Produtos** — nome, nº de vendas, receita e barra de participação relativa.

## Dados

Uso dos mocks existentes (`transactions`, `products`, `kpis`, `salesSeries`). A série será estendida no mock para cobrir os quatro períodos, com valores realistas em BRL e variação por dia da semana. Formatação de moeda e números em pt-BR.

## Detalhes técnicos

- `src/routes/app.index.tsx` passa a renderizar o novo `DashboardPage` (substitui o `ComingSoon`), mantendo o `head()` atual.
- Novos componentes em `src/components/app/dashboard/`: `KpiCard.tsx`, `SalesChart.tsx`, `RecentTransactions.tsx`, `TopProducts.tsx`, `DashboardPage.tsx`.
- Recharts já está instalado; gráfico dentro de `ResponsiveContainer` e renderizado apenas após hidratação para evitar mismatch de SSR.
- Animações de entrada leves com `motion/react` (fade + subida curta, escalonadas), respeitando `prefers-reduced-motion`.
- Cores, sombras e raios vêm dos tokens do tema claro `.app-light`; nada de classes de cor fixas.
- Helpers de formatação (`formatBRL`, `formatInt`, `formatPct`) em `src/lib/format.ts` para reuso nos próximos módulos.
