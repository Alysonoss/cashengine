# Alterações: modo escuro + checkout simplificado

## Modo claro/escuro
- Adicionado botão de alternância no topo da área logada.
- Lua crescente indica a ação de ativar o modo escuro.
- Sol indica a ação de voltar ao modo claro.
- A preferência fica salva em `localStorage` com a chave `cash-engine-theme`.
- O tema é aplicado a toda a área `/app`, incluindo dashboard, produtos, links e pagamentos.

Arquivos principais:
- `src/components/app/app-shell-context.tsx`
- `src/components/app/Topbar.tsx`
- `src/routes/app.tsx`
- `src/styles.css`

## Checkout Pix
- Redesenhado `src/routes/pay.$code.tsx` para um layout compacto e claro, inspirado na referência enviada.
- Campos: nome, e-mail, celular e CPF/CNPJ.
- PIX selecionado como forma disponível.
- Cartão de crédito aparece apenas como opção desabilitada/"Em breve".
- Resumo do pedido com taxa de serviço em R$ 0,00 para não alterar o valor do link.
- Após gerar, o checkout mostra QR Code, valor, referência e botão para copiar o código Pix.
- A lógica anterior de geração Pix e registro em Pagamentos Pix foi preservada.
