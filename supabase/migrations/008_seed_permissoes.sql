-- ==========================================================================
-- MIGRATION 008 - SEED DATA: ROLES SISTEMA, PERMISSÕES, TAXAS PADRÃO
-- Cash Engine PRO
-- ==========================================================================
-- Este arquivo cria TODAS as permissões granulares, roles padrão de sistema,
-- taxas de plataforma, artigos da central de ajuda iniciais e configurações
-- globais. NÃO remove dados existentes.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. INSERÇÃO DE PERMISSÕES GRANULARES (TODAS DO SISTEMA)
-- --------------------------------------------------------------------------
INSERT INTO public.permissions (modulo, recurso, acao, nome_exibicao, descricao) VALUES
-- Dashboard
('dashboard', 'visao_geral', 'read', 'Dashboard - Visualizar Visão Geral', 'Visualizar KPIs e gráficos do dashboard'),

-- Produtos
('produtos', 'produtos', 'create', 'Produtos - Criar', 'Criar novos produtos'),
('produtos', 'produtos', 'read', 'Produtos - Visualizar', 'Ver listagem e detalhes de produtos'),
('produtos', 'produtos', 'update', 'Produtos - Editar', 'Editar produtos existentes'),
('produtos', 'produtos', 'delete', 'Produtos - Excluir', 'Excluir produtos permanentemente'),
('produtos', 'categorias', 'create', 'Produtos - Criar Categorias', 'Criar categorias de produtos'),
('produtos', 'categorias', 'read', 'Produtos - Ver Categorias', 'Ver categorias'),
('produtos', 'categorias', 'update', 'Produtos - Editar Categorias', 'Editar categorias'),
('produtos', 'categorias', 'delete', 'Produtos - Excluir Categorias', 'Excluir categorias'),
('produtos', 'checkouts', 'create', 'Checkouts - Criar', 'Criar páginas de checkout'),
('produtos', 'checkouts', 'read', 'Checkouts - Visualizar', 'Ver listagem de checkouts'),
('produtos', 'checkouts', 'update', 'Checkouts - Editar', 'Editar checkouts existentes'),
('produtos', 'checkouts', 'delete', 'Checkouts - Excluir', 'Excluir checkouts'),

-- Vendas
('vendas', 'vendas', 'read', 'Vendas - Visualizar', 'Ver lista de vendas'),
('vendas', 'vendas', 'update', 'Vendas - Editar Status', 'Alterar status de vendas'),
('vendas', 'clientes', 'create', 'Clientes - Criar', 'Cadastrar novos clientes'),
('vendas', 'clientes', 'read', 'Clientes - Visualizar', 'Ver listagem e perfil de clientes'),
('vendas', 'clientes', 'update', 'Clientes - Editar', 'Atualizar dados de clientes'),
('vendas', 'clientes', 'delete', 'Clientes - Excluir', 'Remover clientes'),
('vendas', 'cupons', 'create', 'Cupons - Criar', 'Criar cupons de desconto'),
('vendas', 'cupons', 'read', 'Cupons - Visualizar', 'Ver cupons cadastrados'),
('vendas', 'cupons', 'update', 'Cupons - Editar', 'Editar cupons existentes'),
('vendas', 'cupons', 'delete', 'Cupons - Excluir', 'Remover cupons'),
('vendas', 'links', 'create', 'Links de Pagamento - Criar', 'Criar links de pagamento'),
('vendas', 'links', 'read', 'Links de Pagamento - Visualizar', 'Ver listagem de links'),
('vendas', 'links', 'update', 'Links de Pagamento - Editar', 'Editar links existentes'),
('vendas', 'links', 'delete', 'Links de Pagamento - Excluir', 'Excluir links'),
('vendas', 'checkouts', 'create', 'Checkouts - Criar', 'Criar novos checkouts (Vendas)'),
('vendas', 'checkouts', 'read', 'Checkouts - Visualizar (Vendas)', 'Ver checkouts em vendas'),
('vendas', 'checkouts', 'update', 'Checkouts - Editar (Vendas)', 'Editar checkouts em vendas'),
('vendas', 'checkouts', 'delete', 'Checkouts - Excluir (Vendas)', 'Excluir checkouts em vendas'),

-- Afiliados
('afiliados', 'afiliados', 'create', 'Afiliados - Convidar/Criar', 'Convidar novos afiliados'),
('afiliados', 'afiliados', 'read', 'Afiliados - Visualizar', 'Ver listagem de afiliados'),
('afiliados', 'afiliados', 'update', 'Afiliados - Editar', 'Alterar dados e taxas de afiliados'),
('afiliados', 'afiliados', 'delete', 'Afiliados - Remover', 'Bloquear/remover afiliados'),
('afiliados', 'afiliados', 'approve', 'Afiliados - Aprovar', 'Aprovar solicitações de afiliados'),
('afiliados', 'comissoes', 'read', 'Comissões - Visualizar', 'Ver comissões geradas'),
('afiliados', 'comissoes', 'update', 'Comissões - Ajustar', 'Ajustar e aprovar comissões manualmente'),
('afiliados', 'comissoes', 'approve', 'Comissões - Liberar', 'Liberar comissões para saque'),
('afiliados', 'links', 'create', 'Links de Afiliado - Criar', 'Criar links personalizados'),
('afiliados', 'links', 'read', 'Links de Afiliado - Visualizar', 'Ver links e performance'),
('afiliados', 'links', 'update', 'Links de Afiliado - Editar', 'Editar links existentes'),
('afiliados', 'links', 'delete', 'Links de Afiliado - Excluir', 'Excluir links'),
('afiliados', 'marketplace', 'read', 'Marketplace - Visualizar', 'Ver produtos no marketplace'),
('afiliados', 'marketplace', 'update', 'Marketplace - Gerenciar', 'Aprovar/rejeitar produtos no marketplace'),

-- Financeiro
('financeiro', 'saldo', 'read', 'Saldo - Visualizar', 'Ver saldos e disponibilidade'),
('financeiro', 'transacoes', 'read', 'Transações - Visualizar', 'Ver todas as transações'),
('financeiro', 'transacoes', 'update', 'Transações - Editar', 'Alterar dados de transações'),
('financeiro', 'extrato', 'read', 'Extrato - Visualizar', 'Acessar extrato completo'),
('financeiro', 'saques', 'create', 'Saques - Solicitar', 'Solicitar saques'),
('financeiro', 'saques', 'read', 'Saques - Visualizar', 'Ver histórico de saques'),
('financeiro', 'saques', 'update', 'Saques - Processar', 'Aprovar/rejeitar saques'),
('financeiro', 'saques', 'approve', 'Saques - Aprovar', 'Aprovar saques em massa'),
('financeiro', 'estornos', 'create', 'Estornos - Solicitar', 'Criar pedidos de estorno'),
('financeiro', 'estornos', 'read', 'Estornos - Visualizar', 'Ver histórico de estornos'),
('financeiro', 'estornos', 'update', 'Estornos - Processar', 'Aprovar/rejeitar estornos'),
('financeiro', 'chargebacks', 'read', 'Chargebacks - Visualizar', 'Ver chargebacks recebidos'),
('financeiro', 'chargebacks', 'update', 'Chargebacks - Defender', 'Responder e defender chargebacks'),
('financeiro', 'repasses', 'create', 'Repasses - Criar', 'Criar repasses a parceiros'),
('financeiro', 'repasses', 'read', 'Repasses - Visualizar', 'Ver repasses'),
('financeiro', 'taxas', 'read', 'Taxas - Visualizar', 'Ver taxas da plataforma'),
('financeiro', 'contas', 'create', 'Contas Bancárias - Adicionar', 'Adicionar contas bancárias'),
('financeiro', 'contas', 'read', 'Contas Bancárias - Ver', 'Visualizar contas cadastradas'),
('financeiro', 'contas', 'update', 'Contas Bancárias - Editar', 'Editar contas'),
('financeiro', 'contas', 'delete', 'Contas Bancárias - Remover', 'Excluir contas'),
('financeiro', 'relatorios', 'read', 'Relatórios Financeiros - Acessar', 'Acessar relatórios financeiros'),

-- RH / Equipe
('rh', 'equipe', 'create', 'Equipe - Convidar Membro', 'Convidar novos membros'),
('rh', 'equipe', 'read', 'Equipe - Visualizar', 'Ver listagem da equipe'),
('rh', 'equipe', 'update', 'Equipe - Editar', 'Alterar cargo/departamento'),
('rh', 'equipe', 'delete', 'Equipe - Remover', 'Remover membros da equipe'),
('rh', 'equipe', 'approve', 'Equipe - Aprovar', 'Aprovar admissões/alteracoes'),

-- Configurações
('configuracoes', 'conta', 'read', 'Configurações - Conta', 'Acessar dados da conta pessoal'),
('configuracoes', 'conta', 'update', 'Configurações - Editar Conta', 'Editar dados da conta pessoal'),
('configuracoes', 'empresa', 'read', 'Configurações - Dados da Empresa', 'Ver dados da empresa'),
('configuracoes', 'empresa', 'update', 'Configurações - Editar Empresa', 'Atualizar dados da empresa'),
('configuracoes', 'equipe', 'read', 'Configurações - Equipe', 'Gerenciar equipe em configurações'),
('configuracoes', 'equipe', 'update', 'Configurações - Editar Equipe', 'Editar membros em configurações'),
('configuracoes', 'seguranca', 'read', 'Configurações - Segurança', 'Ver configurações de segurança'),
('configuracoes', 'seguranca', 'update', 'Configurações - Editar Segurança', 'Alterar senha, 2FA, dispositivos'),
('configuracoes', 'integracoes', 'read', 'Configurações - Integrações', 'Ver integrações disponíveis'),
('configuracoes', 'integracoes', 'update', 'Configurações - Conectar Integrações', 'Conectar/desconectar integrações'),
('configuracoes', 'permissoes', 'read', 'Configurações - Permissões', 'Ver roles e permissões'),
('configuracoes', 'permissoes', 'create', 'Configurações - Criar Roles', 'Criar novos papéis'),
('configuracoes', 'permissoes', 'update', 'Configurações - Editar Permissões', 'Editar roles e permissões'),
('configuracoes', 'permissoes', 'manage', 'Configurações - Gerenciar Tudo', 'Gerenciamento total de permissões'),
('configuracoes', 'permissoes', 'delete', 'Configurações - Excluir Roles', 'Excluir papéis'),

-- Developers
('developers', 'chaves_api', 'create', 'API - Criar Chaves', 'Gerar novas chaves de API'),
('developers', 'chaves_api', 'read', 'API - Visualizar Chaves', 'Ver chaves de API'),
('developers', 'chaves_api', 'update', 'API - Editar Chaves', 'Editar permissões e escopos'),
('developers', 'chaves_api', 'delete', 'API - Revogar Chaves', 'Revogar/excluir chaves'),
('developers', 'webhooks', 'create', 'Webhooks - Criar', 'Criar endpoints de webhook'),
('developers', 'webhooks', 'read', 'Webhooks - Visualizar', 'Ver webhooks e logs'),
('developers', 'webhooks', 'update', 'Webhooks - Editar', 'Editar webhooks'),
('developers', 'webhooks', 'delete', 'Webhooks - Excluir', 'Remover webhooks'),
('developers', 'logs', 'read', 'Logs - Visualizar', 'Acessar logs do sistema'),

-- Relatórios
('relatorios', 'vendas', 'read', 'Relatórios - Vendas', 'Relatórios de vendas'),
('relatorios', 'produtos', 'read', 'Relatórios - Produtos', 'Relatórios de produtos'),
('relatorios', 'afiliados', 'read', 'Relatórios - Afiliados', 'Relatórios de afiliados'),
('relatorios', 'financeiro', 'read', 'Relatórios - Financeiro', 'Relatórios financeiros'),
('relatorios', 'agendados', 'create', 'Relatórios Agendados - Criar', 'Criar agendamentos'),
('relatorios', 'agendados', 'read', 'Relatórios Agendados - Visualizar', 'Ver agendamentos'),
('relatorios', 'agendados', 'update', 'Relatórios Agendados - Editar', 'Editar agendamentos'),
('relatorios', 'agendados', 'delete', 'Relatórios Agendados - Excluir', 'Remover agendamentos'),

-- Sistema
('sistema', 'notificacoes', 'read', 'Notificações - Visualizar', 'Ver notificações'),
('sistema', 'notificacoes', 'update', 'Notificações - Marcar Lida', 'Marcar notificações lidas'),
('sistema', 'notificacoes', 'create', 'Notificações - Criar', 'Criar notificações (admin)'),

-- Treinamentos
('treinamentos', 'cursos', 'create', 'Treinamentos - Criar Cursos', 'Criar novos cursos'),
('treinamentos', 'cursos', 'read', 'Treinamentos - Ver Cursos', 'Visualizar cursos'),
('treinamentos', 'cursos', 'update', 'Treinamentos - Editar Cursos', 'Editar cursos existentes'),
('treinamentos', 'cursos', 'delete', 'Treinamentos - Excluir Cursos', 'Remover cursos'),
('treinamentos', 'matriculas', 'create', 'Treinamentos - Criar Matrículas', 'Matricular alunos'),
('treinamentos', 'matriculas', 'read', 'Treinamentos - Ver Matrículas', 'Visualizar matrículas'),
('treinamentos', 'matriculas', 'update', 'Treinamentos - Editar Matrículas', 'Alterar status de matrículas'),
('treinamentos', 'matriculas', 'delete', 'Treinamentos - Cancelar Matrículas', 'Cancelar matrículas'),

-- Suporte
('suporte', 'tickets', 'create', 'Tickets - Abrir', 'Abrir novos tickets'),
('suporte', 'tickets', 'read', 'Tickets - Visualizar', 'Ver tickets'),
('suporte', 'tickets', 'update', 'Tickets - Responder', 'Responder e atualizar tickets'),
('suporte', 'tickets', 'delete', 'Tickets - Excluir', 'Remover tickets'),
('suporte', 'tickets', 'approve', 'Tickets - Reabrir/Fechar', 'Fechar ou reabrir tickets')

ON CONFLICT (modulo, recurso, acao) DO NOTHING;

-- --------------------------------------------------------------------------
-- 2. CONFIGURAÇÕES GLOBAIS (ADMIN_GLOBAL_CONFIG)
-- --------------------------------------------------------------------------
INSERT INTO public.admin_global_config (chave, valor, tipo_valor, descricao, categoria, modulo, publico) VALUES
('plataforma.nome', '"Cash Engine PRO"', 'string', 'Nome da plataforma', 'identidade', 'plataforma', TRUE),
('plataforma.versao', '"1.0.0"', 'string', 'Versão atual da plataforma', 'identidade', 'plataforma', TRUE),
('plataforma.website', '"https://cashengine.pro"', 'string', 'Website oficial', 'identidade', 'plataforma', TRUE),
('plataforma.suporte_email', '"suporte@cashengine.pro"', 'string', 'Email de suporte', 'contato', 'plataforma', TRUE),
('plataforma.suporte_whatsapp', '"+5511000000000"', 'string', 'WhatsApp de suporte', 'contato', 'plataforma', TRUE),
('saques.taxa_padrao_percentual', '1.5', 'number', 'Taxa padrão de saque em %', 'financeiro', 'saques', FALSE),
('saques.taxa_padrao_fixa', '2.5', 'number', 'Taxa fixa por saque em R$', 'financeiro', 'saques', FALSE),
('saques.minimo_valor', '50.0', 'number', 'Valor mínimo para saque R$', 'financeiro', 'saques', FALSE),
('saques.limite_diario_valor', '10000.0', 'number', 'Limite diário de saque R$', 'financeiro', 'saques', FALSE),
('saques.processamento_dias', '1', 'number', 'Dias úteis para processamento', 'financeiro', 'saques', TRUE),
('taxas.padrao_cartao_percentual', '3.99', 'number', 'Taxa padrão cartão crédito %', 'financeiro', 'taxas', TRUE),
('taxas.padrao_cartao_fixa', '0.40', 'number', 'Taxa fixa cartão R$', 'financeiro', 'taxas', TRUE),
('taxas.padrao_pix_percentual', '1.49', 'number', 'Taxa padrão PIX %', 'financeiro', 'taxas', TRUE),
('taxas.padrao_pix_fixa', '0.10', 'number', 'Taxa fixa PIX R$', 'financeiro', 'taxas', TRUE),
('taxas.padrao_boleto', '3.90', 'number', 'Taxa boleto R$', 'financeiro', 'taxas', TRUE),
('taxas.desconto_pix_percentual', '10.0', 'number', 'Desconto padrão PIX %', 'financeiro', 'taxas', TRUE),
('taxas.antecipacao_percentual_dia', '0.05', 'number', 'Taxa de antecipação por dia %', 'financeiro', 'taxas', TRUE),
('liquidacao.dias_padrao', '30', 'number', 'Dias padrão de liquidação D+30', 'financeiro', 'liquidacao', TRUE),
('liquidacao.pix_dias', '0', 'number', 'Dias liquidação PIX D+0', 'financeiro', 'liquidacao', TRUE),
('afiliados.comissao_padrao', '30.0', 'number', 'Comissão padrão afiliados %', 'afiliados', 'padrao', TRUE),
('afiliados.minimo_saque_padrao', '50.0', 'number', 'Mínimo saque afiliado R$', 'afiliados', 'saques', FALSE),
('afiliados.dias_liberacao_comissao', '30', 'number', 'Dias para liberar comissão D+30', 'afiliados', 'liquidacao', TRUE),
('marketplace.taxa_plataforma', '10.0', 'number', 'Taxa plataforma marketplace %', 'marketplace', 'taxas', TRUE),
('marketplace.aprovacao_automatica', 'false', 'boolean', 'Aprovação automática produtos marketplace', 'marketplace', 'fluxo', FALSE),
('seguranca.senha_min_caracteres', '8', 'number', 'Mínimo caracteres senha', 'seguranca', 'senha', TRUE),
('seguranca.senha_exige_maiuscula', 'true', 'boolean', 'Exige letra maiúscula na senha', 'seguranca', 'senha', TRUE),
('seguranca.senha_exige_numero', 'true', 'boolean', 'Exige número na senha', 'seguranca', 'senha', TRUE),
('seguranca.senha_exige_especial', 'true', 'boolean', 'Exige caractere especial na senha', 'seguranca', 'senha', TRUE),
('seguranca.max_tentativas_login', '5', 'number', 'Máx tentativas login antes bloqueio', 'seguranca', 'login', TRUE),
('seguranca.bloqueio_temporario_min', '30', 'number', 'Minutos de bloqueio após limite', 'seguranca', 'login', FALSE),
('seguranca.sessao_expira_horas', '8', 'number', 'Expiração de sessão em horas', 'seguranca', 'sessao', FALSE),
('seguranca.2fa_obriga_admin', 'true', 'boolean', 'Obrigatório 2FA para admins', 'seguranca', '2fa', FALSE),
('convidados.expira_dias', '7', 'number', 'Dias para expiração convites', 'sistema', 'convites', TRUE),
('tickets.sla_padrao_horas', '24', 'number', 'SLA padrão tickets em horas', 'suporte', 'tickets', TRUE),
('planos.gratis_limite_produtos', '5', 'number', 'Limite produtos plano grátis', 'planos', 'limites', TRUE),
('planos.gratis_limite_checkouts', '2', 'number', 'Limite checkouts plano grátis', 'planos', 'limites', TRUE),
('planos.gratis_limite_afiliados', '10', 'number', 'Limite afiliados plano grátis', 'planos', 'limites', TRUE),
('planos.gratis_sem_taxa_plataforma_ate', '10000.0', 'number', 'Isento taxa até R$10k/mês grátis', 'planos', 'taxas', TRUE)
ON CONFLICT (chave) DO NOTHING;

-- --------------------------------------------------------------------------
-- 3. TAXAS PADRÃO DA PLATAFORMA
-- --------------------------------------------------------------------------
INSERT INTO public.taxas_plataforma (
    plano, metodo_pagamento, taxa_percentual, taxa_fixa,
    taxa_antecipacao_percentual, max_parcelas_sem_juros,
    taxa_parcelamento_por_parcela, taxa_boleto,
    taxa_pix_percentual, taxa_pix_fixa,
    taxa_saque_percentual, taxa_saque_fixa, taxa_minima_saque,
    dias_liquidacao, is_padrao, ativo
) VALUES
('free', 'pix', 1.49, 0.10, 0, 0, 0, 0, 1.49, 0.10, 1.5, 2.5, 50.0, 0, TRUE, TRUE),
('free', 'cartao_credito', 3.99, 0.40, 0.05, 2, 0.99, 0, 0, 0, 1.5, 2.5, 50.0, 30, TRUE, TRUE),
('free', 'cartao_debito', 2.49, 0.30, 0, 0, 0, 0, 0, 0, 1.5, 2.5, 50.0, 14, TRUE, TRUE),
('free', 'boleto', 0, 0, 0, 0, 0, 3.90, 0, 0, 1.5, 2.5, 50.0, 3, TRUE, TRUE),
('free', 'ted', 0, 7.50, 0, 0, 0, 0, 0, 0, 1.5, 7.50, 100.0, 0, TRUE, TRUE),
('pro', 'pix', 0.99, 0.05, 0, 0, 0, 0, 0.99, 0.05, 1.0, 1.5, 30.0, 0, FALSE, TRUE),
('pro', 'cartao_credito', 2.99, 0.30, 0.03, 6, 0.79, 0, 0, 0, 1.0, 1.5, 30.0, 14, FALSE, TRUE),
('pro', 'cartao_debito', 1.99, 0.20, 0, 0, 0, 0, 0, 0, 1.0, 1.5, 30.0, 10, FALSE, TRUE),
('pro', 'boleto', 0, 0, 0, 0, 0, 2.90, 0, 0, 1.0, 1.5, 30.0, 2, FALSE, TRUE),
('pro', 'ted', 0, 5.00, 0, 0, 0, 0, 0, 0, 1.0, 5.00, 50.0, 0, FALSE, TRUE),
('enterprise', 'pix', 0.49, 0.02, 0, 0, 0, 0, 0.49, 0.02, 0.5, 0, 20.0, 0, FALSE, TRUE),
('enterprise', 'cartao_credito', 1.99, 0.20, 0.02, 12, 0.49, 0, 0, 0, 0.5, 0, 20.0, 7, FALSE, TRUE),
('enterprise', 'cartao_debito', 0.99, 0.10, 0, 0, 0, 0, 0, 0, 0.5, 0, 20.0, 5, FALSE, TRUE),
('enterprise', 'boleto', 0, 0, 0, 0, 0, 1.90, 0, 0, 0.5, 0, 20.0, 1, FALSE, TRUE),
('enterprise', 'ted', 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 20.0, 0, FALSE, TRUE)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 4. ARTIGOS INICIAIS DA CENTRAL DE AJUDA (EMPRESAS GLOBAIS = NULL)
-- --------------------------------------------------------------------------
INSERT INTO public.ajuda_categorias (nome, slug, descricao, icone, cor, ordem, publica, empresa_id) VALUES
('Primeiros Passos', 'primeiros-passos', 'Tudo que precisa para começar a usar o Cash Engine PRO', 'rocket', '#ef4444', 1, TRUE, NULL),
('Vendas e Produtos', 'vendas-produtos', 'Como criar produtos, checkouts, links e cupons', 'shopping-cart', '#f59e0b', 2, TRUE, NULL),
('Afiliados e Marketplace', 'afiliados-marketplace', 'Configurar programa de afiliados e marketplace', 'users', '#8b5cf6', 3, TRUE, NULL),
('Financeiro', 'financeiro', 'Tudo sobre transações, saldos, saques e taxas', 'banknote', '#10b981', 4, TRUE, NULL),
('Segurança e Acesso', 'seguranca-acesso', 'Senhas, 2FA, permissões e segurança da conta', 'shield-check', '#3b82f6', 5, TRUE, NULL),
('Configurações', 'configuracoes', 'Personalizar sua conta, empresa e preferências', 'cog-6-tooth', '#64748b', 6, TRUE, NULL),
('Integrações e API', 'integracoes-api', 'Conectar plataformas externas e usar nossa API', 'plug', '#ec4899', 7, TRUE, NULL),
('Resolução de Problemas', 'resolucao-problemas', 'Soluções para erros e problemas comuns', 'wrench-screwdriver', '#f43f5e', 8, TRUE, NULL)
ON CONFLICT DO NOTHING;

WITH categorias AS (
    SELECT slug, id FROM public.ajuda_categorias WHERE empresa_id IS NULL
)
INSERT INTO public.ajuda_artigos (empresa_id, categoria_id, titulo, slug, resumo, conteudo, conteudo_html, status, publico, tempo_leitura_minutos, created_at)
SELECT
    NULL, c.id,
    art.titulo, art.slug, art.resumo, art.conteudo, art.conteudo_html,
    'publicado', TRUE, art.tempo, NOW()
FROM categorias c
CROSS JOIN (
    VALUES
        ('primeiros-passos',
            'Como criar minha primeira empresa no Cash Engine PRO',
            'primeira-empresa',
            'Passo a passo para configurar sua empresa e começar a vender',
            '1. Acesse Configurações > Dados da Empresa
2. Preencha nome fantasia e CNPJ
3. Adicione contatos e endereço
4. Salve as alterações
Pronto! Sua empresa está criada.',
            '<ol><li>Acesse Configurações > Dados da Empresa</li><li>Preencha nome fantasia e CNPJ</li><li>Adicione contatos e endereço</li><li>Salve as alterações</li></ol><p>Pronto!</p>',
            3
        ),
        ('primeiros-passos',
            'Como criar meu primeiro produto',
            'criar-primeiro-produto',
            'Aprenda a cadastrar produtos digitais, físicos ou assinaturas',
            '1. Vá em Produtos > Novo Produto
2. Defina nome, preço e descrição
3. Envie imagens e materiais
4. Publique!',
            '<ol><li>Vá em Produtos > Novo Produto</li><li>Defina nome, preço e descrição</li><li>Envie imagens</li><li>Publique</li></ol>',
            4
        ),
        ('seguranca-acesso',
            'Como ativar a autenticação de dois fatores (2FA)',
            'ativar-2fa',
            'Proteja sua conta com o 2FA via app autenticador',
            '1. Acesse Configurações > Segurança
2. Clique em "Ativar 2FA"
3. Escaneie o QR Code com Google Authenticator
4. Digite o código de 6 dígitos
5. Guarde seus códigos de recuperação',
            '<ol><li>Acesse Configurações > Segurança</li><li>Clique em "Ativar 2FA"</li><li>Escaneie QR Code</li><li>Guarde códigos de recuperação</li></ol>',
            3
        ),
        ('financeiro',
            'Entenda os prazos de liquidação e disponibilidade',
            'prazos-liquidacao',
            'Saiba quando seu dinheiro cai na conta',
            'PIX: D+0 (instantâneo)
Cartão: D+30 (padrão) ou antecipação
Boleto: D+3 após compensação
Saques aprovados: até 24h úteis',
            '<ul><li>PIX: D+0 instantâneo</li><li>Cartão: D+30 padrão</li><li>Boleto: D+3</li><li>Saques: até 24h úteis</li></ul>',
            2
        ),
        ('vendas-produtos',
            'Como criar checkout de alta conversão',
            'checkout-alta-conversao',
            'Dicas para criar checkouts profissionais',
            'Use templates otimizados, adicione selos de segurança, ofereça múltiplas formas de pagamento, mostre depoimentos e garanta reembolso.',
            '<p>Use templates, selos, múltiplos pagamentos e depoimentos.</p>',
            5
        ),
        ('afiliados-marketplace',
            'Como convidar afiliados para o meu programa',
            'convidar-afiliados',
            'Convide afiliados e configure taxas de comissão',
            '1. Afiliados > Convidar Afiliado
2. Preencha email e defina comissão
3. Envie convite
4. Acompanhe status em Convites Pendentes',
            '<ol><li>Afiliados > Convidar</li><li>Email + comissão</li><li>Enviar</li></ol>',
            3
        )
) AS art(cat_slug, titulo, slug, resumo, conteudo, conteudo_html, tempo)
WHERE c.slug = art.cat_slug
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 5. ROLES DE SISTEMA (Padrão para todas as empresas - empresa_id NULL)
-- --------------------------------------------------------------------------
INSERT INTO public.roles (empresa_id, nome, descricao, nivel, is_sistema, is_admin, cor) VALUES
(NULL, 'Owner / Fundador', 'Dono da empresa - acesso TOTAL a tudo', 999, TRUE, TRUE, '#ef4444'),
(NULL, 'Administrador', 'Acesso a quase tudo, exceto ações de owner', 900, TRUE, TRUE, '#f59e0b'),
(NULL, 'Gerente Financeiro', 'Gerencia financeiro, saques, transações e estornos', 700, TRUE, FALSE, '#10b981'),
(NULL, 'Gerente de Vendas', 'Gerencia produtos, checkouts, links e cupons', 600, TRUE, FALSE, '#8b5cf6'),
(NULL, 'Gerente de Afiliados', 'Gerencia programa de afiliados e comissões', 550, TRUE, FALSE, '#ec4899'),
(NULL, 'Atendente / Suporte', 'Abre e responde tickets de suporte', 400, TRUE, FALSE, '#3b82f6'),
(NULL, 'Vendedor', 'Cria e gerencia seus produtos e vendas', 300, TRUE, FALSE, '#14b8a6'),
(NULL, 'Marketing / Conteúdo', 'Gerencia produtos e checkout, mas não financeiro', 250, TRUE, FALSE, '#a855f7'),
(NULL, 'Analista Financeiro', 'Visualiza relatórios e transações (somente leitura)', 200, TRUE, FALSE, '#22c55e'),
(NULL, 'Visualizador', 'Somente visualização - sem ações', 100, TRUE, FALSE, '#64748b'),
(NULL, 'Afiliado', 'Acesso ao painel de afiliado e comissões', 50, TRUE, FALSE, '#0ea5e9'),
(NULL, 'Cliente', 'Cliente comum - acesso a compras e tickets', 10, TRUE, FALSE, '#94a3b8')
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------------
-- 6. ASSOCIA PERMISSÕES AOS ROLES DE SISTEMA
--    Primeiro, garantimos que os IDs existam
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_seed_role_permissions()
RETURNS VOID AS $$
DECLARE
    v_role_owner UUID; v_role_admin UUID; v_role_fin UUID;
    v_role_vendas UUID; v_role_afiliados UUID; v_role_sup UUID;
    v_role_vendedor UUID; v_role_mkt UUID; v_role_analista UUID;
    v_role_viewer UUID; v_role_afiliado UUID; v_role_cliente UUID;
BEGIN
    -- Busca IDs dos roles globais
    SELECT id INTO v_role_owner    FROM public.roles WHERE nome = 'Owner / Fundador' AND empresa_id IS NULL;
    SELECT id INTO v_role_admin    FROM public.roles WHERE nome = 'Administrador' AND empresa_id IS NULL;
    SELECT id INTO v_role_fin      FROM public.roles WHERE nome = 'Gerente Financeiro' AND empresa_id IS NULL;
    SELECT id INTO v_role_vendas   FROM public.roles WHERE nome = 'Gerente de Vendas' AND empresa_id IS NULL;
    SELECT id INTO v_role_afiliados FROM public.roles WHERE nome = 'Gerente de Afiliados' AND empresa_id IS NULL;
    SELECT id INTO v_role_sup      FROM public.roles WHERE nome = 'Atendente / Suporte' AND empresa_id IS NULL;
    SELECT id INTO v_role_vendedor FROM public.roles WHERE nome = 'Vendedor' AND empresa_id IS NULL;
    SELECT id INTO v_role_mkt      FROM public.roles WHERE nome = 'Marketing / Conteúdo' AND empresa_id IS NULL;
    SELECT id INTO v_role_analista FROM public.roles WHERE nome = 'Analista Financeiro' AND empresa_id IS NULL;
    SELECT id INTO v_role_viewer   FROM public.roles WHERE nome = 'Visualizador' AND empresa_id IS NULL;
    SELECT id INTO v_role_afiliado FROM public.roles WHERE nome = 'Afiliado' AND empresa_id IS NULL;
    SELECT id INTO v_role_cliente  FROM public.roles WHERE nome = 'Cliente' AND empresa_id IS NULL;

    -- OWNER: recebe TUDO (via regra de is_admin mas inserimos para histórico)
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_owner, p.id FROM public.permissions p
    ON CONFLICT DO NOTHING;

    -- ADMIN: quase tudo, exceto delete/owner
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_admin, p.id FROM public.permissions p WHERE p.acao <> 'approve' OR p.recurso NOT IN ('equipe','seguranca')
    ON CONFLICT DO NOTHING;

    -- GERENTE FINANCEIRO
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_fin, p.id FROM public.permissions p
    WHERE p.modulo IN ('financeiro','dashboard','relatorios')
       OR (p.modulo = 'configuracoes' AND p.recurso IN ('conta','seguranca'))
       OR (p.modulo = 'sistema' AND p.recurso = 'notificacoes')
       OR (p.modulo = 'suporte' AND p.acao = 'read')
    ON CONFLICT DO NOTHING;

    -- GERENTE DE VENDAS
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_vendas, p.id FROM public.permissions p
    WHERE p.modulo IN ('produtos','vendas','dashboard','relatorios')
       OR (p.modulo = 'configuracoes' AND p.recurso IN ('conta'))
       OR (p.modulo = 'sistema' AND p.recurso = 'notificacoes')
    ON CONFLICT DO NOTHING;

    -- GERENTE DE AFILIADOS
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_afiliados, p.id FROM public.permissions p
    WHERE p.modulo IN ('afiliados','dashboard','relatorios')
       OR (p.modulo = 'configuracoes' AND p.recurso IN ('conta'))
       OR (p.modulo = 'sistema' AND p.recurso = 'notificacoes')
    ON CONFLICT DO NOTHING;

    -- ATENDENTE SUPORTE
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_sup, p.id FROM public.permissions p
    WHERE p.modulo = 'suporte'
       OR (p.modulo = 'vendas' AND p.recurso = 'clientes' AND p.acao IN ('read','update'))
       OR (p.modulo = 'sistema' AND p.recurso = 'notificacoes')
       OR (p.modulo = 'configuracoes' AND p.recurso = 'conta')
       OR (p.modulo = 'dashboard' AND p.recurso = 'visao_geral')
    ON CONFLICT DO NOTHING;

    -- VENDEDOR
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_vendedor, p.id FROM public.permissions p
    WHERE (p.modulo = 'produtos' AND p.recurso IN ('produtos','checkouts','categorias'))
       OR (p.modulo = 'vendas' AND p.recurso IN ('cupons','links','checkouts'))
       OR (p.modulo = 'vendas' AND p.recurso = 'clientes' AND p.acao IN ('create','read','update'))
       OR (p.modulo = 'configuracoes' AND p.recurso = 'conta')
       OR (p.modulo = 'sistema' AND p.recurso = 'notificacoes')
       OR (p.modulo = 'dashboard' AND p.recurso = 'visao_geral')
       OR (p.modulo = 'treinamentos' AND p.recurso = 'cursos' AND p.acao = 'read')
    ON CONFLICT DO NOTHING;

    -- MARKETING
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_mkt, p.id FROM public.permissions p
    WHERE p.modulo IN ('produtos','dashboard','relatorios')
       OR (p.modulo = 'vendas' AND p.recurso IN ('cupons','links','checkouts','clientes') AND p.acao IN ('read','create','update'))
       OR (p.modulo = 'afiliados' AND p.acao = 'read')
       OR (p.modulo = 'configuracoes' AND p.recurso = 'conta')
       OR (p.modulo = 'sistema' AND p.recurso = 'notificacoes')
    ON CONFLICT DO NOTHING;

    -- ANALISTA FINANCEIRO (apenas leitura)
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_analista, p.id FROM public.permissions p
    WHERE p.acao = 'read' AND (
        p.modulo IN ('financeiro','dashboard','relatorios','vendas') OR
        (p.modulo = 'configuracoes' AND p.recurso = 'conta')
    )
    ON CONFLICT DO NOTHING;

    -- VISUALIZADOR (só leitura de dashboard + configuracoes conta)
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_viewer, p.id FROM public.permissions p
    WHERE p.acao = 'read' AND (
        p.modulo = 'dashboard' OR
        (p.modulo = 'configuracoes' AND p.recurso = 'conta') OR
        (p.modulo = 'sistema' AND p.recurso = 'notificacoes')
    )
    ON CONFLICT DO NOTHING;

    -- AFILIADO
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_afiliado, p.id FROM public.permissions p
    WHERE (p.modulo = 'afiliados' AND p.recurso IN ('links','comissoes','marketplace') AND p.acao IN ('read','create','update'))
       OR (p.modulo = 'afiliados' AND p.recurso = 'afiliados' AND p.acao = 'read')
       OR (p.modulo = 'financeiro' AND p.recurso IN ('saldo','extrato','saques') AND p.acao IN ('read','create'))
       OR (p.modulo = 'configuracoes' AND p.recurso IN ('conta','seguranca'))
       OR (p.modulo = 'sistema' AND p.recurso = 'notificacoes')
       OR (p.modulo = 'suporte')
       OR (p.modulo = 'dashboard' AND p.recurso = 'visao_geral')
       OR (p.modulo = 'treinamentos' AND p.acao = 'read')
    ON CONFLICT DO NOTHING;

    -- CLIENTE
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT v_role_cliente, p.id FROM public.permissions p
    WHERE (p.modulo = 'configuracoes' AND p.recurso = 'conta')
       OR (p.modulo = 'sistema' AND p.recurso = 'notificacoes')
       OR (p.modulo = 'suporte' AND p.acao IN ('create','read','update'))
       OR (p.modulo = 'treinamentos' AND p.acao = 'read')
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

SELECT public.fn_seed_role_permissions();

-- --------------------------------------------------------------------------
-- FINAL MIGRATION 008 - SEED COMPLETO
-- --------------------------------------------------------------------------
