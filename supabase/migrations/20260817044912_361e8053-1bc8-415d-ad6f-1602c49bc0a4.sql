-- ==========================================================================
-- MIGRATION 001 - SCHEMA BASE
-- Cash Engine PRO - Sistema de E-commerce e Pagamentos
-- ==========================================================================
-- Tabelas: empresas, profiles, roles, permissions, role_permissions, profile_roles
-- ==========================================================================

-- --------------------------------------------------------------------------
-- EXTENSÕES OBRIGATÓRIAS
-- --------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- --------------------------------------------------------------------------
-- ENUMS GLOBAIS
-- --------------------------------------------------------------------------
CREATE TYPE status_ativo AS ENUM ('ativo', 'inativo', 'suspenso', 'bloqueado');
CREATE TYPE tipo_operacao AS ENUM ('create', 'read', 'update', 'delete', 'approve', 'manage');

-- --------------------------------------------------------------------------
-- TABELA: EMPRESAS (Tenant principal)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_fantasia VARCHAR(255) NOT NULL,
    razao_social VARCHAR(255),
    cnpj VARCHAR(20) UNIQUE,
    ie VARCHAR(30),
    im VARCHAR(30),
    email VARCHAR(255) UNIQUE,
    telefone VARCHAR(20),
    celular VARCHAR(20),
    site VARCHAR(255),
    logotipo_url TEXT,
    cep VARCHAR(10),
    logradouro VARCHAR(255),
    numero VARCHAR(30),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    pais VARCHAR(50) DEFAULT 'Brasil',
    segmento VARCHAR(100),
    plano VARCHAR(50) DEFAULT 'free',
    status status_ativo NOT NULL DEFAULT 'ativo',
    configuracoes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_empresas_cnpj ON public.empresas(cnpj);
CREATE INDEX idx_empresas_email ON public.empresas(email);
CREATE INDEX idx_empresas_status ON public.empresas(status);
CREATE INDEX idx_empresas_plano ON public.empresas(plano);

-- --------------------------------------------------------------------------
-- TABELA: PROFILES (Usuários do sistema - vinculados ao auth.users)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE SET NULL,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14),
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    celular VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    cargo VARCHAR(100),
    departamento VARCHAR(100),
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
    status status_ativo NOT NULL DEFAULT 'ativo',
    ultimo_login TIMESTAMPTZ,
    ultimo_ip VARCHAR(45),
    ultimo_user_agent TEXT,
    is_owner BOOLEAN NOT NULL DEFAULT FALSE,
    is_admin_global BOOLEAN NOT NULL DEFAULT FALSE,
    preferencias JSONB DEFAULT '{"notificacoes_email": true, "notificacoes_push": true, "idioma": "pt-BR", "tema": "dark"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(empresa_id, email),
    CONSTRAINT profiles_cpf_unico_por_empresa UNIQUE NULLS NOT DISTINCT (empresa_id, cpf)
);

CREATE INDEX idx_profiles_empresa_id ON public.profiles(empresa_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_cpf ON public.profiles(cpf);
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_profiles_nome_completo_trgm ON public.profiles USING GIN (nome_completo gin_trgm_ops);

-- --------------------------------------------------------------------------
-- TABELA: ROLES (Papéis do sistema)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    cor VARCHAR(20) DEFAULT '#6366f1',
    nivel INTEGER DEFAULT 10,
    is_sistema BOOLEAN NOT NULL DEFAULT FALSE,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE NULLS NOT DISTINCT (empresa_id, nome)
);

CREATE INDEX idx_roles_empresa_id ON public.roles(empresa_id);

-- --------------------------------------------------------------------------
-- TABELA: PERMISSIONS (Permissões granulares)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modulo VARCHAR(100) NOT NULL,
    recurso VARCHAR(100) NOT NULL,
    acao tipo_operacao NOT NULL,
    nome_exibicao VARCHAR(255) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(modulo, recurso, acao)
);

CREATE INDEX idx_permissions_modulo ON public.permissions(modulo);
CREATE INDEX idx_permissions_recurso ON public.permissions(recurso);

-- --------------------------------------------------------------------------
-- TABELA: ROLE_PERMISSIONS (Relação roles x permissions)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON public.role_permissions(permission_id);

-- --------------------------------------------------------------------------
-- TABELA: PROFILE_ROLES (Relação profiles x roles)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    concedido_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    data_concessao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expira_em TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(profile_id, role_id, empresa_id)
);

CREATE INDEX idx_profile_roles_profile_id ON public.profile_roles(profile_id);
CREATE INDEX idx_profile_roles_role_id ON public.profile_roles(role_id);
CREATE INDEX idx_profile_roles_empresa_id ON public.profile_roles(empresa_id);

-- --------------------------------------------------------------------------
-- TABELA: INVITES (Convites para equipe e afiliados)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    convidado_por UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nome VARCHAR(255),
    cargo VARCHAR(100),
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    codigo_convite VARCHAR(32) UNIQUE NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    mensagem TEXT,
    link_afiliado_base TEXT,
    taxa_comissao_padrao DECIMAL(5,2),
    expira_em TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    aceito_em TIMESTAMPTZ,
    aceito_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (tipo IN ('equipe', 'afiliado'))
);

CREATE INDEX idx_invites_empresa_id ON public.invites(empresa_id);
CREATE INDEX idx_invites_email ON public.invites(email);
CREATE INDEX idx_invites_tipo ON public.invites(tipo);
CREATE INDEX idx_invites_status ON public.invites(status);
CREATE INDEX idx_invites_codigo_convite ON public.invites(codigo_convite);

-- --------------------------------------------------------------------------
-- FINAL MIGRATION 001
-- --------------------------------------------------------------------------