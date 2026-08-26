-- Helper functions
CREATE OR REPLACE FUNCTION public.current_empresa_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_admin_global()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT is_admin_global FROM public.profiles WHERE id = auth.uid()), FALSE)
$$;

-- Profiles: own row always visible/editable
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_select_self ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR (empresa_id IS NOT NULL AND empresa_id = public.current_empresa_id()));
CREATE POLICY profiles_insert_self ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY profiles_update_self ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Empresas: members of the company
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
CREATE POLICY empresas_select ON public.empresas FOR SELECT TO authenticated
  USING (id = public.current_empresa_id() OR public.is_admin_global());
CREATE POLICY empresas_insert ON public.empresas FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY empresas_update ON public.empresas FOR UPDATE TO authenticated
  USING (id = public.current_empresa_id() OR public.is_admin_global())
  WITH CHECK (id = public.current_empresa_id() OR public.is_admin_global());

-- Generic tenant policies for every other public table
DO $do$
DECLARE t record; has_empresa boolean;
BEGIN
  FOR t IN
    SELECT c.relname AS tbl
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r'
      AND c.relname NOT IN ('profiles','empresas')
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tbl);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t.tbl);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t.tbl);

    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name=t.tbl AND column_name='empresa_id'
    ) INTO has_empresa;

    IF has_empresa THEN
      EXECUTE format($f$CREATE POLICY %I ON public.%I FOR ALL TO authenticated
        USING (empresa_id = public.current_empresa_id() OR public.is_admin_global())
        WITH CHECK (empresa_id = public.current_empresa_id() OR public.is_admin_global())$f$,
        t.tbl || '_tenant_all', t.tbl);
    ELSE
      EXECUTE format($f$CREATE POLICY %I ON public.%I FOR ALL TO authenticated
        USING (public.is_admin_global()) WITH CHECK (public.is_admin_global())$f$,
        t.tbl || '_admin_all', t.tbl);
    END IF;
  END LOOP;
END
$do$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.empresas TO authenticated;
GRANT ALL ON public.empresas TO service_role;
GRANT EXECUTE ON FUNCTION public.current_empresa_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_global() TO authenticated;