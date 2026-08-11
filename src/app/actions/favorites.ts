'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { checkUser } from '@/server/auth/guards'

const targetSchema = z.string().uuid('Recurso no válido.')

/**
 * Alterna un favorito del usuario actual. Solo aplica a `resources`
 * (la tabla `favorites` referencia `resources(id)`). La RLS garantiza que
 * cada usuario solo toca sus propias filas; aquí solo comprobamos sesión.
 */
export async function toggleFavoriteAction(resourceId: string) {
  const parsed = targetSchema.safeParse(resourceId)
  if (!parsed.success) {
    return { success: false as const, error: 'Recurso no válido.' }
  }

  const auth = await checkUser()
  if (!auth.ok) {
    return { success: false as const, error: auth.error }
  }

  const { supabase, user } = auth
  const id = parsed.data

  const { data: existing } = await supabase
    .from('favorites')
    .select('resource_id')
    .eq('user_id', user.id)
    .eq('resource_id', id)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('resource_id', id)
    if (error) {
      console.error('[toggleFavoriteAction] delete:', error)
      return { success: false as const, error: 'No se pudo quitar el favorito.' }
    }
  } else {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, resource_id: id })
    if (error) {
      console.error('[toggleFavoriteAction] insert:', error)
      return { success: false as const, error: 'No se pudo guardar el favorito.' }
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/favorites')
  return { success: true as const, favorited: !existing }
}
