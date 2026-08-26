REVOKE EXECUTE ON FUNCTION public.current_empresa_id() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_admin_global() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.current_empresa_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin_global() TO authenticated, service_role;