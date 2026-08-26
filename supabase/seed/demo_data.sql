-- ==========================================================================
-- SEED DE DADOS DE EXEMPLO (DEMO)
-- Cash Engine PRO
-- ==========================================================================
-- Este arquivo cria dados de exemplo POPULADOS para demonstração.
-- Rode APENAS se deseja dados fictícios em ambiente de homologação.
-- NÃO USE em produção!
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. EMPRESA DEMO + PROFILE DEMO (SOMENTE SE NÃO EXISTIR AUTH.USERS PRÉ-CRIADO)
--    Esses IDs são placeholders. No Supabase real, o auth.users é criado pelo
--    sistema de autenticação.
-- --------------------------------------------------------------------------

-- Cria empresa demo
INSERT INTO public.empresas (
    id, nome_fantasia, razao_social, cnpj, email, telefone, cep,
    logradouro, numero, complemento, bairro, cidade, estado,
    segmento, plano, status
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Cash Engine DEMO',
    'Cash Engine Demonstração LTDA',
    '00.000.000/0001-00',
    'demo@cashengine.pro',
    '(11) 4000-0000',
    '01001-000',
    'Praça da Sé',
    '100',
    'Centro',
    'Sé',
    'São Paulo',
    'SP',
    'SaaS / E-commerce',
    'pro',
    'ativo'
) ON CONFLICT DO NOTHING;

-- Saldo inicial da empresa
INSERT INTO public.saldos (
    empresa_id, saldo_bruto, saldo_disponivel, saldo_bloqueado,
    saldo_em_analise, saldo_previsao_liberar,
    total_entrado_historico, total_saido_historico
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    52480.50, 28450.30, 18320.20, 4890.00, 820.00,
    328500.00, 276019.50
) ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 2. CATEGORIAS DE PRODUTOS DEMO
-- --------------------------------------------------------------------------
INSERT INTO public.categorias_produtos (
    empresa_id, nome, slug, descricao, destaque, ativa, ordem
) VALUES
('00000000-0000-0000-0000-000000000001', 'Marketing Digital', 'marketing-digital', 'Cursos, templates e ferramentas de marketing', TRUE, TRUE, 1),
('00000000-0000-0000-0000-000000000001', 'Negócios', 'negocios', 'Gestão empresarial, vendas e liderança', TRUE, TRUE, 2),
('00000000-0000-0000-0000-000000000001', 'Tecnologia', 'tecnologia', 'Programação, SaaS, IA e dev', FALSE, TRUE, 3),
('00000000-0000-0000-0000-000000000001', 'Saúde e Bem-estar', 'saude-bem-estar', 'Produtos digitais de saúde', FALSE, TRUE, 4),
('00000000-0000-0000-0000-000000000001', 'Finanças', 'financas', 'Investimentos e educação financeira', FALSE, TRUE, 5),
('00000000-0000-0000-0000-000000000001', 'Consultoria', 'consultoria', 'Serviços de consultoria especializada', FALSE, TRUE, 6)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 3. PRODUTOS DEMO
-- --------------------------------------------------------------------------
INSERT INTO public.produtos (
    empresa_id, categoria_id, sku, nome, slug, subtitulo,
    descricao_curta, descricao_longa, tipo, preco, preco_promocional,
    status, imagem_principal_url, taxa_comissao_afiliado,
    destaque, lancamento, mais_vendido, total_vendido, receita_total,
    permite_parcelamento, max_parcelas, published_at
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.categorias_produtos WHERE slug = 'marketing-digital' LIMIT 1),
    'MKTD-001', 'Fórmula de Vendas Alta Conversão', 'formula-vendas-alta-conversao',
    'O Método Completo de Vendas Digitais',
    'Aprenda a vender todos os dias na internet com estratégias comprovadas por mais de 10.000 alunos.',
    '## O que você vai aprender:
- Mindset do Vendedor de Alta Performance
- Criação de Ofertas Irrecusáveis
- Copywriting Persuasivo Passo a Passo
- Tráfego Pago Escalável
- Funis de Venda de Alta Conversão
- Atendimento e Pós-Venda
- Black Book de Scripts de Fechamento',
    'digital', 1997.00, 997.00,
    'publicado',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    40.00,
    TRUE, FALSE, TRUE, 1542, 1489774.00,
    TRUE, 12, NOW() - INTERVAL '90 days'
),
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.categorias_produtos WHERE slug = 'negocios' LIMIT 1),
    'NEG-002', 'Império SaaS - Crie Software em 90 dias', 'imperio-saas-90-dias',
    'Construa e Escale seu Software Mensal',
    'Da ideia ao MRR de 6 dígitos. Guia completo para fundadores de SaaS.',
    '## Módulos:
1. Validação de Ideia
2. MVP Ultra Rápido
3. Arquitetura Escalável
4. Pricing e Pacotes
5. Customer Success
6. Fundraising
7. Operações e Métricas',
    'assinatura', 97.00, NULL,
    'publicado',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
    30.00,
    FALSE, TRUE, TRUE, 834, 0,
    TRUE, 6, NOW() - INTERVAL '45 days'
),
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.categorias_produtos WHERE slug = 'tecnologia' LIMIT 1),
    'TEC-003', 'IA para Devs: Prompt Engineering', 'ia-para-devs-prompt-engineering',
    'Dominando LLMs na Produção',
    'Use ChatGPT, Claude e Gemini como um Engenheiro Senior.',
    '## Conteúdo:
- Fundamentos de LLMs
- Prompt Patterns Avançados
- RAG e Fine-tuning
- Agents e Tool Use
- Prompt Chaining
- Segurança e Validação
- Casos Reais GitHub',
    'digital', 497.00, 297.00,
    'publicado',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    35.00,
    TRUE, TRUE, FALSE, 289, 113433.00,
    TRUE, 10, NOW() - INTERVAL '30 days'
),
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.categorias_produtos WHERE slug = 'financas' LIMIT 1),
    'FIN-004', 'Investidor Milionário', 'investidor-milionario',
    'Educação Financeira para Renda Extra',
    'Bolsa, FIIs, Cripto e Tesouro Direto. Passo a passo.',
    '## Estratégias:
- Alocação de Ativos
- Análise Fundamentalista
- Timing de Mercado
- Cobertura de Risco
- Planejamento Tributário
- Alavancagem Controlada',
    'digital', 1497.00, 797.00,
    'publicado',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    30.00,
    FALSE, FALSE, FALSE, 412, 379308.00,
    TRUE, 12, NOW() - INTERVAL '120 days'
),
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.categorias_produtos WHERE slug = 'saude-bem-estar' LIMIT 1),
    'SAU-005', 'Programa VIP - 90 dias Corpo Ideal', 'programa-vip-corpo-ideal-90',
    'Reeducação Alimentar + Treino Personalizado',
    'Emagrecimento definitivo com suporte 1:1 de nutricionista e personal.',
    '## Inclui:
- Exames iniciais (solicitações)
- Cardápio mensal personalizado
- Treinos semanais em vídeo
- Grupo VIP no Telegram
- Consultas quinzenais 1:1
- Aulas de Mindset Emocional',
    'servico', 2497.00, 1997.00,
    'publicado',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
    25.00,
    FALSE, FALSE, FALSE, 86, 210742.00,
    TRUE, 4, NOW() - INTERVAL '60 days'
)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 4. CUPONS DEMO
-- --------------------------------------------------------------------------
INSERT INTO public.cupons (
    empresa_id, codigo, descricao, tipo, valor, data_inicio, data_fim,
    max_usos, valor_minimo_pedido, status
) VALUES
('00000000-0000-0000-0000-000000000001', 'LAUNCH20', 'Desconto de lançamento - 20%', 'percentual', 20.0, NOW() - INTERVAL '7 days', NOW() + INTERVAL '30 days', 500, 100, 'ativo'),
('00000000-0000-0000-0000-000000000001', 'VIP100', 'R$ 100 OFF em qualquer produto', 'valor_fixo', 100.0, NOW() - INTERVAL '1 day', NOW() + INTERVAL '90 days', NULL, 297, 'ativo'),
('00000000-0000-0000-0000-000000000001', 'CLIENTE50', 'Primeira compra com 50%', 'percentual', 50.0, NOW(), NOW() + INTERVAL '180 days', 1000, 0, 'ativo')
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 5. TEMPLATES CHECKOUT
-- --------------------------------------------------------------------------
INSERT INTO public.templates_checkout (
    empresa_id, nome, slug, layout, cor_primaria, cor_secundaria,
    cor_fundo, cor_texto, is_padrao, ativo
) VALUES
(NULL, 'Cash Engine Dark', 'cash-engine-dark', 'moderno', '#ef4444', '#18181b', '#09090b', '#f4f4f5', TRUE, TRUE),
('00000000-0000-0000-0000-000000000001', 'Premium Minimal', 'premium-minimal', 'clean', '#8b5cf6', '#1e1b4b', '#0c0a1e', '#e0e7ff', FALSE, TRUE)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 6. CHECKOUTS
-- --------------------------------------------------------------------------
INSERT INTO public.checkouts (
    empresa_id, produto_id, nome, slug, status, template_id,
    total_vendido, total_arrecadado, publicacao_data, permite_convidado,
    obrigar_cadastro
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.produtos WHERE sku = 'MKTD-001'),
    'Checkout Fórmula Vendas', 'checkout-formula-vendas',
    'publicado',
    (SELECT id FROM public.templates_checkout WHERE slug = 'premium-minimal'),
    1542, 1489774.00, NOW() - INTERVAL '90 days',
    TRUE, FALSE
),
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.produtos WHERE sku = 'TEC-003'),
    'Checkout IA para Devs', 'checkout-ia-para-devs',
    'publicado', NULL,
    289, 113433.00, NOW() - INTERVAL '30 days',
    TRUE, FALSE
),
(
    '00000000-0000-0000-0000-000000000001',
    NULL,
    'Checkout PIX Simples (Valor Livre)', 'checkout-pix-valor-livre',
    'publicado', NULL,
    0, 0, NOW() - INTERVAL '5 days',
    TRUE, FALSE
)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 7. CLIENTES DEMO
-- --------------------------------------------------------------------------
INSERT INTO public.clientes (
    empresa_id, nome_completo, email, celular, cpf, tipo_pessoa,
    data_nascimento, sexo, cidade, estado, total_pedidos,
    total_gasto, ticket_medio, nivel_cliente, status, origem_captacao,
    data_primeira_compra, data_ultima_compra, pontos_fidelidade, tags
) VALUES
('00000000-0000-0000-0000-000000000001','João Pedro Souza','joao.pedro@email.com','(11)99001-1000','111.222.333-44','PF','1990-05-20','M','São Paulo','SP',12,8743.00,728.58,'ouro','ativo','Instagram',NOW() - INTERVAL '200 days',NOW() - INTERVAL '3 days',2500,'{"vip","premium"}'),
('00000000-0000-0000-0000-000000000001','Maria da Silva Oliveira','maria.oliveira@email.com','(21)98123-4567','222.333.444-55','PF','1994-11-10','F','Rio de Janeiro','RJ',7,4979.00,711.29,'prata','ativo','Google Ads',NOW() - INTERVAL '120 days',NOW() - INTERVAL '8 days',800,'{"recomendou"}'),
('00000000-0000-0000-0000-000000000001','Carlos Eduardo Pereira','carlos.eduardo@email.com','(47)99789-0123','333.444.555-66','PF','1987-02-14','M','Florianópolis','SC',4,2487.00,621.75,'bronze','ativo','Facebook',NOW() - INTERVAL '60 days',NOW() - INTERVAL '15 days',300,'{}'),
('00000000-0000-0000-0000-000000000001','Ana Carolina Santos','ana.santos@email.com','(31)99456-7890','444.555.666-77','PF','1999-08-03','F','Belo Horizonte','MG',2,1394.00,697.00,'bronze','ativo','Orgânico',NOW() - INTERVAL '45 days',NOW() - INTERVAL '10 days',180,'{}'),
('00000000-0000-0000-0000-000000000001','Roberto Martins LTDA','financeiro@robertomartins.com.br','(61)99234-5678','12.345.678/0001-90','PJ',NULL,NULL,'Brasília','DF',9,23450.00,2605.56,'diamante','ativo','Indicação',NOW() - INTERVAL '300 days',NOW() - INTERVAL '2 days',5500,'{"pj","empresa","fiel"}')
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 8. TRANSAÇÕES DEMO
-- --------------------------------------------------------------------------
INSERT INTO public.transacoes (
    empresa_id, cliente_id, produto_id, checkout_id, cupom_id,
    pedido_numero, tipo, metodo_pagamento, status,
    valor_bruto, valor_descontos, valor_juros, valor_taxa_processamento,
    valor_liquido, parcelas, valor_parcela,
    data_pagamento, data_disponivel,
    nsu, autorizacao_codigo,
    criado_por, ip_cliente,
    created_at
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.clientes WHERE cpf = '111.222.333-44'),
    (SELECT id FROM public.produtos WHERE sku = 'MKTD-001'),
    (SELECT id FROM public.checkouts WHERE slug = 'checkout-formula-vendas'),
    (SELECT id FROM public.cupons WHERE codigo = 'VIP100'),
    'PED-2024-000876', 'venda', 'pix', 'disponivel',
    997.00, 100.00, 0, 10.06,
    886.94, 1, 897.00,
    NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '0 days',
    '123456789', 'AUTHXYZ123',
    NULL, '200.100.50.20',
    NOW() - INTERVAL '1 day'
),
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.clientes WHERE cpf = '222.333.444-55'),
    (SELECT id FROM public.produtos WHERE sku = 'FIN-004'),
    NULL, NULL,
    'PED-2024-000875', 'venda', 'cartao_credito', 'aprovada',
    797.00, 0, 0, 31.80,
    765.20, 12, 66.42,
    NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days' + INTERVAL '30 days',
    '987654321', 'AUTHABC789',
    NULL, '189.25.88.11',
    NOW() - INTERVAL '8 days'
),
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.clientes WHERE cpf = '333.444.555-66'),
    (SELECT id FROM public.produtos WHERE sku = 'TEC-003'),
    (SELECT id FROM public.checkouts WHERE slug = 'checkout-ia-para-devs'),
    (SELECT id FROM public.cupons WHERE codigo = 'LAUNCH20'),
    'PED-2024-000874', 'venda', 'cartao_credito', 'processando',
    297.00, 59.40, 0, 9.50,
    228.10, 6, 39.60,
    NULL, NULL,
    NULL, NULL,
    NULL, '45.162.8.77',
    NOW() - INTERVAL '2 hours'
),
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.clientes WHERE cpf = '444.555.666-77'),
    (SELECT id FROM public.produtos WHERE sku = 'NEG-002'),
    NULL, NULL,
    'PED-2024-000873', 'assinatura', 'cartao_credito', 'paga',
    97.00, 0, 0, 3.87,
    93.13, 1, 97.00,
    NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days' + INTERVAL '30 days',
    '555123456', 'AUTH009ABC',
    NULL, '201.8.45.200',
    NOW() - INTERVAL '10 days'
)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 9. LINKS DE PAGAMENTO DEMO
-- --------------------------------------------------------------------------
INSERT INTO public.links_pagamento (
    empresa_id, produto_id, cupom_id,
    tipo, titulo, descricao, codigo_unico,
    valor, status, data_expiracao,
    contador_usos, max_usos,
    campanha_nome, criado_por
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    NULL, NULL,
    'simples', 'Pagamento Consultoria 1h',
    'Valor para consulta estratégica de 1 hora.',
    'CONSULT-1H-XYZ999',
    497.00, 'ativo', NOW() + INTERVAL '365 days',
    0, NULL,
    'Campanha Black 2024', NULL
),
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.produtos WHERE sku = 'FIN-004'),
    (SELECT id FROM public.cupons WHERE codigo = 'VIP100'),
    'produto', 'Oferta Especial Investidor Milionário (WhatsApp)',
    'Página com desconto exclusivo para leads do WhatsApp.',
    'FIN-50OFF-WHATS888',
    1397.00, 'ativo', NOW() + INTERVAL '7 days',
    17, 50,
    'WhatsApp Broadcast', NULL
)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 10. MARKETPLACE - PRODUTOS PÚBLICOS
-- --------------------------------------------------------------------------
INSERT INTO public.marketplace_produtos (
    empresa_vendedora_id, produto_id,
    titulo_marketplace, subtitulo_marketplace,
    descricao_marketplace, imagem_destaque,
    categoria_marketplace,
    preco_marketplace, taxa_comissao_oferecida,
    total_vendas_total, total_afiliados_ativos,
    avaliacao_media, total_avaliacoes,
    publico_alvo, nivel_qualidade, destaque_marketplace,
    status, data_publicacao
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.produtos WHERE sku = 'MKTD-001'),
    'Fórmula Vendas Alta Conversão - TOP 1%',
    '40% Comissão | 1542 vendas | 98% satisfação',
    'Um dos infoprodutos mais completos de marketing digital do Brasil. Vendedor com SLA de suporte 24h e materiais para afiliados.',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
    'Marketing Digital',
    997.00, 40.00,
    1542, 412,
    4.92, 287,
    'Empreendedores e infoprodutores', 5, TRUE,
    'publicado', NOW() - INTERVAL '90 days'
),
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.produtos WHERE sku = 'TEC-003'),
    'Prompt Engineering para Devs - Afiliado',
    '35% Comissão Recorrente + Bônus',
    'Curso premium de IA. Muitos materiais promocionais. Comissão alta e suporte para afiliados.',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    'Tecnologia',
    297.00, 35.00,
    289, 98,
    4.88, 76,
    'Desenvolvedores e entusiastas de IA', 5, FALSE,
    'publicado', NOW() - INTERVAL '30 days'
),
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.produtos WHERE sku = 'FIN-004'),
    'Investidor Milionário - Nicho Finanças',
    '30% Comissão | Alto Ticket Médio',
    'Finanças pessoais e investimentos. Público fiel com recorrência. Material promocional de alta qualidade.',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    'Finanças',
    797.00, 30.00,
    412, 156,
    4.71, 119,
    'Pessoas de 25-55 anos com renda média-alta', 4, TRUE,
    'publicado', NOW() - INTERVAL '120 days'
)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- FINAL - SEED DEMO
-- --------------------------------------------------------------------------
