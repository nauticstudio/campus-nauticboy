import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/server/auth/guards'
import { CategoryResourcesClient } from './CategoryResourcesClient'
import type { ResourceItem } from './CategoryResourcesClient'

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

  // Fetch category by slug con todos los campos para pintar banner premium.
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, icon, icon_url, cover_image_url, accent_color, blurb, description')
    .eq('slug', slug)
    .single()

  let resources: ResourceItem[] = []

  if (category) {
    const { data } = await supabase
      .from('resources')
      .select('id, title, description, software, file_name, file_size, is_restricted, is_published')
      .eq('category_id', category.id)
      .order('created_at', { ascending: false })

    resources = (data ?? []) as ResourceItem[]
  }

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
        showAdminUI={isAdmin}
      />
    )
  }

  return (
    <CategoryResourcesClient
      slug={slug}
      initialResources={resources}
      isAdmin={isAdmin}
      softwareSlot={softwareSlot}
      categoryMeta={category ? {
        name: category.name,
        icon: category.icon,
        icon_url: category.icon_url,
        cover_image_url: category.cover_image_url,
        accent_color: category.accent_color ?? 'coral',
        blurb: category.blurb,
        description: category.description,
      } : undefined}
    />
  )
}
