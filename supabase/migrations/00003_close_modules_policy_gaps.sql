-- ============================================================================
-- MIGRATION 00003 — Cercar políticas que el seed.sql original dejó abiertas.
--
-- Contexto: el `seed.sql` es para bases nuevas; cuando el proyecto se desplegó
-- por primera vez, las políticas de `modules`, `module_resources`,
-- `announcements` y el esquema de software se aplicaron con
-- `CREATE POLICY ... USING (true)`, lo que expone datos a lectores anónimos.
--
-- Esta migración es idempotente y aplica los patrones que ya exige la capa de
-- aplicación (RLS + usuario autenticado). No rompe nada público legítimo.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. modules: el selector antiguo era `USING (true)` y exponía los módulos a
--    cualquiera. La política correcta es: solo autenticados ven módulos
--    publicados de cursos publicados.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Everyone can view published modules" ON public.modules;
DROP POLICY IF EXISTS "Public Read Modules" ON public.modules;

CREATE POLICY "Everyone can view published modules" ON public.modules
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND is_published = true
    AND EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = modules.course_id
        AND courses.is_published = true
    )
  );

-- ----------------------------------------------------------------------------
-- 2. module_resources: lectura libre -> solo autenticados.
--    La fila de junta curso ↔ recurso no contiene datos sensibles en sí, pero
--    listar todos los enlaces entre cursos y recursos es metadata privada.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Everyone can view module_resources" ON public.module_resources;
DROP POLICY IF EXISTS "Public Read Module Resources" ON public.module_resources;

CREATE POLICY "Everyone can view module_resources" ON public.module_resources
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ----------------------------------------------------------------------------
-- 3. announcements: aunque son públicos dentro del campus, no es API abierta.
--    Solo alumnos/staff logueados pueden listarlos.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Everyone can view announcements" ON public.announcements;
DROP POLICY IF EXISTS "Public Read Announcements" ON public.announcements;

CREATE POLICY "Everyone can view announcements" ON public.announcements
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ----------------------------------------------------------------------------
-- 4. software_*: endurecer lecturas para que solo usuarios autenticados las
--    consuman (recursos del campus, no catálogo público). El admin sigue
--    teniendo FOR ALL por `is_admin()`.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public Read Products" ON public.software_products;
CREATE POLICY "Public Read Products" ON public.software_products
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_published = true);

DROP POLICY IF EXISTS "Public Read Items" ON public.software_items;
CREATE POLICY "Public Read Items" ON public.software_items
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_published = true);

DROP POLICY IF EXISTS "Public Read Manufacturers" ON public.software_manufacturers;
CREATE POLICY "Public Read Manufacturers" ON public.software_manufacturers
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Public Read Categories" ON public.software_categories;
CREATE POLICY "Public Read Categories" ON public.software_categories
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Public Read Tags" ON public.software_tags;
CREATE POLICY "Public Read Tags" ON public.software_tags
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Public Read Product Categories" ON public.software_product_categories;
CREATE POLICY "Public Read Product Categories" ON public.software_product_categories
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Public Read Product Tags" ON public.software_product_tags;
CREATE POLICY "Public Read Product Tags" ON public.software_product_tags
  FOR SELECT
  USING (auth.uid() IS NOT NULL);
