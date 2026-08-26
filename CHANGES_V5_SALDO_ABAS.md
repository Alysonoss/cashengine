# Cash Engine TESTE v5 — Financeiro agrupado em Saldo

Nesta versão, o menu lateral **Financeiro** foi simplificado.

## Alterações

- **Saques** deixou de aparecer como item separado no menu lateral.
- **Estornos** deixou de aparecer como item separado no menu lateral.
- A opção **Saldo** agora agrupa quatro áreas por abas internas:
  - Saldo
  - Extrato
  - Saques
  - Estornos
- Ao acessar qualquer uma dessas quatro rotas, **Saldo** permanece destacado no menu lateral.
- As rotas existentes foram preservadas para não quebrar links:
  - `/app/saldo`
  - `/app/extrato`
  - `/app/saques`
  - `/app/estornos`
- As páginas de Saques e Estornos agora exibem a mesma navegação interna usada por Saldo e Extrato.

## Banco de dados

Esta mudança é apenas de navegação/interface. As tabelas `saldos`, `saques` e `estornos` já existem no schema do projeto, portanto não foi necessária alteração estrutural no Supabase.
