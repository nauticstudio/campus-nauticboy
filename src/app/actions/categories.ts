'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones')
    .min(2)
    .max(80),
  icon: z.string().max(50).optional().nullable(),
  icon_url: z.string().url().max(400).optional().or(z.literal('')).nullable(),
  cover_image_url: z.string().url().max(600).optional().or(z.literal('')).nullable(),
  accent_color: z
    .enum(['coral', 'violet', 'cyan', 'emerald', 'rose'])
    .default('coral'),
  blurb: z.string().max(240).optional().nullable(),
  is_published: z.boolean().default(true),
})

export type CategoryUpsertResult =
  | { success: true }
  | { error: string }

/** Crea o actualiza una categoría. Si `id` viene la fila ya existe. */
export async function upsertCategoryAction(
  formData: FormData
): Promise<CategoryUpsertResult> {
  const supabase = await createClient()

  const raw = {
    id: (formData.get('id') as string) || undefined,
    name: formData.get('name'),
    slug: formData.get('slug'),
    icon: formData.get('icon'),
    icon_url: formData.get('icon_url'),
    cover_image_url: formData.get('cover_image_url'),
    accent_color: formData.get('accent_color') || 'coral',
    blurb: formData.get('blurb'),
    is_published: formData.get('is_published') === 'true' || formData.get('is_published') === 'on',
  }

  const parsed = upsertSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues.map(i => i.message).join(', ') }
  }

  const record = parsed.data

  // Duplicados de slug
  const slugCheck = await supabase
    .from('categories')
    .select('id')
    .eq('slug', record.slug)
    .limit(1)

  if (slugCheck.error) return { error: slugCheck.error.message }
  const existing = slugCheck.data?.[0]
  if (existing && existing.id !== record.id) {
    return { error: 'Ya existe otra categoría con ese slug.' }
  }

  const payload = {
    name: record.name,
    slug: record.slug,
    icon: record.icon || null,
    icon_url: record.icon_url || null,
    cover_image_url: record.cover_image_url || null,
    accent_color: record.accent_color,
    blurb: record.blurb || null,
    is_published: record.is_published,
  }

  let result
  if (record.id) {
    result = await supabase
      .from('categories')
      .update(payload)
      .eq('id', record.id)
  } else {
    result = await supabase.from('categories').insert(payload)
  }

  if (result.error) return { error: result.error.message }

  revalidatePath('/academy')
  revalidatePath('/admin/categories')
  revalidatePath(`/academy/${record.slug}`)
  return { success: true }
}

/** Borra una categoría por id. Los recursos ligados quedan huérfanos (SET NULL). */
export async function deleteCategoryAction(id: string): Promise<CategoryUpsertResult> {
  if (!id) return { error: 'id requerido' }
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/academy')
  revalidatePath('/admin/categories')
  return { success: true }
}
