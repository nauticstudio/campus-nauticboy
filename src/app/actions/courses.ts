'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAdmin, authErrorToResponse } from '@/server/auth/guards'

const createCourseSchema = z.object({
  title: z.string().trim().min(3, 'El título necesita al menos 3 caracteres').max(120),
  description: z.string().trim().max(2000).optional().default(''),
  software: z.string().trim().max(120).optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug solo puede contener minúsculas, números y guiones'),
})

export async function createCourseAction(data: {
  title: string
  description: string
  software?: string
  slug: string
}) {
  try {
    // La identidad NUNCA viene del cliente: la verificamos en servidor.
    const { admin } = await requireAdmin()

    const parsed = createCourseSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false as const, error: parsed.error.issues[0]?.message ?? 'Datos de curso no válidos' }
    }

    const { data: newCourse, error } = await admin
      .from('courses')
      .insert({
        title: parsed.data.title,
        description: parsed.data.description || null,
        software: parsed.data.software || null,
        slug: parsed.data.slug,
        is_published: false, // Los cursos nacen como borradores.
      })
      .select()
      .single()

    if (error) {
      console.error('[createCourseAction] Error de base de datos:', error)
      return { success: false as const, error: 'No se ha podido crear el curso.' }
    }

    revalidatePath('/admin/courses')
    revalidatePath('/courses')

    return { success: true as const, course: newCourse }
  } catch (error: unknown) {
    const authError = authErrorToResponse(error)
    if (authError) return authError

    console.error('[createCourseAction] Excepción:', error)
    return { success: false as const, error: 'Ha ocurrido un error inesperado al crear el curso.' }
  }
}
