-- ==========================================================================
-- MIGRATION 003 - AFILIADOS, MARKETPLACE E VINCULOS
-- Cash Engine PRO
-- ==========================================================================

-- --------------------------------------------------------------------------
-- ENUMS
-- --------------------------------------------------------------------------
CREATE TYPE status_afiliado AS ENUM ('pendente', 'ativo', 'inativo', 'suspenso', 'banido');
CREATE TYPE status_comissao AS ENUM ('pendente', 'aprovada', 'liberada', 'paga', 'cancelada', 'estornada');
CREATE TYPE status_marketplace_produto AS ENUM ('pendente_aprovacao', 'publicado', 'rejeitado', 'arquivado');
CREATE TYPE tipo_rede_afiliado AS ENUM ('uninivel', 'binario', 'matriz');

-- --------------------------------------------------------------------------
-- TABELA: AFILIADOS (Vinculo formal de profile como afiliado de uma empresa)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.afiliados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    convite_id UUID REFERENCES public.invites(id) ON DELETE SET NULL,
    indicado_por_afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE SET NULL,
    codigo_afiliado VARCHAR(32) UNIQUE NOT NULL,
    taxa_comissao_padrao DECIMAL(5,2) DEFAULT 30.00,
    taxa_comissao_recorrente DECIMAL(5,2),
    nivel_rede INTEGER DEFAULT 1,
    status status_afiliado NOT NULL DEFAULT 'pendente',
    dados_bancarios JSONB,
    chave_pix VARCHAR(255),
    tipo_chave_pix VARCHAR(20),
    titular_conta VARCHAR(255),
    documento_titular VARCHAR(20),
    link_personalizado VARCHAR(255),
    subdominio VARCHAR(100),
    minimo_saque DECIMAL(12,2) DEFAULT 50.00,
    limite_diario_geracao_link INTEGER DEFAULT 100,
    biografia TEXT,
    redes_sociais JSONB DEFAULT '{}'::jsonb,
    midia_kit_url TEXT,
    documentacao_enviada BOOLEAN DEFAULT FALSE,
    documentos_verificados BOOLEAN DEFAULT FALSE,
    data_aprovacao TIMESTAMPTZ,
    aprovado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    motivo_rejeicao TEXT,
    ultimo_acesso TIMESTAMPTZ,
    total_cliques INTEGER DEFAULT 0,
    total_visualizacoes INTEGER DEFAULT 0,
    total_leads INTEGER DEFAULT 0,
    total_vendas INTEGER DEFAULT 0,
    total_vendas_confirmadas INTEGER DEFAULT 0,
    total_comissao_bruta DECIMAL(15,2) DEFAULT 0,
    total_comissao_liquida DECIMAL(15,2) DEFAULT 0,
    total_sacado DECIMAL(15,2) DEFAULT 0,
    saldo_pendente DECIMAL(15,2) DEFAULT 0,
    saldo_aprovado DECIMAL(15,2) DEFAULT 0,
    saldo_disponivel DECIMAL(15,2) DEFAULT 0,
    ticket_medio_vendas DECIMAL(15,2) DEFAULT 0,
    taxa_conversao DECIMAL(5,2) DEFAULT 0,
    ranking_posicao INTEGER,
    tier VARCHAR(20) DEFAULT 'bronze',
    pontos_desempenho INTEGER DEFAULT 0,
    preferencias_comunicacao JSONB DEFAULT '{}'::jsonb,
    regras_especiais JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(empresa_id, profile_id),
    UNIQUE(empresa_id, codigo_afiliado)
);

CREATE INDEX idx_afiliados_empresa_id ON public.afiliados(empresa_id);
CREATE INDEX idx_afiliados_profile_id ON public.afiliados(profile_id);
CREATE INDEX idx_afiliados_status ON public.afiliados(status);
CREATE INDEX idx_afiliados_codigo ON public.afiliados(codigo_afiliado);
CREATE INDEX idx_afiliados_indicado_por ON public.afiliados(indicado_por_afiliado_id);
CREATE INDEX idx_afiliados_tier ON public.afiliados(tier);
CREATE INDEX idx_afiliados_ranking ON public.afiliados(empresa_id, total_vendas DESC);

-- --------------------------------------------------------------------------
-- TABELA: AFILIADOS_PRODUTOS_PERMISSÕES (quais produtos o afiliado pode promover)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.afiliados_produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    afiliado_id UUID NOT NULL REFERENCES public.afiliados(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    taxa_comissao_personalizada DECIMAL(5,2),
    comissao_valor_fixo DECIMAL(12,2),
    data_inicio TIMESTAMPTZ,
    data_fim TIMESTAMPTZ,
    maximo_comissao_periodo DECIMAL(15,2),
    total_comissao_gerada DECIMAL(15,2) DEFAULT 0,
    total_vendas INTEGER DEFAULT 0,
    autorizado_em TIMESTAMPTZ,
    autorizado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(afiliado_id, produto_id)
);

CREATE INDEX idx_afiliados_produtos_afiliado_id ON public.afiliados_produtos(afiliado_id);
CREATE INDEX idx_afiliados_produtos_produto_id ON public.afiliados_produtos(produto_id);
CREATE INDEX idx_afiliados_produtos_empresa_id ON public.afiliados_produtos(empresa_id);

-- --------------------------------------------------------------------------
-- TABELA: LINKS_AFILIADOS (Links de afiliado criados)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.links_afiliados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    afiliado_id UUID NOT NULL REFERENCES public.afiliados(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
    checkout_id UUID REFERENCES public.checkouts(id) ON DELETE SET NULL,
    link_pagamento_id UUID REFERENCES public.links_pagamento(id) ON DELETE SET NULL,
    nome_campanha VARCHAR(255),
    slug_personalizado VARCHAR(100),
    url_destino TEXT NOT NULL,
    url_curta VARCHAR(255),
    codigo_rastreio VARCHAR(32) UNIQUE NOT NULL,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    parametros_extra JSONB DEFAULT '{}'::jsonb,
    total_cliques INTEGER DEFAULT 0,
    total_visualizacoes INTEGER DEFAULT 0,
    total_conversoes INTEGER DEFAULT 0,
    total_vendas INTEGER DEFAULT 0,
    taxa_conversao DECIMAL(5,2) DEFAULT 0,
    data_inicio TIMESTAMPTZ,
    data_fim TIMESTAMPTZ,
    status status_link_pagamento NOT NULL DEFAULT 'ativo',
    criado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_links_afiliados_afiliado_id ON public.links_afiliados(afiliado_id);
CREATE INDEX idx_links_afiliados_produto_id ON public.links_afiliados(produto_id);
CREATE INDEX idx_links_afiliados_status ON public.links_afiliados(status);
CREATE INDEX idx_links_afiliados_codigo ON public.links_afiliados(codigo_rastreio);
CREATE INDEX idx_links_afiliados_empresa_id ON public.links_afiliados(empresa_id);

-- --------------------------------------------------------------------------
-- TABELA: COMISSOES (Geradas por cada venda de afiliado)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comissoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    afiliado_id UUID NOT NULL REFERENCES public.afiliados(id) ON DELETE CASCADE,
    indicado_por_afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE SET NULL,
    produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
    transacao_id UUID,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    link_afiliado_id UUID REFERENCES public.links_afiliados(id) ON DELETE SET NULL,
    valor_venda DECIMAL(12,2) NOT NULL,
    taxa_comissao_percentual DECIMAL(5,2) NOT NULL,
    valor_comissao_bruta DECIMAL(12,2) NOT NULL,
    descontos_aplicados DECIMAL(12,2) DEFAULT 0,
    taxa_plataforma DECIMAL(12,2) DEFAULT 0,
    taxa_processamento DECIMAL(12,2) DEFAULT 0,
    valor_comissao_liquida DECIMAL(12,2) NOT NULL,
    moeda VARCHAR(3) DEFAULT 'BRL',
    status status_comissao NOT NULL DEFAULT 'pendente',
    tipo_venda VARCHAR(20) DEFAULT 'unica',
    parcela_numero INTEGER DEFAULT 1,
    total_parcelas INTEGER DEFAULT 1,
    periodo_recorrencia INTEGER,
    data_prevista_liberacao TIMESTAMPTZ,
    data_aprovacao TIMESTAMPTZ,
    data_pagamento TIMESTAMPTZ,
    data_cancelamento TIMESTAMPTZ,
    aprovado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    cancelado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    motivo_cancelamento TEXT,
    saque_id UUID,
    id_transacao_externo VARCHAR(255),
    origem_trafego VARCHAR(100),
    nota_interna TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_comissoes_empresa_id ON public.comissoes(empresa_id);
CREATE INDEX idx_comissoes_afiliado_id ON public.comissoes(afiliado_id);
CREATE INDEX idx_comissoes_status ON public.comissoes(status);
CREATE INDEX idx_comissoes_produto_id ON public.comissoes(produto_id);
CREATE INDEX idx_comissoes_data_prevista ON public.comissoes(data_prevista_liberacao);
CREATE INDEX idx_comissoes_created ON public.comissoes(created_at DESC);
CREATE INDEX idx_comissoes_saque_id ON public.comissoes(saque_id);

-- --------------------------------------------------------------------------
-- TABELA: MARKETPLACE_PRODUTOS (Produtos disponíveis no marketplace)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_vendedora_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    enviado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    titulo_marketplace VARCHAR(255) NOT NULL,
    subtitulo_marketplace VARCHAR(255),
    descricao_marketplace TEXT NOT NULL,
    imagem_destaque TEXT NOT NULL,
    galeria_marketplace TEXT[] DEFAULT '{}',
    video_promocional_url TEXT,
    categoria_marketplace VARCHAR(100),
    subcategoria_marketplace VARCHAR(100),
    tags_marketplace VARCHAR(255)[] DEFAULT '{}',
    preco_marketplace DECIMAL(12,2) NOT NULL,
    taxa_comissao_oferecida DECIMAL(5,2) NOT NULL DEFAULT 30.00,
    comissao_valor_fixo_oferecida DECIMAL(12,2),
    recorrencia_ativa BOOLEAN DEFAULT FALSE,
    taxa_comissao_recorrente DECIMAL(5,2),
    avaliacao_media DECIMAL(3,2) DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0,
    total_vendas_total INTEGER DEFAULT 0,
    total_afiliados_ativos INTEGER DEFAULT 0,
    nivel_qualidade INTEGER DEFAULT 3,
    palavras_chave VARCHAR(500),
    faixa_etaria VARCHAR(20),
    publico_alvo TEXT,
    material_apoio_disponivel TEXT[] DEFAULT '{}',
    url_pagina_vendas TEXT,
    url_pagina_obrigacoes TEXT,
    politica_reembolso_marketplace TEXT,
    termos_condicoes_marketplace TEXT,
    status status_marketplace_produto NOT NULL DEFAULT 'pendente_aprovacao',
    revisado_em TIMESTAMPTZ,
    revisado_por UUID,
    motivo_rejeicao TEXT,
    destaque_marketplace BOOLEAN DEFAULT FALSE,
    data_destaque TIMESTAMPTZ,
    ordem_destaque INTEGER DEFAULT 0,
    data_publicacao TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_marketplace_produtos_empresa_vendedora ON public.marketplace_produtos(empresa_vendedora_id);
CREATE INDEX idx_marketplace_produtos_status ON public.marketplace_produtos(status);
CREATE INDEX idx_marketplace_produtos_categoria ON public.marketplace_produtos(categoria_marketplace);
CREATE INDEX idx_marketplace_produtos_comissao ON public.marketplace_produtos(taxa_comissao_oferecida DESC);
CREATE INDEX idx_marketplace_produtos_destaque ON public.marketplace_produtos(destaque_marketplace) WHERE destaque_marketplace = TRUE;
CREATE INDEX idx_marketplace_produtos_publicados ON public.marketplace_produtos(status, created_at DESC) WHERE status = 'publicado';
CREATE INDEX idx_marketplace_produtos_titulo_trgm ON public.marketplace_produtos USING GIN (titulo_marketplace gin_trgm_ops);
CREATE INDEX idx_marketplace_produtos_tags ON public.marketplace_produtos USING GIN (tags_marketplace);

-- --------------------------------------------------------------------------
-- TABELA: MARKETPLACE_INSCRICOES (Afiliados que se inscreveram para promover)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_inscricoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marketplace_produto_id UUID NOT NULL REFERENCES public.marketplace_produtos(id) ON DELETE CASCADE,
    afiliado_id UUID NOT NULL REFERENCES public.afiliados(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
    data_inscricao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    aprovada_em TIMESTAMPTZ,
    aprovada_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rejeitada_em TIMESTAMPTZ,
    motivo_rejeicao TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    taxa_comissao_aplicada DECIMAL(5,2),
    total_vendas INTEGER DEFAULT 0,
    total_comissao_gerada DECIMAL(15,2) DEFAULT 0,
    data_ultima_venda TIMESTAMPTZ,
    ativa BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(marketplace_produto_id, afiliado_id)
);

CREATE INDEX idx_marketplace_inscricoes_afiliado ON public.marketplace_inscricoes(afiliado_id);
CREATE INDEX idx_marketplace_inscricoes_produto ON public.marketplace_inscricoes(marketplace_produto_id);
CREATE INDEX idx_marketplace_inscricoes_status ON public.marketplace_inscricoes(status);

-- --------------------------------------------------------------------------
-- TABELA: REDE_AFILIADOS_HIERARQUIA (Para MLM)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rede_afiliados_hierarquia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    afiliado_pai_id UUID NOT NULL REFERENCES public.afiliados(id) ON DELETE CASCADE,
    afiliado_filho_id UUID NOT NULL REFERENCES public.afiliados(id) ON DELETE CASCADE,
    nivel INTEGER NOT NULL DEFAULT 1,
    lado VARCHAR(10),
    posicao INTEGER,
    data_associacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ativa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(empresa_id, afiliado_pai_id, afiliado_filho_id)
);

CREATE INDEX idx_rede_afiliados_pai ON public.rede_afiliados_hierarquia(afiliado_pai_id);
CREATE INDEX idx_rede_afiliados_filho ON public.rede_afiliados_hierarquia(afiliado_filho_id);
CREATE INDEX idx_rede_afiliados_nivel ON public.rede_afiliados_hierarquia(empresa_id, nivel);

-- --------------------------------------------------------------------------
-- FINAL MIGRATION 003
-- --------------------------------------------------------------------------