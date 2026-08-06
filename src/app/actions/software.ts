'use server'

import { createAdminClient, createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper to check admin
async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const adminSupabase = await createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('No tienes permisos de administrador')

  return adminSupabase
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

// 1. Create Manufacturer
export async function createManufacturerAction(formData: FormData) {
  try {
    const adminSupabase = await verifyAdmin()
    const name = formData.get('name') as string
    const logo_url = formData.get('logo_url') as string
    const description = formData.get('description') as string

    if (!name) throw new Error('El nombre del fabricante es obligatorio')

    const slug = slugify(name)

    const { error } = await adminSupabase
      .from('software_manufacturers')
      .insert({ name, slug, logo_url, description })

    if (error) throw error

    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// 2. Create Software Product
export async function createSoftwareProductAction(formData: FormData) {
  try {
    const adminSupabase = await verifyAdmin()
    const manufacturer_id = formData.get('manufacturer_id') as string
    const name = formData.get('name') as string
    const tagline = formData.get('tagline') as string
    const description = formData.get('description') as string
    const cover_image_url = formData.get('cover_image_url') as string
    const version = formData.get('version') as string || '1.0'
    const compatibility = formData.get('compatibility') as string || 'Windows 10/11 & macOS 12+'
    const formats = (formData.get('formats') as string || 'VST3, AU, AAX').split(',').map(s => s.trim())
    const is_featured = formData.get('is_featured') === 'true'

    if (!manufacturer_id || !name) throw new Error('Fabricante y Nombre son requeridos')

    const slug = slugify(name)

    const { error } = await adminSupabase
      .from('software_products')
      .insert({
        manufacturer_id,
        name,
        slug,
        tagline,
        description,
        cover_image_url,
        version,
        compatibility,
        formats,
        is_featured,
        is_published: true
      })

    if (error) throw error

    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// 3. Create Software Item (Installer, Expansion, Factory, etc.)
export async function createSoftwareItemAction(formData: FormData) {
  try {
    const adminSupabase = await verifyAdmin()
    const product_id = formData.get('product_id') as string
    const title = formData.get('title') as string
    const item_type = formData.get('item_type') as any || 'expansion'
    const description = formData.get('description') as string
    const cover_image_url = formData.get('cover_image_url') as string
    const file_size = formData.get('file_size') as string
    const version = formData.get('version') as string
    const download_url = formData.get('download_url') as string
    const preset_count = parseInt(formData.get('preset_count') as string || '0', 10)
    const genre_tag = formData.get('genre_tag') as string

    if (!product_id || !title || !download_url) {
      throw new Error('Producto, Título y Link de Google Drive son obligatorios')
    }

    const { error } = await adminSupabase
      .from('software_items')
      .insert({
        product_id,
        title,
        item_type,
        description,
        cover_image_url,
        file_size,
        version,
        download_url,
        preset_count,
        genre_tag,
        is_published: true
      })

    if (error) throw error

    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Delete functions
export async function deleteSoftwareProductAction(productId: string) {
  try {
    const adminSupabase = await verifyAdmin()
    const { error } = await adminSupabase.from('software_products').delete().eq('id', productId)
    if (error) throw error
    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteSoftwareItemAction(itemId: string) {
  try {
    const adminSupabase = await verifyAdmin()
    const { error } = await adminSupabase.from('software_items').delete().eq('id', itemId)
    if (error) throw error
    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
