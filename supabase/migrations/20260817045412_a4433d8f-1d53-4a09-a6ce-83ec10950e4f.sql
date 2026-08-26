-- ==========================================================================
-- MIGRATION 004 - FINANCEIRO: TRANSAÇÕES, SALDO, SAQUES, ESTORNOS, REPASSES
-- Cash Engine PRO
-- ==========================================================================

CREATE TYPE status_transacao AS ENUM (
    'pendente', 'processando', 'aprovada', 'autorizada', 'capturada',
    'paga', 'disponivel', 'atrasada', 'cancelada', 'rejeitada',
    'estornada_parcial', 'estornada_total', 'reembolsada', 'chargeback',
    'em_disputa', 'falhou', 'expirada'
);
CREATE TYPE tipo_transacao AS ENUM (
    'venda', 'assinatura', 'saque', 'transferencia_entrada',
    'transferencia_saida', 'estorno', 'reembolso', 'chargeback',
    'taxa_plataforma', 'ajuste_credito', 'ajuste_debito',
    'pagamento_comissao', 'recolhimento_imposto', 'boleto_gerado',
    'link_pagamento', 'recarga_saldo', 'cancelamento'
);
CREATE TYPE metodo_pagamento AS ENUM (
    'pix', 'cartao_credito', 'cartao_debito', 'boleto', 'ted',
    'doc', 'picpay', 'mercadopago', 'paypal', 'transferencia',
    'saldo_conta', 'outro'
);
CREATE TYPE status_saque AS ENUM (
    'solicitado', 'em_analise', 'aprovado', 'processando',
    'enviado', 'pago', 'cancelado', 'rejeitado', 'falhou'
);
CREATE TYPE status_repasse AS ENUM (
    'agendado', 'processando', 'enviado', 'recebido',
    'confirmado', 'cancelado', 'falhou'
);
CREATE TYPE status_estorno AS ENUM (
    'solicitado', 'processando', 'aprovado_parcial', 'aprovado_total',
    'concluido', 'rejeitado', 'cancelado', 'em_disputa'
);
CREATE TYPE tipo_conta AS ENUM ('corrente', 'poupanca', 'pagamento', 'juridica');

CREATE TABLE IF NOT EXISTS public.contas_bancarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE CASCADE,
    titular VARCHAR(255) NOT NULL,
    documento_titular VARCHAR(20) NOT NULL,
    banco_codigo VARCHAR(10) NOT NULL,
    banco_nome VARCHAR(100) NOT NULL,
    agencia VARCHAR(20) NOT NULL,
    agencia_dv VARCHAR(5),
    conta VARCHAR(30) NOT NULL,
    conta_dv VARCHAR(5),
    tipo_conta tipo_conta NOT NULL DEFAULT 'corrente',
    chave_pix VARCHAR(255),
    tipo_chave_pix VARCHAR(20),
    is_verificada BOOLEAN DEFAULT FALSE,
    data_verificacao TIMESTAMPTZ,
    documento_verificacao_url TEXT,
    principal BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT contas_chk_titular CHECK (
        (empresa_id IS NOT NULL)::INTEGER +
        (profile_id IS NOT NULL)::INTEGER +
        (afiliado_id IS NOT NULL)::INTEGER = 1
    )
);

CREATE INDEX idx_contas_bancarias_empresa ON public.contas_bancarias(empresa_id);
CREATE INDEX idx_contas_bancarias_profile ON public.contas_bancarias(profile_id);
CREATE INDEX idx_contas_bancarias_afiliado ON public.contas_bancarias(afiliado_id);

CREATE TABLE IF NOT EXISTS public.saldos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE CASCADE,
    saldo_bruto DECIMAL(15,2) NOT NULL DEFAULT 0,
    saldo_bloqueado DECIMAL(15,2) NOT NULL DEFAULT 0,
    saldo_disponivel DECIMAL(15,2) NOT NULL DEFAULT 0,
    saldo_em_analise DECIMAL(15,2) NOT NULL DEFAULT 0,
    saldo_estornado DECIMAL(15,2) NOT NULL DEFAULT 0,
    saldo_previsao_liberar DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_entrado_historico DECIMAL(18,2) NOT NULL DEFAULT 0,
    total_saido_historico DECIMAL(18,2) NOT NULL DEFAULT 0,
    total_sacado DECIMAL(18,2) NOT NULL DEFAULT 0,
    total_com_impostos DECIMAL(18,2) DEFAULT 0,
    moeda VARCHAR(3) DEFAULT 'BRL',
    ultimo_movimento TIMESTAMPTZ,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT saldos_chk_entidade CHECK (
        (empresa_id IS NOT NULL)::INTEGER +
        (profile_id IS NOT NULL)::INTEGER +
        (afiliado_id IS NOT NULL)::INTEGER = 1
    ),
    UNIQUE NULLS NOT DISTINCT (empresa_id, profile_id, afiliado_id)
);

CREATE UNIQUE INDEX idx_saldos_empresa_unico ON public.saldos(empresa_id) WHERE empresa_id IS NOT NULL;
CREATE UNIQUE INDEX idx_saldos_profile_unico ON public.saldos(profile_id) WHERE profile_id IS NOT NULL;
CREATE UNIQUE INDEX idx_saldos_afiliado_unico ON public.saldos(afiliado_id) WHERE afiliado_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.transacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE SET NULL,
    produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
    checkout_id UUID REFERENCES public.checkouts(id) ON DELETE SET NULL,
    link_pagamento_id UUID REFERENCES public.links_pagamento(id) ON DELETE SET NULL,
    cupom_id UUID REFERENCES public.cupons(id) ON DELETE SET NULL,
    assinatura_id UUID,
    pedido_numero VARCHAR(32) UNIQUE,
    codigo_externo VARCHAR(255),
    id_transacao_gateway VARCHAR(255),
    tipo tipo_transacao NOT NULL,
    metodo_pagamento metodo_pagamento,
    status status_transacao NOT NULL DEFAULT 'pendente',
    valor_bruto DECIMAL(15,2) NOT NULL,
    valor_descontos DECIMAL(12,2) DEFAULT 0,
    valor_juros DECIMAL(12,2) DEFAULT 0,
    valor_multa DECIMAL(12,2) DEFAULT 0,
    valor_taxa_plataforma DECIMAL(12,2) DEFAULT 0,
    valor_taxa_processamento DECIMAL(12,2) DEFAULT 0,
    valor_taxa_antecipacao DECIMAL(12,2) DEFAULT 0,
    valor_impostos DECIMAL(12,2) DEFAULT 0,
    valor_liquido DECIMAL(15,2) NOT NULL,
    moeda VARCHAR(3) DEFAULT 'BRL',
    valor_original_moeda DECIMAL(15,2),
    moeda_original VARCHAR(3),
    taxa_cambio DECIMAL(12,6),
    parcelas INTEGER DEFAULT 1,
    parcela_atual INTEGER DEFAULT 1,
    valor_parcela DECIMAL(12,2),
    data_vencimento DATE,
    data_pagamento TIMESTAMPTZ,
    data_estorno TIMESTAMPTZ,
    data_disponivel TIMESTAMPTZ,
    data_expiracao TIMESTAMPTZ,
    codigo_boleto_barras TEXT,
    codigo_boleto_linha TEXT,
    pix_qrcode TEXT,
    pix_copia_cola TEXT,
    pix_expiracao TIMESTAMPTZ,
    cartao_final VARCHAR(4),
    cartao_bandeira VARCHAR(30),
    cartao_titular VARCHAR(255),
    cartao_parcelado_mercado BOOLEAN DEFAULT FALSE,
    nsu VARCHAR(30),
    autorizacao_codigo VARCHAR(30),
    tid VARCHAR(50),
    split_pagamento JSONB DEFAULT '[]'::jsonb,
    dados_entrega JSONB,
    endereco_cobranca JSONB,
    ip_cliente VARCHAR(45),
    origem_dispositivo VARCHAR(30),
    risco_score INTEGER,
    risco_nivel VARCHAR(20),
    regras_antifraude JSONB DEFAULT '[]'::jsonb,
    url_callback TEXT,
    notas_internas TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    criado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transacoes_empresa_id ON public.transacoes(empresa_id);
CREATE INDEX idx_transacoes_status ON public.transacoes(status);
CREATE INDEX idx_transacoes_tipo ON public.transacoes(tipo);
CREATE INDEX idx_transacoes_metodo ON public.transacoes(metodo_pagamento);
CREATE INDEX idx_transacoes_cliente ON public.transacoes(cliente_id);
CREATE INDEX idx_transacoes_afiliado ON public.transacoes(afiliado_id);
CREATE INDEX idx_transacoes_pedido ON public.transacoes(pedido_numero);
CREATE INDEX idx_transacoes_externo ON public.transacoes(id_transacao_gateway);
CREATE INDEX idx_transacoes_created ON public.transacoes(created_at DESC);
CREATE INDEX idx_transacoes_vencimento ON public.transacoes(data_vencimento);
CREATE INDEX idx_transacoes_pagamento ON public.transacoes(data_pagamento);
CREATE INDEX idx_transacoes_valor ON public.transacoes(empresa_id, valor_bruto DESC);
CREATE INDEX idx_transacoes_combinado ON public.transacoes(empresa_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.transacoes_parcelas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transacao_id UUID NOT NULL REFERENCES public.transacoes(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    numero_parcela INTEGER NOT NULL,
    total_parcelas INTEGER NOT NULL,
    valor_parcela DECIMAL(12,2) NOT NULL,
    valor_juros DECIMAL(12,2) DEFAULT 0,
    valor_amortizado DECIMAL(12,2) DEFAULT 0,
    saldo_devedor DECIMAL(12,2) DEFAULT 0,
    data_vencimento DATE NOT NULL,
    data_pagamento TIMESTAMPTZ,
    data_disponivel TIMESTAMPTZ,
    status status_transacao NOT NULL DEFAULT 'pendente',
    id_parcela_gateway VARCHAR(255),
    taxa_antecipacao DECIMAL(12,2) DEFAULT 0,
    valor_liquido_parcela DECIMAL(12,2),
    valor_taxa_processamento DECIMAL(12,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(transacao_id, numero_parcela)
);

CREATE INDEX idx_transacoes_parcelas_transacao ON public.transacoes_parcelas(transacao_id);
CREATE INDEX idx_transacoes_parcelas_vencimento ON public.transacoes_parcelas(data_vencimento);
CREATE INDEX idx_transacoes_parcelas_status ON public.transacoes_parcelas(status);

CREATE TABLE IF NOT EXISTS public.saques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE CASCADE,
    conta_bancaria_id UUID REFERENCES public.contas_bancarias(id) ON DELETE SET NULL,
    protocolo VARCHAR(32) UNIQUE NOT NULL,
    valor_solicitado DECIMAL(15,2) NOT NULL,
    taxa_saque DECIMAL(12,2) DEFAULT 0,
    valor_liquido DECIMAL(15,2) NOT NULL,
    moeda VARCHAR(3) DEFAULT 'BRL',
    metodo_saque VARCHAR(20) NOT NULL DEFAULT 'pix',
    status status_saque NOT NULL DEFAULT 'solicitado',
    data_solicitacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_analise TIMESTAMPTZ,
    data_aprovacao TIMESTAMPTZ,
    data_envio TIMESTAMPTZ,
    data_pagamento TIMESTAMPTZ,
    data_cancelamento TIMESTAMPTZ,
    data_rejeicao TIMESTAMPTZ,
    analisado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    aprovado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    cancelado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rejeitado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    motivo_rejeicao TEXT,
    motivo_cancelamento TEXT,
    comprovante_url TEXT,
    id_transferencia_externa VARCHAR(255),
    autenticacao_bancaria TEXT,
    observacoes TEXT,
    comissoes_ids UUID[] DEFAULT '{}',
    transacoes_ids UUID[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT saques_chk_solicitante CHECK (
        (empresa_id IS NOT NULL)::INTEGER +
        (profile_id IS NOT NULL)::INTEGER +
        (afiliado_id IS NOT NULL)::INTEGER = 1
    )
);

CREATE INDEX idx_saques_empresa ON public.saques(empresa_id);
CREATE INDEX idx_saques_profile ON public.saques(profile_id);
CREATE INDEX idx_saques_afiliado ON public.saques(afiliado_id);
CREATE INDEX idx_saques_status ON public.saques(status);
CREATE INDEX idx_saques_protocolo ON public.saques(protocolo);
CREATE INDEX idx_saques_solicitacao ON public.saques(data_solicitacao DESC);

CREATE TABLE IF NOT EXISTS public.estornos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    transacao_id UUID NOT NULL REFERENCES public.transacoes(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    saque_relacionado_id UUID REFERENCES public.saques(id) ON DELETE SET NULL,
    protocolo VARCHAR(32) UNIQUE NOT NULL,
    valor_original DECIMAL(15,2) NOT NULL,
    valor_solicitado_estorno DECIMAL(15,2) NOT NULL,
    valor_aprovado_estorno DECIMAL(15,2),
    valor_efetivamente_estornado DECIMAL(15,2),
    taxa_estorno DECIMAL(12,2) DEFAULT 0,
    motivo VARCHAR(100) NOT NULL,
    detalhamento_motivo TEXT,
    pedido_cliente_motivo TEXT,
    tipo_estorno VARCHAR(20) NOT NULL DEFAULT 'total',
    status status_estorno NOT NULL DEFAULT 'solicitado',
    metodo_estorno VARCHAR(30) DEFAULT 'origem',
    dados_estorno_alternativo JSONB,
    data_solicitacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_analise TIMESTAMPTZ,
    data_aprovacao TIMESTAMPTZ,
    data_conclusao TIMESTAMPTZ,
    data_cancelamento TIMESTAMPTZ,
    solicitado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    analisado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    aprovado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rejeitado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    comprovantes_urls TEXT[] DEFAULT '{}',
    id_estorno_gateway VARCHAR(255),
    observacoes_internas TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_estornos_empresa ON public.estornos(empresa_id);
CREATE INDEX idx_estornos_transacao ON public.estornos(transacao_id);
CREATE INDEX idx_estornos_status ON public.estornos(status);
CREATE INDEX idx_estornos_cliente ON public.estornos(cliente_id);

CREATE TABLE IF NOT EXISTS public.chargebacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    transacao_id UUID NOT NULL REFERENCES public.transacoes(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    protocolo VARCHAR(32) UNIQUE NOT NULL,
    codigo_chargeback_banco VARCHAR(100),
    motivo_banco VARCHAR(255),
    valor_chargeback DECIMAL(15,2) NOT NULL,
    valor_multa_banco DECIMAL(12,2) DEFAULT 0,
    valor_total_prejuizo DECIMAL(15,2) NOT NULL,
    moeda VARCHAR(3) DEFAULT 'BRL',
    data_ocorrencia TIMESTAMPTZ,
    data_notificacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_limite_resposta TIMESTAMPTZ,
    data_resposta_enviada TIMESTAMPTZ,
    data_decisao TIMESTAMPTZ,
    decisao_final VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'recebido',
    fase_processo INTEGER DEFAULT 1,
    arquivos_defesa TEXT[] DEFAULT '{}',
    texto_defesa TEXT,
    resposta_banco TEXT,
    observacoes TEXT,
    responsavel_defesa UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chargebacks_empresa ON public.chargebacks(empresa_id);
CREATE INDEX idx_chargebacks_transacao ON public.chargebacks(transacao_id);
CREATE INDEX idx_chargebacks_status ON public.chargebacks(status);

CREATE TABLE IF NOT EXISTS public.repasses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    transacao_id UUID REFERENCES public.transacoes(id) ON DELETE SET NULL,
    parcela_id UUID REFERENCES public.transacoes_parcelas(id) ON DELETE SET NULL,
    destinatario_nome VARCHAR(255) NOT NULL,
    destinatario_documento VARCHAR(20) NOT NULL,
    conta_bancaria_id UUID REFERENCES public.contas_bancarias(id) ON DELETE SET NULL,
    valor_bruto DECIMAL(15,2) NOT NULL,
    taxa_administrativa DECIMAL(12,2) DEFAULT 0,
    valor_liquido DECIMAL(15,2) NOT NULL,
    moeda VARCHAR(3) DEFAULT 'BRL',
    percentual_acordado DECIMAL(5,2),
    status status_repasse NOT NULL DEFAULT 'agendado',
    data_agendada DATE,
    data_envio TIMESTAMPTZ,
    data_recebimento TIMESTAMPTZ,
    data_confirmacao TIMESTAMPTZ,
    id_repasse_externo VARCHAR(255),
    comprovante_url TEXT,
    metodo_repasse VARCHAR(20) DEFAULT 'ted',
    observacoes TEXT,
    enviado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_repasses_empresa ON public.repasses(empresa_id);
CREATE INDEX idx_repasses_status ON public.repasses(status);
CREATE INDEX idx_repasses_transacao ON public.repasses(transacao_id);
CREATE INDEX idx_repasses_agendada ON public.repasses(data_agendada);

CREATE TABLE IF NOT EXISTS public.taxas_plataforma (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    plano VARCHAR(50) NOT NULL DEFAULT 'free',
    metodo_pagamento metodo_pagamento NOT NULL,
    taxa_percentual DECIMAL(5,4) NOT NULL DEFAULT 0,
    taxa_fixa DECIMAL(12,2) NOT NULL DEFAULT 0,
    taxa_antecipacao_percentual DECIMAL(5,4) DEFAULT 0,
    taxa_minima DECIMAL(12,2),
    taxa_maxima DECIMAL(12,2),
    max_parcelas_sem_juros INTEGER DEFAULT 0,
    taxa_parcelamento_por_parcela DECIMAL(5,4) DEFAULT 0,
    taxa_boleto DECIMAL(12,2),
    taxa_pix_percentual DECIMAL(5,4) DEFAULT 0,
    taxa_pix_fixa DECIMAL(12,2),
    taxa_saque_percentual DECIMAL(5,4) DEFAULT 0,
    taxa_saque_fixa DECIMAL(12,2),
    taxa_minima_saque DECIMAL(12,2),
    dias_liquidacao INTEGER DEFAULT 30,
    is_padrao BOOLEAN DEFAULT FALSE,
    data_inicio_vigencia DATE NOT NULL DEFAULT CURRENT_DATE,
    data_fim_vigencia DATE,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_taxas_plataforma_empresa ON public.taxas_plataforma(empresa_id);
CREATE INDEX idx_taxas_plataforma_plano ON public.taxas_plataforma(plano);

CREATE TABLE IF NOT EXISTS public.lancamentos_contabeis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE SET NULL,
    transacao_id UUID REFERENCES public.transacoes(id) ON DELETE SET NULL,
    saque_id UUID REFERENCES public.saques(id) ON DELETE SET NULL,
    estorno_id UUID REFERENCES public.estornos(id) ON DELETE SET NULL,
    comissao_id UUID REFERENCES public.comissoes(id) ON DELETE SET NULL,
    repasse_id UUID REFERENCES public.repasses(id) ON DELETE SET NULL,
    conta_contabil VARCHAR(30) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    tipo_lancamento CHAR(1) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    moeda VARCHAR(3) DEFAULT 'BRL',
    data_lancamento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    competencia DATE NOT NULL,
    saldo_anterior DECIMAL(15,2),
    saldo_atual DECIMAL(15,2),
    documento_referencia VARCHAR(100),
    criado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    automatico BOOLEAN DEFAULT TRUE,
    motivo_manual TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT lancamentos_chk CHECK (tipo_lancamento IN ('D', 'C')),
    CONSTRAINT lancamentos_chk_entidade CHECK (
        (empresa_id IS NOT NULL)::INTEGER +
        (profile_id IS NOT NULL)::INTEGER +
        (afiliado_id IS NOT NULL)::INTEGER >= 1
    )
);

CREATE INDEX idx_lancamentos_contabeis_empresa ON public.lancamentos_contabeis(empresa_id);
CREATE INDEX idx_lancamentos_contabeis_data ON public.lancamentos_contabeis(data_lancamento DESC);
CREATE INDEX idx_lancamentos_contabeis_conta ON public.lancamentos_contabeis(conta_contabil);
CREATE INDEX idx_lancamentos_contabeis_transacao ON public.lancamentos_contabeis(transacao_id);

-- FINAL MIGRATION 004