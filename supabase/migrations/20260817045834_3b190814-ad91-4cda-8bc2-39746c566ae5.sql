-- ==========================================================================
-- MIGRATION 006 - ADMIN GLOBAL, TREINAMENTOS, INTEGRAÇÕES E RELATÓRIOS
-- ==========================================================================

CREATE TYPE status_integracao AS ENUM ('nao_configurado', 'conectado', 'erro', 'expirado', 'revogado');
CREATE TYPE tipo_curso AS ENUM ('video', 'texto', 'quiz', 'live', 'arquivo', 'webinar');
CREATE TYPE status_matricula AS ENUM ('ativa', 'pausada', 'cancelada', 'concluida', 'expirada');
CREATE TYPE frequencia_relatorio AS ENUM ('diario', 'semanal', 'quinzenal', 'mensal', 'trimestral', 'anual');

CREATE TABLE IF NOT EXISTS public.admin_global_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor JSONB NOT NULL,
    tipo_valor VARCHAR(20) NOT NULL DEFAULT 'string',
    descricao TEXT,
    categoria VARCHAR(50),
    modulo VARCHAR(50),
    somente_leitura BOOLEAN DEFAULT FALSE,
    sensivel BOOLEAN DEFAULT FALSE,
    publico BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_global_config_categoria ON public.admin_global_config(categoria);
CREATE INDEX idx_admin_global_config_modulo ON public.admin_global_config(modulo);

CREATE TABLE IF NOT EXISTS public.admin_empresas_gestao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE UNIQUE,
    risco_score INTEGER DEFAULT 50,
    risco_nivel VARCHAR(20) DEFAULT 'medio',
    categoria_cliente VARCHAR(20) DEFAULT 'normal',
    observacoes_admin TEXT,
    vip BOOLEAN DEFAULT FALSE,
    bloqueado_funcionalidades TEXT[] DEFAULT '{}',
    limites_customizados JSONB DEFAULT '{}'::jsonb,
    desconto_plano_percentual DECIMAL(5,2) DEFAULT 0,
    data_ultima_revisao TIMESTAMPTZ,
    revisado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    tags_admin VARCHAR(255)[] DEFAULT '{}',
    contrato_assinado_url TEXT,
    termo_adesao_assinado TIMESTAMPTZ,
    dados_kpi_extras JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_empresas_risco ON public.admin_empresas_gestao(risco_score);
CREATE INDEX idx_admin_empresas_categoria ON public.admin_empresas_gestao(categoria_cliente);
CREATE INDEX idx_admin_empresas_vip ON public.admin_empresas_gestao(vip) WHERE vip = TRUE;
CREATE INDEX idx_admin_empresas_tags ON public.admin_empresas_gestao USING GIN (tags_admin);

CREATE TABLE IF NOT EXISTS public.admin_banimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(20) NOT NULL,
    identificador VARCHAR(255) NOT NULL,
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    motivo_principal VARCHAR(255) NOT NULL,
    detalhamento TEXT,
    evidencias_urls TEXT[] DEFAULT '{}',
    nivel_gravidade VARCHAR(20) NOT NULL DEFAULT 'alto',
    acoes_disparadas JSONB DEFAULT '[]'::jsonb,
    data_inicio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_fim TIMESTAMPTZ,
    permanente BOOLEAN DEFAULT TRUE,
    aplicado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    revisado_em TIMESTAMPTZ,
    revisado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    desfeito BOOLEAN DEFAULT FALSE,
    desfeito_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    data_desfeito TIMESTAMPTZ,
    motivo_desfeito TEXT,
    apelacao_aceita BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tipo, identificador)
);

CREATE INDEX idx_admin_banimentos_tipo ON public.admin_banimentos(tipo, identificador);
CREATE INDEX idx_admin_banimentos_ativo ON public.admin_banimentos(desfeito, data_inicio DESC) WHERE desfeito = FALSE;

CREATE TABLE IF NOT EXISTS public.admin_moderacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reportado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    empresa_reportada_id UUID REFERENCES public.empresas(id) ON DELETE SET NULL,
    profile_reportado_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    produto_reportado_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
    checkout_reportado_id UUID REFERENCES public.checkouts(id) ON DELETE SET NULL,
    marketplace_reportado_id UUID REFERENCES public.marketplace_produtos(id) ON DELETE SET NULL,
    tipo_item_reportado VARCHAR(50) NOT NULL,
    item_reportado_id UUID,
    motivo VARCHAR(100) NOT NULL,
    detalhe_motivo TEXT,
    evidencias TEXT[] DEFAULT '{}',
    categoria_risco VARCHAR(20) DEFAULT 'media',
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    atribuido_para UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    atribuido_em TIMESTAMPTZ,
    analisado_em TIMESTAMPTZ,
    analisado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    decisao VARCHAR(30),
    detalhe_decisao TEXT,
    acoes_tomadas JSONB DEFAULT '[]'::jsonb,
    sinalizacoes_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_moderacao_status ON public.admin_moderacao(status, created_at DESC);
CREATE INDEX idx_admin_moderacao_tipo ON public.admin_moderacao(tipo_item_reportado);

CREATE TABLE IF NOT EXISTS public.admin_comunicados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'informacao',
    nivel_importancia INTEGER DEFAULT 0,
    publico_alvo VARCHAR(30) DEFAULT 'todos',
    empresas_destino_ids UUID[] DEFAULT '{}',
    perfis_destino_ids UUID[] DEFAULT '{}',
    mostrar_banner_dashboard BOOLEAN DEFAULT TRUE,
    mostrar_email BOOLEAN DEFAULT FALSE,
    mostrar_popup BOOLEAN DEFAULT FALSE,
    dados_popup JSONB,
    banner_cor VARCHAR(20),
    data_inicio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_fim TIMESTAMPTZ,
    publicado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    data_publicacao TIMESTAMPTZ,
    publicado BOOLEAN DEFAULT FALSE,
    total_visualizacoes INTEGER DEFAULT 0,
    total_confirmacoes INTEGER DEFAULT 0,
    requer_confirmacao BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_admin_comunicados_publicado ON public.admin_comunicados(publicado, data_inicio DESC);
CREATE INDEX idx_admin_comunicados_tipo ON public.admin_comunicados(tipo);

CREATE TABLE IF NOT EXISTS public.integracoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    nome_integracao VARCHAR(100) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50),
    logo_url TEXT,
    status status_integracao NOT NULL DEFAULT 'nao_configurado',
    credenciais_criptografadas JSONB DEFAULT '{}'::jsonb,
    config JSONB DEFAULT '{}'::jsonb,
    webhook_url TEXT,
    webhook_secret TEXT,
    last_sync_at TIMESTAMPTZ,
    last_error TEXT,
    last_error_at TIMESTAMPTZ,
    connected_at TIMESTAMPTZ,
    disconnected_at TIMESTAMPTZ,
    conectado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    desconectado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rate_limit_por_minuto INTEGER,
    rate_limit_por_dia INTEGER,
    total_requisicoes INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(empresa_id, provider)
);

CREATE INDEX idx_integracoes_empresa ON public.integracoes(empresa_id);
CREATE INDEX idx_integracoes_status ON public.integracoes(status);
CREATE INDEX idx_integracoes_provider ON public.integracoes(provider);
CREATE INDEX idx_integracoes_categoria ON public.integracoes(categoria);

CREATE TABLE IF NOT EXISTS public.integracoes_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integracao_id UUID NOT NULL REFERENCES public.integracoes(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    acao VARCHAR(100) NOT NULL,
    metodo_http VARCHAR(10),
    endpoint_url TEXT,
    corpo_requisicao JSONB,
    cabecalhos_requisicao JSONB,
    status_resposta INTEGER,
    corpo_resposta TEXT,
    cabecalhos_resposta JSONB,
    duracao_ms INTEGER,
    sucesso BOOLEAN DEFAULT TRUE,
    mensagem_erro TEXT,
    tentativa_numero INTEGER DEFAULT 1,
    idempotency_key VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_integracoes_logs_integracao ON public.integracoes_logs(integracao_id, created_at DESC);
CREATE INDEX idx_integracoes_logs_empresa ON public.integracoes_logs(empresa_id, created_at DESC);
CREATE INDEX idx_integracoes_logs_sucesso ON public.integracoes_logs(sucesso, created_at DESC) WHERE sucesso = FALSE;

CREATE TABLE IF NOT EXISTS public.treinamentos_cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    criado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    atualizado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    subtitulo VARCHAR(255),
    descricao_curta TEXT,
    descricao_longa TEXT,
    capa_url TEXT,
    video_demo_url TEXT,
    categoria VARCHAR(100),
    nivel VARCHAR(20) DEFAULT 'iniciante',
    tipo tipo_curso NOT NULL DEFAULT 'video',
    preco DECIMAL(12,2) DEFAULT 0,
    gratuito BOOLEAN DEFAULT TRUE,
    carga_horaria_horas INTEGER DEFAULT 0,
    total_aulas INTEGER DEFAULT 0,
    total_modulos INTEGER DEFAULT 0,
    duracao_total_minutos INTEGER DEFAULT 0,
    requisitos TEXT[] DEFAULT '{}',
    aprendizados TEXT[] DEFAULT '{}',
    publico_alvo TEXT,
    instrutor_nome VARCHAR(255),
    instrutor_bio TEXT,
    instrutor_avatar TEXT,
    avaliacao_media DECIMAL(3,2) DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0,
    total_matriculas INTEGER DEFAULT 0,
    total_concluidos INTEGER DEFAULT 0,
    taxa_conclusao DECIMAL(5,2) DEFAULT 0,
    tags VARCHAR(255)[] DEFAULT '{}',
    certificado_disponivel BOOLEAN DEFAULT TRUE,
    modelo_certificado TEXT,
    acesso_vitalicio BOOLEAN DEFAULT TRUE,
    dias_validade INTEGER,
    libera_afiliados BOOLEAN DEFAULT TRUE,
    taxa_comissao_afiliado DECIMAL(5,2) DEFAULT 30.00,
    permite_parcelamento BOOLEAN DEFAULT FALSE,
    destaque BOOLEAN DEFAULT FALSE,
    publicado BOOLEAN DEFAULT FALSE,
    data_publicacao TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'rascunho',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE NULLS NOT DISTINCT (empresa_id, slug)
);

CREATE INDEX idx_treinamentos_cursos_empresa ON public.treinamentos_cursos(empresa_id);
CREATE INDEX idx_treinamentos_cursos_categoria ON public.treinamentos_cursos(categoria);
CREATE INDEX idx_treinamentos_cursos_nivel ON public.treinamentos_cursos(nivel);
CREATE INDEX idx_treinamentos_cursos_publicado ON public.treinamentos_cursos(publicado, created_at DESC);

CREATE TABLE IF NOT EXISTS public.treinamentos_modulos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID NOT NULL REFERENCES public.treinamentos_cursos(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    ordem INTEGER NOT NULL DEFAULT 0,
    duracao_total_minutos INTEGER DEFAULT 0,
    total_aulas INTEGER DEFAULT 0,
    desbloqueio_automatico BOOLEAN DEFAULT TRUE,
    aula_requisito_id UUID,
    data_desbloqueio TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_treinamentos_modulos_curso ON public.treinamentos_modulos(curso_id, ordem ASC);

CREATE TABLE IF NOT EXISTS public.treinamentos_aulas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modulo_id UUID NOT NULL REFERENCES public.treinamentos_modulos(id) ON DELETE CASCADE,
    curso_id UUID NOT NULL REFERENCES public.treinamentos_cursos(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    tipo tipo_curso NOT NULL DEFAULT 'video',
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    conteudo_texto TEXT,
    conteudo_html TEXT,
    video_url TEXT,
    video_duracao_segundos INTEGER,
    video_tipo VARCHAR(30),
    video_resolucoes JSONB,
    arquivo_url TEXT,
    arquivo_nome VARCHAR(255),
    arquivo_tamanho INTEGER,
    url_externa TEXT,
    ordem INTEGER NOT NULL DEFAULT 0,
    duracao_estimada_min INTEGER,
    gratuito_previzualizacao BOOLEAN DEFAULT FALSE,
    require_download BOOLEAN DEFAULT FALSE,
    max_downloads INTEGER,
    perguntas_quiz JSONB,
    nota_minima_aprovacao DECIMAL(5,2) DEFAULT 70,
    min_visualizacoes INTEGER DEFAULT 1,
    min_tempo_segundos INTEGER,
    attachments TEXT[] DEFAULT '{}',
    recursos_links JSONB DEFAULT '[]'::jsonb,
    total_comentarios INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_treinamentos_aulas_modulo ON public.treinamentos_aulas(modulo_id, ordem ASC);
CREATE INDEX idx_treinamentos_aulas_curso ON public.treinamentos_aulas(curso_id, ordem ASC);

CREATE TABLE IF NOT EXISTS public.treinamentos_matriculas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID NOT NULL REFERENCES public.treinamentos_cursos(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE SET NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE SET NULL,
    transacao_id UUID REFERENCES public.transacoes(id) ON DELETE SET NULL,
    status status_matricula NOT NULL DEFAULT 'ativa',
    valor_pago DECIMAL(12,2),
    data_matricula TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_expiracao TIMESTAMPTZ,
    data_conclusao TIMESTAMPTZ,
    progresso_percentual DECIMAL(5,2) DEFAULT 0,
    total_aulas_concluidas INTEGER DEFAULT 0,
    tempo_total_estudado_seg INTEGER DEFAULT 0,
    nota_final DECIMAL(5,2),
    aprovado BOOLEAN,
    certificado_emitido BOOLEAN DEFAULT FALSE,
    data_certificado TIMESTAMPTZ,
    numero_certificado VARCHAR(50),
    certificado_url TEXT,
    ultimo_acesso TIMESTAMPTZ,
    motivo_cancelamento TEXT,
    pausado_em TIMESTAMPTZ,
    reativado_em TIMESTAMPTZ,
    originou_de VARCHAR(30),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(curso_id, profile_id)
);

CREATE INDEX idx_treinamentos_matriculas_profile ON public.treinamentos_matriculas(profile_id);
CREATE INDEX idx_treinamentos_matriculas_curso ON public.treinamentos_matriculas(curso_id);
CREATE INDEX idx_treinamentos_matriculas_status ON public.treinamentos_matriculas(status);

CREATE TABLE IF NOT EXISTS public.treinamentos_progresso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula_id UUID NOT NULL REFERENCES public.treinamentos_matriculas(id) ON DELETE CASCADE,
    aula_id UUID NOT NULL REFERENCES public.treinamentos_aulas(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    concluida BOOLEAN DEFAULT FALSE,
    data_conclusao TIMESTAMPTZ,
    primeiro_acesso TIMESTAMPTZ,
    ultimo_acesso TIMESTAMPTZ,
    total_acessos INTEGER DEFAULT 0,
    tempo_assistido_seg INTEGER DEFAULT 0,
    nota_quiz DECIMAL(5,2),
    quiz_tentativas INTEGER DEFAULT 0,
    ultima_posicao_video_seg INTEGER,
    downloads_feitos INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(matricula_id, aula_id)
);

CREATE INDEX idx_treinamentos_progresso_matricula ON public.treinamentos_progresso(matricula_id);
CREATE INDEX idx_treinamentos_progresso_concluida ON public.treinamentos_progresso(profile_id, aula_id, concluida);

CREATE TABLE IF NOT EXISTS public.relatorios_agendados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    criado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    nome_relatorio VARCHAR(255) NOT NULL,
    tipo_relatorio VARCHAR(50) NOT NULL,
    frequencia frequencia_relatorio NOT NULL,
    dia_semana INTEGER,
    dia_mes INTEGER,
    hora TIME NOT NULL,
    formato VARCHAR(10) DEFAULT 'pdf',
    filtros JSONB DEFAULT '{}'::jsonb,
    colunas_exibidas TEXT[] DEFAULT '{}',
    destinatarios_emails TEXT[] NOT NULL DEFAULT '{}',
    destinatarios_profiles UUID[] DEFAULT '{}',
    assunto_email VARCHAR(255),
    corpo_email TEXT,
    enviar_se_sem_dados BOOLEAN DEFAULT FALSE,
    compactar_arquivo BOOLEAN DEFAULT FALSE,
    zip_senha_protegida BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'ativo',
    ultimo_envio TIMESTAMPTZ,
    proximo_envio TIMESTAMPTZ,
    total_enviados INTEGER DEFAULT 0,
    total_falhas INTEGER DEFAULT 0,
    erro_ultimo TEXT,
    webhook_notificacao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_relatorios_agendados_empresa ON public.relatorios_agendados(empresa_id);
CREATE INDEX idx_relatorios_agendados_proximo ON public.relatorios_agendados(proximo_envio);

CREATE TABLE IF NOT EXISTS public.relatorios_historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    agendamento_id UUID REFERENCES public.relatorios_agendados(id) ON DELETE SET NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    tipo_relatorio VARCHAR(50) NOT NULL,
    formato VARCHAR(10) NOT NULL,
    url_arquivo TEXT,
    tamanho_bytes BIGINT,
    total_registros INTEGER,
    periodo_inicio TIMESTAMPTZ,
    periodo_fim TIMESTAMPTZ,
    filtros_aplicados JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'gerando',
    tempo_geracao_ms INTEGER,
    gerado_por VARCHAR(20) DEFAULT 'manual',
    error_message TEXT,
    expira_em TIMESTAMPTZ,
    total_visualizacoes INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_relatorios_historico_empresa ON public.relatorios_historico(empresa_id, created_at DESC);
CREATE INDEX idx_relatorios_historico_tipo ON public.relatorios_historico(tipo_relatorio);

-- FINAL MIGRATION 006