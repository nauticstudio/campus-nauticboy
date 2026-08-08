-- ============================================================================
-- MIGRATION 00001 — Fix perfiles RLS: eliminar recursión infinita y endurecer
-- el cambio de campos privilegiados (role / status / email) desde el cliente.
--
-- Aplica sobre una base creada con `supabase/seed.sql`.
-- Idempotente: puede ejecutarse más de una vez sin romper la base.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Función `is_admin()` rompe la recursión "profiles -> profiles" que tiene
--    la política original, porque se ejecuta como SECURITY DEFINER (bypasa RLS
--    al leer `profiles`) y la política deja de consultar su propia tabla
--    directamente en el contexto del usuario.
--
--    `SET search_path = ''` evita ataques de shadowing de esquema.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
      AND status = 'active'
  );
$$;

-- Solo los usuarios autenticados pueden invocarla; no es API pública.
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ----------------------------------------------------------------------------
-- 2. Trigger: nadie salvo el service role puede cambiar role / status / email
--    de un perfil. La política de abajo sigue permitiendo que el usuario edite
--    su propio nombre/avatar, pero no escalar privilegios.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- El service role (backend con SUPABASE_SERVICE_ROLE_KEY) puede todo.
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF NEW.role    IS DISTINCT FROM OLD.role
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.email  IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'No puedes modificar role, status o email de tu perfil.'
      USING ERRCODE = '42501'; -- insufficient_privilege
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_privilege_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_profile_privilege_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.prevent_profile_privilege_escalation();

-- ----------------------------------------------------------------------------
-- 3. Política de perfiles sin recursión.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT
  USING (public.is_admin());

-- El usuario solo puede actualizar su propia fila y, además, el trigger de
-- arriba impide tocar role/status/email.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 4. Resto de políticas "Admin ..." dejan de consultar `profiles` en el USING
--    y pasan por `is_admin()`. Se recrean de forma explícita por operación
--    para facilitar auditoría.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin full access courses" ON public.courses;
CREATE POLICY "Admin full access courses" ON public.courses
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access modules" ON public.modules;
CREATE POLICY "Admin full access modules" ON public.modules
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access categories" ON public.categories;
CREATE POLICY "Admin full access categories" ON public.categories
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access resources" ON public.resources;
CREATE POLICY "Admin full access resources" ON public.resources
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access module_resources" ON public.module_resources;
CREATE POLICY "Admin full access module_resources" ON public.module_resources
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access enrollments" ON public.enrollments;
CREATE POLICY "Admin full access enrollments" ON public.enrollments
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access announcements" ON public.announcements;
CREATE POLICY "Admin full access announcements" ON public.announcements
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
