-- Patch para aplicar las mejores prácticas a una DB de Supabase existente
-- 1. Actualizar las funciones existentes para que utilicen search_path seguro
ALTER FUNCTION user_can_access_resource(UUID, UUID) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- 2. Agregar columna generada para la búsqueda de texto y cambiar el índice
ALTER TABLE resources ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (to_tsvector('spanish', title || ' ' || COALESCE(description, ''))) STORED;

-- Borrar el índice viejo si existía
DROP INDEX IF EXISTS idx_resources_search;

-- Crear el índice nuevo en la columna generada
CREATE INDEX idx_resources_search ON resources USING GIN(search_vector);
