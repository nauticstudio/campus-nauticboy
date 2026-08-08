-- ============================================================================
-- MIGRATION 00002 — Añadir `is_published` a `modules` y endurecer la función
-- de autorización de recursos.
--
-- El código (`src/app/actions/modules.ts`, páginas de curso) ya inserta y
-- filtra por `modules.is_published`, pero el `CREATE TABLE` original no la
-- define. Esta migración alinea el esquema con el código.
--
-- Idempotente.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Columna `is_published` en módulos.
--    DEFAULT true para no ocultar de golpe los módulos ya existentes en
--    producción: los nuevos módulos se crean explícitamente con
--    `is_published: false` desde la aplicación.
-- ----------------------------------------------------------------------------
ALTER TABLE public.modules
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true;

-- ----------------------------------------------------------------------------
-- 2. `user_can_access_resource` también exige que el curso que contiene el
--    recurso esté publicado, y fija `search_path` por seguridad.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.user_can_access_resource(
  p_user_id UUID,
  p_resource_id UUID
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- El recurso debe existir y estar publicado.
  IF NOT EXISTS (
    SELECT 1 FROM public.resources
    WHERE id = p_resource_id AND is_published = true
  ) THEN
    RETURN false;
  END IF;

  -- Recurso no restringido: acceso libre a usuarios autenticados.
  IF NOT (SELECT is_restricted FROM public.resources WHERE id = p_resource_id) THEN
    RETURN true;
  END IF;

  -- Restringido: el usuario debe estar inscrito en un curso PUBLICADO que
  -- contenga el recurso a través de un módulo PUBLICADO.
  RETURN EXISTS (
    SELECT 1
    FROM public.enrollments e
    JOIN public.modules m ON m.course_id = e.course_id
    JOIN public.courses c ON c.id = m.course_id
    JOIN public.module_resources mr ON mr.module_id = m.id
    WHERE e.user_id = p_user_id
      AND mr.resource_id = p_resource_id
      AND c.is_published = true
      AND m.is_published = true
  );
END;
$$;

REVOKE ALL ON FUNCTION public.user_can_access_resource(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.user_can_access_resource(UUID, UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.user_can_access_resource(UUID, UUID) TO authenticated;
