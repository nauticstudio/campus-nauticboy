'use server'

import { revalidatePath } from 'next/cache'
import { checkAdmin } from '@/server/auth/guards'

export type CollectionActionResult =
  | { success: true; id?: string; slug?: string }
  | { success: false; error: string }

function slugify(text: string) {
  const base = text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
  return base.length > 0 ? base : 'coleccion'
}

/**
 * Crea una nueva sub-colección o carpeta dentro de una categoría (ej. Samples -> Vengeance Sound)
 */
export async function createCollectionAction(formData: FormData): Promise<CollectionActionResult> {
  try {
    const auth = await checkAdmin()
    if (!auth.ok) return { success: false, error: auth.error }

    const categoryId = (formData.get('category_id') as string)?.trim()
    const name = (formData.get('name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim() || null
    const thumbnailUrl = (formData.get('thumbnail_url') as string)?.trim() || null
    const isPublished = formData.get('is_published') !== 'false'

    if (!categoryId) {
      return { success: false, error: 'La categoría es obligatoria.' }
    }
    if (!name || name.length < 2) {
      return { success: false, error: 'El nombre de la colección debe tener al menos 2 caracteres.' }
    }

    const baseSlug = slugify(name)

    // Verificar si ya existe una colección con ese slug en la misma categoría
    const { data: existing } = await auth.admin
      .from('resource_collections')
      .select('id')
      .eq('category_id', categoryId)
      .eq('slug', baseSlug)
      .maybeSingle()

    const finalSlug = existing ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug

    const { data: inserted, error } = await auth.admin
      .from('resource_collections')
      .insert({
        category_id: categoryId,
        name,
        slug: finalSlug,
        description,
        thumbnail_url: thumbnailUrl,
        is_published: isPublished,
      })
      .select('id, slug')
      .single()

    if (error) {
      console.error('[createCollectionAction] Error DB:', error)
      return { success: false, error: `Error creando colección: ${error.message}` }
    }

    revalidatePath('/academy')
    revalidatePath('/academy/[slug]', 'page')
    revalidatePath('/academy/[slug]/[collectionSlug]', 'page')

    return { success: true, id: inserted.id, slug: inserted.slug }
  } catch (err: any) {
    console.error('[createCollectionAction] Excepción:', err)
    return { success: false, error: err?.message || 'Error inesperado al crear la colección.' }
  }
}

/**
 * Actualiza los datos de una colección existente.
 */
export async function updateCollectionAction(formData: FormData): Promise<CollectionActionResult> {
  try {
    const auth = await checkAdmin()
    if (!auth.ok) return { success: false, error: auth.error }

    const id = (formData.get('id') as string)?.trim()
    const name = (formData.get('name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim() || null
    const thumbnailUrl = (formData.get('thumbnail_url') as string)?.trim() || null
    const isPublished = formData.get('is_published') !== 'false'

    if (!id) return { success: false, error: 'ID de colección no válido.' }
    if (!name || name.length < 2) {
      return { success: false, error: 'El nombre debe tener al menos 2 caracteres.' }
    }

    const { error } = await auth.admin
      .from('resource_collections')
      .update({
        name,
        description,
        thumbnail_url: thumbnailUrl,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('[updateCollectionAction] Error DB:', error)
      return { success: false, error: `Error al actualizar colección: ${error.message}` }
    }

    revalidatePath('/academy')
    revalidatePath('/academy/[slug]', 'page')
    revalidatePath('/academy/[slug]/[collectionSlug]', 'page')

    return { success: true }
  } catch (err: any) {
    console.error('[updateCollectionAction] Excepción:', err)
    return { success: false, error: err?.message || 'Error inesperado al actualizar la colección.' }
  }
}

/**
 * Elimina una colección. Por la regla ON DELETE SET NULL, los recursos que estaban
 * dentro de la colección no se pierden, sino que quedan sueltos en la categoría.
 */
export async function deleteCollectionAction(id: string): Promise<CollectionActionResult> {
  try {
    const auth = await checkAdmin()
    if (!auth.ok) return { success: false, error: auth.error }

    if (!id) return { success: false, error: 'ID requerido.' }

    const { error } = await auth.admin
      .from('resource_collections')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[deleteCollectionAction] Error DB:', error)
      return { success: false, error: `Error eliminando colección: ${error.message}` }
    }

    revalidatePath('/academy')
    revalidatePath('/academy/[slug]', 'page')
    revalidatePath('/academy/[slug]/[collectionSlug]', 'page')

    return { success: true }
  } catch (err: any) {
    console.error('[deleteCollectionAction] Excepción:', err)
    return { success: false, error: err?.message || 'Error inesperado al eliminar la colección.' }
  }
}
