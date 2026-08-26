# Cash Engine TESTE v6 — Produtos/Checkouts + Equipe funcional

## Produtos e Checkouts agrupados

- O item `Checkouts` foi removido da navegação lateral.
- O item `Produtos` passa a representar as rotas `/app/produtos` e `/app/checkouts`.
- As duas páginas receberam navegação interna com as abas `Produtos` e `Checkouts`, seguindo o mesmo padrão visual usado em `Saldo`.
- As rotas antigas foram preservadas, portanto links existentes continuam funcionando.

## Equipe funcional no modo TESTE

A página `Configurações > Equipe` deixou de ser somente visual e agora possui estado persistente no navegador.

Funções implementadas:

- criar convite de membro com nome, e-mail e função;
- validação de e-mail e duplicidade;
- editar a função de um membro;
- reenviar convite pendente no modo TESTE;
- ativar e desativar membros;
- cancelar convites;
- remover membros;
- proteger o `Owner / Fundador` contra remoção, desativação e troca de função;
- busca por nome, e-mail ou função;
- cards com totais de ativos, pendentes e inativos;
- persistência em `localStorage` pela chave `cash-engine-test-team-v1`.

O envio real de e-mail ainda não foi ativado, porque o projeto continua sem integração do frontend com Supabase ou provedor de e-mail. A interface não finge que o e-mail foi enviado: o convite é registrado localmente como `convite_pendente`.

## Banco / Supabase

Foi verificada a compatibilidade com as tabelas já existentes:

- `equipe_membros`
- `invites`
- `roles`
- `profile_roles`
- `produtos`
- `checkouts`

As tabelas de equipe já possuem políticas RLS de leitura e escrita por tenant e o schema atual cobre os dados necessários para a futura integração. Como esta versão não adicionou nenhum novo dado persistente de produção, nenhuma alteração de schema foi necessária no Supabase.
