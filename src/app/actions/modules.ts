'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { checkAdmin } from '@/server/auth/guards'

const uuid = z.string().uuid()
const moduleTitle = z.string().trim().min(2, 'El título es demasiado corto').max(120)
const moduleDescription = z.string().trim().max(2000)

export async function createModuleAction(courseId: string, title: string, description: string, sortOrder: number) {
  const ids = z
    .object({ courseId: uuid, title: moduleTitle, description: moduleDescription, sortOrder: z.number().int().min(0) })
    .safeParse({ courseId, title, description, sortOrder })
  if (!ids.success) return { success: false as const, error: 'Datos del módulo no válidos.' }

  const auth = await checkAdmin()
  if (!auth.ok) return { success: false as const, error: auth.error }

  const { data, error } = await auth.admin
    .from('modules')
    .insert({
      course_id: ids.data.courseId,
      title: ids.data.title,
      description: ids.data.description,
      is_published: false,
      sort_order: ids.data.sortOrder,
    })
    .select()
    .single()

  if (error) {
    console.error('[createModuleAction] Error:', error)
    return { success: false as const, error: 'No se ha podido crear el módulo.' }
  }

  revalidatePath(`/admin/courses/${ids.data.courseId}`)
  revalidatePath(`/courses`)
  return { success: true as const, module: data }
}

export async function updateModuleVisibilityAction(courseId: string, moduleId: string, isPublished: boolean) {
  const ids = z
    .object({ courseId: uuid, moduleId: uuid, isPublished: z.boolean() })
    .safeParse({ courseId, moduleId, isPublished })
  if (!ids.success) return { success: false as const, error: 'Identificadores no válidos.' }

  const auth = await checkAdmin()
  if (!auth.ok) return { success: false as const, error: auth.error }

  const { error } = await auth.admin
    .from('modules')
    .update({ is_published: ids.data.isPublished })
    // Limitamos la actualización al curso para no tocar módulos ajenos por accidente.
    .eq('id', ids.data.moduleId)
    .eq('course_id', ids.data.courseId)

  if (error) {
    console.error('[updateModuleVisibilityAction] Error:', error)
    return { success: false as const, error: 'No se ha podido actualizar la visibilidad.' }
  }

  revalidatePath(`/admin/courses/${ids.data.courseId}`)
  return { success: true as const }
}

/**
 * Reordena módulos. El cliente solo envía el identificador y el nuevo orden:
 * el resto de la fila (course_id, título, descripción, visibilidad) NO se
 * toca. Es el patrón seguro frente a aceptar la fila completa desde el cliente.
 */
export async function updateModulesOrderAction(courseId: string, updates: { id: string; sort_order: number }[]) {
  const payload = z
    .object({
      courseId: uuid,
      updates: z.array(z.object({ id: uuid, sort_order: z.number().int().min(0) })).min(1).max(500),
    })
    .safeParse({ courseId, updates })
  if (!payload.success) return { success: false as const, error: 'Orden de módulos no válido.' }

  const auth = await checkAdmin()
  if (!auth.ok) return { success: false as const, error: auth.error }

  // Actualizamos una a una y solo dentro del curso indicado.
  const results = await Promise.all(
    payload.data.updates.map(({ id, sort_order }) =>
      auth.admin
        .from('modules')
        .update({ sort_order })
        .eq('id', id)
        .eq('course_id', payload.data.courseId)
    )
  )

  const failed = results.find(r => r.error)
  if (failed?.error) {
    console.error('[updateModulesOrderAction] Error:', failed.error)
    return { success: false as const, error: 'No se ha podido guardar el orden de los módulos.' }
  }

  revalidatePath(`/admin/courses/${payload.data.courseId}`)
  return { success: true as const }
}
