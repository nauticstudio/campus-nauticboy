import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/server/auth/guards'
import { CategoryResourcesClient } from './CategoryResourcesClient'
import type { ResourceItem } from './CategoryResourcesClient'

export default async function CategoryResourcesPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params

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

  return (
    <CategoryResourcesClient
      slug={slug}
      initialResources={resources}
      isAdmin={isAdmin}
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
