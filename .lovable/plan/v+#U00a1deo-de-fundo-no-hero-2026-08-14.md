# Vídeo de fundo no hero

Usar o vídeo enviado como plano de fundo da primeira dobra da landing, mantendo o restante da página no fundo preto atual.

## O que muda

- O hero passa a ter o vídeo em loop, mudo, com autoplay, cobrindo toda a seção (`object-cover`).
- Sobre o vídeo: uma camada escura + o halo azul e a malha tecnológica já existentes, para o texto continuar legível e a identidade não mudar.
- Título, subtítulo, botões e o mockup do dashboard permanecem exatamente como estão, apenas acima do vídeo.
- Em telas pequenas o vídeo continua funcionando; se o usuário tiver "reduzir movimento" ativado, exibimos apenas o primeiro quadro estático em vez do vídeo em movimento.

## Detalhes técnicos

- Enviar `27725-365890983_medium.mp4` para o CDN via `lovable-assets`, gerando `src/assets/hero-bg.mp4.asset.json` (o binário não entra no repositório).
- Gerar também um pôster JPG do primeiro quadro (via ffmpeg) e subir como asset, usado em `poster` e como fallback com movimento reduzido.
- Editar apenas `src/components/landing/Hero.tsx`: adicionar `<video autoPlay muted loop playsInline preload="metadata">` como camada absoluta atrás do conteúdo, com `aria-hidden` e overlay `bg-background/70` + gradiente para o fundo preto da próxima seção.
- Sem novas dependências, sem mudanças de backend.
