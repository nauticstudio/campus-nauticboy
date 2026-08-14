'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { checkAdmin } from '@/server/auth/guards'

const fileSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, 'El nombre del archivo es obligatorio.'),
  url: z.string().trim().min(1, 'El enlace de descarga o Google Drive es obligatorio.'),
  file_type: z.string().trim().optional(),
  file_size: z.string().trim().optional(),
  note: z.string().trim().optional(),
})

const classMaterialSchema = z.object({
  student_id: z.string().uuid('Debes seleccionar un alumno válido.'),
  title: z.string().trim().min(2, 'El título debe tener al menos 2 caracteres.'),
  description: z.string().trim().optional().nullable(),
  session_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (AAAA-MM-DD).'),
  files: z.array(fileSchema).min(1, 'Debes incluir al menos un archivo o enlace de descarga.'),
  is_published: z.boolean().default(true),
})

export type CreateClassMaterialInput = z.infer<typeof classMaterialSchema>

export async function createClassMaterialAction(input: CreateClassMaterialInput) {
  const auth = await checkAdmin()
  if (!auth.ok) {
    return { success: false as const, error: auth.error }
  }

  const parsed = classMaterialSchema.safeParse(input)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || 'Datos del material no válidos.'
    return { success: false as const, error: firstError }
  }

  const { student_id, title, description, session_date, files, is_published } = parsed.data

  const { data, error } = await auth.admin
    .from('class_materials')
    .insert({
      student_id,
      title,
      description: description || null,
      session_date,
      files,
      is_published,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[createClassMaterialAction] Error Supabase:', error)
    return { success: false as const, error: 'No se pudo guardar el material de clase.' }
  }

  revalidatePath('/my-materials')
  revalidatePath('/admin/materials')
  revalidatePath('/dashboard')
  revalidatePath('/', 'layout')

  return { success: true as const, id: data?.id }
}

export async function updateClassMaterialAction(id: string, input: CreateClassMaterialInput) {
  const auth = await checkAdmin()
  if (!auth.ok) {
    return { success: false as const, error: auth.error }
  }

  if (!id || typeof id !== 'string') {
    return { success: false as const, error: 'ID de material no válido.' }
  }

  const parsed = classMaterialSchema.safeParse(input)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || 'Datos del material no válidos.'
    return { success: false as const, error: firstError }
  }

  const { student_id, title, description, session_date, files, is_published } = parsed.data

  const { error } = await auth.admin
    .from('class_materials')
    .update({
      student_id,
      title,
      description: description || null,
      session_date,
      files,
      is_published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('[updateClassMaterialAction] Error Supabase:', error)
    return { success: false as const, error: 'No se pudo actualizar el material de clase.' }
  }

  revalidatePath('/my-materials')
  revalidatePath('/admin/materials')
  revalidatePath('/dashboard')
  revalidatePath('/', 'layout')

  return { success: true as const }
}

export async function deleteClassMaterialAction(id: string) {
  const auth = await checkAdmin()
  if (!auth.ok) {
    return { success: false as const, error: auth.error }
  }

  if (!id || typeof id !== 'string') {
    return { success: false as const, error: 'ID no válido.' }
  }

  const { error } = await auth.admin
    .from('class_materials')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[deleteClassMaterialAction] Error Supabase:', error)
    return { success: false as const, error: 'No se pudo eliminar el material.' }
  }

  revalidatePath('/my-materials')
  revalidatePath('/admin/materials')
  revalidatePath('/dashboard')
  revalidatePath('/', 'layout')

  return { success: true as const }
}

export async function togglePublishClassMaterialAction(id: string, is_published: boolean) {
  const auth = await checkAdmin()
  if (!auth.ok) {
    return { success: false as const, error: auth.error }
  }

  const { error } = await auth.admin
    .from('class_materials')
    .update({
      is_published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('[togglePublishClassMaterialAction] Error:', error)
    return { success: false as const, error: 'No se pudo modificar la visibilidad.' }
  }

  revalidatePath('/my-materials')
  revalidatePath('/admin/materials')
  revalidatePath('/dashboard')
  revalidatePath('/', 'layout')

  return { success: true as const }
}
