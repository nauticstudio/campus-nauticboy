-- =============================================
-- 00008: RESOURCE COLLECTIONS (Colecciones / Sub-carpetas de Recursos)
-- Permite agrupar recursos por marca, fabricante, sub-género o branding
-- (ej. Samples -> Vengeance Sound, Cymatics; Presets -> Serum, Vital)
-- =============================================

CREATE TABLE IF NOT EXISTS public.resource_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_category_collection_slug UNIQUE(category_id, slug)
);

-- Agregar relación en tabla resources
ALTER TABLE public.resources 
  ADD COLUMN IF NOT EXISTS collection_id UUID REFERENCES public.resource_collections(id) ON DELETE SET NULL;

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_resource_collections_category ON public.resource_collections(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_collection ON public.resources(collection_id);

-- Habilitar RLS
ALTER TABLE public.resource_collections ENABLE ROW LEVEL SECURITY;

-- Limpieza preventiva de políticas
DROP POLICY IF EXISTS "Everyone can view published resource collections" ON public.resource_collections;
DROP POLICY IF EXISTS "Admin full access resource collections" ON public.resource_collections;

-- Políticas de acceso
CREATE POLICY "Everyone can view published resource collections"
  ON public.resource_collections
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND is_published = true
  );

CREATE POLICY "Admin full access resource collections"
  ON public.resource_collections
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Notificar a PostgREST para refrescar el schema cache
NOTIFY pgrst, 'reload schema';
