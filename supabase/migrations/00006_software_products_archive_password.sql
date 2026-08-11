-- =============================================
-- FIX: admin "Añadir Nuevo Producto" fallaba al crear software (ej. LFOTool)
--
-- La Server Action `createSoftwareProductAction` inserta `archive_password`
-- en `software_products` (campo "Contraseña de Descompresión" del modal
-- InlineCreateSoftwareModal), pero la columna no existía en ningún DDL:
-- ni en supabase/software_schema.sql ni en ninguna migración.
-- PostgREST devolvía PGRST204 ("Could not find the 'archive_password'
-- column...") y el cliente solo mostraba el alert genérico
-- "Error al crear el producto."
-- =============================================

ALTER TABLE public.software_products
  ADD COLUMN IF NOT EXISTS archive_password TEXT;

COMMENT ON COLUMN public.software_products.archive_password IS
  'Contraseña de descompresión (ZIP/RAR) de los instaladores del producto. Solo visible/gestionable por admins.';

-- Defensivo: asegura que el schema cache de PostgREST ve la columna al instante.
NOTIFY pgrst, 'reload schema';
