import { createClient } from '@/lib/supabase/server'
import { CategoryResourcesClient } from './CategoryResourcesClient'

export default async function CategoryResourcesPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Get user profile role
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase.from('profiles').select('role').eq('id', user.id).single() : { data: null }
  const isAdmin = profile?.role === 'admin'

  // Fetch category by slug to get its ID
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single()

  let resources: any[] = []

  if (category) {
    const { data } = await supabase
      .from('resources')
      .select('id, title, description, software, file_name, file_size, is_restricted, is_published')
      .eq('category_id', category.id)
      .order('created_at', { ascending: false })
    
    resources = data || []
  }

  return (
    <CategoryResourcesClient 
      slug={slug} 
      initialResources={resources} 
      isAdmin={isAdmin} 
    />
  )
}
