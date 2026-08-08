'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { checkAdmin } from '@/server/auth/guards'

const resourceIdSchema = z.string().uuid('Recurso no válido.')

/**
 * Alterna la visibilidad pública de un recurso. Solo administradores.
 * El cliente (CategoryResourcesClient) nunca toca `resources` directamente.
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
