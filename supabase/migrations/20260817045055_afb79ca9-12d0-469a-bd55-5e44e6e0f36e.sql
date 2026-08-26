-- ==========================================================================
-- MIGRATION 002 - PRODUTOS, CHECKOUTS E LINKS DE PAGAMENTO
-- Cash Engine PRO
-- ==========================================================================

-- --------------------------------------------------------------------------
-- ENUMS ESPECÍFICOS
-- --------------------------------------------------------------------------
CREATE TYPE tipo_produto AS ENUM ('fisico', 'digital', 'assinatura', 'servico', 'ingresso');
CREATE TYPE status_produto AS ENUM ('rascunho', 'publicado', 'arquivado', 'indisponivel');
CREATE TYPE tipo_desconto AS ENUM ('percentual', 'valor_fixo');
CREATE TYPE status_checkout AS ENUM ('rascunho', 'publicado', 'arquivado');
CREATE TYPE status_link_pagamento AS ENUM ('ativo', 'expirado', 'usado', 'desativado');
CREATE TYPE tipo_link_pagamento AS ENUM ('simples', 'produto', 'assinatura', 'doacao', 'personalizado');
CREATE TYPE status_cupom AS ENUM ('ativo', 'inativo', 'expirado');
CREATE TYPE tipo_cupom AS ENUM ('percentual', 'valor_fixo', 'frete_gratis');

-- --------------------------------------------------------------------------
-- TABELA: CATEGORIAS_DE_PRODUTOS
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categorias_produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    banner_url TEXT,
    categoria_pai_id UUID REFERENCES public.categorias_produtos(id) ON DELETE SET NULL,
    ordem INTEGER DEFAULT 0,
    destaque BOOLEAN DEFAULT FALSE,
    ativa BOOLEAN DEFAULT TRUE,
    meta_titulo VARCHAR(255),
    meta_descricao TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(empresa_id, slug)
);

CREATE INDEX idx_categorias_produtos_empresa_id ON public.categorias_produtos(empresa_id);
CREATE INDEX idx_categorias_produtos_slug ON public.categorias_produtos(slug);
CREATE INDEX idx_categorias_produtos_categoria_pai_id ON public.categorias_produtos(categoria_pai_id);

-- --------------------------------------------------------------------------
-- TABELA: PRODUTOS
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    categoria_id UUID REFERENCES public.categorias_produtos(id) ON DELETE SET NULL,
    criado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sku VARCHAR(100),
    nome VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    subtitulo VARCHAR(255),
    descricao_curta TEXT,
    descricao_longa TEXT,
    tipo tipo_produto NOT NULL DEFAULT 'digital',
    preco DECIMAL(12,2) NOT NULL DEFAULT 0,
    preco_promocional DECIMAL(12,2),
    promocao_inicio TIMESTAMPTZ,
    promocao_fim TIMESTAMPTZ,
    custo DECIMAL(12,2) DEFAULT 0,
    moeda VARCHAR(3) DEFAULT 'BRL',
    imagem_principal_url TEXT,
    galeria_urls TEXT[] DEFAULT '{}',
    video_url TEXT,
    status status_produto NOT NULL DEFAULT 'rascunho',
    estoque INTEGER,
    estoque_minimo INTEGER DEFAULT 0,
    gerencia_estoque BOOLEAN DEFAULT FALSE,
    peso DECIMAL(10,2),
    altura DECIMAL(10,2),
    largura DECIMAL(10,2),
    comprimento DECIMAL(10,2),
    ncm VARCHAR(10),
    origem_mercadoria VARCHAR(2),
    permite_parcelamento BOOLEAN DEFAULT TRUE,
    max_parcelas INTEGER DEFAULT 12,
    parcela_minima DECIMAL(12,2) DEFAULT 5.00,
    juros_parcelamento DECIMAL(5,2) DEFAULT 0,
    multa_atraso DECIMAL(5,2) DEFAULT 0,
    juros_ao_dia DECIMAL(5,4) DEFAULT 0,
    periodo_assinatura INTEGER,
    unidade_periodo VARCHAR(10),
    trial_dias INTEGER DEFAULT 0,
    permite_cancelar BOOLEAN DEFAULT TRUE,
    taxa_comissao_afiliado DECIMAL(5,2) DEFAULT 30.00,
    comissao_valor_fixo DECIMAL(12,2),
    destaque BOOLEAN DEFAULT FALSE,
    lancamento BOOLEAN DEFAULT FALSE,
    mais_vendido BOOLEAN DEFAULT FALSE,
    avaliacao_media DECIMAL(3,2) DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0,
    total_vendido INTEGER DEFAULT 0,
    receita_total DECIMAL(15,2) DEFAULT 0,
    integracao_id_externo VARCHAR(255),
    tags VARCHAR(255)[] DEFAULT '{}',
    atributos JSONB DEFAULT '{}'::jsonb,
    especificacoes JSONB DEFAULT '[]'::jsonb,
    arquivos_download TEXT[] DEFAULT '{}',
    termos_uso TEXT,
    politica_reembolso TEXT,
    publicacao_data TIMESTAMPTZ,
    meta_titulo VARCHAR(255),
    meta_descricao TEXT,
    meta_palavras_chave TEXT,
    seo_json JSONB,
    configuracoes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    UNIQUE(empresa_id, slug)
);

CREATE INDEX idx_produtos_empresa_id ON public.produtos(empresa_id);
CREATE INDEX idx_produtos_categoria_id ON public.produtos(categoria_id);
CREATE INDEX idx_produtos_tipo ON public.produtos(tipo);
CREATE INDEX idx_produtos_status ON public.produtos(status);
CREATE INDEX idx_produtos_preco ON public.produtos(preco);
CREATE INDEX idx_produtos_nome_trgm ON public.produtos USING GIN (nome gin_trgm_ops);
CREATE INDEX idx_produtos_slug ON public.produtos(slug);
CREATE INDEX idx_produtos_destaque ON public.produtos(empresa_id, destaque) WHERE destaque = TRUE;
CREATE INDEX idx_produtos_tags ON public.produtos USING GIN (tags);

-- --------------------------------------------------------------------------
-- TABELA: CUPONS
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    criado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    codigo VARCHAR(50) NOT NULL,
    descricao TEXT,
    tipo tipo_cupom NOT NULL DEFAULT 'percentual',
    valor DECIMAL(12,2) NOT NULL,
    valor_minimo_pedido DECIMAL(12,2) DEFAULT 0,
    desconto_maximo DECIMAL(12,2),
    data_inicio TIMESTAMPTZ,
    data_fim TIMESTAMPTZ,
    max_usos INTEGER,
    usos_count INTEGER DEFAULT 0,
    usos_por_cliente INTEGER DEFAULT 1,
    produto_ids UUID[] DEFAULT '{}',
    categoria_ids UUID[] DEFAULT '{}',
    exclusivo_primeira_compra BOOLEAN DEFAULT FALSE,
    permite_empilhamento BOOLEAN DEFAULT FALSE,
    status status_cupom NOT NULL DEFAULT 'ativo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(empresa_id, codigo)
);

CREATE INDEX idx_cupons_empresa_id ON public.cupons(empresa_id);
CREATE INDEX idx_cupons_codigo ON public.cupons(codigo);
CREATE INDEX idx_cupons_status ON public.cupons(status);
CREATE INDEX idx_cupons_datas ON public.cupons(empresa_id, data_inicio, data_fim);

-- --------------------------------------------------------------------------
-- TABELA: TEMPLATES_CHECKOUT
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.templates_checkout (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE SET NULL,
    nome VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    layout VARCHAR(50) DEFAULT 'moderno',
    cor_primaria VARCHAR(9) DEFAULT '#ef4444',
    cor_secundaria VARCHAR(9) DEFAULT '#18181b',
    cor_fundo VARCHAR(9) DEFAULT '#09090b',
    cor_texto VARCHAR(9) DEFAULT '#f4f4f5',
    fonte VARCHAR(50) DEFAULT 'Inter',
    logo_url TEXT,
    banner_url TEXT,
    imagem_fundo_url TEXT,
    video_fundo_url TEXT,
    titulo_checkout VARCHAR(255) DEFAULT 'Finalizar compra',
    subtitulo_checkout VARCHAR(255),
    mensagem_sucesso TEXT,
    url_redirecionamento_sucesso TEXT,
    termo_compromisso TEXT,
    mostrar_bandeiras_cartao BOOLEAN DEFAULT TRUE,
    mostrar_pagamento_pix BOOLEAN DEFAULT TRUE,
    mostrar_pagamento_boleto BOOLEAN DEFAULT TRUE,
    mostrar_pagamento_cartao BOOLEAN DEFAULT TRUE,
    mostrar_desconto_pix DECIMAL(5,2) DEFAULT 10.00,
    parcelamento_maximo INTEGER DEFAULT 12,
    parcelamento_juros DECIMAL(5,2) DEFAULT 0,
    parcelamento_sem_juros INTEGER DEFAULT 3,
    valor_minimo_parcela DECIMAL(12,2) DEFAULT 5.00,
    pedir_cpf BOOLEAN DEFAULT TRUE,
    pedir_rg BOOLEAN DEFAULT FALSE,
    pedir_telefone BOOLEAN DEFAULT TRUE,
    pedir_endereco BOOLEAN DEFAULT TRUE,
    pedir_nascimento BOOLEAN DEFAULT FALSE,
    pedir_genero BOOLEAN DEFAULT FALSE,
    campos_personalizados JSONB DEFAULT '[]'::jsonb,
    secoes_visiveis JSONB DEFAULT '{"resumo": true, "cupom": true, "pagamento": true, "endereco": true}'::jsonb,
    scripts_customizados TEXT,
    css_customizado TEXT,
    pixel_facebook_id VARCHAR(50),
    pixel_google_id VARCHAR(50),
    tag_manager_id VARCHAR(50),
    hotmart_id VARCHAR(50),
    gtm_id VARCHAR(50),
    ga4_id VARCHAR(50),
    is_padrao BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE NULLS NOT DISTINCT (empresa_id, slug)
);

CREATE INDEX idx_templates_checkout_empresa_id ON public.templates_checkout(empresa_id);

-- --------------------------------------------------------------------------
-- TABELA: CHECKOUTS
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.checkouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    criado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    template_id UUID REFERENCES public.templates_checkout(id) ON DELETE SET NULL,
    produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
    nome VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    banner_url TEXT,
    status status_checkout NOT NULL DEFAULT 'rascunho',
    produtos_config JSONB NOT NULL DEFAULT '[]'::jsonb,
    valor_minimo DECIMAL(12,2),
    valor_maximo DECIMAL(12,2),
    valor_sugerido DECIMAL(12,2),
    permitir_valor_personalizado BOOLEAN DEFAULT FALSE,
    frete_tipo VARCHAR(20) DEFAULT 'gratis',
    frete_valor_gratis_minimo DECIMAL(12,2),
    cupom_id UUID REFERENCES public.cupons(id) ON DELETE SET NULL,
    cupons_aceitos UUID[] DEFAULT '{}',
    permite_multiplos_cupons BOOLEAN DEFAULT FALSE,
    obrigar_cadastro BOOLEAN DEFAULT FALSE,
    permite_convidado BOOLEAN DEFAULT TRUE,
    prazo_expiracao INTEGER,
    unidade_expiracao VARCHAR(10) DEFAULT 'horas',
    maximo_por_cliente INTEGER,
    maximo_total_vendas INTEGER,
    total_vendido INTEGER DEFAULT 0,
    total_arrecadado DECIMAL(15,2) DEFAULT 0,
    afiliado_requerido BOOLEAN DEFAULT FALSE,
    taxa_afiliado_padrao DECIMAL(5,2) DEFAULT 30.00,
    pixel_facebook_id VARCHAR(50),
    pixel_google_id VARCHAR(50),
    gtm_id VARCHAR(50),
    ga4_id VARCHAR(50),
    webhook_url TEXT,
    termos_servico TEXT,
    politica_privacidade TEXT,
    url_sucesso TEXT,
    url_falha TEXT,
    url_cancelamento TEXT,
    customizacao_override JSONB,
    publicacao_data TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(empresa_id, slug)
);

CREATE INDEX idx_checkouts_empresa_id ON public.checkouts(empresa_id);
CREATE INDEX idx_checkouts_produto_id ON public.checkouts(produto_id);
CREATE INDEX idx_checkouts_status ON public.checkouts(status);
CREATE INDEX idx_checkouts_slug ON public.checkouts(slug);

-- --------------------------------------------------------------------------
-- TABELA: LINKS_DE_PAGAMENTO
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.links_pagamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    criado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    checkout_id UUID REFERENCES public.checkouts(id) ON DELETE SET NULL,
    produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
    cupom_id UUID REFERENCES public.cupons(id) ON DELETE SET NULL,
    afiliado_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    tipo tipo_link_pagamento NOT NULL DEFAULT 'simples',
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    codigo_unico VARCHAR(32) UNIQUE NOT NULL,
    valor DECIMAL(12,2) NOT NULL DEFAULT 0,
    valor_original DECIMAL(12,2),
    moeda VARCHAR(3) DEFAULT 'BRL',
    status status_link_pagamento NOT NULL DEFAULT 'ativo',
    max_usos INTEGER,
    contador_usos INTEGER DEFAULT 0,
    permite_editar_valor BOOLEAN DEFAULT FALSE,
    data_expiracao TIMESTAMPTZ,
    nome_cliente_obrigatorio BOOLEAN DEFAULT TRUE,
    email_cliente_obrigatorio BOOLEAN DEFAULT TRUE,
    telefone_cliente_obrigatorio BOOLEAN DEFAULT FALSE,
    cpf_cliente_obrigatorio BOOLEAN DEFAULT TRUE,
    endereco_cliente_obrigatorio BOOLEAN DEFAULT FALSE,
    url_redirecionamento_sucesso TEXT,
    notificar_email_criador BOOLEAN DEFAULT TRUE,
    notificar_whatsapp_criador BOOLEAN DEFAULT FALSE,
    mensagem_sucesso_personalizada TEXT,
    campanha_nome VARCHAR(255),
    fonte_trafego VARCHAR(100),
    termo_utm VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    webhook_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_links_pagamento_empresa_id ON public.links_pagamento(empresa_id);
CREATE INDEX idx_links_pagamento_codigo_unico ON public.links_pagamento(codigo_unico);
CREATE INDEX idx_links_pagamento_status ON public.links_pagamento(status);
CREATE INDEX idx_links_pagamento_checkout_id ON public.links_pagamento(checkout_id);
CREATE INDEX idx_links_pagamento_produto_id ON public.links_pagamento(produto_id);
CREATE INDEX idx_links_pagamento_tipo ON public.links_pagamento(tipo);

-- --------------------------------------------------------------------------
-- TABELA: CLIENTES
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome_completo VARCHAR(255) NOT NULL,
    nome_social VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    celular VARCHAR(20),
    cpf VARCHAR(14),
    cnpj VARCHAR(20),
    tipo_pessoa CHAR(2) DEFAULT 'PF',
    rg VARCHAR(20),
    data_nascimento DATE,
    sexo CHAR(1),
    cep VARCHAR(10),
    logradouro VARCHAR(255),
    numero VARCHAR(30),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    pais VARCHAR(50) DEFAULT 'Brasil',
    aceita_marketing BOOLEAN DEFAULT FALSE,
    aceita_termos BOOLEAN DEFAULT TRUE,
    origem_captacao VARCHAR(100),
    data_primeira_compra DATE,
    data_ultima_compra DATE,
    total_pedidos INTEGER DEFAULT 0,
    total_gasto DECIMAL(15,2) DEFAULT 0,
    ticket_medio DECIMAL(15,2) DEFAULT 0,
    pontos_fidelidade INTEGER DEFAULT 0,
    nivel_cliente VARCHAR(20) DEFAULT 'bronze',
    observacoes TEXT,
    tags VARCHAR(255)[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'::jsonb,
    integrado_hotmart_id VARCHAR(255),
    integrado_kiwify_id VARCHAR(255),
    integrado_monetizze_id VARCHAR(255),
    status status_ativo NOT NULL DEFAULT 'ativo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(empresa_id, email),
    UNIQUE NULLS NOT DISTINCT (empresa_id, cpf),
    UNIQUE NULLS NOT DISTINCT (empresa_id, cnpj)
);

CREATE INDEX idx_clientes_empresa_id ON public.clientes(empresa_id);
CREATE INDEX idx_clientes_email ON public.clientes(email);
CREATE INDEX idx_clientes_cpf ON public.clientes(cpf);
CREATE INDEX idx_clientes_nome_trgm ON public.clientes USING GIN (nome_completo gin_trgm_ops);
CREATE INDEX idx_clientes_status ON public.clientes(status);
CREATE INDEX idx_clientes_nivel ON public.clientes(nivel_cliente);
CREATE INDEX idx_clientes_tags ON public.clientes USING GIN (tags);

-- --------------------------------------------------------------------------
-- FINAL MIGRATION 002
-- --------------------------------------------------------------------------