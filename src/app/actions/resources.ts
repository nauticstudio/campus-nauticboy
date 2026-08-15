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

function parseFileSizeToBytes(fileSizeStr: string | null | undefined): number | null {
  if (!fileSizeStr) return null
  const cleaned = fileSizeStr.replace(/,/g, '.').trim()
  const num = parseFloat(cleaned)
  if (isNaN(num)) return null
  if (cleaned.toLowerCase().includes('gb')) return Math.round(num * 1024 * 1024 * 1024)
  if (cleaned.toLowerCase().includes('mb')) return Math.round(num * 1024 * 1024)
  if (cleaned.toLowerCase().includes('kb')) return Math.round(num * 1024)
  if (num > 500) return Math.round(num)
  return Math.round(num * 1024 * 1024 * 1024)
}

/**
 * Crea un recurso unificado que puede incluir instalador para macOS, Windows o ambos.
 */
export async function createUnifiedResourceAction(formData: FormData): Promise<ResourceActionResult> {
  try {
    const auth = await checkAdmin()
    if (!auth.ok) return { success: false, error: auth.error }

    const title = (formData.get('title') as string)?.trim()
    const categoryId = (formData.get('category_id') as string)?.trim()
    const thumbnailUrl = (formData.get('thumbnail_url') as string)?.trim() || null
    const description = (formData.get('description') as string)?.trim() || null
    const software = (formData.get('software') as string)?.trim() || null
    const isRestricted = formData.get('is_restricted') === 'true' || formData.get('is_restricted') === 'on'
    const isPublished = formData.get('is_published') !== 'false'

    // Datos macOS
    const macDownloadUrl = (formData.get('mac_download_url') as string)?.trim()
    const macVersion = (formData.get('mac_version') as string)?.trim() || '1.0'
    const macFileName = (formData.get('mac_file_name') as string)?.trim() || `${title || 'archivo'}_macOS.dmg`
    const macFileSize = (formData.get('mac_file_size') as string)?.trim()

    // Datos Windows
    const winDownloadUrl = (formData.get('win_download_url') as string)?.trim()
    const winVersion = (formData.get('win_version') as string)?.trim() || '1.0'
    const winFileName = (formData.get('win_file_name') as string)?.trim() || `${title || 'archivo'}_WIN.zip`
    const winFileSize = (formData.get('win_file_size') as string)?.trim()

    if (!title || title.length < 2) {
      return { success: false, error: 'El título debe tener al menos 2 caracteres.' }
    }
    if (!categoryId) {
      return { success: false, error: 'Debes asociar el recurso a una categoría válida.' }
    }
    if (!macDownloadUrl && !winDownloadUrl) {
      return { success: false, error: 'Debes ingresar el enlace de descarga para al menos una plataforma (macOS o Windows).' }
    }

    const baseSlug = slugify(title)

    // Crear versión macOS si está presente
    if (macDownloadUrl) {
      const extParts = macFileName.split('.')
      const fileExtension = extParts.length > 1 ? extParts.pop()!.toLowerCase() : 'dmg'
      const uniqueSlug = `${baseSlug}-mac-${Date.now().toString().slice(-4)}`

      const { error: macErr } = await auth.admin.from('resources').insert({
        title,
        slug: uniqueSlug,
        description,
        thumbnail_url: thumbnailUrl,
        category_id: categoryId,
        storage_provider: 'google_drive',
        storage_path: extractDriveId(macDownloadUrl),
        file_name: macFileName,
        file_extension: fileExtension,
        file_size: parseFileSizeToBytes(macFileSize),
        software,
        version: macVersion,
        tags: ['macos'],
        is_restricted: isRestricted,
        is_published: isPublished,
      })
      if (macErr) {
        console.error('[createUnifiedResourceAction] DB Error macOS:', macErr)
        return { success: false, error: `Error guardando versión macOS: ${macErr.message}` }
      }
    }

    // Crear versión Windows si está presente
    if (winDownloadUrl) {
      const extParts = winFileName.split('.')
      const fileExtension = extParts.length > 1 ? extParts.pop()!.toLowerCase() : 'zip'
      const uniqueSlug = `${baseSlug}-win-${Date.now().toString().slice(-4)}`

      const { error: winErr } = await auth.admin.from('resources').insert({
        title,
        slug: uniqueSlug,
        description,
        thumbnail_url: thumbnailUrl,
        category_id: categoryId,
        storage_provider: 'google_drive',
        storage_path: extractDriveId(winDownloadUrl),
        file_name: winFileName,
        file_extension: fileExtension,
        file_size: parseFileSizeToBytes(winFileSize),
        software,
        version: winVersion,
        tags: ['windows'],
        is_restricted: isRestricted,
        is_published: isPublished,
      })
      if (winErr) {
        console.error('[createUnifiedResourceAction] DB Error Windows:', winErr)
        return { success: false, error: `Error guardando versión Windows: ${winErr.message}` }
      }
    }

    revalidatePath('/academy')
    revalidatePath('/academy/[slug]', 'page')
    return { success: true }
  } catch (err: any) {
    console.error('[createUnifiedResourceAction] Exception:', err)
    return { success: false, error: err?.message || 'Error inesperado al crear el recurso.' }
  }
}

/**
 * Actualiza o inserta las versiones de macOS y Windows de un recurso unificado.
 */
export async function updateUnifiedResourceAction(formData: FormData): Promise<ResourceActionResult> {
  try {
    const auth = await checkAdmin()
    if (!auth.ok) return { success: false, error: auth.error }

    const title = (formData.get('title') as string)?.trim()
    const categoryId = (formData.get('category_id') as string)?.trim()
    const thumbnailUrl = (formData.get('thumbnail_url') as string)?.trim() || null
    const description = (formData.get('description') as string)?.trim() || null
    const software = (formData.get('software') as string)?.trim() || null
    const isRestricted = formData.get('is_restricted') === 'true' || formData.get('is_restricted') === 'on'

    const macId = (formData.get('mac_id') as string)?.trim()
    const macDownloadUrl = (formData.get('mac_download_url') as string)?.trim()
    const macVersion = (formData.get('mac_version') as string)?.trim() || '1.0'
    const macFileName = (formData.get('mac_file_name') as string)?.trim()
    const macFileSize = (formData.get('mac_file_size') as string)?.trim()
    const macDelete = formData.get('mac_delete') === 'true'

    const winId = (formData.get('win_id') as string)?.trim()
    const winDownloadUrl = (formData.get('win_download_url') as string)?.trim()
    const winVersion = (formData.get('win_version') as string)?.trim() || '1.0'
    const winFileName = (formData.get('win_file_name') as string)?.trim()
    const winFileSize = (formData.get('win_file_size') as string)?.trim()
    const winDelete = formData.get('win_delete') === 'true'

    if (!title || title.length < 2) {
      return { success: false, error: 'El título debe tener al menos 2 caracteres.' }
    }

    const baseSlug = slugify(title)

    // 1. Manejo macOS
    if (macDelete && macId) {
      await auth.admin.from('resources').delete().eq('id', macId)
    } else if (macId) {
      // Actualizar registro macOS existente
      const updatePayload: Record<string, any> = {
        title,
        description,
        thumbnail_url: thumbnailUrl,
        software,
        version: macVersion,
        is_restricted: isRestricted,
        tags: ['macos'],
        updated_at: new Date().toISOString(),
      }
      if (macDownloadUrl) updatePayload.storage_path = extractDriveId(macDownloadUrl)
      if (macFileName) {
        updatePayload.file_name = macFileName
        const extParts = macFileName.split('.')
        if (extParts.length > 1) updatePayload.file_extension = extParts.pop()!.toLowerCase()
      }
      if (macFileSize) updatePayload.file_size = parseFileSizeToBytes(macFileSize)

      await auth.admin.from('resources').update(updatePayload).eq('id', macId)
    } else if (macDownloadUrl && categoryId) {
      // Insertar nuevo registro macOS para este recurso
      const extParts = (macFileName || `${title}_macOS.dmg`).split('.')
      const fileExtension = extParts.length > 1 ? extParts.pop()!.toLowerCase() : 'dmg'
      const uniqueSlug = `${baseSlug}-mac-${Date.now().toString().slice(-4)}`

      await auth.admin.from('resources').insert({
        title,
        slug: uniqueSlug,
        description,
        thumbnail_url: thumbnailUrl,
        category_id: categoryId,
        storage_provider: 'google_drive',
        storage_path: extractDriveId(macDownloadUrl),
        file_name: macFileName || `${title}_macOS.dmg`,
        file_extension: fileExtension,
        file_size: parseFileSizeToBytes(macFileSize),
        software,
        version: macVersion,
        tags: ['macos'],
        is_restricted: isRestricted,
        is_published: true,
      })
    }

    // 2. Manejo Windows
    if (winDelete && winId) {
      await auth.admin.from('resources').delete().eq('id', winId)
    } else if (winId) {
      // Actualizar registro Windows existente
      const updatePayload: Record<string, any> = {
        title,
        description,
        thumbnail_url: thumbnailUrl,
        software,
        version: winVersion,
        is_restricted: isRestricted,
        tags: ['windows'],
        updated_at: new Date().toISOString(),
      }
      if (winDownloadUrl) updatePayload.storage_path = extractDriveId(winDownloadUrl)
      if (winFileName) {
        updatePayload.file_name = winFileName
        const extParts = winFileName.split('.')
        if (extParts.length > 1) updatePayload.file_extension = extParts.pop()!.toLowerCase()
      }
      if (winFileSize) updatePayload.file_size = parseFileSizeToBytes(winFileSize)

      await auth.admin.from('resources').update(updatePayload).eq('id', winId)
    } else if (winDownloadUrl && categoryId) {
      // Insertar nuevo registro Windows para este recurso
      const extParts = (winFileName || `${title}_WIN.zip`).split('.')
      const fileExtension = extParts.length > 1 ? extParts.pop()!.toLowerCase() : 'zip'
      const uniqueSlug = `${baseSlug}-win-${Date.now().toString().slice(-4)}`

      await auth.admin.from('resources').insert({
        title,
        slug: uniqueSlug,
        description,
        thumbnail_url: thumbnailUrl,
        category_id: categoryId,
        storage_provider: 'google_drive',
        storage_path: extractDriveId(winDownloadUrl),
        file_name: winFileName || `${title}_WIN.zip`,
        file_extension: fileExtension,
        file_size: parseFileSizeToBytes(winFileSize),
        software,
        version: winVersion,
        tags: ['windows'],
        is_restricted: isRestricted,
        is_published: true,
      })
    }

    revalidatePath('/academy')
    revalidatePath('/academy/[slug]', 'page')
    return { success: true }
  } catch (err: any) {
    console.error('[updateUnifiedResourceAction] Exception:', err)
    return { success: false, error: err?.message || 'Error al actualizar recurso unificado.' }
  }
}

/**
 * Elimina uno o más recursos asociados a una tarjeta unificada.
 */
export async function deleteUnifiedResourceAction(ids: string[]): Promise<ResourceActionResult> {
  try {
    const auth = await checkAdmin()
    if (!auth.ok) return { success: false, error: auth.error }

    const validIds = ids.filter(id => Boolean(id?.trim()))
    if (validIds.length === 0) return { success: false, error: 'No se especificaron recursos para eliminar.' }

    const { error } = await auth.admin.from('resources').delete().in('id', validIds)
    if (error) {
      console.error('[deleteUnifiedResourceAction] DB Error:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/academy')
    revalidatePath('/academy/[slug]', 'page')
    return { success: true }
  } catch (err: any) {
    console.error('[deleteUnifiedResourceAction] Exception:', err)
    return { success: false, error: err?.message || 'Error al eliminar recursos.' }
  }
}

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
    const thumbnailUrl = (formData.get('thumbnail_url') as string)?.trim() || null
    const fileName = (formData.get('file_name') as string)?.trim() || `${title || 'archivo'}.zip`
    const description = (formData.get('description') as string)?.trim() || null
    const software = (formData.get('software') as string)?.trim() || null
    const version = (formData.get('version') as string)?.trim() || '1.0'
    const platform = (formData.get('platform') as string)?.trim() || 'all'
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

    const fileSizeBytes = parseFileSizeToBytes(fileSizeStr)

    let tags: string[] = []
    if (platform === 'macos') tags = ['macos']
    else if (platform === 'windows') tags = ['windows']
    else tags = ['macos', 'windows']

    const baseSlug = slugify(title)
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`

    const { data: inserted, error } = await auth.admin
      .from('resources')
      .insert({
        title,
        slug: uniqueSlug,
        description,
        thumbnail_url: thumbnailUrl,
        category_id: categoryId,
        storage_provider: 'google_drive',
        storage_path: storagePath,
        file_name: fileName,
        file_extension: fileExtension,
        file_size: fileSizeBytes,
        software,
        version,
        tags,
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
    const thumbnailUrl = (formData.get('thumbnail_url') as string)?.trim() || null
    const fileName = (formData.get('file_name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim() || null
    const software = (formData.get('software') as string)?.trim() || null
    const version = (formData.get('version') as string)?.trim() || '1.0'
    const platform = (formData.get('platform') as string)?.trim() || 'all'
    const fileSizeStr = (formData.get('file_size') as string)?.trim() || null
    const isRestricted = formData.get('is_restricted') === 'true' || formData.get('is_restricted') === 'on'

    if (!id) return { success: false, error: 'ID de recurso no válido.' }
    if (!title || title.length < 2) return { success: false, error: 'El título debe tener al menos 2 caracteres.' }

    let tags: string[] = []
    if (platform === 'macos') tags = ['macos']
    else if (platform === 'windows') tags = ['windows']
    else tags = ['macos', 'windows']

    const updatePayload: Record<string, any> = {
      title,
      description,
      thumbnail_url: thumbnailUrl,
      software,
      version,
      tags,
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
      updatePayload.file_size = parseFileSizeToBytes(fileSizeStr)
    }

    const { error } = await auth.admin
      .from('resources')
      .update(updatePayload)
      .eq('id', id)

    if (error) {
      console.error('[updateResourceAction] DB Error:', error)
      return { success: false, error: `Error al actualizar: ${error.message}` }
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
export async function deleteResourceAction(id: string): Promise<ResourceActionResult> {
  try {
    const auth = await checkAdmin()
    if (!auth.ok) return { success: false, error: auth.error }

    const { error } = await auth.admin
      .from('resources')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[deleteResourceAction] DB Error:', error)
      return { success: false, error: `Error al eliminar: ${error.message}` }
    }

    revalidatePath('/academy')
    revalidatePath('/academy/[slug]', 'page')
    return { success: true }
  } catch (err: any) {
    console.error('[deleteResourceAction] Exception:', err)
    return { success: false, error: err?.message || 'Error al eliminar el recurso.' }
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

