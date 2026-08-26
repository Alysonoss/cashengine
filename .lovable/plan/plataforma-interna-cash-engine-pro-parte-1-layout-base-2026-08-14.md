# Plataforma interna Cash Engine PRO — Parte 1: layout base

Construir a fundação da área logada: tema claro, layout com sidebar + topbar e navegação completa. As Partes 2 a 4 (Dashboard, Transações/Split, Produtos/Financeiro/Developers) entram depois, uma de cada vez.

## Decisão importante: dois temas no mesmo app

A landing atual é escura (preto + azul elétrico). A plataforma interna pedida é clara (branco / slate-50 + azul profundo). Em vez de trocar os tokens globais (o que quebraria a landing), a área interna vive sob uma classe de escopo `app-light` com sua própria paleta de tokens semânticos em `src/styles.css`. A landing continua exatamente como está.

## Rotas criadas nesta parte

```text
/app                -> layout (sidebar + topbar) com <Outlet />
/app/               -> Dashboard (placeholder nesta parte)
```

Todos os itens de menu apontam para rotas reais. Nesta parte, as páginas ainda não construídas usam um componente de "em breve" elegante (título, descrição, ilustração leve), para que nenhum link fique quebrado. Rotas: transações, produtos, checkouts, links de pagamento, clientes, afiliados, marketplace, comissões, links, saldo, extrato, saques, repasses, estornos, chargebacks, taxas, api, webhooks, logs, relatórios e configurações.

## Sidebar

- Topo: marca "CASH ENGINE PRO" em tipografia forte e compacta.
- Grupos com rótulo em caixa alta e tracking largo: Visão geral, Vendas, Afiliados, Financeiro, Desenvolvedores, Relatórios, Configurações.
- Item ativo: fundo azul suave, texto azul profundo, barra fina à esquerda; ícone Lucide de 16px alinhado.
- Rodapé: avatar com iniciais, "Kelvin" + "Administrador", ícones de engrenagem e sair.
- Mobile: colapsa em hamburger; painel desliza da esquerda com Framer Motion (`motion/react`, já instalado) e overlay que fecha ao clicar. Fecha automaticamente ao navegar.

## Topbar

- Busca global com atalho visual (⌘K) — "Buscar transação, cliente, produto...".
- Seletor de período (Hoje, 7, 30, 90 dias) como dropdown com estado.
- Sino de notificações com badge de não lidos e ícone de ajuda.
- Seletor de visão de permissão (Super Admin / Produtor / Afiliado) — estado global de protótipo que, nas próximas partes, filtra o que cada perfil enxerga.

## Dados mockados

`src/lib/mock/` com dados ricos (transações, produtos, clientes, afiliados, extrato, logs) — 15 a 20 itens por coleção, valores em BRL e datas coerentes. Nesta parte só a navegação os consome; as próximas partes reutilizam a mesma fonte.

## Detalhes técnicos

- `src/routes/app.tsx` como rota de layout renderizando `<Outlet />`; páginas em `src/routes/app.*.tsx`.
- Componentes em `src/components/app/`: `Sidebar.tsx`, `Topbar.tsx`, `NavItem.tsx`, `UserMenu.tsx`, `PeriodSelector.tsx`, `RoleSwitcher.tsx`, `ComingSoon.tsx`.
- Contexto leve em `src/components/app/app-shell-context.tsx` para período e perfil ativo.
- Tokens claros (`--app-bg`, `--app-surface`, `--app-border`, `--app-primary`, etc.) mapeados em `@theme inline`; nada de classes de cor cruas nos componentes.
- Tipografia da área interna: Inter, carregada via `<link>` no head raiz junto às fontes existentes.
- `head()` próprio em cada rota, com título e descrição específicos e `robots: noindex` para a área logada.
- Sem backend nesta fase: tudo é mock em memória.
