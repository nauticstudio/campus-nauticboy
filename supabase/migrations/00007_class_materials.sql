-- =============================================
-- 00007: CLASS MATERIALS (Material de Clase / Entregas)
-- Permite al profesor alojar y asignar proyectos y material multi-archivo
-- de cada clase a alumnos específicos con enlaces de Google Drive / descarga.
-- =============================================

CREATE TABLE IF NOT EXISTS public.class_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  files JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices optimizados
CREATE INDEX IF NOT EXISTS idx_class_materials_student ON public.class_materials(student_id);
CREATE INDEX IF NOT EXISTS idx_class_materials_created ON public.class_materials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_class_materials_date ON public.class_materials(session_date DESC);

-- Habilitar RLS
ALTER TABLE public.class_materials ENABLE ROW LEVEL SECURITY;

-- Limpieza preventiva de políticas
DROP POLICY IF EXISTS "Students can view own class materials" ON public.class_materials;
DROP POLICY IF EXISTS "Admin full access class materials" ON public.class_materials;

-- Política para Alumnos: solo pueden consultar sus propios materiales publicados
CREATE POLICY "Students can view own class materials"
  ON public.class_materials
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND student_id = auth.uid()
    AND is_published = true
  );

-- Política para Administrador: acceso total (lectura, inserción, actualización, eliminación)
CREATE POLICY "Admin full access class materials"
  ON public.class_materials
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Notificar a PostgREST para recargar el schema cache inmediatamente
NOTIFY pgrst, 'reload schema';
