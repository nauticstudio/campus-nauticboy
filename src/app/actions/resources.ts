'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { checkAdmin } from '@/server/auth/guards'

const resourceIdSchema = z.string().uuid('Recurso no válido.')

function slugify(text: string) {
  const base = text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-')
  return base.length > 0 ? base : 'recurso'
}

function extractDriveId(input: string): string {
  const trimmed = input.trim()
  const match1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (match1?.[1]) return match1[1]
  const match2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (match2?.[1]) return match2[1]
  return trimmed
}

export type ResourceActionResult =
  | { success: true; id?: string }
  | { success: false; error: string }

/**
 * Crea un nuevo recurso dentro de una categoría de La Academia (DAWs, Templates, Presets, Samples, etc.).
 */
export async function createResourceAction(formData: FormData): Promise<ResourceActionResult> {
  try {
    const auth = await checkAdmin()
    if (!auth.ok) return { success: false, error: auth.error }

    const title = (formData.get('title') as string)?.trim()
    const categoryId = (formData.get('category_id') as string)?.trim()
    const downloadUrl = (formData.get('download_url') as string)?.trim()
    const fileName = (formData.get('file_name') as string)?.trim() || `${title || 'archivo'}.zip`
    const description = (formData.get('description') as string)?.trim() || null
    const software = (formData.get('software') as string)?.trim() || null
    const version = (formData.get('version') as string)?.trim() || '1.0'
    const fileSizeStr = (formData.get('file_size') as string)?.trim() || null
    const isRestricted = formData.get('is_restricted') === 'true' || formData.get('is_restricted') === 'on'
    const isPublished = formData.get('is_published') !== 'false'

    if (!title || title.length < 2) {
      return { success: false, error: 'El título debe tener al menos 2 caracteres.' }
    }
    if (!categoryId) {
      return { success: false, error: 'Debes asociar el recurso a una categoría válida.' }
    }
    if (!downloadUrl) {
      return { success: false, error: 'El enlace de Google Drive o descarga es obligatorio.' }
    }

    const storagePath = extractDriveId(downloadUrl)
    const extParts = fileName.split('.')
    const fileExtension = extParts.length > 1 ? extParts.pop()!.toLowerCase() : 'zip'

    // Parse fileSize if in MB/GB/bytes or number
    let fileSizeBytes: number | null = null
    if (fileSizeStr) {
      const num = parseFloat(fileSizeStr)
      if (!isNaN(num)) {
        if (fileSizeStr.toLowerCase().includes('gb')) fileSizeBytes = Math.round(num * 1024 * 1024 * 1024)
        else if (fileSizeStr.toLowerCase().includes('mb')) fileSizeBytes = Math.round(num * 1024 * 1024)
        else if (fileSizeStr.toLowerCase().includes('kb')) fileSizeBytes = Math.round(num * 1024)
        else fileSizeBytes = Math.round(num)
      }
    }

    const baseSlug = slugify(title)
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`

    const { data: inserted, error } = await auth.admin
      .from('resources')
      .insert({
        title,
        slug: uniqueSlug,
        description,
        category_id: categoryId,
        storage_provider: 'google_drive',
        storage_path: storagePath,
        file_name: fileName,
        file_extension: fileExtension,
        file_size: fileSizeBytes,
        software,
        version,
        is_restricted: isRestricted,
        is_published: isPublished,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[createResourceAction] DB Error:', error)
      return { success: false, error: `Error al guardar recurso: ${error.message}` }
    }

    revalidatePath('/academy')
    revalidatePath('/academy/[slug]', 'page')
    return { success: true, id: inserted.id }
  } catch (err: any) {
    console.error('[createResourceAction] Exception:', err)
    return { success: false, error: err?.message || 'Error inesperado al crear el recurso.' }
  }
}

/**
 * Actualiza un recurso existente.
 */
export async function updateResourceAction(formData: FormData): Promise<ResourceActionResult> {
  try {
    const auth = await checkAdmin()
    if (!auth.ok) return { success: false, error: auth.error }

    const id = (formData.get('id') as string)?.trim()
    const title = (formData.get('title') as string)?.trim()
    const downloadUrl = (formData.get('download_url') as string)?.trim()
    const fileName = (formData.get('file_name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim() || null
    const software = (formData.get('software') as string)?.trim() || null
    const version = (formData.get('version') as string)?.trim() || '1.0'
    const fileSizeStr = (formData.get('file_size') as string)?.trim() || null
    const isRestricted = formData.get('is_restricted') === 'true' || formData.get('is_restricted') === 'on'

    if (!id) return { success: false, error: 'ID de recurso no válido.' }
    if (!title || title.length < 2) return { success: false, error: 'El título debe tener al menos 2 caracteres.' }

    const updatePayload: Record<string, any> = {
      title,
      description,
      software,
      version,
      is_restricted: isRestricted,
      updated_at: new Date().toISOString(),
    }

    if (downloadUrl) {
      updatePayload.storage_path = extractDriveId(downloadUrl)
    }
    if (fileName) {
      updatePayload.file_name = fileName
      const extParts = fileName.split('.')
      if (extParts.length > 1) {
        updatePayload.file_extension = extParts.pop()!.toLowerCase()
      }
    }
    if (fileSizeStr) {
      const num = parseFloat(fileSizeStr)
      if (!isNaN(num)) {
        if (fileSizeStr.toLowerCase().includes('gb')) updatePayload.file_size = Math.round(num * 1024 * 1024 * 1024)
        else if (fileSizeStr.toLowerCase().includes('mb')) updatePayload.file_size = Math.round(num * 1024 * 1024)
        else if (fileSizeStr.toLowerCase().includes('kb')) updatePayload.file_size = Math.round(num * 1024)
        else updatePayload.file_size = Math.round(num)
      }
    }

    const { error } = await auth.admin
      .from('resources')
      .update(updatePayload)
      .eq('id', id)

    if (error) {
      console.error('[updateResourceAction] DB Error:', error)
      return { success: false, error: `Error al actualizar recurso: ${error.message}` }
    }

    revalidatePath('/academy')
    revalidatePath('/academy/[slug]', 'page')
    return { success: true }
  } catch (err: any) {
    console.error('[updateResourceAction] Exception:', err)
    return { success: false, error: err?.message || 'Error inesperado al actualizar el recurso.' }
  }
}

/**
 * Elimina un recurso por ID.
 */
export async function deleteResourceAction(resourceId: string): Promise<ResourceActionResult> {
  try {
    const auth = await checkAdmin()
    if (!auth.ok) return { success: false, error: auth.error }

    const { error } = await auth.admin
      .from('resources')
      .delete()
      .eq('id', resourceId)

    if (error) {
      console.error('[deleteResourceAction] DB Error:', error)
      return { success: false, error: 'No se pudo eliminar el recurso.' }
    }

    revalidatePath('/academy')
    revalidatePath('/academy/[slug]', 'page')
    return { success: true }
  } catch (err: any) {
    console.error('[deleteResourceAction] Exception:', err)
    return { success: false, error: 'Error inesperado al eliminar el recurso.' }
  }
}

/**
 * Alterna la visibilidad pública de un recurso. Solo administradores.
 */
export async function setResourcePublishedAction(resourceId: string, isPublished: boolean) {
  const parsed = z
    .object({ resourceId: resourceIdSchema, isPublished: z.boolean() })
    .safeParse({ resourceId, isPublished })

  if (!parsed.success) {
    return { success: false as const, error: 'Datos del recurso no válidos.' }
  }

  const auth = await checkAdmin()
  if (!auth.ok) {
    return { success: false as const, error: auth.error }
  }

  const { error } = await auth.admin
    .from('resources')
    .update({ is_published: parsed.data.isPublished })
    .eq('id', parsed.data.resourceId)

  if (error) {
    console.error('[setResourcePublishedAction] Error:', error)
    return { success: false as const, error: 'No se ha podido actualizar la visibilidad del recurso.' }
  }

  revalidatePath('/academy')
  revalidatePath('/academy/[slug]', 'page')

  return { success: true as const }
}

