import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/server/auth/guards'
import { CategoryResourcesClient } from './CategoryResourcesClient'
import type { ResourceItem } from './CategoryResourcesClient'
import type { CollectionCardData } from '@/components/campus/CollectionCard'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CategoryResourcesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ manufacturer?: string }>
}) {
  const { slug } = await params
  const selectedManufacturer = (await searchParams)?.manufacturer

  // Punto único de control: toda página del campus exige sesión.
  // El rol se obtiene del guard (misma llamada que el layout gracias a React.cache).
  const { profile } = await requireUser()
  const supabase = await createClient()
  const isAdmin = profile?.role === 'admin'

  const { getAdminViewMode } = await import('@/app/actions/view-mode')
  let currentViewMode = await getAdminViewMode()
  if (isAdmin && !currentViewMode) currentViewMode = 'admin'
  if (!isAdmin) currentViewMode = 'student'
  const showAdminUI = isAdmin && currentViewMode === 'admin'

  // Fetch category by slug con todos los campos para pintar banner premium.
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, icon, icon_url, cover_image_url, accent_color, blurb, description')
    .eq('slug', slug)
    .single()

  if (!category) {
    notFound()
  }

  // Fetch resources y sub-colecciones en paralelo
  const [resourcesRes, collectionsRes] = await Promise.all([
    supabase
      .from('resources')
      .select('id, title, description, software, file_name, file_size, is_restricted, is_published, thumbnail_url, version, tags, storage_path, storage_provider, collection_id')
      .eq('category_id', category.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('resource_collections')
      .select('id, name, slug, description, thumbnail_url, sort_order, is_published')
      .eq('category_id', category.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
  ])

  const rawResources = (resourcesRes.data ?? []) as (ResourceItem & { collection_id?: string | null })[]

  // Conteo de recursos por colección
  const countsByCollection: Record<string, number> = {}
  for (const r of rawResources) {
    if (r.collection_id) {
      countsByCollection[r.collection_id] = (countsByCollection[r.collection_id] || 0) + 1
    }
  }

  const collections: CollectionCardData[] = ((collectionsRes.data ?? []) as any[]).map((col) => ({
    id: col.id,
    name: col.name,
    slug: col.slug,
    description: col.description,
    thumbnail_url: col.thumbnail_url,
    is_published: col.is_published,
    count: countsByCollection[col.id] || 0,
  }))

  const isPlugins = slug === 'plugins'

  // La categoría Plugins embebe el catálogo completo del hub de software
  // (fabricantes + productos con sus modales inline de creación en modo admin).
  let softwareSlot: React.ReactNode
  if (isPlugins) {
    const { getSoftwareHubData } = await import('@/lib/data/software')
    const { SoftwareCatalog } = await import('@/components/software/SoftwareCatalog')
    const hub = await getSoftwareHubData()
    softwareSlot = (
      <SoftwareCatalog
        featuredProducts={hub.featuredProducts}
        allProducts={hub.allProducts}
        manufacturers={hub.manufacturers}
        selectedManufacturer={selectedManufacturer}
        showAdminUI={showAdminUI}
      />
    )
  }

  return (
    <CategoryResourcesClient
      slug={slug}
      initialResources={rawResources}
      isAdmin={showAdminUI}
      softwareSlot={softwareSlot}
      collections={collections}
      categoryMeta={{
        id: category.id,
        slug: slug,
        name: category.name,
        icon: category.icon,
        icon_url: category.icon_url,
        cover_image_url: category.cover_image_url,
        accent_color: category.accent_color ?? 'coral',
        blurb: category.blurb,
        description: category.description,
      }}
    />
  )
}
