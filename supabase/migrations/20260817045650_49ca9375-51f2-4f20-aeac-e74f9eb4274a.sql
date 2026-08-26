-- ==========================================================================
-- MIGRATION 005 - EQUIPE, SEGURANÇA, AUDITORIA, NOTIFICAÇÕES E AJUDA
-- ==========================================================================

CREATE TYPE tipo_notificacao AS ENUM (
    'sistema', 'transacao', 'venda', 'saque', 'comissao',
    'afiliado', 'seguranca', 'atualizacao', 'promocao',
    'tarefa', 'lembrete', 'suporte', 'financeiro'
);
CREATE TYPE status_sessao AS ENUM ('ativa', 'expirada', 'revogada', 'bloqueada');
CREATE TYPE tipo_ticket AS ENUM ('suporte', 'duvida', 'reclamacao', 'sugestao', 'bug', 'financeiro');
CREATE TYPE prioridade_ticket AS ENUM ('baixa', 'media', 'alta', 'critica', 'urgente');
CREATE TYPE status_ticket AS ENUM ('aberto', 'respondido_cliente', 'respondido_suporte', 'em_analise', 'pendente_terceiro', 'resolvido', 'fechado', 'reaberto');
CREATE TYPE tipo_audit_log AS ENUM (
    'create', 'read', 'update', 'delete', 'login', 'logout',
    'login_falha', 'troca_senha', 'email_verificado',
    'acesso_negado', 'permissao_concedida', 'permissao_revogada',
    'troca_email', '2fa_ativada', '2fa_desativada',
    'saque_solicitado', 'saque_aprovado', 'saque_rejeitado',
    'transacao_aprovada', 'transacao_estornada',
    'convite_enviado', 'convite_aceito',
    'produto_publicado', 'checkout_publicado'
);

CREATE TABLE IF NOT EXISTS public.equipe_membros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    convite_id UUID REFERENCES public.invites(id) ON DELETE SET NULL,
    adicionado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    cargo VARCHAR(100) NOT NULL,
    departamento VARCHAR(100),
    data_admissao DATE,
    data_desligamento DATE,
    salario DECIMAL(12,2),
    carga_horaria_semanal INTEGER DEFAULT 40,
    supervisor_direto UUID REFERENCES public.equipe_membros(id) ON DELETE SET NULL,
    status status_ativo NOT NULL DEFAULT 'ativo',
    pode_assinar_documentos BOOLEAN DEFAULT FALSE,
    limite_aprovacao_valor DECIMAL(15,2),
    numero_registro VARCHAR(50),
    observacoes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(empresa_id, profile_id)
);

CREATE INDEX idx_equipe_membros_empresa ON public.equipe_membros(empresa_id);
CREATE INDEX idx_equipe_membros_profile ON public.equipe_membros(profile_id);
CREATE INDEX idx_equipe_membros_status ON public.equipe_membros(status);
CREATE INDEX idx_equipe_membros_departamento ON public.equipe_membros(empresa_id, departamento);
CREATE INDEX idx_equipe_membros_supervisor ON public.equipe_membros(supervisor_direto);

CREATE TABLE IF NOT EXISTS public.seguranca_sessoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE SET NULL,
    session_id_auth VARCHAR(255),
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NOT NULL,
    navegador VARCHAR(100),
    navegador_versao VARCHAR(20),
    sistema_operacional VARCHAR(100),
    so_versao VARCHAR(20),
    dispositivo VARCHAR(50),
    dispositivo_tipo VARCHAR(30),
    pais VARCHAR(100),
    regiao VARCHAR(100),
    cidade VARCHAR(100),
    cep VARCHAR(10),
    coordenadas_geograficas POINT,
    provedor_internet VARCHAR(100),
    status status_sessao NOT NULL DEFAULT 'ativa',
    eh_dispositivo_confiavel BOOLEAN DEFAULT FALSE,
    verificacao_2fa_feita BOOLEAN DEFAULT FALSE,
    metodo_2fa_usado VARCHAR(20),
    data_ultima_atividade TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_expiracao TIMESTAMPTZ NOT NULL,
    data_login TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_logout TIMESTAMPTZ,
    token_fingerprint VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seguranca_sessoes_profile ON public.seguranca_sessoes(profile_id);
CREATE INDEX idx_seguranca_sessoes_status ON public.seguranca_sessoes(status);
CREATE INDEX idx_seguranca_sessoes_ip ON public.seguranca_sessoes(ip_address);
CREATE INDEX idx_seguranca_sessoes_login ON public.seguranca_sessoes(data_login DESC);
CREATE INDEX idx_seguranca_sessoes_empresa ON public.seguranca_sessoes(empresa_id);

CREATE TABLE IF NOT EXISTS public.seguranca_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE SET NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE SET NULL,
    acao tipo_audit_log NOT NULL,
    modulo VARCHAR(100),
    entidade VARCHAR(100),
    entidade_id UUID,
    descricao TEXT NOT NULL,
    detalhes JSONB DEFAULT '{}'::jsonb,
    dados_antes JSONB,
    dados_depois JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    sessao_id UUID REFERENCES public.seguranca_sessoes(id) ON DELETE SET NULL,
    metodo_http VARCHAR(10),
    endpoint_url TEXT,
    status_resposta INTEGER,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    pais VARCHAR(100),
    cidade VARCHAR(100),
    risco_score INTEGER DEFAULT 0,
    risco_nivel VARCHAR(20) DEFAULT 'baixo',
    alerta_disparado BOOLEAN DEFAULT FALSE,
    fk_tabela_nome VARCHAR(100),
    fk_registro_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_empresa ON public.seguranca_audit_log(empresa_id);
CREATE INDEX idx_audit_log_profile ON public.seguranca_audit_log(profile_id);
CREATE INDEX idx_audit_log_acao ON public.seguranca_audit_log(acao);
CREATE INDEX idx_audit_log_created ON public.seguranca_audit_log(created_at DESC);
CREATE INDEX idx_audit_log_entidade ON public.seguranca_audit_log(modulo, entidade, entidade_id);
CREATE INDEX idx_audit_log_alerta ON public.seguranca_audit_log(alerta_disparado, risco_nivel);
CREATE INDEX idx_audit_log_ip ON public.seguranca_audit_log(ip_address);

CREATE TABLE IF NOT EXISTS public.seguranca_2fa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    metodo VARCHAR(20) NOT NULL,
    chave_secreta_criptografada TEXT NOT NULL,
    qrcode_url TEXT,
    telefone_registrado VARCHAR(20),
    email_registrado VARCHAR(255),
    codigos_recuperacao TEXT[] DEFAULT '{}',
    data_ativacao TIMESTAMPTZ,
    data_desativacao TIMESTAMPTZ,
    ativado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    desativado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    motivo_desativacao TEXT,
    total_usos INTEGER DEFAULT 0,
    total_falhas INTEGER DEFAULT 0,
    ultimo_uso TIMESTAMPTZ,
    is_primario BOOLEAN DEFAULT FALSE,
    confiavel BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT seg2fa_metodo_chk CHECK (metodo IN ('app', 'sms', 'email', 'chave_hardware', 'biometria'))
);

CREATE INDEX idx_seguranca_2fa_profile ON public.seguranca_2fa(profile_id);
CREATE INDEX idx_seguranca_2fa_metodo ON public.seguranca_2fa(metodo);

CREATE TABLE IF NOT EXISTS public.seguranca_dispositivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    fingerprint VARCHAR(100) NOT NULL,
    nome_dispositivo VARCHAR(100),
    tipo_dispositivo VARCHAR(30),
    modelo VARCHAR(100),
    marca VARCHAR(100),
    sistema_operacional VARCHAR(100),
    navegador VARCHAR(100),
    user_agent TEXT,
    ip_primeiro_acesso VARCHAR(45),
    pais_primeiro_acesso VARCHAR(100),
    data_primeiro_acesso TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_ultimo_acesso TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_confirmacao TIMESTAMPTZ,
    confirmado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    expira_em TIMESTAMPTZ,
    ativo BOOLEAN DEFAULT TRUE,
    bloqueado BOOLEAN DEFAULT FALSE,
    motivo_bloqueio TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(profile_id, fingerprint)
);

CREATE INDEX idx_seguranca_dispositivos_profile ON public.seguranca_dispositivos(profile_id);

CREATE TABLE IF NOT EXISTS public.seguranca_bloqueios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    tipo VARCHAR(20) NOT NULL,
    identificador VARCHAR(255) NOT NULL,
    motivo TEXT NOT NULL,
    ip_address VARCHAR(45),
    pais VARCHAR(100),
    cidade VARCHAR(100),
    data_inicio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_fim TIMESTAMPTZ,
    permanente BOOLEAN DEFAULT FALSE,
    contador_falhas INTEGER DEFAULT 1,
    desbloqueado BOOLEAN DEFAULT FALSE,
    data_desbloqueio TIMESTAMPTZ,
    desbloqueado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    motivo_desbloqueio TEXT,
    alerta_enviado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT segbloq_tipo_chk CHECK (tipo IN ('ip', 'usuario', 'email', 'pais', 'dispositivo'))
);

CREATE INDEX idx_seguranca_bloqueios_profile ON public.seguranca_bloqueios(profile_id);
CREATE INDEX idx_seguranca_bloqueios_identificador ON public.seguranca_bloqueios(tipo, identificador);
CREATE INDEX idx_seguranca_bloqueios_ativo ON public.seguranca_bloqueios(desbloqueado, data_inicio DESC) WHERE desbloqueado = FALSE;

CREATE TABLE IF NOT EXISTS public.seguranca_senhas_historico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    senha_hash TEXT NOT NULL,
    salt TEXT,
    algoritmo VARCHAR(20) DEFAULT 'bcrypt',
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_ultimo_uso TIMESTAMPTZ,
    expirada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seguranca_senhas_historico_profile ON public.seguranca_senhas_historico(profile_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.seguranca_chaves_api (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    chave_prefixo VARCHAR(32) NOT NULL,
    chave_hash TEXT NOT NULL,
    tipo_chave VARCHAR(20) NOT NULL DEFAULT 'producao',
    escopos TEXT[] DEFAULT '{"read","write"}',
    permissoes JSONB DEFAULT '{}'::jsonb,
    enderecos_ip_permitidos TEXT[] DEFAULT '{}',
    enderecos_ip_bloqueados TEXT[] DEFAULT '{}',
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_ultimo_uso TIMESTAMPTZ,
    data_expiracao TIMESTAMPTZ,
    data_renovacao TIMESTAMPTZ,
    data_ultima_rotacao TIMESTAMPTZ,
    ultimo_ip_uso VARCHAR(45),
    total_requisicoes INTEGER DEFAULT 0,
    total_requisicoes_sucesso INTEGER DEFAULT 0,
    total_requisicoes_falha INTEGER DEFAULT 0,
    taxa_limite_por_minuto INTEGER DEFAULT 1000,
    taxa_limite_por_dia INTEGER DEFAULT 100000,
    criado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ativa BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_seguranca_chaves_api_empresa ON public.seguranca_chaves_api(empresa_id);
CREATE UNIQUE INDEX idx_seguranca_chaves_api_prefixo ON public.seguranca_chaves_api(chave_prefixo);
CREATE INDEX idx_seguranca_chaves_api_tipo ON public.seguranca_chaves_api(tipo_chave, ativa);

CREATE TABLE IF NOT EXISTS public.seguranca_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    url_endpoint TEXT NOT NULL,
    metodo_http VARCHAR(10) DEFAULT 'POST',
    eventos_ouvidos TEXT[] NOT NULL DEFAULT '{"transacao.*"}',
    headers_personalizados JSONB DEFAULT '{}'::jsonb,
    segredo_assinatura TEXT NOT NULL,
    algoritmo_assinatura VARCHAR(20) DEFAULT 'sha256',
    ativo BOOLEAN DEFAULT TRUE,
    tentativas_max INTEGER DEFAULT 5,
    intervalo_entre_tentativas INTEGER DEFAULT 300,
    tempo_limite_ms INTEGER DEFAULT 10000,
    verificar_ssl BOOLEAN DEFAULT TRUE,
    data_ultimo_disparo TIMESTAMPTZ,
    total_disparos INTEGER DEFAULT 0,
    total_sucessos INTEGER DEFAULT 0,
    total_falhas INTEGER DEFAULT 0,
    ultima_resposta_status INTEGER,
    ultima_resposta_corpo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_seguranca_webhooks_empresa ON public.seguranca_webhooks(empresa_id, ativo);

CREATE TABLE IF NOT EXISTS public.seguranca_webhooks_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id UUID NOT NULL REFERENCES public.seguranca_webhooks(id) ON DELETE CASCADE,
    evento VARCHAR(100) NOT NULL,
    corpo_requisicao JSONB NOT NULL,
    headers_resposta JSONB,
    corpo_resposta TEXT,
    status_resposta INTEGER,
    tempo_resposta_ms INTEGER,
    tentativa_numero INTEGER DEFAULT 1,
    max_tentativas INTEGER DEFAULT 5,
    sucesso BOOLEAN DEFAULT FALSE,
    mensagem_erro TEXT,
    assinatura_enviada TEXT,
    idempotency_key VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seguranca_webhooks_log_webhook ON public.seguranca_webhooks_log(webhook_id, created_at DESC);
CREATE INDEX idx_seguranca_webhooks_log_evento ON public.seguranca_webhooks_log(evento);
CREATE INDEX idx_seguranca_webhooks_log_sucesso ON public.seguranca_webhooks_log(sucesso, created_at DESC);

CREATE TABLE IF NOT EXISTS public.notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE SET NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    tipo tipo_notificacao NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    resumo_curto VARCHAR(160),
    imagem_url TEXT,
    icone VARCHAR(50),
    cor VARCHAR(20),
    dados_relacionados JSONB DEFAULT '{}'::jsonb,
    entidade_tipo VARCHAR(50),
    entidade_id UUID,
    url_destino TEXT,
    canal_email BOOLEAN DEFAULT FALSE,
    canal_sms BOOLEAN DEFAULT FALSE,
    canal_push BOOLEAN DEFAULT FALSE,
    canal_whatsapp BOOLEAN DEFAULT FALSE,
    canal_inapp BOOLEAN DEFAULT TRUE,
    lida BOOLEAN DEFAULT FALSE,
    data_leitura TIMESTAMPTZ,
    arquivada BOOLEAN DEFAULT FALSE,
    data_arquivamento TIMESTAMPTZ,
    fixada BOOLEAN DEFAULT FALSE,
    disparar_email_em TIMESTAMPTZ,
    email_enviado BOOLEAN DEFAULT FALSE,
    data_envio_email TIMESTAMPTZ,
    id_email_provedor VARCHAR(255),
    push_enviado BOOLEAN DEFAULT FALSE,
    data_envio_push TIMESTAMPTZ,
    sms_enviado BOOLEAN DEFAULT FALSE,
    data_envio_sms TIMESTAMPTZ,
    whatsapp_enviado BOOLEAN DEFAULT FALSE,
    data_envio_whatsapp TIMESTAMPTZ,
    expira_em TIMESTAMPTZ,
    agrupamento_chave VARCHAR(100),
    prioridade INTEGER DEFAULT 0,
    criada_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    criada_sistema BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_notificacoes_profile ON public.notificacoes(profile_id, created_at DESC) WHERE profile_id IS NOT NULL;
CREATE INDEX idx_notificacoes_afiliado ON public.notificacoes(afiliado_id, created_at DESC) WHERE afiliado_id IS NOT NULL;
CREATE INDEX idx_notificacoes_empresa ON public.notificacoes(empresa_id, created_at DESC);
CREATE INDEX idx_notificacoes_tipo ON public.notificacoes(tipo);
CREATE INDEX idx_notificacoes_lida ON public.notificacoes(profile_id, lida, created_at DESC) WHERE profile_id IS NOT NULL;
CREATE INDEX idx_notificacoes_fixada ON public.notificacoes(profile_id, fixada DESC, created_at DESC) WHERE fixada = TRUE AND profile_id IS NOT NULL;
CREATE INDEX idx_notificacoes_cliente ON public.notificacoes(cliente_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.notificacoes_preferencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE CASCADE,
    tipo_notificacao VARCHAR(50) NOT NULL,
    receber_email BOOLEAN DEFAULT TRUE,
    receber_sms BOOLEAN DEFAULT FALSE,
    receber_push BOOLEAN DEFAULT TRUE,
    receber_whatsapp BOOLEAN DEFAULT FALSE,
    receber_inapp BOOLEAN DEFAULT TRUE,
    horario_inicio_silencioso TIME,
    horario_fim_silencioso TIME,
    dias_silenciosos INTEGER[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE NULLS NOT DISTINCT (profile_id, afiliado_id, tipo_notificacao)
);

CREATE INDEX idx_notificacoes_preferencias_profile ON public.notificacoes_preferencias(profile_id);

CREATE TABLE IF NOT EXISTS public.ajuda_categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE SET NULL,
    nome VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    descricao TEXT,
    icone VARCHAR(50),
    cor VARCHAR(20),
    categoria_pai_id UUID REFERENCES public.ajuda_categorias(id) ON DELETE SET NULL,
    ordem INTEGER DEFAULT 0,
    publica BOOLEAN DEFAULT TRUE,
    total_artigos INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE NULLS NOT DISTINCT (empresa_id, slug)
);

CREATE INDEX idx_ajuda_categorias_empresa ON public.ajuda_categorias(empresa_id);
CREATE INDEX idx_ajuda_categorias_pai ON public.ajuda_categorias(categoria_pai_id);

CREATE TABLE IF NOT EXISTS public.ajuda_artigos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE SET NULL,
    categoria_id UUID REFERENCES public.ajuda_categorias(id) ON DELETE SET NULL,
    criado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    atualizado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    resumo TEXT,
    conteudo TEXT NOT NULL,
    conteudo_html TEXT,
    video_url TEXT,
    anexos_urls TEXT[] DEFAULT '{}',
    palavras_chave VARCHAR(255)[] DEFAULT '{}',
    tags VARCHAR(255)[] DEFAULT '{}',
    ordem INTEGER DEFAULT 0,
    destaque BOOLEAN DEFAULT FALSE,
    publico BOOLEAN DEFAULT TRUE,
    requer_autenticacao BOOLEAN DEFAULT FALSE,
    nivel_acesso_minimo INTEGER DEFAULT 0,
    total_visualizacoes INTEGER DEFAULT 0,
    total_visualizacoes_unicas INTEGER DEFAULT 0,
    total_curtidas INTEGER DEFAULT 0,
    total_nao_curtidas INTEGER DEFAULT 0,
    avaliacao_media DECIMAL(3,2) DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0,
    total_comentarios INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'publicado',
    data_publicacao TIMESTAMPTZ,
    meta_titulo VARCHAR(255),
    meta_descricao TEXT,
    tempo_leitura_minutos INTEGER,
    versao INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE NULLS NOT DISTINCT (empresa_id, slug)
);

CREATE INDEX idx_ajuda_artigos_empresa ON public.ajuda_artigos(empresa_id);
CREATE INDEX idx_ajuda_artigos_categoria ON public.ajuda_artigos(categoria_id);
CREATE INDEX idx_ajuda_artigos_titulo_trgm ON public.ajuda_artigos USING GIN (titulo gin_trgm_ops);
CREATE INDEX idx_ajuda_artigos_tags ON public.ajuda_artigos USING GIN (tags);
CREATE INDEX idx_ajuda_artigos_status ON public.ajuda_artigos(status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.ajuda_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artigo_id UUID REFERENCES public.ajuda_artigos(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    ticket_id UUID,
    foi_util BOOLEAN,
    comentario TEXT,
    avaliacao INTEGER,
    motivo_insatisfacao VARCHAR(100),
    sugestao_melhoria TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    resolvido BOOLEAN DEFAULT FALSE,
    resposta_equipe TEXT,
    respondido_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    data_resposta TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ajuda_feedback_artigo ON public.ajuda_feedback(artigo_id);

CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    numero_protocolo VARCHAR(20) UNIQUE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE SET NULL,
    aberto_por_nome VARCHAR(255),
    aberto_por_email VARCHAR(255),
    aberto_por_telefone VARCHAR(20),
    tipo tipo_ticket NOT NULL DEFAULT 'suporte',
    prioridade prioridade_ticket NOT NULL DEFAULT 'media',
    status status_ticket NOT NULL DEFAULT 'aberto',
    assunto VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(100),
    produto_relacionado_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
    transacao_relacionada_id UUID REFERENCES public.transacoes(id) ON DELETE SET NULL,
    departamento_responsavel VARCHAR(100),
    atribuido_para UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    atribuido_em TIMESTAMPTZ,
    sla_tempo_resposta INTEGER DEFAULT 1440,
    sla_violado BOOLEAN DEFAULT FALSE,
    data_primeira_resposta TIMESTAMPTZ,
    data_ultima_interacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_resolucao TIMESTAMPTZ,
    data_fechamento TIMESTAMPTZ,
    tempo_total_resolucao_minutos INTEGER,
    avaliacao_atendimento INTEGER,
    comentario_avaliacao TEXT,
    anexos_urls TEXT[] DEFAULT '{}',
    tags VARCHAR(255)[] DEFAULT '{}',
    origem VARCHAR(20) DEFAULT 'painel',
    canal_origem VARCHAR(30) DEFAULT 'web',
    ip_origem VARCHAR(45),
    resolucao_descricao TEXT,
    resolucao_tipo VARCHAR(50),
    resolvido_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    fechado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    fechado_satisfatorio BOOLEAN,
    reaberto_contador INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    sla_data_maxima TIMESTAMPTZ
);

CREATE INDEX idx_tickets_empresa ON public.tickets(empresa_id, created_at DESC);
CREATE INDEX idx_tickets_status ON public.tickets(status, created_at DESC);
CREATE INDEX idx_tickets_prioridade ON public.tickets(prioridade, created_at DESC);
CREATE INDEX idx_tickets_atribuido ON public.tickets(atribuido_para, status);
CREATE INDEX idx_tickets_cliente ON public.tickets(cliente_id, created_at DESC);
CREATE INDEX idx_tickets_tipo ON public.tickets(tipo);
CREATE INDEX idx_tickets_sla ON public.tickets(sla_violado, status) WHERE sla_violado = TRUE;
CREATE INDEX idx_tickets_protocolo ON public.tickets(numero_protocolo);

CREATE TABLE IF NOT EXISTS public.tickets_mensagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE SET NULL,
    nome_remetente VARCHAR(255) NOT NULL,
    email_remetente VARCHAR(255),
    tipo_remetente VARCHAR(20) NOT NULL,
    corpo_mensagem TEXT NOT NULL,
    corpo_html TEXT,
    formato_mensagem VARCHAR(20) DEFAULT 'markdown',
    eh_nota_interna BOOLEAN DEFAULT FALSE,
    eh_resposta_automatica BOOLEAN DEFAULT FALSE,
    anexos_urls TEXT[] DEFAULT '{}',
    citada_mensagem_id UUID REFERENCES public.tickets_mensagens(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    template_usado VARCHAR(100),
    variaveis_template JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT tipo_remetente_chk CHECK (tipo_remetente IN ('cliente', 'agente', 'sistema', 'bot', 'afiliado'))
);

CREATE INDEX idx_tickets_mensagens_ticket ON public.tickets_mensagens(ticket_id, created_at ASC);
CREATE INDEX idx_tickets_mensagens_empresa ON public.tickets_mensagens(empresa_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.comunidade_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE SET NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    afiliado_id UUID REFERENCES public.afiliados(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    corpo TEXT NOT NULL,
    corpo_html TEXT,
    categoria VARCHAR(100),
    tags VARCHAR(255)[] DEFAULT '{}',
    imagem_destaque TEXT,
    tipo_post VARCHAR(20) DEFAULT 'discussao',
    total_visualizacoes INTEGER DEFAULT 0,
    total_curtidas INTEGER DEFAULT 0,
    total_comentarios INTEGER DEFAULT 0,
    total_compartilhamentos INTEGER DEFAULT 0,
    destaque BOOLEAN DEFAULT FALSE,
    fixado BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'publicado',
    fechado BOOLEAN DEFAULT FALSE,
    post_pai_id UUID REFERENCES public.comunidade_posts(id) ON DELETE SET NULL,
    melhor_resposta_id UUID REFERENCES public.comunidade_posts(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_comunidade_posts_empresa ON public.comunidade_posts(empresa_id, created_at DESC);
CREATE INDEX idx_comunidade_posts_pai ON public.comunidade_posts(post_pai_id);
CREATE INDEX idx_comunidade_posts_titulo_trgm ON public.comunidade_posts USING GIN (titulo gin_trgm_ops);

-- FINAL MIGRATION 005