-- ==========================================================================
-- MIGRATION 007 - RLS POLICIES, FUNCTIONS E TRIGGERS
-- Cash Engine PRO
-- ==========================================================================
-- Habilita Row Level Security em TODAS as tabelas e cria políticas seguras.
-- Também instala funções utilitárias e triggers de updated_at/audit.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. FUNÇÃO: Atualizar automaticamente updated_at em qualquer tabela
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- --------------------------------------------------------------------------
-- 2. FUNÇÃO: Obter empresa_id do usuário logado (via profiles)
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_get_empresa_usuario()
RETURNS UUID AS $$
DECLARE
    v_empresa_id UUID;
BEGIN
    SELECT empresa_id INTO v_empresa_id
    FROM public.profiles
    WHERE id = auth.uid()
    LIMIT 1;
    RETURN v_empresa_id;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION public.fn_get_empresa_usuario() TO authenticated, service_role;

-- --------------------------------------------------------------------------
-- 3. FUNÇÃO: Verificar se usuário é ADMIN GLOBAL
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_is_admin_global()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND is_admin_global = TRUE
        AND status = 'ativo'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION public.fn_is_admin_global() TO authenticated, service_role;

-- --------------------------------------------------------------------------
-- 4. FUNÇÃO: Verificar se usuário é OWNER da empresa
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_is_empresa_owner(p_empresa_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    v_empresa_id UUID := COALESCE(p_empresa_id, public.fn_get_empresa_usuario());
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND empresa_id = v_empresa_id
        AND is_owner = TRUE
        AND status = 'ativo'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION public.fn_is_empresa_owner(UUID) TO authenticated, service_role;

-- --------------------------------------------------------------------------
-- 5. FUNÇÃO: Verificar permissão de usuário (recurso.acao)
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_tem_permissao(
    p_modulo VARCHAR,
    p_recurso VARCHAR,
    p_acao tipo_operacao
) RETURNS BOOLEAN AS $$
DECLARE
    v_empresa_id UUID;
    v_profile_id UUID;
BEGIN
    v_profile_id := auth.uid();
    v_empresa_id := public.fn_get_empresa_usuario();

    IF public.fn_is_admin_global() THEN
        RETURN TRUE;
    END IF;

    IF public.fn_is_empresa_owner(v_empresa_id) THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.profile_roles pr
        INNER JOIN public.role_permissions rp ON rp.role_id = pr.role_id
        INNER JOIN public.permissions p ON p.id = rp.permission_id
        INNER JOIN public.roles r ON r.id = pr.role_id
        WHERE pr.profile_id = v_profile_id
          AND pr.empresa_id = v_empresa_id
          AND p.modulo = p_modulo
          AND p.recurso = p_recurso
          AND p.acao = p_acao
          AND r.is_admin = TRUE OR (r.deleted_at IS NULL AND pr.expira_em IS NULL OR pr.expira_em > NOW())
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION public.fn_tem_permissao(VARCHAR, VARCHAR, tipo_operacao) TO authenticated, service_role;

-- --------------------------------------------------------------------------
-- 6. FUNÇÃO: Trigger para criar profile automaticamente quando usuário é criado no auth
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_empresa_id UUID;
    v_nome_completo VARCHAR(255);
BEGIN
    v_nome_completo := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        SPLIT_PART(NEW.email, '@', 1)
    );

    INSERT INTO public.profiles (
        id,
        empresa_id,
        nome_completo,
        email,
        status,
        is_owner,
        preferencias
    ) VALUES (
        NEW.id,
        NULL,
        v_nome_completo,
        NEW.email,
        'ativo',
        FALSE,
        '{"notificacoes_email": true, "notificacoes_push": true, "idioma": "pt-BR", "tema": "dark"}'::jsonb
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_auth_create_profile ON auth.users;
CREATE TRIGGER trg_auth_create_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.fn_handle_new_user();

-- --------------------------------------------------------------------------
-- 7. FUNÇÃO: Trigger para criar saldo automaticamente
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_criar_saldo_empresa()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.saldos (empresa_id)
    VALUES (NEW.id)
    ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_criar_saldo_empresa ON public.empresas;
CREATE TRIGGER trg_criar_saldo_empresa
AFTER INSERT ON public.empresas
FOR EACH ROW EXECUTE FUNCTION public.fn_criar_saldo_empresa();

-- --------------------------------------------------------------------------
-- 8. FUNÇÃO: Trigger de auditoria genérica para logar alterações
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    v_operation tipo_audit_log;
    v_table_name VARCHAR;
    v_old_data JSONB;
    v_new_data JSONB;
BEGIN
    v_table_name := TG_TABLE_NAME;

    IF TG_OP = 'INSERT' THEN
        v_operation := 'create';
        v_new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        v_operation := 'update';
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'DELETE' THEN
        v_operation := 'delete';
        v_old_data := to_jsonb(OLD);
    END IF;

    IF auth.uid() IS NOT NULL THEN
        INSERT INTO public.seguranca_audit_log (
            profile_id,
            empresa_id,
            acao,
            modulo,
            entidade,
            entidade_id,
            descricao,
            dados_antes,
            dados_depois,
            detalhes
        ) VALUES (
            auth.uid(),
            public.fn_get_empresa_usuario(),
            v_operation,
            TG_TABLE_SCHEMA,
            v_table_name,
            CASE WHEN v_new_data IS NOT NULL THEN (v_new_data->>'id')::UUID ELSE (v_old_data->>'id')::UUID END,
            'Operação ' || TG_OP || ' na tabela ' || v_table_name,
            v_old_data,
            v_new_data,
            jsonb_build_object('trigger', TRUE)
        );
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- --------------------------------------------------------------------------
-- 9. FUNÇÃO: Criar empresa do usuário se ainda não existir (para login inicial)
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_criar_empresa_usuario_logado(
    p_nome_fantasia VARCHAR
) RETURNS UUID AS $$
DECLARE
    v_empresa_id UUID;
    v_profile_id UUID;
BEGIN
    v_profile_id := auth.uid();
    IF v_profile_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não autenticado';
    END IF;

    SELECT empresa_id INTO v_empresa_id
    FROM public.profiles
    WHERE id = v_profile_id;

    IF v_empresa_id IS NOT NULL THEN
        RETURN v_empresa_id;
    END IF;

    INSERT INTO public.empresas (nome_fantasia, status)
    VALUES (p_nome_fantasia, 'ativo')
    RETURNING id INTO v_empresa_id;

    UPDATE public.profiles
    SET empresa_id = v_empresa_id,
        is_owner = TRUE,
        updated_at = NOW()
    WHERE id = v_profile_id;

    INSERT INTO public.equipe_membros (
        empresa_id, profile_id, cargo, status
    ) VALUES (
        v_empresa_id, v_profile_id, 'Fundador', 'ativo'
    )
    ON CONFLICT DO NOTHING;

    RETURN v_empresa_id;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION public.fn_criar_empresa_usuario_logado(VARCHAR) TO authenticated;

-- --------------------------------------------------------------------------
-- 10. FUNÇÃO: Gerar código único (32 chars)
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_gerar_codigo_unico(
    p_prefixo VARCHAR DEFAULT '',
    p_tamanho INTEGER DEFAULT 12
) RETURNS VARCHAR AS $$
DECLARE
    chars VARCHAR[] := ARRAY['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z','2','3','4','5','6','7','8','9'];
    result VARCHAR := '';
    i INTEGER;
BEGIN
    FOR i IN 1..p_tamanho LOOP
        result := result || chars[1 + FLOOR(RANDOM() * (ARRAY_LENGTH(chars, 1) - 1))::INTEGER];
    END LOOP;
    RETURN UPPER(TRIM(p_prefixo) || result);
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION public.fn_gerar_codigo_unico(VARCHAR, INTEGER) TO authenticated, service_role;

-- --------------------------------------------------------------------------
-- 11. APLICAR TRIGGERS DE updated_at EM TODAS AS TABELAS COM COLUNA updated_at
-- --------------------------------------------------------------------------
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT table_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND column_name = 'updated_at'
          AND table_name NOT IN ('pg_stat_statements')
        GROUP BY table_name
    LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_set_timestamp_%s ON public.%I;
             CREATE TRIGGER trg_set_timestamp_%s
             BEFORE UPDATE ON public.%I
             FOR EACH ROW EXECUTE FUNCTION public.fn_set_timestamp()',
            r.table_name, r.table_name, r.table_name, r.table_name
        );
    END LOOP;
END $$;

-- --------------------------------------------------------------------------
-- 12. APLICAR AUDIT LOG NAS TABELAS PRINCIPAIS
-- --------------------------------------------------------------------------
DO $$
DECLARE
    v_tabelas VARCHAR[] := ARRAY[
        'produtos', 'checkouts', 'links_pagamento', 'clientes',
        'transacoes', 'saques', 'estornos', 'chargebacks', 'repasses',
        'afiliados', 'comissoes', 'marketplace_produtos',
        'cupons', 'equipe_membros', 'roles', 'profile_roles'
    ];
    v_tabela VARCHAR;
BEGIN
    FOREACH v_tabela IN ARRAY v_tabelas LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = v_tabela) THEN
            EXECUTE format(
                'DROP TRIGGER IF EXISTS trg_audit_%s ON public.%I;
                 CREATE TRIGGER trg_audit_%s
                 AFTER INSERT OR UPDATE OR DELETE ON public.%I
                 FOR EACH ROW EXECUTE FUNCTION public.fn_audit_log()',
                v_tabela, v_tabela, v_tabela, v_tabela
            );
        END IF;
    END LOOP;
END $$;

-- ==========================================================================
-- HABILITAR ROW LEVEL SECURITY EM TODAS AS TABELAS PUBLICAS
-- ==========================================================================
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
          AND table_name NOT IN ('pg_stat_statements', 'pg_buffercache')
        ORDER BY table_name
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.table_name);
        EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', r.table_name);
    END LOOP;
END $$;

-- ==========================================================================
-- POLÍTICAS RLS POR TABELA
-- ==========================================================================

-- --------------------------------------------------------------------------
-- POLÍTICA: EMPRESAS
-- - Admin Global: Tudo
-- - Usuários: Apenas a sua própria empresa
-- --------------------------------------------------------------------------
DROP POLICY IF EXISTS "empresas_select" ON public.empresas;
CREATE POLICY "empresas_select" ON public.empresas FOR SELECT
USING (
    public.fn_is_admin_global() OR
    id = public.fn_get_empresa_usuario()
);

DROP POLICY IF EXISTS "empresas_insert" ON public.empresas;
CREATE POLICY "empresas_insert" ON public.empresas FOR INSERT
WITH CHECK (
    auth.uid() IS NOT NULL
);

DROP POLICY IF EXISTS "empresas_update" ON public.empresas;
CREATE POLICY "empresas_update" ON public.empresas FOR UPDATE
USING (
    public.fn_is_admin_global() OR
    (id = public.fn_get_empresa_usuario() AND public.fn_is_empresa_owner(id))
);

DROP POLICY IF EXISTS "empresas_delete" ON public.empresas;
CREATE POLICY "empresas_delete" ON public.empresas FOR DELETE
USING ( public.fn_is_admin_global() );

-- --------------------------------------------------------------------------
-- POLÍTICA: PROFILES
-- - Admin Global: Tudo
-- - Próprio usuário: leitura/edição do próprio
-- - Membros da mesma empresa: leitura
-- --------------------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT
USING (
    public.fn_is_admin_global() OR
    id = auth.uid() OR
    empresa_id = public.fn_get_empresa_usuario()
);

DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT
WITH CHECK ( auth.uid() IS NOT NULL );

DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE
USING (
    public.fn_is_admin_global() OR
    id = auth.uid() OR
    (empresa_id = public.fn_get_empresa_usuario() AND public.fn_is_empresa_owner(empresa_id)) OR
    public.fn_tem_permissao('rh', 'equipe', 'update')
);

DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE
USING (
    public.fn_is_admin_global() OR
    (empresa_id = public.fn_get_empresa_usuario() AND public.fn_is_empresa_owner(empresa_id))
);

-- --------------------------------------------------------------------------
-- POLÍTICA: ROLES
-- --------------------------------------------------------------------------
DROP POLICY IF EXISTS "roles_select" ON public.roles;
CREATE POLICY "roles_select" ON public.roles FOR SELECT
USING (
    public.fn_is_admin_global() OR
    empresa_id = public.fn_get_empresa_usuario() OR
    is_sistema = TRUE
);

DROP POLICY IF EXISTS "roles_all" ON public.roles;
CREATE POLICY "roles_all" ON public.roles FOR ALL
USING (
    public.fn_is_admin_global() OR
    (empresa_id = public.fn_get_empresa_usuario() AND (
        public.fn_is_empresa_owner(empresa_id) OR
        public.fn_tem_permissao('configuracoes', 'permissoes', 'manage')
    ))
) WITH CHECK (
    public.fn_is_admin_global() OR
    (empresa_id = public.fn_get_empresa_usuario() AND (
        public.fn_is_empresa_owner(empresa_id) OR
        public.fn_tem_permissao('configuracoes', 'permissoes', 'manage')
    ))
);

-- --------------------------------------------------------------------------
-- POLÍTICA: PERMISSIONS
-- --------------------------------------------------------------------------
DROP POLICY IF EXISTS "permissions_all" ON public.permissions;
CREATE POLICY "permissions_all" ON public.permissions FOR ALL
USING ( TRUE )
WITH CHECK ( public.fn_is_admin_global() );

-- --------------------------------------------------------------------------
-- POLÍTICA: ROLE_PERMISSIONS / PROFILE_ROLES
-- --------------------------------------------------------------------------
DROP POLICY IF EXISTS "rp_all" ON public.role_permissions;
CREATE POLICY "rp_all" ON public.role_permissions FOR ALL
USING (
    public.fn_is_admin_global() OR
    EXISTS (
        SELECT 1 FROM public.roles r
        WHERE r.id = role_permissions.role_id
        AND r.empresa_id = public.fn_get_empresa_usuario()
        AND (public.fn_is_empresa_owner(r.empresa_id) OR
             public.fn_tem_permissao('configuracoes', 'permissoes', 'manage'))
    )
) WITH CHECK (
    public.fn_is_admin_global() OR
    EXISTS (
        SELECT 1 FROM public.roles r
        WHERE r.id = role_permissions.role_id
        AND r.empresa_id = public.fn_get_empresa_usuario()
        AND (public.fn_is_empresa_owner(r.empresa_id) OR
             public.fn_tem_permissao('configuracoes', 'permissoes', 'manage'))
    )
);

DROP POLICY IF EXISTS "profile_roles_all" ON public.profile_roles;
CREATE POLICY "profile_roles_all" ON public.profile_roles FOR ALL
USING (
    public.fn_is_admin_global() OR
    (empresa_id = public.fn_get_empresa_usuario() AND (
        profile_id = auth.uid() OR
        public.fn_is_empresa_owner(empresa_id) OR
        public.fn_tem_permissao('configuracoes', 'permissoes', 'manage')
    ))
) WITH CHECK (
    public.fn_is_admin_global() OR
    (empresa_id = public.fn_get_empresa_usuario() AND (
        public.fn_is_empresa_owner(empresa_id) OR
        public.fn_tem_permissao('configuracoes', 'permissoes', 'manage')
    ))
);

-- --------------------------------------------------------------------------
-- FUNÇÃO: Macro para criar políticas CRUD padrão para tabelas com empresa_id
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_apply_rls_empresa(
    p_tabela VARCHAR,
    p_permissao_modulo VARCHAR DEFAULT NULL,
    p_permissao_recurso VARCHAR DEFAULT NULL,
    p_owner_only_update BOOLEAN DEFAULT FALSE
) RETURNS VOID AS $$
DECLARE
    v_select TEXT;
    v_insert TEXT;
    v_update TEXT;
    v_delete TEXT;
BEGIN
    v_select := format(
        'DROP POLICY IF EXISTS "%s_select" ON public.%I;
         CREATE POLICY "%s_select" ON public.%I FOR SELECT USING (
             public.fn_is_admin_global() OR
             empresa_id = public.fn_get_empresa_usuario()
         );',
        p_tabela, p_tabela, p_tabela, p_tabela
    );

    IF p_permissao_modulo IS NOT NULL AND p_permissao_recurso IS NOT NULL THEN
        v_insert := format(
            'DROP POLICY IF EXISTS "%s_insert" ON public.%I;
             CREATE POLICY "%s_insert" ON public.%I FOR INSERT WITH CHECK (
                 public.fn_is_admin_global() OR
                 (empresa_id = public.fn_get_empresa_usuario() AND (
                     public.fn_is_empresa_owner(empresa_id) OR
                     public.fn_tem_permissao(%L, %L, ''create'')
                 ))
             );',
            p_tabela, p_tabela, p_tabela, p_tabela, p_permissao_modulo, p_permissao_recurso
        );

        IF p_owner_only_update THEN
            v_update := format(
                'DROP POLICY IF EXISTS "%s_update" ON public.%I;
                 CREATE POLICY "%s_update" ON public.%I FOR UPDATE USING (
                     public.fn_is_admin_global() OR
                     (empresa_id = public.fn_get_empresa_usuario() AND
                      public.fn_is_empresa_owner(empresa_id))
                 );',
                p_tabela, p_tabela, p_tabela, p_tabela
            );
        ELSE
            v_update := format(
                'DROP POLICY IF EXISTS "%s_update" ON public.%I;
                 CREATE POLICY "%s_update" ON public.%I FOR UPDATE USING (
                     public.fn_is_admin_global() OR
                     (empresa_id = public.fn_get_empresa_usuario() AND (
                         public.fn_is_empresa_owner(empresa_id) OR
                         public.fn_tem_permissao(%L, %L, ''update'')
                     ))
                 );',
                p_tabela, p_tabela, p_tabela, p_tabela, p_permissao_modulo, p_permissao_recurso
            );
        END IF;

        v_delete := format(
            'DROP POLICY IF EXISTS "%s_delete" ON public.%I;
             CREATE POLICY "%s_delete" ON public.%I FOR DELETE USING (
                 public.fn_is_admin_global() OR
                 (empresa_id = public.fn_get_empresa_usuario() AND (
                     public.fn_is_empresa_owner(empresa_id) OR
                     public.fn_tem_permissao(%L, %L, ''delete'')
                 ))
             );',
            p_tabela, p_tabela, p_tabela, p_tabela, p_permissao_modulo, p_permissao_recurso
        );
    ELSE
        v_insert := format(
            'DROP POLICY IF EXISTS "%s_insert" ON public.%I;
             CREATE POLICY "%s_insert" ON public.%I FOR INSERT WITH CHECK (
                 public.fn_is_admin_global() OR
                 (empresa_id = public.fn_get_empresa_usuario() AND
                  public.fn_is_empresa_owner(empresa_id))
             );',
            p_tabela, p_tabela, p_tabela, p_tabela
        );
        v_update := format(
            'DROP POLICY IF EXISTS "%s_update" ON public.%I;
             CREATE POLICY "%s_update" ON public.%I FOR UPDATE USING (
                 public.fn_is_admin_global() OR
                 (empresa_id = public.fn_get_empresa_usuario() AND
                  public.fn_is_empresa_owner(empresa_id))
             );',
            p_tabela, p_tabela, p_tabela, p_tabela
        );
        v_delete := format(
            'DROP POLICY IF EXISTS "%s_delete" ON public.%I;
             CREATE POLICY "%s_delete" ON public.%I FOR DELETE USING (
                 public.fn_is_admin_global() OR
                 (empresa_id = public.fn_get_empresa_usuario() AND
                  public.fn_is_empresa_owner(empresa_id))
             );',
            p_tabela, p_tabela, p_tabela, p_tabela
        );
    END IF;

    EXECUTE v_select;
    EXECUTE v_insert;
    EXECUTE v_update;
    EXECUTE v_delete;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- --------------------------------------------------------------------------
-- Aplicar RLS padrão nas demais tabelas com empresa_id
-- --------------------------------------------------------------------------
SELECT public.fn_apply_rls_empresa('categorias_produtos', 'produtos', 'categorias');
SELECT public.fn_apply_rls_empresa('produtos', 'produtos', 'produtos');
SELECT public.fn_apply_rls_empresa('cupons', 'vendas', 'cupons');
SELECT public.fn_apply_rls_empresa('templates_checkout', 'produtos', 'checkouts');
SELECT public.fn_apply_rls_empresa('checkouts', 'produtos', 'checkouts');
SELECT public.fn_apply_rls_empresa('links_pagamento', 'vendas', 'links');
SELECT public.fn_apply_rls_empresa('clientes', 'vendas', 'clientes');
SELECT public.fn_apply_rls_empresa('afiliados', 'afiliados', 'afiliados');
SELECT public.fn_apply_rls_empresa('afiliados_produtos', 'afiliados', 'afiliados');
SELECT public.fn_apply_rls_empresa('links_afiliados', 'afiliados', 'links');
SELECT public.fn_apply_rls_empresa('comissoes', 'afiliados', 'comissoes');
SELECT public.fn_apply_rls_empresa('marketplace_produtos');
SELECT public.fn_apply_rls_empresa('marketplace_inscricoes', 'afiliados', 'marketplace');
SELECT public.fn_apply_rls_empresa('rede_afiliados_hierarquia', 'afiliados', 'afiliados');
SELECT public.fn_apply_rls_empresa('contas_bancarias', 'financeiro', 'contas', TRUE);
SELECT public.fn_apply_rls_empresa('saldos', 'financeiro', 'saldo', TRUE);
SELECT public.fn_apply_rls_empresa('transacoes', 'financeiro', 'transacoes');
SELECT public.fn_apply_rls_empresa('transacoes_parcelas', 'financeiro', 'transacoes');
SELECT public.fn_apply_rls_empresa('saques', 'financeiro', 'saques');
SELECT public.fn_apply_rls_empresa('estornos', 'financeiro', 'estornos');
SELECT public.fn_apply_rls_empresa('chargebacks', 'financeiro', 'chargebacks');
SELECT public.fn_apply_rls_empresa('repasses', 'financeiro', 'repasses');
SELECT public.fn_apply_rls_empresa('taxas_plataforma', 'financeiro', 'taxas');
SELECT public.fn_apply_rls_empresa('lancamentos_contabeis', 'financeiro', 'relatorios', TRUE);
SELECT public.fn_apply_rls_empresa('equipe_membros', 'rh', 'equipe');
SELECT public.fn_apply_rls_empresa('seguranca_sessoes', 'configuracoes', 'seguranca', TRUE);
SELECT public.fn_apply_rls_empresa('seguranca_audit_log', 'configuracoes', 'seguranca', TRUE);
SELECT public.fn_apply_rls_empresa('seguranca_2fa', 'configuracoes', 'seguranca', TRUE);
SELECT public.fn_apply_rls_empresa('seguranca_dispositivos', 'configuracoes', 'seguranca', TRUE);
SELECT public.fn_apply_rls_empresa('seguranca_bloqueios', 'configuracoes', 'seguranca', TRUE);
SELECT public.fn_apply_rls_empresa('seguranca_senhas_historico', 'configuracoes', 'seguranca', TRUE);
SELECT public.fn_apply_rls_empresa('seguranca_chaves_api', 'developers', 'chaves_api', TRUE);
SELECT public.fn_apply_rls_empresa('seguranca_webhooks', 'developers', 'webhooks');
SELECT public.fn_apply_rls_empresa('seguranca_webhooks_log', 'developers', 'webhooks', TRUE);
SELECT public.fn_apply_rls_empresa('notificacoes', 'sistema', 'notificacoes');
SELECT public.fn_apply_rls_empresa('notificacoes_preferencias', 'sistema', 'notificacoes');
SELECT public.fn_apply_rls_empresa('ajuda_categorias');
SELECT public.fn_apply_rls_empresa('ajuda_artigos');
SELECT public.fn_apply_rls_empresa('ajuda_feedback');
SELECT public.fn_apply_rls_empresa('tickets', 'suporte', 'tickets');
SELECT public.fn_apply_rls_empresa('tickets_mensagens', 'suporte', 'tickets');
SELECT public.fn_apply_rls_empresa('comunidade_posts');
SELECT public.fn_apply_rls_empresa('admin_empresas_gestao', NULL, NULL, TRUE);
SELECT public.fn_apply_rls_empresa('admin_banimentos', NULL, NULL, TRUE);
SELECT public.fn_apply_rls_empresa('admin_moderacao', NULL, NULL, TRUE);
SELECT public.fn_apply_rls_empresa('admin_comunicados');
SELECT public.fn_apply_rls_empresa('integracoes', 'configuracoes', 'integracoes');
SELECT public.fn_apply_rls_empresa('integracoes_logs', 'configuracoes', 'integracoes', TRUE);
SELECT public.fn_apply_rls_empresa('treinamentos_cursos', 'treinamentos', 'cursos');
SELECT public.fn_apply_rls_empresa('treinamentos_modulos', 'treinamentos', 'cursos');
SELECT public.fn_apply_rls_empresa('treinamentos_aulas', 'treinamentos', 'cursos');
SELECT public.fn_apply_rls_empresa('treinamentos_matriculas', 'treinamentos', 'matriculas');
SELECT public.fn_apply_rls_empresa('treinamentos_progresso', 'treinamentos', 'matriculas');
SELECT public.fn_apply_rls_empresa('relatorios_agendados', 'relatorios', 'agendados');
SELECT public.fn_apply_rls_empresa('relatorios_historico', 'relatorios', 'agendados');
SELECT public.fn_apply_rls_empresa('invites');

-- --------------------------------------------------------------------------
-- POLÍTICAS ESPECÍFICAS PARA TABELAS QUE NÃO SEGUEM PADRÃO
-- --------------------------------------------------------------------------

-- ADMIN_GLOBAL_CONFIG: Apenas admin global
DROP POLICY IF EXISTS "agc_all" ON public.admin_global_config;
CREATE POLICY "agc_all" ON public.admin_global_config FOR ALL
USING ( public.fn_is_admin_global() )
WITH CHECK ( public.fn_is_admin_global() );

-- MARKETPLACE PÚBLICO: Permitir SELECT público em produtos publicados
DROP POLICY IF EXISTS "marketplace_publico" ON public.marketplace_produtos;
CREATE POLICY "marketplace_publico" ON public.marketplace_produtos FOR SELECT
USING (
    status = 'publicado' OR
    public.fn_is_admin_global() OR
    empresa_vendedora_id = public.fn_get_empresa_usuario()
);

-- AJUDA PÚBLICA: Artigos e categorias públicos sem autenticação
DROP POLICY IF EXISTS "ajuda_artigos_publico" ON public.ajuda_artigos;
CREATE POLICY "ajuda_artigos_publico" ON public.ajuda_artigos FOR SELECT
USING ( publico = TRUE OR auth.uid() IS NOT NULL );

DROP POLICY IF EXISTS "ajuda_categorias_publico" ON public.ajuda_categorias;
CREATE POLICY "ajuda_categorias_publico" ON public.ajuda_categorias FOR SELECT
USING ( publica = TRUE OR auth.uid() IS NOT NULL );

-- COMUNICADOS PÚBLICOS
DROP POLICY IF EXISTS "comunicados_publicos" ON public.admin_comunicados;
CREATE POLICY "comunicados_publicos" ON public.admin_comunicados FOR SELECT
USING (
    (publicado = TRUE AND NOW() BETWEEN COALESCE(data_inicio, NOW()) AND COALESCE(data_fim, NOW() + INTERVAL '1 year')) OR
    public.fn_is_admin_global()
);

-- --------------------------------------------------------------------------
-- 13. FUNÇÃO: Criar convite de equipe
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_criar_convite(
    p_tipo VARCHAR,
    p_email VARCHAR,
    p_nome VARCHAR DEFAULT NULL,
    p_cargo VARCHAR DEFAULT NULL,
    p_role_id UUID DEFAULT NULL,
    p_taxa_comissao DECIMAL DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_empresa_id UUID;
    v_invite_id UUID;
    v_codigo VARCHAR;
    v_token_hash VARCHAR;
BEGIN
    v_empresa_id := public.fn_get_empresa_usuario();
    IF v_empresa_id IS NULL THEN
        RAISE EXCEPTION 'Empresa não encontrada para o usuário';
    END IF;

    IF p_tipo NOT IN ('equipe', 'afiliado') THEN
        RAISE EXCEPTION 'Tipo de convite inválido';
    END IF;

    IF p_tipo = 'equipe' AND NOT (
        public.fn_is_empresa_owner(v_empresa_id) OR
        public.fn_tem_permissao('rh', 'equipe', 'create')
    ) THEN
        RAISE EXCEPTION 'Sem permissão para convidar equipe';
    END IF;

    IF p_tipo = 'afiliado' AND NOT (
        public.fn_is_empresa_owner(v_empresa_id) OR
        public.fn_tem_permissao('afiliados', 'afiliados', 'create')
    ) THEN
        RAISE EXCEPTION 'Sem permissão para convidar afiliados';
    END IF;

    v_codigo := public.fn_gerar_codigo_unico('', 32);
    v_token_hash := encode(digest(gen_random_uuid()::text || p_email || NOW()::text, 'sha256'), 'hex');

    INSERT INTO public.invites (
        empresa_id, convidado_por, tipo, email, nome, cargo, role_id,
        codigo_convite, token_hash, taxa_comissao_padrao
    ) VALUES (
        v_empresa_id, auth.uid(), p_tipo, LOWER(p_email), p_nome, p_cargo, p_role_id,
        v_codigo, v_token_hash, p_taxa_comissao
    ) RETURNING id INTO v_invite_id;

    RETURN v_invite_id;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION public.fn_criar_convite(VARCHAR, VARCHAR, VARCHAR, VARCHAR, UUID, DECIMAL) TO authenticated;

-- --------------------------------------------------------------------------
-- FINAL MIGRATION 007
-- --------------------------------------------------------------------------
