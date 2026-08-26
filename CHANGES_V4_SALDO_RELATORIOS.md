# Cash Engine TESTE Pix v4 - Saldo + Extrato e relatórios PDF

## Financeiro

- O item `Extrato` foi removido da barra lateral.
- `Saldo` passou a ser o ponto único de acesso para saldo e extrato.
- As telas `/app/saldo` e `/app/extrato` agora exibem abas internas `Saldo` e `Extrato`.
- O item `Saldo` permanece destacado na barra lateral mesmo quando a aba de extrato está aberta.
- As rotas antigas foram mantidas para não quebrar links existentes.

## Relatórios em PDF

Foi adicionado download real de PDF nos quatro relatórios da plataforma:

1. Relatório de Vendas
2. Relatório Financeiro
3. Relatório de Afiliados
4. Relatório de Produtos

Os PDFs incluem:

- título e identificação Cash Engine PRO;
- período e filtros selecionados;
- indicadores principais (KPIs);
- tabela com os dados do relatório;
- paginação automática;
- data/hora da geração;
- múltiplas páginas quando necessário.

A geração é feita diretamente no navegador, sem biblioteca externa e sem enviar os dados para outro serviço.

## Arquivos principais

- `src/components/app/nav-config.ts`
- `src/components/app/Sidebar.tsx`
- `src/components/app/finance/BalanceStatementTabs.tsx`
- `src/components/app/finance/BalancePage.tsx`
- `src/components/app/finance/StatementPage.tsx`
- `src/components/app/reports/SalesReportPage.tsx`
- `src/components/app/reports/FinanceReportPage.tsx`
- `src/components/app/reports/AffiliateReportPage.tsx`
- `src/components/app/reports/ProductReportPage.tsx`
- `src/lib/report-pdf.ts`
