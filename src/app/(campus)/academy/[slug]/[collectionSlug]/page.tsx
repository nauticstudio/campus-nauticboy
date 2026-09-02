import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/server/auth/guards'
import { CategoryResourcesClient } from '../CategoryResourcesClient'
import type { ResourceItem } from '../CategoryResourcesClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string; collectionSlug: string }>
}) {
  const { slug, collectionSlug } = await params

  const { profile } = await requireUser()
  const supabase = await createClient()
  const isAdmin = profile?.role === 'admin'

  const { getAdminViewMode } = await import('@/app/actions/view-mode')
  let currentViewMode = await getAdminViewMode()
  if (isAdmin && !currentViewMode) currentViewMode = 'admin'
  if (!isAdmin) currentViewMode = 'student'
  const showAdminUI = isAdmin && currentViewMode === 'admin'

  // 1. Fetch de la categoría padre
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, icon, icon_url, cover_image_url, accent_color, blurb, description')
    .eq('slug', slug)
    .single()

  if (!category) {
    notFound()
  }

  // 2. Fetch de la colección específica
  const { data: collection } = await supabase
    .from('resource_collections')
    .select('id, name, slug, description, thumbnail_url, is_published')
    .eq('category_id', category.id)
    .eq('slug', collectionSlug)
    .single()

  if (!collection) {
    notFound()
  }

  // 3. Fetch de los recursos pertenecientes a esta colección
  const { data: resourcesData } = await supabase
    .from('resources')
    .select('id, title, description, software, file_name, file_size, is_restricted, is_published, thumbnail_url, version, tags, storage_path, storage_provider, collection_id')
    .eq('category_id', category.id)
    .eq('collection_id', collection.id)
    .order('created_at', { ascending: false })

  const resources = (resourcesData ?? []) as ResourceItem[]

  return (
    <CategoryResourcesClient
      slug={slug}
      initialResources={resources}
      isAdmin={showAdminUI}
      collectionMeta={{
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        thumbnail_url: collection.thumbnail_url,
        is_published: collection.is_published,
      }}
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
