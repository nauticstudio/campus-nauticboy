'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/server/auth/guards'
import type { SoftwareItem } from '@/lib/data/software'

async function verifyAdmin() {
  const { admin } = await requireAdmin()
  return admin
}

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-')
}

function gStr(formData: FormData, key: string): string | null {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : null
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function toUUID(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const v = value.trim()
  return UUID_RE.test(v) ? v : null
}

// Tipo uniforme de retorno: el cliente siempre ve `success` y opcionalmente `error`/`redirectUrl`.
type ActionResult = {
  success: boolean
  error?: string
  redirectUrl?: string
}

// ---- Manufacturer -------------------------------------------------------
export async function createManufacturerAction(formData: FormData): Promise<ActionResult> {
  try {
    const adminSupabase = await verifyAdmin()
    const name = gStr(formData, 'name')
    if (!name || name.length < 2) {
      console.error('[software] createManufacturer: nombre inválido')
      return { success: false, error: 'El nombre del fabricante debe tener al menos 2 caracteres.' }
    }

    const { error } = await adminSupabase
      .from('software_manufacturers')
      .insert({
        name,
        slug: slugify(name),
        logo_url: gStr(formData, 'logo_url') || null,
        description: gStr(formData, 'description') || null,
      })

    if (error) throw error
    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true }
  } catch (error) {
    console.error('[software] createManufacturer:', error)
    return { success: false, error: 'Error al crear el fabricante.' }
  }
}

export async function updateManufacturerAction(formData: FormData): Promise<ActionResult> {
  try {
    const adminSupabase = await verifyAdmin()
    const id = toUUID(formData.get('id'))
    const name = gStr(formData, 'name')
    if (!id) {
      console.error('[software] updateManufacturer: id inválido')
      return { success: false, error: 'ID del fabricante inválido.' }
    }
    if (!name || name.length < 2) {
      console.error('[software] updateManufacturer: nombre inválido')
      return { success: false, error: 'El nombre debe tener al menos 2 caracteres.' }
    }

    const { error } = await adminSupabase
      .from('software_manufacturers')
      .update({
        name,
        slug: slugify(name),
        logo_url: gStr(formData, 'logo_url') || null,
        description: gStr(formData, 'description') || null,
      })
      .eq('id', id)

    if (error) throw error
    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true }
  } catch (error) {
    console.error('[software] updateManufacturer:', error)
    return { success: false, error: 'Error al actualizar el fabricante.' }
  }
}

export async function deleteManufacturerAction(manufacturerId: string): Promise<ActionResult> {
  try {
    const id = toUUID(manufacturerId)
    if (!id) {
      console.error('[software] deleteManufacturer: id inválido')
      return { success: false, error: 'ID del fabricante inválido.' }
    }
    const adminSupabase = await verifyAdmin()

    const { error } = await adminSupabase
      .from('software_manufacturers')
      .delete()
      .eq('id', id)
    if (error) throw error
    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true }
  } catch (error) {
    console.error('[software] deleteManufacturer:', error)
    return { success: false, error: 'Error al eliminar el fabricante.' }
  }
}

// ---- Product -------------------------------------------------------------
function readProductForm(formData: FormData) {
  const manufacturerId = gStr(formData, 'manufacturer_id')
  const name = gStr(formData, 'name')
  if (!manufacturerId || !name) return null

  return {
    id: gStr(formData, 'id'),
    manufacturerId,
    name,
    slug: slugify(name),
    tagline: gStr(formData, 'tagline') || null,
    description: gStr(formData, 'description') || null,
    coverImageUrl: gStr(formData, 'cover_image_url') || null,
    version: gStr(formData, 'version') || '1.0',
    compatibility: gStr(formData, 'compatibility') || 'Windows 10/11 & macOS 12+',
    formats: (gStr(formData, 'formats') || 'VST3, AU, AAX').split(',').map(s => s.trim()).filter(Boolean),
    isFeatured: gStr(formData, 'is_featured') === 'true',
  }
}

export async function createSoftwareProductAction(formData: FormData): Promise<ActionResult> {
  try {
    const adminSupabase = await verifyAdmin()
    const parsed = readProductForm(formData)
    if (!parsed) {
      console.error('[software] createProduct: campos requeridos')
      return { success: false, error: 'Fabricante y Nombre son obligatorios.' }
    }

    const manufacturerId = toUUID(parsed.manufacturerId)
    if (!manufacturerId) {
      console.error('[software] createProduct: manufacturer_id inválido')
      return { success: false, error: 'Fabricante inválido.' }
    }

    const { error } = await adminSupabase
      .from('software_products')
      .insert({
        manufacturer_id: manufacturerId,
        name: parsed.name,
        slug: parsed.slug,
        tagline: parsed.tagline,
        description: parsed.description,
        cover_image_url: parsed.coverImageUrl,
        version: parsed.version,
        compatibility: parsed.compatibility,
        formats: parsed.formats,
        is_featured: parsed.isFeatured,
        is_published: true,
      })

    if (error) throw error
    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true }
  } catch (error) {
    console.error('[software] createProduct:', error)
    return { success: false, error: 'Error al crear el producto.' }
  }
}

export async function updateSoftwareProductAction(formData: FormData): Promise<ActionResult> {
  try {
    const adminSupabase = await verifyAdmin()
    const parsed = readProductForm(formData)
    if (!parsed) {
      console.error('[software] updateProduct: campos requeridos')
      return { success: false, error: 'Fabricante y Nombre son obligatorios.' }
    }

    const id = toUUID(formData.get('id'))
    const manufacturerId = toUUID(parsed.manufacturerId)
    if (!id) {
      console.error('[software] updateProduct: id inválido')
      return { success: false, error: 'ID del producto inválido.' }
    }
    if (!manufacturerId) {
      console.error('[software] updateProduct: manufacturer_id inválido')
      return { success: false, error: 'Fabricante inválido.' }
    }

    const { error } = await adminSupabase
      .from('software_products')
      .update({
        manufacturer_id: manufacturerId,
        name: parsed.name,
        slug: parsed.slug,
        tagline: parsed.tagline,
        description: parsed.description,
        cover_image_url: parsed.coverImageUrl,
        version: parsed.version,
        compatibility: parsed.compatibility,
        formats: parsed.formats,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw error

    const { data: m } = await adminSupabase
      .from('software_manufacturers')
      .select('slug')
      .eq('id', manufacturerId)
      .single()

    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true, redirectUrl: `/software/${m?.slug}/${parsed.slug}` }
  } catch (error) {
    console.error('[software] updateProduct:', error)
    return { success: false, error: 'Error al actualizar el producto.' }
  }
}

export async function deleteSoftwareProductAction(productId: string): Promise<ActionResult> {
  try {
    const id = toUUID(productId)
    if (!id) {
      console.error('[software] deleteProduct: id inválido')
      return { success: false, error: 'ID del producto inválido.' }
    }
    const adminSupabase = await verifyAdmin()

    const { error } = await adminSupabase
      .from('software_products')
      .delete()
      .eq('id', id)
    if (error) throw error
    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true }
  } catch (error) {
    console.error('[software] deleteProduct:', error)
    return { success: false, error: 'Error al eliminar el producto.' }
  }
}

// ---- Item ----------------------------------------------------------------
const SOFTWARE_ITEM_TYPES = new Set<SoftwareItem['item_type']>([
  'installer_win',
  'installer_mac',
  'factory_content',
  'expansion',
  'skin',
  'presets',
  'update',
  'plugin_device',
])

function readItemForm(formData: FormData) {
  const product_id = gStr(formData, 'product_id')
  const title = gStr(formData, 'title')
  const download_url = gStr(formData, 'download_url')

  if (!product_id || !title || !download_url) return null
  if (!download_url.startsWith('https://')) return null

  const presetRaw = gStr(formData, 'preset_count') || '0'
  const preset = Number.parseInt(presetRaw, 10)

  const itemTypeRaw = gStr(formData, 'item_type')
  const item_type = SOFTWARE_ITEM_TYPES.has(itemTypeRaw as SoftwareItem['item_type'])
    ? (itemTypeRaw as SoftwareItem['item_type'])
    : 'expansion'

  return {
    id: gStr(formData, 'id'),
    product_id,
    title,
    item_type,
    description: gStr(formData, 'description') || null,
    cover_image_url: gStr(formData, 'cover_image_url') || null,
    file_size: gStr(formData, 'file_size') || null,
    version: gStr(formData, 'version') || null,
    download_url,
    preset_count: Number.isNaN(preset) ? 0 : preset,
    genre_tag: gStr(formData, 'genre_tag') || null,
  }
}

export async function createSoftwareItemAction(formData: FormData): Promise<ActionResult> {
  try {
    const adminSupabase = await verifyAdmin()
    const parsed = readItemForm(formData)
    if (!parsed) {
      console.error('[software] createItem: campos inválidos')
      return { success: false, error: 'Producto, Título y Link de Google Drive son obligatorios y válidos.' }
    }

    const productId = toUUID(parsed.product_id)
    if (!productId) {
      console.error('[software] createItem: product_id inválido')
      return { success: false, error: 'El ID del producto es inválido.' }
    }

    const { error } = await adminSupabase
      .from('software_items')
      .insert({
        product_id: productId,
        title: parsed.title,
        item_type: parsed.item_type,
        description: parsed.description,
        cover_image_url: parsed.cover_image_url,
        file_size: parsed.file_size,
        version: parsed.version,
        download_url: parsed.download_url,
        preset_count: parsed.preset_count,
        genre_tag: parsed.genre_tag,
        is_published: true,
      })

    if (error) throw error
    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true }
  } catch (error) {
    console.error('[software] createItem:', error)
    return { success: false, error: 'Error al crear el ítem.' }
  }
}

export async function updateSoftwareItemAction(formData: FormData): Promise<ActionResult> {
  try {
    const adminSupabase = await verifyAdmin()
    const parsed = readItemForm(formData)
    if (!parsed) {
      console.error('[software] updateItem: campos inválidos')
      return { success: false, error: 'Producto, Título y Link de Google Drive son obligatorios y válidos.' }
    }

    const id = toUUID(formData.get('id'))
    if (!id) {
      console.error('[software] updateItem: id inválido')
      return { success: false, error: 'ID del ítem inválido.' }
    }

    const { error } = await adminSupabase
      .from('software_items')
      .update({
        title: parsed.title,
        item_type: parsed.item_type,
        description: parsed.description,
        cover_image_url: parsed.cover_image_url,
        file_size: parsed.file_size,
        version: parsed.version,
        download_url: parsed.download_url,
        preset_count: parsed.preset_count,
        genre_tag: parsed.genre_tag,
      })
      .eq('id', id)

    if (error) throw error
    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true }
  } catch (error) {
    console.error('[software] updateItem:', error)
    return { success: false, error: 'Error al actualizar el ítem.' }
  }
}

export async function deleteSoftwareItemAction(itemId: string): Promise<ActionResult> {
  try {
    const id = toUUID(itemId)
    if (!id) {
      console.error('[software] deleteItem: id inválido')
      return { success: false, error: 'ID del ítem inválido.' }
    }
    const adminSupabase = await verifyAdmin()

    const { error } = await adminSupabase
      .from('software_items')
      .delete()
      .eq('id', id)
    if (error) throw error
    revalidatePath('/admin/software')
    revalidatePath('/software')
    return { success: true }
  } catch (error) {
    console.error('[software] deleteItem:', error)
    return { success: false, error: 'Error al eliminar el ítem.' }
  }
}
