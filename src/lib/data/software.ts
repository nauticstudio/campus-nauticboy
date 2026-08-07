import { createAdminClient } from '@/lib/supabase/server'

export type SoftwareManufacturer = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  description: string | null
}

export type SoftwareCategory = {
  id: string
  name: string
  slug: string
  icon: string | null
}

export type SoftwareProduct = {
  id: string
  manufacturer_id: string
  name: string
  slug: string
  tagline: string | null
  description: string | null
  cover_image_url: string | null
  logo_image_url: string | null
  version: string | null
  compatibility: string | null
  formats: string[]
  is_featured: boolean
  manufacturer?: SoftwareManufacturer
  categories?: SoftwareCategory[]
}

export type SoftwareItem = {
  id: string
  product_id: string
  title: string
  item_type: 'installer_win' | 'installer_mac' | 'factory_content' | 'expansion' | 'skin' | 'presets' | 'update' | 'plugin_device'
  description: string | null
  cover_image_url: string | null
  file_size: string | null
  version: string | null
  download_url: string
  preset_count: number
  genre_tag: string | null
  sort_order: number
}

// Fetch all hub data
export async function getSoftwareHubData() {
  const supabase = await createAdminClient()

  // Featured Products
  const { data: featuredProducts } = await supabase
    .from('software_products')
    .select('*, manufacturer:software_manufacturers(*)')
    .eq('is_featured', true)
    .eq('is_published', true)

  // All Products
  const { data: allProducts } = await supabase
    .from('software_products')
    .select('*, manufacturer:software_manufacturers(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Manufacturers
  const { data: manufacturers } = await supabase
    .from('software_manufacturers')
    .select('*')
    .order('name', { ascending: true })

  // Categories
  const { data: categories } = await supabase
    .from('software_categories')
    .select('*')

  return {
    featuredProducts: (featuredProducts || []) as SoftwareProduct[],
    allProducts: (allProducts || []) as SoftwareProduct[],
    manufacturers: (manufacturers || []) as SoftwareManufacturer[],
    categories: (categories || []) as SoftwareCategory[]
  }
}

// Fetch single product ecosystem by slugs
export async function getProductEcosystem(manufacturerSlug: string, productSlug: string) {
  const supabase = await createAdminClient()

  // Get Manufacturer
  const { data: manufacturer } = await supabase
    .from('software_manufacturers')
    .select('*')
    .eq('slug', manufacturerSlug)
    .single()

  if (!manufacturer) return null

  // Get Product
  const { data: product } = await supabase
    .from('software_products')
    .select('*')
    .eq('manufacturer_id', manufacturer.id)
    .eq('slug', productSlug)
    .eq('is_published', true)
    .single()

  if (!product) return null

  // Get Product Items (Ecosystem: Installers, Factory, Expansions)
  const { data: items } = await supabase
    .from('software_items')
    .select('*')
    .eq('product_id', product.id)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  const typedItems = (items || []) as SoftwareItem[]

  // Group items for easy rendering
  const installersWin = typedItems.filter(i => i.item_type === 'installer_win')
  const installersMac = typedItems.filter(i => i.item_type === 'installer_mac')
  const factoryContent = typedItems.filter(i => i.item_type === 'factory_content')
  const expansions = typedItems.filter(i => i.item_type === 'expansion')
  const skins = typedItems.filter(i => i.item_type === 'skin')
  const presets = typedItems.filter(i => i.item_type === 'presets')
  const pluginDevices = typedItems.filter(i => i.item_type === 'plugin_device')

  return {
    manufacturer: manufacturer as SoftwareManufacturer,
    product: product as SoftwareProduct,
    items: typedItems,
    grouped: {
      installersWin,
      installersMac,
      factoryContent,
      expansions,
      skins,
      presets,
      pluginDevices
    }
  }
}
