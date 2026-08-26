# Parte 4 — Produtos & Checkout Builder, Financeiro e Developers

Última etapa da V1 da plataforma interna. Substitui os placeholders "Em construção" de `/app/produtos`, `/app/saldo`, `/app/extrato`, `/app/api` e `/app/logs` por telas reais, reaproveitando o tema claro, os mocks e os helpers de formatação já existentes.

## 1. Produtos e Checkout Builder (`/app/produtos`)

- Listagem em cards/tabela: nome, preço, comissão, vendas, receita e badge de status (ativo, pausado, rascunho), com busca e filtro por status.
- Botão "Novo produto" e ação "Editar checkout" abrem o **Checkout Builder** em tela dividida:
  - **Painel esquerdo (configuração):** nome do produto, preço, parcelamento, comissão de afiliado (%), métodos de pagamento aceitos, Order Bump (título, preço, ativar/desativar), cor de destaque e campos do formulário.
  - **Centro (preview ao vivo):** simulação da tela de pagamento — resumo do pedido, seletor Pix/Cartão/Boleto, campos de dados, order bump destacado e botão de compra. Atualiza em tempo real conforme o painel muda; barra de resumo mostra o que o produtor recebe por venda (usando o mesmo cálculo de split da Parte 3).
- Estado vazio elegante quando a busca não retorna produtos.

## 2. Financeiro — Saldo e Extrato (`/app/saldo` e `/app/extrato`)

- Três cards no topo: **Saldo disponível**, **Pendente (a liberar)** e **Reservado/Segurança**, com microtexto explicativo e sparkline leve.
- Botão forte "Solicitar saque" abrindo um diálogo: valor, conta bancária de destino, taxa e valor líquido, com confirmação e toast de sucesso (mock).
- Tabela de extrato: data, descrição, tipo (crédito/débito), categoria (venda, taxa, comissão, saque, estorno) e valor com cor semântica; filtros por tipo e período, além de saldo acumulado por linha.
- `/app/extrato` reutiliza a mesma tabela em versão completa e paginada.

## 3. Developers — API e Logs (`/app/api` e `/app/logs`)

- **API:** chaves pública e secreta por ambiente (teste e produção) exibidas mascaradas (`pk_test_••••••••`), com botão de mostrar/ocultar, copiar (com feedback) e "Rotacionar chave". Bloco com exemplo de requisição cURL e link para webhooks.
- **Logs:** tabela de auditoria com Quem (ator + avatar de iniciais), Ação, Quando (data/hora relativa) e Resultado (badge sucesso/falha), com busca e filtro por resultado.

## 4. Loading e Empty States

- Componentes reutilizáveis `Skeleton` (linhas de tabela e cards) e `EmptyState` (ícone, título, descrição e ação opcional) em `src/components/app/`.
- Cada página simula um carregamento curto na montagem para exibir os skeletons, e mostra o empty state quando os filtros zeram os resultados.

## Detalhes técnicos

- Novos componentes em `src/components/app/products/`, `src/components/app/finance/` e `src/components/app/developers/`; as rotas passam a renderizar essas páginas no lugar de `ComingSoon`.
- Mocks adicionais em `src/lib/mock/finance.ts` (saldos, extrato com saldo acumulado, saques) e `src/lib/mock/developers.ts` (chaves e logs de auditoria), sempre determinísticos para não quebrar a hidratação SSR.
- Reuso de `formatBRL`, `formatInt`, `formatPct` e `formatDateTime` de `src/lib/format.ts`, e do cálculo de split já criado na Parte 3.
- shadcn (`Dialog`, `Sheet`, `Tabs`, `Switch`, `Slider`, `Table`, `Badge`) e animações com `motion/react`; sonner para toasts.
- Cada rota mantém `head()` próprio com título, descrição e `robots: noindex`.
- Tudo em mock, sem backend nesta fase.
