# Cash Engine TESTE Pix

## Entrega

- Dashboard funcional com métricas derivadas de pagamentos TESTE.
- Links de pagamento Pix compartilháveis.
- Checkout público premium com robô, QR Code e Pix Copia e Cola.
- Chave Pix configurável por ambiente.
- Gerador de BR Code Pix e QR Code sem dependência externa adicional.
- API `POST /api/pix`.
- Ponte autenticada `POST /api/pix/webhook` com HMAC para encaminhamento.
- Transações, webhooks e admin ligados ao fluxo TESTE.
- Admin e autenticação existentes preservados.

## Importante

O QR Code é funcional para direcionar um Pix à chave configurada. A confirmação automática de pagamento exige um banco/PSP/adaptador que confirme a liquidação. O modo TESTE não falsifica essa capacidade: ele fornece confirmação manual para UI e uma ponte de webhook pronta para receber a confirmação real quando esse componente existir.

## Atualização: links do produtor e pagamentos

- Botão **Criar link Pix** agora abre um formulário funcional na dashboard de links.
- O produtor pode selecionar um produto existente ou informar um produto personalizado.
- O link gerado pode ser copiado, aberto, compartilhado pelo navegador ou exportado em `.txt`.
- Cada link carrega produto, valor, descrição e produtor no token do checkout TESTE.
- Nova aba **Pagamentos Pix** em `/app/pagamentos`.
- A aba exibe cobranças geradas no checkout, pagas, pendentes, volume pago e dados do cliente.
- Pagamentos pendentes podem ser marcados com **Confirmar TESTE** para simular a futura confirmação do banco/PSP.
- Exportação CSV dos pagamentos TESTE.
- A dashboard principal ganhou atalho para **Criar link Pix**.

### Uso local e compartilhamento

Em `localhost`, o link é válido para testar o checkout na própria máquina ou na rede local. Para enviar o link pela internet, o projeto precisa estar acessível por um domínio, hospedagem ou túnel temporário. Quando isso acontecer, os botões de copiar e compartilhar usam automaticamente a origem pública do site.

